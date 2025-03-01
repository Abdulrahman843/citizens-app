import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home/home.page';
import { LoginPage } from './pages/auth/login/login.page';
import { RegisterPage } from './pages/auth/register/register.page';
import { ServicesComponent } from './pages/services/services.component';
import { CommunityComponent } from './pages/community/community.component';
import { AuthGuard } from './pages/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'services', component: ServicesComponent },
  { path: 'community', component: CommunityComponent },
  { path: '**', redirectTo: 'home' }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
