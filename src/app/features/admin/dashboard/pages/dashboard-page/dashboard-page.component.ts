import { DatePipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MetricService } from '../../services/metric.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Chart } from 'chart.js/auto';
import {
  MessagesAveragePerMonthResponse,
  NewUsersPerMonthResponse,
} from '../../interfaces/metric.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dashboard-page',
  imports: [DatePipe, FormsModule],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  private metricService = inject(MetricService);
  currentDate = signal<Date>(new Date());

  years = [2024, 2025];

  /* SIGNALS */
  anioMessage = signal<number>(new Date().getFullYear());
  anioUsers = signal<number>(new Date().getFullYear());

  /* ESTATICOS */
  alertsUsers = toSignal(this.metricService.getAlertsUsers());
  infoGeneral = toSignal(this.metricService.getInfoGeneral());
  infoDaily = toSignal(this.metricService.getInfoDaily());

  /* DINAMICOS */
  userAnnual = signal<NewUsersPerMonthResponse[] | null>(null);
  messageAnnual = signal<MessagesAveragePerMonthResponse[] | null>(null);

  onChangeYearAnioUser(value: string) {
    this.anioUsers.set(Number(value));
  }

  onChangeYearAnioMessage(value: string) {
    this.anioMessage.set(Number(value));
  }

  effectUserAnnual = effect((onCleanUp) => {
    const anio = this.anioUsers();

    this.metricService.getUserNewsInAnio(anio).subscribe((data) => {
      this.userAnnual.set(data);
    });
  });

  effectMessageAnnual = effect((onCleanUp) => {
    const anio = this.anioMessage();

    this.metricService.getMessagesAverageInAnio(anio).subscribe((data) => {
      this.messageAnnual.set(data);
    });
  });

  chartCanvasUsuarios = viewChild<ElementRef<HTMLCanvasElement>>(
    'chartCanvasUsuarios'
  );
  chartCanvasMessages = viewChild<ElementRef<HTMLCanvasElement>>(
    'chartCanvasMessages'
  );

  chartUsuarios!: Chart;
  chartMessages!: Chart;

  loadChartUserEffect = effect(() => {
    const info = this.userAnnual();

    if (info && this.chartCanvasUsuarios) {
      const labels = info.map((v) => v.nombreMes.slice(0, 3));
      const data = info.map((v) => v.cantidad);

      if (this.chartUsuarios) this.chartUsuarios.destroy();

      this.chartUsuarios = new Chart(
        this.chartCanvasUsuarios()!.nativeElement,
        {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Usuarios Nuevos por Mes',
                data,
                backgroundColor: 'rgba(0, 170, 255, 0.32)',
                borderColor: 'rgba(0, 170, 255, 0.75)',
                borderWidth: 1.8,
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                ticks: { color: '#cfd5db', maxRotation: 0, minRotation: 0 },
              },
              y: {
                ticks: { color: '#cfd5db' },
              },
            },
          },
        }
      );
    }
  });

  loadChartMessageEffect = effect(() => {
    const info = this.messageAnnual();

    if (info && this.chartCanvasMessages) {
      const labels = info.map((v) => v.nombreMes.slice(0, 3));
      const data = info.map((v) => v.promedio); // o cantidadMensajes

      if (this.chartMessages) this.chartMessages.destroy();

      this.chartMessages = new Chart(
        this.chartCanvasMessages()!.nativeElement,
        {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Promedio de Mensajes por Mes',
                data,
                backgroundColor: 'rgba(255, 145, 0, 0.35)',
                borderColor: 'rgba(255, 145, 0, 0.9)',
                borderWidth: 1.8,
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                ticks: { color: '#cfd5db', maxRotation: 0, minRotation: 0 },
              },
              y: {
                ticks: { color: '#cfd5db' },
              },
            },
          },
        }
      );
    }
  });
}
