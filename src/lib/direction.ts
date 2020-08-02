import m from 'mithril'

import { registerComponent, getModelValue, setModelValue } from './core'
import { use, twuiClass, clamp, getMouseXY, viewFn, call } from './utils'
import { ComponentModel, ValueSource, ComponentAttrs } from './types'
import { CanvasUtil, Line, Point, Vec3 } from './canvas'

const axisX: Line = { t: 'l', v: [[0, 0, 0], [1, 0, 0]], c: '#FF5555', a: 1 }
const axisY: Line = { t: 'l', v: [[0, 0, 0], [0, 1, 0]], c: '#55FF55', a: 1 }
const axisZ: Line = { t: 'l', v: [[0, 0, 0], [0, 0, 1]], c: '#5555FF', a: 1 }
const grid: Array<Line> = []
for (let i = -10; i <= 10; i++) {
  grid.push({
    t: 'l',
    v: [
      [i / 10, 0, -1],
      [i / 10, 0, 1],
    ],
    c: '#000000',
    a: 0.2,
  })
  grid.push({
    t: 'l',
    v: [
      [-1, 0, i / 10],
      [1, 0, i / 10],
    ],
    c: '#000000',
    a: 0.2,
  })
}

function normalize(v2: [number, number]) {
  const d = 1 / Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1])
  return [
    v2[0] * d,
    v2[1] * d,
  ]
}

/**
 * Direction component attributes
 * @public
 */
export type DirectionAttrs = ComponentAttrs<DirectionModel>

/**
 * Direction component model
 * @public
 */
export interface DirectionModel<T = any>
  extends ComponentModel,
    ValueSource<T, number> {
  /**
   * The type name of the control
   */
  type: 'direction',
  /**
   * The value property names. Defaults to `['x', 'y', 'z']`
   */
  keys?: string[],
  /**
   * This is called when the control value has been changed.
   */
  onInput?: (model: DirectionModel<T>, value: number) => void
  /**
   * This is called once the control value is committed by the user.
   *
   * @remarks
   * Unlike the `onInput` callback, this is not necessarily called for each value change.
   */
  onChange?: (model: DirectionModel<T>, value: number) => void
  /**
   * Disables the control input
   */
  disabled?: boolean
}

