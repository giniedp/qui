const viewProj = [
  0.7071067690849304,
  -0.40824827551841736,
  -0.5773502588272095,
  0,
  0,
  0.8164965510368347,
  -0.5773502588272095,
  0,
  -0.7071067690849304,
  -0.40824827551841736,
  -0.5773502588272095,
  0,
  0,
  0,
  0.732050895690918,
  1,
]

const eps = 2.7755575615628914e-17

function transform(mat: Mat4, vec: Vec3, out?: Vec3): Vec3 {
  const x = vec[0]
  const y = vec[1]
  const z = vec[2]
  const w = 1
  const d = mat
  out = out || vec
  out[0] = x * d[0] + y * d[4] + z * d[8] + w * d[12]
  out[1] = x * d[1] + y * d[5] + z * d[9] + w * d[13]
  out[2] = x * d[2] + y * d[6] + z * d[10] + w * d[14]
  const wp = x * d[3] + y * d[7] + z * d[11] + w * d[15]
  if (Math.abs(wp) > eps) {
    out[0] /= wp
    out[1] /= wp
    out[2] /= wp
  }
  return out
}

function project(view: View, source: Vec3): Vec3 {
  const out: Vec3 = transform(view.proj, source, [0, 0, 0])
  out[0] = (out[0] + 1) * 0.5 * view.width
  out[1] = (-out[1] + 1) * 0.5 * view.height
  out[2] = out[2] * (view.zmax - view.zmin) + view.zmin
  return out
}

export type View = {
  width: number
  height: number
  zmin: number
  zmax: number
  proj: Mat4
}
export type Mat4 = number[]
export type Vec3 = [number, number, number]
export type Line = {
  t: 'l'
  v: [Vec3, Vec3]
  c: string
  a?: number
  dash?: [number, number]
}
export type Point = { t: 'p'; at: Vec3; color: string; alpha: number }
export type Triangle = {
  t: 't'
  v: [Vec3, Vec3, Vec3]
  color: string
  alpha: number
}

export class CanvasUtil {
  public matrix: Mat4 = viewProj
  public readonly context: CanvasRenderingContext2D

  public get width() {
    return this.canvas.width
  }
  public get height() {
    return this.canvas.height
  }
  public readonly zmin = 0
  public readonly zmax = 1
  public readonly proj = viewProj

  constructor(public readonly canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')
  }

  public resize(width: number, height = width) {
    this.canvas.width = width
    this.canvas.height = height
  }
  public clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  public draw3DPrimitves(instructions: Array<Line | Point | Triangle> = []) {
    const c = this.context
    for (const inst of instructions) {
      if (inst.t === 'l') {
        c.globalAlpha = inst.a ?? 1
        c.setLineDash(inst.dash ?? [])
        c.beginPath()
        const from = this.project(inst.v[0])
        const to = this.project(inst.v[1])
        c.moveTo(from[0], from[1])
        c.lineTo(to[0], to[1])
        c.lineWidth = 1
        c.strokeStyle = inst.c
        c.stroke()
      }
      if (inst.t === 't') {
        const v0 = this.project(inst.v[0])
        const v1 = this.project(inst.v[1])
        const v2 = this.project(inst.v[1])

        c.globalAlpha = inst.alpha
        c.beginPath()
        c.moveTo(v0[0], v0[1])
        c.moveTo(v1[0], v1[1])
        c.moveTo(v2[0], v2[1])
        c.closePath()
        c.fillStyle = inst.color
        c.fill()
      }
    }
  }

  public project(v3: Vec3): Vec3 {
    return project(this, v3)
  }
}
