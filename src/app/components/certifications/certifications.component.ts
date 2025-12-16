import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Certification {
  title: string;
  issuer: string;
  year: string;
  icon: string;
  url: string;
  skills: string[];
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss']
})
export class CertificationsComponent {
  
  certifications: Certification[] = [
    {
      title: 'Google UX Design Professional Certificate',
      issuer: 'Google via Coursera',
      year: '2024',
      icon: '🎨',
      url: 'https://coursera.org/share/48d62de9aa572524545fd4f56c765c03',
      skills: ['UI/UX Design', 'User Research', 'Prototyping']
    },
    {
      title: 'AWS Cloud Architecting',
      issuer: 'Amazon Web Services',
      year: '2023',
      icon: '☁️',
      url: 'https://www.credly.com/badges/606ee997-e750-4315-ba76-60f4c23aa304/public_url',
      skills: ['Cloud Architecture', 'AWS Services', 'Scalability']
    },
    {
      title: 'AWS Cloud Developing',
      issuer: 'Amazon Web Services',
      year: '2023',
      icon: '⚙️',
      url: 'https://www.credly.com/badges/e8bc6c1b-f58a-48d5-a1fd-d94e38ba9b3f/public_url',
      skills: ['Cloud Development', 'DevOps', 'Deployment']
    },
    {
      title: 'AWS Cloud Foundations',
      issuer: 'Amazon Web Services',
      year: '2023',
      icon: '🔧',
      url: 'https://www.credly.com/badges/074018bc-bf70-4d87-a164-f70e479b5532/public_url',
      skills: ['Cloud Computing', 'Infrastructure', 'Security']
    }
  ];
}