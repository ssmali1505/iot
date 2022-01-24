import {Component, OnDestroy} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';
import {IMqttMessage,
  MqttModule,
  IMqttServiceOptions,
  MqttService} from 'ngx-mqtt';
import { Subscription } from 'rxjs';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
  data: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;

  private subscription: Subscription;
  public message: string =`[{"subTitle":"--- ---v","title":"BATTERY TYPE"},{"subTitle":"--V","title":"BATTERY VOLTAGE"},{"subTitle":"--A","title":"BATTERY CURRENT"},{"subTitle":"-----","title":"BATTERY STATUS"},{"subTitle":"--V","title":"SOLAR VOLTAGE"},{"subTitle":"--A","title":"SOLAR CURRENT"},{"subTitle":"---","title":"PIR AVAILABLE"},{"subTitle":"---","title":"DUSK TO DOWN"},{"subTitle":"--Hrs","title":"LOAD ON TIME"},{"subTitle":"---","title":"LOAD STATUS"},{"subTitle":"--WATT","title":"WATTAGE"}]`;  ;

  solarValue: number;
  solarValue2: number;

  solarTitle1: string = 'Solar Energy Consumption';
  solarTitle2: string = 'Battery Energy Consumption';

  statusCards: CardSettings[];
  commonSet: CardSettings[];

  constructor(private themeService: NbThemeService,
              private solarService: SolarData, 
              _mqttService: MqttService) {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
    });

    this.solarService.getSolarData()
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.solarValue = data;
        this.solarValue2=90;
      });

      let list:[] = JSON.parse(this.message);

        console.log("list:"+list);

        this.commonSet=[];
        for(let i=0;i<list.length;i++){
          const item = list[i]
          var type="primary"
          if(item['subTitle'] =='OFF'){
            type= 'danger';
          }
          if(item['subTitle'] =='ON'){
            type='success';
          }

          let card: CardSettings = {
            title: item['title'],
            iconClass: 'nb-lightbulb',
            type: type,
            data: item['subTitle'],
          };
          this.commonSet.push(card);
        }    

        this.statusCards = this.commonSet;

      this.subscription = _mqttService.observe('testtopic/iot').subscribe((message: IMqttMessage) => {
        this.message = message.payload.toString();
        console.log("this.message:"+this.message);

        let list:[] = JSON.parse(this.message);

        console.log("list:"+list);

        this.commonSet=[];
        for(let i=0;i<list.length;i++){
          const item = list[i]
          var type="primary"
          if(item['subTitle'] =='OFF'){
            type= 'danger';
          }
          if(item['subTitle'] =='ON'){
            type='success';
          }

          let card: CardSettings = {
            title: item['title'],
            iconClass: 'nb-lightbulb',
            type: type,
            data: item['subTitle'],
          };
          this.commonSet.push(card);
        }    

        this.statusCards = this.commonSet;

      });      

  }

  ngOnDestroy() {
    this.alive = false;
  }
}
