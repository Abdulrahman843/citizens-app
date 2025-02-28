import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../services/services.service';
import { Observable } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  imports: [IonicModule, CommonModule]
})
export class ServicesComponent {
  services$: Observable<any[]>;  // Holds services data
  private servicesService = inject(ServicesService);  // ✅ Inject Firestore Service

  constructor() {
    this.services$ = this.servicesService.getServices(); // Fetch services from Firestore
  }

  async requestService(serviceId: string) {
    try {
      await this.servicesService.requestService(serviceId);
      console.log('Service Requested Successfully');
    } catch (error) {
      console.error('Request Error:', error);
    }
  }
}
