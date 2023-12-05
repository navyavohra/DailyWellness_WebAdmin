import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YogaVideosComponent } from './yoga-videos.component';

describe('YogaVideosComponent', () => {
  let component: YogaVideosComponent;
  let fixture: ComponentFixture<YogaVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YogaVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YogaVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
