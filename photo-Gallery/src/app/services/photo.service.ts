import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// Importar el plugin de archivos del sistema de archivos
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
  private PHOTO_STORAGE: string = "photos"; // Nombre de la clave para almacenar las fotos en el almacenamiento local
  private DIRECTORY = Directory.Data; // Obtener el directorio de almacenamiento de fotos (en web no se necesita carpeta)
  
  constructor() { }
  
  // Tomar una foto con la cámara
  public async takePhoto(photoQuality: number = 100): Promise<string> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: photoQuality
      });
  
      const savedImageFile = await this.savePicture(capturedPhoto);
      if (!savedImageFile) throw new Error('No se pudo guardar la foto');
  
      this.photos.unshift(savedImageFile);
  
      await Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos)
      });
  
      return '📸 Foto guardada exitosamente';
    } catch (error) {
      console.error('❌ Error al tomar o guardar la foto:', error);
      return '❌ Error al tomar o guardar la foto';
    }
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
        directory: this.DIRECTORY
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
      directory: this.DIRECTORY
    });
  };

  // Eliminar todas las fotos de la galería
  public async deleteAllPhotos() {
    // Eliminar todas las fotos del sistema de archivos
    for (let photo of this.photos) {
      await Filesystem.deleteFile({
        path: photo.filepath,
        directory: this.DIRECTORY
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
  private async savePicture(cameraPhoto: Photo): Promise<UserPhoto | null> {
    try {
      const base64Data = await this.readAsBase64(cameraPhoto);
      const date = new Date();
      const fecha_actual = date.toISOString().split('T')[0];
      const hora_actual = date.toTimeString().split(' ')[0];
      const fileName = `PhotoGalleryImage_${fecha_actual}_${hora_actual}.jpeg`;

      await Filesystem.writeFile({
        path: `${fileName}`,
        data: base64Data,
        directory: this.DIRECTORY,
        recursive: true
      });

      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    } catch (error) {
      console.error('❌ Error al guardar la foto:', error);
      return null;
    }
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