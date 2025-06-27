import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RestBackendErrorHandlerService {

  toastr = inject(ToastrService);

  handleError(err: any): void {
    const errors: Array<any> = err.error?.errors;

    const message = Array.isArray(errors) && errors.length > 0 ?
      errors.map(e => e.msg).join('\n') :
      "Unknown error";

    this.toastr.error(message);
  }

}
