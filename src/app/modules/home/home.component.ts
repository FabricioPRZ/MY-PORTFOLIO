import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { HeroComponent } from "../../components/hero/hero.component";
import { ExperienceComponent } from "../../components/experience/experience.component";
import { SkillsComponent } from "../../components/skills/skills.component";
import { ProjectsComponent } from "../../components/projects/projects.component";
import { CertificationsComponent } from "../../components/certifications/certifications.component";
import { SocialMediaComponent } from "../../components/social-media/social-media.component";
import { ContactComponent } from "../../components/contact/contact.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, HeroComponent, ExperienceComponent, SkillsComponent, ProjectsComponent, CertificationsComponent, SocialMediaComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
