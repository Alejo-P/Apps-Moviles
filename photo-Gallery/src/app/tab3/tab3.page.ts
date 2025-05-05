import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../models/user-photo.model'; // Importar la interfaz UserPhoto para poder usarla en la galería
import { CameraResultType, CameraSource } from '@capacitor/camera'; // Importar los tipos de cámara

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
    public photoService: PhotoService
  ) {}
  // Almacenar las fotos en una variable local (parra poder mostrarlas en la galería) vacia
    // Se inicializa la variable photos como un array vacío para evitar errores al cargar las fotos guardadas
    public isLoadingPhotos = false; // Variable para controlar el estado de carga de fotos

  // Cargar las fotos guardadas al iniciar la página
  // Se ejecuta una vez que la página se ha inicializado
  async ngOnInit() {
    if (this.photoService.listPhotos.length > 0) return; // Evitar que se carguen fotos si ya se han cargado anteriormente
    await this.loadPhotos(); // Cargar las fotos guardadas al iniciar la página
  }

  // Funcion para cargar las fotos guardadas al presionar el botón
  async loadPhotos() {
    if (this.isLoadingPhotos) return; // Evitar que se carguen fotos si ya se están cargando
    this.isLoadingPhotos = true; // Cambiar el estado de carga a verdadero
    await this.photoService.loadSaved();
    this.isLoadingPhotos = false; // Cambiar el estado de carga a falso
  }

  // Funcion para eliminar una foto de la galería
  async deletePhoto(photo: UserPhoto) {
    // Eliminar la foto del array de fotos
    await this.photoService.deletePhoto(photo); // Eliminar la foto del sistema de archivos
    this.loadPhotos(); // Cargar las fotos restantes en la galería
  }

  // Funcion para eliminar todas las fotos de la galería
  async deleteAllPhotos() {
    await this.photoService.deleteAllPhotos(); // Eliminar todas las fotos del sistema de archivos
    this.loadPhotos(); // Cargar las fotos restantes en la galería
  }
}
