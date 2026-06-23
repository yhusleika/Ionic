import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { AdoptionService, Pet } from '../services/adoption.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-adoptar',
  templateUrl: './adoptar.page.html',
  styleUrls: ['./adoptar.page.scss'],
  standalone: false,
})
export class AdoptarPage implements OnInit, OnDestroy {
  activeTab: 'catalogo' | 'quiz' = 'catalogo';
  selectedSpecies: 'all' | 'dog' | 'cat' | 'favs' = 'all';
  searchQuery: string = '';

  pets: Pet[] = [];
  filteredPets: Pet[] = [];

  // Modal de Detalle
  selectedPet: Pet | null = null;
  isDetailsModalOpen: boolean = false;
  alreadyApplied: boolean = false;

  // Lógica del Quiz
  quizAnswers = {
    housing: 'casa',
    time: 'moderado',
    company: 'solo'
  };
  quizResults: Pet[] = [];
  quizSubmitted: boolean = false;

  private storageListener!: () => void;

  constructor(
    public theme: ThemeService,
    private adoptionService: AdoptionService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadPets();
    
    // Escuchar cambios de almacenamiento (por ejemplo, si marcan favorito desde otra pestaña)
    this.storageListener = () => {
      this.loadPets();
      if (this.selectedPet) {
        const updatedPet = this.pets.find(p => p.id === this.selectedPet!.id);
        if (updatedPet) {
          this.selectedPet = updatedPet;
        }
        this.checkIfApplied();
      }
    };
    window.addEventListener('storage', this.storageListener);
  }

  ngOnDestroy() {
    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }
  }

  loadPets() {
    this.pets = this.adoptionService.getPets();
    this.filterPets();
  }

  filterPets() {
    this.filteredPets = this.pets.filter(pet => {
      // Filtrar por especie / favoritos
      if (this.selectedSpecies === 'dog' && pet.type !== 'dog') return false;
      if (this.selectedSpecies === 'cat' && pet.type !== 'cat') return false;
      if (this.selectedSpecies === 'favs' && !pet.isFavorite) return false;

      // Filtrar por término de búsqueda
      if (this.searchQuery && this.searchQuery.trim() !== '') {
        const q = this.searchQuery.toLowerCase();
        return (
          pet.name.toLowerCase().includes(q) ||
          pet.breed.toLowerCase().includes(q) ||
          pet.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value;
    this.filterPets();
  }

  setSpeciesFilter(filter: 'all' | 'dog' | 'cat' | 'favs') {
    this.selectedSpecies = filter;
    this.filterPets();
  }

  toggleFavorite(event: Event, petId: number) {
    event.stopPropagation(); // Evitar abrir el modal al presionar favorito
    this.adoptionService.toggleFavorite(petId);
    this.loadPets();
  }

  openDetails(pet: Pet) {
    this.selectedPet = pet;
    this.checkIfApplied();
    this.isDetailsModalOpen = true;
  }

  closeDetails() {
    this.isDetailsModalOpen = false;
    this.selectedPet = null;
  }

  checkIfApplied() {
    if (!this.selectedPet) return;
    const apps = this.adoptionService.getApplications();
    this.alreadyApplied = apps.some(app => app.petId === this.selectedPet!.id);
  }

  async submitAdoption() {
    if (!this.selectedPet) return;

    const success = this.adoptionService.submitApplication(this.selectedPet);
    if (success) {
      this.alreadyApplied = true;
      const isComplete = this.adoptionService.isProfileComplete();
      
      let message = `¡Solicitud para adoptar a ${this.selectedPet.name} enviada con éxito!`;
      if (!isComplete) {
        message += ' Recuerda completar tus datos en tu perfil.';
      }

      const toast = await this.toastController.create({
        message: message,
        duration: 4000,
        color: 'success',
        position: 'bottom',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel'
          }
        ]
      });
      await toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Ya has enviado una solicitud para esta mascota anteriormente.',
        duration: 3000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  // Lógica del Quiz
  submitQuiz() {
    this.quizResults = this.adoptionService.getQuizRecommendation(this.quizAnswers);
    this.quizSubmitted = true;
  }

  resetQuiz() {
    this.quizAnswers = {
      housing: 'casa',
      time: 'moderado',
      company: 'solo'
    };
    this.quizResults = [];
    this.quizSubmitted = false;
  }
}
