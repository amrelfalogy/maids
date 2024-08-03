import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.5)' }),
        animate('300ms', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  totalUsers: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    this.subscribeToSearch();
    this.loadUsers();
  }

  private subscribeToSearch(): void {
    this.searchService.searchTerm$.subscribe(searchTerm => {
      this.isLoading = true;
      searchTerm ? this.searchUsers(searchTerm) : this.loadUsers();
    });
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers(this.currentPage)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        response => {
          this.users = response.data;
          this.totalUsers = response.total;
          this.currentPage = response.page;
          this.totalPages = response.total_pages;
        },
        error => {
          console.error('Error loading users:', error);
        }
      );
  }

  private searchUsers(searchTerm: string): void {
    this.userService.searchUsersById(searchTerm)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        users => {
          this.users = users.length > 0 ? users : [];
        },
        error => {
          this.users = [];
          console.error('Error searching users:', error);
        }
      );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  viewDetails(userId: number): void {
    this.router.navigate(['/users', userId]);
  }
}
