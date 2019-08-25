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
// Handling Food related utterences
const food_intent = {
  canHandle (handlerInput) {
    const request = handlerInput.requestEnvelope.request
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    return request.type === 'IntentRequest' &&
            request.intent.name === 'food_intent' &&
            ((request.dialogState === 'COMPLETED') || (sessionAttributes))
  },
  async handle (handlerInput) {
    const newParams = {}
    let food_region, food_type

    const sessionAttributes = handlerInput.requestEnvelope.session.attributes
    // Getting values of slots and also handling in case of error

    if (handlerInput.requestEnvelope.request.intent.slots.food_type.value !== undefined && handlerInput.requestEnvelope.request.intent.slots.food_type.value.value !== undefined) {
      if (handlerInput.requestEnvelope.request.intent.slots.food_type.value.value) {
        food_type = handlerInput.requestEnvelope.request.intent.slots.food_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.food_type.value) && (sessionAttributes)) {
        food_type = sessionAttributes.food_type
      }
    } else {
      if (handlerInput.requestEnvelope.request.intent.slots.food_type.value) {
        food_type = handlerInput.requestEnvelope.request.intent.slots.food_type.resolutions.resolutionsPerAuthority[0].values[0].value.name
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.food_type.value) && (sessionAttributes)) {
        food_type = sessionAttributes.food_type
      }
    }
    console.log('food type ' + food_type)

    if (handlerInput.requestEnvelope.request.intent.slots.food_region.value !== undefined && handlerInput.requestEnvelope.request.intent.slots.food_region.value.value !== undefined) {
      if (handlerInput.requestEnvelope.request.intent.slots.food_region.value.value) {
        food_region = handlerInput.requestEnvelope.request.intent.slots.food_region.value.value
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.food_region.value.value) && (sessionAttributes)) {
        food_region = sessionAttributes.food_region
      }
    } else {
      if (handlerInput.requestEnvelope.request.intent.slots.food_region.value) {
        food_region = handlerInput.requestEnvelope.request.intent.slots.food_region.value
      } else if ((!handlerInput.requestEnvelope.request.intent.slots.food_region.value) && (sessionAttributes)) {
        food_region = sessionAttributes.food_region
      }
    }
    console.log('food region ' + food_region)

    newParams.region = food_region
    newParams.item = food_type

    const sessionAttribute = handlerInput.attributesManager.getSessionAttributes()
    sessionAttribute.food_type = food_type
    sessionAttribute.food_region = food_region
    handlerInput.attributesManager.setSessionAttributes(sessionAttribute)

    // Setting up options to send request to API
    const options = {
      method: 'POST',
      url: 'https://carbonhub.org/v1/food',
      headers: {
        'cache-control': 'no-cache',
        'access-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        item: newParams.item,
        region: newParams.region
      },
      json: true
    }
    console.log('request ' + options)

    // Receiving response from API
    const response = await callEmissionsApi(options)
    let speechOutput = ''
    const emission_type = 'CO2'
    // Setting up correct answer
    let correct_answer
    let num, unit
    num = response.quantity
    unit = response.unit
    correct_answer = 'Emissions for ' + newParams.item + ' in ' + newParams.region + ' is ' + num.toFixed(2) + ' ' + unit + '. Try another one?'
    const reprompt_text = 'Try another one?'
    console.log('response ' + response)
    console.log('correct_answer ' + correct_answer)
    speechOutput = responseGen(response, newParams, correct_answer)
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

module.exports = food_intent
