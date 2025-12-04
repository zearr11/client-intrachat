import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ChatInputMessageComponent } from '../../components/chat-input-message/chat-input-message.component';
import { ChatMessageComponent } from '../../components/chat-message/chat-message.component';
import { TypeRoom } from '../../../../entity/room/enums/type-room.enum';
import { ChatCurrentService } from '../../services/chat-current.service';
import { OptionsPaginatedMessage } from '../../../../shared/interfaces/options-paginated.interface';
import { MessageResponse } from '../../../../entity/message/interfaces/message.interface';
import { RoomResponse } from '../../../../entity/room/interfaces/room.interface';
import { GroupResponse } from '../../../../entity/group/interfaces/group.interface';
import { UserResponse } from '../../../../entity/user/interfaces/user.interface';
import { ChatResponse } from '../../../../entity/chat/interfaces/chat.interface';
import { ChatService } from '../../../../entity/chat/services/chat.service';
import { MessageService } from '../../../../entity/message/services/message.service';
import { MessageMapper } from '../../utils/message.mapper';
import { UserService } from '../../../../entity/user/services/user.service';
import { UserInfoComponent } from '../../modals/user-info/user-info.component';
import { GroupInfoComponent } from '../../modals/group-info/group-info.component';
import { FormsModule } from '@angular/forms';
import { ManagementAccountComponent } from '../../modals/management-account/management-account.component';

interface HeaderBase {
  img: string;
  name: string;
}

@Component({
  selector: 'chat-current-page',
  imports: [
    ChatInputMessageComponent,
    ChatMessageComponent,
    UserInfoComponent,
    GroupInfoComponent,
    FormsModule,
    ManagementAccountComponent,
  ],
  templateUrl: './chat-current-page.component.html',
})
export class ChatCurrentPageComponent {
  chatCurrentService = inject(ChatCurrentService);
  chatService = inject(ChatService);
  messageService = inject(MessageService);
  userService = inject(UserService);

  // Valores recibidos del padre (NO USAR DIRECTAMENTE | USAR CON PRECAUCION)
  typeChat = input.required<TypeRoom>(); // SIEMPRE SE RECIBE
  idUserReceiver = input<number>(); // SE RECIBE OPCIONALMENTE
  idRoom = input<number>(); // SE RECIBE OPCIONALMENTE

  // Entidades del chat
  roomEntity = signal<RoomResponse | null>(null); // Datos de sala : Opcional
  groupEntity = signal<GroupResponse | null>(null); // Datos de grupo : Opcional
  userReceiver = signal<UserResponse | null>(null); // Datos de usuario de destino : Opcional

  // Propiedades clave del componente
  headerChat = signal<HeaderBase>({ img: '', name: '' }); // Cabecera
  dataMessages = signal<MessageResponse[]>([]); // Arreglo de mensajes
  optionsMessages = signal<OptionsPaginatedMessage | null>(null); // Opciones de paginado de mensajes
  pageMessageMax = signal<number>(0);
  resetTxt = signal<boolean>(false); // Cambiar valor para restablecer input message

  // Referencias del template
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  // Validacion de carga, true = Cargando nuevos mensajes, false = Sin carga pendiente
  loadingPage = signal<boolean>(false);
  loadingComponent = signal<boolean>(false);

  async ngOnChanges() {
    this.loadingComponent.set(false);
    this.resetTxt.update((v) => !v);
    await this.initComponent();
  }

  async initComponent() {
    const idGeneric = this.idUserReceiver() || this.idRoom();

    this.roomEntity.set(
      await this.chatCurrentService.getRoomEntity(this.typeChat(), idGeneric!)
    );
    this.groupEntity.set(
      await this.chatCurrentService.setGroupEntity(this.typeChat(), idGeneric!)
    );
    this.userReceiver.set(
      await this.chatCurrentService.getUserReceiver(this.typeChat(), idGeneric!)
    );

    this.optionsMessages.set({ page: 1, size: 15 });

    if (this.dataMessages().length > 0) this.dataMessages.set([]);

    await this.getMessagesPaginated();
    this.loadingComponent.set(true);

    // console.log('----------------------');
    // console.log(this.roomEntity());
    // console.log(this.groupEntity());
    // console.log(this.userReceiver());
    // console.log(this.dataMessages());
    // console.log('----------------------');
  }

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

  // Obtener nuevos mensajes al hacer scroll hacia arriba
  onScroll() {
    const divScroll = this.scrollContainer()?.nativeElement;
    if (!divScroll) return;

    const scrollCurrent = divScroll.scrollTop;

    if (scrollCurrent < 220) {
      const currentPage = this.optionsMessages()?.page;

      if (currentPage! < this.pageMessageMax()) {
        if (this.loadingPage()) return;

        this.optionsMessages.update((prev) => ({
          ...prev,
          page: prev!.page! + 1,
        }));

        this.getMessagesPaginated();
      }
    }
  }

