import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  selectedCountryData: DateWiseData[];
  dateWiseData;
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart'
  }
  constructor(private service: DataServiceService) { }

  ngOnInit(): void {

    this.service.getDateWiseData().subscribe(
      (result) => {
        this.dateWiseData = result;
        this.updateChart();
      }
    )

    this.service.getGlobalData().subscribe(result => {
      this.data = result;
      this.data.forEach(cs => {
        this.countries.push(cs.country);
      })
    })
  }

  updateChart() {
    let dataTable = [];
    dataTable.push(["Date" , 'Cases'])
    this.selectedCountryData.forEach(cs=>{
      dataTable.push([cs.date , cs.cases])
    })

    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500
      },
    };
  }

  updateValues(country: string) {
    console.log(country);
    this.data.forEach(cs => {
      if(cs.country == country) {
        this.totalActive = cs.active;
        this.totalDeaths = cs.deaths;
        this.totalConfirmed = cs.confirmed;
        this.totalRecovered = cs.recovered;
      }
    })

    this.selectedCountryData = this.dateWiseData[country]
    this.updateChart();
  }

}
