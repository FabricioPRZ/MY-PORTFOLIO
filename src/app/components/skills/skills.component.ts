import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'design';
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  
  skills: Skill[] = [
    // Frontend
    { name: 'Angular', level: 95, category: 'frontend' },
    { name: 'React', level: 85, category: 'frontend' },
    { name: 'Vue', level: 80, category: 'frontend' },
    { name: 'TypeScript', level: 90, category: 'frontend' },
    { name: 'JavaScript', level: 90, category: 'frontend' },
    
    // Backend
    { name: 'Node.js', level: 85, category: 'backend' },
    { name: 'Python', level: 80, category: 'backend' },
    { name: 'Java', level: 75, category: 'backend' },
    { name: 'Go', level: 70, category: 'backend' },
    
    // Tools
    { name: 'Git', level: 90, category: 'tools' },
    { name: 'Docker', level: 75, category: 'tools' },
    { name: 'AWS', level: 70, category: 'tools' },
    
    // Design
    { name: 'Figma', level: 90, category: 'design' },
    { name: 'UI/UX', level: 85, category: 'design' }
  ];

  categories = [
    { id: 'frontend', label: 'Frontend', icon: '💻' },
    { id: 'backend', label: 'Backend', icon: '⚙️' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'design', label: 'Design', icon: '🎨' }
  ];

  selectedCategory: string = 'all';
  animatedLevels: { [key: string]: number } = {};

  ngOnInit(): void {
    this.skills.forEach(skill => {
      this.animatedLevels[skill.name] = 0;
    });
    
    setTimeout(() => this.animateSkills(), 300);
  }

  private animateSkills(): void {
    this.skills.forEach((skill, index) => {
      setTimeout(() => {
        this.animateLevel(skill.name, skill.level);
      }, index * 100);
    });
  }

  private animateLevel(name: string, target: number): void {
    const duration = 1000;
    const start = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      this.animatedLevels[name] = target * eased;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  getSkillLevel(name: string): number {
    return this.animatedLevels[name] || 0;
  }

  filterSkills(category: string): void {
    this.selectedCategory = category;
  }

  get filteredSkills(): Skill[] {
    if (this.selectedCategory === 'all') {
      return this.skills;
    }
    return this.skills.filter(s => s.category === this.selectedCategory);
  }

  getCategorySkills(categoryId: string): Skill[] {
    return this.skills.filter(s => s.category === categoryId);
  }
}
