# 🐾 AdoptaPet

Aplicación móvil multiplataforma para la adopción responsable de animales, desarrollada con **Ionic Framework**, **Angular** y **Capacitor**.

![Ionic](https://img.shields.io/badge/Ionic-7.x-3880FF?logo=ionic)
![Angular](https://img.shields.io/badge/Angular-17.x-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Capacitor](https://img.shields.io/badge/Capacitor-5.x-119EFF?logo=capacitor)

---

## 📖 Descripción

**AdoptaPet** nace como un proyecto académico cuyo objetivo es conectar refugios de animales con personas interesadas en adoptar. La aplicación demuestra el potencial de las tecnologías híbridas modernas para crear experiencias móviles nativas utilizando conocimientos de desarrollo web.

Entre sus funcionalidades principales se incluyen:

- Visualización de historias de éxito y estadísticas de adopción.
- Formulario de perfil segmentado (datos personales, condiciones del hogar, preferencias).
- Integración con la cámara nativa para seleccionar una foto de perfil.
- Modo oscuro manual con persistencia.
- Contacto directo vía WhatsApp y correo electrónico mediante *deep links*.

---

## 🛠️ Tecnologías utilizadas

| Tecnología       | Propósito                                                                |
|-----------------|--------------------------------------------------------------------------|
| **Ionic 7**     | Componentes UI nativos (menú lateral, tarjetas, segmentos, etc.)        |
| **Angular 17**  | Enrutamiento, lazy loading, directivas estructurales, servicios         |
| **TypeScript**  | Tipado estático, async/await, mantenibilidad                            |
| **SCSS**        | Variables CSS globales, animaciones personalizadas                      |
| **Capacitor**   | Acceso a cámara y galería, compilación a APK/IPA                        |

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura modular basada en **lazy loading**:

- Cada página (`inicio`, `informacion-personal`, `contacto`) tiene su propio módulo y se carga bajo demanda, reduciendo el tiempo de inicio.
- Un servicio global (`ThemeService`) gestiona el cambio de tema claro/oscuro.
- El menú lateral (`ion-split-pane`) se adapta a pantallas grandes y móviles.

---

## 📱 Características destacadas

### 1. Gráfica de adopciones animada con CSS puro
```scss
.bar {
  transform-origin: bottom;
  animation: barGrow 1s ease-out forwards;
}
@keyframes barGrow {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
```

### 2. Formulario con pestañas (ngSwitch)
```html
<ion-segment [(ngModel)]="currentTab">...</ion-segment>
<div [ngSwitch]="currentTab">
  <ion-card *ngSwitchCase="'personal'">...</ion-card>
  ...
</div>
```

### 3. Cámara nativa con Capacitor
```typescript
const image = await Camera.getPhoto({
  quality: 90,
  source: CameraSource.Photos
});
```

### 4. Modo oscuro manual
```typescript
toggle() {
  this.darkMode = !this.darkMode;
  document.documentElement.classList.toggle('ion-palette-dark', this.darkMode);
}
```

---

## 🚀 Guía de ejecución local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (v16 o superior)
- [Git](https://git-scm.com/)
- Ionic CLI: `npm install -g @ionic/cli`

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/yhusleika/Ionic.git

# 2. Entrar al directorio
cd Ionic

# 3. Instalar dependencias
npm install

# 4. Levantar servidor de desarrollo
ionic serve
```

La aplicación se abrirá automáticamente en `http://localhost:8100`.  
Para simular un dispositivo móvil, abre las herramientas de desarrollador (F12) y activa el modo responsivo.

> **Nota:** Para probar la funcionalidad de la cámara en el navegador, asegúrate de que `main.ts` incluya:
> ```ts
> import { defineCustomElements } from '@ionic/pwa-elements/loader';
> defineCustomElements(window);
> ```

---

## 📁 Estructura de carpetas (relevante)

```
AdoptaPet/
├── src/
│   ├── app/
│   │   ├── app.component.html        # Menú lateral
│   │   ├── app-routing.module.ts     # Rutas con lazy loading
│   │   ├── services/
│   │   │   └── theme.service.ts      # Modo oscuro
│   │   ├── inicio/                   # Página de inicio
│   │   ├── informacion-personal/     # Perfil del adoptante
│   │   └── contacto/                 # Página de contacto
│   ├── assets/                       # Imágenes y recursos
│   ├── theme/
│   │   └── variables.scss            # Paleta de colores
│   ├── global.scss                   # Estilos globales
│   └── index.html
├── capacitor.config.ts
├── ionic.config.json
└── package.json
```

---

## 🤝 Contribuciones

Este proyecto fue desarrollado con fines académicos. Si deseas mejorarlo o reportar problemas, puedes abrir un *issue* o enviar un *pull request*.

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **MIT**. Puedes usarlo libremente para fines educativos o personales.

---

## ✉️ Contacto

- **Autor:** Yhusleika Molina
- **GitHub:** [@yhusleika](https://github.com/yhusleika)
- **Repositorio:** [https://github.com/yhusleika/Ionic.git](https://github.com/yhusleika/Ionic.git)

---

## 🙏 Agradecimientos

- Documentación oficial de Ionic, Angular y Capacitor.
- Asistencia de IA **Antigraviti** para la generación de fragmentos de código y lógica de programación.
- Comunidad open source por las herramientas utilizadas.

---

_Desarrollado con ❤️ para fomentar la adopción responsable de animales._
