import { Component, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  authService = inject(AuthService);
  // http = inject(HttpClient);
  // catFact: string = '';

  // ngOnInit() {
  //   this.loadCatFact();
  // }

  // loadCatFact() {
  //   const catfactURL = "https://catfact.ninja/fact";
  //   this.http.get<{ fact: string, length: number }>(catfactURL).subscribe(data => {
  //     this.catFact = data.fact;
  //   });
  // }
}
