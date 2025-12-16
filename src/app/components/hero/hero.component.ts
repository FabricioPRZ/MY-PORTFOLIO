import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  
  heroData = {
    greeting: 'Hi, I\'m',
    name: 'Fabricio Pérez',
    role: 'Full Stack Developer & UX/UI Designer',
    description: 'Specialized in Angular, creating scalable web applications with exceptional user experiences. Proficient in React, Vue, TypeScript, Python, Java, and Go.',
    image: '/Perfil.jpeg',
    cvPath: '/CV/CV.pdf',
    status: 'Available for work'
  };

  metrics = [
    { value: '2+', label: 'Years' },
    { value: '30+', label: 'Projects' },
    { value: '10+', label: 'Tech Stack' }
  ];

  technologies = [
    'Angular', 'React', 'Vue', 'TypeScript', 
    'Python', 'Java', 'Go', 'Node.js'
  ];

  ngOnInit(): void {}

  scrollTo(section: string): void {
    document.getElementById(section)?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}