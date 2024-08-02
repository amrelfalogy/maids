import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchService } from '../services/search.service';
import { User } from '../users/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchControl = new FormControl('');
  searchResult: User[] = [];
  showDropdown: boolean = false;


  constructor(
    private searchService: SearchService, 
    private userService: UserService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(searchTerm => {
      this.searchService.setSearchTerm(searchTerm.trim());
    });
  }

}
