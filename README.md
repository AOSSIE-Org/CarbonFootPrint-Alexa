# Carbon footprint Alexa
## Catalog:
1. [About Project](#about-project)
2. [Pre-requisites](#prerequisites)
3. [Download project and install dependencies](#installation)
4. [Code Testing](#code-testing)
5. [Project Deployment](#deployment)
	* [Manual Deployment](#manual-deployment)
	* [Ask-cli Deployment](#ask-cli-deployment)
6. [Linting](#linting)

### About Project
Carbon Footprint is an Amazon Alexa Skill which brings conversational access to the data supplied by the parent project [CarbonFootprint-API](https://gitlab.com/aossie/CarbonFootprint-API). Project CarbonFootprint-API aims at providing carbon, ethane and nitrous oxide emission data for various usecases such as while travelling through vehicles, using electricity or while using various appliances.

The Alexa Skill provides you access to this information through voice on practically any device that runs Amazon Alexa - it can be an Android device, Amazon Echo or other Alexa integrated devices.

### Prerequisites

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

3. After navigating to the project folder, npm packages needs to get installed. So run the following command, this will install all the necessary packages:

	```bash 
	$ npm install
	```

### Code Testing
1. There are different unit tests created to test the lambda function for every intent. To run these testcases, you need mocha packages which are already installed while running `npm install` command. Now, our next step is to move to our test directory.

	```bash
	$ cd test
	```

2. Now, to run the testcase, run the following command:

	```bash 
	$ mocha appliance_test.js
	```
	```bash
	$ mocha <unit-test-filename>
	```

### Deployment

There are two ways of deploying this skill i.e. manually or through ask cli.

### Manual Deployment:

The deployment of the Amazon Alexa Skill is done in two parts: Deployment of Alexa Model and Deployment of AWS Lambda Function. 

#### PART I:
Step 1: Create a new skill at [Amazon Alexa developer portal](https://developer.amazon.com/).

Step 2: Now you will find a JSON editor option, click on it and you will get a option to drag and drop json file.  

Step 4: Drag the AlexaModel/index.json file and drop it at that option. Now your Amazon Alexa model is ready to get build.

Step 5: Click on Save Model and then Build Model option and you have successfully deployed the Alexa model.

#### PART II:
Step 1:Install npm dependencies by navigating into the `lambda` directory and running the npm command: ```npm install```

	
	$ cd lambda
	$ npm install
	

 Or you can manually install the requires node modules i.e. ask-sdk, request and moment using ```npm install``` command:

	
	$ npm install --save ask-sdk
	$ npm install --save moment
	$ npm install request

Step 2: Go to [CarbonHub](https://carbonhub.org) and generate an API key, copy it and paste at API_Key's value in Lambda/index.js.

Step 3: Now create a zip file of node modules, index.js, package.json and package-lock.json.

Step 4: Create a new function at [AWS Lambda](https://aws.amazon.com/lambda).

Step 5: Add Alexa Skill Kit to that function and upload the zip file. Save it.

Now your Lambda function is also successfully deployed and you can finally test your skill.
	
### ASK CLI Deployment:

#### Setup:

1. Open command line and move to skill's directory.

2. Run the following command to install ask-cli on your system:

	```bash
	$ npm install -g ask-cli
	```

3. After installing run the following command to set up you amazon developer account and aws account as well

	```bash
	$ ask init
	```

Note: This will ask for aws access id and secret access key, for that you need to add user to AWS IAM and get access id and 	  secret access key.

4. Run the following command to deploy the skill:

	```bash
	$ ask deploy
	```

### Linting

If you have added some code and you want to check it for linting errors, you can run the following commands:
1. Move to the directory where eslint package is installed
	```bash
	$ cd node_modules/.bin
	```
2. Run the following command to check for errors:
	```bash
	$ eslint <path-of-file>
	```
You can also run it without moving to ```node_module/.bin``` by running following command:
	```bash	
	$ ./node_modules/.bin/eslint <path-of-file>
	```

Note: You can also fix the linting errors using eslint by running following command:
	```bash
	$ ./node_modules/.bin/eslint --fix <path-of-file>
	```

Note: You can change the name of the skill by making some changes in skill.json file.