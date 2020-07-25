import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTickerComponent } from './simple-ticker.component';

describe('SimpleTickerComponent', () => {
  let component: SimpleTickerComponent;
  let fixture: ComponentFixture<SimpleTickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleTickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
