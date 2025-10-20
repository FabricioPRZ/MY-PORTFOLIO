import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Certification {
  title: string;
  issuer: string;
  organization: string;
  icon: string;
  description: string;
  verifyUrl: string;
  verified: boolean;
  date?: string; // Opcional: fecha de obtención
  credentialId?: string; // Opcional: ID de credencial
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
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss']
})
export class CertificationsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particlesCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number = 0;
  private resizeTimeout: any;

  // Lista de certificaciones - Agrega/edita/elimina según necesites
  certifications: Certification[] = [
    {
      title: 'Google UX Design',
      issuer: 'Google',
      organization: 'Coursera',
      icon: 'fab fa-google',
      description: 'Professional Certificate en fundamentos de diseño UX y mejores prácticas de experiencia de usuario. Diseño centrado en el usuario, investigación, wireframing y prototipado.',
      verifyUrl: 'https://coursera.org/share/48d62de9aa572524545fd4f56c765c03',
      verified: true,
      date: '2024'
    },
    {
      title: 'Introducción a Java',
      issuer: 'UNAM',
      organization: 'Coursera',
      icon: 'fab fa-java',
      description: 'Fundamentos de programación en Java y conceptos orientados a objetos. Sintaxis básica, estructuras de control, POO, herencia, polimorfismo y buenas prácticas de desarrollo.',
      verifyUrl: 'https://coursera.org/share/ef930db05d796eaf03a453d3f4d47d16',
      verified: true,
      date: '2024'
    },
    {
      title: 'AWS Academy Graduate - Cloud Foundations',
      issuer: 'Amazon Web Services',
      organization: 'AWS',
      icon: 'fab fa-aws',
      description: 'Introducción a los conceptos fundamentales de la nube: modelos de servicio, arquitectura básica, seguridad y servicios principales de AWS. Ideal para quienes empiezan en cloud computing.',
      verifyUrl: 'https://www.credly.com/badges/074018bc-bf70-4d87-a164-f70e479b5532/public_url',
      verified: true,
      date: '2023'
    },
    {
      title: 'AWS Academy Graduate - Cloud Developing',
      issuer: 'Amazon Web Services',
      organization: 'AWS',
      icon: 'fab fa-aws',
      description: 'Formación enfocada en desarrollo en la nube: despliegue de aplicaciones en AWS, uso de servicios administrados, integración y mejores prácticas para aplicaciones escalables.',
      verifyUrl: 'https://www.credly.com/badges/e8bc6c1b-f58a-48d5-a1fd-d94e38ba9b3f/public_url',
      verified: true,
      date: '2023'
    },
    {
      title: 'AWS Academy Graduate - Cloud Architecting',
      issuer: 'Amazon Web Services',
      organization: 'AWS',
      icon: 'fab fa-aws',
      description: 'Conceptos de arquitectura en la nube: diseño de soluciones resilientes, escalables y seguras en AWS, selección de servicios y patrones arquitectónicos.',
      verifyUrl: 'https://www.credly.com/badges/606ee997-e750-4315-ba76-60f4c23aa304/public_url',
      verified: true,
      date: '2023'
    },
    {
      title: 'Networking Basics',
      issuer: 'Cisco Networking Academy',
      organization: 'Cisco',
      icon: '',
      description: 'Fundamentos de redes: modelos OSI y TCP/IP, direccionamiento, conmutación y enrutamiento básicos, y conceptos clave para la conectividad en redes modernas.',
      verifyUrl: 'https://www.credly.com/badges/c47519be-fc88-4edd-8984-826ebef8e62c/public_url',
      verified: true,
      date: '2023'
    },
    {
      title: 'Operating Systems Basics',
      issuer: 'Cisco Networking Academy',
      organization: 'Cisco',
      icon: '',
      description: 'Introducción a sistemas operativos: procesos, memoria, almacenamiento y administración básica de sistemas, con enfoque en soporte y administración práctica.',
      verifyUrl: 'https://www.credly.com/badges/1c1b59f5-58dc-4386-b173-7860d450f710/public_url',
      verified: true,
      date: '2023'
    },
    {
      title: 'Operating Systems Support',
      issuer: 'Cisco Networking Academy',
      organization: 'Cisco',
      icon: '',
      description: 'Formación en soporte de sistemas operativos: resolución de problemas comunes, instalación, configuración y mantenimiento de entornos de usuario y servidores.',
      verifyUrl: 'https://www.credly.com/badges/7fe482bf-bf0e-4307-a0c5-67ff96719373/public_url',
      verified: true,
      date: '2023'
    }
  ];

  ngOnInit(): void {
    // Inicialización del componente
    this.sortCertificationsByDate();
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
    
    // Limpiar listener
    window.removeEventListener('resize', this.onResize);
  }

  // ============================================
  // MÉTODOS ÚTILES PARA CERTIFICACIONES
  // ============================================

  /**
   * Ordena las certificaciones por fecha (más recientes primero)
   */
  private sortCertificationsByDate(): void {
    this.certifications.sort((a, b) => {
      const dateA = a.date ? parseInt(a.date) : 0;
      const dateB = b.date ? parseInt(b.date) : 0;
      return dateB - dateA;
    });
  }

  /**
   * Obtiene el número total de certificaciones
   */
  getTotalCertifications(): number {
    return this.certifications.length;
  }

  /**
   * Obtiene el número de certificaciones verificadas
   */
  getVerifiedCertifications(): number {
    return this.certifications.filter(cert => cert.verified).length;
  }

  /**
   * Agrega una nueva certificación (útil para futuras implementaciones)
   */
  addCertification(cert: Certification): void {
    this.certifications.unshift(cert);
  }

  /**
   * Elimina una certificación por título
   */
  removeCertification(title: string): void {
    this.certifications = this.certifications.filter(cert => cert.title !== title);
  }

  // ============================================
  // MÉTODOS PARA PARTÍCULAS
  // ============================================

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