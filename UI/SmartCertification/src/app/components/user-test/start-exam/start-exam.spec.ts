import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartExamComponent } from './start-exam';

describe('StartExam', () => {
  let component: StartExamComponent;
  let fixture: ComponentFixture<StartExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
