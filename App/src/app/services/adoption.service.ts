import { Injectable } from '@angular/core';

export interface Pet {
  id: number;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: string;
  size: 'pequeno' | 'mediano' | 'grande';
  gender: 'Macho' | 'Hembra';
  description: string;
  image: string;
  isFavorite?: boolean;
  traits: {
    energy: number;
    sociability: number;
    training: number;
  };
}

export interface AdoptionApplication {
  petId: number;
  petName: string;
  petImage: string;
  status: 'recibida' | 'evaluacion' | 'entrevista' | 'aprobada';
  date: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
  birthdate: string;
  housing: string;
  otherPets: string;
  speciesPref: string;
  sizePref: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private pets: Pet[] = [
    {
      id: 1,
      name: 'Max',
      type: 'dog',
      breed: 'Golden Retriever Mix',
      age: '2 años',
      size: 'grande',
      gender: 'Macho',
      description: 'Max es un perro alegre, juguetón y lleno de energía. Le encanta correr al aire libre y es excelente con los niños. ¡Busca una familia activa!',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
      traits: { energy: 90, sociability: 95, training: 80 }
    },
    {
      id: 2,
      name: 'Luna',
      type: 'cat',
      breed: 'Siamesa',
      age: '1 año',
      size: 'pequeno',
      gender: 'Hembra',
      description: 'Luna es una gatita curiosa y muy cariñosa. Le encanta acurrucarse en tu regazo mientras trabajas y tiene un maullido muy dulce.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
      traits: { energy: 45, sociability: 85, training: 60 }
    },
    {
      id: 3,
      name: 'Rocky',
      type: 'dog',
      breed: 'Bulldog Francés',
      age: '4 años',
      size: 'mediano',
      gender: 'Macho',
      description: 'Rocky es tranquilo, sociable y perfecto para un apartamento. Pasa la mayor parte del día durmiendo, pero disfruta de paseos cortos.',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400',
      traits: { energy: 30, sociability: 80, training: 70 }
    },
    {
      id: 4,
      name: 'Bella',
      type: 'cat',
      breed: 'Común Europeo',
      age: '3 años',
      size: 'mediano',
      gender: 'Hembra',
      description: 'Bella es independiente y tranquila. Le gusta observar por la ventana y prefiere un ambiente relajado sin ruidos fuertes.',
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400',
      traits: { energy: 35, sociability: 50, training: 40 }
    },
    {
      id: 5,
      name: 'Coco',
      type: 'dog',
      breed: 'Poodle Toy',
      age: '8 meses',
      size: 'pequeno',
      gender: 'Macho',
      description: 'Coco es un cachorro juguetón, inteligente y muy fácil de entrenar. Siempre está alerta y listo para aprender nuevos trucos.',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
      traits: { energy: 85, sociability: 90, training: 90 }
    },
    {
      id: 6,
      name: 'Mimi',
      type: 'cat',
      breed: 'Persa Mix',
      age: '5 años',
      size: 'mediano',
      gender: 'Hembra',
      description: 'Mimi es majestuosa y calmada. Requiere cuidados especiales en su pelaje pero te recompensará con un ronroneo interminable.',
      image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=400',
      traits: { energy: 20, sociability: 60, training: 30 }
    }
  ];

  private favoritesKey = 'adoptapet_favorites';
  private applicationsKey = 'adoptapet_applications';
  private profileKey = 'adoptapet_profile';

  constructor() {
    this.loadFavorites();
  }

  getPets(): Pet[] {
    return this.pets;
  }

  getFavorites(): number[] {
    const favs = localStorage.getItem(this.favoritesKey);
    return favs ? JSON.parse(favs) : [];
  }

  loadFavorites() {
    const favIds = this.getFavorites();
    this.pets.forEach(pet => {
      pet.isFavorite = favIds.includes(pet.id);
    });
  }

  toggleFavorite(petId: number) {
    const favIds = this.getFavorites();
    const index = favIds.indexOf(petId);
    if (index > -1) {
      favIds.splice(index, 1);
    } else {
      favIds.push(petId);
    }
    localStorage.setItem(this.favoritesKey, JSON.stringify(favIds));
    this.loadFavorites();
  }

  getApplications(): AdoptionApplication[] {
    const apps = localStorage.getItem(this.applicationsKey);
    return apps ? JSON.parse(apps) : [];
  }

