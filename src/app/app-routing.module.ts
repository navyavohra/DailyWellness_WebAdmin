import { NgModule } from '@angular/core';
import { AuthGaurdGuard } from './auth-gaurd.guard';
import { RouterModule, Routes } from '@angular/router';
import { YogaVideosComponent } from './yoga-videos/yoga-videos.component';
import { RelaxMediaComponent } from './relax-media/relax-media.component';
import { QuotesComponent } from './quotes/quotes.component';
import { MeditationAudioComponent } from './meditation-audio/meditation-audio.component';
import { CoursesComponent } from './courses/courses.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { VrMediaComponent } from './vr-media/vr-media.component';
const routes: Routes = [
  {path:'home',component:HomeComponent,canActivate:[AuthGaurdGuard]},
  {path:'yoga_videos',component:YogaVideosComponent,canActivate:[AuthGaurdGuard]},
  {path:'relax_media',component:RelaxMediaComponent,canActivate:[AuthGaurdGuard]},
  {path:'quotes',component:QuotesComponent,canActivate:[AuthGaurdGuard]},
  {path:'meditation_audio',component:MeditationAudioComponent,canActivate:[AuthGaurdGuard]},
  {path:'courses',component:CoursesComponent,canActivate:[AuthGaurdGuard]},
  {path:'vr_media',component:VrMediaComponent,canActivate:[AuthGaurdGuard]},
  {path:'login',component:LoginComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
