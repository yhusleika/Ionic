import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Adoptar Mascota', url: '/adoptar', icon: 'paw' },
    { title: 'Información Personal', url: '/informacion-personal', icon: 'person' },
    { title: 'Contacto', url: '/contacto', icon: 'call' },
  ];
  public labels = [];
  constructor() {}
}
