import { defineConfig, presetMini } from 'unocss'

export default defineConfig({
  presets: [presetMini()],
  rules: [
    // padding, margin
    [
      /^(m|p)(?:-(t|b|l|r|x|y))?-(\d+)$/,
      ([, type, dir, d]) => {
        const props = { m: 'margin', p: 'padding' }
        const directions = {
          t: ['top'],
          b: ['bottom'],
          l: ['left'],
          r: ['right'],
          x: ['left', 'right'],
          y: ['top', 'bottom']
        }
        const prop = props[type]
        const value = `${d}px`

        if (!dir) {
          return { [prop]: value }
        }
        const styles = {}
        for (const d of directions[dir]) {
          styles[`${prop}-${d}`] = value
        }
        return styles
      }
    ],
    // width, height
    [/^(w|h)-(\d+)$/, ([, type, d]) => ({ [type === 'w' ? 'width' : 'height']: `${d}px` })],
    // gap
    [/^gap-(\d+)$/, ([, d]) => ({ gap: `${d}px` })],
    [
      /^gap-(x|y)-(\d+)$/,
      ([, dir, d]) => ({ [`${dir === 'x' ? 'column' : 'row'}-gap`]: `${d}px` })
    ],
    // font size
    [/^font-(\d+)$/, ([, d]) => ({ 'font-size': `${d}px` })],
    // flex
    [/^flex-(\d+)$/, ([, d]) => ({ flex: d })]
  ]
})
