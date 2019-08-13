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
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'applianceIntent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
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
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;

// Getting values of slots and also handling in case of errors

      if(handlerInput.requestEnvelope.request.intent.slots.appliances.value.value) {
        appliances = handlerInput.requestEnvelope.request.intent.slots.appliances.value.value;
        } else if((!handlerInput.requestEnvelope.request.intent.slots.appliances.value.value) && (sessionAttributes)) {
        appliances = sessionAttributes.appliance;
      }
    applianceType = handlerInput.requestEnvelope.request.intent.slots.appliance_spec.value.value;
    if(handlerInput.requestEnvelope.request.intent.slots.country.value.value) {
        country = handlerInput.requestEnvelope.request.intent.slots.country.value.value;
        } else if((!handlerInput.requestEnvelope.request.intent.slots.country.value.value) && (sessionAttributes)) {
        country = sessionAttributes.aregion;
      }
      
      emissionType = 'CO2';

    try {
      size = handlerInput.requestEnvelope.request.intent.slots.size.value.value;
    } catch (error) {
      size = "";
    }

    if(handlerInput.requestEnvelope.request.intent.slots.quantity.value.value) {
        quantity = handlerInput.requestEnvelope.request.intent.slots.quantity.value.value;
        } else if((!handlerInput.requestEnvelope.request.intent.slots.quantity.value.value) && (sessionAttributes)) {
        quantity = sessionAttributes.aquantity;
      }

// Assigning values to newParams and setting default values in case slot returns undefined
    if (quantity !== undefined && quantity !== "") {
      newParams.quantity = quantity;
    } else {
      newParams.quantity = 1;
    }
    if(country !== undefined && country !== "") {
      newParams.region = country;
    } else {
      country = 'Default';
    }
    if (emissionType !== undefined && emissionType !== "") {
      newParams.emission_type = emissionType;
    } else {
      newParams.emission_type = 'CO2';
    }
        

    if (appliances !== undefined && appliances !== "") {
      newParams.item = appliances;
    }

    if (applianceType !== undefined && applianceType !== "") {
      newParams.item = newParams.item + " " + applianceType;
    }

    if (size !== undefined && size !== "") {
      newParams.item = newParams.item + " " + size;
    }
        if(handlerInput.requestEnvelope.request.intent.slots.time.value.value) {
        hours = handlerInput.requestEnvelope.request.intent.slots.time.value.value;
        } else if((!handlerInput.requestEnvelope.request.intent.slots.time.value.value) && (sessionAttributes)) {
        hours = sessionAttributes.atime;
      }

    hours = moment.duration(hours, moment.ISO_8601).asHours();
    newParams.duration = hours;


    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.appliance = appliances;
        sessionAttribute.atime = hours;
        sessionAttribute.aquantity = quantity;
        sessionAttribute.aregion = country;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);

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
    console.log("Request sent");
    let speechOutput = "";

// JSON received from API    
    console.log("response->", response);
    let correct_answer;
    let num = response.emissions[emissionType];
    correct_answer = "Usage of " + newParams.item + " produces " + num.toFixed(2) + " " + response.unit + " of " + emissionType + ". Try another one?";
    speechOutput = responseGen(response,newParams, correct_answer);
    let reprompt_text = correct_answer + " Try another one?";
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

