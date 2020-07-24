import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowStocksItemComponent } from './follow-stocks-item.component';

describe('FollowStocksItemComponent', () => {
  let component: FollowStocksItemComponent;
  let fixture: ComponentFixture<FollowStocksItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowStocksItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowStocksItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
