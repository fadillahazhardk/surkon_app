import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  //Download as excel things
  file_name = 'data';

  //
  method;
  showOutput = false;

  //Initial Data
  Rc; //Jari-jari lingkaran
  alpha1 = 0;
  alpha2 = 0;
  delta_C; //Besar Delta C (alpha2 - alpha1)
  Lc; //Panjang busur lingkaran
  n; //Jumlah Titik
  data_stakeOut = [];

  //Data for method 1
  a = 10; //Panjang busur segmen

  //Data for method 2
  Xn;
  deltaX = 9; //Panjang delta X harus <  10

  //Data for method 3
  phi;
  x = 10; //standard maximum baseline

  calculate() {
    // SHOW TABLE
    this.showOutput = true;

    //SHOW
    this.delta_C = this.alpha2 - this.alpha1;
    this.Lc = this.Rc * 2 * Math.PI * (this.delta_C / 360);
    switch (this.method) {
      case '1':
        this.n = Math.floor(this.Lc / this.a);
        this.a = this.Lc / this.n;

        for (let i = 1; i <= this.n; i++) {
          const phi = this.a / this.Rc;
          const phi_N = i * phi;
          const data = {
            titik: i,
            phi_N: phi_N * (180 / Math.PI),
            X_N: this.Rc * Math.sin(phi_N),
            Y_N: this.Rc - this.Rc * Math.cos(phi_N),
          };
          this.data_stakeOut.push(data);
        }
        break;
      case '2':
        this.Xn = this.Rc * Math.sin(this.delta_C * (Math.PI / 180));
        this.n = Math.floor(this.Xn / this.deltaX);
        this.deltaX = this.Xn / this.n;

        for (let i = 1; i <= this.n; i++) {
          const X_N = i * this.deltaX;
          const data = {
            titik: i,
            X_N,
            Y_N: this.Rc - (this.Rc ** 2 - X_N ** 2) ** 0.5,
          };
          this.data_stakeOut.push(data);
        }
        break;
      case '3':
        this.phi = (this.delta_C * (Math.PI / 180) * this.x) / this.Lc; //Radian
        this.n = this.delta_C / (this.phi * (180 / Math.PI));

        for (let i = 1; i <= this.n; i++) {
          const phi_N = (i * this.phi) / 2;
          const data = {
            titik: i,
            phi_N: phi_N * (180 / Math.PI),
            D_N: 2 * this.Rc * Math.sin(phi_N),
          };
          this.data_stakeOut.push(data);
        }

        //change phi to degree
        this.phi = this.phi * (180 / Math.PI);
    }
  }

  downloadTable(tableID, filename) {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement('a');

    document.body.appendChild(downloadLink);

    if ((navigator as any).msSaveOrOpenBlob) {
      var blob = new Blob(['\ufeff', tableHTML], {
        type: dataType,
      });
      (navigator as any).msSaveOrOpenBlob(blob, filename);
    } else {
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

      // Setting the file name
      downloadLink.download = filename;

      //triggering the function
      downloadLink.click();
    }
  }
}
