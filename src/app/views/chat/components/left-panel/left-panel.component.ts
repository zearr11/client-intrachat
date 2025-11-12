import { Component } from '@angular/core';
import { IconMenuComponent } from "../../common/icon-menu/icon-menu.component";

@Component({
  selector: 'left-panel',
  imports: [IconMenuComponent],
  templateUrl: './left-panel.component.html',
  styles: `
    .panel-left {
    width: 70px;
    height: 100vh;
    border-right: 1px solid #adadad5e;
  }
  `
})
export class LeftPanelComponent { }
