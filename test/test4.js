// importing required dependencies
const alexaTest = require('alexa-skill-test-framework');

alexaTest.initialize(
    require('../lambda/index.js'),
    'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    'amzn1.ask.account.VOID');

describe('Carbon footprint', function() {
    describe('flight_intent', function() {
        this.timeout(10000);
        alexaTest.test([{
            request: alexaTest.getIntentRequest('flight_intent', {
                'passenger': 10,
                'origin': {
                    'resolutions': {
                        'resolutionsPerAuthority': [{
                            'status': {
                                'code': 'ER_SUCCESS_MATCH'
                            },
                            'values': [{
                                'value': {
                                    'name': 'BOM',
                                    'id': 'BOM'
                                }
                            }]
                        }]
                    },
                    'confirmationStatus': 'NONE',
                    'source': 'USER'
                },
                'destination': {
                    'resolutions': {
                        'resolutionsPerAuthority': [{
                                'status': {
                                    'code': 'ER_SUCCESS_MATCH'
                                },
                                'values': [{
                                    'value': {
                                        'name': 'PNQ',
                                        'id': 'PNQ'
                                    }
                                }]
                            }

                        ]
                    },
                    'confirmationStatus': 'NONE',
                    'source': 'USER'
                }
            }),
            says: 'Flight produces 105.03 kg of CO2 while travelling from BOM to PNQ with 10 passengers.',
            repromptsNothing: true,
            shouldEndSession: true,
            hasAttributes: {}
        }]);
    });
});