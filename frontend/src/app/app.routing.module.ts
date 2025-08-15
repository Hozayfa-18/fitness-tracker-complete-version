import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {RegistrierungComponent} from "./registrierung/registrierung.component";
import { LoginComponent } from './login/login.component';
import { ZweifaktorComponent } from './zweifaktor/zweifaktor.component';
import {HomepageComponent} from "./homepage/homepage.component";
import {ActivityCreatComponent} from "./activity/activity-creat/activity-creat.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {ActivityListComponent} from "./activity/activity-list/activity-list.component"  ;
import {BenutzerprofileComponent} from "./benutzerprofile/benutzerprofile.component";
import {TeilnehmerSucheComponent} from "./teilnehmer-suche/teilnehmer-suche.component";
import {TeilnehmersucheprofileComponent} from "./teilnehmersucheprofile/teilnehmersucheprofile.component";
import {TeilnehmeractivitylistComponent} from "./teilnehmeractivitylist/teilnehmeractivitylist.component";
import {FreundeslisteComponent} from "./freundesliste/freundesliste.component";
import {ActivityPicturesComponent} from "./activity-pictures/activity-pictures.component";
import {ElevationVisualizationComponent} from "./elevation-visualization/elevation-visualization.component";
import {ActivityMapComponent} from "./activity/activity-map/activity-map.component";
import {ChatComponent} from "./chat/chat.component";
import {LeaderboardComponent} from "./leaderboard/leaderboard.component";
import { ActivityGraphsComponent} from "./activity-graphs/activity-graphs.component";
import {ActivityAchievementComponent} from "./activity/activity-achievement/activity-achievement.component";
import {SocialFeedComponent} from "./social-feed/social-feed.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'registrierung', component: RegistrierungComponent },
  { path: 'login', component: LoginComponent},
  { path: 'zweifaktor', component: ZweifaktorComponent},
  { path: 'homepage', component: HomepageComponent},
  { path: 'navbar', component: NavbarComponent },
  { path: 'activitycreat', component: ActivityCreatComponent },
  { path: 'statistics/:id', component: StatisticsComponent },//.
  { path: 'activitylist', component:ActivityListComponent},
  {path: 'users', component: BenutzerprofileComponent},
  {path: 'usersSearch', component: TeilnehmerSucheComponent},
  {path: 'usersSearch/:username', component: TeilnehmersucheprofileComponent},
  {path: 'usersSearch/activitylist/:username', component: TeilnehmeractivitylistComponent},
  {path: 'freundesliste', component: FreundeslisteComponent},
  {path: 'activitypictures/:username', component: ActivityPicturesComponent},
  {path: 'elevation-visualization/:id', component: ElevationVisualizationComponent},
  { path: 'map/:id', component: ActivityMapComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'monthly-statistics', component:  ActivityGraphsComponent},
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'socialfeed', component: SocialFeedComponent},
  { path: 'erfolge', component: ActivityAchievementComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
