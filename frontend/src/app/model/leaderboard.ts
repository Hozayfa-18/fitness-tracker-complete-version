export class Leaderboard {

  username: string | undefined;
  activityCount: number | undefined;
  totalDuration: number | undefined; // in Stunden
  totalDistance: number | undefined; // in KiloMeter
  totalCalories: number | undefined; // in Kalorien
  totalElevationGain: number | undefined; // in Metern (insgesamt erklommene Höhe)
  avgSpeed: number | undefined; // in km/h, berechnet aus den Durchschnittswerten aller Aktivitäten (Durchschnittsgeschwindigkeit)
  maxSpeed: number | undefined; // in km/h, berechnet aus den Durchschnittswerten aller Aktivitäten (Höchstgeschwindigkeit )
  totalLikes: number | undefined;

}
