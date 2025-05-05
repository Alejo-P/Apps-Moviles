import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    public photoService: PhotoService,
  ) {}
  public showModal = false; // Variable para controlar la visibilidad del modal

  addPhotoToGallery(quality: number) {
    this.photoService.takePhoto(quality);
  }
}
