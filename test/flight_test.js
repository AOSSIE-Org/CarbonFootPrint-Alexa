// importing required dependencies
const alexaTest = require('alexa-skill-test-framework');

alexaTest.initialize(
    require('../lambda/index.js'),
    'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    'amzn1.ask.account.VOID');

describe('Carbon footprint', function() {
    describe('flight_intent', function() {
        this.timeout(20000);
        alexaTest.test([{
            request: alexaTest.getIntentRequest('flight_intent', {
                'passengers': 100,
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
            says: 'Flight produces 8338.85 kg of CO2 while travelling from BOM to TRR with 100 passengers. Try another one?'
        }]);
        alexaTest.test([{
            request: alexaTest.getIntentRequest('flight_intent', {
                'passengers': 10,
                'origin': {
                    'resolutions': {
                        'resolutionsPerAuthority': [{
                            'status': {
                                'code': 'ER_SUCCESS_MATCH'
                            },
                            'values': [{
                                'value': {
                                    'name': 'DEL',
                                    'id': 'DEL'
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
                                        'name': 'ATQ',
                                        'id': 'ATQ'
                                    }
                                }]
                            }

                        ]
                    },
                    'confirmationStatus': 'NONE',
                    'source': 'USER'
                }
            }),
            says: 'Flight produces 344.42 kg of CO2 while travelling from DEL to ATQ with 10 passengers. Try another one?'
        }]);
        alexaTest.test([{
            request: alexaTest.getIntentRequest('flight_intent', {
                'passengers': 10,
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
            says: 'Flight produces 105.03 kg of CO2 while travelling from BOM to PNQ with 10 passengers. Try another one?'
        }]);
    });
});