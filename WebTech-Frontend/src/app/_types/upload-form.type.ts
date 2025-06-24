import { FormControl, FormGroup } from '@angular/forms';

export type UploadForm = FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    geolocation: FormControl<string | null>;
    photo: FormControl<string | null>;
}>