import { defineConfig } from 'checkly'

const config = defineConfig({
  projectName: 'googleful',
  logicalId: 'googleful',
  checks: {
    checkMatch: '__checks__/**/*.check.ts',
  },
})

export default config
