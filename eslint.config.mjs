import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const forbid = (layer) => [`@/components/${layer}/*`, `**/components/${layer}/*`, `../${layer}/*`, `../../${layer}/*`]

const alwaysBanned = [
  { group: ['@/data/*', '**/data/*'], message: 'Components must not import local data.' },
  { group: ['@/lib/wp/*', '**/lib/wp/*'], message: 'Components must not import the WordPress layer.' },
  { group: ['@/lib/server/*', '**/lib/server/*'], message: 'Components must not import server code.' },
  {
    group: ['@/lib/services', '@/lib/services/*', '**/lib/services', '**/lib/services/*'],
    message: 'Components get data by props or hooks, not from services.',
  },
  { group: ['@/lib/repositories/*', '**/lib/repositories/*'], message: 'Components must not import repositories.' },
  { group: ['@/app/*', '**/app/*'], message: 'Components must not import from app.' },
]

// components/ui (shadcn primitives) sits at the atom level.
const layer = (files, ...upper) => ({
  files,
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          ...upper.map((name) => ({ group: forbid(name), message: `This layer must not import ${name}.` })),
          ...alwaysBanned,
        ],
      },
    ],
  },
})

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  layer(['components/atoms/**', 'components/ui/**'], 'molecules', 'organisms', 'templates'),
  layer(['components/molecules/**'], 'organisms', 'templates'),
  layer(['components/organisms/**'], 'templates'),
  layer(['components/templates/**']),
  {
    files: ['components/**/*.tsx'],
    rules: {
      'react/jsx-no-literals': ['error', { noStrings: true, ignoreProps: true, allowedStrings: [':', '·', '/', '%'] }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])