  submitApplication(pet: Pet): boolean {
    const apps = this.getApplications();
    if (apps.some(a => a.petId === pet.id)) {
      return false; // Ya solicitado
    }
    const newApp: AdoptionApplication = {
      petId: pet.id,
      petName: pet.name,
      petImage: pet.image,
      status: 'recibida',
      date: new Date().toLocaleDateString('es-ES')
    };
    apps.push(newApp);
    localStorage.setItem(this.applicationsKey, JSON.stringify(apps));
    
    // Simular el cambio de estado con el tiempo en segundo plano si es posible
    this.simulateStatusProgression(pet.id);
    return true;
  }

  private simulateStatusProgression(petId: number) {
    // Simulador dinámico que hace avanzar el estado de la adopción con timeouts
    setTimeout(() => {
      this.updateApplicationStatus(petId, 'evaluacion');
      
      // Si el perfil ya estaba completo, programar la entrevista
      if (this.isProfileComplete()) {
        setTimeout(() => {
          this.updateApplicationStatus(petId, 'entrevista');
        }, 15000);
      }
    }, 10000); // 10 segundos para evaluación
  }

  updateApplicationStatus(petId: number, status: 'recibida' | 'evaluacion' | 'entrevista' | 'aprobada') {
    const apps = this.getApplications();
    const app = apps.find(a => a.petId === petId);
    if (app) {
      app.status = status;
      localStorage.setItem(this.applicationsKey, JSON.stringify(apps));
      // Despachar un evento de almacenamiento para que otras vistas se enteren en tiempo real
      window.dispatchEvent(new Event('storage'));
    }
  }

  getUserProfile(): UserProfile {
    const profile = localStorage.getItem(this.profileKey);
    if (profile) {
      return JSON.parse(profile);
    }
    return {
      name: '',
      phone: '',
      address: '',
      birthdate: '',
      housing: 'casa',
      otherPets: 'no',
      speciesPref: 'perro',
      sizePref: 'mediano'
    };
  }

  saveUserProfile(profile: UserProfile) {
    localStorage.setItem(this.profileKey, JSON.stringify(profile));
    
    // Si se completó el perfil y hay solicitudes en 'evaluacion', avanzarlas a 'entrevista' tras un breve delay
    if (this.isProfileComplete()) {
      const apps = this.getApplications();
      apps.forEach(app => {
        if (app.status === 'evaluacion') {
          setTimeout(() => {
            this.updateApplicationStatus(app.petId, 'entrevista');
          }, 3000);
        }
      });
    }

    // Emitir evento de almacenamiento local para recarga de componentes
    window.dispatchEvent(new Event('storage'));
  }

  isProfileComplete(): boolean {
    const profile = this.getUserProfile();
    // Considerar incompleto si los campos principales están vacíos o tienen valores por defecto iniciales
    return !!(profile.name.trim() && profile.phone.trim() && profile.address.trim());
  }

  getQuizRecommendation(answers: { housing: string; time: string; company: string }): Pet[] {
    // Algoritmo dinámico de emparejamiento
    return this.pets.filter(pet => {
      let score = 0;
      
      // Ajuste de vivienda y tamaño
      if (answers.housing === 'apartamento') {
        if (pet.size === 'pequeno') score += 3;
        else if (pet.size === 'mediano') score += 1;
        else score -= 1; // Grande no es ideal
      } else {
        score += 2; // Casa/Finca acomodan cualquier tamaño
      }

      // Ajuste de tiempo libre y energía
      if (answers.time === 'poco') {
        if (pet.traits.energy < 40) score += 3;
        else if (pet.traits.energy < 70) score += 1;
        else score -= 2; // Muy activa requiere tiempo
      } else if (answers.time === 'mucho') {
        if (pet.traits.energy >= 70) score += 3;
        else score += 1;
      } else {
        if (pet.traits.energy >= 40 && pet.traits.energy < 70) score += 3;
        else score += 1.5;
      }

      // Ajuste de compañía
      if (answers.company === 'ninos' || answers.company === 'mascotas') {
        if (pet.traits.sociability > 75) score += 3;
        else score += 1;
      } else {
        score += 2; // Solo
      }

      return score >= 4.5;
    });
  }
}
