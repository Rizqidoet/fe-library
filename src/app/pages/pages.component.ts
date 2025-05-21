import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit {
  
  @ViewChild('menuCheckbox') menuCheckbox!: ElementRef;
  toggle: boolean = false;
  isSidebarOpen: boolean = false;

  constructor(
    private renderer: Renderer2,
    private readonly router: Router,

  ) {}

  ngOnInit(): void {
    this.toggleSidebar();
    // this.loadDataMenu();

    // if(this.session.roles){
    //   this.role = this.session.roles as SessionRoleDTO;  
    // }
  }
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMenu() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.onClickRemoveShowClass();
    }
  }

  onClickRemoveShowClass() {
    const elements = document.querySelectorAll('.show');
    elements.forEach((element) => {
      this.renderer.removeClass(element, 'show');
    });
  }

  toggleSubMenu() {
    if (this.toggle) {
      this.toggleMenu();
      this.menuCheckbox.nativeElement.checked =
        !this.menuCheckbox.nativeElement.checked;
    }
  }
}
