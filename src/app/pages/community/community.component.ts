import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../services/firestore.service';
import { Observable } from 'rxjs';
import { Auth, user, User } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-community',
  standalone: true,
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CommunityComponent {
  posts$: Observable<any[]>;
  private firestoreService = inject(FirestoreService);
  private auth = inject(Auth);
  private ngZone = inject(NgZone);
  private toastCtrl = inject(ToastController);

  message = '';
  userId = '';
  isLoading = true;

  constructor() {
    this.posts$ = this.firestoreService.getCommunityPosts();
    this.initializeUser();
  }

  async initializeUser() {
    try {
      const currentUser = await this.getCurrentUser();
      this.ngZone.run(() => {
        this.userId = currentUser?.uid || '';
        this.isLoading = false;
      });
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      this.isLoading = false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return firstValueFrom(user(this.auth));
  }

  async sendMessage() {
    if (!this.userId) {
      this.showToast('⚠️ You must be logged in to send a message', 'warning');
      return;
    }

    if (this.message.trim()) {
      try {
        await this.firestoreService.addCommunityPost(this.userId, this.message);
        this.message = '';
        this.showToast('✅ Message sent successfully!', 'success');
      } catch (error) {
        console.error('❌ Error sending message:', error);
        this.showToast('❌ Failed to send message. Try again.', 'danger');
      }
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
