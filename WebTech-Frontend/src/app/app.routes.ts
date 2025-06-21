import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { UploadComponent } from './upload/upload.component';
import { authGuard } from './_guards/auth/auth.guard';

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
    },
    {
        path: 'upload',
        component: UploadComponent,
        title: 'Upload',
        canActivate: [authGuard],
    }
];
