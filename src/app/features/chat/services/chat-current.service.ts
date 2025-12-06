import { inject, Injectable, signal } from '@angular/core';
import { MessageResponse } from '../interfaces/message.interface';
import { UserResponse } from '../../../core/interfaces/user.interface';
import { TypeRoom } from '../../../core/enums/type-room.enum';
import { RoomService } from './room.service';
import { GroupService } from './group.service';
import { MessageService } from './message.service';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { OptionsPaginatedMessage } from '../../../shared/interfaces/options-paginated.interface';
import { TypeMessage } from '../../../core/enums/type-message.enum';
import { firstValueFrom } from 'rxjs';
import { PaginatedResponse } from '../../../shared/interfaces/paginated-response.interface';
import { UserService } from '../../../core/services/user.service';
import { ChatService } from './chat.service';
import { RoomResponse } from '../interfaces/room.interface';
import { GroupResponse } from '../interfaces/group.interface';
import { ChatRequest } from '../interfaces/chat.interface';

@Injectable({ providedIn: 'root' })
export class ChatCurrentService {
  private roomService = inject(RoomService);
  private groupService = inject(GroupService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private chatService = inject(ChatService);
  private toastService = inject(ToastMessageService);

  // Retornar datos de entidad sala
  async getRoomEntity(
    typeChat: TypeRoom,
    idGeneric: number
  ): Promise<RoomResponse | null> {
    if (!idGeneric || !typeChat) return null;

    if (typeChat === TypeRoom.PRIVADO)
      return await firstValueFrom(this.roomService.getRoomByMembers(idGeneric));
    else if (typeChat === TypeRoom.GRUPO)
      return await firstValueFrom(this.roomService.getRoomById(idGeneric));

    return null;
  }

  // Retornar datos de entidad usuario de destino (SOLO EN CHATS PRIVADOS)
  async getUserReceiver(
    typeChat: TypeRoom,
    idGeneric: number
  ): Promise<UserResponse | null> {
    if (!idGeneric || !typeChat) return null;

    if (typeChat === TypeRoom.PRIVADO)
      return await firstValueFrom(this.userService.getUserById(idGeneric));

    return null;
  }

  // Retornar datos de entidad grupo (SOLO EN CHATS GRUPALES)
  async setGroupEntity(
    typeChat: TypeRoom,
    idGeneric: number
  ): Promise<GroupResponse | null> {
    if (!idGeneric || !typeChat) return null;

    if (typeChat === TypeRoom.GRUPO)
      return await firstValueFrom(this.groupService.getGroupByRoom(idGeneric));

    return null;
  }

  // Retornar mensajes paginado
  async setMessagesPaginated(
    idRoom: number,
    optionsMessages: OptionsPaginatedMessage
  ): Promise<PaginatedResponse<MessageResponse>> {
    return await firstValueFrom(
      this.messageService.getMessagesRoom(idRoom, optionsMessages)
    );
  }

  sendMessage(options: {
    idRoom?: number;
    idUserReceiver?: number;
    typeRoom: TypeRoom;
    txtText?: string;
    file?: File;
  }) {
    const request: ChatRequest = {
      idSala: options.idRoom,
      idUsuarioDestino: options.idUserReceiver,
      tipoSala: options.typeRoom,
    };

    if (options.txtText) this.sendNewTextMessage(request, options.txtText);
    if (options.file) this.sendNewFileMessage(request, options.file);
  }

  // Enviar texto
  private sendNewTextMessage(request: ChatRequest, txtText: string) {
    request.tipoMensaje = TypeMessage.MSG_TEXTO;
    request.texto = txtText;

    this.chatService.sendMessage(request);
  }

  // Enviar archivo
  private sendNewFileMessage(request: ChatRequest, file: File) {
    let typeMessage;

    if (file.type.startsWith('image/')) {
      typeMessage = TypeMessage.MSG_IMAGEN;
    } else {
      typeMessage = TypeMessage.MSG_ARCHIVO;
    }

    request.tipoMensaje = typeMessage;

    this.messageService.sendMessageFile(file, request).subscribe({
      next: (resp) => {
        const initialMsg =
          typeMessage != TypeMessage.MSG_IMAGEN ? 'El archivo' : 'La imagen';
        this.toastService.show(
          `${initialMsg} fue enviado correctamente.`,
          'text-bg-success'
        );
      },
      error: (err) => {
        this.toastService.show(err.message, 'text-bg-danger');
      },
    });
  }
}

// Agregar mensajes nuevos enviados o recibidos al estar dentro del chat
// effectNewMessages = effect(() => {
//   const newMessages = this.chatService.newMessages();

//   if (newMessages.length > 0) {
//     // Obtener ultimo mensaje
//     const messageEntity: ChatResponse = newMessages[newMessages.length - 1];
//     // Parsear de ChatResponse a MessageResponse
//     const newMessage: MessageResponse =
//       MessageMapper.messageResponse(messageEntity);

//     // Si el mensaje corresponde a la sala actual entonces se carga
//     const typeRoom = messageEntity.tipoSala;
//     const idMessage = messageEntity.idMensaje;
//     const idRoom = messageEntity.idSala;
//     const idUserDinamic = messageEntity.usuarioDestino?.id;

//     if (!this.userReceiver() && !this.groupEntity()) return;
//     if (this.userService.dataUser()?.id == messageEntity.usuarioDestino?.id)
//       return;
//     if (this.roomEntity() && typeRoom != this.roomEntity()?.tipoSala) return;

//     // if (messageEntity.tipoSala == TypeRoom.PRIVADO) {
//     //   // El chat esta abierto para mi
//     //   if (this.userReceiver()) {
//     //     idUserDinamic = this.userReceiver()?.id;
//     //   } else { // El chat no esta abierto para mi
//     //     idUserDinamic = messageEntity.usuarioRemitente.id;
//     //   }
//     // }

//     console.log('----------------------');
//     console.log(idMessage);
//     console.log('USUARIO: ' + idUserDinamic);
//     console.log('SALA: ' + idRoom);
//     console.log(typeRoom);

//     console.log('----------------------');

//     if (idUserDinamic && typeRoom == TypeRoom.PRIVADO) {
//       console.log('SE EJECUTA PRIVADO');

//       this.messageService
//         .messageIsFromChatPrivate(idMessage, idUserDinamic)
//         .subscribe((isFromThisChat) => {
//           if (isFromThisChat) {
//             this.dataMessages.update((prev) => {
//               const merged = [...prev, newMessage];

//               const unique = merged.filter(
//                 (msg, index, arr) =>
//                   arr.findIndex((m) => m.idMensaje === msg.idMensaje) ===
//                   index
//               );

//               return unique;
//             });
//           }
//         });
//     } else if (idRoom && typeRoom == TypeRoom.GRUPO && !this.userReceiver()) {
//       console.log('SE EJECUTA GRUPO');
//       this.messageService
//         .messageIsFromChatGroup(idMessage, idRoom)
//         .subscribe((isFromThisChat) => {
//           if (isFromThisChat) {
//             this.dataMessages.update((prev) => {
//               const merged = [...prev, newMessage];

//               const unique = merged.filter(
//                 (msg, index, arr) =>
//                   arr.findIndex((m) => m.idMensaje === msg.idMensaje) ===
//                   index
//               );

//               return unique;
//             });
//           }
//         });
//     }
//     this.chatService.newMessages.set([]);
//   }
// });

// private groupService = inject(GroupService);
// private userService = inject(UserService);

// groupEntityResource = (idRoom?: number) =>
//   rxResource({
//     request: () => ({
//       idRoom,
//     }),
//     loader: ({ request }) => {
//       if (!request.idRoom) return of(null);
//       return this.groupService.getGroupByRoom(request.idRoom);
//     },
//   });

// userReceiverEntityResource = (idUser?: number, typeRoom?: TypeRoom) =>
//   rxResource({
//     request: () => ({
//       idUser,
//       typeRoom,
//     }),
//     loader: ({ request }) => {
//       if (!request.idUser && !request.typeRoom) return of(null);

//       if (request.typeRoom == TypeRoom.PRIVADO)
//         return this.userService.getUserById(request.idUser!);

//       return of(null);
//     },
//   });

// roomEntityResource = rxResource({
//   request: () => ({
//     type: this.typeChat(),
//     id: this.id(),
//   }),
//   loader: ({ request }) => {
//     if (!request.id) return of(null);

//     if (request.type === TypeRoom.PRIVADO) {
//       return this.roomService.getRoomByMembers(request.id);
//     }

//     if (request.type === TypeRoom.GRUPO) {
//       return this.roomService.getRoomById(request.id);
//     }

//     return of(null);
//   },
// });

// Params del URL
// typeChat = signal<TypeRoom | null>(null);
// id = signal<number | null>(null);
// this.typeChat.set(params.get('type-chat')!.toUpperCase() as TypeRoom);
// this.id.set(Number(params.get('id')));
// this.chatService.newMessages.set([]);

/*
  onScroll() {
    // const scrollDiv = this.scrollContainer()?.nativeElement;
    // if (!scrollDiv) return;

    // const scrollCurrent = scrollDiv.scrollTop;

    // // Valor cercano al top
    // const isAtTop = scrollCurrent <= 100;

    // if (isAtTop) {
    //   // TODO: load pages
    //   const currentPage = this.optionsMessages().page;

    //   if (currentPage! < this.pageMax())
    //     this.optionsMessages.update((prev) => ({
    //       ...prev,
    //       page: prev.page! + 1,
    //     }));
    // }


  }



  effectMessagesResource = effect(() => {
    const resp = this.httpMessagesPaginated.value();
    if (!resp) return;

    const currentPage = this.optionsMessages().page;

    // SOLO agregar mensajes si son de la página correspondiente
    // evita que se repita page=1 en cada render
    if (currentPage === 1 && this.dataMessages().length > 0) {
      return; // evita duplicado al entrar al chat
    }

    const divScroll = this.scrollContainer()?.nativeElement;
    const prevHeight = divScroll?.scrollHeight ?? 0;

    this.dataMessages.update((prev) => [...resp.result, ...prev]);
    this.pageMax.set(resp.totalPages);

    if (divScroll) {
      this.maintainScrollPosition(prevHeight);
    }
  });

  effectNewMessages = effect(() => {
    const newMessages = this.chatService.newMessages();

    if (newMessages.length > 0) {
      const messageEntity: ChatResponse = newMessages[newMessages.length - 1];
      const newMessage: MessageResponse =
        MessageMapper.messageResponse(messageEntity);
      console.log('Chat: ', newMessages[newMessages.length - 1]);
      // if (newMessage.ada)

      if (messageEntity.idSala == this.roomEntity()?.id) {
        this.dataMessages.update((prev) => [newMessage, ...prev]);
      }
    }
  });



*/

/*

setMessagesPaginated() {
    if (this.loadingPage()) return;
    this.loadingPage.set(true);

    const room = this.roomEntity();
    if (!room) return;
    this.messageService
      .getMessagesRoom(room.id, this.optionsMessages()!)
      .subscribe((data) => {
        this.dataMessages.update((prev) => [...data.result.reverse(), ...prev]);
        this.pageMessageMax.set(data.totalPages);
        console.log(data);
        this.loadingPage.set(false);
      });
  }

*/

/*
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
    console.log('Room: ', room);
    this.roomEntity.set(room!);
  });

  // Busqueda de grupo dinamicamente
  // Asignacion de Grupo a signal
  syncGroupEntity = effect(() => {
    const group = this.groupEntityResource.value();
    this.groupEntity.set(group!);
  });
  // Busqueda de usuario de destino dinamicamente
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
      if (!request.idRoom) return of(null);
      return this.messageService.getMessagesRoom(
        request.idRoom,
        request.options
      );
    },
  });
*/

/*
  public
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

/*
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    // Valor maximo que puede tener el scrollCurrent (APROXIMADO)
    const scrollMax = scrollHeight - clientHeight;
    */
