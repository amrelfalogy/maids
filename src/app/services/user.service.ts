import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://reqres.in/api/users';
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  private cache: { [key: string]: { data: any, timestamp: number } } = {};

  constructor(private http: HttpClient) { }

  getUsers(page: number): Observable<any> {
    const cacheKey = `users_page_${page}`;
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<any>(`${this.apiUrl}?page=${page}`).pipe(
      tap(response => this.addToCache(cacheKey, response)),
      catchError(this.handleError<any>('getUsers', []))
    );
  }

  getUserById(id: number): Observable<User | null> {
    const cacheKey = `user_${id}`;
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<{ data: User }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      tap(user => this.addToCache(cacheKey, user)),
      catchError(this.handleError<User | null>(`getUser id=${id}`, null))
    );
  }

  searchUsersById(term: string): Observable<User[]> {
    const cacheKey = `search_${term}`;
    const cachedData = this.getFromCache(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<{ data: User }>(`${this.apiUrl}?id=${term}`).pipe(
      map(response => response.data ? [response.data] : []),
      tap(users => this.addToCache(cacheKey, users)),
      catchError(this.handleError<User[]>('searchUsersById', []))
    );
  }

  private addToCache(key: string, data: any): void {
    this.cache[key] = {
      data: data,
      timestamp: Date.now()
    };
  }

  private getFromCache(key: string): any | null {
    const cachedItem = this.cache[key];
    if (cachedItem) {
      if (Date.now() - cachedItem.timestamp < this.cacheDuration) {
        return cachedItem.data;
      } else {
        delete this.cache[key];
      }
    }
    return null;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
