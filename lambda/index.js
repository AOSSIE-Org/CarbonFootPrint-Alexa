"use strict";

// Import modules
const Alexa = require('ask-sdk');
let request = require("request");
let moment = require('moment');

// Skill details
const SKILL_NAME = "Carbon footprint";
const APP_ID = "";

// Setting API details
const BASE_URL = "https://carbonhub.org/v1";
const API_KEY = process.env.API_KEY;
const EMISSIONS_ENDPOINT = BASE_URL + "/emissions";

// Calling the API
let callEmissionsApi = function (options) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            resolve(body)
        })
    })
}

// Handling Appliance related utterences 
const applianceIntent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'applianceIntent');
  },
  async handle(handlerInput) {

    let newParams = {};
    let applianceType;
    let appliances;
    let country;
    let emissionType;
    let hours;
    let size;
    let quantity;

// Getting values of slots and also handling in case of errors
    applianceType = handlerInput.requestEnvelope.request.intent.slots.appliance_spec.value;
    appliances = handlerInput.requestEnvelope.request.intent.slots.appliances.value;
    try {
        country = handlerInput.requestEnvelope.request.intent.slots.country.value;
    } catch (error) {
      country = 'Default';
    }

    try {
      emissionType = handlerInput.requestEnvelope.request.intent.slots.emission_type.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch (error) {
      emissionType = 'CO2';
    }

    try {
      hours = handlerInput.requestEnvelope.request.intent.slots.time.value;
    } catch (error) {
      hours = 1;
    }

    try {
      size = handlerInput.requestEnvelope.request.intent.slots.size.value;
    } catch (error) {
      size = "";
    }

    try {
      quantity = handlerInput.requestEnvelope.request.intent.slots.quantity.value;
    } catch (error) {
      quantity = 1;
    }

// Assigning values to newParams and setting default values in case slot returns undefined
    if (quantity != undefined && quantity !== "") {
      newParams.quantity = quantity;
    } else {
      newParams.quantity = 1;
    }
    if(country != undefined && country !== "") {
      newParams.region = country;
    } else {
      country = 'Default';
    }
    if (emissionType != undefined && emissionType !== "") {
      newParams.emission_type = emissionType;
    } else {
      newParams.emission_type = 'CO2';
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
    hours = moment.duration(hours, moment.ISO_8601).asHours();
    newParams.duration = hours;

// Setting up options to send request to API 
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

// JSON sent to API
    console.log("request ->", newParams, options);

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";

// JSON received from API    
    console.log("response->", response);
    speechOutput = responseGen(response,newParams);
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
};

// Handling electricity related utterences
const electricity_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'electricity_intent');
  },
  async handle(handlerInput) {
    let newParams = {};
    let country;
    let emissionType;
    let quantity;

// Getting values of slots and also handling in case of errors
    try {
        country = handlerInput.requestEnvelope.request.intent.slots.country.value;
    } catch (error) {
        country = 'Default';
    }

    try {
      emissionType = handlerInput.requestEnvelope.request.intent.slots.emission_type.value.name;
    } catch (error) {
      emissionType = 'CO2';
    }

    try {
      quantity = handlerInput.requestEnvelope.request.intent.slots.quantity.value;
    } catch (error) {
      quantity = 1;
    }

// Assigning values to newParams and setting default values in case slot returns undefined
    if (quantity != undefined && quantity !== "") {
      newParams.quantity = quantity;
    } else {
      newParams.quantity = 1;
    }
    if(country != undefined && country !== "") {
      newParams.region = country;
    } else {
      country = 'Default';
    }
    if (emissionType != undefined && emissionType !== "") {
      newParams.emission_type = emissionType;
    } else {
      newParams.emission_type = 'CO2';
    }

// Setting up options to send request to API
    let options = {
      method: 'POST',
      url: EMISSIONS_ENDPOINT,
      headers: {
        'cache-control': 'no-cache',
        'access-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        item: 'electricity',
        region: newParams.region,
        quantity: newParams.quantity,
        unit: 'KWh'
      },
      json: true
    };

// JSON sent to API
    console.log("request->", options);

// Request to API
    let response = await callEmissionsApi(options);
    let speechOutput = "";
    speechOutput = responseGen(response, newParams);

// JSON received from API
    console.log("response->", response);

     return handlerInput.responseBuilder
       .speak(speechOutput)
       .getResponse();   
  }
};

// Handling Fuel related utterences 
const fuel_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'fuel_intent');
  },
  async handle(handlerInput) {

    let newParams = {};
    let fuel;
    let emissionType;
    let quantity;
    let unit;

// Getting values of slots and also handling in case of errors
    fuel = handlerInput.requestEnvelope.request.intent.slots.fuel.value;
    unit = 'Litre(s)';

    if (fuel = 'fuelCNG') {
      unit = 'kg';
    }

    try {
      emissionType = handlerInput.requestEnvelope.request.intent.slots.emission_type.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch (error) {
      emissionType = 'CO2';
    }

    try {
      quantity = handlerInput.requestEnvelope.request.intent.slots.quantity.value;
    } catch (error) {
      quantity = 1;
    }

// Assigning values to newParams and setting default values in case slot returns undefined
    newParams.item = fuel;

      if (unit != undefined && unit !== "") {
        newParams.unit = unit;
      } else {
        newParams.unit = 'Litre()';
      }

      if (quantity != undefined && quantity !== "") {
        newParams.quantity = quantity;
      } else {
        newParams.quantity = 1;
      }

      if (emissionType != undefined && emissionType !== "") {
        newParams.emission_type = emissionType;
      } else {
        newParams.emission_type = 'CO2';
      }

// Setting up options to send request to API 
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
        quantity: newParams.quantity,
        unit: newParams.unit
      },
      json: true
    };

