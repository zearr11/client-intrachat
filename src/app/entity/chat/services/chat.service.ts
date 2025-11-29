import { computed, inject, Injectable, signal } from '@angular/core';
import { RxStomp, RxStompState } from '@stomp/rx-stomp';
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from '../../../views/auth/services/auth.service';
import { ChatRequest, ChatResponse } from '../interfaces/chat.interface';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private authService = inject(AuthService);

  private rxStomp = new RxStomp();
  public estadoConexion$ = new BehaviorSubject<RxStompState | null>(null);

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

  subscribeToGroup(roomId: number, cb: (dataMessage: ChatResponse) => void) {
    return this.rxStomp
      .watch(`/topic/group.${roomId}`)
      .pipe(map((msg) => JSON.parse(msg.body) as ChatResponse))
      .subscribe(cb);
  }

  subscribeToPrivate(cb: (dataMessage: ChatResponse) => void) {
    return this.rxStomp
      .watch(`/user/queue/messages`)
      .pipe(map((msg) => JSON.parse(msg.body) as ChatResponse))
      .subscribe(cb);
  }

  sendMessage(dataMessage: ChatRequest) {
    this.rxStomp.publish({
      destination: '/app/chat/send',
      body: JSON.stringify(dataMessage),
    });
  }
}
