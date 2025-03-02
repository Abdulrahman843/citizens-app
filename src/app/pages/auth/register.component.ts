import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class RegisterComponent {
  email = '';
  password = '';
  isLoading = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController); // ✅ Inject ToastController

  async register() {
    if (!this.email || !this.password) {
      this.showToast('⚠️ Please enter email and password.', 'warning'); // ✅ Now exists
      return;
    }

    this.isLoading = true;
    try {
      const userCredential = await this.authService.signUp(this.email, this.password);
      if (userCredential && userCredential.user) {
        this.showToast('✅ Registration Successful! Redirecting...', 'success');

        // ✅ Clear form fields after successful registration
        this.email = '';
        this.password = '';

        // ✅ Navigate to Login Page with error handling
        this.router.navigate(['/login']).then(() => {
          console.log("✅ Navigation Successful!");
        }).catch(err => {
          console.error("⚠️ Navigation Error:", err);
          // ✅ Fallback if Angular navigation fails
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        });
      } else {
        this.showToast('❌ Registration failed. Try again.', 'danger');
      }
    } catch (err: unknown) {
      console.error('Registration Error:', err);

      // ✅ Ensure `err` is cast properly
      const errorMessage = (err as Error).message || "An unknown error occurred";
      this.showToast(`❌ Registration failed. ${errorMessage}`, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  // ✅ Add the missing showToast() method
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
