import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="glass-panel login-card">
        <div class="brand">
          <div class="brand-logo">G</div>
          <h1>GALAGA S.A.C.</h1>
          <p class="subtitle">Gestión Logística Electoral ONPE</p>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input 
              type="email" 
              id="correo" 
              name="correo" 
              [(ngModel)]="correo" 
              required 
              email
              #emailInput="ngModel"
              placeholder="nombre@correo.com">
            <div *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)" class="error-msg">
              Por favor ingresa un correo válido.
            </div>
          </div>

          <div class="form-group">
            <label for="contrasena">Contraseña</label>
            <input 
              type="password" 
              id="contrasena" 
              name="contrasena" 
              [(ngModel)]="contrasena" 
              required
              placeholder="••••••••">
          </div>

          <div *ngIf="error" class="error-alert">
            {{ error }}
          </div>

          <button type="submit" [disabled]="loginForm.invalid || loading" class="btn-primary w-full">
            {{ loading ? 'Iniciando Sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: radial-gradient(circle at center, #1b233d 0%, #0a0e1a 100%);
      padding: 1.5rem;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 3rem 2.5rem;
      text-align: center;
    }

    .brand {
      margin-bottom: 2.5rem;
    }

    .brand-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, #2563eb, #06b6d4);
      color: white;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 1rem;
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
    }

    .brand h1 {
      font-size: 1.8rem;
      letter-spacing: 2px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    .login-form {
      text-align: left;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .error-msg {
      color: var(--danger);
      font-size: 0.8rem;
      margin-top: 0.25rem;
    }

    .error-alert {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (user) => {
        this.loading = false;
        // Redirect based on role
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Correo o contraseña incorrectos. Por favor, intente de nuevo.';
      }
    });
  }
}
