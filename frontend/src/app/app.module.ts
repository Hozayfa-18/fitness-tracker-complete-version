import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // für ngModel und Formulare
import { RouterModule } from '@angular/router'; // für Router-Funktionalitäten
import { AppComponent } from './app.component'; // die Hauptkomponente
import { RegistrierungComponent } from './registrierung/registrierung.component';// die Registrierungskomponente
import { LoginComponent } from './login/login.component';
import { ZweifaktorComponent } from './zweifaktor/zweifaktor.component';
import {HomepageComponent} from "./homepage/homepage.component";
//import { GpxUploadComponent } from './gpx-upload/gpx-upload.component';
import {HttpClientModule} from "@angular/common/http";
import {StatisticsComponent} from './statistics/statistics.component';
import {NavbarComponent} from "./navbar/navbar.component";
import {ActivityCreatComponent} from "./activity/activity-creat/activity-creat.component";
import {ActivityListComponent} from "./activity/activity-list/activity-list.component";
import {BenutzerprofileComponent} from "./benutzerprofile/benutzerprofile.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {AppRoutingModule} from "./app.routing.module";
import {TeilnehmerSucheComponent} from "./teilnehmer-suche/teilnehmer-suche.component";
import {TeilnehmersucheprofileComponent} from "./teilnehmersucheprofile/teilnehmersucheprofile.component";
import {TeilnehmeractivitylistComponent} from "./teilnehmeractivitylist/teilnehmeractivitylist.component";

import {FreundeslisteComponent} from "./freundesliste/freundesliste.component";
import {ActivityPicturesComponent} from "./activity-pictures/activity-pictures.component";
import { ElevationVisualizationComponent } from './elevation-visualization/elevation-visualization.component';
import {ActivityMapComponent} from "./activity/activity-map/activity-map.component";
import {ChatComponent} from "./chat/chat.component";
import { LeaderboardComponent} from "./leaderboard/leaderboard.component";

import { ActivityGraphsComponent} from "./activity-graphs/activity-graphs.component";

import {ActivityAchievementComponent} from "./activity/activity-achievement/activity-achievement.component";
import {SocialFeedComponent} from "./social-feed/social-feed.component";

@NgModule({
    declarations: [
        AppComponent,
        RegistrierungComponent, // alle Komponenten müssen hier deklariert werden
        LoginComponent,
        ZweifaktorComponent,
        HomepageComponent,
        NavbarComponent,
        ActivityCreatComponent,
        ActivityListComponent,
        StatisticsComponent,
        BenutzerprofileComponent,
        EditProfileComponent,
        TeilnehmerSucheComponent,
        TeilnehmersucheprofileComponent,
        TeilnehmeractivitylistComponent,
        ChatComponent,
        FreundeslisteComponent,
        ActivityPicturesComponent,
        ElevationVisualizationComponent,
        ActivityMapComponent,
        LeaderboardComponent,
        SocialFeedComponent,
        ActivityGraphsComponent,
        ActivityAchievementComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
      AppRoutingModule,
      HttpClientModule,
        FormsModule, // notwendig für ngModel in Formularen
        RouterModule.forRoot([
            {path: 'registrierung', component: RegistrierungComponent},
            {path: 'login', component: LoginComponent},
            {path: 'zweifaktor', component: ZweifaktorComponent},
            {path: 'homepage', component: HomepageComponent},
            {path: 'statistics/:id', component: StatisticsComponent},// statistics.
            {path: 'activitycreat', component: ActivityCreatComponent},
            {path: 'navbar', component: NavbarComponent},
            {path: 'activitylist', component: ActivityListComponent},
            {path: 'users', component: BenutzerprofileComponent},
            {path: 'usersSearch', component: TeilnehmerSucheComponent},
            {path: 'usersSearch/:username', component: TeilnehmersucheprofileComponent},
            {path: 'usersSearch/activitylist/:username', component: TeilnehmeractivitylistComponent},
            {path: 'freundesliste', component: FreundeslisteComponent},
            {path: 'activitypictures', component: ActivityPicturesComponent},
            {path: 'elevation-visualization/:id', component: ElevationVisualizationComponent},
            { path: 'map/:id', component: ActivityMapComponent },
            {path: 'chat', component: ChatComponent},
            {path: 'leaderboard', component: LeaderboardComponent},
            {path: 'socialfeed', component: SocialFeedComponent},

            // weitere Routen hier hinzufügen
        ]),
    ],
    providers: [],
    exports: [
        NavbarComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
