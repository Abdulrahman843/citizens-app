import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Auth, User, user } from '@angular/fire/auth';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private firestore = inject(Firestore);  // ✅ Inject Firestore
  private auth = inject(Auth);  // ✅ Inject Firebase Auth
  private ngZone = inject(NgZone);  // ✅ Fix Firebase injection issue

  constructor() {}

  // ✅ Fetch list of government services from Firestore
  getServices(): Observable<any[]> {
    const servicesRef = collection(this.firestore, 'services');
    return collectionData(servicesRef, { idField: 'id' });
  }

  // ✅ Fetch currently authenticated user using NgZone to fix injection issue
  async getCurrentUser(): Promise<User | null> {
    return this.ngZone.run(() => firstValueFrom(user(this.auth)));
  }

  // ✅ Request a government service with the authenticated user ID
  async requestService(serviceId: string) {
    try {
      const userData = await this.getCurrentUser(); // Get authenticated user

      if (!userData) {
        console.warn("⚠️ No authenticated user found.");
        return;
      }

      const userId = userData.uid; // ✅ Get Firebase user ID

      await addDoc(collection(this.firestore, 'requests'), {
        serviceId,
        userId,
        status: 'Pending',
        createdAt: new Date()
      });

      console.log('✅ Service Requested Successfully');
    } catch (error) {
      console.error('❌ Request Service Error:', error);
    }
  }

  // ✅ Get details of a single service by ID
  async getServiceById(serviceId: string) {
    const docRef = doc(this.firestore, `services/${serviceId}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async addService(service: any) {
    const servicesRef = collection(this.firestore, 'services');
    return addDoc(servicesRef, service);
  }
}