  // Establecer primeros 15 mensajes de chat
  async getMessagesPaginated() {
    if (this.loadingPage() || !this.roomEntity()) return;
    this.loadingPage.set(true);
    const data = await this.chatCurrentService.setMessagesPaginated(
      this.roomEntity()!.id,
      this.optionsMessages()!
    );
    this.dataMessages.update((prev) => {
      const merged = [...data.result.reverse(), ...prev];
      const unique = merged.filter(
        (msg, index, arr) =>
          arr.findIndex((m) => m.idMensaje === msg.idMensaje) === index
      );
      return unique;
    });
    this.pageMessageMax.set(data.totalPages);
    this.loadingPage.set(false);
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

  sendText(txtText: string) {
    this.chatCurrentService.sendMessage({
      idRoom: this.roomEntity()?.id,
      idUserReceiver: this.userReceiver()?.id,
      typeRoom: this.typeChat(),
      txtText,
    });
  }

  sendFile(file: File) {
    this.chatCurrentService.sendMessage({
      idRoom: this.roomEntity()?.id,
      idUserReceiver: this.userReceiver()?.id,
      typeRoom: this.typeChat(),
      file,
    });
  }

  inProcessToLoadNewMessage = signal<boolean>(false);

  addMessageReceived = effect(() => {
    const messageReceived = this.chatService.messageReceived();
    if (!messageReceived) return;
    if (this.inProcessToLoadNewMessage()) return;
    this.inProcessToLoadNewMessage.set(true);

    this.valiteNewMessage(messageReceived);

    this.chatService.messageReceived.set(null);
    this.inProcessToLoadNewMessage.set(false);
  });

  valiteNewMessage(messageReceived: ChatResponse) {
    const isChatPrivate = this.typeChat() == 'PRIVADO' && this.userReceiver();
    const isChatGroup = this.typeChat() == 'GRUPO' && this.idRoom();
    const withChatsPrevious = this.dataMessages().length > 0;

    if (isChatPrivate && withChatsPrevious) {
      console.log('Es chat privado con chats previos');
      if (messageReceived.idSala != this.roomEntity()?.id) return;
    }
    if (isChatPrivate && !withChatsPrevious)
      console.log('Es chat privado sin chats previos');
    if (isChatGroup && withChatsPrevious) {
      if (messageReceived.idSala != this.roomEntity()?.id) return;
      console.log('Es chat grupal con chats previos');
    }
    if (isChatGroup && !withChatsPrevious)
      console.log('Es chat grupal sin chats previos');

    const newMessage: MessageResponse =
      MessageMapper.messageResponse(messageReceived);

    console.warn('SALA MENSAJE: ' + (messageReceived.idSala ?? 'No hay'));
    console.warn(
      'USUARIO DESTINO: ' + (messageReceived.usuarioDestino?.id ?? 'No hay')
    );
    console.warn('GROUP: ' + (this.groupEntity()?.nombre ?? 'No hay'));
    console.warn('SALA CHAT: ' + (this.roomEntity()?.id ?? 'No hay'));

    if (isChatPrivate) {
      console.log('pasa privado');

      const idUser =
        messageReceived.usuarioDestino!.id == this.userService.dataUser()?.id
          ? messageReceived.usuarioRemitente.id
          : messageReceived.usuarioDestino!.id;
      console.warn('USUARIO FINAL: ' + idUser);

      this.messageService
        .messageIsFromChatPrivate(messageReceived.idMensaje, idUser)
        .subscribe((isFromThisChat) => {
          console.log(isFromThisChat);

          if (isFromThisChat) {
            this.dataMessages.update((prev) => {
              const merged = [...prev, newMessage];

              const unique = merged.filter(
                (msg, index, arr) =>
                  arr.findIndex((m) => m.idMensaje === msg.idMensaje) === index
              );

              return unique;
            });
          }
        });
    } else if (isChatGroup) {
      console.log('pasa grupal');
      this.messageService
        .messageIsFromChatGroup(
          messageReceived.idMensaje,
          messageReceived.idSala
        )
        .subscribe((isFromThisChat) => {
          if (isFromThisChat) {
            this.dataMessages.update((prev) => {
              const merged = [...prev, newMessage];

              const unique = merged.filter(
                (msg, index, arr) =>
                  arr.findIndex((m) => m.idMensaje === msg.idMensaje) === index
              );

              return unique;
            });
          }
        });
    }
  }

  // ----------------------------------------------------------------
  /* MANAGEMENT MODALS */

  userModalInfo = viewChild<UserInfoComponent>('userModalInfo');
  groupModalInfo = viewChild<GroupInfoComponent>('groupModalInfo');

  dataUserInfo = signal<UserResponse | null>(null);
  dataGroupInfo = signal<GroupResponse | null>(null);

  openModalUserInfo() {
    this.dataUserInfo.set(this.userReceiver());
    this.userModalInfo()!.show();
  }

  openModalGroupInfo() {
    this.dataGroupInfo.set(this.groupEntity());
    this.groupModalInfo()!.show();
  }

  ngOnDestroy() {
    this.userModalInfo()!.close();
    this.userModalInfo()!.close();
  }
}

/*

  setMessagesPaginated() {
    if (this.loadingPage() || !this.idRoom()) return;
    this.loadingPage.set(true);
    this.messageService
      .getMessagesRoom(this.idRoom()!, this.optionsMessages()!)
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
        // console.log(data);
        this.loadingPage.set(false);
      });
  }

private route = inject(ActivatedRoute);
  chatCurrentService = inject(ChatCurrentService);


  resetTxt = signal<boolean>(false); // Cambiar valor para restablecer input message



  // Inicializacion de propiedades
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.resetTxt.update((v) => !v);
      this.chatCurrentService.clearEntitiesOpcionals();
      this.optionsMessages.set({ page: 1, size: 15 });
      const typeChat = params.get('type-chat')!.toUpperCase() as TypeRoom;
      const idGeneric = Number(params.get('id'));
      this.chatCurrentService.setRoomEntity(typeChat, idGeneric);
    });
  }

  // Carga de encabezado del chat

*/

/*
effectDebug = effect(() => {
    // const room = this.roomEntity();
    // const userSender = this.userReceiver();
    // const group = this.groupEntity();
    // const messages = this.dataMessages();
    // console.log('---------------------------------------------------------');
    // console.log('Sala: ', room);
    // console.log('User: ', userSender);
    // console.log('Grupo: ', group);
    // console.log('Mensajes: ', messages);
    // console.log('---------------------------------------------------------');
  });
*/
