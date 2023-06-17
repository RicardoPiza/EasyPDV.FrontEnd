import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardEventService {
  public updated = new EventEmitter<KeyboardEvent>()
  constructor() { }
}
