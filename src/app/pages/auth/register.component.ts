import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ✅ Add this line
})
export class RegisterComponent {
  email = '';
  password = '';
  isLoading = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  async register() {
    if (!this.email || !this.password) {
      this.showToast('⚠️ Please enter email and password.', 'warning');
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.register(this.email, this.password);
      this.showToast('✅ Registration Successful!', 'success');
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Registration Error:', err);
      this.showToast('❌ Registration failed.', 'danger');
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
