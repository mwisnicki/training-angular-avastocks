import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  visible = false;

  @Output() performed = new EventEmitter();

  ngOnInit(): void {}

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  onPerformClick() {
    this.visible = false;
    this.performed.emit(this);
  }
}
