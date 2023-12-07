import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-cronometer',
  templateUrl: './cronometer.component.html',
  styleUrls: ['./cronometer.component.css']
})
export class CronometerComponent implements OnInit, OnDestroy {
  @Input() hours!: number;
  @Input() minutes!: number;
  @Input() seconds!: number;
  cronometerSubscription!: Subscription;

  @Output() tempoAtualizado: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.initCronometer();
  }

  ngOnDestroy(): void {
    this.stopCronometer();
  }

  private timeFormat(hours: number, minutes: number, seconds: number): string {
    return `${this.addZeroToLeft(hours)}:${this.addZeroToLeft(minutes)}:${this.addZeroToLeft(seconds)}`;
  }

  private addZeroToLeft(valor: number): string {
    return valor < 10 ? `0${valor}` : valor.toString();
  }

  initCronometer(): void {
    this.cronometerSubscription = interval(1000).subscribe(() => {
      this.seconds++;
      if (this.seconds == 60) {
        this.minutes++;
        this.seconds = 0;
        if (this.minutes == 60) {
          this.hours++;
          this.minutes = 0
        }
      }
      this.tempoAtualizado.emit(this.timeFormat(this.hours, this.minutes, this.seconds));
    });
  }

  stopCronometer(): void {
    if (this.cronometerSubscription) {
      this.cronometerSubscription.unsubscribe();
    }
  }

  restartCronometer(): void {
    this.stopCronometer();
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.initCronometer();
  }
  getFormatedTime(): string {
    return this.timeFormat(this.hours, this.minutes, this.seconds);
  }
}


