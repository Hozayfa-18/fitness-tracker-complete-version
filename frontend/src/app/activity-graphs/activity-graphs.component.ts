import { Component, OnInit } from '@angular/core';
import { ActivityServiceService } from '../service/activity-service.service';
import { UserServiceService } from '../service/user-service.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-activity-graphs',
  templateUrl: './activity-graphs.component.html',
  styleUrls: ['./activity-graphs.component.css'],
})
export class ActivityGraphsComponent implements OnInit {
  availableYears: number[] = [];
  selectedYear: number = new Date().getFullYear();
  statistics: any = {};
  labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  username: string = '';
  isAdmin: boolean = false;
  errorMessage: string | null = null;

  statisticKeys = [
    { key: 'activityCount', label: 'Anzahl der Aktivitäten', color: 'rgba(255, 99, 132, 0.5)' },
    { key: 'totalDuration', label: 'Gesamtdauer (Minuten)', color: 'rgba(54, 162, 235, 0.5)' },
    { key: 'totalDistance', label: 'Gesamtdistanz (km)', color: 'rgba(255, 206, 86, 0.5)' },
    { key: 'averageSpeed', label: 'Durchschnittsgeschwindigkeit', color: 'rgba(75, 192, 192, 0.5)' },
    { key: 'maxSpeed', label: 'Höchstgeschwindigkeit', color: 'rgba(153, 102, 255, 0.5)' },
    { key: 'totalCalories', label: 'Verbrannte Kalorien', color: 'rgba(255, 159, 64, 0.5)' },
    { key: 'totalElevationGain', label: 'Erklommene Höhe', color: 'rgba(99, 255, 132, 0.5)' },
  ];

  charts: { [key: string]: Chart | null } = {};

  chartTypes: { [key: string]: string } = {
    activityCount: 'bar',
    totalDuration: 'bar',
    totalDistance: 'bar',
    averageSpeed: 'bar',
    maxSpeed: 'line',
    totalCalories: 'line',
    totalElevationGain: 'line',
  };

  constructor(
    private activityService: ActivityServiceService,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const username = this.userService.getLoggedInUsername();
    if (username) {
      this.username = username;

      this.userService.findByUsername(this.username).subscribe({
        next: (user) => {
          if (user.role !== 'admin') {
            this.loadAvailableYears();
          } else {
            this.isAdmin = true;
            this.errorMessage = 'Admins dürfen keine Aktivitäten-Grafiken sehen!';
          }
        },
        error: (error) => {
          console.error('Fehler beim Abrufen des Benutzers:', error);
        },
      });
    } else {
      this.errorMessage = 'Kein Benutzer angemeldet.';
    }
  }

  loadAvailableYears(): void {
    this.activityService.getActivityByUserName(this.username).subscribe({
      next: (data) => {
        const years = (data as any[])
          .map((activity) => {
            if (activity.activityDate) {
              const date = new Date(activity.activityDate * 1000);
              return date.getFullYear();
            }
            return null;
          })
          .filter((year): year is number => year !== null);
        this.availableYears = [...new Set(years)].sort((a, b) => b - a);
        this.selectedYear = this.availableYears[0];
        this.loadStatistics();
      },
      error: (error) => {
        console.error('Fehler beim Laden der Aktivitäten:', error);
      },
    });
  }

  loadStatistics(): void {
    this.activityService.getMonthlyStatistics(this.username, this.selectedYear).subscribe({
      next: (data: any[]) => {
        this.statistics = data.reduce((acc: any[], stat: any) => {
          acc[stat.month - 1] = stat;
          return acc;
        }, Array(12).fill({}));
        this.renderAllCharts();
      },
      error: (error: any) => {
        console.error('Fehler beim Laden der Statistiken:', error);
      },
    });
  }

  renderAllCharts(): void {
    this.statisticKeys.forEach((stat) => {
      const canvas = document.getElementById(stat.key) as HTMLCanvasElement;

      if (!canvas) {
        console.error(`Canvas für ${stat.key} nicht gefunden!`);
        return;
      }

      if (this.charts[stat.key]) {
        this.charts[stat.key]?.destroy();
      }

      const chartType = this.chartTypes[stat.key] || 'bar';

      this.charts[stat.key] = new Chart(canvas, {
        type: chartType as any,
        data: {
          labels: this.labels,
          datasets: [
            {
              label: stat.label,
              data: this.getStatisticByMonth(stat.key),
              backgroundColor: stat.color,
              borderColor: stat.color.replace('0.5', '1'),
              borderWidth: 1,
              fill: chartType !== 'line',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Monate',
              },
            },
            y: {
              title: {
                display: true,
                text: stat.label,
              },
              beginAtZero: true,
            },
          },
        },
      });
    });
  }

  getStatisticByMonth(statKey: string): number[] {
    return this.statistics.map((month: any) =>
      month && month[statKey] !== undefined ? month[statKey] : 0
    );
  }
}
