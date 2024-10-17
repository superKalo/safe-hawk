import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'

export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']
    },
    {
        languageOptions: {
            globals: globals.browser
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        settings: {
            react: {
                version: 'detect'
            }
        }
    },
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            quotes: ['error', 'single'],
            'no-trailing-spaces': 'error',
            'no-unreachable': 'error',
            'no-console': [
                'error',
                {
                    allow: ['warn', 'error']
                }
            ],
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1
                }
            ],
        }
    }
]
