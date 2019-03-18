# Carbon footprint Alexa

Carbon Footprint is an Amazon Alexa Skill which brings conversational access to the data supplied by the parent project [CarbonFootprint-API](https://gitlab.com/aossie/CarbonFootprint-API). Project CarbonFootprint-API aims at providing carbon, ethane and nitrous oxide emission data for various usecases such as while travelling through vehicles, using electricity or while using various appliances.

The Alexa Skill provides you access to this information through voice on practically any device that runs Amazon Alexa - it can be an Android device, Amazon Echo or other Alexa integrated devices.

### Pre-requisites

* Node.js (> v8.10)
* Register for an [AWS Account](https://aws.amazon.com/)
* Register for an [Amazon Developer Account](https://developer.amazon.com/)

### Installation
1. Clone the repository.

	```bash
	$ git clone https://gitlab.com/aossie/carbonfootprint-alexa.git
	```

2. Navigating into the repository's root folder.

	```bash
	$ cd carbonfootprint-alexa
	```

### Deployment

The deployment of the Amazon Alexa Skill is done in two parts: Deployment of Alexa Model and Deployment of AWS Lambda Function. 

#### PART I:
Step 1: Create a new skill at [Amazon Alexa developer portal](https://developer.amazon.com/).

Step 2: Now you will find a JSON editor option, click on it and you will get a option to drag and drop json file.  

Step 4: Drag the AlexaModel/index.json file and drop it at that option. Now your Amazon Alexa model is ready to get build.

Step 5: Click on Save Model and then Build Model option and you have successfully deployed the Alexa model.

#### PART II:
Step 1:Install npm dependencies by navigating into the `lambda` directory and running the npm command: `npm install`

	```bash
	$ cd lambda
	$ npm install

 Or you can manually install the requires node modules i.e. ask-sdk, request and moment using `npm install` command:

	```bash
	$ npm install --save ask-sdk
	$ npm install --save moment
	$ npm install request

Step 2: Go to [CarbonHub](https://carbonhub.org) and generate an API key, copy it and paste at API_Key's value in Lambda/index.js.

Step 3: Now create a zip file of node modules, index.js, package.json and package-lock.json.

Step 4: Create a new function at [AWS Lambda](https://aws.amazon.com/lambda).

Step 5: Add Alexa Skill Kit to that function and upload the zip file. Save it.

Now your Lambda function is also successfully deployed and you can finally test your skill.
	