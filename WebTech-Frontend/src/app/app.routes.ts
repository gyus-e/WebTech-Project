import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { UploadComponent } from './upload/upload.component';
import { CatsComponent } from './cats/cats.component';
import { authGuard } from './_guards/auth/auth.guard';
import { CatDetailsComponent } from './cat-details/cat-details.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        title: 'WebTech StreetCats',
    },
    {
        path: 'signup',
        component: SignupComponent,
        title: 'Signup',
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
    },
    {
        path: 'logout',
        component: LogoutComponent,
        title: 'Logout',
        canActivate: [authGuard],
    },
    {
        path: 'cats',
        component: CatsComponent,
        title: 'Cats',
    },
    {
        path: 'cats/:cat_id',
        component: CatDetailsComponent,
        title: 'Cat Details',
    },
    {
        path: 'cats/:cat_id/edit',
        component: UploadComponent,
        title: 'Edit Cat',
        canActivate: [authGuard],
    },
    {
        path: 'upload/:cat_id',
        component: UploadComponent,
        title: 'Upload',
        canActivate: [authGuard],
    }

];
