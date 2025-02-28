import { Injectable, NgZone } from '@angular/core';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { Firestore, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Auth, user, User, signOut } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private currentUser: User | null = null; // ✅ Track logged-in user

  constructor(
    private firebaseX: FirebaseX, // ✅ Inject FirebaseX via constructor
    private firestore: Firestore,
    private auth: Auth,
    private ngZone: NgZone
  ) {
    this.monitorAuthState();
  }

  // ✅ Monitor authentication state changes
  private async monitorAuthState() {
    this.ngZone.run(async () => {
      this.currentUser = await this.getCurrentUser();
      if (this.currentUser) {
        console.log('👤 Logged-in user:', this.currentUser.uid);
        await this.requestPermission(); // ✅ Request FCM token for logged-in users
      } else {
        console.warn('⚠️ No user logged in. Notifications disabled.');
      }
    });
  }

  // ✅ Get the logged-in user
  async getCurrentUser(): Promise<User | null> {
    return firstValueFrom(user(this.auth));
  }

  // ✅ Check if app is running on a real device
  private isCordovaAvailable(): boolean {
    return !!(window as any).cordova; // ✅ Check for Cordova
  }

  // ✅ Request user permission and get FCM token
  async requestPermission() {
    if (!this.isCordovaAvailable()) {
      console.warn('⚠️ FirebaseX only works on real devices. Skipping FCM setup.');
      return;
    }

    try {
      const token = await this.firebaseX.getToken(); // ✅ Get the device token
      console.log('🔥 FCM Token:', token);

      if (!token) {
        console.warn('⚠️ No FCM token retrieved.');
        return null;
      }

      if (this.currentUser) {
        await this.saveTokenToFirestore(this.currentUser.uid, token);
      } else {
        console.warn('⚠️ No authenticated user. Token not saved.');
      }

      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      return null;
    }
  }

  // ✅ Save the FCM Token to Firestore for targeted notifications
  private async saveTokenToFirestore(userId: string | null, token: string) {
    if (!userId) {
      console.warn('⚠️ Cannot save token: No user ID.');
      return;
    }
    try {
      const tokenRef = doc(this.firestore, `users/${userId}`);
      await setDoc(tokenRef, { fcmToken: token }, { merge: true });
      console.log(`✅ Token saved for user: ${userId}`);
    } catch (error) {
      console.error('❌ Error saving FCM token to Firestore:', error);
    }
  }

  // ✅ Remove FCM token when user logs out
  async removeTokenFromFirestore(userId: string | null) {
    if (!userId) {
      console.warn('⚠️ Cannot remove token: No user ID.');
      return;
    }
    try {
      const tokenRef = doc(this.firestore, `users/${userId}`);
      await deleteDoc(tokenRef);
      console.log(`🔴 FCM Token removed for user: ${userId}`);
    } catch (error) {
      console.error('❌ Error removing FCM token:', error);
    }
  }

  // ✅ Listen for foreground notifications
  listenForNotifications() {
    if (!this.isCordovaAvailable()) {
      console.warn('⚠️ FirebaseX only works on real devices. Skipping notification listening.');
      return;
    }

    this.firebaseX.onMessageReceived().subscribe((message: any) => {
      console.log('📩 Notification Received:', message);
    });
  }

  // ✅ Logout user and remove FCM token
  async logout() {
    if (this.currentUser) {
      await this.removeTokenFromFirestore(this.currentUser.uid);
    }
    await signOut(this.auth);
    this.currentUser = null;
    console.log('🚪 User logged out and FCM token removed.');
  }
}
