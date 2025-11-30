import { inject, Injectable } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { GroupService } from '../../../entity/group/services/group.service';
import { UserService } from '../../../entity/user/services/user.service';
import { TypeRoom } from '../../../entity/room/enums/type-room.enum';

@Injectable({ providedIn: 'root' })
export class ChatCurrentService {
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
      return; // 👈 evita duplicado al entrar al chat
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

}
