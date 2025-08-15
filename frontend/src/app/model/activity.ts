import {User} from "./user";

export type ActivityType = 'RUNNING' | 'CYCLING' | 'HIKING' | 'WALKING';
export type Visibility = 'PUBLIC' | 'PRIVATE' | 'FRIENDS';

export class Activity {
  id: number | undefined;
  user: User | undefined;
  activityName: string | undefined;
  username: string | undefined
  activityType: ActivityType | undefined;
  activityData: File | undefined; // Änderung zu File für den Datei-Upload
  totalDuration: number | undefined; // in Minuten
  totalDistance: number | undefined; // in Metern
  averageSpeed: number | undefined; // in km/h
  totalCalories: number | undefined;
  totalElevationGain: number | undefined; // in Metern
  activityDate: number | undefined; // Datum der Aktivität
  createdAt: Date | undefined; // Datum der Erstellung
  updatedAt: Date | undefined; // Datum der letzten Aktualisierung
  isLiked: boolean | undefined;
  likeCount: number | undefined;
  isPublic: boolean | undefined;
  sichtbar: boolean | undefined;
  visibility: Visibility | undefined;

  // Felder für die Höhenvisualisierung
  timestamps?: string[]; // Zeitstempel der GPS-Punkte
  elevations?: number[]; // Höhenwerte der GPS-Punkte
  createdBy: string | undefined;
}