// Handling Fuel related utterences 
const fuel_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'fuel_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {

    let newParams = {};
    let fuel;
    let emissionType;
    let quantity;
    let unit;
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;
// Getting values of slots and also handling in case of errors
    unit = 'Litre(s)';
    try {
      emissionType = handlerInput.requestEnvelope.request.intent.slots.emission_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch (error) {
      emissionType = 'CO2';
    }
// Assigning values to newParams and setting default values in case slot returns undefined
      if (unit !== undefined && unit !== "") {
        newParams.unit = unit;
      } else {
        newParams.unit = 'Litre()';
      }

      if (emissionType !== undefined && emissionType !== "") {
        newParams.emission_type = emissionType;
      } else {
        newParams.emission_type = 'CO2';
      }
      if(handlerInput.requestEnvelope.request.intent.slots.fuel.value.value) {
        fuel = handlerInput.requestEnvelope.request.intent.slots.fuel.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        } else if((!handlerInput.requestEnvelope.request.intent.slots.fuel.value.value) && (sessionAttributes)) {
        fuel = sessionAttributes.ffuel_type;
      }
      if(handlerInput.requestEnvelope.request.intent.slots.quantity.value.value) {
        quantity = handlerInput.requestEnvelope.request.intent.slots.quantity.value.value;
        } else if((!handlerInput.requestEnvelope.request.intent.slots.quantity.value.value) && (sessionAttributes)) {
        quantity = sessionAttributes.fquantity;
      }

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.fquantity = quantity;
        sessionAttribute.ffuel_type = fuel;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);


    newParams.item = fuel;
    newParams.quantity = quantity;
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
    let correct_answer;
    let num = response.emissions[emissionType];
    correct_answer = num.toFixed(2) + " " + response.unit + " of CO2 is produced when " + newParams.quantity + " units of " + newParams.item + " is used. Try another one?";
    speechOutput = responseGen(response,newParams, correct_answer);
    let reprompt_text = 'Try another one?';
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

// Handling electricity related utterences
const electricity_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'electricity_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let country;
    let emissionType;
    let quantity;

// Assigning values to newParams and setting default values in case slot returns undefine
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    if(handlerInput.requestEnvelope.request.intent.slots.country.value.value) {
      country = handlerInput.requestEnvelope.request.intent.slots.country.value.value;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.country.value.value) && (sessionAttributes)) {
      country = sessionAttributes.ecountry;
    }
    if(handlerInput.requestEnvelope.request.intent.slots.quantity.value.value) {
      quantity = handlerInput.requestEnvelope.request.intent.slots.quantity.value.value;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.quantity.value.value) && (sessionAttributes)) {
      quantity = sessionAttributes.equantity;
    }

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.equantity = quantity;
        sessionAttribute.ecountry = country;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);

    newParams.quantity = quantity;
    newParams.country = country;
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
    let correct_answer;
    emissionType = "CO2";
    let num = response.emissions[emissionType];
    correct_answer = "Usage of " + newParams.quantity + " units of electricity produces " + num.toFixed(2) + " " + response.unit + " of " + emissionType + ". Try another one?"
    speechOutput = responseGen(response, newParams, correct_answer);
    let reprompt_text = 'Try another one?';
// JSON received from API
    console.log("response->", response);
    return handlerInput.responseBuilder
       .speak(speechOutput)
       .reprompt(reprompt_text)
       .getResponse();   
  }
};

// Handling Flight related utterences 
const flight_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'flight_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let passengers;
    let origin;
    let destination;
    let emissionType;
// Getting values of slots and also handling in case of errors
    try {
      emissionType = handlerInput.requestEnvelope.request.intent.slots.emission_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch (error) {
      emissionType = 'CO2';
    }

// Assigning values to newParams and setting default values in case slot returns undefined
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    if(handlerInput.requestEnvelope.request.intent.slots.origin.value) {
      origin = handlerInput.requestEnvelope.request.intent.slots.origin.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.origin.value.value) && (sessionAttributes)) {
      origin = sessionAttributes.forigin;
    }
    if(handlerInput.requestEnvelope.request.intent.slots.destination.value) {
      destination = handlerInput.requestEnvelope.request.intent.slots.destination.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.destination.value) && (sessionAttributes)) {
      destination = sessionAttributes.fdestination;
    }
    if(handlerInput.requestEnvelope.request.intent.slots.passengers.value) {
      passengers = handlerInput.requestEnvelope.request.intent.slots.passengers.value;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.passengers.value) && (sessionAttributes)) {
      passengers = sessionAttributes.fpassengers;
    }

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.forigin = origin;
        sessionAttribute.fdestination = destination;
        sessionAttribute.fpassengers = passengers;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);

    if (emissionType !== undefined && emissionType !== "") {
      newParams.emission_type = emissionType;
    } else {
      newParams.emission_type = 'CO2';
    }

    newParams.origin = origin;
    newParams.destination = destination;
    newParams.passenger = passengers;

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
        passengers: newParams.passenger
      },
      json: true
    };

