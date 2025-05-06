import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../models/user-photo.model'; // Importar la interfaz UserPhoto para poder usarla en la galería
import { ToastController } from '@ionic/angular/standalone'; // Importar el controlador de Toast para mostrar mensajes emergentes

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public toastButtons = [
    {
      text: '✖️ Dismiss',
      role: 'cancel',
      handler: () => {
        console.log('Dismiss toast');
      },
    },
  ];

  constructor(
    public photoService: PhotoService,
    private toastController: ToastController // Inyectar el controlador de Toast para mostrar mensajes emergentes
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
    const confirmDelete = confirm(`¿Está seguro de que desea eliminar la foto ${photo.filepath.split('/').pop()}?`); // Confirmar si el usuario desea eliminar la foto
    if (!confirmDelete) return; // Si el usuario no confirma, no se elimina la foto

    // Eliminar la foto del array de fotos
    await this.photoService.deletePhoto(photo); // Eliminar la foto del sistema de archivos
    await this.loadPhotos(); // Cargar las fotos restantes en la galería
    await this.presentToast('bottom', `Foto ${photo.filepath.split('/').pop()} eliminada correctamente`);
  }

  // Funcion para eliminar todas las fotos de la galería
  async deleteAllPhotos() {
    const confirmDelete = confirm('¿Está seguro de que desea eliminar todas las fotos?'); // Confirmar si el usuario desea eliminar todas las fotos
    if (!confirmDelete) return; // Si el usuario no confirma, no se eliminan las fotos

    await this.photoService.deleteAllPhotos(); // Eliminar todas las fotos del sistema de archivos
    await this.loadPhotos(); // Cargar las fotos restantes en la galería
    await this.presentToast('bottom', 'Todas las fotos eliminadas correctamente'); // Mostrar mensaje de éxito
  }

  async presentToast(position: 'top' | 'middle' | 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      color: message.includes('Error') ? 'danger' : 'success',
      duration: 1500,
      position: position,
      swipeGesture: 'vertical',
      layout: 'stacked',
      buttons: this.toastButtons,
      positionAnchor: 'footer'
    });

    await toast.present();
  }
}
