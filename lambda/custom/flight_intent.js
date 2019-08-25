'use strict'

// Import modules
const Alexa = require('ask-sdk')
const request = require('request')
const moment = require('moment')

// Skill details
const SKILL_NAME = 'Carbon Footprint'
const APP_ID = ''

// Setting API details
const BASE_URL = 'https://carbonhub.org/v1'
const API_KEY = process.env.API_KEY
const EMISSIONS_ENDPOINT = BASE_URL + '/emissions'

// Calling the API
const callEmissionsApi = function (options) {
  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      resolve(body)
    })
  })
}

// Handling Flight related utterences
const flight_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'LaunchRequest' ||
            (request.type === 'IntentRequest' &&
                request.intent.name === 'flight_intent') &&
            ((request.dialogState === 'COMPLETED') || (sessionAttributes))
  },
  async handle (handlerInput) {
    const newParams = {}
    let passengers
    let origin
    let destination
    const emissionType = 'CO2'

    // Assigning values to newParams and setting default values in case slot returns undefined
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes

    if (handlerInput.requestEnvelope.request.intent.slots.origin.value !== undefined && handlerInput.requestEnvelope.request.intent.slots.origin.value.value !== undefined) {
      if (handlerInput.requestEnvelope.request.intent.slots.origin.value.value) {
        origin = handlerInput.requestEnvelope.request.intent.slots.origin.value.resolutions.resolutionsPerAuthority[0].values[0].value.name
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.origin.value.value) && (sessionAttributes)) {
        origin = sessionAttributes.forigin
      }
    } else {
      if (handlerInput.requestEnvelope.request.intent.slots.origin.value) {
        origin = handlerInput.requestEnvelope.request.intent.slots.origin.resolutions.resolutionsPerAuthority[0].values[0].value.name
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.origin.value) && (sessionAttributes)) {
        origin = sessionAttributes.forigin
      }
    }
    console.log('origin ' + origin)

    if (handlerInput.requestEnvelope.request.intent.slots.destination.value !== undefined && handlerInput.requestEnvelope.request.intent.slots.destination.value.value !== undefined) {
      if (handlerInput.requestEnvelope.request.intent.slots.destination.value.value) {
        destination = handlerInput.requestEnvelope.request.intent.slots.destination.value.resolutions.resolutionsPerAuthority[0].values[0].value.name
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.destination.value.value) && (sessionAttributes)) {
        destination = sessionAttributes.fdestination
      }
    } else {
      if (handlerInput.requestEnvelope.request.intent.slots.destination.value) {
        destination = handlerInput.requestEnvelope.request.intent.slots.destination.resolutions.resolutionsPerAuthority[0].values[0].value.name
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.destination.value) && (sessionAttributes)) {
        destination = sessionAttributes.fdestination
      }
    }
    console.log('destination ' + destination)

    if (handlerInput.requestEnvelope.request.intent.slots.passengers.value !== undefined && handlerInput.requestEnvelope.request.intent.slots.passengers.value.value !== undefined) {
      if (handlerInput.requestEnvelope.request.intent.slots.passengers.value.value) {
        passengers = handlerInput.requestEnvelope.request.intent.slots.passengers.value.value
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.passengers.value.value) && (sessionAttributes)) {
        passengers = sessionAttributes.fpassengers
      }
    } else {
      if (handlerInput.requestEnvelope.request.intent.slots.passengers.value) {
        passengers = handlerInput.requestEnvelope.request.intent.slots.passengers.value
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.passengers.value) && (sessionAttributes)) {
        passengers = sessionAttributes.fpassengers
      }
    }
    console.log('passengers ' + passengers)

    const sessionAttribute = handlerInput.attributesManager.getSessionAttributes()
    sessionAttribute.forigin = origin
    sessionAttribute.fdestination = destination
    sessionAttribute.fpassengers = passengers
    handlerInput.attributesManager.setSessionAttributes(sessionAttribute)

    if (emissionType !== undefined && emissionType !== '') {
      newParams.emission_type = emissionType
    } else {
      newParams.emission_type = 'CO2'
    }

    newParams.origin = origin
    newParams.destination = destination
    newParams.passenger = passengers

    // Setting up options to send request to API
    const options = {
      method: 'POST',
      url: 'https://carbonhub.org/v1/flight',
      headers: {
        'cache-control': 'no-cache',
        'access-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        origin: newParams.origin,
        destination: newParams.destination,
        passengers: newParams.passenger
      },
      json: true
    }
    // Receiving response from API
    const response = await callEmissionsApi(options)
    let speechOutput = ''
    let correct_answer
    let num, unit
    num = response.emissions[newParams.emission_type]
    unit = response.unit
    correct_answer = 'Flight produces ' + num.toFixed(2) + ' ' + unit + ' of ' + newParams.emission_type + ' while travelling from ' + newParams.origin + ' to ' + newParams.destination + ' with ' + newParams.passenger + ' passengers. Try another one?'
    // JSON received from API
    console.log('response->', response)
    speechOutput = responseGen(response, newParams, correct_answer)
    const reprompt_text = 'Try another one?'

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse()
  }
}

