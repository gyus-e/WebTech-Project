import { Component, inject } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { MapComponent } from '../map/map.component';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-homepage',
  imports: [MapComponent, QuillModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  authService = inject(AuthService);

  // rawContent = "&lt;p&gt;This&amp;nbsp;cat&amp;nbsp;is&amp;nbsp;&lt;strong&gt;beautiful!&amp;nbsp;&lt;&#x2F;strong&gt;It&amp;nbsp;is&amp;nbsp;&lt;em&gt;Claudio&lt;&#x2F;em&gt;&amp;#39;s&amp;nbsp;cat.&amp;nbsp;Her&amp;nbsp;name&amp;nbsp;is&amp;nbsp;&lt;span class=&quot;ql-size-large&quot;&gt;FLORA&amp;nbsp;&lt;&#x2F;span&gt;&lt;span class=&quot;ql-size-small&quot;&gt;because&amp;nbsp;she&amp;nbsp;is&amp;nbsp;a&amp;nbsp;&lt;&#x2F;span&gt;&lt;span class=&quot;ql-size-huge&quot;&gt;GODDESS&lt;&#x2F;span&gt;&lt;&#x2F;p&gt;"
  // get content(): string {
  //   const txt = document.createElement('textarea');
  //   txt.innerHTML = this.rawContent;
  //   return txt.value;
  // }
}
