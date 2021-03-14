
import type { ComponentModel } from './types'
import { getComponent } from './registry'
import { default as m } from 'mithril'

/**
 * Renders a registered component using the model
 *
 * @public
 * @param model - The model
 */
export function renderModel<T extends ComponentModel>(model: T) {
  if (!model.type) {
    console.error(new Error('Given data is missing the .type property. Component can resolve the component'), model)
    return null
  }
  if (model.hidden) {
    return null
  }
  return m(getComponent(model.type), { data: model })
}
