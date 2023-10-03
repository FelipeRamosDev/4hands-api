# 4Hands API (v0.1.3 BETA)
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
- Create Server
- Create Collection
- Create Endpoint

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
Take a look on the example below to see how a **Query File** should look.

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
