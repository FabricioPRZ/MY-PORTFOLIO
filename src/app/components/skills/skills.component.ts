import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  icon: string;
  level: number;
  color?: string;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particlesCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number = 0;
  private resizeTimeout: any;
  private observerTimeout: any;

  skillCategories: SkillCategory[] = [
    {
      title: 'Languages',
      skills: [
        { name: 'TypeScript', icon: 'devicon-typescript-plain', level: 90, color: '#3178C6' },
        { name: 'JavaScript', icon: 'devicon-javascript-plain', level: 85, color: '#F7DF1E' },
        { name: 'Python', icon: 'devicon-python-plain', level: 75, color: '#3776AB' },
        { name: 'Java', icon: 'devicon-java-plain', level: 70, color: '#007396' },
        { name: 'Go', icon: 'devicon-go-plain', level: 80, color: '#00ADD8' }
      ]
    },
    {
      title: 'Frameworks',
      skills: [
        { name: 'Angular', icon: 'devicon-angularjs-plain', level: 95, color: '#DD0031' },
        { name: 'React', icon: 'devicon-react-original', level: 80, color: '#61DAFB' },
        { name: 'Vue', icon: 'devicon-vuejs-plain', level: 85, color: '#4FC08D' },
        { name: 'Flask', icon: 'devicon-flask-plain', level: 80, color: '#000000' },
        { name: 'Express', icon: 'devicon-express-original', level: 85, color: '#000000' },
        { name: 'FastAPI', icon: 'devicon-fastapi-plain', level: 85, color: '#009688' },
        { name: 'JavaFX', icon: 'devicon-java-plain', level: 90, color: '#007396' },
      ]
    },
    {
      title: 'Tools',
      skills: [
        { name: 'Git', icon: 'devicon-git-plain', level: 90, color: '#F05032' },
        { name: 'GitHub', icon: 'devicon-github-plain', level: 95, color: '#181717' },
        { name: 'Figma', icon: 'devicon-figma-plain', level: 90, color: '#F24E1E' },
        { name: 'Canva', icon: 'devicon-canva-plain', level: 85, color: '#00C4CC' },
        { name: 'CorelDRAW', icon: 'devicon-coreldraw-plain', level: 80, color: '#ED1C24' },
      ]
    },
    {
      title: 'Databases',
      skills: [
        { name: 'MySQL', icon: 'devicon-mysql-plain', level: 80, color: '#4479A1' },
        { name: 'MongoDB', icon: 'devicon-mongodb-plain', level: 75, color: '#47A248' },
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', level: 70, color: '#336791' },
      ]
    },
    {
      title: 'Libraries',
      skills: [
        { name: 'SCSS', icon: 'devicon-sass-plain', level: 90, color: '#CC6699' },
        { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain', level: 85, color: '#38B2AC' },
        { name: 'Bootstrap', icon: 'devicon-bootstrap-plain', level: 80, color: '#7952B3' },
      ]
    }
  ];

  // Estado de animación de las barras de nivel
  animatedLevels: { [key: string]: number } = {};

  ngOnInit(): void {
    // Inicializar niveles en 0 para animación
    this.skillCategories.forEach(category => {
      category.skills.forEach(skill => {
        this.animatedLevels[skill.name] = 0;
      });
    });
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.createParticles();
    this.animate();
    this.setupEventListeners();
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.observerTimeout) {
      clearTimeout(this.observerTimeout);
    }
    window.removeEventListener('resize', this.onResize);
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
    const particleCount = Math.floor((canvas.width * canvas.height) / 18000);
    
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
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      color: color
    };
  }

  private updateParticle(particle: Particle): void {
    const canvas = this.canvasRef.nativeElement;
    
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) {
      particle.speedX *= -1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.speedY *= -1;
    }

    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
  }

  private drawParticle(particle: Particle): void {
    // Glow exterior
    const gradient = this.ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * 4
    );
    gradient.addColorStop(0, `${particle.color} ${particle.opacity})`);
    gradient.addColorStop(0.5, `${particle.color} ${particle.opacity * 0.3})`);
    gradient.addColorStop(1, `${particle.color} 0)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Partícula central
    this.ctx.fillStyle = `${particle.color} ${particle.opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawConnections(): void {
    const maxDistance = 100;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;
          
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
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach(particle => {
      this.updateParticle(particle);
      this.drawParticle(particle);
    });

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

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onResize);
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.1, // Threshold más bajo para pantallas pequeñas
      rootMargin: '0px 0px -100px 0px' // Trigger antes de que esté completamente visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSkillLevels();
          observer.disconnect();
        }
      });
    }, options);

    // Observar la primera categoría de skills en lugar de toda la sección
    this.observerTimeout = setTimeout(() => {
      const firstCategory = document.querySelector('.skill-category');
      if (firstCategory) {
        observer.observe(firstCategory);
      } else {
        // Fallback: animar después de un delay si no se encuentra el elemento
        this.animateSkillLevels();
      }
    }, 100);
  }

  private animateSkillLevels(): void {
    this.skillCategories.forEach((category, categoryIndex) => {
      category.skills.forEach((skill, skillIndex) => {
        const delay = (categoryIndex * 200) + (skillIndex * 100);
        
        setTimeout(() => {
          this.animateLevel(skill.name, skill.level);
        }, delay);
      });
    });
  }

  private animateLevel(skillName: string, targetLevel: number): void {
    const duration = 1500;
    const startTime = Date.now();
    const startLevel = 0;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      this.animatedLevels[skillName] = startLevel + (targetLevel - startLevel) * easeOut;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.animatedLevels[skillName] = targetLevel;
      }
    };

    animate();
  }

  getSkillLevel(skillName: string): number {
    return this.animatedLevels[skillName] || 0;
  }
}