/**
* This is a Checkly CLI ApiCheck construct. To learn more, visit:
* - https://www.checklyhq.com/docs/cli/
* - https://www.checklyhq.com/docs/cli/constructs-reference/#apicheck
*/

import { ApiCheck, Frequency, RetryStrategyBuilder } from 'checkly/constructs'

new ApiCheck('api-check-1-v3mIKkvG', {
  name: 'API Check #1',
  activated: true,
  muted: false,
  shouldFail: false,
  runParallel: true,
  locations: ['eu-central-1', 'eu-west-2'],
  tags: [],
  frequency: Frequency.EVERY_10M,
  environmentVariables: [],
  // group: your check belongs to group 'Group #1',
  maxResponseTime: 20000,
  degradedResponseTime: 5000,
  request: {
    url: 'https://api.checklyhq.com/',
    method: 'GET',
    followRedirects: true,
    skipSSL: false,
    assertions: [],
    body: ``,
    bodyType: 'NONE',
    headers: [],
    queryParameters: [],
    basicAuth: {
      username: '',
      password: '',
    },
  },
  retryStrategy: RetryStrategyBuilder.linearStrategy({
    baseBackoffSeconds: 60,
    maxRetries: 2,
    maxDurationSeconds: 600,
    sameRegion: true,
  }),
})
