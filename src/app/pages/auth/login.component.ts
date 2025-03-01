import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service'; // ✅ Absolute Path
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ✅ Correctly placed
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
      const success = await this.authService.signIn(this.email, this.password);
      if (success) {
        this.showToast('✅ Login Successful!', 'success');
        this.router.navigate(['/home']); // ✅ Redirect after login
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
