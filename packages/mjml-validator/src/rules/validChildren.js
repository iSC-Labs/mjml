import { flattenComponents } from 'mjml-core'
import dependencies from '../dependencies'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import ruleError from './ruleError'

export const validChildren = (element) => {
  const components = flattenComponents()
  const { children, tagName } = element
  const Component = components[tagName]

  if (!Component) {
    return;
  }

  if (!children || children.length == 0) {
    return;
  }

  return filter(children.map((child) => {
    const childTagName = child.tagName
    const ChildComponent = components[childTagName]
    const parentDependencies = dependencies[tagName] || []

    if (!ChildComponent) {
      return null;
    }

    if (includes(parentDependencies, childTagName)) {
      return null;
    }

    return ruleError(`${childTagName} cannot be used inside ${tagName}, only inside: ${parentDependencies.join(', ')}`, child)
  }))
}
