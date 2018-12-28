"use strict";
var Alexa = require("alexa-sdk");
var SKILL_NAME = "Carbon Footprint";
var APP_ID = "";


exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
}

var handlers = {
    'LaunchRequest': function () {
        this.emit('appliance');
    },

    'applianceIntent': function () {
        this.emit('appliance');
    },
    'appliance': function () {
        let newParams = {};

        if (this.event.request.intent.slots.appliance_spec.value && this.event.request.intent.slots.appliance_spec.value !== "")
            newParams.type = this.event.request.intent.slots.appliance_spec.value;

        if (this.event.request.intent.slots.appliances.value && this.event.request.intent.slots.appliances.value !== "")
            newParams.appliance = this.event.request.intent.slots.appliances.value;

        if (this.event.request.intent.slots.country.value && this.event.request.intent.slots.country.value !== "")
            newParams.geo_country = this.event.request.intent.slots.country.value;

        if (this.event.request.intent.slots.emission_type.value && this.event.request.intent.slots.emission_type.value !== "")
            newParams.emission_type = this.event.request.intent.slots.emission_type.value;

        if (this.event.request.intent.slots.time.value && this.event.request.intent.slots.time.value !== "")
            newParams.duration = this.event.request.intent.slots.time.value;

        if (this.event.request.intent.slots.size.value && this.event.request.intent.slots.size.value !== "")
            newParams.size = this.event.request.intent.slots.size.value;

        if (this.event.request.intent.slots.quantity.value && this.event.request.intent.slots.quantity.value !== "")
            newParams.quantity = this.event.request.intent.slots.quantity.value;

        this.emit(':tell', newParams.type + newParams.appliance + newParams.geo_country + newParams.emission_type + newParams.duration + newParams.size + newParams.quantity);

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "";
        var reprompt = "";
        this.emit(":ask", speechOutput, reprompt);

    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "GoodBye!");

    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "GoodBye!");

    }

}