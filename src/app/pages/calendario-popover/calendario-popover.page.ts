import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
 

@Component({
  selector: 'app-calendario-popover',
  templateUrl: './calendario-popover.page.html',
  styleUrls: ['./calendario-popover.page.scss'],
})
export class CalendarioPopoverPage implements OnInit {
  @Input() fecha: Date | any;
@Input() max : number
  constructor(
    public popOverCtrl: PopoverController,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
   
this.fecha = this.fecha.toISOString()

  }
 async formatDate(value: any) {

    const popover = await this.popOverCtrl.getTop();
    if (popover){
       this.popOverCtrl.dismiss({
        fecha:value
      })

    }
     
   
  }


  
}
