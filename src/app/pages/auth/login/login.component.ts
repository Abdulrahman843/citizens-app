import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ✅ Import FormsModule
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // ✅ Add this line
})

export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);

  async login() {
    if (!this.email || !this.password) {
      this.showToast('⚠️ Please enter email and password.', 'warning');
      return;
    }

    this.isLoading = true;
    try {
      const userCredential = await this.authService.signIn(this.email, this.password);
      if (userCredential && userCredential.user) {
        this.showToast('✅ Login Successful!', 'success');

        // ✅ Clear form fields after successful login
        this.email = '';
        this.password = '';

        // ✅ Redirect to Home Page (or another page)
        this.router.navigate(['/home']);

        // ✅ Fallback in case Angular navigation fails
        setTimeout(() => {
          window.location.href = "/home";
        }, 1000);
      } else {
        this.showToast('❌ Invalid credentials', 'danger');
      }
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
