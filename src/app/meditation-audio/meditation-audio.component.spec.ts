import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeditationAudioComponent } from './meditation-audio.component';

describe('MeditationAudioComponent', () => {
  let component: MeditationAudioComponent;
  let fixture: ComponentFixture<MeditationAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeditationAudioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeditationAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
