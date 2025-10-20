import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ContactMethod {
  title: string;
  subtitle?: string;
  icon: string;
  link: string;
  external: boolean;
  ariaLabel: string;
  available?: boolean;
  showStatus?: boolean;
  statusText?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('particlesCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number = 0;
  private resizeTimeout: any;

  // Email principal para el CTA
  primaryEmail = 'agustinaconstantino55@gmail.com';

  // Métodos de contacto
  contactMethods: ContactMethod[] = [
    {
      title: 'Email',
      subtitle: 'agustinaconstantino55@gmail.com',
      icon: 'fas fa-envelope',
      link: 'mailto:agustinaconstantino55@gmail.com',
      external: false,
      ariaLabel: 'Enviar correo electrónico',
      available: true,
      showStatus: true,
      statusText: 'Activo'
    },
    {
      title: 'WhatsApp',
      subtitle: '+52 965 106 4606',
      icon: 'fab fa-whatsapp',
      link: 'https://wa.me/529651064606',
      external: true,
      ariaLabel: 'Contactar por WhatsApp'
    },
    {
      title: 'LinkedIn',
      subtitle: 'Victor Fabricio Perez',
      icon: 'fab fa-linkedin-in',
      link: 'https://www.linkedin.com/in/victor-fabricio-perez-constantino-8727512b6/',
      external: true,
      ariaLabel: 'Visitar perfil de LinkedIn'
    },
    {
      title: 'Teléfono',
      subtitle: '+52 965 106 4606',
      icon: 'fas fa-phone',
      link: 'tel:+529651064606',
      external: false,
      ariaLabel: 'Llamar por teléfono'
    }
  ];

  ngOnInit(): void {
    // Inicialización del componente
  }

  ngAfterViewInit(): void {
    // Inicializar canvas de partículas
    this.initCanvas();
    this.createParticles();
    this.animate();
    this.setupResizeListener();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    window.removeEventListener('resize', this.onResize);
  }


  getTotalContactMethods(): number {
    return this.contactMethods.length;
  }


  getAvailableContacts(): ContactMethod[] {
    return this.contactMethods.filter(contact => contact.available !== false);
  }

  addContactMethod(contact: ContactMethod): void {
    this.contactMethods.push(contact);
  }

  removeContactMethod(title: string): void {
    this.contactMethods = this.contactMethods.filter(contact => contact.title !== title);
  }

  updateContactAvailability(title: string, available: boolean): void {
    const contact = this.contactMethods.find(c => c.title === title);
    if (contact) {
      contact.available = available;
      contact.statusText = available ? 'Activo' : 'No disponible';
    }
  }

  private initCanvas(): void {
    if (!this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    
    if (context) {
      this.ctx = context;
      this.resizeCanvas();
    }
  }

  private resizeCanvas(): void {
    if (!this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private createParticles(): void {
    if (!this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    const particleCount = Math.floor((canvas.width * canvas.height) / 18000);
    
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    if (!this.canvasRef) {
      return { x: 0, y: 0, size: 0, speedX: 0, speedY: 0, opacity: 0 };
    }
    
    const canvas = this.canvasRef.nativeElement;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.2
    };
  }

  private updateParticle(particle: Particle): void {
    if (!this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Rebotar en los bordes
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.speedX *= -1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.speedY *= -1;
    }

    // Mantener dentro del canvas
    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
  }

  private drawParticle(particle: Particle): void {
    if (!this.ctx) return;
    
    // Partícula principal (púrpura)
    this.ctx.fillStyle = `rgba(123, 74, 226, ${particle.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();

    // Efecto glass glow (cyan)
    this.ctx.fillStyle = `rgba(35, 211, 250, ${particle.opacity * 0.3})`;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawConnections(): void {
    if (!this.ctx) return;
    
    const maxDistance = 120;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.12;
          this.ctx.strokeStyle = `rgba(123, 74, 226, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  private animate = (): void => {
    if (!this.canvasRef || !this.ctx) return;
    
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar partículas
    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    // Dibujar conexiones entre partículas cercanas
    this.drawConnections();

    this.animationId = requestAnimationFrame(this.animate);
  }

  private onResize = (): void => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.resizeCanvas();
      this.createParticles();
    }, 250);
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', this.onResize);
  }
}