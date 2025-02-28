import { Injectable, inject } from '@angular/core';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firebaseX = inject(FirebaseX);  // ✅ Use inject() for FirebaseX

  async getToken() {
    const token = await this.firebaseX.getToken();
    console.log('Firebase Token:', token);
  }

  listenForNotifications() {
    this.firebaseX.onMessageReceived().subscribe(message => {
      console.log('Notification Received:', message);
    });
  }
}
