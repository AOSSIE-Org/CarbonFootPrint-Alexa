// importing required dependencies
const alexaTest = require('alexa-skill-test-framework')

alexaTest.initialize(
  require('../lambda/index.js'),
  'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
  'amzn1.ask.account.VOID')

describe('Carbon footprint', function () {
  describe('poultry_intent', function () {
    this.timeout(20000)

    alexaTest.test([{
      request: alexaTest.getIntentRequest('poultry_intent', {
        poultry_quantity: {
          name: 'poultry_quantity',
          value: '1',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        poultry_region: {
          name: 'poultry_region',
          value: 'Idaho',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'idaho',
                  id: '0b0f5d2969f2ed3e2bb6ad8f53c866b9'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        poultry_list: {
          name: 'poultry_list',
          value: 'egg',
          resolutions: {
            resolutionsPerAuthority: [{
              authority: 'amzn1.er-authority.echo-sdk.amzn1.ask.skill.7abdb5e9-9f63-4e89-b893-ff35027d2e52.poultry_list',
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'egg',
                  id: '0e9312087f58f367d001ec9bae8f325a'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: 'CO2 emission for production of 1 egg is 4.82 kg in idaho. Try another one?'
    }])

    alexaTest.test([{
      request: alexaTest.getIntentRequest('poultry_intent', {
        poultry_quantity: {
          name: 'poultry_quantity',
          value: '1',
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        poultry_region: {
          name: 'poultry_region',
          value: 'Idaho',
          resolutions: {
            resolutionsPerAuthority: [{
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'ohio',
                  id: '6524fcc18d678fc6dedae2faa92a6581'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        },
        poultry_list: {
          name: 'poultry_list',
          value: 'broiler chicken',
          resolutions: {
            resolutionsPerAuthority: [{
              authority: 'amzn1.er-authority.echo-sdk.amzn1.ask.skill.7abdb5e9-9f63-4e89-b893-ff35027d2e52.poultry_list',
              status: {
                code: 'ER_SUCCESS_MATCH'
              },
              values: [{
                value: {
                  name: 'broiler chicken',
                  id: '3f953858b59a0089548b58f473a7e2c6'
                }
              }]
            }]
          },
          confirmationStatus: 'NONE',
          source: 'USER'
        }
      }),
      says: 'CO2 emission for production of 1kg broiler chicken is 6.88 kg in ohio. Try another one?'
    }])
  })
})
