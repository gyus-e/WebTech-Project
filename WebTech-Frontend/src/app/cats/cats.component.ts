import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { RestBackendErrorHandlerService } from '../_services/rest-backend/rest-backend-error-handler.service';
import { CatResponse } from '../_types/cat-response.type';
import { CatUploadFormComponent } from '../cat-upload-form/cat-upload-form.component';
import { CatSummaryComponent } from '../cat-summary/cat-summary.component';



@Component({
  selector: 'app-cats',
  imports: [CatUploadFormComponent, CatSummaryComponent],
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

}
