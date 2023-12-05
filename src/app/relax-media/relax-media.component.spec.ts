import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaxMediaComponent } from './relax-media.component';

describe('RelaxMediaComponent', () => {
  let component: RelaxMediaComponent;
  let fixture: ComponentFixture<RelaxMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelaxMediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelaxMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
