import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ChatInputMessageComponent } from '../../components/chat-input-message/chat-input-message.component';
import { ChatMessageComponent } from '../../components/chat-message/chat-message.component';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../../entity/group/services/group.service';
import { RoomService } from '../../../../entity/room/services/room.service';
import { UserService } from '../../../../entity/user/services/user.service';
import { MessageService } from '../../../../entity/message/services/message.service';
import { ChatService } from '../../../../entity/chat/services/chat.service';
import { MessageResponse } from '../../../../entity/message/interfaces/message.interface';
import { RoomResponse } from '../../../../entity/room/interfaces/room.interface';
import { TypeRoom } from '../../../../entity/room/enums/type-room.enum';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import {
  ChatRequest,
  ChatResponse,
} from '../../../../entity/chat/interfaces/chat.interface';
import { TypeMessage } from '../../../../entity/message/enums/type-message.enum';
import { OptionsPaginatedMessage } from '../../../../shared/interfaces/options-paginated.interface';
import { GroupResponse } from '../../../../entity/group/interfaces/group.interface';
import { MessageMapper } from '../../utils/message.mapper';

interface HeaderBase {
  img: string;
  name: string;
}

@Component({
  selector: 'chat-current-page',
  imports: [ChatInputMessageComponent, ChatMessageComponent],
  templateUrl: './chat-current-page.component.html',
})
export class ChatCurrentPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  private groupService = inject(GroupService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private chatService = inject(ChatService);

  // Propiedades clave del componente
  headerChat = signal<HeaderBase>({ img: '', name: '' }); // Cabecera
  roomEntity = signal<RoomResponse | null>(null); // Datos de sala : Opcional
  groupEntity = signal<GroupResponse | null>(null); // Datos de grupo : Opcional
  userReceiver = signal<UserResponse | null>(null); // Datos de usuario de destino : Opcional
  resetTxt = signal<boolean>(false); // Cambiar valor para restablecer input message
  dataMessages = signal<MessageResponse[]>([]); // Arreglo de mensajes
  optionsMessages = signal<OptionsPaginatedMessage | null>(null); // Opciones de paginado de mensajes
  pageMessageMax = signal<number>(0);

  // Validacion de carga, true = Cargando nuevos mensajes, false = Sin carga pendiente
  loadingPage = signal<boolean>(false);

  // Referencias del template
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  // Inicializacion de propiedades
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.clearEntitiesOpcionals();
      const typeChat = params.get('type-chat')!.toUpperCase() as TypeRoom;
      const idGeneric = Number(params.get('id'));
      this.setRoomEntity(typeChat, idGeneric);
    });
  }

  // Obtener nuevos mensajes al hacer scroll hacia arriba
  onScroll() {
    const divScroll = this.scrollContainer()?.nativeElement;
    if (!divScroll) return;
    const scrollCurrent = divScroll.scrollTop;

    if (scrollCurrent < 200) {
      const currentPage = this.optionsMessages()?.page;

      if (currentPage! < this.pageMessageMax()) {
        if (this.loadingPage()) return;

        this.optionsMessages.update((prev) => ({
          ...prev,
          page: prev!.page! + 1,
        }));

        this.setMessagesPaginated();
      }
    }
  }

  // Asignar al scroll current el valor mas bajo
  afterFirstLoadMessages = effect(() => {
    const messages = this.dataMessages();

    if (messages.length > 0 && this.optionsMessages()!.page === 1) {
      queueMicrotask(() => {
        const el = this.scrollContainer()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    }
  });

  // Establecer datos de entidad sala
  setRoomEntity(typeChat: TypeRoom, idGeneric: number) {
    if (!idGeneric || !typeChat) return;

    if (typeChat === TypeRoom.PRIVADO) {
      this.setUserReceiver(idGeneric);
      this.roomService.getRoomByMembers(idGeneric).subscribe((room) => {
        this.roomEntity.set(room);
        this.setMessagesPaginated();
      });
    } else if (typeChat === TypeRoom.GRUPO) {
      this.setGroupEntity(idGeneric);
      this.roomService.getRoomById(idGeneric).subscribe((room) => {
        this.roomEntity.set(room);
        this.setMessagesPaginated();
      });
    }
  }

  // Establecer datos de entidad usuario de destino (SOLO EN CHATS PRIVADOS)
  setUserReceiver(idGeneric: number) {
    this.userService.getUserById(idGeneric).subscribe((data) => {
      this.userReceiver.set(data);
    });
  }

  // Establecer datos de entidad grupo (SOLO EN CHATS GRUPALES)
  setGroupEntity(idGeneric: number) {
    this.groupService.getGroupByRoom(idGeneric).subscribe((data) => {
      this.groupEntity.set(data);
    });
  }

  // LIMPIEZA DE PROPIEDADES AL INICIAR COMPONENTE
  clearEntitiesOpcionals() {
    if (this.userReceiver()) {
      this.userReceiver.set(null);
    }
    if (this.groupEntity()) {
      this.groupEntity.set(null);
    }

    this.optionsMessages.set({ page: 1, size: 15 });
    this.resetTxt.update((v) => !v);
    this.dataMessages.set([]);
  }

  // Carga de encabezado del chat
  headerEffect = effect(() => {
    const user = this.userReceiver();
    const group = this.groupEntity();

    if (user) {
      this.headerChat.set({
        img: user.urlFoto,
        name: user.nombres + ' ' + user.apellidos,
      });
    } else if (group) {
      this.headerChat.set({
        img: group.urlFoto,
        name: group.nombre,
      });
    }
  });

  // Establecer primeros 15 mensajes de chat
  setMessagesPaginated() {
    if (this.loadingPage()) return;
    this.loadingPage.set(true);

    const room = this.roomEntity();
    if (!room) return;
    this.messageService
      .getMessagesRoom(room.id, this.optionsMessages()!)
      .subscribe((data) => {
        this.dataMessages.update((prev) => {
          const merged = [...data.result.reverse(), ...prev];

          const unique = merged.filter(
            (msg, index, arr) =>
              arr.findIndex((m) => m.idMensaje === msg.idMensaje) === index
          );

          return unique;
        });
        this.pageMessageMax.set(data.totalPages);
        console.log(data);
        this.loadingPage.set(false);
      });
  }

  // Agregar mensajes nuevos enviados o recibidos al estar dentro del chat
  effectNewMessages = effect(() => {
    const newMessages = this.chatService.newMessages();

    if (newMessages.length > 0) {
      // Obtener ultimo mensaje
      const messageEntity: ChatResponse = newMessages[newMessages.length - 1];
      // Parsear de ChatResponse a MessageResponse
      const newMessage: MessageResponse =
        MessageMapper.messageResponse(messageEntity);

      // Si el mensaje corresponde a la sala actual entonces se carga
      if (messageEntity.idSala == this.roomEntity()?.id) {
        this.dataMessages.update((prev) => [...prev, newMessage]);
      }
    }
  });

  // Enviar mensaje de texto
  sendNewMessage(txtValue: string) {
    let typeRoom = this.roomEntity()?.tipoSala;

    if (this.userReceiver()?.id) typeRoom = TypeRoom.PRIVADO;

    const request: ChatRequest = {
      idSala: this.roomEntity()?.id,
      idUsuarioDestino: this.userReceiver()?.id,
      tipoSala: typeRoom!,
      tipoMensaje: TypeMessage.MSG_TEXTO,
      texto: txtValue,
    };

    if (!request.idSala) {
      this.setRoomEntity(request.tipoSala, request.idUsuarioDestino!);
    }

    this.chatService.sendMessage(request);
  }
}