// JSON sent to API
    console.log("request ->", newParams, options);

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";

// JSON received from API    
    console.log("response->", response);
    speechOutput = responseGen(response,newParams);
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
};

// Handling Flight related utterences 
const flight_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'flight_intent');
  },
  async handle(handlerInput) {

    let newParams = {};
    let passengers;
    let origin;
    let destination;
    let emissionType;
// Getting values of slots and also handling in case of errors
    origin = handlerInput.requestEnvelope.request.intent.slots.origin.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    destination = handlerInput.requestEnvelope.request.intent.slots.destination.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;

    try {
      emissionType = handlerInput.requestEnvelope.request.intent.slots.emission_type.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch (error) {
      emissionType = 'CO2';
    }
    try {
      passengers = handlerInput.requestEnvelope.request.intent.slots.passengers.value;
    } catch (error) {
      passengers = 1;
    }

// Assigning values to newParams and setting default values in case slot returns undefined
    newParams.origin = origin;
    newParams.destination = destination;
    if (passengers != undefined && passengers !== "") {
      newParams.passengers = passengers;
    } else {
      newParams.passengers = 1;
    }
    if (emissionType != undefined && emissionType !== "") {
      newParams.emission_type = emissionType;
    } else {
      newParams.emission_type = 'CO2';
    }

// Setting up options to send request to API 
    let options = {
      method: 'POST',
      url: "https://carbonhub.org/v1/flight",
      headers: {
        'cache-control': 'no-cache',
        'access-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        origin: newParams.origin,
        destination: newParams.destination,
        passengers: newParams.passengers
      },
      json: true
    };

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";
    
    let correct_answer;
    let num, unit;
    num = response.emissions[newParams.emission_type];
    unit = response.unit;
    correct_answer = "Flight produces " + num.toFixed(2) + " " + unit + " of " + newParams.emission_type + " while travelling from " + newParams.origin + " to " + newParams.destination + " with " + newParams.passengers + " passengers.";
    speechOutput = responseGen(response,newParams,correct_answer);
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
};

// Handling Train related utterences 
const train_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'train_intent');
  },
  async handle(handlerInput) {
    let newParams = {};
    let passengers;
    let origin;
    let destination;
    let emissionType;

// Getting values of slots and also handling in case of errors
  try {
      origin = handlerInput.requestEnvelope.request.intent.slots.torigin.value;
    } catch(error) {
      origin = 'Default';
    }
    try {
      destination = handlerInput.requestEnvelope.request.intent.slots.tdestination.value;
  } catch(error) {
    destination = 'Default';
  }
    try {
      emissionType = handlerInput.requestEnvelope.request.intent.slots.emission_type.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch (error) {
      emissionType = 'CO2';
    }
    try {
      passengers = handlerInput.requestEnvelope.request.intent.slots.passengers.value;
    } catch (error) {
      passengers = 1;
    }

// Assigning values to newParams and setting default values in case slot returns undefined
    if (origin != undefined && origin !== "") {
      newParams.origin = origin;
    } else {
      newParams.origin = 'Default';
    }
    if (destination != undefined && destination !== "") {
      newParams.destination = destination;
    } else {
      newParams.destination = 'Default';
    }
    if (passengers != undefined && passengers !== "") {
      newParams.passengers = passengers;
    } else {
      newParams.passengers = 1;
    }
    if (emissionType != undefined && emissionType !== "") {
      newParams.emission_type = emissionType;
    } else {
      newParams.emission_type = 'CO2';
    }

// Setting up options to send request to API 
    let options = {
      method: 'POST',
      url: "https://carbonhub.org/v1/trains",
      headers: {
        'cache-control': 'no-cache',
        'access-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        origin: newParams.origin,
        destination: newParams.destination,
        passengers  : newParams.passengers
      },
      json: true
    };

// JSON sent to API
    console.log("request ->", newParams, options);

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";

// JSON received from API    
    console.log("response->", response);
    let correct_answer;
    let num, unit;
    num = response.emissions[newParams.emission_type];
    unit = response.unit;
    correct_answer = "Train produces " + num.toFixed(2) + " " + unit + " of " + newParams.emission_type + " while travelling from " + newParams.origin + " to " + newParams.destination + " with " + newParams.passengers + " passengers.";
    speechOutput = responseGen(response,newParams,correct_answer);
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
};

// Handling Poultry related utterences 
const poultry_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'poultry_intent');
  },
  async handle(handlerInput) {
    let newParams = {};
    let emission_type;
    let poultry_quantity;
    let poultry_list;
    let poultry_region;

// Getting values of slots and also handling in case of errors
  try {
      poultry_region = handlerInput.requestEnvelope.request.intent.slots.poultry_region.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch(error) {
      poultry_region = 'Default';
    }
    try {
      poultry_quantity = handlerInput.requestEnvelope.request.intent.slots.poultry_quantity.value;
  } catch(error) {
    destination = 1;
  }
  
  poultry_list = handlerInput.requestEnvelope.request.intent.slots.poultry_list.resolutions.resolutionsPerAuthority[0].values[0].value.name;
  newParams.poultry_list = poultry_list;
  emission_type = 'CO2';
// Assigning values to newParams and setting default values in case slot returns undefined
    if (poultry_region != undefined && poultry_region !== "") {
      newParams.poultry_region = poultry_region;
    } else {
      newParams.poultry_region = 'Default';
    }
    if (poultry_quantity != undefined && poultry_quantity !== "") {
      newParams.poultry_quantity = poultry_quantity;
    } else {
      newParams.poultry_quantity = 1;
    }
    
// Setting up options to send request to API 
    let options = {
      method: 'POST',
      url: "https://carbonhub.org/v1/poultry",
      headers: {
        'cache-control': 'no-cache',
        'access-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        type: newParams.poultry_list,
        region: newParams.poultry_region,
        quantity: newParams.poultry_quantity
      },
      json: true
    };

// JSON sent to API
    console.log("request ->", newParams, options);

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";

// JSON received from API    
    console.log("response->", response);
    let correct_answer;
    let num, unit, punit;
    punit = ' ';
    if (newParams.poultry_list != 'egg') {
      punit = 'kg';
    }
    num = response.emissions[emission_type];
    unit = response.unit;
    correct_answer = "CO2 emission for production of " + newParams.poultry_quantity + punit + newParams.poultry_list + ' is ' + num.toFixed(2) + " " + unit;
    if (newParams.poultry_region != 'Default') {
      correct_answer = correct_answer + ' in ' + newParams.poultry_region;
    }
    console.log(correct_answer);
    speechOutput = responseGen(response,newParams,correct_answer);
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .getResponse();
  }
};

