import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { AdoptionService, UserProfile } from '../services/adoption.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-informacion-personal',
  templateUrl: './informacion-personal.page.html',
  styleUrls: ['./informacion-personal.page.scss'],
  standalone: false,
})
export class InformacionPersonalPage implements OnInit {
  currentTab = 'personal';
  profileImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  profile: UserProfile = {
    name: '',
    phone: '',
    address: '',
    birthdate: '',
    housing: 'casa',
    otherPets: 'no',
    speciesPref: 'perro',
    sizePref: 'mediano'
  };

  constructor(
    public theme: ThemeService,
    private adoptionService: AdoptionService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.profile = this.adoptionService.getUserProfile();
    const savedImage = localStorage.getItem('adoptapet_profile_image');
    if (savedImage) {
      this.profileImage = savedImage;
    }
  }

  async saveProfile() {
    this.adoptionService.saveUserProfile(this.profile);
    const toast = await this.toastController.create({
      message: '¡Perfil guardado correctamente! Tu información ha sido actualizada.',
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  async changeProfilePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos // Selección desde la galería
      });

      if (image.webPath) {
        this.profileImage = image.webPath;
        localStorage.setItem('adoptapet_profile_image', image.webPath);
      }
    } catch (error) {
      console.log('Selección de foto cancelada o con error', error);
    }
  }
}
