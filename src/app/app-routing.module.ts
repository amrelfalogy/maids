import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';

const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'users/:id', component: UserDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
