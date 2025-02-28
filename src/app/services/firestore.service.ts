import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);

  constructor() {}

  // ✅ Fetch all government services
  getServices(): Observable<any[]> {
    if (!this.firestore) {
      console.error("❌ Firestore is not initialized.");
      return new Observable(); // ✅ Prevent crashes
    }

    const servicesRef = collection(this.firestore, 'services');
    return collectionData(servicesRef, { idField: 'id' });
  }

  // ✅ Request a government service
  async requestService(serviceId: string, userId: string) {
    const requestRef = collection(this.firestore, 'requests');
    return addDoc(requestRef, {
      serviceId,
      userId,
      status: 'Pending',
      createdAt: serverTimestamp()
    });
  }

  // ✅ Get a single service by ID
  async getServiceById(serviceId: string) {
    const docRef = doc(this.firestore, `services/${serviceId}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  // ✅ Fetch all community discussion posts
  getCommunityPosts(): Observable<any[]> {
    const postsRef = collection(this.firestore, 'community-posts');
    return collectionData(postsRef, { idField: 'id' });
  }

  // ✅ Add a new community post
  async addCommunityPost(userId: string, message: string) {
    return addDoc(collection(this.firestore, 'community-posts'), {
      userId,
      message,
      timestamp: serverTimestamp()
    });
  }
}
