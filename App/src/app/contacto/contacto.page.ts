import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { AdoptionService } from '../services/adoption.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: false,
})
export class ContactoPage implements OnInit {
  senderName: string = '';
  senderEmail: string = 'usuario@comuniapp.com';
  subject: string = '';
  message: string = '';
  isSending: boolean = false;

  constructor(
    public theme: ThemeService,
    private adoptionService: AdoptionService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const profile = this.adoptionService.getUserProfile();
    if (profile && profile.name) {
      this.senderName = profile.name;
    }
  }

  async sendMessage() {
    if (!this.senderName.trim() || !this.senderEmail.trim() || !this.subject.trim() || !this.message.trim()) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos del formulario.',
        duration: 3000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    // Expresión regular simple para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.senderEmail)) {
      const toast = await this.toastController.create({
        message: 'Por favor, introduce un correo electrónico válido.',
        duration: 3000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    this.isSending = true;

    // Simular retraso de envío por red (2 segundos)
    setTimeout(async () => {
      this.isSending = false;

      const alert = await this.alertController.create({
        header: '📬 ¡Mensaje Enviado!',
        subHeader: 'Correo Enviado Exitosamente',
        message: `Hemos enviado tu mensaje con el asunto "${this.subject}" al refugio. Nos pondremos en contacto contigo en ${this.senderEmail} a la brevedad. ¡Gracias por querer ayudar! 🐾`,
        buttons: ['Entendido']
      });

      await alert.present();

      // Limpiar campos de asunto y mensaje
      this.subject = '';
      this.message = '';
    }, 2000);
  }
}
