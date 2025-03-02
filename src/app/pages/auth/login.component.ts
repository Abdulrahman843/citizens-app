import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // ✅ Correct Absolute Path

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule // ✅ Ensure it's included correctly
  ]
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);
  private router = inject(Router); // ✅ Router Injection for Navigation

  async login() {
    if (!this.email || !this.password) {
      this.showToast('⚠️ Please enter email and password.', 'warning');
      return;
    }

    this.isLoading = true;
    try {
      const userCredential = await this.authService.signIn(this.email, this.password);
      if (userCredential && userCredential.user) { // ✅ Proper user check
        this.showToast('✅ Login Successful!', 'success');
        this.router.navigate(['/home']);
      } else {
        this.showToast('❌ Invalid credentials', 'danger');
      }
    } catch (err) {
      console.error('Login Error:', err);
      this.showToast('❌ Login failed.', 'danger');
    } finally {
      this.isLoading = false;
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
