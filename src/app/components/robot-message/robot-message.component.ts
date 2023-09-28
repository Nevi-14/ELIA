import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-robot-message',
  templateUrl: './robot-message.component.html',
  styleUrls: ['./robot-message.component.scss'],
})
export class RobotMessageComponent implements OnInit {
  @Input() message: string | any;
  showMessage = '';
  constructor() { }

  ngOnInit() {
    let string = [...this.message]
    string.forEach(async (element: string, index: number) => {
      setTimeout(() => {
        this.showMessage += element;
      }, index * 60)

    });
  }

}
