import { Component, HostListener, signal } from '@angular/core';
import { LeftPanelComponent } from "../../components/left-panel/left-panel.component";
import { MiddlePanelComponent } from "../../components/middle-panel/middle-panel.component";
import { RightPanelComponent } from "../../components/right-panel/right-panel.component";
import { Message } from '../../interfaces/message.interface';
import { InfoContact } from '../../interfaces/info.contact.interface';

@Component({
  selector: 'app-main',
  imports: [
    LeftPanelComponent,
    MiddlePanelComponent,
    RightPanelComponent
  ],
  templateUrl: './main-chat-page.component.html',
  styleUrl: './main-chat-page.component.css'
})
export default class MainChatPageComponent {

  idValue = signal<number>(0);

  @HostListener('document:keydown.escape', ['$event'])
  onEscPress(event: KeyboardEvent) {
    this.idValue.set(0);
  }

  header: InfoContact[] = [
    {
      icon: 'https://i.pravatar.cc/50?img=5',
      name: 'Soporte Tecnico Team',
      subText: '32 miembros'
    },
    {
      icon: 'https://i.pravatar.cc/50?img=10',
      name: 'Recursos Humanos',
      subText: '12 miembros'
    },
    {
      icon: 'https://i.pravatar.cc/50?img=15',
      name: 'Ventas Regionales',
      subText: '8 miembros'
    }
  ];

  messages: Message[][] = [
    [
      {
        name: "Juan",
        content: "Hola",
        time: "08:15",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      {
        name: "María",
        content: "Buenos días, ¿cómo estás?",
        time: "08:16",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg"
      },
      {
        name: "Carlos",
        content: "Todo bien, gracias. ¿Y tú?",
        time: "08:17",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg"
      },
      {
        name: "Ana",
        content: "¿Alguien tiene el reporte de ventas?",
        time: "08:20",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg"
      },
      {
        name: "Luis",
        content: "Sí, lo acabo de enviar por correo.",
        time: "08:22",
        avatar: "https://randomuser.me/api/portraits/men/5.jpg"
      },
      {
        name: "Sofía",
        content: "Perfecto, gracias Luis.",
        time: "08:23",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg"
      },
      {
        name: "Pedro",
        content: "¿Reunión a las 3 sigue en pie?",
        time: "09:10",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg"
      },
      {
        name: "María",
        content: "Sí, confirmada. Sala de juntas.",
        time: "09:12",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg"
      },
      {
        name: "Andrés",
        content: "No podré asistir, ¿pueden grabarla?",
        time: "09:14",
        avatar: "https://randomuser.me/api/portraits/men/8.jpg"
      },
      {
        name: "Laura",
        content: "Claro, la grabaremos y te la comparto.",
        time: "09:15",
        avatar: "https://randomuser.me/api/portraits/women/9.jpg"
      },
      {
        name: "Carlos",
        content: "Recuerden actualizar el documento antes de enviar.",
        time: "09:20",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg"
      },
      {
        name: "Ana",
        content: "Listo, ya está en la carpeta compartida.",
        time: "09:21",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg"
      },
      {
        name: "Sofía",
        content: "Genial, gracias a todos por el apoyo.",
        time: "09:25",
        avatar: "https://randomuser.me/api/portraits/women/6.jpg"
      },
      {
        name: "Juan",
        content: "Nos vemos mañana, buen trabajo equipo.",
        time: "17:55",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      {
        name: "Pedro",
        content: "Igualmente, descansen.",
        time: "17:56",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg"
      }
    ],
    [
      {
        name: "Claudia",
        content: "Buenos días, recuerden llenar la encuesta de clima laboral.",
        time: "09:05",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg"
      },
      {
        name: "Raúl",
        content: "¿Dónde puedo encontrar el enlace?",
        time: "09:06",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg"
      },
      {
        name: "Claudia",
        content: "Está en el correo que envié ayer, asunto: 'Encuesta interna'.",
        time: "09:08",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg"
      },
      {
        name: "Fernanda",
        content: "Ya la completé, es rápida.",
        time: "09:10",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg"
      },
      {
        name: "Raúl",
        content: "Perfecto, gracias.",
        time: "09:12",
        avatar: "https://randomuser.me/api/portraits/men/11.jpg"
      },
      {
        name: "Javier",
        content: "¿Se puede responder desde el celular?",
        time: "09:15",
        avatar: "https://randomuser.me/api/portraits/men/13.jpg"
      },
      {
        name: "Claudia",
        content: "Sí, el formulario se adapta automáticamente.",
        time: "09:17",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg"
      },
      {
        name: "Fernanda",
        content: "Perfecto, ¡gracias por confirmar!",
        time: "09:18",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg"
      },
      {
        name: "Javier",
        content: "Listo, encuesta enviada ✅",
        time: "09:20",
        avatar: "https://randomuser.me/api/portraits/men/13.jpg"
      }
    ],
    [
      {
        name: "Lucía",
        content: "Buen día, ¿ya tienen el reporte de ventas del norte?",
        time: "07:55",
        avatar: "https://randomuser.me/api/portraits/women/15.jpg"
      },
      {
        name: "Oscar",
        content: "Sí, te lo envío en unos minutos.",
        time: "07:57",
        avatar: "https://randomuser.me/api/portraits/men/16.jpg"
      },
      {
        name: "Patricia",
        content: "Yo actualicé la zona centro anoche.",
        time: "08:00",
        avatar: "https://randomuser.me/api/portraits/women/17.jpg"
      },
      {
        name: "Lucía",
        content: "Excelente, muchas gracias.",
        time: "08:01",
        avatar: "https://randomuser.me/api/portraits/women/15.jpg"
      },
      {
        name: "Ricardo",
        content: "En Lima bajaron un poco las cifras, revisen el archivo.",
        time: "08:05",
        avatar: "https://randomuser.me/api/portraits/men/18.jpg"
      },
      {
        name: "Patricia",
        content: "Sí, lo vi. Hay que reforzar promociones.",
        time: "08:07",
        avatar: "https://randomuser.me/api/portraits/women/17.jpg"
      },
      {
        name: "Oscar",
        content: "Archivo enviado 📊",
        time: "08:09",
        avatar: "https://randomuser.me/api/portraits/men/16.jpg"
      },
      {
        name: "Lucía",
        content: "Recibido, gracias equipo.",
        time: "08:10",
        avatar: "https://randomuser.me/api/portraits/women/15.jpg"
      },
      {
        name: "Ricardo",
        content: "Nos vemos a las 4 para la reunión semanal.",
        time: "08:12",
        avatar: "https://randomuser.me/api/portraits/men/18.jpg"
      },
      {
        name: "Patricia",
        content: "Perfecto, ahí estaremos.",
        time: "08:13",
        avatar: "https://randomuser.me/api/portraits/women/17.jpg"
      }
    ]
  ];

}
