import { NgClass } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Toast } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Menu, NgClass, Toast, TranslocoModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('inventory-app');
  public items: MenuItem[] = [];
  private subscription!: Subscription;
  private currentLang: string;

  sidebarVisible = false;
  sidebarAnimating = false;
  isMobile = false;

  langItems: MenuItem[] = [
    {
      label: 'English',
      icon: 'pi pi-fw pi-language',
      command: () => this.changeLang('en')
    },
    {
      label: 'Español',
      icon: 'pi pi-fw pi-language',
      command: () => this.changeLang('es')
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService, 
    private translocoService: TranslocoService, 
    private messageService: MessageService) {

    // It loads authService.userData from Session Storage
    this.authService.refreshUserData();  

    this.checkScreen();
    
    // Initialize currentLang with the default language
    this.translocoService.setActiveLang(environment.defaultLang);
    this.currentLang = environment.defaultLang;
  }

  ngOnInit(): void {

    console.log('API URL:', environment.apiUrl);

   // Subscribe to language changes
    this.subscription = this.translocoService.selectTranslation().subscribe(() => {

      // In this time the active lang is already updated
      // This code will only run after a new language has been set and loaded.

      // The 'activeLang' parameter is the code of the new language (e.g., 'es' or 'en').
      const activeLang = this.translocoService.getActiveLang();

      this.items = [
        {
          label: this.translocoService.translate('sidebar.home'),
          icon: 'pi pi-home',
          routerLink: '/home',
          command: () => { if (this.isMobile) this.closeSidebar(); }
        },
        {
          label: this.translocoService.translate('sidebar.category'),
          icon: 'pi pi-info-circle',
          routerLink: '/category',
          command: () => { if (this.isMobile) this.closeSidebar(); }
        },
        {
          label: this.translocoService.translate('sidebar.product'),
          icon: 'pi pi-shopping-bag',
          routerLink: '/product',
          command: () => { if (this.isMobile) this.closeSidebar(); }
        },
        {
          label: this.translocoService.translate('sidebar.logout'),
          icon: 'pi pi-sign-out',
          command: () => { this.logout(); }
        }
      ];

      // Check if the language is actually changing to avoid duplicate toasts
      if (this.currentLang === activeLang) {
        return; // Don't show toast if it's the same language
      }

      var language = this.translocoService.translate(`language.${activeLang}`);

      this.messageService.add({
        severity: 'success',
        summary: this.translocoService.translate('message.language.summary'),
        detail: this.translocoService.translate('message.language.detail', { language: language })
      });

      // Update the current language after the toast is shown
      this.currentLang = activeLang;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener('window:resize')
  checkScreen() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      // In desktop always show sidebar by dfault.
      this.sidebarVisible = true;
      this.sidebarAnimating = false;
    }
  }

  // Toggle general (desktop y mobile)
  toggleSidebar() {
    if (this.sidebarVisible) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.sidebarAnimating = true;
    this.sidebarVisible = true;
  }

  closeSidebar() {
    if (this.isMobile) {
      // Mobile animation
      this.sidebarAnimating = false;
      setTimeout(() => this.sidebarVisible = false, 300);
    } else {
      // Desktop: Collapse without animation
      this.sidebarVisible = false;
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }

  changeLang(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  isLogged() {
    return this.authService.isLogged();
  }

  logout() {

    this.authService.removeUserData();

    this.messageService.add({
      severity: 'success',
      summary: this.translocoService.translate('message.logout.summary'),
      detail: this.translocoService.translate('message.logout.detail')
    });

    this.router.navigate(['login']);
  }
}
