import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LogoutComponent } from './auth/logout/logout.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        title: 'WebTech StreetCats',
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
    },
    {
        path: 'signup',
        component: SignupComponent,
        title: 'Signup',
    },
    {
        path: 'logout',
        component: LogoutComponent,
        title: 'Logout',
    }
];
