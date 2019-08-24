// importing required dependencies
const alexaTest = require('alexa-skill-test-framework')

alexaTest.initialize(
  require('../lambda/index.js'),
  'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
  'amzn1.ask.account.VOID')

describe('Carbon footprint', function () {
  describe('fuel_intent', function () {
    this.timeout(20000)

    alexaTest.test([{
      request: alexaTest.getIntentRequest('fuel_intent', {
        quantity: {
          name: 'quantity',
          value: '10',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        fuel: {
          name: 'fuel',
          value: 'diesel',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'fuelDiesel',
                  id: 'be1323f67b2d23f4474a1e2d170e5b6a'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: '26.14 kg of CO2 is produced when 10 units of fuelDiesel is used. Try another one?',
      reprompts: 'Try another one?',
      shouldEndSession: false
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('fuel_intent', {
        quantity: {
          name: 'quantity',
          value: '1',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        fuel: {
          name: 'fuel',
          value: 'petrol',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'fuelPetrol',
                  id: '4d88df02b17aa2e54e3b58c2f84622d0'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: '2.33 kg of CO2 is produced when 1 units of fuelPetrol is used. Try another one?',
      reprompts: 'Try another one?',
      shouldEndSession: false
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('fuel_intent', {
        quantity: {
          name: 'quantity',
          value: '10',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        fuel: {
          name: 'fuel',
          value: 'petrol',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'fuelPetrol',
                  id: '4d88df02b17aa2e54e3b58c2f84622d0'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: '23.28 kg of CO2 is produced when 10 units of fuelPetrol is used. Try another one?',
      reprompts: 'Try another one?',
      shouldEndSession: false
    }])
  })
})
