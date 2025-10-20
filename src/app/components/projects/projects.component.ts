import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particlesCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number = 0;
  private resizeTimeout: any;
  
  currentSlide = 0;
  totalSlides = 8; // Número total de proyectos
  touchStartX = 0;
  touchStartY = 0;
  isAnimating = false;
  autoplayInterval: any;
  autoplayEnabled = false; // Cambiar a true para autoplay
  autoplayDelay = 5000; // 5 segundos

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.pauseAutoplay();
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    // Prevenir scroll si el usuario está deslizando horizontalmente
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const diffX = Math.abs(touchX - this.touchStartX);
    const diffY = Math.abs(touchY - this.touchStartY);
    
    if (diffX > diffY) {
      event.preventDefault();
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const difference = this.touchStartX - touchEndX;

    // Mínimo 50px de deslizamiento para cambiar
    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
    
    this.resumeAutoplay();
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.nextSlide();
      this.resetAutoplay();
    }
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
      this.resetAutoplay();
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.resetCarouselPosition();
      this.resizeCanvas();
      this.createParticles();
    }, 250);
  }

  ngOnInit() {
    if (this.autoplayEnabled) {
      this.startAutoplay();
    }
  }

  ngAfterViewInit() {
    // Inicializar canvas de partículas
    this.initCanvas();
    this.createParticles();
    this.animate();
    
    // Asegurar posición inicial correcta
    setTimeout(() => {
      this.resetCarouselPosition();
    }, 100);
  }

  ngOnDestroy() {
    this.stopAutoplay();
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  nextSlide() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (!track) {
      this.isAnimating = false;
      return;
    }

    const firstItem = track.firstElementChild as HTMLElement;
    if (!firstItem) {
      this.isAnimating = false;
      return;
    }

    // Calcular el ancho de desplazamiento (card + gap)
    const cardWidth = firstItem.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const slideDistance = cardWidth + gap;

    track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform = `translateX(-${slideDistance}px)`;

    setTimeout(() => {
      track.style.transition = 'none';
      track.appendChild(firstItem);
      track.style.transform = 'translateX(0)';
      
      // Force reflow
      track.offsetHeight;
      
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
      this.isAnimating = false;
    }, 600);
  }

  prevSlide() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (!track) {
      this.isAnimating = false;
      return;
    }

    const lastItem = track.lastElementChild as HTMLElement;
    if (!lastItem) {
      this.isAnimating = false;
      return;
    }

    // Calcular el ancho de desplazamiento
    const cardWidth = lastItem.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const slideDistance = cardWidth + gap;

    track.style.transition = 'none';
    track.insertBefore(lastItem, track.firstChild);
    track.style.transform = `translateX(-${slideDistance}px)`;
    
    // Force reflow
    track.offsetHeight;

    requestAnimationFrame(() => {
      track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      track.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.isAnimating = false;
    }, 600);
  }

  private resetCarouselPosition() {
    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (track) {
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
    }
  }

  // Autoplay methods
  private startAutoplay() {
    if (!this.autoplayEnabled) return;
    
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  private stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  private pauseAutoplay() {
    this.stopAutoplay();
  }

  private resumeAutoplay() {
    if (this.autoplayEnabled) {
      this.startAutoplay();
    }
  }

  private resetAutoplay() {
    if (this.autoplayEnabled) {
      this.stopAutoplay();
      this.startAutoplay();
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
}