import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { RouterLink } from '@angular/router';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { RestBackendErrorHandlerService } from '../_services/rest-backend/rest-backend-error-handler.service';
import { CatResponse } from '../_types/cat-response.type';
import { REST_BACKEND_URL } from '../_config/rest-backend-url';
import { CatUploadFormComponent } from '../cat-upload-form/cat-upload-form.component';
import { PLACEHOLDER } from '../_config/placeholder';



@Component({
  selector: 'app-cats',
  imports: [RouterLink, CatUploadFormComponent],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.scss'
})
export class CatsComponent {
  authState = inject(AuthService);
  fetchService = inject(RestBackendFetchService);
  errService = inject(RestBackendErrorHandlerService);

  cats = signal<CatResponse[]>([]);

  constructor() {
    this.fetchService.getCats().subscribe({
      next: (cats) => {
        this.cats.set(cats);
      },
      error: (error) => {
        this.errService.handleError(error);
      }
    });
  }

  getProfilePictureUrl(cat: CatResponse): string {
    if (cat.profilePicture) {
      return `${REST_BACKEND_URL}/cats/${cat.id}/photos/${cat.profilePicture}/send`;
    }
    return `${PLACEHOLDER}`;
  }
}
