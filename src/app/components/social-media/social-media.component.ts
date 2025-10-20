import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SocialLink {
  name: string;
  platform: string;
  icon: string;
  url: string;
  external: boolean;
  ariaLabel: string;
  color?: string;
}

@Component({
  selector: 'app-social-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  
  // Lista de redes sociales
  socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      platform: 'github',
      icon: 'fab fa-github',
      url: 'https://github.com/FabricioPRZ',
      external: true,
      ariaLabel: 'Visitar perfil de GitHub',
      color: '#fff'
    },
    {
      name: 'LinkedIn',
      platform: 'linkedin',
      icon: 'fab fa-linkedin-in',
      url: 'https://www.linkedin.com/in/victor-fabricio-perez-constantino-8727512b6/',
      external: true,
      ariaLabel: 'Visitar perfil de LinkedIn',
      color: '#0077B5'
    },
    {
      name: 'Instagram',
      platform: 'instagram',
      icon: 'fab fa-instagram',
      url: 'https://www.instagram.com/Fabricio_perez23',
      external: true,
      ariaLabel: 'Visitar perfil de Instagram',
      color: '#E4405F'
    }
  ];

  ngOnInit(): void {
    // Inicialización del componente
  }

  // ============================================
  // MÉTODOS ÚTILES PARA REDES SOCIALES
  // ============================================

  /**
   * Obtiene el número total de redes sociales
   */
  getTotalSocialLinks(): number {
    return this.socialLinks.length;
  }

  /**
   * Agrega una nueva red social
   */
  addSocialLink(link: SocialLink): void {
    this.socialLinks.push(link);
  }

  /**
   * Elimina una red social por plataforma
   */
  removeSocialLink(platform: string): void {
    this.socialLinks = this.socialLinks.filter(link => link.platform !== platform);
  }

  /**
   * Busca una red social por plataforma
   */
  getSocialLinkByPlatform(platform: string): SocialLink | undefined {
    return this.socialLinks.find(link => link.platform === platform);
  }

  /**
   * Actualiza la URL de una red social
   */
  updateSocialUrl(platform: string, newUrl: string): void {
    const link = this.getSocialLinkByPlatform(platform);
    if (link) {
      link.url = newUrl;
    }
  }

  /**
   * Ordena las redes sociales alfabéticamente por nombre
   */
  sortSocialLinksByName(): void {
    this.socialLinks.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Filtra redes sociales por criterio
   */
  filterSocialLinks(filter: (link: SocialLink) => boolean): SocialLink[] {
    return this.socialLinks.filter(filter);
  }
}