// JSON sent to API
    console.log("request ->", newParams);

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";
    let correct_answer;
    let num, unit;
    num = response.emissions[newParams.emission_type];
    unit = response.unit;
    correct_answer = "Flight produces " + num.toFixed(2) + " " + unit + " of " + newParams.emission_type + " while travelling from " + newParams.origin + " to " + newParams.destination + " with " + newParams.passenger + " passengers. Try another one?";
    // JSON received from API    
    console.log("response->", response);
   speechOutput = responseGen(response, newParams, correct_answer);
    let reprompt_text = 'Try another one?';
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

// Handling Train related utterences 
const train_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'train_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let passengers;
    let origin;
    let destination;
    let emission_type;

    if (emission_type !== undefined && emission_type !== "") {
      newParams.emission_type = emission_type;
    } else {
      newParams.emission_type = 'CO2';
    }

// Getting values of slots and also handling in case of errors
    try {
      emission_type = handlerInput.requestEnvelope.request.intent.slots.emission_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch(error) {
      emission_type = 'CO2';
    }

    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    if(handlerInput.requestEnvelope.request.intent.slots.torigin.value.value) {
      origin = handlerInput.requestEnvelope.request.intent.slots.torigin.value.value;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.torigin.value.value) && (sessionAttributes)) {
      origin = sessionAttributes.torigin;
    }
    if(handlerInput.requestEnvelope.request.intent.slots.tdestination.value.value) {
      destination = handlerInput.requestEnvelope.request.intent.slots.tdestination.value.value;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.tdestination.value.value) && (sessionAttributes)) {
      destination = sessionAttributes.tdestination;
    }
    if(handlerInput.requestEnvelope.request.intent.slots.passengers.value.value) {
      passengers = handlerInput.requestEnvelope.request.intent.slots.passengers.value.value;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.passengers.value.value) && (sessionAttributes)) {
      passengers = sessionAttributes.tpassengers;
    }

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.torigin = origin;
        sessionAttribute.tdestination = destination;
        sessionAttribute.tpassengers = passengers;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);

    newParams.destination = destination;
    newParams.origin = origin;
    newParams.passenger = passengers;

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
        passengers: newParams.passenger
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
    correct_answer = "Train produces " + num.toFixed(2) + " " + unit + " of " + emission_type + " while travelling from " + newParams.origin + " to " + newParams.destination + " with " + newParams.passenger + " passengers. Try another one?";
    speechOutput = responseGen(response,newParams,correct_answer);
    let reprompt_text = 'Try another one?';
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

// Handling Poultry related utterences 
const poultry_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest' ||
    (request.type === 'IntentRequest' &&
    request.intent.name === 'poultry_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let emission_type;
    let poultry_quantity;
    let poultry_list;
    let poultry_region;
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;

// Getting values of slots and also handling in case of errors
      if(handlerInput.requestEnvelope.request.intent.slots.poultry_region.value.value) {
      poultry_region = handlerInput.requestEnvelope.request.intent.slots.poultry_region.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.poultry_region.value.value) && (sessionAttributes)) {
      poultry_region = sessionAttributes.poultry_region;
      }
      if(handlerInput.requestEnvelope.request.intent.slots.poultry_list.value.value) {
      poultry_list = handlerInput.requestEnvelope.request.intent.slots.poultry_list.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.poultry_list.value.value) && (sessionAttributes)) {
      poultry_list = sessionAttributes.poultry_list;
      }
      if(handlerInput.requestEnvelope.request.intent.slots.poultry_quantity.value.value) {
        poultry_quantity = handlerInput.requestEnvelope.request.intent.slots.poultry_quantity.value.value;
      } else if((!handlerInput.requestEnvelope.request.intent.slots.poultry_quantity.value.value) && (sessionAttributes)) {
        poultry_quantity = sessionAttributes.poultry_quantity;
      }
      emission_type = 'CO2';
    
      newParams.poultry_list = poultry_list;
      newParams.poultry_quantity = poultry_quantity;
      newParams.poultry_region = poultry_region;
      
      let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.poultry_region = poultry_region;
        sessionAttribute.poultry_quantity = poultry_quantity;
        sessionAttribute.poultry_list = poultry_list;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);

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
      punit = 'kg ';
    }
    num = response.emissions[emission_type];
    unit = response.unit;
    correct_answer = "CO2 emission for production of " + newParams.poultry_quantity + punit + newParams.poultry_list + ' is ' + num.toFixed(2) + " " + unit;
    if (newParams.poultry_region !== undefined) {
      correct_answer = correct_answer + ' in ' + newParams.poultry_region;
    }
    correct_answer = correct_answer + ". Try another one?"
    console.log(correct_answer);
    speechOutput = responseGen(response,newParams,correct_answer);
    let reprompt_text = 'Try another one?';
 
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

