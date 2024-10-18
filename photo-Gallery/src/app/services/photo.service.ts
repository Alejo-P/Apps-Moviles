import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class PhotoService {
  public photos: UserPhoto[] = [];
  
  constructor() { }
  
  // Tomar una foto con la cámara
  public async takePhoto(): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    
    this.photos.unshift({
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath
    });
    
    return capturedPhoto;
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

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}