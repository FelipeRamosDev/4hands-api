# 4Hands API (v0.1.4 BETA)
This is a API framework to create a backend for your applications.

## Instalation
Proceed with the following steps to install the framework.

### Requirements
- **Node Version:** `16.20.2`
- **Database:** MongoDB Community ([Install MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/))

### Installation Steps
With the database running, follow the next steps:

1. Run the command `npm install 4hands-api`
2. Enter on the terminal `cd node_modules/4hands-api`
3. Run the command `npm install`

## Getting Started
- [Create Server 🔗](https://github.com/FelipeRamosDev/4hands-api#create-server)
- [Create Collection 🔗](https://github.com/FelipeRamosDev/4hands-api#create-collection)
- [Create Endpoint 🔗](https://github.com/FelipeRamosDev/4hands-api#create-endpoint)
- [User Authentication 🔗](https://github.com/FelipeRamosDev/4hands-api#user-authentication)


### Create Server
To create a server you will need to instantiate a ServerAPI class into you project main file, or whenever you need it. Check the example below:

```javascript
const { ServerAPI } = require('4hands-api');

global.API = new ServerAPI({
    projectName: 'project-name',
    API_SECRET: process.env.API_SECRET,
    databaseConfig: {
        HOST: 'mongodb://192.168.15.102:27017/',
        dbName: 'project-name',
        collections: [
            require('./src/collections/users'),
            require('./src/collections/master_accounts'),
            require('./src/collections/slot_accounts')
        ]
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
const map = require('./map');
const Limits = map.Limits;

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

async function postUpdate(){
    // Perfrom actions after the document was updated
}

async function postSave() {
    // Perform actions after the document was saved
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
In your project create your controller files under `src > controllers`, you can organized whenever you want, but it's recommandable that your folders structure follows the endpoint URL.

On the example below I created a new controller under `src > controllers > transfer > deposit.js`. Check the cde example below:

```javascript
const { Endpoint, CRUD } = require('4hands-api');

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
            const error = new Error.Log(err).append('apiResponse.transfer.deposit_withdraw', req.body.type, req.body.value);
            return res.status(500).json(error.response());
        }
    }
});

```

#### Load the controller into main server file
Got to the main server file on you api, the place where you declared the `ServerAPI` instance.

```javascript
const { ServerAPI } = require('4hands-api');

global.API = new ServerAPI({
    projectName: 'project-name',
    API_SECRET: process.env.API_SECRET,
    databaseConfig: {
        HOST: 'mongodb://192.168.15.102:27017/',
        dbName: 'project-name',
        collections: [
            require('./src/collections/users'),
            require('./src/collections/master_accounts'),
            require('./src/collections/slot_accounts')
        ]
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

// ############################################################################
// ADD THE NEW CONTROLLER HERE
API.createEndpoint(require('./src/controllers/transfer/deposit'));
// ############################################################################
```

### User Authentication
The 4hands API has two default endpoints to be used on authentication that is loaded when a ServerAPI is instantiated: `/auth/login` and `/auth/register`.

#### Endpoint [POST] /auth/register
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
Returns the new user document. One of the properties on the response is `token`, this "token" will be required on the request headers for every endpoint requested that is auth protected with `isAuthRoute` set as `true` on the Endpoint declaration, so store it into the cookies to use later.

#### Endpoint [POST] /auth/login
##### Params
| name | type | description |
| ---- | ---- | ----------- |
| email | string | (Required) The email param will be the username of the new user. |
| password | string | (Required) Password of account |

##### Success Response
Returns the new user document. One of the properties on the response is `token`, this "token" will be required on the request headers for every endpoint requested that is auth protected with `isAuthRoute` set as `true` on the Endpoint declaration, so store it into the cookies to use later.

