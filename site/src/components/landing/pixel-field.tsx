import * as React from 'react'
import { cn, useTheme } from 'libui'

/** Side of one pixel cell in CSS pixels: a 3px square and a 1px gap. */
const CELL = 4
/** Frames per second. The field moves slowly: a low rate saves power and looks the same. */
const FPS = 30
/** `GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST` (the TypeScript DOM library has the types, not this constant). */
const UNIFORM_BUFFER = 0x0040 | 0x0008

/**
 * The fragment shader. The canvas is cut into small cells. A cell is lit when a density value is
 * above the cell's own threshold, which gives a dithered gradient: dense pixels at one edge (the
 * top or the bottom) that thin out to nothing. A slow noise bends the edge of the fade and moves it, and each cell
 * breathes a little.
 */
const SHADER = /* wgsl */ `
struct Uniforms {
  resolution: vec2f, // size of the canvas, in device pixels
  time: f32,         // seconds
  cell: f32,         // side of a cell, in device pixels
  ink: vec4f,        // neutral pixel color (rgb) and its opacity (a)
  accent: vec4f,     // accent pixel color (rgb) and its opacity (a)
  options: vec4f,    // x: 0 = dense at the top, 1 = dense at the bottom; y: falloff (power of the fade)
}
@group(0) @binding(0) var<uniform> u: Uniforms;

@vertex
fn vertex(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
  // One triangle that covers the canvas.
  let corners = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  return vec4f(corners[index], 0.0, 1.0);
}

fn hash(p: vec2f) -> f32 {
  var q = fract(vec3f(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let s = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2f(1.0, 0.0)), s.x),
    mix(hash(i + vec2f(0.0, 1.0)), hash(i + vec2f(1.0, 1.0)), s.x),
    s.y,
  );
}

fn fbm(p: vec2f) -> f32 {
  return 0.5 * noise(p) + 0.3 * noise(p * 2.03 + 11.7) + 0.2 * noise(p * 4.01 + 47.3);
}

@fragment
fn fragment(@builtin(position) position: vec4f) -> @location(0) vec4f {
  let cell = floor(position.xy / u.cell);
  let inside = fract(position.xy / u.cell);
  let uv = (cell * u.cell) / u.resolution;
  // Distance from the edge the field starts from: 0 at that edge, 1 at the other one.
  let depth = mix(uv.y, 1.0 - uv.y - u.cell / u.resolution.y, u.options.x);

  // Soft shapes that drift: they bend the edge of the fade, so it is never a straight line.
  let drift = fbm(cell * 0.022 + vec2f(u.time * 0.010, -u.time * 0.016));
  let edge = depth * 1.2 + (drift - 0.5) * 0.7;
  let fade = 1.0 - smoothstep(0.0, 0.92, edge);
  // A little more on the right, where the page has less text.
  let side = mix(0.8, 1.0, smoothstep(0.1, 0.95, uv.x));
  // The power makes the field dense at its edge and thin where the text of the page is. A higher
  // power gives a short dense band and a long tail of scattered pixels.
  let density = pow(fade, u.options.y) * side;

  // Dither: each cell has its own threshold.
  let lit = step(hash(cell + 3.0), density);
  // The square of the cell, with a gap on two sides.
  let square = step(0.25, inside.x) * step(0.25, inside.y);
  // Each cell breathes at its own pace.
  let breath = 0.72 + 0.28 * sin(u.time * (0.5 + hash(cell + 7.0)) + hash(cell + 19.0) * 6.2832);

  // Patches of accent color inside the neutral field.
  let tint = smoothstep(0.52, 0.74, fbm(cell * 0.035 + vec2f(-u.time * 0.008, 31.0)));
  let color = mix(u.ink.rgb, u.accent.rgb, tint);
  let strength = mix(u.ink.a, u.accent.a, tint);

  let alpha = lit * square * breath * (0.4 + 0.6 * fade) * strength;
  return vec4f(color * alpha, alpha); // premultiplied
}
`

type Rgb = [number, number, number]

/** A CSS color (any syntax the browser knows, `oklch()` included) as sRGB values from 0 to 1. */
function readColor(context: CanvasRenderingContext2D, value: string): Rgb {
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = '#000'
  context.fillStyle = value
  context.fillRect(0, 0, 1, 1)
  const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

interface Renderer {
  /** Draws one frame. `time` is in seconds. */
  draw(time: number): void
  /** Reads the token colors again (after a theme change). */
  setColors(dark: boolean): void
  destroy(): void
}

interface Gpu {
  device: GPUDevice
  format: GPUTextureFormat
  pipeline: GPURenderPipeline
}

let sharedGpu: Promise<Gpu | null> | null = null

/** One device and one pipeline for every field of the page. `null` when the browser has no WebGPU. */
function getGpu(): Promise<Gpu | null> {
  sharedGpu ??= (async () => {
    if (!('gpu' in navigator)) return null
    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) return null
    const device = await adapter.requestDevice()
    const format = navigator.gpu.getPreferredCanvasFormat()
    const module = device.createShaderModule({ code: SHADER })
    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: { module, entryPoint: 'vertex' },
      fragment: { module, entryPoint: 'fragment', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    })
    // The browser can take the device back (the GPU process restarted): the next field asks again.
    void device.lost.then(() => {
      sharedGpu = null
    })
    return { device, format, pipeline }
  })().catch(() => null)
  return sharedGpu
}

