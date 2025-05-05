import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Injectable } from '@angular/core';

// Importacion de modelos
import { UserPhoto } from '../models/user-photo.model';


@Injectable({
  providedIn: 'root' // Proporcionar el servicio en toda la aplicación
  // Se puede usar el servicio en cualquier parte de la aplicación
})
export class PhotoService {
  private photos: UserPhoto[] = [];
  public listPhotos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = "photos";
  
  constructor() { }
  
  // Tomar una foto con la cámara
  public async takePhoto(photoQuality: number = 100): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: photoQuality
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    
    // Guardar todas las fotos para mostrarlas en la galería
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
    return capturedPhoto;
  };

  // Funcion para cargar las fotos guardadas
  public async loadSaved() {
    // Obtener las fotos guardadas
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) || [] : []) as UserPhoto[];
    
    // Mostrar la foto obtenida
    for (let photo of this.photos) {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data
      });

      // WebviewPath es la ruta de la foto en el sistema de archivos
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;

      // Incluir el nombre del archivo en la foto
      photo.filepath = photo.filepath.substring(photo.filepath.lastIndexOf('/') + 1);
    };

    // Guardar las fotos en la variable listPhotos para mostrarlas en la galería
    this.listPhotos = [...this.photos];
  };

  // Eliminar una foto de la galería  
  public async deletePhoto(photo: UserPhoto) {
    // Eliminar la foto del sistema de archivos
    const photoIndex = this.photos.findIndex(p => p.filepath === photo.filepath);
    this.photos.splice(photoIndex, 1);
    this.listPhotos.splice(photoIndex, 1);
    // Eliminar la foto de la galería
    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
    await Filesystem.deleteFile({
      path: photo.filepath,
      directory: Directory.Data
    });
  };

  // Eliminar todas las fotos de la galería
  public async deleteAllPhotos() {
    // Eliminar todas las fotos del sistema de archivos
    for (let photo of this.photos) {
      await Filesystem.deleteFile({
        path: photo.filepath,
        directory: Directory.Data
      });
    }
    // Eliminar todas las fotos de la galería
    this.photos = [];
    this.listPhotos = [];
    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  };

  // Guardar la foto en el sistema de archivos
  private async savePicture(cameraPhoto: Photo) {
    // Cnvertir la foto a base64, para que pueda guardarla en el sistema de archivos
    const base64Data = await this.readAsBase64(cameraPhoto);
    
    // Escribe el archivo en el directorio de datos
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Obtener la ruta completa del archivo guardado
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };
  };

  // Lee la foto, y la convierte en
  private async readAsBase64(cameraPhoto: Photo) {
    // "Lee" el archivo en base64
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;  
  };

  // Convierte un blob en base64
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;  
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}