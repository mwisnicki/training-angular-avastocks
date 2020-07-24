import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowStockPopupComponent } from './follow-stock-popup.component';

describe('FollowStockPopupComponent', () => {
  let component: FollowStockPopupComponent;
  let fixture: ComponentFixture<FollowStockPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowStockPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowStockPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
