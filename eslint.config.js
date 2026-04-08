import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import fs from 'node:fs'

const autoImportConfig = JSON.parse(
  fs.readFileSync(new URL('./.eslintrc-auto-import.json', import.meta.url), 'utf-8')
)

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportConfig.globals
      }
    },
    rules: {
      'vue/component-name-in-template-casing': [
        'error',
        'PascalCase',
        {
          registeredComponentsOnly: false
        }
      ],
      'vue/no-undef-properties': 'error',
      'vue/no-undef-components': [
        'error',
        {
          ignorePatterns: [
            'A[A-Z].*', // 忽略 Ant Design Vue 组件
            'RouterView',
            'RouterLink'
          ]
        }
      ],
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ],
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index']
        }
      ]
    }
  },

  prettierConfig
]
