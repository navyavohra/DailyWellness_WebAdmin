import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { YogaVideosComponent } from './yoga-videos/yoga-videos.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { ReactiveFormsModule,FormGroup } from '@angular/forms';

import {ScreenTrackingService, UserTrackingService}
from '@angular/fire/analytics';
import {AngularFireAnalyticsModule} from "@angular/fire/compat/analytics";
import { RelaxMediaComponent } from './relax-media/relax-media.component';
import { QuotesComponent } from './quotes/quotes.component';
import { MeditationAudioComponent } from './meditation-audio/meditation-audio.component';
import { CoursesComponent } from './courses/courses.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { VrMediaComponent } from './vr-media/vr-media.component';
@NgModule({
  declarations: [
    AppComponent,
    YogaVideosComponent,
    RelaxMediaComponent,
    QuotesComponent,
    MeditationAudioComponent,
    CoursesComponent,
    LoginComponent,
    HomeComponent,
    VrMediaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
    AngularFireAnalyticsModule
  ],
  providers: [ScreenTrackingService,
    UserTrackingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
