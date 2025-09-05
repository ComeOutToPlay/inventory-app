import { NgClass } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Menu, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('aegis-app');
 
  sidebarVisible = false;
  sidebarAnimating = false;
  isMobile = false;


  items: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/home', command: () => { if (this.isMobile) this.closeSidebar(); } },
    { label: 'Categories', icon: 'pi pi-book', routerLink: '/category', command: () => { if (this.isMobile) this.closeSidebar(); } },
    { label: 'Products', icon: 'pi pi-shopping-bag', routerLink: '/product', command: () => { if (this.isMobile) this.closeSidebar(); } }
  ];


  constructor(private router: Router) {
    this.checkScreen();
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
}
