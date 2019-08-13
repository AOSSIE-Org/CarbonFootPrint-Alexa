// importing required dependencies
const alexaTest = require('alexa-skill-test-framework');

alexaTest.initialize(
    require('../lambda/index.js'),
    'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    'amzn1.ask.account.VOID');

describe('Carbon footprint', function() {
    describe('train_intent', function() {
            this.timeout(10000);

            alexaTest.test([{
                    request: alexaTest.getIntentRequest('train_intent', {
                            "emission_type": {
                                "name": "emission_type",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "passengers": {
                                "name": "passengers",
                                "value": "100",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "torigin": {
                                "name": "torigin",
                                "value": "Delhi",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "tdestination": {
                                "name": "tdestination",
                                "value": "Amritsar",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            }
                        }
                    ),
                says: 'Train produces 1874.50 kg of CO2 while travelling from Delhi to Amritsar with 100 passengers. Try another one?'
            }]);

            alexaTest.test([{
                    request: alexaTest.getIntentRequest('train_intent', {
                            "emission_type": {
                                "name": "emission_type",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "passengers": {
                                "name": "passengers",
                                "value": "2",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "torigin": {
                                "name": "torigin",
                                "value": "Delhi",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "tdestination": {
                                "name": "tdestination",
                                "value": "Amritsar",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            }
                        }
                    ),
                says: 'Train produces 37.49 kg of CO2 while travelling from Delhi to Amritsar with 2 passengers. Try another one?'
            }]);

            alexaTest.test([{
                    request: alexaTest.getIntentRequest('train_intent', {
                            "emission_type": {
                                "name": "emission_type",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "passengers": {
                                "name": "passengers",
                                "value": "1",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "torigin": {
                                "name": "torigin",
                                "value": "Delhi",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            },
                            "tdestination": {
                                "name": "tdestination",
                                "value": "Amritsar",
                                "confirmationStatus": "NONE",
                                "source": "USER"
                            }
                        }
                    ),
                says: 'Train produces 18.74 kg of CO2 while travelling from Delhi to Amritsar with 1 passengers. Try another one?'
            }]);

    });
});