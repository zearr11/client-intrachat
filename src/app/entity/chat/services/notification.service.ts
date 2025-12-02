import { inject, Injectable } from '@angular/core';
import { ChatResponse } from '../interfaces/chat.interface';
import { UserService } from '../../user/services/user.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private soundMsg = new Audio('sounds/notification.mp3');

  constructor() {
    this.soundMsg.load();
  }

  emitSound() {
    this.soundMsg.currentTime = 0;
    this.soundMsg.play();
  }
}
