// importing required dependencies
const alexaTest = require('alexa-skill-test-framework')

alexaTest.initialize(
  require('../lambda/custom/index.js'),
  'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
  'amzn1.ask.account.VOID')

describe('Carbon footprint', function () {
  describe('applianceIntent', function () {
    this.timeout(20000)

    alexaTest.test([{
      request: alexaTest.getIntentRequest('applianceIntent', {
        country: {
          name: 'country',
          value: 'India',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        quantity: {
          name: 'quantity',
          value: '10',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        size: {
          name: 'size',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        appliances: {
          name: 'appliances',
          value: 'iron',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'Iron',
                  id: 'cefa8a9606819ed409dc761ca6080887'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        time: {
          name: 'time',
          value: 'PT10H',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        appliance_spec: {
          name: 'appliance_spec',
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: 'Usage of iron produces 85.06 kg of CO2. Try another one?',
      shouldEndSession: false
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('applianceIntent', {
        country: {
          name: 'country',
          value: 'India',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        quantity: {
          name: 'quantity',
          value: '100',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        size: {
          name: 'size',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        appliances: {
          name: 'appliances',
          value: 'iron',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'Iron',
                  id: 'cefa8a9606819ed409dc761ca6080887'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        time: {
          name: 'time',
          value: 'PT10H',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        appliance_spec: {
          name: 'appliance_spec',
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: 'Usage of iron produces 850.58 kg of CO2. Try another one?',
      shouldEndSession: false
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('applianceIntent', {
        country: {
          name: 'country',
          value: 'India',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        quantity: {
          name: 'quantity',
          value: '100',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        size: {
          name: 'size',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        appliances: {
          name: 'appliances',
          value: 'iron',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'Iron',
                  id: 'cefa8a9606819ed409dc761ca6080887'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        time: {
          name: 'time',
          value: 'PT20H',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        appliance_spec: {
          name: 'appliance_spec',
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: 'Usage of iron produces 1701.16 kg of CO2. Try another one?',
      shouldEndSession: false
    }])
  })
})
