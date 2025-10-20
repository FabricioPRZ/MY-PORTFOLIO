import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  glowSize: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particlesCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number = 0;
  private resizeTimeout: any;
  private mouseX: number = 0;
  private mouseY: number = 0;

  // Datos del hero
  heroData = {
    name: 'Fabricio Pérez',
    role: 'Full Stack Developer',
    greeting: 'Hola, soy',
    label: 'Bienvenido a mi portafolio',
    description1: 'Desarrollador Full Stack especializado en Angular, enfocado en crear aplicaciones web escalables con interfaces intuitivas y experiencias de usuario excepcionales.',
    description2: 'Dominio de múltiples tecnologías: React, Vue, TypeScript, JavaScript, Python, Java y Go. Me adapto rápidamente a nuevos desafíos y disfruto trabajar en equipos colaborativos.',
    profileImage: '/Perfil.jpeg',
    cvPath: '/CV/CV-FABRICIO.pdf'
  };

  stats = [
    {
      icon: 'fas fa-code',
      number: '2+',
      label: 'Años'
    },
    {
      icon: 'fas fa-project-diagram',
      number: '30+',
      label: 'Proyectos'
    }
  ];

  badges = [
    {
      icon: '💻',
      text: 'Full Stack Developer',
      hasStatus: false
    },
    {
      icon: '',
      text: 'Disponible para proyectos',
      hasStatus: true
    }
  ];

  ngOnInit(): void {
    // Inicialización
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.createParticles();
    this.animate();
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private createParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const particleCount = Math.floor((canvas.width * canvas.height) / 12000);
    
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const canvas = this.canvasRef.nativeElement;
    const colors = ['rgba(123, 74, 226,', 'rgba(35, 211, 250,'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
      color: color,
      glowSize: Math.random() * 2 + 1
    };
  }

  private updateParticle(particle: Particle): void {
    const canvas = this.canvasRef.nativeElement;
    
    // Movimiento base
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Interacción con el mouse
    const dx = this.mouseX - particle.x;
    const dy = this.mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 150) {
      const force = (150 - distance) / 150;
      particle.x -= dx * force * 0.02;
      particle.y -= dy * force * 0.02;
    }

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
    // Glow externo (más grande y suave)
    const gradient = this.ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * particle.glowSize * 3
    );
    gradient.addColorStop(0, `${particle.color} ${particle.opacity * 0.6})`);
    gradient.addColorStop(0.5, `${particle.color} ${particle.opacity * 0.2})`);
    gradient.addColorStop(1, `${particle.color} 0)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size * particle.glowSize * 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Partícula principal
    this.ctx.fillStyle = `${particle.color} ${particle.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();

    // Núcleo brillante
    this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.8})`;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawConnections(): void {
    const maxDistance = 120;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;
          
          // Línea base
          this.ctx.strokeStyle = `rgba(123, 74, 226, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();

          // Línea de brillo
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
  }

  private drawMouseConnections(): void {
    const canvas = this.canvasRef.nativeElement;
    if (this.mouseX < 0 || this.mouseX > canvas.width || 
        this.mouseY < 0 || this.mouseY > canvas.height) {
      return;
    }

    const maxDistance = 200;
    
    this.particles.forEach(particle => {
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        const opacity = (1 - distance / maxDistance) * 0.3;
        
        const gradient = this.ctx.createLinearGradient(
          particle.x, particle.y,
          this.mouseX, this.mouseY
        );
        gradient.addColorStop(0, `${particle.color} ${opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.5})`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        this.ctx.lineTo(this.mouseX, this.mouseY);
        this.ctx.stroke();
      }
    });
  }

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Actualizar y dibujar partículas
    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

    // Dibujar conexiones
    this.drawConnections();
    this.drawMouseConnections();

    this.animationId = requestAnimationFrame(this.animate);
  }

  private onResize = (): void => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.resizeCanvas();
      this.createParticles();
    }, 250);
  }

  private onMouseMove = (event: MouseEvent): void => {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  // Métodos para interacción
  scrollToProjects(): void {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToContact(): void {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollDown(): void {
    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
  }
}