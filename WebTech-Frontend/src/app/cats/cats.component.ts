import { Component, inject } from '@angular/core';
import { CatsStateService } from '../_services/cats/cats-state.service';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';

@Component({
  selector: 'app-cats',
  imports: [],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.scss'
})
export class CatsComponent {

  catsState = inject(CatsStateService);
  fetchService = inject(RestBackendFetchService);
  catPhotosUrls = new Map<number, string>();

  constructor() {
    
  }
}
