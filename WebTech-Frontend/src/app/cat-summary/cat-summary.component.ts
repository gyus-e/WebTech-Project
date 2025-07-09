import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatResponse } from '../_types/cat-response.type';
import { REST_BACKEND_URL } from '../_config/rest-backend-url';
import { PLACEHOLDER } from '../_config/placeholder';

@Component({
  selector: 'app-cat-summary',
  imports: [RouterLink],
  templateUrl: './cat-summary.component.html',
  styleUrl: './cat-summary.component.scss'
})
export class CatSummaryComponent {
  @Input() cat: CatResponse | undefined = undefined

  ngOnInit() {
    if (!this.cat) {
      throw new Error('CatSummaryComponent requires a cat input');
    }
  }

  getProfilePictureUrl(cat: CatResponse): string {
    if (cat.profilePicture) {
      return `${REST_BACKEND_URL}/cats/${cat.id}/photos/${cat.profilePicture}/send`;
    }
    return `${PLACEHOLDER}`;
  }
}
