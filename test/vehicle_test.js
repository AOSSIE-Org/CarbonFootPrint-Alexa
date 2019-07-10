// importing required dependencies
const alexaTest = require('alexa-skill-test-framework');

alexaTest.initialize(
    require('../lambda/index.js'),
    'amzn1.ask.skill.00000000-0000-0000-0000-000000000000',
    'amzn1.ask.account.VOID');

describe('Carbon footprint', function() {
    describe('vehicle_intent', function() {
        this.timeout(10000);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('vehicle_intent', {
                "vdestination": {
                    "name": "vdestination",
                    "value": "Mumbai",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "emission_type": {
                    "name": "emission_type",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "fuel_type": {
                    "name": "fuel_type",
                    "value": "petrol",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "fuelPetrol",
                                    "id": "4d88df02b17aa2e54e3b58c2f84622d0"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "vorigin": {
                    "name": "vorigin",
                    "value": "Delhi",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "mileage": {
                    "name": "mileage",
                    "value": "30",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: '111.54 kg of CO2 is produced in a journey from Delhi to Mumbai on a vehicle with mileage of 30 kmpl.',
            repromptsNothing: true,
            shouldEndSession: true,
            hasAttributes: {}
        }]);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('vehicle_intent', {
                "vdestination": {
                    "name": "vdestination",
                    "value": "Mumbai",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "emission_type": {
                    "name": "emission_type",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "fuel_type": {
                    "name": "fuel_type",
                    "value": "petrol",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "fuelPetrol",
                                    "id": "4d88df02b17aa2e54e3b58c2f84622d0"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "vorigin": {
                    "name": "vorigin",
                    "value": "Delhi",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "mileage": {
                    "name": "mileage",
                    "value": "10",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: '334.62 kg of CO2 is produced in a journey from Delhi to Mumbai on a vehicle with mileage of 10 kmpl.',
            repromptsNothing: true,
            shouldEndSession: true,
            hasAttributes: {}
        }]);

        alexaTest.test([{
            request: alexaTest.getIntentRequest('vehicle_intent', {
                "vdestination": {
                    "name": "vdestination",
                    "value": "Goa",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "emission_type": {
                    "name": "emission_type",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "fuel_type": {
                    "name": "fuel_type",
                    "value": "petrol",
                    "resolutions": {
                        "resolutionsPerAuthority": [{
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [{
                                "value": {
                                    "name": "fuelPetrol",
                                    "id": "4d88df02b17aa2e54e3b58c2f84622d0"
                                }
                            }]
                        }]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "vorigin": {
                    "name": "vorigin",
                    "value": "Mumbai",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                },
                "mileage": {
                    "name": "mileage",
                    "value": "20",
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }),
            says: '71.98 kg of CO2 is produced in a journey from Mumbai to Goa on a vehicle with mileage of 20 kmpl.',
            repromptsNothing: true,
            shouldEndSession: true,
            hasAttributes: {}
        }]);

    });
});