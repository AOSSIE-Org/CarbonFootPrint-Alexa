# Carbon Footprint Alexa

## Student- Maandeep Singh
## Project Link: https://gitlab.com/aossie/carbonfootprint-alexa

## Carbon Footprint Alexa
The goal of this project is to add an vocal interface for Carbon footprint project. This project is an Amazon Alexa skill which tells users the amount of Carbon emitted due to various human activities such as using appliances, electricity, fuel, behicles and many more. Some more descryption of the project is as follows:

### Use case modeling

I identified the following tasks in the beginning of the project:
1. Add lambda function for flight intent - **Done**
2. Add train intent to the skill - **Done**
3. Add vehicle intent to the skill - **Done**
4. Add poultry intent to the skill - **Done**
5. Add sector intent to the skill - **Done**
6. Add land intent to the skill - **Done**
7. Add agriculture intent to the skill - **Done**
8. Add food intent to the skill - **Done**
9. Add slot filling support - **Done**
10. Add session management support - **Done**
11. Add unit tests fo each intent - **Done**
12. Add ask-cli support for auto deployment - **Done**

### Deep view into the technology
This project basically have two parts i.e. Alexa Skill Model and AWS Lambda Function. Some of the libraries or packages used in this project are mentioned as follows:
 * [Node.js]() - AWS Lambda function is built on Node.js
 * [Moment](https://momentjs.com/docs/) - Moment.js is a javascript date library that helps create, manipulate, and format dates without extending the Date prototype.
 * [Request](https://www.npmjs.com/package/request) - This is used to send API requests.
 * [Mocha](https://mochajs.org) - This is a testing framework used to write unit tests.
 * [EsLint](https://eslint.org) - This is used to check and fix linting errors.
 * [Alexa Skill Test Framework](https://www.npmjs.com/package/alexa-skill-test-framework) - This framework makes it easy to create full-coverage black box tests for an Alexa skill using Mocha.

This project is basically devided into two main parts i.e. Alexa model and AWS Lambda function. The Alexa model is where we define all the intents, slots, utterences and invokation details. And AWS Lambda is the platform where we create a function which handles all the user requests at backend. We have created the lambda function for this project in node.js but AWS Lambda provides a large number of options for creating lambda functions.

In the beginning of Phase 1, we started up with adding flight intent to AWS lambda function. Then, we added train intent to our skill and also started working on creating unit tests for flight and train intents. We also added the slot filling support, if the user has not filled all the necessary slots in his utterence, then the skill will prompt him for that. And we ended up Phase 1 by adding poultry and vehicle intents in the skill along with their respective unit tests.

In Phase 2, we added land, sector and food intents to alexa skill and also the unit tests for all of them. We ended up Phase 2 by adding Alexa model for agriculture intent.

In the beginning of Phase 3, we added agriculture intent to AWS Lambda function and also created unit tests for agriculture intent. We also added session management support, suppose if the user has asked food emissions due to eggs in india and now he wants to know the same in china, then he will not have to repeat the whole utterence, he can just say food emissions in china. Then, we have added the ask-cli support to the skill, which automates all the alexa skill working for us upto an extent. We can deploy the skill through command line also just by running a single command. We ended up by refactoring the lambda function file and adding eslint and documentation to the project.

I would like to thank all the Aossie members especially my mentor Varun Chitre. Everytime I faced a problem, he helped me. I got to learn a lot from him in past 3 months and it was great experience to be a part of Aossie.

### Merge Requests:
 1. [Carbon-footprint-Alexa: Add Flight Intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/36) - Added flight intent to the skill.

 2. [Carbon-footprint-Alexa: Add train intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/40) - Add train intent to amazon alexa model and handle all the requests related to it.

 3. [Carbon-footprint-Alexa: Add Automated Testing](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/41) - Automated testing added. Test cases are related to flight intent.

 4. [Carbon-footprint-Alexa: add poultry intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/43) - The skill can listen and reply to requests related to poultry.

 5. [Carbon-footprint-Alexa: Add poultry testing](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/46) - Unit tests for poultry intent are added.

 6. [Carbon-footprint- Alexa: Add vehicle intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/48) - The 
 skill can listen and also respond to requests related to vehicles. 

 7. [Carbon-footprint-Alexa: Add train testing](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/49) - Unit tests for train intent are added.

 8. [Carbon-footprint-Alexa: Add land intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/51) - Add land intent to AWS Lambda function and Alexa model. Also added unit test for land intent.

 9. [Carbon-footprint-Alexa: Add sector intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/53) - Add sector intent to Amazon Alexa model and AWS Lambda function. Also added unit tests for sector intent.

 10. [Carbon-footprint-alexa: Add food intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/54) - Add food intent to Amazon Alexa model and AWS Lambda Function. Also add unit tests for food intent. 

 11. [Carbon-footprint-Alexa: Add agriculture intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/55) - Added agriculture intent to Amazon Alexa Model and AWS Lambda Function. Also added unit tests for agriculture intent.

 12. [Carbon-footprint-Alexa: Add session management support](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/56) - Added session management support and manage slot filling support in AWS Lambda function using manual 
 delegate. 

 13. [Carbon-footprint-Alexa: Add unit tests for Appliance, Fuel and Electricity Intent](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/57) - Unit tests for appliance, fuel and electricity intent are added.

 14. [Carbon-footprint-Alexa: Refactor lambda function](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/60) - Created different JS files for each intent and finally connected them to index.js file.
 
 15. [Carbon-footprint-Alexa: Documentation Update](https://gitlab.com/aossie/carbonfootprint-alexa/merge_requests/61) - Added testing, linting and deployment details to Readme.md file.  