async function createRenderer(canvas: HTMLCanvasElement, from: PixelFieldOrigin, falloff: number): Promise<Renderer | null> {
  const gpu = await getGpu()
  if (!gpu) return null
  const { device, format, pipeline } = gpu
  const context = canvas.getContext('webgpu') as GPUCanvasContext | null
  if (!context) return null
  context.configure({ device, format, alphaMode: 'premultiplied' })

  // resolution (2) + time (1) + cell (1) + ink (4) + accent (4) + options (4)
  const values = new Float32Array(16)
  values[12] = from === 'bottom' ? 1 : 0
  values[13] = falloff
  const buffer = device.createBuffer({ size: values.byteLength, usage: UNIFORM_BUFFER })
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer } }],
  })

  const probe = document.createElement('canvas')
  probe.width = probe.height = 1
  const probeContext = probe.getContext('2d', { willReadFrequently: true })
  let destroyed = false

  return {
    setColors(dark) {
      if (!probeContext) return
      const style = getComputedStyle(document.documentElement)
      const ink = readColor(probeContext, style.getPropertyValue('--foreground'))
      const accent = readColor(probeContext, style.getPropertyValue('--primary-bright'))
      // Light pixels on a dark canvas read stronger than dark pixels on white: lower them.
      values.set([...ink, dark ? 0.1 : 0.13], 4)
      values.set([...accent, dark ? 0.42 : 0.5], 8)
    },
    draw(time) {
      if (destroyed) return
      const ratio = canvas.width / Math.max(1, canvas.clientWidth)
      values[0] = canvas.width
      values[1] = canvas.height
      values[2] = time
      values[3] = CELL * ratio
      device.queue.writeBuffer(buffer, 0, values)
      const encoder = device.createCommandEncoder()
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          { view: context.getCurrentTexture().createView(), clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' },
        ],
      })
      pass.setPipeline(pipeline)
      pass.setBindGroup(0, bindGroup)
      pass.draw(3)
      pass.end()
      device.queue.submit([encoder.finish()])
    },
    destroy() {
      destroyed = true
      // The device stays: the other fields of the page use it. The context stays configured too:
      // in development React mounts the field twice, and both mounts share the canvas.
      buffer.destroy()
    },
  }
}

/** The edge where the field is dense. It thins out toward the other edge. */
export type PixelFieldOrigin = 'top' | 'bottom'

export interface PixelFieldProps {
  /**
   * The edge the field starts from: `top` (default) is dense at the top and thins out downward,
   * `bottom` is dense at the bottom and thins out upward.
   */
  from?: PixelFieldOrigin
  /**
   * How fast the field thins out: the power applied to the fade. Default 2.6. A higher value keeps
   * the dense band short and leaves a long tail of scattered pixels (use it for a tall field that
   * passes behind text).
   */
  falloff?: number
  /** Position and size of the field: it fills this box (for example `absolute inset-x-0 top-0 h-96`). */
  className?: string
}

/**
 * A decorative background: a dense field of small pixels that thins out into the page, drawn by a
 * WebGPU shader and moving slowly. The colors are libui tokens (`foreground` and `primary-bright`),
 * so the field follows the theme. Use it at an edge of the page: the top of the hero, the bottom of
 * the footer.
 *
 * Every field of a page shares one GPU device. A browser with no WebGPU gets a still pixel pattern
 * in CSS (`.pixel-fallback`). A reader who asks for reduced motion gets one still frame. A field
 * stops when it is out of view.
 */
export function PixelField({ from = 'top', falloff = 2.6, className }: PixelFieldProps) {
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const renderer = React.useRef<Renderer | null>(null)
  const { resolvedTheme } = useTheme()
  const [mode, setMode] = React.useState<'pending' | 'gpu' | 'fallback'>('pending')

  React.useEffect(() => {
    const element = canvas.current
    if (!element) return
    let cancelled = false
    let frame = 0
    let visible = true
    let last = 0
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      element.width = Math.max(1, Math.round(element.clientWidth * ratio))
      element.height = Math.max(1, Math.round(element.clientHeight * ratio))
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (!visible || now - last < 1000 / FPS) return
      last = now
      renderer.current?.draw(now / 1000)
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      // A still field has no frame loop: draw it again at its new size.
      if (still) renderer.current?.draw(12)
    })
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true
    })

    createRenderer(element, from, falloff)
      .then((created) => {
        if (cancelled) {
          created?.destroy()
          return
        }
        if (!created) {
          setMode('fallback')
          return
        }
        renderer.current = created
        created.setColors(document.documentElement.classList.contains('dark'))
        resize()
        resizeObserver.observe(element)
        viewObserver.observe(element)
        if (still) created.draw(12)
        else frame = requestAnimationFrame(tick)
        setMode('gpu')
      })
      .catch(() => {
        if (!cancelled) setMode('fallback')
      })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      viewObserver.disconnect()
      renderer.current?.destroy()
      renderer.current = null
    }
  }, [from, falloff])

  // The tokens change with the theme: read them again after the class of <html> changed.
  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      renderer.current?.setColors(resolvedTheme === 'dark')
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) renderer.current?.draw(12)
    })
    return () => cancelAnimationFrame(id)
  }, [resolvedTheme, mode])

  return (
    <div aria-hidden="true" data-from={from} className={cn('pixel-field pointer-events-none', className)}>
      <canvas
        ref={canvas}
        className={cn('size-full transition-opacity duration-1000 ease-out', mode === 'gpu' ? 'opacity-100' : 'opacity-0')}
      />
      {mode === 'fallback' && <div className="pixel-fallback absolute inset-0" />}
    </div>
  )
}
