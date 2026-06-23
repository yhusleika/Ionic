import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { AdoptionService, AdoptionApplication } from '../services/adoption.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit, OnDestroy {
  // Estado de los Modales
  isDonationModalOpen: boolean = false;
  isVolunteerModalOpen: boolean = false;

  // Lógica del Simulador de Donación
  donationAmount: number = 50;
  donationImpact = {
    title: 'Vacunación Completa',
    description: 'Cubre el esquema completo de vacunas y desparasitación para un perro o gato rescatado.',
    icon: 'medkit-outline',
    color: 'secondary'
  };

  // Lógica de Voluntariado
  volunteerDay: string = 'sabado';
  volunteerInterests = {
    walk: true,
    clean: false,
    events: false,
    media: false
  };

  // Tracking de Adopción Activa
  activeApplications: AdoptionApplication[] = [];
  isProfileComplete: boolean = false;

  private storageListener!: () => void;

  constructor(
    public theme: ThemeService,
    private adoptionService: AdoptionService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.refreshData();

    // Escuchar cambios de almacenamiento (por ejemplo, al guardar perfil o enviar solicitud)
    this.storageListener = () => {
      this.refreshData();
    };
    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy() {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
  }

  refreshData() {
    this.activeApplications = this.adoptionService.getApplications();
    this.isProfileComplete = this.adoptionService.isProfileComplete();
  }

  // Métodos de Donación
  openDonationModal() {
    this.isDonationModalOpen = true;
    this.updateDonationImpact(this.donationAmount);
  }

  closeDonationModal() {
    this.isDonationModalOpen = false;
  }

  onDonationChange(event: any) {
    const value = event.detail.value;
    this.donationAmount = value;
    this.updateDonationImpact(value);
  }

  setDonationPreset(amount: number) {
    this.donationAmount = amount;
    this.updateDonationImpact(amount);
  }

  updateDonationImpact(amount: number) {
    if (amount < 30) {
      this.donationImpact = {
        title: 'Alimento Semanal',
        description: 'Alimento nutritivo durante una semana completa para un perrito o gatito huérfano.',
        icon: 'pizza-outline',
        color: 'success'
      };
    } else if (amount < 80) {
      this.donationImpact = {
        title: 'Vacunación Completa',
        description: 'Cubre el esquema completo de vacunas y desparasitación para un perro o gato rescatado.',
        icon: 'medkit-outline',
        color: 'secondary'
      };
    } else if (amount < 150) {
      this.donationImpact = {
        title: 'Atención Médica Especializada',
        description: 'Permite realizar una esterilización quirúrgica y un chequeo médico completo con analítica.',
        icon: 'heart-circle-outline',
        color: 'tertiary'
      };
    } else {
      this.donationImpact = {
        title: 'Rescate y Acogida Integral',
        description: 'Cubre el rescate de la calle, alimentación, veterinario y estancia en refugio por un mes entero.',
        icon: 'home-outline',
        color: 'primary'
      };
    }
  }

  async confirmDonation() {
    this.closeDonationModal();
    const toast = await this.toastController.create({
      message: `¡Muchas gracias! Has simulado una donación de $${this.donationAmount}. Tu apoyo salva vidas. 🐾`,
      duration: 3500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  // Métodos de Voluntariado
  openVolunteerModal() {
    this.isVolunteerModalOpen = true;
  }

  closeVolunteerModal() {
    this.isVolunteerModalOpen = false;
  }

  getVolunteerInfo(): string {
    switch (this.volunteerDay) {
      case 'lunes':
        return 'Turno de mañana (9:00 - 12:00): Limpieza de caniles y alimentación de cachorros.';
      case 'miercoles':
        return 'Turno de tarde (14:00 - 17:00): Sesión de socialización de gatos y cepillado.';
      case 'sabado':
        return 'Jornada completa (10:00 - 14:00): Paseos al aire libre en el parque y juegos activos.';
      case 'domingo':
        return 'Turno especial (11:00 - 13:30): Apoyo en las jornadas presenciales de adopción.';
      default:
        return 'Turno flexible según necesidades de los refugios.';
    }
  }

  async confirmVolunteer() {
    this.closeVolunteerModal();
    const selectedInterests = Object.keys(this.volunteerInterests)
      .filter(k => this.volunteerInterests[k as keyof typeof this.volunteerInterests]);

    if (selectedInterests.length === 0) {
      const toast = await this.toastController.create({
        message: 'Por favor selecciona al menos una actividad de interés.',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    const toast = await this.toastController.create({
      message: `¡Registro exitoso! Te esperamos el próximo día para el voluntariado. Recibirás un correo con los detalles.`,
      duration: 3500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}