// Handling Sector related utterences 
const sector_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest'
        && request.intent.name === 'sector_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let sector, region;
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;

// Getting values of slots and also handling in case of errors
    if(handlerInput.requestEnvelope.request.intent.slots.sector.value.value) {
    sector = handlerInput.requestEnvelope.request.intent.slots.sector.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.sector.value.value) && (sessionAttributes)) {
    sector = sessionAttributes.sector;
    }
    if(handlerInput.requestEnvelope.request.intent.slots.region.value.value) {
      region = handlerInput.requestEnvelope.request.intent.slots.region.value.value;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.region.value.value) && (sessionAttributes)) {
      region = sessionAttributes.sector_region;
    }
    newParams.sector = sector;
    newParams.region = region;

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.sector = sector;
        sessionAttribute.sector_region = region;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);
// Setting up options to send request to API 
    let options = {
      method: 'POST',
      url: "https://carbonhub.org/v1/sector",
      headers: {
        'cache-control': 'no-cache',
        'access-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        sector: newParams.sector,
        region: newParams.region
      },
      json: true
    };

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";
console.log("response is => " + response);
// Setting up correct answer
    let correct_answer;
    let num, unit;
    num = response.quantity;
    unit = response.unit;
    correct_answer = num.toFixed(2) + " " + unit + " of CO2 is produced due to " + newParams.sector + " in " + newParams.region + ". Try another one?";
    speechOutput = responseGen(response,newParams,correct_answer);
    let reprompt_text = 'Try another one?';
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

// Handling Vehicle related utterences 
const vehicle_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest' ||
    (request.type === 'IntentRequest' &&
    request.intent.name === 'vehicle_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let fuel_type, origin, destination, mileage, emission_type, vorigin, vdestination;
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;

// Getting values of slots and also handling in case of errors
    try {
      emission_type = handlerInput.requestEnvelope.request.intent.slots.emission_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } catch(error) {
      emission_type = 'CO2';
    }

    if(handlerInput.requestEnvelope.request.intent.slots.fuel_type.value.value) {
    fuel_type = handlerInput.requestEnvelope.request.intent.slots.fuel_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.fuel_type.value.value) && (sessionAttributes)) {
    fuel_type = sessionAttributes.fuel_type;
  }
  if(handlerInput.requestEnvelope.request.intent.slots.vorigin.value.value) {
    vorigin = handlerInput.requestEnvelope.request.intent.slots.vorigin.value.value;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.vorigin.value.value) && (sessionAttributes)) {
    vorigin = sessionAttributes.vorigin;
  }
  if(handlerInput.requestEnvelope.request.intent.slots.vdestination.value.value) {
    vdestination = handlerInput.requestEnvelope.request.intent.slots.vdestination.value.value;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.vdestination.value.value) && (sessionAttributes)) {
    vdestination = sessionAttributes.vdestination;
  }
  if(handlerInput.requestEnvelope.request.intent.slots.mileage.value.value) {
    mileage = handlerInput.requestEnvelope.request.intent.slots.mileage.value.value;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.mileage.value.value) && (sessionAttributes)) {
    mileage = sessionAttributes.vmileage;
  }

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.fuel_type = fuel_type;
        sessionAttribute.vorigin = vorigin;
        sessionAttribute.vdestination = vdestination;
        sessionAttribute.vmileage = mileage;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);

    fuel_type = fuel_type.substring(4);
    origin = vorigin;
    destination = vdestination;
    newParams.type = fuel_type;
    newParams.destination = destination;
    newParams.origin = origin;
    newParams.mileage = mileage;
    console.log("newParams are " + newParams);
