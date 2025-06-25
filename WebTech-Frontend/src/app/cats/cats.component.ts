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

  getCatProfilePicUrl(catId: number): string {
    const catPhotosUrls = this.catsState.catPhotosUrls();
    if (catPhotosUrls?.has(catId)) {
      return catPhotosUrls.get(catId)![0];
    } else {
      throw new Error(`No photos found for cat with ID ${catId}. Default photo should have been set.`);
    }

  }

}
