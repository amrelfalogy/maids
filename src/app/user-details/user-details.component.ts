import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../users/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms ease-in', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class UserDetailsComponent implements OnInit {
  user: User | null = null;
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchUserDetails(userId);
  }

  fetchUserDetails(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe(
      user => {
        this.user = user;
        this.loading = false;
      },
      error => {
        console.error('Error fetching user details:', error);
        this.error = 'Failed to load user details. Please try again.';
        this.loading = false;
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/']); // Navigate back to the main user list
  }
}
