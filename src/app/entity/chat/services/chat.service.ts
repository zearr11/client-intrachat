import { computed, inject, Injectable, signal } from '@angular/core';
import { IMessage, RxStomp, RxStompState } from '@stomp/rx-stomp';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AuthService } from '../../../views/auth/services/auth.service';
import { ChatRequest, ChatResponse } from '../interfaces/chat.interface';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private authService = inject(AuthService);

  private rxStomp = new RxStomp();
  public estadoConexion$ = new BehaviorSubject<RxStompState | null>(null);
  messageReceived = signal<ChatResponse | null>(null);

  accessToken = computed(() => this.authService.accessToken());

  connect() {
    if (!this.accessToken()) return;

    this.rxStomp.configure({
      brokerURL: 'ws://localhost:9890/ws',
      connectHeaders: {
        Authorization: `Bearer ${this.accessToken()}`,
      },
      // reconexión automática
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });
    this.rxStomp.activate();
    this.rxStomp.connectionState$.subscribe((s) =>
      this.estadoConexion$.next(s)
    );
  }

  disconnect() {
    this.rxStomp.deactivate();
  }

  private processIncomingMessage(raw: IMessage): ChatResponse {
    return JSON.parse(raw.body) as ChatResponse;
  }

  private pushMessage(msg: ChatResponse) {
    this.messageReceived.set(msg);
  }

  subscribeToGroup(roomId: number, cb: (m: ChatResponse) => void) {
    return this.rxStomp
      .watch(`/topic/group.${roomId}`)
      .pipe(
        map((msg) => this.processIncomingMessage(msg)),
        tap((parsed) => this.pushMessage(parsed))
      )
      .subscribe(cb);
  }

  subscribeToPrivate(cb: (m: ChatResponse) => void) {
    return this.rxStomp
      .watch(`/user/queue/messages`)
      .pipe(
        map((msg) => this.processIncomingMessage(msg)),
        tap((parsed) => this.pushMessage(parsed))
      )
      .subscribe(cb);
  }

  sendMessage(dataMessage: ChatRequest) {
    this.rxStomp.publish({
      destination: '/app/chat/send',
      body: JSON.stringify(dataMessage),
    });
  }
}
