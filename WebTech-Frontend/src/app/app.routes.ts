import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        title: 'WebTech StreetCats'
    },
    {
        path: 'login',
        title: 'Login',
        component: LoginComponent
    }
];