// Generate skill's response from API's response
let responseGen = function (response,newParams, correct_answer) {
  let speechOutput = "";

// Generating result for successful response from API
  if (response.success == true) {
    speechOutput = correct_answer;
  }

// Handling unsuccessful response from API
  if (!response) {
    speechOutput = "An unknown error occured. Please contact our support.\nError: " + response.error;
  } else if (response.success != true) {
    if (response.statusCode == 400) {
      //Handle API errors that come with their own error messages
      //This basically just wraps existing messages in a more readable format for the Alexa
      if (response.error.toLowerCase().startsWith("unable")) {
        if (response.error.toLowerCase().includes("IATA")) {
          //Format "Unable to find the airports. Please use IATA airport codes only"
          speechOutput = "I couldn't find that airport. Please only give me IATA codes.";
        } else {
          //Format "Unable to find <emission type> for <item type> in <region>"
          speechOutput = "I was " + response.error + ". Please try again.";
        }
      } else if (response.error.toLowerCase().startsWith("please provide")) {
        //Format "Please provide valid sector and region values"
        speechOutput = "Sorry, I'm missing some info from you. " + response.error + ".";
      } else if (response.error.toLowerCase().includes("cannot be less than zero")) {
        //Format "Distance cannot be less than zero"
        speechOutput = "Sorry, I can't use a negative distance or mileage. Please try again.";
      } else {
        speechOutput = "An unknown error occured. Please report this to the developers.\nError: " + response.error;
      }
    } else if (response.statusCode == 403 || response.statusCode == 406) {
      // Forbidden, not acceptable
      speechOutput = "An unknown error occured. Please report this to the developers.\nError: " + response.error;
    } else if (response.statusCode == 404) {
      // Not found
      speechOutput = "The data you requested isn't available. Please try again";
    } else if (response.statusCode == 429) {
      // Too many requests
      speechOutput = "I'm feeling a bit overwhelmed right now. Try asking me again later.";
    } else if (response.statusCode == 500) {
      // Internal server error
      speechOutput = "There's a problem with our server. Please try again in a bit.";
    } else if (response.statusCode == 503) {
      // Service unavailable
      speechOutput = "The server is currently offline for maintenance. Please try again later.";
    } else {
      speechOutput = "An unknown error occured. Please contact our support.\nError: " + response.error;
    }
  }

console.log(speechOutput);

// Returning the final generated result
  return speechOutput;
}

// Help Intent
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  }
};

// Exit Intent
const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  }
};

// End Session Intent
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  }
};

// Error Handler
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  }
};

const HELP_MESSAGE = 'You can say, Alexa, ask carbon footprint carbon emissions for 100 units of electricity consumed in india, or, you can say exit...';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    applianceIntent,
    electricity_intent,
    fuel_intent,
    flight_intent,
    train_intent,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