const defaultKeys = ['x', 'y', 'z']
registerComponent<DirectionAttrs>('direction', (node) => {
  let renderer: CanvasUtil

  let data: DirectionModel
  let keys: string[]
  let value: Vec3 = [0, 0, 1]
  let phi = 0
  let theta = 0
  let target: HTMLElement
  let prevX: number
  let prevY: number

  function updateState() {
    data = node.attrs.data
    keys = data.keys || defaultKeys
    const v: any = getModelValue(data) || {}
    value = keys.map((k) => (v as any)[k] || 0) as Vec3
    let [x, y, z] = value
    const r = Math.sqrt(x * x + y * y + z * z)
    if (Math.abs(r) < 0.001) {
      phi = 0
      theta = 0
      return
    }
    x /= r
    y /= r
    z /= r
    theta = Math.atan2(Math.sqrt(x * x + z * z), y) || 0
    phi = Math.atan2(x, z) || 0
  }

  function submitValue(type: 'input' | 'change') {
    value[0] = Math.sin(theta) * Math.sin(phi)
    value[1] = Math.cos(theta)
    value[2] = Math.sin(theta) * Math.cos(phi)

    const v: any = getModelValue(data) || {}
    keys.forEach((k, i) => v[k] = value[i])
    setModelValue(data, v)
    call(type === 'input' ? data.onInput : data.onChange, data, v)
    m.redraw()
  }

  function render() {
    renderer.resize(Math.min(renderer.canvas.clientWidth, 500))
    renderer.context.setLineDash([])
    renderer.clear()

    const arrow: Line = {
      t: 'l',
      c: '#FFFF88',
      v: [
        [0, 0, 0],
        value,
      ],
    }
    const dashedX: Line = {
      t: 'l',
      c: '#FF5555',
      dash: [3, 3],
      v: [
        [0, 0, value[2]],
        [value[0], 0, value[2]],
      ],
    }
    const dashedY: Line = {
      t: 'l',
      c: '#55FF55',
      dash: [3, 3],
      v: [
        value,
        [value[0], 0, value[2]],
      ],
    }
    const dashedZ: Line = {
      t: 'l',
      c: '#5555FF',
      dash: [3, 3],
      v: [
        [value[0], 0, 0],
        [value[0], 0, value[2]],
      ],
    }
    const dashedR: Line = {
      t: 'l',
      c: '#FFFF88',
      dash: [3, 3],
      v: [
        [0, 0, 0],
        [value[0], 0, value[2]],
      ],
    }

    if (value[1] >= 0) {
      renderer.draw3DPrimitves(grid)
      renderArrow(axisX)
      renderArrow(axisZ)
    }
    if (value[2] >= 0) {
      renderArrow(axisY)
    }
    renderArrow(arrow)
    if (value[1] < 0) {
      renderer.draw3DPrimitves(grid)
      renderArrow(axisX)
      renderArrow(axisZ)
    }
    if (value[2] < 0) {
      renderArrow(axisY)
    }

    renderer.draw3DPrimitves([
      dashedX, dashedZ, dashedR,
    ])
    renderer.draw3DPrimitves([ dashedY ])
  }

  function renderArrow(line: Line) {
    renderer.draw3DPrimitves([ line ])
    const tip = line.v[1]
    const p0 = renderer.project(tip)
    const p1 = renderer.project(tip.map((it) => it * 0.9) as any)
    const p2 = renderer.project(tip.map((it) => it * 0.95) as any)

    const c = renderer.project([0, 0, 0])
    const n = normalize([-(p0[1] - c[1]), p0[0] - c[0]])
    const n1 = [p1[0] + n[0] * 5, p1[1] + n[1] * 5]
    const n2 = [p1[0] - n[0] * 5, p1[1] - n[1] * 5]

    const ctx = renderer.context
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.moveTo(p0[0], p0[1])
    ctx.lineTo(n1[0], n1[1])
    ctx.lineTo(p2[0], p2[1])
    ctx.lineTo(n2[0], n2[1])
    ctx.closePath()
    ctx.fillStyle = line.c
    ctx.fill()
  }

  function onMouseDown(e: MouseEvent) {
    target = e.target as HTMLElement
    {
      [prevX, prevY] = getMouseXY(e)
    }
    onMouseMove(e)
  }

  function onMouseMove(e: MouseEvent | TouchEvent) {
    if (!target) {
      return
    }
    e.preventDefault()

    let dx: number = 0
    let dy: number = 0
    {
      const [x, y] = getMouseXY(e)
      dx = x - prevX
      dy = y - prevY
      prevX = x
      prevY = y
    }
    phi += dx * 0.016
    theta += dy * 0.016
    theta = clamp(theta, 0, Math.PI)

    submitValue('input')
  }

  function onMouseUp() {
    if (target != null) {
      target = null
      submitValue('change')
    }
  }
  return {
    oncreate: (vnode) => {
      renderer = new CanvasUtil(vnode.dom as HTMLCanvasElement)

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('touchmove', onMouseMove)
      document.addEventListener('touchend', onMouseUp)
      document.addEventListener('touchcancel', onMouseUp)

      render()
    },
    onremove: () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onMouseMove)
      document.removeEventListener('touchend', onMouseUp)
      document.removeEventListener('touchcancel', onMouseUp)
    },
    onupdate: () => {
      render()
    },
    view: viewFn(() => {
      updateState()
      return m('canvas', {
        class: twuiClass(data.type),
        onmousedown: onMouseDown,
        ontouchstart: onMouseDown,
      })
    }),
  }
})
