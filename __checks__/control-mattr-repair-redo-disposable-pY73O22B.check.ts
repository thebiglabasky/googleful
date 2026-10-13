/**
* This is a Checkly CLI BrowserCheck construct. To learn more, visit:
* - https://www.checklyhq.com/docs/cli/
* - https://www.checklyhq.com/docs/cli/constructs-reference/#browsercheck
*/

import { BrowserCheck, Frequency } from 'checkly/constructs'

new BrowserCheck('control-mattr-repair-redo-disposable-pY73O22B', {
  name: 'CONTROL — MATTR REPAIR REDO — disposable',
  activated: false,
  muted: true,
  shouldFail: false,
  runParallel: false,
  aiAutoRepairEnabled: false,
  locations: ['us-east-1'],
  tags: [],
  frequency: Frequency.EVERY_24H,
  environmentVariables: [
    { key: 'ENVIRONMENT_URL', value: 'https://learn.mattr.global/', locked: false, secret: false },
  ],
  code: {
    entrypoint: './control-mattr-repair-redo-disposable-pY73O22B.spec.ts',
  },
})
