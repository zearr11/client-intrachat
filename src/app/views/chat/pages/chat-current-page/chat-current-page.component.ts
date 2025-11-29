import { Component, computed, inject, signal } from '@angular/core';
import { ChatInputMessageComponent } from '../../components/chat-input-message/chat-input-message.component';
import { ChatMessageComponent } from '../../components/chat-message/chat-message.component';
import { ActivatedRoute } from '@angular/router';
import { TypeRoom } from '../../../../entity/room/enums/type-room.enum';
import { RoomService } from '../../../../entity/room/services/room.service';
import { effect } from '@angular/core';
import { RoomResponse } from '../../../../entity/room/interfaces/room.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { MessageResponse } from '../../../../entity/message/interfaces/message.interface';
import { MessageService } from '../../../../entity/message/services/message.service';
import { OptionsPaginatedMessage } from '../../../../shared/interfaces/options-paginated.interface';
import { of, tap } from 'rxjs';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import { UserService } from '../../../../entity/user/services/user.service';
import { GroupResponse } from '../../../../entity/group/interfaces/group.interface';
import { GroupService } from '../../../../entity/group/services/group.service';

@Component({
  selector: 'chat-current-page',
  imports: [ChatInputMessageComponent, ChatMessageComponent],
  templateUrl: './chat-current-page.component.html',
})
export class ChatCurrentPageComponent {
  private route = inject(ActivatedRoute);
  private groupService = inject(GroupService);
  private roomService = inject(RoomService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  // Params de url
  typeChat = signal<TypeRoom | null>(null);
  id = signal<number | null>(null);

  // Datos de sala
  roomEntity = signal<RoomResponse | null>(null);
  // Datos de grupo (Opcional)
  groupEntity = signal<GroupResponse | null>(null);
  // Datos de usuario de destino (Opcional)
  userReceiver = signal<UserResponse | null>(null);

  // Encabezado de chat
  headerChat = computed(() => {
    if (this.userReceiver()) {
      return {
        img: this.userReceiver()!.urlFoto,
        name:
          this.userReceiver()!.nombres + ' ' + this.userReceiver()!.apellidos,
      };
    }

    if (this.groupEntity()) {
      return {
        img: this.groupEntity()!.urlFoto,
        name: this.groupEntity()!.nombre,
      };
    }

    return null;
  });

  // Mensajes de sala
  dataMessages = signal<MessageResponse[] | null>(null);

  // Opciones para la paginacion de mensajes
  optionsMessages = signal<OptionsPaginatedMessage>({});

  // Busqueda de sala dinamicamente
  roomEntityResource = rxResource({
    request: () => ({
      type: this.typeChat(),
      id: this.id(),
    }),
    loader: ({ request }) => {
      if (!request.id) return of(null);

      if (request.type === TypeRoom.PRIVADO) {
        return this.roomService.getRoomByMembers(request.id);
      }

      if (request.type === TypeRoom.GRUPO) {
        return this.roomService.getRoomById(request.id);
      }

      return of(null);
    },
  });

  // Asignacion de Sala a signal
  syncRoomEntity = effect(() => {
    const room = this.roomEntityResource.value();
    this.roomEntity.set(room!);
  });

  // Busqueda de grupo dinamicamente
  groupEntityResource = rxResource({
    request: () => ({
      idRoom: this.roomEntity()?.id,
    }),
    loader: ({ request }) => {
      if (!request.idRoom) return of(null);
      return this.groupService.getGroupByRoom(request.idRoom);
    },
  });

  // Asignacion de Grupo a signal
  syncGroupEntity = effect(() => {
    const group = this.groupEntityResource.value();
    this.groupEntity.set(group!);
  });

  // Busqueda de usuario de destino dinamicamente
  userReceiverEntityResource = rxResource({
    request: () => ({
      idUser: this.id(),
      typeRoom: this.typeChat(),
    }),
    loader: ({ request }) => {
      if (!request.idUser && !request.typeRoom) return of(null);

      if (request.typeRoom == TypeRoom.PRIVADO)
        return this.userService.getUserById(request.idUser!);

      return of(null);
    },
  });

  // Asignacion de Usuario de destino a signal
  syncUserReceiverEntity = effect(() => {
    const userReceiver = this.userReceiverEntityResource.value();
    this.userReceiver.set(userReceiver!);
  });

  // Busqueda de mensajes de la sala
  httpMessagesPaginated = rxResource({
    request: () => ({
      idRoom: this.roomEntity()?.id,
      options: this.optionsMessages(),
    }),
    loader: ({ request }) => {
      if (!request.idRoom) {
        const resultDefault = {
          page: request.options?.page ?? 1,
          size: request.options?.size ?? 10,
          itemsOnPage: 0,
          count: 0,
          totalPages: 0,
          result: [],
        };
        this.dataMessages.set(resultDefault.result);
        return of(resultDefault);
      }

      return this.messageService
        .getMessagesRoom(request.idRoom, request.options)
        .pipe(
          tap((resp) => {
            // console.log(resp.result);
            this.dataMessages.set(resp.result);
          })
        );
    },
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.typeChat.set(params.get('type-chat')!.toUpperCase() as TypeRoom);
      this.id.set(Number(params.get('id')));
      console.log(this.typeChat(), this.id());
    });
  }
}

/*
  public scrollContainer? = viewChild<ElementRef | null>('scrollContainer');
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (!this.scrollContainer) return;

    const el = this.scrollContainer()?.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
*/
