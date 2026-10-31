import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('../src', import.meta.url))
const allowedLayers = {
  domain: ['domain'],
  application: ['application', 'domain'],
  infrastructure: ['infrastructure', 'application', 'domain'],
  presentation: ['presentation', 'application', 'domain'],
  app: ['app', 'domain', 'application', 'infrastructure', 'presentation'],
  'main.jsx': ['app', 'presentation'],
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : /\.(js|jsx)$/.test(path) ? [path] : []
  })
}

test('source dependencies point inward and contain no cycles', () => {
  const graph = new Map()
  for (const file of sourceFiles(sourceRoot)) {
    const name = relative(sourceRoot, file)
    const layer = name.split('/')[0]
    assert.ok(allowedLayers[layer], `Unassigned source layer: ${name}`)
    const content = readFileSync(file, 'utf8')
    const dependencies = [
      ...content.matchAll(/\b(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g),
      ...content.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]/g),
    ].map(match => match[1])
    const edges = []
    for (const dependency of dependencies) {
      if (!dependency.startsWith('.')) {
        assert.ok(!['domain', 'application'].includes(layer), `${name} imports external dependency ${dependency}`)
        continue
      }
      const base = resolve(dirname(file), dependency)
      const target = [base, `${base}.js`, `${base}.jsx`].find(existsSync)
      assert.ok(target, `${name} imports missing module ${dependency}`)
      const targetLayer = relative(sourceRoot, target).split('/')[0]
      assert.ok(allowedLayers[layer].includes(targetLayer), `${name} must not depend on ${targetLayer}`)
      edges.push(target)
    }
    graph.set(file, edges)
  }

  const visited = new Set()
  function visit(file, stack = new Set()) {
    assert.ok(!stack.has(file), `Circular dependency at ${relative(sourceRoot, file)}`)
    if (visited.has(file)) return
    const nextStack = new Set([...stack, file])
    for (const dependency of graph.get(file) ?? []) visit(dependency, nextStack)
    visited.add(file)
  }
  for (const file of graph.keys()) visit(file)
})
