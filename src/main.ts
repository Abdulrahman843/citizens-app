import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { routes } from './app/app.routes';  // ✅ Ensure this file exists
import { AppComponent } from './app/app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { environment } from './environments/environment';
import { AuthService } from './app/services/auth.service';  // ✅ Ensure correct import
import { NotificationService } from './app/services/notification.service';  // ✅ Ensure correct import

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)), // ✅ Initialize Firebase
    provideAuth(() => getAuth()),  // ✅ Ensure Firebase Auth is available
    provideFirestore(() => getFirestore()),  // ✅ Firestore for database
    provideStorage(() => getStorage()),  // ✅ Storage for images/files
    provideMessaging(() => getMessaging()),  // ✅ Provide Firebase Messaging
    FirebaseX, // ✅ Add FirebaseX as a provider
    NotificationService, // ✅ Explicitly provide NotificationService
    AuthService  // ✅ Explicitly provide AuthService
  ],
}).catch(err => console.error(err));
