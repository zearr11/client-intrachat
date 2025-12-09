import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MetricService } from '../../services/metric.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dashboard-page',
  imports: [DatePipe],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  private metricService = inject(MetricService);
  currentDate = signal<Date>(new Date());

  /* SIGNALS */
  anioMessage = signal<number>(2025);
  anioUsers = signal<number>(2025);

  alertsUsers = toSignal(this.metricService.getAlertsUsers());
  infoGeneral = toSignal(this.metricService.getInfoGeneral());
  infoDaily = toSignal(this.metricService.getInfoDaily());
  userAnnual = toSignal(this.metricService.getUserNewsInAnio(this.anioUsers()));
  messageAnnual = toSignal(
    this.metricService.getMessagesAverageInAnio(this.anioMessage())
  );
}
