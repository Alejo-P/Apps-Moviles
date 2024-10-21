import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  pantalla:String = "";
  numeros = [];

  listaBotonesCalculadora = [
    {
      texto: '1',
      valor: 1
    },
    {
      texto: '2',
      valor: 2
    },
    {
      texto: '3',
      valor: 3
    },
    {
      texto: "+",
      valor: "+"
    },
    {
      texto: '4',
      valor: 4
    },
    {
      texto: '5',
      valor: 5
    },
    {
      texto: '6',
      valor: 6
    },
    {
      texto: '-',
      valor: '-'
    },
    {
      texto: '7',
      valor: 7
    },
    {
      texto: '8',
      valor: 8
    },
    {
      texto: '9',
      valor: 9
    },
    {
      texto: '*',
      valor: '*'
    },
    {
      texto: '0',
      valor: 0
    },
    
    
    
    {
      texto: '=',
      valor: '='
    },
    {
      texto: 'C',
      valor: 'C'
    }
  ]
  constructor() {}

  agregarNumero(value: string) {
    if (value === 'C') {
      return this.limpiarEntrada();
    }

    if (value === '=') {
      return this.calcular();
    }

    this.pantalla += value;
  }

  limpiarEntrada() {
    this.pantalla = '';
  }

  calcular() {
    try {
      this.pantalla = eval(this.pantalla.replace('÷', '/').replace('x', '*')).toString();
    } catch (error) {
      this.pantalla = 'Error';
    }
  }

}
