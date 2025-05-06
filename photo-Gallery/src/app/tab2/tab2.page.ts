import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular/standalone'; // Importar el controlador de Toast para mostrar mensajes emergentes

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
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

  async addPhotoToGallery(quality: number) {
    const response = await this.photoService.takePhoto(quality);
    await this.presentToast('bottom', response); // Mostrar el mensaje de respuesta en la parte superior
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