// Generate skill's response from API's response
const responseGen = function (response, newParams, correct_answer) {
  let speechOutput = ''
  let num
  let unit
  console.log('response ' + response)
  console.log('correct_answer ' + correct_answer)

  // Generating result for successful response from API
  // if (response.success == true) {
  //     speechOutput = correct_answer;
  // }
  speechOutput = correct_answer
  // Handling unsuccessful response from API
  if (!response) {
    speechOutput = 'An unknown error occured. Please contact our support.\nError: ' + response.error
  } else if (response.success != true) {
    if (response.statusCode == 400) {
      // Handle API errors that come with their own error messages
      // This basically just wraps existing messages in a more readable format for the Alexa
      if (response.error.toLowerCase().startsWith('unable')) {
        if (response.error.toLowerCase().includes('IATA')) {
          // Format "Unable to find the airports. Please use IATA airport codes only"
          speechOutput = 'I couldn\'t find that airport. Please only give me IATA codes.'
        } else {
          // Format "Unable to find <emission type> for <item type> in <region>"
          speechOutput = 'I was ' + response.error + '. Please try again.'
        }
      } else if (response.error.toLowerCase().startsWith('please provide')) {
        // Format "Please provide valid sector and region values"
        speechOutput = 'Sorry, I\'m missing some info from you. ' + response.error + '.'
      } else if (response.error.toLowerCase().includes('cannot be less than zero')) {
        // Format "Distance cannot be less than zero"
        speechOutput = 'Sorry, I can\'t use a negative distance or mileage. Please try again.'
      } else {
        speechOutput = 'An unknown error occured. Please report this to the developers.\nError: ' + response.error
      }
    } else if (response.statusCode == 403 || response.statusCode == 406) {
      // Forbidden, not acceptable
      speechOutput = 'An unknown error occured. Please report this to the developers.\nError: ' + response.error
    } else if (response.statusCode == 404) {
      // Not found
      speechOutput = 'The data you requested isn\'t available. Please try again'
    } else if (response.statusCode == 429) {
      // Too many requests
      speechOutput = 'I\'m feeling a bit overwhelmed right now. Try asking me again later.'
    } else if (response.statusCode == 500) {
      // Internal server error
      speechOutput = 'There\'s a problem with our server. Please try again in a bit.'
    } else if (response.statusCode == 503) {
      // Service unavailable
      speechOutput = 'The server is currently offline for maintenance. Please try again later.'
    } else {
      speechOutput = 'An unknown error occured. Please contact our support.\nError: ' + response.error
    }
  }

  // Returning the final generated result
  return speechOutput
}

module.exports = flight_intent
