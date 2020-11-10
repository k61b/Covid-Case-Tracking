import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  loading = true;
  globalData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  }
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  }
  constructor(private dataService: DataServiceService) { }

  initChart(caseType: string) {

    let datatable = [];
    datatable.push(["Country", "Cases"])

    this.globalData.forEach(cs => {
      let value: number;
      if (caseType == 'c')
        if (cs.confirmed > 100000)
          value = cs.confirmed

      if (caseType == 'a')
        if (cs.active > 100000)
          value = cs.active

      if (caseType == 'd')
        if (cs.deaths > 100000)
          value = cs.deaths

      if (caseType == 'r')
        if (cs.recovered > 100000)
          value = cs.recovered


      datatable.push([
        cs.country, value
      ])

    })


    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out'
        }
      },
    };

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out'
        }
      },
    };
  }

  ngOnInit(): void {
    this.dataService.getGlobalData()
      .subscribe(
        {
          next: (result) => {
            console.log(result);
            this.globalData = result;
            result.forEach(cs => {
              if (!Number.isNaN(cs.confirmed)) {
                this.totalActive += cs.active
                this.totalConfirmed += cs.confirmed
                this.totalDeaths += cs.deaths
                this.totalRecovered += cs.recovered
              }
            })

            this.initChart('c');
          },
          complete: () => {
            this.loading = false;
          }
        }
      )
  }

  updateChart(input: HTMLInputElement) {
    console.log(input.value);
    this.initChart(input.value)
  }

}
