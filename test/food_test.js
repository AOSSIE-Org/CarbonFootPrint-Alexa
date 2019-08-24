// importing required dependencies
const alexaTest = require('alexa-skill-test-framework')

alexaTest.initialize(
  require('../lambda/index.js'),
  'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
  'amzn1.ask.account.VOID')

describe('Carbon footprint', function () {
  describe('food_intent', function () {
    this.timeout(20000)

    alexaTest.test([{
      request: alexaTest.getIntentRequest('food_intent', {
        food_type: {
          name: 'food_type',
          value: 'mutton',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'meat, goat',
                  id: '7dc5b139bbcdfda94a17b05f162bf029'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        food_region: {
          name: 'food_region',
          value: 'India',
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: 'Emissions for meat, goat in India is 22478.86 gigagrams. Try another one?'
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('food_intent', {
        food_type: {
          name: 'food_type',
          value: 'egg',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'eggs, hen, in shell',
                  id: '7dc5b139bbcdfda94a17b05f162bf029'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        food_region: {
          name: 'food_region',
          value: 'India',
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: 'Emissions for eggs, hen, in shell in India is 2427.21 gigagrams. Try another one?'
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('food_intent', {
        food_type: {
          name: 'food_type',
          value: 'chicken',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'meat, chicken',
                  id: '7dc5b139bbcdfda94a17b05f162bf029'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        food_region: {
          name: 'food_region',
          value: 'China',
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: 'Emissions for meat, chicken in China is 8473.81 gigagrams. Try another one?'
    }])
  })
})
