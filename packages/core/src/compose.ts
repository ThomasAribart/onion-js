import type {
  ComposeLeft as ComposeDown,
  Compose as ComposeUp
} from 'hotscript'

import type { After, Before, InFns, Layer, OutFns } from './layer.js'

const composeTwo =
  (layerA: Layer, layerB: Layer) =>
  (arg: unknown): unknown =>
    layerA(layerB(arg))

const identity: Layer = (arg: unknown): unknown => arg

type Head<ITEMS extends unknown[]> = ITEMS extends [
  infer ITEMS_HEAD,
  ...unknown[]
]
  ? ITEMS_HEAD
  : never

type Last<ITEMS extends unknown[]> = ITEMS extends [
  ...unknown[],
  infer ITEMS_LAST
]
  ? ITEMS_LAST
  : never

export type ComposeUpLayers<LAYERS extends Layer[]> = Layer<
  Last<LAYERS> extends Layer ? Before<Last<LAYERS>> : never,
  ComposeUp<OutFns<LAYERS>>,
  Head<LAYERS> extends Layer ? After<Head<LAYERS>> : never,
  ComposeDown<InFns<LAYERS>>
>

export const composeUp = <LAYERS extends Layer[]>(
  ...layers: LAYERS
): ComposeUpLayers<LAYERS> =>
  layers.reduce(composeTwo, identity) as ComposeUpLayers<LAYERS>

export type ComposeDownLayers<LAYERS extends Layer[]> = Layer<
  Head<LAYERS> extends Layer ? Before<Head<LAYERS>> : never,
  ComposeDown<OutFns<LAYERS>>,
  Last<LAYERS> extends Layer ? After<Last<LAYERS>> : never,
  ComposeUp<InFns<LAYERS>>
>

export const composeDown = <LAYERS extends Layer[]>(
  ...layers: LAYERS
): ComposeDownLayers<LAYERS> =>
  [...layers]
    .reverse()
    .reduce(composeTwo, identity) as ComposeDownLayers<LAYERS>
