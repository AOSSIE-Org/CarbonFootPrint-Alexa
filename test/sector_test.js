// importing required dependencies
const alexaTest = require('alexa-skill-test-framework')

alexaTest.initialize(
  require('../lambda/index.js'),
  'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
  'amzn1.ask.account.VOID')

describe('Carbon footprint', function () {
  describe('sector_intent', function () {
    this.timeout(20000)

    alexaTest.test([{
      request: alexaTest.getIntentRequest('sector_intent', {
        region: {
          name: 'region',
          value: 'India',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        sector: {
          name: 'sector',
          value: 'industry',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'industry',
                  id: '05e7d19a6d002118deef70d21ff4226e'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: '135322.80 gigagrams of CO2 is produced due to industry in India. Try another one?'
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('sector_intent', {
        region: {
          name: 'region',
          value: 'China',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        sector: {
          name: 'sector',
          value: 'waste',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'waste',
                  id: '05e7d19a6d002118deef70d21ff4226e'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: '932.85 gigagrams of CO2 is produced due to waste in China. Try another one?'
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('sector_intent', {
        region: {
          name: 'region',
          value: 'Canada',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        sector: {
          name: 'sector',
          value: 'energy',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'energy',
                  id: '05e7d19a6d002118deef70d21ff4226e'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: '263100.00 gigagrams of CO2 is produced due to energy in Canada. Try another one?'
    }])
  })
})
