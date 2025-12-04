import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { IconMenuComponent } from '../../common/icon-menu/icon-menu.component';
import {
  ChatRecentlyComponent,
  minDataContact,
} from '../../components/chat-recently/chat-recently.component';
import { Router, RouterOutlet } from '@angular/router';
import { ContactService } from '../../../../entity/contact/services/contact.service';
import { ContactResponse } from '../../../../entity/contact/interfaces/contact.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { ToastMessageService } from '../../../../shared/services/toast-message.service';
import { RoomService } from '../../../../entity/room/services/room.service';
import { ChatService } from '../../../../entity/chat/services/chat.service';
import { Subscription } from 'rxjs';
import { ChatResponse } from '../../../../entity/chat/interfaces/chat.interface';
import { UserService } from '../../../../entity/user/services/user.service';
import { FormsModule } from '@angular/forms';
import { ChatCurrentPageComponent } from '../../pages/chat-current-page/chat-current-page.component';
import { ManagementAccountComponent } from '../../modals/management-account/management-account.component';

export type typesIconMenu = 'recently' | 'groups' | 'contacts';

@Component({
  selector: 'main-chat-layout',
  imports: [
    IconMenuComponent,
    ChatRecentlyComponent,
    FormsModule,
    ChatCurrentPageComponent,
    ManagementAccountComponent,
  ],
  templateUrl: './main-chat-layout.component.html',
})
export class MainChatLayoutComponent {
  // Servicios necesarios
  private contactService = inject(ContactService);
  private roomService = inject(RoomService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private chatService = inject(ChatService);
  private toastService = inject(ToastMessageService);
  private router = inject(Router);

  loadUserCurrent = effect(() => {
    if (this.userService.dataUser()) return;

    this.userService.loadDataCurrentUser().subscribe();
  });

  // Variables de interfaz
  iconMenuCurrent = signal<typesIconMenu>('recently');
  txtFilter = viewChild<ElementRef<HTMLInputElement>>('txtFilter');

  titleChatMenu = computed(() => {
    switch (this.iconMenuCurrent()) {
      case 'recently':
        return 'Mensajes recientes';
      case 'groups':
        return 'Grupos de trabajo';
      case 'contacts':
        return 'Contactos de campaña';
    }
  });

  // Contactos : Parte izquierda
  public dataContacts = signal<ContactResponse[]>([]);
  // Ultimo mensaje
  public newMessage = signal<ChatResponse | null>(null);
  // Suscripciones : Grupos y Privado
  private subscriptions = signal<Subscription[]>([]);

  ngOnInit() {
    this.connectInit();
  }

  // Desconexion y limpieza de suscripciones
  ngOnDestroy() {
    this.subscriptions().forEach((s) => s.unsubscribe());
    this.chatService.disconnect();
  }

  // Inicio de data para la interfaz
  connectInit() {
    // Carga chats recientes
    this.httpLoadRecently();
    // Conexion inicial
    this.chatService.connect();
    // Suscripcion a eventos de chat privado
    const chatPrivate = this.chatService.subscribeToPrivate(
      (msg: ChatResponse) => {
        if (this.userService.dataUser()?.id != msg.usuarioRemitente.id) {
          this.newMessage.set(msg);
        }
      }
    );

    // Suscripcion a eventos de chats grupales
    this.roomService.getRoomsUserAuthenticated().subscribe((data) => {
      for (let index = 0; index < data!.length; index++) {
        const idRoom = data![index].id;

        const chatGroup = this.chatService.subscribeToGroup(
          idRoom,
          (msg: ChatResponse) => {
            if (this.userService.dataUser()?.id != msg.usuarioRemitente.id) {
              this.newMessage.set(msg);
            }
          }
        );
        // Almacenamiento de suscripciones grupales
        this.subscriptions.update((old) => [...old, chatGroup]);
      }
    });
    // Almacenamiento de suscripcion privada
    this.subscriptions.update((old) => [...old, chatPrivate]);
  }

  // Cambiar entre chats recientes y contactos
  alterView(view: typesIconMenu) {
    if (this.iconMenuCurrent() == view) return;
    this.iconMenuCurrent.set(view);
    this.txtFilter()!.nativeElement.value = '';
    this.reloadContacts();
  }

  // Carga de chats de acuerdo a la vista
  reloadContacts(filter?: string) {
    switch (this.iconMenuCurrent()) {
      case 'recently': {
        this.httpLoadRecently(filter);
        break;
      }
      case 'groups': {
        this.httpLoadGroups(filter);
        break;
      }
      case 'contacts': {
        this.httpLoadContacts(filter);
        break;
      }
    }
  }

  // Recargar la vista de chats si hay un nuevo mensaje
  effectNewMessage = effect(() => {
    const messages = this.chatService.messageReceived();
    this.reloadContacts();
  });

  // Cargar con filtro
  httpLoadWithFilter(filter: string) {
    this.reloadContacts(filter);
  }

  // Cargar chats recientes (recently)
  httpLoadRecently(filter?: string) {
    this.contactService.getContactsRecently(filter).subscribe((resp) => {
      const data = resp!
        .map((entity) => ({
          ...entity,
          fechaOrden: entity.datosMensaje?.horaEnvio
            ? new Date(entity.datosMensaje.horaEnvio)
            : new Date(0),
        }))
        .sort((a, b) => b.fechaOrden.getTime() - a.fechaOrden.getTime());

      this.dataContacts.set(data);
    });
  }

  // Cargar grupos de trabajo (groups)
  httpLoadGroups(filter?: string) {
    this.contactService.getContactsGroups(filter).subscribe((resp) => {
      this.dataContacts.set(resp!);
    });
  }

  // Cargar contactos de campaña (contacts)
  httpLoadContacts(filter?: string) {
    this.contactService.getContactsCampania(filter).subscribe((resp) => {
      this.dataContacts.set(resp!);
    });
  }

  // Cierre de sesión
  finishSession() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.toastService.show('Sesión finalizada.', 'text-bg-secondary');
  }

  // Al presionar Esc se cierra el chat
  @HostListener('window:keydown.escape', ['$event'!])
  onEsc(event: KeyboardEvent) {
    event.preventDefault();
    (document.activeElement as HTMLElement)?.blur();
    this.contactToShowInChat.set(null);
    this.valueSelected.set(null);
  }

  contactToShowInChat = signal<minDataContact | null>(null);

  // Al dar click en un contacto se pasan los parametros al hijo
  openChat(valuesContact: minDataContact, indexClick: number) {
    this.contactToShowInChat.set(valuesContact);
    this.valueSelected.set(indexClick);
  }

  valueSelected = signal<number | null>(null);

  managementAccountModal =
    viewChild<ManagementAccountComponent>('accountModal');

  openModalManagementAccount() {
    this.managementAccountModal()!.show();
  }
}
