import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [CommonModule, FormsModule] // ✅ Ensure FormsModule is imported
})
export class RegisterPage {
  email = '';
  password = '';

  register() {
    console.log('Registering user:', this.email);
    // ✅ Add Firebase Auth or backend call here
  }
}
