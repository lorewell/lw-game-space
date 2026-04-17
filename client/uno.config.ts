import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    })
  ],

  theme: {
    colors: {
      // 深色模式基础色
      dark: {
        bg: {
          primary: '#0a0a0f',
          secondary: '#12121a',
          card: '#1a1a24',
          elevated: '#22222e',
        },
        border: {
          DEFAULT: '#2a2a3a',
          light: '#3a3a4a',
        },
        text: {
          DEFAULT: '#e4e4ed',
          secondary: '#8888a0',
          muted: '#5a5a70',
        }
      },
      // 浅色模式基础色
      light: {
        bg: {
          primary: '#f8f9fc',
          secondary: '#ffffff',
          card: '#ffffff',
          elevated: '#f0f2f7',
        },
        border: {
          DEFAULT: '#e2e4ea',
          light: '#ebedf2',
        },
        text: {
          DEFAULT: '#1a1a2e',
          secondary: '#5a5a70',
          muted: '#8888a0',
        }
      },
      // 强调色
      accent: {
        primary: '#6366f1',     // 靛蓝紫
        secondary: '#22d3ee',   // 青色
        tertiary: '#f472b6',    // 粉紫
        gradient: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 50%, #f472b6 100%)',
        glow: 'rgba(99, 102, 241, 0.4)',
      },
      // 玩家色
      player: {
        left: '#f97316',    // 橙色
        right: '#3b82f6',   // 蓝色
        vs: '#fbbf24',      // 金色
      },
      // 语义色
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },

    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      display: ['Orbitron', 'Inter', 'sans-serif'], // 游戏风格标题字体
    },

    breakpoints: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

    animation: {
      keyframes: {
        'fade-in': '{from{opacity:0}to{opacity:1}}',
        'slide-up': '{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}',
        'slide-down': '{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}',
        'scale-in': '{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}',
        'glow-pulse': '{0%,100%{box-shadow:0 0 8px var(--tw-shadow-color)}50%{box-shadow:0 0 24px var(--tw-shadow-color)}}',
        'float': '{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}',
        'shimmer': '{0%{background-position:-200% 0}100%{background-position:200% 0}}',
        'border-flow': '{0%{background-position:0% 50%}100%{background-position:100% 50%}}',
        'spin-slow': '{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
        'bounce-subtle': '{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
      },
      durations: {
        'fade-in': '300ms',
        'slide-up': '400ms',
        'slide-down': '400ms',
        'scale-in': '300ms',
        'glow-pulse': '2s',
        'float': '3s',
        'shimmer': '2s',
        'border-flow': '3s',
        'spin-slow': '20s',
        'bounce-subtle': '1.5s',
      },
      timingFns: {
        'fade-in': 'ease-out',
        'slide-up': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'ease-in-out',
        'float': 'ease-in-out',
        'shimmer': 'linear',
        'border-flow': 'linear',
        'spin-slow': 'linear',
        'bounce-subtle': 'ease-in-out',
      },
      counts: {
        'glow-pulse': 'infinite',
        'float': 'infinite',
        'shimmer': 'infinite',
        'border-flow': 'infinite',
        'spin-slow': 'infinite',
        'bounce-subtle': 'infinite',
      }
    },

    boxShadow: {
      'glow-sm': '0 0 10px var(--tw-shadow-color)',
      'glow-md': '0 0 20px var(--tw-shadow-color)',
      'glow-lg': '0 0 40px var(--tw-shadow-color)',
      'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
      'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px var(--tw-shadow-color)',
    }
  },

  shortcuts: {
    // 布局
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'absolute-center': 'absolute inset-0 m-auto',
    'fixed-center': 'fixed inset-0 m-auto',

    // 卡片
    'card': 'bg-bg-card border border-border rounded-xl transition-all duration-300',
    'card-hover': 'hover:border-accent-primary hover:shadow-card-hover hover:-translate-y-1',
    'card-glow': 'shadow-[0_0_20px_rgba(99,102,241,0.3)]',

    // 按钮
    'btn': 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    'btn-primary': 'btn bg-accent-primary text-white hover:opacity-90 hover:shadow-glow-md active:scale-98',
    'btn-secondary': 'btn bg-bg-elevated border border-border text-text hover:border-accent-primary',
    'btn-ghost': 'btn bg-transparent hover:bg-bg-elevated',

    // 输入框
    'input-base': 'w-full px-4 py-2.5 bg-bg-secondary border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all duration-200',

    // 标签
    'tag': 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
    'tag-primary': 'tag bg-accent-primary/10 text-accent-primary border border-accent-primary/20',
    'tag-success': 'tag bg-success/10 text-success border border-success/20',
    'tag-warning': 'tag bg-warning/10 text-warning border border-warning/20',
    'tag-error': 'tag bg-error/10 text-error border border-error/20',

    // 动画
    'animate-in': 'animate-fade-in animate-slide-up',
    'animate-stagger': 'animation-delay-100 animation-delay-200 animation-delay-300 animation-delay-400 animation-delay-500',

    // 渐变文字
    'gradient-text': 'bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary bg-clip-text text-transparent',

    // 渐变边框
    'gradient-border': 'relative overflow-hidden before:absolute before:inset-0 before:p-px before:bg-gradient-to-r before:from-accent-primary before:via-accent-secondary before:to-accent-tertiary before:rounded-xl before:-z-10',

    // 装饰线
    'deco-line': 'h-px bg-gradient-to-r from-transparent via-border-light to-transparent',

    // 玻璃态
    'glass': 'backdrop-blur-xl bg-bg-secondary/80',

    // 滚动条
    'scrollbar-thin': 'scrollbar scrollbar-thumb-accent-primary/50 scrollbar-track-transparent scrollbar-thumb-rounded',

    // 状态点
    'status-dot': 'w-2 h-2 rounded-full animate-pulse',

    // 头像
    'avatar-ring': 'p-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary',
  },

  rules: [
    // 自定义滚动条
    ['scrollbar-thin', { 'scrollbar-width': 'thin' }],
    // 文字阴影
    ['text-glow', { 'text-shadow': '0 0 10px var(--tw-shadow-color)' }],
    // 去除边框
    ['border-none', { 'border': 'none' }],
    // 透明度
    ['opacity-10', { 'opacity': '0.1' }],
    ['opacity-20', { 'opacity': '0.2' }],
    ['opacity-30', { 'opacity': '0.3' }],
    ['opacity-50', { 'opacity': '0.5' }],
    // 变换
    ['scale-98', { 'transform': 'scale(0.98)' }],
    ['scale-102', { 'transform': 'scale(1.02)' }],
    // 过渡
    ['transition-all-200', { 'transition': 'all 200ms ease' }],
    ['transition-all-300', { 'transition': 'all 300ms ease' }],
    ['transition-all-500', { 'transition': 'all 500ms ease' }],
    // 动画延迟
    [/^animation-delay-(\d+)$/, ([, d]) => ({ 'animation-delay': `${Number(d) * 100}ms` })],
    // 渐变背景
    ['bg-gradient-accent', { 'background': 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)' }],
    ['bg-gradient-glow', { 'background': 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }],
    // 装饰菱形
    ['diamond', { 'transform': 'rotate(45deg)' }],
    // 层级
    ['z-1', { 'z-index': '1' }],
    ['z-10', { 'z-index': '10' }],
    ['z-20', { 'z-index': '20' }],
    // 文字截断
    ['line-clamp-1', { 'overflow': 'hidden', 'display': '-webkit-box', '-webkit-line-clamp': '1', '-webkit-box-orient': 'vertical' }],
    ['line-clamp-2', { 'overflow': 'hidden', 'display': '-webkit-box', '-webkit-line-clamp': '2', '-webkit-box-orient': 'vertical' }],
  ],

  preflights: [
    {
      getCSS: () => `
        /* 滚动条样式 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        /* 选中文字样式 */
        ::selection {
          background: rgba(99, 102, 241, 0.3);
          color: inherit;
        }

        /* 平滑滚动 */
        html {
          scroll-behavior: smooth;
        }
      `
    }
  ],

  safelist: [
    // 动态生成的类名
    'animation-delay-100',
    'animation-delay-200', 
    'animation-delay-300',
    'animation-delay-400',
    'animation-delay-500',
  ],
})
