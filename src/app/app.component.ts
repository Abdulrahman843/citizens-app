import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FirestoreService } from './services/firestore.service'; // ✅ Firestore DB
import { NotificationService } from './services/notification.service'; // ✅ Firebase Messaging (FCM)
import { ServicesService } from './services/services.service'; // ✅ Firestore service population
import { Auth } from '@angular/fire/auth';  // ✅ Import Auth properly
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private firestoreService = inject(FirestoreService);  // ✅ Inject Firestore Service
  private notificationService = inject(NotificationService);  // ✅ Inject Notification Service
  private servicesService = inject(ServicesService);  // ✅ Inject Firestore Services
  private auth = inject(Auth);

  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    console.log("🚀 Citizens App Initialized");

    // ✅ Only run FirebaseX on a real device (prevent `cordova_not_available` error)
    if (this.isCordovaAvailable()) {
      console.log("📲 Running on a real device, initializing FirebaseX...");
      await this.initializeNotifications();
    } else {
      console.warn("⚠️ Running in a browser: FirebaseX features are disabled.");
    }

    // ✅ Populate Firestore with Government Services (Only runs if services are missing)
    await this.addSampleServices();
  }

  // ✅ Check if running on a real device
  private isCordovaAvailable(): boolean {
    return !!(window as any).cordova; // ✅ Ensure Cordova is available
  }

  // ✅ Initialize Firebase Notifications properly
  private async initializeNotifications() {
    try {
      await this.notificationService.requestPermission();
      this.notificationService.listenForNotifications();
    } catch (error) {
      console.error("❌ Error initializing Firebase Notifications:", error);
    }
  }

  // ✅ Add sample government services to Firestore if not already populated
  async addSampleServices() {
    const services = [
      { name: 'Tax Payment', description: 'Pay your taxes online.', category: 'Finance', price: 100 },
      { name: 'Passport Renewal', description: 'Apply for a new passport or renew an existing one.', category: 'Identity', price: 200 },
      { name: 'Driver\'s License', description: 'Apply for a new driver\'s license or renew an expired one.', category: 'Transport', price: 150 },
    ];

    try {
      // ✅ Use `firstValueFrom()` instead of `.toPromise()`
      const existingServices = await firstValueFrom(this.firestoreService.getServices());

      if (existingServices && existingServices.length > 0) {
        console.log('✅ Services already exist in Firestore. Skipping population.');
        return;
      }

      for (const service of services) {
        await this.servicesService.addService(service);
      }
      console.log('✅ Sample services added successfully!');
    } catch (error) {
      console.error('❌ Error adding services:', error);
    }
  }
}
