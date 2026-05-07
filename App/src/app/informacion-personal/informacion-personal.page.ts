import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-informacion-personal',
  templateUrl: './informacion-personal.page.html',
  styleUrls: ['./informacion-personal.page.scss'],
  standalone: false,
})
export class InformacionPersonalPage implements OnInit {
  currentTab = 'personal';
  profileImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  constructor(public theme: ThemeService) { }

  ngOnInit() {
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
      }
    } catch (error) {
      console.log('Selección de foto cancelada o con error', error);
    }
  }
}
