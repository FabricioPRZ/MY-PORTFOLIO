import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { portfolio } from '../src/app/compositionRoot.js'

test('production composition preserves project links and valid story relationships', () => {
  const { projects } = portfolio.listProjects()
  const experiences = portfolio.listExperiences()
  assert.equal(new Set(projects.map(item => item.slug)).size, projects.length)
  assert.equal(new Set(experiences.map(item => item.slug)).size, experiences.length)
  for (const project of projects) {
    if (project.url) assert.equal(new URL(project.url).protocol, 'https:')
    for (const slug of project.related ?? []) assert.ok(portfolio.getExperienceDetail(slug))
    assert.ok(portfolio.getProjectDetail(project.slug).next)
  }
  for (const experience of experiences) {
    if (experience.relatedProject) assert.ok(portfolio.getProjectDetail(experience.relatedProject))
    assert.ok(portfolio.getExperienceDetail(experience.slug).next)
  }
})

test('all project images, event photos and download files exist', () => {
  const { projects } = portfolio.listProjects()
  const experiences = portfolio.listExperiences()
  const files = [
    portfolio.getProfile().cv,
    ...projects.map(project => project.image),
    ...experiences.flatMap(experience => [
      experience.image, experience.certificate, ...experience.images.map(image => image.src),
    ]),
  ].filter(Boolean)
  for (const file of files) {
    const asset = new URL(`../public${file}`, import.meta.url)
    assert.ok(existsSync(asset), `Missing asset: ${file}`)
  }
})
