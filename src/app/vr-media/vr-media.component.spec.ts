import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrMediaComponent } from './vr-media.component';

describe('VrMediaComponent', () => {
  let component: VrMediaComponent;
  let fixture: ComponentFixture<VrMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VrMediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VrMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
