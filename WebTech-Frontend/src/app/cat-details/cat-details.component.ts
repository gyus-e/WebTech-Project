import { Component, effect, inject, signal } from '@angular/core';
import { RestBackendFetchService } from '../_services/rest-backend/rest-backend-fetch.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { CatResponse } from '../_types/cat-response.type';

@Component({
  selector: 'app-cat-details',
  imports: [],
  templateUrl: './cat-details.component.html',
  styleUrl: './cat-details.component.scss'
})
export class CatDetailsComponent {
  fetchService = inject(RestBackendFetchService);
  router = inject(Router);
  toastr = inject(ToastrService);

  cat_id = signal<number | undefined>(undefined);
  cat = signal<CatResponse | undefined>(undefined);

  constructor(route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      const cat_id_param = params.get('cat_id')
      if (!cat_id_param) {
        this.toastr.error('No cat id provided in the route parameters.');
        this.router.navigateByUrl("/cats");
      };

      this.cat_id.set(Number(cat_id_param));
    });

    effect(() => {
      const catId = this.cat_id();
      if (!catId) {
        this.toastr.error('Cat ID is not set.');
        return;
      }
      this.fetchService.getCatById(catId).subscribe({
        next: (cat) => {
          if (!cat) {
            this.toastr.error('Cat not found.');
            this.router.navigateByUrl("/cats");
          } else {
            this.cat.set(cat);
          }
        },
        error: (err) => {
          this.toastr.error('Error fetching cat details: ' + err.message);
          this.router.navigateByUrl("/cats");
        }
      });
    });


  }

}
