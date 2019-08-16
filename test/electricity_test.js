// importing required dependencies
const alexaTest = require('alexa-skill-test-framework');

alexaTest.initialize(
    require('../lambda/index.js'),
    'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    'amzn1.ask.account.VOID');

describe('Carbon footprint', function() {
    describe('electricity_intent', function() {
        this.timeout(20000);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('electricity_intent', {
                "country": {
                    "name": "country",
                    "value": "China",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "quantity": {
                    "name": "quantity",
                    "value": "100",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'Usage of 100 units of electricity produces 75.25 kg of CO2. Try another one?',
            reprompts: "Try another one?",
            shouldEndSession: false
        }]);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('electricity_intent', {
                "country": {
                    "name": "country",
                    "value": "India",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "quantity": {
                    "name": "quantity",
                    "value": "100",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'Usage of 100 units of electricity produces 141.76 kg of CO2. Try another one?',
            reprompts: "Try another one?",
            shouldEndSession: false
        }]);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('electricity_intent', {
                "country": {
                    "name": "country",
                    "value": "India",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "quantity": {
                    "name": "quantity",
                    "value": "10",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'Usage of 10 units of electricity produces 14.18 kg of CO2. Try another one?',
            reprompts: "Try another one?",
            shouldEndSession: false
        }]);

    });
});