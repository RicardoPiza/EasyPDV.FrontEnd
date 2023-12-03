import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-cronometro',
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.css']
})
export class CronometroComponent implements OnInit, OnDestroy {
  @Input() hours!: number;
  @Input() minutes!: number;
  @Input() seconds!: number;
  cronometroSubscription!: Subscription;

  @Output() tempoAtualizado: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
    this.iniciarCronometro();
  }

  ngOnDestroy(): void {
    this.pararCronometro();
  }

  private timeFormat(hours: number, minutes: number, seconds: number): string {
    return `${this.adicionarZeroEsquerda(hours)}:${this.adicionarZeroEsquerda(minutes)}:${this.adicionarZeroEsquerda(seconds)}`;
  }

  private adicionarZeroEsquerda(valor: number): string {
    return valor < 10 ? `0${valor}` : valor.toString();
  }

  iniciarCronometro(): void {
    this.cronometroSubscription = interval(1000).subscribe(() => {
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

  pararCronometro(): void {
    if (this.cronometroSubscription) {
      this.cronometroSubscription.unsubscribe();
    }
  }

  reiniciarCronometro(): void {
    this.pararCronometro();
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.iniciarCronometro();
  }
  getFormatedTime(): string {
    return this.timeFormat(this.hours, this.minutes, this.seconds);
  }
}


