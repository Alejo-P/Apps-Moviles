import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {environment} from '../environments/environment'
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    //Usar las credenciales de la variable environment
    //provideFirebaseApp(() => initializeApp({"projectId":"b-1accc","appId":"1:606986248368:web:df6c0a16fa5bc4ed9a9b75","storageBucket":"b-1accc.firebasestorage.app","apiKey":"AIzaSyDp4RCs8UwhBrTNivTVoBkbDwQ_s1LYxLI","authDomain":"b-1accc.firebaseapp.com","messagingSenderId":"606986248368","measurementId":"G-QDN8GEEH17"})), provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment)), provideFirestore(() => getFirestore())
  ], 
  bootstrap: [AppComponent],
})
export class AppModule {}
