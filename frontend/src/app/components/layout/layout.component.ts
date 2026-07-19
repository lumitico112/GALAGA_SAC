import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'})
export class LayoutComponent implements OnInit {
  userName = 'Usuario';
  userRole = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.nombre;
      this.userRole = user.rol;
    }
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(roles);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
