import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserListComponent} from './pages/user-list/user-list.component';
import {UserEditComponent} from './pages/user-edit/user-edit.component';
import {UserCreateComponent} from './pages/user-create/user-create.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, data: { title: 'Felhasználók listázása' }  },
  { path: 'users/edit/:id', component: UserEditComponent, data: { title: 'Felhasználó szerkesztése' } },
  { path: 'users/create', component: UserCreateComponent, data: { title: 'Felhasználó létrehozása' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
