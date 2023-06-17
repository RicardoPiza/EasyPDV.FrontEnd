import { Component } from '@angular/core';
import { KeyboardEventService } from './@core/services/keyboard-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {constructor(
  private keyboardEventService: KeyboardEventService
){
}
  title = 'EasyPDV.FrontEnd';
  handleKeyboardEvents(event: KeyboardEvent) {
    this.keyboardEventService.updated.next(event);
  }
}
