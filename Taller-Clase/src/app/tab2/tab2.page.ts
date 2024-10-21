import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  // Lista de habilidades
  skills = [
    { name: 'HTML', progress: 0.5 },
    { name: 'CSS', progress: 0.4 },
    { name: 'JavaScript', progress: 0.7 },
    { name: 'React', progress: 0.4 },
    { name: 'Node', progress: 0.55 },
    { name: 'Express', progress: 0.65 },
    { name: 'Java', progress: 0.55 },
    { name: 'Python', progress: 0.75 }
  ];

  // Lista de proyectos
  projects = [
    { name:'NodeSetup', version:'2.1.0', desc:'Aplicación GUI en Python para la configuración de un directorio como proyecto de Node.js. Nacio de la idea de poder juntar la mayoria de modulos NPM y configuraciones vistas en la asignatura Aplicaciones web de 4° semestre de la carrera de Desarrollo de Software de la EPN', link:'https://github.com/Alejo-P/NodeSetup-APP', dateC:"2024-05-26"},
    { name:'Main App (Beta)', version:'0.0.7 (Dev)', desc:'Aplicación GUI de escritorio (en desarrollo) para realizar distintas acciones con conjuntos de datos, la aplicación surgió de una idea de juntar la mayor parte de contenidos vistos en la asignatura de 3° semestre Analisis de Datos de la carrera de Desarrollo de Software de la EPN, el nombre de la aplicación puede cambiar durante la fase de desarrollo', link:undefined, dateC:"2023-11-15"},
  ]

  // Lista para contacto
  contacts = [
    { name: 'Email', value: 'marcelo.pinzon@epn.edu.ec', icon: 'mail' },
    { name: 'Teléfono', value: '+593 99 847 2631', icon: 'call' },
    { name: 'Dirección', value: 'Quito, Ecuador', icon: 'location' }
  ];
  constructor() {}

  // Función para obtener el color de la barra de progreso
  getColor(progress: number): string {
    if (progress <= 0.4) {
      return 'danger';
    } else if (progress <= 0.6) {
      return 'warning';
    } else {
      return 'success';
    }
  }

}
