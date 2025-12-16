import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
  year: string;
  role: string;
  company: string;
  type: string;
  achievements: string[];
  stack: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  
  experiences: Experience[] = [
    {
      year: '2025',
      role: 'Frontend Team Leader',
      company: 'SUMS',
      type: 'Medical System',
      achievements: [
        'Led a team of 5 frontend developers in building a census management system',
        'Implemented Clean Architecture principles for scalable codebase',
        'Designed accessible UI/UX interfaces using Figma',
        'Managed agile sprints and conducted code reviews'
      ],
      stack: ['Angular', 'TypeScript', 'Figma', 'Git', 'Scrum']
    },
    {
      year: '2024',
      role: 'Full Stack Developer',
      company: 'Vara Network',
      type: 'Hackathon',
      achievements: [
        'Developed Web3.0 blockchain-based solution for real-world problem',
        'Integrated smart contracts and decentralized technologies',
        'Built both frontend and backend components under tight deadlines',
        'Collaborated in multidisciplinary team environment'
      ],
      stack: ['Web3', 'Blockchain', 'React', 'Node.js', 'Solidity']
    }
  ];
}