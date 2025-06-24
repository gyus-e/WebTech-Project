import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CatResponse } from '../../_types/cat-response.type';
import { RestBackendFetchService } from '../rest-backend/rest-backend-fetch.service';

@Injectable({
  providedIn: 'root'
})
export class CatsStateService {
  
  cats = computed(() => this.catsSignal());
  
  private readonly catsSignal = signal<CatResponse[] | null> (null);
  private readonly restFetchService = inject(RestBackendFetchService);


  constructor() {
    this.restFetchService.getCats().subscribe({

      next: (cats: CatResponse[]) => {
        this.catsSignal.set(cats);
      },

      error: (error) => {
        console.error('Error fetching cats:', error);
      }

    });

  }


}