// Setting up options to send request to API 
    let options = {
      method: 'POST',
      url: "https://carbonhub.org/v1/vehicle",
      headers: {
        'cache-control': 'no-cache',
        'access-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: {
        type: newParams.type,
        origin: newParams.origin,
        destination: newParams.destination,
        mileage: newParams.mileage
      },
      json: true
    };

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";
console.log("response is => " + response);
// Setting up correct answer
    let correct_answer;
    let num, unit;
    num = response.emissions[emission_type];
    unit = response.unit;
    correct_answer = num.toFixed(2) + " " + unit + " of " + emission_type + " is produced in a journey from " + newParams.origin + " to " + newParams.destination + " on a vehicle with mileage of " + newParams.mileage + " kmpl. Try another one?";
    speechOutput = responseGen(response,newParams,correct_answer);
    let reprompt_text = 'Try another one?';
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

// Handling Land related utterences 
const land_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest'
    ||(request.type === 'IntentRequest' && 
    request.intent.name === 'land_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let land_region, land_type;
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;

// Getting values of slots and also handling in case of errors
    if(handlerInput.requestEnvelope.request.intent.slots.land_type.value.value) {
    land_type = handlerInput.requestEnvelope.request.intent.slots.land_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.land_type.value.value) && (sessionAttributes)) {
    land_type = sessionAttributes.land_type;
  }
  if(handlerInput.requestEnvelope.request.intent.slots.region.value.value) {
    land_region = handlerInput.requestEnvelope.request.intent.slots.region.value.value;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.region.value.value) && (sessionAttributes)) {
    land_region = sessionAttributes.land_region;
  }

    newParams.region = land_region;
    newParams.item = land_type;
    console.log("newParams are " + newParams);

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
        sessionAttribute.land_type = land_type;
        sessionAttribute.land_region = land_region;
        handlerInput.attributesManager.setSessionAttributes(sessionAttribute);

// Setting up options to send request to API 
    let options = {
      method: 'POST',
      url: "https://carbonhub.org/v1/land",
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
    };

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";
console.log("response is => " + response);
// Setting up correct answer
    let correct_answer;
    let num, unit;
    num = response.quantity;
    unit = response.unit;
    correct_answer = "CO2 emissions due to " + newParams.item + " in " + newParams.region + " is " + num.toFixed(2) + " " + unit + ". Try another one?";
    speechOutput = responseGen(response,newParams,correct_answer);
    let reprompt_text = 'Try another one?';
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

// Handling Food related utterences 
const food_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
        request.intent.name === 'food_intent' &&
        ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let food_region, food_type;

    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;
// Getting values of slots and also handling in case of errors
  if(handlerInput.requestEnvelope.request.intent.slots.food_type.value.value) {
    food_type = handlerInput.requestEnvelope.request.intent.slots.food_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.food_type.value.value) && (sessionAttributes)) {
    food_type = sessionAttributes.food_type;
  }
  if(handlerInput.requestEnvelope.request.intent.slots.food_region.value.value) {
    food_region = handlerInput.requestEnvelope.request.intent.slots.food_region.value.value;
    } else if((!handlerInput.requestEnvelope.request.intent.slots.food_region.value.value) && (sessionAttributes)) {
    food_region = sessionAttributes.food_region;
  }

    newParams.region = food_region;
    newParams.item = food_type;

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
    sessionAttribute.food_type = food_type;
    sessionAttribute.food_region = food_region;
    handlerInput.attributesManager.setSessionAttributes(sessionAttribute);

// Setting up options to send request to API 
    let options = {
      method: 'POST',
      url: "https://carbonhub.org/v1/food",
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
    };

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";
    let emission_type = 'CO2';
// Setting up correct answer
    let correct_answer;
    let num, unit;
    num = response.quantity;
    unit = response.unit;
    correct_answer = "Emissions for " + newParams.item + " in " + newParams.region + " is " + num.toFixed(2) + " " + unit + ". Try another one?";
    let reprompt_text = 'Try another one?';
    speechOutput = responseGen(response,newParams,correct_answer);
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
      .getResponse();
  }
};

