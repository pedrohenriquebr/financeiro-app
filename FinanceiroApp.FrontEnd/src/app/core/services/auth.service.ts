import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DriveInfoService } from '../../services/drive-info.service';

// Interface para o Google Identity Services
interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: any) => void;
      prompt: (callback: (notification: any) => void) => void;
      renderButton: (element: HTMLElement, options: any) => void;
      disableAutoSelect: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

export interface UserProfile {
  email: string;
  name: string;
  picture: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  user$ = this.userSubject.asObservable();
  private googleScriptLoaded = false;
  private googleScriptLoadPromise: Promise<void>;

  constructor(private driveInfoService: DriveInfoService) {
    this.googleScriptLoadPromise = this.loadGoogleScript();
    this.loadUserFromStorage();
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Iniciando carregamento do script do Google...');
      
      // Se o script já foi carregado, retorna imediatamente
      if (this.googleScriptLoaded) {
        console.log('Script do Google já está carregado');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onerror = (error) => {
        console.error('Erro ao carregar script do Google:', error);
        reject(error);
      };
      
      script.onload = () => {
        console.log('Script do Google carregado com sucesso');
        this.googleScriptLoaded = true;
        this.initializeGoogleAuth();
        resolve();
      };
      
      document.head.appendChild(script);
    });
  }

  private initializeGoogleAuth() {
    try {
      console.log('Inicializando autenticação do Google...');
      if (!window.google?.accounts?.id) {
        console.error('API do Google não está disponível');
        return;
      }

      const config = {
        client_id: environment.google.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        itp_support: true,
        allowed_parent_origin: ['http://localhost:4200']
      };
      
      console.log('Configuração do Google Auth:', { clientId: config.client_id });
      window.google.accounts.id.initialize(config);
    } catch (error) {
      console.error('Erro ao inicializar Google Auth:', error);
    }
  }

  async initGoogleButton(buttonElement: HTMLElement) {
    try {
      // Aguarda o carregamento do script
      await this.googleScriptLoadPromise;
      
      if (!window.google?.accounts?.id) {
        console.error('API do Google não está disponível para renderizar o botão');
        this.showFallbackButton();
        return;
      }

      console.log('Renderizando botão do Google...');
      window.google.accounts.id.renderButton(
        buttonElement,
        { 
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: buttonElement.offsetWidth
        }
      );
    } catch (error) {
      console.error('Erro ao renderizar botão do Google:', error);
      this.showFallbackButton();
    }
  }

  private showFallbackButton() {
    const fallbackButton = document.querySelector('.login-button');
    if (fallbackButton) {
      fallbackButton.classList.add('fallback-visible');
    }
  }

  async login() {
    try {
      // Aguarda o carregamento do script
      await this.googleScriptLoadPromise;
      
      console.log('Iniciando processo de login...');
      if (!window.google?.accounts?.id) {
        console.error('API do Google não está disponível para login');
        this.showFallbackButton();
        return;
      }

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.error('Login não exibido:', notification.getNotDisplayedReason());
          this.showFallbackButton();
        } else if (notification.isSkippedMoment()) {
          console.log('Login pulado:', notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log('Login dispensado:', notification.getDismissedReason());
        }
      });
    } catch (error) {
      console.error('Erro ao chamar prompt de login:', error);
      this.showFallbackButton();
    }
  }

  private handleCredentialResponse(response: any) {
    // Decodificar o token JWT
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { email, name, picture } = JSON.parse(jsonPayload);
    
    const userProfile: UserProfile = {
      email,
      name,
      picture
    };

    // Autenticar no backend para backup
    this.driveInfoService.authenticate(email).subscribe({
      next: () => {
        console.log('Autenticação do Google Drive salva com sucesso');
      },
      error: (error) => {
        console.error('Erro ao salvar autenticação do Google Drive:', error);
      }
    });

    this.userSubject.next(userProfile);
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
  }

  private loadUserFromStorage() {
    const storedUser = localStorage.getItem('user_profile');
    if (storedUser) {
      try {
        const userProfile = JSON.parse(storedUser);
        this.userSubject.next(userProfile);
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('user_profile');
      }
    }
  }

  logout() {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }

    // Logout do Google Drive no backend
    this.driveInfoService.logout().subscribe({
      next: () => {
        console.log('Logout do Google Drive realizado com sucesso');
      },
      error: (error) => {
        console.error('Erro ao fazer logout do Google Drive:', error);
      }
    });

    this.userSubject.next(null);
    localStorage.removeItem('user_profile');
  }

  isAuthenticated(): boolean {
    if (this.userSubject.value) {
      return true;
    }

    const storedUser = localStorage.getItem('user_profile');
    if (storedUser) {
      try {
        const userProfile = JSON.parse(storedUser);
        this.userSubject.next(userProfile);
        return true;
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('user_profile');
      }
    }

    return false;
  }

  getCurrentUser(): UserProfile | null {
    return this.userSubject.value;
  }
}
