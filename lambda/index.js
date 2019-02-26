"use strict";
let Alexa = require("alexa-sdk");
let request = require("request");
let moment = require('moment');

const SKILL_NAME = "Carbon Footprint";
const APP_ID = "{{your app id}}";

const BASE_URL = "https://carbonhub.org/v1";
const API_KEY = "{{your api key}}";
const EMISSIONS_ENDPOINT = BASE_URL + "/emissions";

exports.handler = function (event, context, callback) {
    let alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
}

let callEmissionsApi = function (options) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            resolve(body)
        })
    })
}

let handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Hello');
    },

    'applianceIntent': function () {
        this.emit('appliance');
    },
    'appliance': async function () {
        let newParams = {};
        let applianceType;
        let appliances;
        let country;
        let emissionType;
        let hours;
        let size;
        let quantity;

        try {
            applianceType = this.event.request.intent.slots.appliance_spec.value;
        } catch (error) {
        }

        try {
            appliances = this.event.request.intent.slots.appliances.value;
        } catch (error) {
        }

        try {
            country = this.event.request.intent.slots.country.value;
        } catch (error) {
        }

        try {
            emissionType = this.event.request.intent.slots.emission_type.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        } catch (error) {
        }

        try {
            hours = this.event.request.intent.slots.time.value;
        } catch (error) {
        }

        try {
            size = this.event.request.intent.slots.size.value;
        } catch (error) {
        }

        try {
            quantity = this.event.request.intent.slots.quantity.value;
        } catch (error) {
        }

        newParams.quantity = 1;
        newParams.region = "Default";
        newParams.duration = 1;

        if (quantity != undefined && quantity !== "") {
            newParams.quantity = quantity;
        }

        if (country != undefined && country !== "") {
            newParams.region = country;
        }

        if (emissionType != undefined && emissionType !== "") {
            newParams.emission_type = emissionType;
        }

        if (appliances != undefined && appliances !== "") {
            newParams.item = appliances;
        }

        if (applianceType != undefined && applianceType !== "") {
            newParams.item = newParams.item + " " + applianceType;
        }

        if (size != undefined && size !== "") {
            newParams.item = newParams.item + " " + size;
        }

        if (hours != undefined && hours !== "") {
            hours = moment.duration(hours, moment.ISO_8601).asHours();
            newParams.duration = hours;
        }

        let options = {
            method: 'POST',
            url: EMISSIONS_ENDPOINT,
            headers: {
                'cache-control': 'no-cache',
                'access-key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: {
                item: newParams.item,
                region: newParams.region,
                quantity: newParams.quantity,
                multiply: newParams.duration
            },
            json: true
        };

        console.log("request ->", newParams, options);

        let response = await callEmissionsApi(options);
        let speechOutput = "";
        let num;
        let unit;

        console.log("response->", response);

        if (response.success == true) {
            num = response.emissions[newParams.emission_type];
            unit = response.unit;
        } else {
            speechOutput = response.error;
        }

        if (num && unit) {
            speechOutput = newParams.item + " produces " + num.toFixed(2) + " " + unit + " of " + newParams.emission_type;
        }

        this.emit(':tell', speechOutput);

    },
    'AMAZON.HelpIntent': function () {
        let speechOutput = "";
        let reprompt = "";
        this.emit(":ask", speechOutput, reprompt);

    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "GoodBye!");

    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "GoodBye!");

    }

}