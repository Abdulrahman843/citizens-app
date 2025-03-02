import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegisterComponent } from 'src/app/pages/auth/register.component'; // ✅ Ensure correct import path

@Component({
  selector: 'app-register-page',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    RegisterComponent // ✅ Fix: Ensure it's correctly recognized
  ]
})
export class RegisterPage {}
