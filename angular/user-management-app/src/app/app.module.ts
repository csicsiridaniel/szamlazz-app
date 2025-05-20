import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {UserListComponent} from './pages/user-list/user-list.component';
import {UserEditComponent} from './pages/user-edit/user-edit.component';
import {UserCreateComponent} from './pages/user-create/user-create.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TableComponent} from './shared/table/table.component';
import { ButtonComponent } from './shared/button/button.component';
import { DropdownComponent } from './shared/dropdown/dropdown.component';
import {InputComponent} from './shared/input/input.component';
import {HttpErrorInterceptor} from './interceptors/http-error.interceptor';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserEditComponent,
    UserCreateComponent,
    TableComponent,
    ButtonComponent,
    DropdownComponent,
    InputComponent,
    HeaderComponent,
    FooterComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
