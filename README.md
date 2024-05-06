# 4Hands API (v0.4.10 BETA)
This is a API framework to create a backend for your applications.

### New Features
1. Redis service (Manage Redis database)

### Bugs fixed
1. Fixed the memory heap issue on larger apps
2. Smaller bugs

## Instalation
Proceed with the following steps to install the framework.

### Requirements
- **Node Version:** `16.20.2`
- **Database:** MongoDB Community ([Install MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/))
- **Redis:** The Redis is used to store sessions and other needs you have on your project. Please follow the link to install the Redis, it's required to create a Server API. ([Install Redis](https://redis.io/docs/install/install-redis/))

### Installation Steps
With the database running, follow the next steps:

1. Run the command `npm install 4hands-api`

## Getting Started
- [Create Server 🔗](https://github.com/FelipeRamosDev/4hands-api#create-server)
- [Create Collection 🔗](https://github.com/FelipeRamosDev/4hands-api#create-collection)
- [Create Endpoint 🔗](https://github.com/FelipeRamosDev/4hands-api#create-endpoint)
- [User Authentication 🔗](https://github.com/FelipeRamosDev/4hands-api#user-authentication)
- - [E-mail Confirmation 🔗](https://github.com/FelipeRamosDev/4hands-api#sign-up-e-mail-confirmation)
- - [Password Recovery 🔗](https://github.com/FelipeRamosDev/4hands-api#password-recovery)
- [Send E-mails (MailService) 🔗](https://github.com/FelipeRamosDev/4hands-api#Send-e-mails-mailservice)

### Create Server
To create a server you will need to instantiate a ServerAPI class into you project main file, or whenever you need it. Check the example below:

```javascript
const { ServerAPI } = require('4hands-api');

global.API = new ServerAPI({
    projectName: 'project-name',
    API_SECRET: process.env.API_SECRET,
    redisURL: 'redis://192.168.15.102:6379', // Your Redis host address. Default is 'redis://localhost:6379'
    databaseConfig: {
        HOST: 'mongodb://192.168.15.102:27017/', // Your MongoDB host address. Default is 'mongodb://0.0.0.0:27017/'
        dbName: 'project-name', // Your MongoDB database name.
        collections: [
            require('./src/collections/users'),
            require('./src/collections/master_accounts'),
            require('./src/collections/slot_accounts')
        ]
    },
    // Configuring your server e-mail
    emailConfig: {
        type: 'gmail', // Type of email service ('smtp' or 'gmail'). It's recommended to use environment variables .env for this;
        emailUser: 'testing@gmail.com', // User email for authentication. It's recommended to use environment variables .env for this;
        emailPassword: 'Af09f09sddssd0fssd09fs0df', // Password for authentication. It's recommended to use environment variables .env for this;
    },
    listenCallback: () => {
        // Your callback after the server is connected with success
    }
});

// Examples of endpoints being declared
API.createEndpoint(require('./src/controllers/master-account/create'));
API.createEndpoint(require('./src/controllers/master-account/delete'));

API.createEndpoint(require('./src/controllers/slot-account/create'));
API.createEndpoint(require('./src/controllers/slot-account/delete'));

API.createEndpoint(require('./src/controllers/transfer/depositWithdraw'));

```

### Create Collection
To create new collection on the database, you'll need to create a main collection file, a class file, a event file and a query file.
Which follows the same standard of mongoose. If you want to have a better understanding take a look at [mongoose documentation](https://mongoosejs.com/docs/).

#### Main Collection File
Take a look on the example below to see how a **Main Collection File** should look.

```javascript
const {Collection} = require('4hands-api');
const Schema = require('4hands-api/src/models/SchemaDB');
const {ObjectId} = Schema.mongoSchema.Types;

module.exports = new Collection({
    displayName: 'My Collection',
    name: 'my_collection',
    pluralLabel: 'My Collections',
    singularLabel: 'My Collection',
    symbol: 'MC',
    fieldsSet: [
        {
            fieldName: 'user',
            type: ObjectId,
            required: true,
            ref: 'users',
            refConfig: {
                relatedField: 'masterAccounts',
                type: 'array-oid'
            }
        },
        {
            fieldName: 'tasks',
            type: [ObjectId],
            required: true,
            ref: 'master_accounts',
            refConfig: {
                relatedField: 'master',
                type: 'ObjectId'
            }
        },
        {
            fieldName: 'status',
            type: String,
            default: 'activated',
            enum: ['running', 'activated', 'disabled', 'paused', 'error', 'closing-position']
        },
        {
            fieldName: 'count',
            type: Number,
            default: 0
        }
    ]
});

```

#### Class File
Take a look on the example below to see how a **Class File** should look.

```javascript
const MyCollectionModel = require('../../models/MyCollectionModel');

class MyCollectionClass {
    // It's highly recommended that you provide a model for you collection.
    // To standardize and make more stable your application.
    static BSModel = MyCollectionModel;
    
    // Static properties can be added to use on the database doc read. It will be appended to the document
    static testingStatic = 'This is static';

    // Getters also can be added to use on the database doc read. It will be appended to the document
    get testingGetter() {
        return 'This is a getter';
    }

    // To create a method to be appended to the doc.
    async myMethdod() {
        // Your code here
    }
}

module.exports = MyCollecitonClass;
```

#### Event File
Take a look on the example below to see how a **Event File** should look.
> ℹ️ _This file is not mandatory, at least you need to perform some action in one of the mongoose events._

```javascript
async function preSave(next){
    // Perfrom actions before the document is saved. This event require the next param be called in order to continue ahead.
    next();
}

async function preFindOne(next) {
    // Perfrom actions after the document is found
    next();
}

async function preUpdate(next) {
    // Perfrom actions after the document is updated
    next();
}

async function postSave() {
    // Perform actions after the document was saved
}
async function postFindOne() {
    // Perfrom actions after the document was found
}

async function postUpdate() {
    // Perfrom actions after the document was updated
}

module.exports = {
    preSave,
    postUpdate,
    postSave
}
```

#### Query File
Take a look on the example below to see how a **Query File** should look. A good example is when you need to populate the document.
> ℹ️ _This file is not mandatory, at least you need to perform some action in one of the mongoose query._

```javascript
function defaultPopulate() {
    return this.populate([
        {
            path: 'user',
            model: 'users'
        },
        {
            path: 'transfers',
            model: 'transfers'
        },
        {
            path: 'botAccounts',
            model: 'bot_accounts',
            populate: [
                {
                    path: 'bot',
                    model: 'bots'
                },
                {
                    path: 'trades',
                    model: 'positions',
                    match: {
                        status: 'opened'
                    }
                }
            ]
        }
    ]);
}

module.exports = {
    defaultPopulate
};
```

### Create Endpoint
In order to create an endpoint for your API, you'll have to follow two steps: Create the controller file and loaded it into your server declaration.

#### Create the controller
In your project create your controller files under `src > controllers`, you can organized whenever you want, but it's recommanded that your folders structure follows the endpoint URL.

On the example below I created a new controller under `src > controllers > transfer > deposit.js`. Check the cde example below:

```javascript
const Endpoint = require('4hands-api/src/models/settings/Endpoint');
const CRUD = require('4hands-api/src/services/database/crud');

module.exports = new Endpoint({
    method: 'PUT',                                    // Choose the method of the endpoint
    routePath: '/transfer/deposit',                   // Path for the endpoint
    isAuthRoute: true,                                // Protect the route for authenticated users
    bodySchema: {                                     // This is the schema for the params be validated
        master: { type: String, required: true },
        type: { type: String, required: true },
        value: { type: Number, required: true }
    },
    controller: async (req, res) => {                 // The controller to handle the endpoint
        try {
            const body = req.body;
            const transfered = await CRUD.create('transfers', {...body, user: req.session?.user?._id});
            const response = transfered.toObject();

            response.success = true;
            return res.status(201).send(response);
        } catch(err) {
            const error = logError(err);
            return res.status(500).send(error);
        }
    }
});

```

#### Load the controller into main server file
Got to the main server file on you api, the place where you declared the `ServerAPI` instance.

```javascript
const { ServerAPI } = require('4hands-api');

global.API = new ServerAPI({
    // ServerAPI settings properties
});

// ############################################################################
// ADD THE NEW CONTROLLER HERE
API.createEndpoint(require('./src/controllers/transfer/deposit'));
// ############################################################################
```

### User Authentication
The 4hands API has two default endpoints to be used on authentication that is loaded when a ServerAPI is instantiated: `/auth/login` and `/auth/register`.

#### [POST] /auth/register
##### Params
| name | type | description |
| ---- | ---- | ----------- |
| email | string | (Required) The email param will be the username of the new user. |
| password | string | (Required) Password of account |
| confirmPassword | string | (Required) Confirmation of password |
| firstName | string | (Required) The user's first name |
| lastName | string | (Required) The user's last name |
| phone | string | The user's phone |

##### Success Response
Returns the new user document. One of the properties on the response is `token`, this token will be required on the request headers for every endpoint that is auth protected with `isAuthRoute` set as `true`, so store it into the cookies to use later.

#### [POST] /auth/login
##### Params
| name | type | description |
| ---- | ---- | ----------- |
| email | string | (Required) The email param will be the username of the new user. |
| password | string | (Required) Password of account |

##### Success Response
Returns the new user document. One of the properties on the response is `token`, this token will be required on the request headers for every endpoint that is auth protected with `isAuthRoute` set as `true`, so store it into the cookies to use later.

#### Sign-up E-mail Confirmation
If you'd like to set the ServerAPI to send a confirmation e-mail and a new user sign-up, you need first to set the `emailConfig` property of `ServerAPI` instance. Check below:
[Check how to set the emailConfig](https://github.com/FelipeRamosDev/4hands-api#Send-e-mails-mailservice)

##### Validating a confirmation e-mail
To validate the confirmation e-mail link received, you'll have to create a page on your project **front-end** side with the following path: **/dashboard/email-confirmation**.
This page will receive the `confirmationtoken` as a query string param on the page's URL. This token needs to be sent to the API endpoint in charge of validate the email and enable the user. Check below the endpoint which should receive the token to validate.

###### [POST] /auth/confirm-email
**Params**
| name | type | description |
| ---- | ---- | ----------- |
| confirmationtoken | string | (Required) It's the token received on the e-mail's URL as a search param |

**Success Response**
You'll receive back a `{ success: true }` if the e-mail was successfully validated.

#### Password Recovery
To reset a user's password you'll have to first send a **New Password E-mail** using the endpoint `/auth/reset-password/send-email` as a **POST** request, and then when you received the e-mail with the link you'll send a ajax **PUT** request to `/auth/reset-password/create-new`.

###### [POST] /auth/reset-password/send-email
**Params**
| name | type | description |
| ---- | ---- | ----------- |
| email | string | (Required) The user's email account to recover the password. |

**Success Response**
You'll receive back a `{ success: true }` if the e-mail was successfully validated.

###### [PUT] /auth/reset-password/create-new
**Params**
| name | type | description |
| ---- | ---- | ----------- |
| newPassword | string | (Required) The user's new password. |
| confirmPassword | string | (Required) The confirmation for the new password |
| resettoken | string | (Required) The `resettoken` searchparam received on the e-mail link. |
| useremail | string | (Required) The `useremail` searchparam received on the e-mail link. |

**Success Response**
You'll receive back a `{ success: true }` if the e-mail was successfully validated.


### Send E-mails (MailService)
To use e-mails on your ServerAPI instance, you'll need to set the `emailConfig` property of `ServerAPI`. The `MailService` instance will be always available at ServerAPI properties after instantiated, to access e-mail features use the **ServerAPI.mailService** property.
Check below a example of email configuring:

```javascript
global.API = new ServerAPI({
    // ...
    emailConfig: {
        type: 'gmail', // (Required) Type of email service ('smtp' or 'gmail').
        host: 'smtp.mydomain.com', // Hostname for the SMTP server (for 'smtp' type). It's recommended to use environment variables .env for this;
        smtpPort: 465, // Port number for the SMTP server (for 'smtp' type). Default is 465.
        isSecure: true, // Indicates whether the connection is secure (for 'smtp' type). Default is false.
        emailUser: 'testing@gmail.com', // (Required) User email for authentication. It's recommended to use environment variables .env for this;
        emailPassword: 'Af09f09sddssd0fssd09fs0df' // (Required) Password for authentication. It's recommended to use environment variables .env for this;
    },
    // ...
});
```
