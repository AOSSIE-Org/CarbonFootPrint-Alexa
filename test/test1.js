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
                'passenger': 100,
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
                                        'name': 'TRR',
                                        'id': 'TRR'
                                    }
                                }]
                            }

                        ]
                    },
                    'confirmationStatus': 'NONE',
                    'source': 'USER'
                }
            }),
            says: 'Flight produces 8338.85 kg of CO2 while travelling from BOM to TRR with 100 passengers.',
            repromptsNothing: true,
            shouldEndSession: true,
            hasAttributes: {}
        }]);
    });
});