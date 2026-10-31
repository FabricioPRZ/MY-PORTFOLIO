import test from 'node:test'
import assert from 'node:assert/strict'
import { createPortfolioUseCases } from '../src/application/use-cases/createPortfolioUseCases.js'
import { nextBySlug } from '../src/domain/portfolio.js'
import { createStaticPortfolioRepository } from '../src/infrastructure/repositories/createStaticPortfolioRepository.js'
import { normalizeHash } from '../src/presentation/routing/hashRouter.js'
import { resolveRoute } from '../src/presentation/routing/resolveRoute.js'

function makeContent() {
  return {
    profile: { name: 'Test Author', cv: '/cv.pdf', email: 'test@example.com' },
    projects: [
      { slug: 'alpha', name: 'Alpha', category: 'Universidad', url: 'https://example.com/a', related: ['talk', 'missing'] },
      { slug: 'beta', name: 'Beta', category: 'Desarrollo web', url: null },
      { slug: 'gamma', name: 'Gamma', category: 'Universidad', url: 'https://example.com/g' },
      { slug: 'delta', name: 'Delta', category: 'Robótica', url: 'https://example.com/d' },
      { slug: 'epsilon', name: 'Epsilon', category: 'Investigación', url: 'https://example.com/e' },
    ],
    experiences: [
      { slug: 'talk', name: 'Talk', relatedProject: 'alpha' },
      { slug: 'fair', name: 'Fair' },
      { slug: 'meetup', name: 'Meetup' },
      { slug: 'workshop', name: 'Workshop' },
    ],
    expertise: [{ label: 'Frontend' }],
    timeline: [{ title: 'Alpha', href: '#/proyectos/alpha' }],
  }
}

// An independent port implementation: every read returns different objects.
// This catches accidental coupling to static fixtures or reference identity.
function fakeRepository(content = makeContent()) {
  return {
    getProfile: () => structuredClone(content.profile),
    getProjects: () => structuredClone(content.projects),
    getExperiences: () => structuredClone(content.experiences),
    getExpertise: () => structuredClone(content.expertise),
    getTimeline: () => structuredClone(content.timeline),
  }
}

test('use cases receive all content through the repository port', () => {
  const content = makeContent()
  const portfolio = createPortfolioUseCases(fakeRepository(content))
  assert.deepEqual(portfolio.getProfile(), content.profile)
  assert.deepEqual(portfolio.getAboutPage(), {
    profile: content.profile, expertise: content.expertise, timeline: content.timeline,
  })
  assert.deepEqual(portfolio.listExperiences(), content.experiences)
  const home = portfolio.getHomePage()
  assert.deepEqual(home.projects, content.projects.slice(0, 4))
  assert.deepEqual(home.experiences, content.experiences.slice(0, 3))
  assert.deepEqual(home.profile, content.profile)
  assert.deepEqual(home.expertise, content.expertise)
})

test('filters keep catalog order and compute counts from the full catalog', () => {
  const portfolio = createPortfolioUseCases(fakeRepository())
  const result = portfolio.listProjects('Universidad')
  assert.deepEqual(result.projects.map(project => project.slug), ['alpha', 'gamma'])
  assert.equal(result.total, 5)
  assert.equal(result.categories.find(item => item.value === 'Universidad').count, 2)
  assert.equal(result.categories.find(item => item.value === 'Robótica').count, 1)
  assert.equal(portfolio.listProjects().projects.length, 5)
  assert.deepEqual(portfolio.listProjects('Unknown').projects, [])
})

test('details join related stories and use slugs for circular navigation', () => {
  const portfolio = createPortfolioUseCases(fakeRepository())
  const detail = portfolio.getProjectDetail('alpha')
  assert.deepEqual(detail.related.map(item => item.slug), ['talk'])
  assert.equal(detail.next.slug, 'beta')
  assert.equal(portfolio.getProjectDetail('epsilon').next.slug, 'alpha')
  assert.deepEqual(portfolio.getProjectDetail('beta').related, [])
  assert.equal(portfolio.getExperienceDetail('workshop').next.slug, 'talk')
  assert.equal(portfolio.getProjectDetail('absent'), null)
  assert.equal(portfolio.getExperienceDetail('absent'), null)
  assert.equal(nextBySlug([], 'absent'), null)
  assert.equal(nextBySlug([{ slug: 'only' }], 'only').slug, 'only')
})

test('an empty repository produces empty catalogs and missing details', () => {
  const content = { ...makeContent(), projects: [], experiences: [] }
  const portfolio = createPortfolioUseCases(fakeRepository(content))
  assert.equal(portfolio.listProjects().total, 0)
  assert.deepEqual(portfolio.getHomePage().projects, [])
  assert.deepEqual(portfolio.getHomePage().experiences, [])
  assert.equal(portfolio.getProjectDetail('alpha'), null)
  assert.equal(portfolio.getExperienceDetail('talk'), null)
})

test('static adapter preserves links and isolates both input and consumer mutations', () => {
  const content = makeContent()
  const repository = createStaticPortfolioRepository(content)
  content.profile.name = 'Changed outside'
  content.projects[0].url = 'https://example.com/replaced'
  assert.equal(repository.getProfile().name, 'Test Author')
  assert.equal(repository.getProjects()[0].url, 'https://example.com/a')
  assert.equal(repository.getProjects()[1].url, null)
  assert.throws(() => { repository.getProjects()[0].url = 'changed' }, TypeError)
  assert.throws(() => { repository.getProjects()[0].related.push('extra') }, TypeError)
  assert.throws(() => { repository.getExperiences().pop() }, TypeError)
})

test('hash routes retain direct links and use application detail results', () => {
  const portfolio = createPortfolioUseCases(fakeRepository())
  for (const hash of ['', '#', '#/']) assert.equal(normalizeHash(hash), '/')
  assert.equal(normalizeHash('#/proyectos/alpha/?source=cv'), '/proyectos/alpha')
  assert.equal(resolveRoute('/', portfolio).name, 'home')
  assert.equal(resolveRoute('/proyectos', portfolio).name, 'projects')
  assert.equal(resolveRoute('/experiencias', portfolio).name, 'experiences')
  assert.equal(resolveRoute('/sobre-mi', portfolio).name, 'about')
  assert.equal(resolveRoute('/contacto', portfolio).name, 'contact')
  const route = resolveRoute('/proyectos/alpha', portfolio)
  assert.equal(route.name, 'projectDetail')
  assert.equal(route.title, 'Alpha')
  assert.equal(route.props.next.slug, 'beta')
  assert.equal(resolveRoute('/experiencias/talk', portfolio).props.experience.slug, 'talk')
  for (const path of ['/proyectos/absent', '/experiencias/absent', '/proyectos/alpha/extra', '/other', 'toString']) {
    assert.equal(resolveRoute(path, portfolio).name, 'notFound')
  }
})
