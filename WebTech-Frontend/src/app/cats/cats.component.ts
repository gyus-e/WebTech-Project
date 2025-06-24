import { Component, inject } from '@angular/core';
import { CatsStateService } from '../_services/cats/cats-state.service';

@Component({
  selector: 'app-cats',
  imports: [],
  templateUrl: './cats.component.html',
  styleUrl: './cats.component.scss'
})
export class CatsComponent {

  catsState = inject(CatsStateService);


  constructor() {
  }

}
