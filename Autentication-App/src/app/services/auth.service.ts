import { Injectable } from '@angular/core';

import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { } 

  // Metodo para registrar un usuario
  async register({email, password}: {email: string, password: string}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      return
    }
  };

  // Metodo para iniciar sesion
  async login({email, password}: {email: string, password: string}) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential;
    } catch (error) {
      return
    }
  };

  // Metodo para cerrar sesion
  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      return
    }
  };
}
