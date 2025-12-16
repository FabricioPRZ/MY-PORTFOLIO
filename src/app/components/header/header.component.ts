import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  activeSection = 'inicio';

  private scrollThreshold = 50;
  private ticking = false;

  navItems = [
    { id: 'inicio', label: 'Home', icon: '🏠' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'certifications', label: 'Certifications', icon: '🎓' }
  ];

  ngOnInit() {
    this.updateActiveSection();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.isScrolled = window.pageYOffset > this.scrollThreshold;
        this.updateActiveSection();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private updateActiveSection() {
    const sections = this.navItems.map(item => item.id);
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;
        
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    this.closeMobileMenu();
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }
}