import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admincourseslist } from './admincourseslist';

describe('Admincourseslist', () => {
  let component: Admincourseslist;
  let fixture: ComponentFixture<Admincourseslist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admincourseslist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admincourseslist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
