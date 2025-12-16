import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  github?: string;
  demo?: string;
  year: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  
  currentIndex = 0;

  projects: Project[] = [
    {
      id: 1,
      title: 'SUMS Suchiapa',
      description: 'Medical unit management system for Suchiapa municipality. Comprehensive platform for healthcare services management with modern UI/UX design.',
      image: '/Projects/SUMS.png',
      tech: ['Angular', 'TypeScript', 'SCSS'],
      github: 'https://github.com/FabricioPRZ/UNIMED-SUCHIAPA',
      year: '2025'
    },
    {
      id: 2,
      title: 'FERMEST',
      description: 'Real-time monitoring and control system for biomass fermentation in biofuel production. IoT integration with industrial sensors.',
      image: '/Projects/FERMEST.png',
      tech: ['Angular', 'TypeScript', 'IoT'],
      github: 'https://github.com/FabricioPRZ/FERMEST',
      demo: 'https://fermest.vercel.app/inicio',
      year: '2024'
    },
    {
      id: 3,
      title: 'CASM',
      description: 'Social network connecting mental health professionals with people seeking psychological support. Community-driven platform.',
      image: '/Projects/CASM.png',
      tech: ['Angular', 'TypeScript', 'SCSS'],
      github: 'https://github.com/FabricioPRZ/CASM',
      demo: 'https://fabricioprz.github.io/CASM',
      year: '2024'
    },
    {
      id: 4,
      title: 'Yare\'s Room',
      description: 'Elegant landing page for nail business with conversion-focused design and smooth animations.',
      image: '/Projects/YARESROOM.png',
      tech: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/FabricioPRZ/YARES-ROOM',
      demo: 'https://yaresroom.vercel.app/',
      year: '2024'
    },
    {
      id: 5,
      title: 'TechNovaAI',
      description: 'Modern landing page showcasing AI services with futuristic design and interactive elements.',
      image: '/Projects/TECHNOVA.png',
      tech: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/FabricioPRZ/TechNovaAI',
      demo: 'https://fabricioprz.github.io/TechNovaAI/',
      year: '2024'
    },
    {
      id: 6,
      title: 'GrowDigital',
      description: 'Professional landing page for digital marketing services with conversion optimization.',
      image: '/Projects/GROWDIGITAL.png',
      tech: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/FabricioPRZ/GrowDigital',
      demo: 'https://fabricioprz.github.io/GrowDigital/',
      year: '2024'
    },
    {
      id: 7,
      title: 'Café Aroma',
      description: 'Warm landing page for local coffee shop capturing its cozy atmosphere.',
      image: '/Projects/AROMACAFE.png',
      tech: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/FabricioPRZ/-Caf--Aroma',
      demo: 'https://fabricioprz.github.io/-Caf--Aroma/',
      year: '2023'
    },
    {
      id: 8,
      title: 'Legado Activo',
      description: 'Vibrant landing page for music band with dynamic content and media integration.',
      image: '/Projects/LEGADOACTIVO.png',
      tech: ['HTML', 'CSS', 'JavaScript'],
      demo: 'https://sites.google.com/view/legadoactivo/inicio',
      year: '2023'
    }
  ];

  scrollToProject(index: number): void {
    this.currentIndex = index;
    const element = document.getElementById(`project-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
}