//Handling Agriculture related utterences 
const agriculture_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'LaunchRequest' ||
    (request.type === 'IntentRequest' && 
    request.intent.name === 'agriculture_intent') &&
    ((request.dialogState === 'COMPLETED') || (sessionAttributes));
  },
  async handle(handlerInput) {
    let newParams = {};
    let crop_region, crop_type;
    let sessionAttributes = handlerInput.requestEnvelope.session.attributes;
// Getting values of slots and also handling in case of errors
      if(handlerInput.requestEnvelope.request.intent.slots.crop_type.value.value) {
        crop_type = handlerInput.requestEnvelope.request.intent.slots.crop_type.value.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        } else if((!handlerInput.requestEnvelope.request.intent.slots.crop_type.value.value) && (sessionAttributes)) {
        crop_type = sessionAttributes.crop_type;
      }
      if(handlerInput.requestEnvelope.request.intent.slots.crop_region.value.value) {
        crop_region = handlerInput.requestEnvelope.request.intent.slots.crop_region.value.value;
        } else if((!handlerInput.requestEnvelope.request.intent.slots.crop_region.value.value) && (sessionAttributes)) {
        crop_region = sessionAttributes.crop_region;
      }

    newParams.region = crop_region;
    newParams.item = crop_type;
    console.log("crop type is " + crop_type);
    console.log("crop region is " + crop_region);

    let sessionAttribute = handlerInput.attributesManager.getSessionAttributes();
    sessionAttribute.crop_type = crop_type;
    sessionAttribute.crop_region = crop_region;
    handlerInput.attributesManager.setSessionAttributes(sessionAttribute);
// Setting up options to send request to API 
    let options = {
      method: 'POST',
      url: "https://carbonhub.org/v1/agriculture",
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
    };

// Receiving response from API
    let response = await callEmissionsApi(options);
    let speechOutput = "";
console.log("response is => " + response.unit);
// Setting up correct answer
    let correct_answer;
    let num, unit;
    num = response.quantity;
    unit = response.unit;
    correct_answer = "Emissions due to " + newParams.item + " in " + newParams.region + " is " + num.toFixed(2) + " " + unit + ". Try another one?";
    speechOutput = responseGen(response,newParams,correct_answer);
    let reprompt_text = 'Try another one?';
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(reprompt_text)
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

console.log("output is : " + speechOutput);

// Returning the final generated result
  return speechOutput;
}

//in progress intents for slot filling support
//food intent
const InProgressfood_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'food_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.food_type) && (!sessionAttributes.food_region)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//appliance intent
const InProgressappliance_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'applianceIntent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.atime) && (!sessionAttributes.aquantity) && (!sessionAttributes.appliance) && (!sessionAttributes.aregion)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//fuel intent
const InProgressfuel_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'fuel_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.ffuel_type) && (!sessionAttributes.fquantity)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//electricity intent
const InProgresselectricity_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'electricity_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.ecountry) && (!sessionAttributes.equantity)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//flight intent
const InProgressflight_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'flight_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) || 
      ((!sessionAttributes.forigin) && (!sessionAttributes.fdestination) && (!sessionAttributes.fpassenger)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//train intent
const InProgresstrain_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'train_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.torigin) && (!sessionAttributes.tdestination) && (!sessionAttributes.tpassengers)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//poultry intent
const InProgresspoultry_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'poultry_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.poultry_list) && (!sessionAttributes.poultry_region) && (!sessionAttributes.poultry_quantity)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//vehicle intent
const InProgressvehicle_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'vehicle_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.vorigin) && (!sessionAttributes.vdestination) && (!sessionAttributes.fuel_type) && (!sessionAttributes.vmileage)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//agriculture intent
const InProgressagriculture_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'agriculture_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.crop_type) && (!sessionAttributes.crop_region)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//sector intent
const InProgresssector_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'sector_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.sector) && (!sessionAttributes.sector_region)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

//land intent
const InProgressland_intent = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.requestEnvelope.session.attributes;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'land_intent' &&
      request.dialogState !== 'COMPLETED' &&
      ((!sessionAttributes) ||
      ((!sessionAttributes.land_type) && (!sessionAttributes.land_region)));
  },
  handle(handlerInput) {
    const currentRequest = handlerInput.requestEnvelope.request;
    return handlerInput.responseBuilder
      .addDelegateDirective(currentRequest.intent)
      .getResponse();
  }
};

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
    poultry_intent,
    sector_intent,
    vehicle_intent,
    land_intent,
    food_intent,
    agriculture_intent,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
