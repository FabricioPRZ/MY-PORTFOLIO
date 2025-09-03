import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
    currentSlide = 0;
    touchStartX = 0;
    isAnimating = false;

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent) {
        this.touchStartX = event.touches[0].clientX;
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event: TouchEvent) {
        const touchEndX = event.changedTouches[0].clientX;
        const difference = this.touchStartX - touchEndX;

        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.key === 'ArrowRight') {
            this.nextSlide();
        }
        if (event.key === 'ArrowLeft') {
            this.prevSlide();
        }
    }

    ngOnInit() {}

    nextSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const track = document.querySelector('.carousel-track') as HTMLElement;
        if (track) {
            const firstItem = track.firstElementChild as HTMLElement;
            
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${track.clientWidth}px)`;

            setTimeout(() => {
                track.style.transition = 'none';
                track.appendChild(firstItem);
                track.offsetHeight; // Force reflow
                this.isAnimating = false;
            }, 500);
        }
    }

    prevSlide() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const track = document.querySelector('.carousel-track') as HTMLElement;
        if (track) {
            const lastItem = track.lastElementChild as HTMLElement;
            
            track.style.transition = 'none';
            track.insertBefore(lastItem, track.firstChild);
            track.style.transform = `translateX(-${track.clientWidth}px)`;
            track.offsetHeight; // Force reflow

            requestAnimationFrame(() => {
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = 'translateX(0)';
            });

            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        }
    }
}
