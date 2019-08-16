// importing required dependencies
const alexaTest = require('alexa-skill-test-framework');

alexaTest.initialize(
    require('../lambda/index.js'),
    'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    'amzn1.ask.account.VOID');

describe('Carbon footprint', function() {
    describe('land_intent', function() {
        this.timeout(20000);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('land_intent', {
                "land_type": {
                    "name": "land_type",
                    "value": "grassland",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.7abdb5e9-9f63-4e89-b893-ff35027d2e52.land_type",
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "grassland",
                                    "id": "1b2dd777e6b719c5184c2822852a8837"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "region": {
                    "name": "region",
                    "value": "India",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'CO2 emissions due to grassland in India is 25.65 gigagrams. Try another one?'
        }]);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('land_intent', {
                "land_type": {
                    "name": "land_type",
                    "value": "grassland",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.7abdb5e9-9f63-4e89-b893-ff35027d2e52.land_type",
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "grassland",
                                    "id": "1b2dd777e6b719c5184c2822852a8837"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "region": {
                    "name": "region",
                    "value": "China",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'CO2 emissions due to grassland in China is 163.93 gigagrams. Try another one?'
        }]);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('land_intent', {
                "land_type": {
                    "name": "land_type",
                    "value": "cropland",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.7abdb5e9-9f63-4e89-b893-ff35027d2e52.land_type",
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "cropland",
                                    "id": "1b2dd777e6b719c5184c2822852a8837"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "region": {
                    "name": "region",
                    "value": "China",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: 'CO2 emissions due to cropland in China is 1051.54 gigagrams. Try another one?'
        }]);
    });
});