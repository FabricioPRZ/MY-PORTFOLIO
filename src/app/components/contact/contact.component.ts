import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ContactMethod {
  icon: string;
  title: string;
  subtitle: string;
  link: string;
  type: 'email' | 'phone' | 'social';
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  
  contacts: ContactMethod[] = [
    {
      icon: '📧',
      title: 'Email',
      subtitle: 'agustinaconstantino55@gmail.com',
      link: 'mailto:agustinaconstantino55@gmail.com',
      type: 'email'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      subtitle: '+52 961 900 9651',
      link: 'https://wa.me/529619009651',
      type: 'phone'
    },
    {
      icon: '💼',
      title: 'LinkedIn',
      subtitle: 'Victor Fabricio Perez',
      link: 'https://www.linkedin.com/in/victor-fabricio-perez-constantino-8727512b6/',
      type: 'social'
    },
    {
      icon: '💻',
      title: 'GitHub',
      subtitle: '@FabricioPRZ',
      link: 'https://github.com/FabricioPRZ',
      type: 'social'
    }
  ];
}