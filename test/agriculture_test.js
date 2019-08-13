// importing required dependencies
const alexaTest = require('alexa-skill-test-framework');

alexaTest.initialize(
    require('../lambda/index.js'),
    'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    'amzn1.ask.account.VOID');

describe('Carbon footprint', function() {
    describe('agriculture_intent', function() {
        this.timeout(10000);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('agriculture_intent', {
                "crop_region": {
                    "name": "crop_region",
                    "value": "India",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "crop_type": {
                    "name": "crop_type",
                    "value": "savanna",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "Burning - Savanna",
                                    "id": "8f27b5cc5b3c4da5fbed01dc0eb4548d"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'Emissions due to Burning - Savanna in India is 238.44 gigagrams. Try another one?',
            reprompts: "Try another one?",
            shouldEndSession: false,
            hasAttributes: {
                "crop_type": "Burning - Savanna",
                "crop_region": "India"
            }
        }]);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('agriculture_intent', {
                "crop_region": {
                    "name": "crop_region",
                    "value": "India",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "crop_type": {
                    "name": "crop_type",
                    "value": "rice",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "rice cultivation",
                                    "id": "8f27b5cc5b3c4da5fbed01dc0eb4548d"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'Emissions due to rice cultivation in India is 95243.05 gigagrams. Try another one?',
            reprompts: "Try another one?",
            shouldEndSession: false,
            hasAttributes: {
                "crop_type": "rice cultivation",
                "crop_region": "India"
            }
        }]);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('agriculture_intent', {
                "crop_region": {
                    "name": "crop_region",
                    "value": "China",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "crop_type": {
                    "name": "crop_type",
                    "value": "rice",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "rice cultivation",
                                    "id": "8f27b5cc5b3c4da5fbed01dc0eb4548d"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'Emissions due to rice cultivation in China is 112339.57 gigagrams. Try another one?',
            reprompts: "Try another one?",
            shouldEndSession: false,
            hasAttributes: {
                "crop_type": "rice cultivation",
                "crop_region": "China"
            }
        }]);

    });
});