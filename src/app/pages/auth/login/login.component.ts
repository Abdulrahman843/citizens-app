import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ✅ Import FormsModule
import { AuthService } from '../../services/auth.service';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]  // ✅ Ensure FormsModule is included
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);

  async login() {
    if (!this.email || !this.password) {
      this.showToast('⚠️ Please enter email and password.', 'warning');
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.signIn(this.email, this.password);
      this.showToast('✅ Login Successful!', 'success');
      console.log('User signed in successfully');
    } catch (err) {
      console.error('Login Error:', err);
      this.showToast('❌ Login failed. Please check your credentials.', 'danger');
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
