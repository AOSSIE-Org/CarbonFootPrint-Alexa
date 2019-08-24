'use strict'

// Import modules
const Alexa = require('ask-sdk')
const request = require('request')
const moment = require('moment')
const appliance_intent = require('./appliance_intent')
const fuel_intent = require('./fuel_intent')
const electricity_intent = require('./electricity_intent')
const flight_intent = require('./flight_intent')
const train_intent = require('./train_intent')
const poultry_intent = require('./poultry_intent')
const vehicle_intent = require('./vehicle_intent')
const sector_intent = require('./sector_intent')
const food_intent = require('./food_intent')
const land_intent = require('./land_intent')
const agriculture_intent = require('./agriculture_intent')

// Skill details
const SKILL_NAME = 'Carbon footprint'
const APP_ID = ''

// Setting API details
const BASE_URL = 'https://carbonhub.org/v1'
const API_KEY = process.env.API_KEY
const EMISSIONS_ENDPOINT = BASE_URL + '/emissions'

// in progress intents for slot filling support
// food intent
const InProgressfood_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'food_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.food_type) && (!sessionAttributes.food_region)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// appliance intent
const InProgressappliance_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'applianceIntent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.atime) && (!sessionAttributes.aquantity) && (!sessionAttributes.appliance) && (!sessionAttributes.aregion)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// fuel intent
const InProgressfuel_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'fuel_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.ffuel_type) && (!sessionAttributes.fquantity)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// electricity intent
const InProgresselectricity_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'electricity_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.ecountry) && (!sessionAttributes.equantity)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// flight intent
const InProgressflight_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'flight_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.forigin) && (!sessionAttributes.fdestination) && (!sessionAttributes.fpassenger)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// train intent
const InProgresstrain_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'train_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.torigin) && (!sessionAttributes.tdestination) && (!sessionAttributes.tpassengers)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// poultry intent
const InProgresspoultry_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'poultry_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.poultry_list) && (!sessionAttributes.poultry_region) && (!sessionAttributes.poultry_quantity)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// vehicle intent
const InProgressvehicle_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'vehicle_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.vorigin) && (!sessionAttributes.vdestination) && (!sessionAttributes.fuel_type) && (!sessionAttributes.vmileage)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// agriculture intent
const InProgressagriculture_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'agriculture_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.crop_type) && (!sessionAttributes.crop_region)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// sector intent
const InProgresssector_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'sector_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.sector) && (!sessionAttributes.sector_region)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// land intent
const InProgressland_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
      request.intent.name === 'land_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.land_type) && (!sessionAttributes.land_region)))
  },
  handle (handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse()
  }
}

// Help Intent
const HelpHandler = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent'
  },
  handle (handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse()
  }
}

// Exit Intent
const ExitHandler = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent')
  },
  handle (handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse()
  }
}

// End Session Intent
const SessionEndedRequestHandler = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'SessionEndedRequest'
  },
  handle (handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`)

    return handlerInput.responseBuilder.getResponse()
  }
}

// Error Handler
const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse()
  }
}

const HELP_MESSAGE = 'You can say, Alexa, ask carbon footprint carbon emissions for 100 units of electricity consumed in india, or, you can say exit...'
const HELP_REPROMPT = 'What can I help you with?'
const STOP_MESSAGE = 'Goodbye!'

const skillBuilder = Alexa.SkillBuilders.standard()

exports.handler = skillBuilder
  .addRequestHandlers(
    appliance_intent,
    InProgressappliance_intent,
    electricity_intent,
    InProgresselectricity_intent,
    fuel_intent,
    InProgressfuel_intent,
    flight_intent,
    InProgressflight_intent,
    train_intent,
    InProgresstrain_intent,
    poultry_intent,
    InProgresspoultry_intent,
    sector_intent,
    InProgresssector_intent,
    vehicle_intent,
    InProgressvehicle_intent,
    land_intent,
    InProgressland_intent,
    food_intent,
    InProgressfood_intent,
    agriculture_intent,
    InProgressagriculture_intent,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda()
