import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/headear/header.component'
import { UsersListComponent } from './users/users-list/users-list.component';
import { FooterComponent } from './layout/footer/footer.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersListComponent,
    HeaderComponent,
    UserDetailsComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
