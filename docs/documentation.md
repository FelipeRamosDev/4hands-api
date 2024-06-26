## Modules

<dl>
<dt><a href="#module_FormCtrlCLI">FormCtrlCLI</a></dt>
<dd><p>Represents a handler for events related to a form.</p>
</dd>
<dt><a href="#module_NavigatorOption">NavigatorOption</a></dt>
<dd><p>Model of option for the ViewNavigator class.</p>
</dd>
<dt><a href="#module_EventsHandlers">EventsHandlers</a></dt>
<dd><p>Represents a handler for events related to a form.</p>
</dd>
<dt><a href="#module_PoolForm">PoolForm</a></dt>
<dd><p>A class representing a form that contains a pool of questions.</p>
</dd>
<dt><a href="#module_QuestionModel">QuestionModel</a></dt>
<dd><p>A class for Question used on PoolForm of CLI Interface</p>
</dd>
<dt><a href="#module_ToolsCLI">ToolsCLI</a></dt>
<dd><p>A set of utility tools for the command-line interface.</p>
</dd>
<dt><a href="#module_ViewCLI">ViewCLI</a></dt>
<dd><p>A command-line interface view with navigation capabilities.</p>
</dd>
<dt><a href="#module_DataDependency">DataDependency</a></dt>
<dd><p>Represents a data dependency used to manage real-time data updates and rendering in a parent component.</p>
</dd>
<dt><a href="#module_SafeValuesCollection">SafeValuesCollection</a></dt>
<dd><p>Represents a Collection model for storing encrypted data.
Defines the schema for &#39;safe_values&#39; collection, specifying fields for encrypted data along with their types and constraints.</p>
</dd>
<dt><a href="#module_AuthService">AuthService</a></dt>
<dd><p>Class representing an authentication service for handling user authentication and authorization.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#FormCtrlCLI">FormCtrlCLI</a></dt>
<dd><p>A class representing a command-line interface for form control.</p>
</dd>
<dt><a href="#ScreenHelperCLI">ScreenHelperCLI</a></dt>
<dd><p>Class representing a command-line interface screen helper.</p>
</dd>
<dt><a href="#CLI">CLI</a> ÔçÉ <code><a href="#ToolsCLI">ToolsCLI</a></code></dt>
<dd><p>Class representing a Command Line Interface (CLI) application.</p>
</dd>
<dt><a href="#NavigatorOption">NavigatorOption</a></dt>
<dd><p>Model representing an option for the ViewNavigator class, extended by the ToolsCLI class.</p>
</dd>
<dt><a href="#EventsHandlers">EventsHandlers</a></dt>
<dd><p>Represents a handler for events related to a form.</p>
</dd>
<dt><a href="#PoolForm">PoolForm</a></dt>
<dd><p>Represents a form controller for a pool of questions.</p>
</dd>
<dt><a href="#QuestionModel">QuestionModel</a></dt>
<dd><p>Class representing a question model.</p>
</dd>
<dt><a href="#ToolsCLI">ToolsCLI</a></dt>
<dd><p>Class representing a set of utility tools for the command-line interface.</p>
</dd>
<dt><a href="#ViewCLI">ViewCLI</a> ÔçÉ <code><a href="#ToolsCLI">ToolsCLI</a></code></dt>
<dd><p>Class representing a command-line interface view with navigation capabilities.</p>
</dd>
<dt><a href="#ViewNavigator">ViewNavigator</a> ÔçÉ <code><a href="#ToolsCLI">ToolsCLI</a></code></dt>
<dd><p>Class representing a view navigator with navigation options.</p>
</dd>
<dt><a href="#Component">Component</a> ÔçÉ <code><a href="#ValidateSchema">ValidateSchema</a></code></dt>
<dd><p>Class representing a component with validation and rendering capabilities.</p>
</dd>
<dt><a href="#StringTemplateBuilder">StringTemplateBuilder</a></dt>
<dd><p>Class representing a string template builder with various formatting capabilities.</p>
</dd>
<dt><a href="#AuthBucket">AuthBucket</a></dt>
<dd></dd>
<dt><a href="#SafeValue">SafeValue</a></dt>
<dd><p>Represents a SafeValue object used for encrypting and decrypting sensitive data.
Extends _Global class and encapsulates encryption and decryption functionality.</p>
</dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#EventStd">EventStd</a></dt>
<dd></dd>
<dt><a href="#ErrorLog">ErrorLog</a></dt>
<dd></dd>
<dt><a href="#LogBase">LogBase</a></dt>
<dd></dd>
<dt><a href="#Logstamp">Logstamp</a></dt>
<dd></dd>
<dt><a href="#RequestAPI">RequestAPI</a></dt>
<dd></dd>
<dt><a href="#Collection">Collection</a></dt>
<dd></dd>
<dt><a href="#CollectionEncrypt">CollectionEncrypt</a> ÔçÉ <code><a href="#CollectionField">CollectionField</a></code></dt>
<dd><p>Represents a collection field that references encrypted data stored in the &#39;safe_values&#39; collection.
Extends CollectionField class and sets up the type as ObjectId, referencing &#39;safe_values&#39; collection.</p>
</dd>
<dt><a href="#CollectionField">CollectionField</a></dt>
<dd></dd>
<dt><a href="#Endpoint">Endpoint</a></dt>
<dd></dd>
<dt><a href="#SchemaRefConfig">SchemaRefConfig</a></dt>
<dd></dd>
<dt><a href="#Success">Success</a></dt>
<dd></dd>
<dt><a href="#Resources">Resources</a></dt>
<dd><p>Class representing a resource manager for handling language-specific resources.</p>
</dd>
<dt><a href="#SafeValueClass">SafeValueClass</a></dt>
<dd><p>Represents a utility class providing encryption and decryption methods for sensitive data.
It uses SafeValue and AuthService classes to perform encryption and decryption operations.</p>
</dd>
<dt><a href="#AuthService">AuthService</a></dt>
<dd><p>Class representing an authentication service for handling user authentication and authorization.</p>
</dd>
<dt><a href="#DatabaseServer">DatabaseServer</a></dt>
<dd></dd>
<dt><a href="#Prompt">Prompt</a></dt>
<dd></dd>
<dt><a href="#ServerAPI">ServerAPI</a></dt>
<dd></dd>
<dt><a href="#ComponentSubscription">ComponentSubscription</a></dt>
<dd><p>Represents a subscription for a specific component in the application.
Extends SocketSubscription class.</p>
</dd>
<dt><a href="#DocSubscription">DocSubscription</a></dt>
<dd><p>Represents a subscription for a specific document in a collection.
Extends SocketSubscription class.</p>
</dd>
<dt><a href="#SocketServer">SocketServer</a></dt>
<dd><p>Represents a socket server that manages socket connections and subscriptions.</p>
</dd>
<dt><a href="#SocketConnection">SocketConnection</a></dt>
<dd><p>Manages socket connections and subscriptions.</p>
</dd>
<dt><a href="#SocketSubscription">SocketSubscription</a></dt>
<dd><p>Represents a subscription in a socket connection.</p>
</dd>
<dt><a href="#XMLManager">XMLManager</a></dt>
<dd><p>Manages operations related to XML files, including parsing, loading, and saving.</p>
</dd>
<dt><a href="#ValidateSchema">ValidateSchema</a></dt>
<dd><p>Utility class for validating and handling MongoDB schemas in the application.</p>
</dd>
<dt><a href="#ValidationBase">ValidationBase</a></dt>
<dd><p>Utility class for validating and manipulating data types and structures.</p>
</dd>
</dl>

## Members

<dl>
<dt><a href="#ApiHealthCheck">ApiHealthCheck</a> : <code><a href="#Endpoint">Endpoint</a></code></dt>
<dd><p>Represents a controller endpoint for to check if the API is connected and working properly.</p>
</dd>
<dt><a href="#AuthLogin">AuthLogin</a> : <code><a href="#Endpoint">Endpoint</a></code></dt>
<dd><p>Represents a controller endpoint to authenticate an user.</p>
</dd>
<dt><a href="#AuthRegister">AuthRegister</a> : <code><a href="#Endpoint">Endpoint</a></code></dt>
<dd><p>Represents a controller endpoint for register an user.</p>
</dd>
<dt><a href="#CollectionCreate">CollectionCreate</a> : <code><a href="#Endpoint">Endpoint</a></code></dt>
<dd><p>Represents a controller endpoint for creating a document in a collection.</p>
</dd>
<dt><a href="#CollectionDelete">CollectionDelete</a> : <code><a href="#Endpoint">Endpoint</a></code></dt>
<dd><p>Represents a controller endpoint for deleting a document in a collection.</p>
</dd>
<dt><a href="#CollectionGetDoc">CollectionGetDoc</a> : <code><a href="#Endpoint">Endpoint</a></code></dt>
<dd><p>Represents a controller endpoint for getting a document in a collection.</p>
</dd>
<dt><a href="#CollectionGetQuery">CollectionGetQuery</a> : <code><a href="#Endpoint">Endpoint</a></code></dt>
<dd><p>Represents a controller endpoint for listing documents in a collection.</p>
</dd>
<dt><a href="#CollectionUpdateDocument">CollectionUpdateDocument</a> : <code><a href="#Endpoint">Endpoint</a></code></dt>
<dd><p>Represents a controller endpoint for updating a document in a collection.</p>
</dd>
<dt><a href="#ajax - Does AJAX requests">ajax - Does AJAX requests</a></dt>
<dd></dd>
<dt><a href="#Resource - Resource instance to call text and other resources.">Resource - Resource instance to call text and other resources.</a></dt>
<dd></dd>
<dt><a href="#toolsCLI - CLI tools to use in everywhere.">toolsCLI - CLI tools to use in everywhere.</a></dt>
<dd></dd>
<dt><a href="#Log - To log errors and any other log.">Log - To log errors and any other log.</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents an authentication bucket associated with a user.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents a user in the application.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Model to set the events that will trigger actions throughout the app.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents an error log entry in the application.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents a base class for logging in the application.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents a log entry with a timestamp, activity type, and description.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents an API request handler which validates incoming request body against provided schema.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents a schema for MongoDB database, including methods for initializing queries, events, and classes.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents a collection in the database.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents a field in a collection.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents an API endpoint configuration.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents the reference configuration for a schema field.</p>
</dd>
<dt><a href="#Models">Models</a> : <code>object</code></dt>
<dd><p>Represents a success response object used to convey successful API responses.</p>
</dd>
<dt><a href="#Services">Services</a> : <code>object</code></dt>
<dd><p>Module providing CRUD (Create, Read, Update, Delete) operations for interacting with a database.</p>
</dd>
<dt><a href="#Services">Services</a> : <code>object</code></dt>
<dd><p>Represents a database server with specified configurations and collections.</p>
</dd>
<dt><a href="#Services">Services</a> : <code>object</code></dt>
<dd><p>Utility class for file system operations.</p>
</dd>
<dt><a href="#Services">Services</a> : <code>object</code></dt>
<dd><p>Represents a command line prompt utility.</p>
</dd>
<dt><a href="#Services">Services</a> : <code>object</code></dt>
<dd><p>Represents the main server class for the API.</p>
</dd>
<dt><a href="#Services">Services</a> : <code>object</code></dt>
<dd><p>Module providing functionality for handling socket connections and managing subscriptions.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#navDefaultQuestions">navDefaultQuestions</a> : <code>Object</code></dt>
<dd><p>Default navigation questions for the ViewNavigator class.</p>
</dd>
<dt><a href="#defaultRules">defaultRules</a> : <code>Object</code></dt>
<dd><p>Default validation rules for the Component class.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#oid">oid()</a> ÔçÆ <code>boolean</code></dt>
<dd><p>Method that evaluate if the provided object on &quot;Object(objectToEval)&quot; is a mongoose ObjectID or not.</p>
</dd>
<dt><a href="#+getPath">#getPath(path)</a> ÔçÆ <code>*</code></dt>
<dd><p>Method that that safely gets the values of an object property without throw errors bay an undefined path.</p>
</dd>
<dt><a href="#getObjectPath">getObjectPath(obj, path)</a> ÔçÆ <code>*</code></dt>
<dd><p>Retrieves a value from a nested object based on the specified object path.</p>
</dd>
<dt><a href="#convertToMillis">convertToMillis(value, unit)</a> ÔçÆ <code>number</code></dt>
<dd><p>Converts a numeric value from a specific time unit to milliseconds.</p>
</dd>
<dt><a href="#convertMillisTo">convertMillisTo(value, unit)</a> ÔçÆ <code>number</code></dt>
<dd><p>Converts a numeric value from milliseconds to a specific time unit.</p>
</dd>
<dt><a href="#isCollectionExist">isCollectionExist(collection)</a> ÔçÆ <code>string</code> | <code>undefined</code></dt>
<dd><p>Checks if a collection exists in the MongoDB database.</p>
</dd>
<dt><a href="#isDocExist">isDocExist(collectionName, filter)</a> ÔçÆ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Checks if a document exists in a specific collection based on the provided filter.</p>
</dd>
<dt><a href="#getCollectionModel">getCollectionModel(collection)</a> ÔçÆ <code>Model</code></dt>
<dd><p>Retrieves the Mongoose model for a given collection name.</p>
</dd>
<dt><a href="#createCounter">createCounter(collection)</a></dt>
<dd><p>Creates a counter document for a specific collection if it does not already exist.</p>
</dd>
<dt><a href="#increaseCounter">increaseCounter(collection)</a> ÔçÆ <code>Object</code></dt>
<dd><p>Increases the counter value for a specific collection and returns the updated counter object.</p>
</dd>
<dt><a href="#increaseLog">increaseLog(logUID)</a> ÔçÆ <code>Object</code></dt>
<dd><p>Increases the &#39;groupedLogs&#39; property of a specific log document and returns the updated log object.</p>
</dd>
<dt><a href="#increaseDocProp">increaseDocProp(collectionName, filter, data)</a> ÔçÆ <code>Object</code></dt>
<dd><p>Increases specified properties of a document based on the provided filter and data object.</p>
</dd>
<dt><a href="#pickQueryType">pickQueryType(filter, type)</a> ÔçÆ <code>string</code></dt>
<dd><p>Determines the type of query based on the provided filter and the desired query type.</p>
</dd>
<dt><a href="#treatFilter">treatFilter(filter)</a> ÔçÆ <code>Object</code></dt>
<dd><p>Validates and transforms a filter object to a format suitable for querying the database.</p>
</dd>
<dt><a href="#findRelFields">findRelFields(schema, exclude, levels, currentLevel)</a> ÔçÆ <code>Array</code></dt>
<dd><p>Finds and returns fields in a Mongoose schema that are references to other schemas.</p>
</dd>
<dt><a href="#createEncryptFields">createEncryptFields(context)</a> ÔçÆ <code>Object</code></dt>
<dd><p>Encrypts specified fields in the given context object and adds encrypted values to the context of Mongoose Event.</p>
</dd>
<dt><a href="#updateEncryptFields">updateEncryptFields(context)</a></dt>
<dd><p>Updates encrypted fields in the given context object with new encrypted values of Mongoose Event.</p>
</dd>
<dt><a href="#preSave">preSave(next)</a></dt>
<dd><p>Middleware function executed before saving a document.
Increments the counter for the current collection and sets index and cod fields.</p>
</dd>
<dt><a href="#preUpdateOne">preUpdateOne(next)</a></dt>
<dd><p>Middleware function executed before updating a single document.
Updates the modifiedAt timestamp and handles relational updates.</p>
</dd>
<dt><a href="#postUpdateOne">postUpdateOne()</a></dt>
<dd><p>Middleware function executed after updating a single document.
Emits events based on the updated document&#39;s status and filter.</p>
</dd>
<dt><a href="#postSave">postSave()</a></dt>
<dd><p>Middleware function executed after saving a document.
Handles relational updates and emits a create event for the collection.</p>
</dd>
<dt><a href="#preDelete">preDelete(next)</a></dt>
<dd><p>Middleware function executed before deleting a document.
Handles relational updates.</p>
</dd>
<dt><a href="#postDelete">postDelete()</a></dt>
<dd><p>Middleware function executed after deleting a document.
Does not perform any specific action.</p>
</dd>
<dt><a href="#readable">readable(options)</a> ÔçÆ <code>Array</code></dt>
<dd><p>A function to make query results readable by converting MongoDB documents to plain JavaScript objects.</p>
</dd>
<dt><a href="#getUpdateProps">getUpdateProps()</a> ÔçÆ <code>Object</code></dt>
<dd><p>Extracts the update properties from the current update operation object.</p>
</dd>
<dt><a href="#paginate">paginate(options)</a> ÔçÆ <code>Object</code></dt>
<dd><p>Paginates query results based on the provided options.</p>
</dd>
<dt><a href="#populateAll">populateAll(options)</a> ÔçÆ <code>Object</code></dt>
<dd><p>Populates all specified relational fields in the query results.</p>
</dd>
<dt><a href="#initialize">initialize(populate)</a> ÔçÆ <code>Array</code> | <code>Object</code></dt>
<dd><p>Initializes query results by converting MongoDB documents to objects.</p>
</dd>
<dt><a href="#onCreate">onCreate()</a> ÔçÆ <code>Array</code></dt>
<dd><p>Handles relational updates when a new document is created.</p>
</dd>
<dt><a href="#onUpdate">onUpdate()</a> ÔçÆ <code>Array</code></dt>
<dd><p>Handles relational updates when an existing document is updated.</p>
</dd>
<dt><a href="#onDelete">onDelete()</a> ÔçÆ <code>Array</code></dt>
<dd><p>Handles relational updates when a document is deleted.</p>
</dd>
<dt><a href="#isObjectID">isObjectID(value)</a> ÔçÆ <code>boolean</code></dt>
<dd><p>Checks if the provided value is an ObjectId or an array of ObjectIds.</p>
</dd>
<dt><a href="#isAuthenticated">isAuthenticated(token)</a> ÔçÆ <code>boolean</code></dt>
<dd><p>Checks if the provided token corresponds to an active authenticated session.</p>
</dd>
<dt><a href="#createUserCLISession">createUserCLISession(user)</a> ÔçÆ <code>Object</code></dt>
<dd><p>Creates or updates a user&#39;s session in the command-line interface (CLI) environment.</p>
</dd>
<dt><a href="#getSessionCurrentUser">getSessionCurrentUser()</a> ÔçÆ <code>string</code> | <code>undefined</code></dt>
<dd><p>Retrieves the current user ID from the CLI session.</p>
</dd>
<dt><a href="#repeat">repeat()</a> ÔçÆ <code>Promise</code></dt>
<dd><p>Calls the <code>repeat</code> event and goes back to the current question.</p>
</dd>
<dt><a href="#setListener">setListener(eventName)</a> ÔçÆ <code>void</code></dt>
<dd><p>Sets a new listener for the provided address</p>
</dd>
<dt><a href="#overrideListener">overrideListener()</a> ÔçÆ <code>Promise</code></dt>
<dd><p>Override a listerner on the PoolForm.</p>
</dd>
<dt><a href="#end">end()</a> ÔçÆ <code>Promise</code></dt>
<dd><p>Calls the <code>end</code> event and goes back to the current question.</p>
</dd>
<dt><a href="#create">create(collectionName, data, [options])</a> ÔçÆ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Creates a new document in the specified collection.</p>
</dd>
<dt><a href="#query">query(setup)</a> ÔçÆ <code>Query</code></dt>
<dd><p>Performs a query on the specified collection based on the provided filter and sort options.</p>
</dd>
<dt><a href="#getDoc">getDoc(setup)</a> ÔçÆ <code>Object</code> | <code>null</code></dt>
<dd><p>Retrieves a single document from the specified collection based on the provided filter.</p>
</dd>
<dt><a href="#update">update(setup)</a> ÔçÆ <code>Promise.&lt;(Object|Array.&lt;Object&gt;)&gt;</code></dt>
<dd><p>Updates documents in the specified collection based on the provided filter and update data.</p>
</dd>
<dt><a href="#del">del(setup)</a> ÔçÆ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Deletes documents from the specified collection based on the provided filter and delete type.</p>
</dd>
<dt><a href="#build">build(value)</a> ÔçÆ <code><a href="#ValidationBase">ValidationBase</a></code></dt>
<dd><p>Factory function to create a ValidationBase instance for a specific value.</p>
</dd>
</dl>

<a name="module_FormCtrlCLI"></a>

## FormCtrlCLI
Represents a handler for events related to a form.

<a name="module_NavigatorOption"></a>

## NavigatorOption
Model of option for the ViewNavigator class.

<a name="module_EventsHandlers"></a>

## EventsHandlers
Represents a handler for events related to a form.

<a name="module_PoolForm"></a>

## PoolForm
A class representing a form that contains a pool of questions.

<a name="module_QuestionModel"></a>

## QuestionModel
A class for Question used on PoolForm of CLI Interface

<a name="module_ToolsCLI"></a>

## ToolsCLI
A set of utility tools for the command-line interface.

<a name="module_ViewCLI"></a>

## ViewCLI
A command-line interface view with navigation capabilities.

<a name="module_DataDependency"></a>

## DataDependency
Represents a data dependency used to manage real-time data updates and rendering in a parent component.


* [DataDependency](#module_DataDependency)
    * [~DataDependency](#module_DataDependency..DataDependency)
        * [new DataDependency(setup, parent)](#new_module_DataDependency..DataDependency_new)
        * [.parent](#module_DataDependency..DataDependency+parent) ÔçÆ <code>Object</code>
        * [.addSocketUpdateListener(socketConnection, subsUID)](#module_DataDependency..DataDependency+addSocketUpdateListener)
        * [.updateComponentHandler(ev, socketConnection, subsUID)](#module_DataDependency..DataDependency+updateComponentHandler)
        * [.load()](#module_DataDependency..DataDependency+load) ÔçÆ <code>Object</code> \| <code>Array</code>

<a name="module_DataDependency..DataDependency"></a>

### DataDependency~DataDependency
**Kind**: inner class of [<code>DataDependency</code>](#module_DataDependency)  

* [~DataDependency](#module_DataDependency..DataDependency)
    * [new DataDependency(setup, parent)](#new_module_DataDependency..DataDependency_new)
    * [.parent](#module_DataDependency..DataDependency+parent) ÔçÆ <code>Object</code>
    * [.addSocketUpdateListener(socketConnection, subsUID)](#module_DataDependency..DataDependency+addSocketUpdateListener)
    * [.updateComponentHandler(ev, socketConnection, subsUID)](#module_DataDependency..DataDependency+updateComponentHandler)
    * [.load()](#module_DataDependency..DataDependency+load) ÔçÆ <code>Object</code> \| <code>Array</code>

<a name="new_module_DataDependency..DataDependency_new"></a>

#### new DataDependency(setup, parent)
Constructs a DataDependency instance.

**Throws**:

- <code>Error</code> - Throws an error if the setup object is not valid.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing name, type, collectionName, and filter properties. |
| parent | <code>Object</code> | The parent component associated with this data dependency. |

<a name="module_DataDependency..DataDependency+parent"></a>

#### dataDependency.parent ÔçÆ <code>Object</code>
Gets the parent component associated with this data dependency.

**Kind**: instance property of [<code>DataDependency</code>](#module_DataDependency..DataDependency)  
**Returns**: <code>Object</code> - - The parent component object.  
<a name="module_DataDependency..DataDependency+addSocketUpdateListener"></a>

#### dataDependency.addSocketUpdateListener(socketConnection, subsUID)
Adds a socket update listener for real-time data updates.

**Kind**: instance method of [<code>DataDependency</code>](#module_DataDependency..DataDependency)  

| Param | Type | Description |
| --- | --- | --- |
| socketConnection | <code>Object</code> | The socket connection object. |
| subsUID | <code>string</code> | The unique identifier for the subscription. |

<a name="module_DataDependency..DataDependency+updateComponentHandler"></a>

#### dataDependency.updateComponentHandler(ev, socketConnection, subsUID)
Handles real-time component updates and emits the updated component data to the client.

**Kind**: instance method of [<code>DataDependency</code>](#module_DataDependency..DataDependency)  
**Throws**:

- <code>Error</code> - Throws an error if an update operation fails.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>Object</code> | The event object containing update information. |
| socketConnection | <code>Object</code> | The socket connection object. |
| subsUID | <code>string</code> | The unique identifier for the subscription. |

<a name="module_DataDependency..DataDependency+load"></a>

#### dataDependency.load() ÔçÆ <code>Object</code> \| <code>Array</code>
Loads data based on the data dependency type (doc or list).

**Kind**: instance method of [<code>DataDependency</code>](#module_DataDependency..DataDependency)  
**Returns**: <code>Object</code> \| <code>Array</code> - - The loaded data object or array.  
**Throws**:

- <code>Error</code> - Throws an error if the data loading fails.

<a name="module_SafeValuesCollection"></a>

## SafeValuesCollection
Represents a Collection model for storing encrypted data.
Defines the schema for 'safe_values' collection, specifying fields for encrypted data along with their types and constraints.

<a name="module_AuthService"></a>

## AuthService
Class representing an authentication service for handling user authentication and authorization.

<a name="FormCtrlCLI"></a>

## FormCtrlCLI
A class representing a command-line interface for form control.

**Kind**: global class  

* [FormCtrlCLI](#FormCtrlCLI)
    * [new FormCtrlCLI([setup], parent)](#new_FormCtrlCLI_new)
    * [.setField(key, value)](#FormCtrlCLI+setField)
    * [.buildFormData()](#FormCtrlCLI+buildFormData) ÔçÆ <code>Object</code>
    * [.setSchema(schema)](#FormCtrlCLI+setSchema)
    * [.getFieldSchema(path)](#FormCtrlCLI+getFieldSchema) ÔçÆ <code>\*</code>
    * [.setForm(schema)](#FormCtrlCLI+setForm) ÔçÆ <code>void</code>

<a name="new_FormCtrlCLI_new"></a>

### new FormCtrlCLI([setup], parent)
Creates an instance of FormCtrlCLI.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [setup] | <code>Object</code> |  | The setup options for the form control CLI. |
| [setup.mode] | <code>string</code> | <code>&quot;&#x27;create&#x27;&quot;</code> | The mode of the form control CLI ('edit' or 'create'). |
| [setup.schema] | <code>Object</code> | <code>{}</code> | The schema for the form control CLI. |
| [setup.defaultData] | <code>Object</code> | <code>{}</code> | The default data for the form control CLI. |
| [setup.exclude] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | The list of fields to exclude from the form control CLI. |
| parent | <code>Object</code> |  | The parent object of the form control CLI. |

<a name="FormCtrlCLI+setField"></a>

### formCtrlCLI.setField(key, value)
Sets a field in the form data.

**Kind**: instance method of [<code>FormCtrlCLI</code>](#FormCtrlCLI)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key of the field to set. |
| value | <code>any</code> | The value to set for the field. |

<a name="FormCtrlCLI+buildFormData"></a>

### formCtrlCLI.buildFormData() ÔçÆ <code>Object</code>
Builds the form data for the form control CLI.

**Kind**: instance method of [<code>FormCtrlCLI</code>](#FormCtrlCLI)  
**Returns**: <code>Object</code> - The form data for the form control CLI.  
<a name="FormCtrlCLI+setSchema"></a>

### formCtrlCLI.setSchema(schema)
Sets the schema for the form control CLI.

**Kind**: instance method of [<code>FormCtrlCLI</code>](#FormCtrlCLI)  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Object</code> | The schema to set. |

<a name="FormCtrlCLI+getFieldSchema"></a>

### formCtrlCLI.getFieldSchema(path) ÔçÆ <code>\*</code>
Get the field schema.

**Kind**: instance method of [<code>FormCtrlCLI</code>](#FormCtrlCLI)  
**Returns**: <code>\*</code> - - The field schema.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path of the field schema. |

<a name="FormCtrlCLI+setForm"></a>

### formCtrlCLI.setForm(schema) ÔçÆ <code>void</code>
Set a new form on the the PoolForm

**Kind**: instance method of [<code>FormCtrlCLI</code>](#FormCtrlCLI)  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Object</code> | The schema object to set |

<a name="ScreenHelperCLI"></a>

## ScreenHelperCLI
Class representing a command-line interface screen helper.

**Kind**: global class  

* [ScreenHelperCLI](#ScreenHelperCLI)
    * [.screenPixelWitdh()](#ScreenHelperCLI+screenPixelWitdh) ÔçÆ <code>number</code>
    * [.screenCharWitdh([charWidthInPixels])](#ScreenHelperCLI+screenCharWitdh) ÔçÆ <code>number</code>
    * [.pixelToChar(pixels, [charWidthInPixels])](#ScreenHelperCLI+pixelToChar) ÔçÆ <code>number</code>
    * [.percentToChar(percent, [charWidthInPixels])](#ScreenHelperCLI+percentToChar) ÔçÆ <code>number</code>

<a name="ScreenHelperCLI+screenPixelWitdh"></a>

### screenHelperCLI.screenPixelWitdh() ÔçÆ <code>number</code>
Get the screen pixel width.

**Kind**: instance method of [<code>ScreenHelperCLI</code>](#ScreenHelperCLI)  
**Returns**: <code>number</code> - The screen pixel width.  
**Throws**:

- <code>Error.Log</code> If an error occurs while executing the command.

<a name="ScreenHelperCLI+screenCharWitdh"></a>

### screenHelperCLI.screenCharWitdh([charWidthInPixels]) ÔçÆ <code>number</code>
Get the screen character width.

**Kind**: instance method of [<code>ScreenHelperCLI</code>](#ScreenHelperCLI)  
**Returns**: <code>number</code> - The screen character width.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [charWidthInPixels] | <code>number</code> | <code>this.charWidthInPixels</code> | The character width in pixels. |

<a name="ScreenHelperCLI+pixelToChar"></a>

### screenHelperCLI.pixelToChar(pixels, [charWidthInPixels]) ÔçÆ <code>number</code>
Convert pixels to characters.

**Kind**: instance method of [<code>ScreenHelperCLI</code>](#ScreenHelperCLI)  
**Returns**: <code>number</code> - The number of characters.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pixels | <code>number</code> |  | The number of pixels to convert. |
| [charWidthInPixels] | <code>number</code> | <code>this.charWidthInPixels</code> | The character width in pixels. |

<a name="ScreenHelperCLI+percentToChar"></a>

### screenHelperCLI.percentToChar(percent, [charWidthInPixels]) ÔçÆ <code>number</code>
Convert percent to characters.

**Kind**: instance method of [<code>ScreenHelperCLI</code>](#ScreenHelperCLI)  
**Returns**: <code>number</code> - The number of characters.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| percent | <code>number</code> |  | The percent to convert. |
| [charWidthInPixels] | <code>number</code> | <code>this.charWidthInPixels</code> | The character width in pixels. |

<a name="CLI"></a>

## CLI ÔçÉ [<code>ToolsCLI</code>](#ToolsCLI)
Class representing a Command Line Interface (CLI) application.

**Kind**: global class  
**Extends**: [<code>ToolsCLI</code>](#ToolsCLI)  

* [CLI](#CLI) ÔçÉ [<code>ToolsCLI</code>](#ToolsCLI)
    * [new CLI(setup)](#new_CLI_new)
    * [.startView](#CLI+startView) : <code>string</code>
    * [.startViewParams](#CLI+startViewParams) : <code>Object</code>
    * [.StringBuilder](#ToolsCLI+StringBuilder) : [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.getCurrentView()](#CLI+getCurrentView) ÔçÆ <code>string</code>
    * [.init()](#CLI+init) ÔçÆ [<code>CLI</code>](#CLI)
    * [.setCurrentView(viewName)](#CLI+setCurrentView) ÔçÆ <code>string</code>
    * [.loadView(viewPath, viewParams)](#CLI+loadView) ÔçÆ <code>View</code>
    * [.goToStart()](#CLI+goToStart) ÔçÆ <code>View</code>
    * [.print(txt, [addHeader])](#ToolsCLI+print)
    * [.printError(err)](#ToolsCLI+printError)
    * [.printTemplate(stringContent)](#ToolsCLI+printTemplate)
    * [.printTable(data, [options])](#ToolsCLI+printTable)
    * [.boolAnswer(a, [strict])](#ToolsCLI+boolAnswer) ÔçÆ <code>boolean</code>

<a name="new_CLI_new"></a>

### new CLI(setup)
Creates an instance of CLI.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup configuration for the CLI. |
| setup.startView | <code>string</code> | The initial view to be displayed upon CLI initialization. |
| setup.startViewParams | <code>Object</code> | The parameters to be passed to the initial view. |

<a name="CLI+startView"></a>

### clI.startView : <code>string</code>
The name of the initial view to be displayed upon CLI initialization.

**Kind**: instance property of [<code>CLI</code>](#CLI)  
<a name="CLI+startViewParams"></a>

### clI.startViewParams : <code>Object</code>
The parameters to be passed to the initial view.

**Kind**: instance property of [<code>CLI</code>](#CLI)  
<a name="ToolsCLI+StringBuilder"></a>

### clI.StringBuilder : [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
The StringTemplateBuilder instance used for constructing string templates.

**Kind**: instance property of [<code>CLI</code>](#CLI)  
**Overrides**: [<code>StringBuilder</code>](#ToolsCLI+StringBuilder)  
<a name="CLI+getCurrentView"></a>

### clI.getCurrentView() ÔçÆ <code>string</code>
Gets the name of the current view.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Returns**: <code>string</code> - The name of the current view.  
<a name="CLI+init"></a>

### clI.init() ÔçÆ [<code>CLI</code>](#CLI)
Initializes the CLI application by loading the initial view.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Returns**: [<code>CLI</code>](#CLI) - The CLI instance.  
<a name="CLI+setCurrentView"></a>

### clI.setCurrentView(viewName) ÔçÆ <code>string</code>
Sets the current view of the CLI application.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Returns**: <code>string</code> - The name of the current view.  

| Param | Type | Description |
| --- | --- | --- |
| viewName | <code>string</code> | The name of the view to set as the current view. |

<a name="CLI+loadView"></a>

### clI.loadView(viewPath, viewParams) ÔçÆ <code>View</code>
Loads a specific view into the CLI application.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Returns**: <code>View</code> - The loaded view instance.  
**Throws**:

- <code>Error.Log</code> If the specified view path is not found.


| Param | Type | Description |
| --- | --- | --- |
| viewPath | <code>string</code> | The path to the view module. |
| viewParams | <code>Object</code> | The parameters to be passed to the view. |

<a name="CLI+goToStart"></a>

### clI.goToStart() ÔçÆ <code>View</code>
Navigates back to the initial view of the CLI application.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Returns**: <code>View</code> - The loaded initial view instance.  
<a name="ToolsCLI+print"></a>

### clI.print(txt, [addHeader])
Prints a message to the console with optional header and project name.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Overrides**: [<code>print</code>](#ToolsCLI+print)  

| Param | Type | Description |
| --- | --- | --- |
| txt | <code>string</code> | The text to be printed. |
| [addHeader] | <code>string</code> | The optional header to be added to the message. |

<a name="ToolsCLI+printError"></a>

### clI.printError(err)
Prints an error message to the console, including error name, message, and stack trace.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Overrides**: [<code>printError</code>](#ToolsCLI+printError)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error object to be printed. |

<a name="ToolsCLI+printTemplate"></a>

### clI.printTemplate(stringContent)
Prints a string template content to the console.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Overrides**: [<code>printTemplate</code>](#ToolsCLI+printTemplate)  

| Param | Type | Description |
| --- | --- | --- |
| stringContent | <code>string</code> | The string template content to be printed. |

<a name="ToolsCLI+printTable"></a>

### clI.printTable(data, [options])
Prints tabular data to the console as a table.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Overrides**: [<code>printTable</code>](#ToolsCLI+printTable)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to be displayed in the table. |
| [options] | <code>Object</code> | Additional options for printing the table, including headers. |

<a name="ToolsCLI+boolAnswer"></a>

### clI.boolAnswer(a, [strict]) ÔçÆ <code>boolean</code>
Converts a user input to a boolean value, considering 'y' or 'n' as affirmative and negative answers, respectively.

**Kind**: instance method of [<code>CLI</code>](#CLI)  
**Overrides**: [<code>boolAnswer</code>](#ToolsCLI+boolAnswer)  
**Returns**: <code>boolean</code> - The boolean value based on the user input.  
**Throws**:

- <code>Error.Log</code> When strict mode is enabled and the input is not 'y' or 'n'.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | <code>string</code> |  | The user input to be converted to a boolean value ('y' or 'n'). |
| [strict] | <code>boolean</code> | <code>false</code> | If set to true, strict mode requires 'y' or 'n' input only. |

<a name="NavigatorOption"></a>

## NavigatorOption
Model representing an option for the ViewNavigator class, extended by the ToolsCLI class.

**Kind**: global class  

* [NavigatorOption](#NavigatorOption)
    * [new NavigatorOption(setup, viewNavigator)](#new_NavigatorOption_new)
    * [.index](#NavigatorOption+index) : <code>string</code>
    * [.type](#NavigatorOption+type) : <code>string</code>
    * [.title](#NavigatorOption+title) : <code>string</code>
    * [.description](#NavigatorOption+description) : <code>string</code>
    * [.targetView](#NavigatorOption+targetView) : <code>string</code>
    * [.viewParams](#NavigatorOption+viewParams) : <code>Object</code>
    * [.trigger](#NavigatorOption+trigger) : <code>function</code>
    * [.defaultData](#NavigatorOption+defaultData) : <code>Object</code>
    * [.doc](#NavigatorOption+doc) : <code>Object</code>
    * [.displayName](#NavigatorOption+displayName) : <code>string</code>
    * [.docUID](#NavigatorOption+docUID) : <code>string</code>
    * [.viewNavigator](#NavigatorOption+viewNavigator) : [<code>ViewNavigator</code>](#ViewNavigator)

<a name="new_NavigatorOption_new"></a>

### new NavigatorOption(setup, viewNavigator)
Creates an instance of NavigatorOption.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The configuration object for the NavigatorOption. |
| setup.index | <code>number</code> \| <code>string</code> | The index that triggers the navigation option on user input. |
| setup.type | <code>string</code> | The type of the option: 'nav' for navigation or 'doc-list' for document listing. |
| setup.title | <code>string</code> | The title displayed as the label of the navigation option. |
| setup.description | <code>string</code> | The description displayed as the label of the navigation option. |
| setup.targetView | <code>string</code> | The path of the view to be opened, e.g., "crud/create". |
| setup.viewParams | <code>Object</code> | Parameters to be passed when the selected view is loaded. |
| setup.defaultData | <code>Object</code> | Data loaded as a parameter when the selected view is loaded. |
| setup.trigger | <code>function</code> | A function triggered when the option is selected. |
| setup.doc | <code>Object</code> | The document to be loaded when type is 'doc-list'. |
| viewNavigator | <code>function</code> | A function returning the ViewNavigator instance. |

<a name="NavigatorOption+index"></a>

### navigatorOption.index : <code>string</code>
The index that triggers the navigation option on user input.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
<a name="NavigatorOption+type"></a>

### navigatorOption.type : <code>string</code>
The type of the option: 'nav' for navigation or 'doc-list' for document listing.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
**Default**: <code>&quot;&#x27;nav&#x27;&quot;</code>  
<a name="NavigatorOption+title"></a>

### navigatorOption.title : <code>string</code>
The title displayed as the label of the navigation option.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
<a name="NavigatorOption+description"></a>

### navigatorOption.description : <code>string</code>
The description displayed as the label of the navigation option.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
<a name="NavigatorOption+targetView"></a>

### navigatorOption.targetView : <code>string</code>
The path of the view to be opened, e.g., "crud/create".

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
<a name="NavigatorOption+viewParams"></a>

### navigatorOption.viewParams : <code>Object</code>
Parameters to be passed when the selected view is loaded.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
<a name="NavigatorOption+trigger"></a>

### navigatorOption.trigger : <code>function</code>
A function triggered when the option is selected.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
<a name="NavigatorOption+defaultData"></a>

### navigatorOption.defaultData : <code>Object</code>
Data loaded as a parameter when the selected view is loaded.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
<a name="NavigatorOption+doc"></a>

### navigatorOption.doc : <code>Object</code>
The document to be loaded when type is 'doc-list'.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
<a name="NavigatorOption+displayName"></a>

### navigatorOption.displayName : <code>string</code>
Gets the combined display name of the option, including title and description.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
**Read only**: true  
<a name="NavigatorOption+docUID"></a>

### navigatorOption.docUID : <code>string</code>
Gets the unique identifier of the associated document when the option type is 'doc-list'.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
**Read only**: true  
<a name="NavigatorOption+viewNavigator"></a>

### navigatorOption.viewNavigator : [<code>ViewNavigator</code>](#ViewNavigator)
Gets the ViewNavigator instance associated with this option.

**Kind**: instance property of [<code>NavigatorOption</code>](#NavigatorOption)  
**Read only**: true  
<a name="EventsHandlers"></a>

## EventsHandlers
Represents a handler for events related to a form.

**Kind**: global class  

* [EventsHandlers](#EventsHandlers)
    * [new EventsHandlers([setup])](#new_EventsHandlers_new)
    * [.triggerEvent(eventName, ...args)](#EventsHandlers+triggerEvent)
    * [.start(ev)](#EventsHandlers+start) ÔçÆ <code>\*</code>
    * [.trigger(ev)](#EventsHandlers+trigger) ÔçÆ <code>\*</code>
    * [.next(ev)](#EventsHandlers+next) ÔçÆ <code>\*</code>
    * [.back(ev)](#EventsHandlers+back) ÔçÆ <code>\*</code>
    * [.repeat(ev)](#EventsHandlers+repeat) ÔçÆ <code>\*</code>
    * [.answer(ev)](#EventsHandlers+answer) ÔçÆ <code>\*</code>
    * [.error(ev, err)](#EventsHandlers+error) ÔçÆ <code>Promise.&lt;any&gt;</code>
    * [.end(ev)](#EventsHandlers+end) ÔçÆ <code>Promise.&lt;any&gt;</code>

<a name="new_EventsHandlers_new"></a>

### new EventsHandlers([setup])
Creates an instance of EventsHandlers.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [setup] | <code>Object</code> |  | The configuration for the instance. |
| [setup.onStart] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when the form starts. |
| [setup.onTrigger] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when an event is triggered. |
| [setup.onNext] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when the user goes to the next question. |
| [setup.onBack] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when the user goes back to the previous question. |
| [setup.onChange] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when the user changes an answer. |
| [setup.onRepeat] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when the user wants to repeat a question. |
| [setup.onAnswer] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when the user provides an answer. |
| [setup.onError] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when an error occurs. |
| [setup.onEnd] | <code>function</code> | <code>async () &#x3D;&gt; {}</code> | The function to be called when the form ends. |

<a name="EventsHandlers+triggerEvent"></a>

### eventsHandlers.triggerEvent(eventName, ...args)
Triggers a specified event with optional parameters.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Throws**:

- <code>Error.Log</code> - If an error occurs while handling the event.


| Param | Type | Description |
| --- | --- | --- |
| eventName | [<code>QuestionModel</code>](#QuestionModel) | The Question event that triggered the event |
| ...args | <code>\*</code> | The event name and any optional parameters. |

<a name="EventsHandlers+start"></a>

### eventsHandlers.start(ev) ÔçÆ <code>\*</code>
Starts the event and returns the event object.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Returns**: <code>\*</code> - - The event object.  
**Throws**:

- <code>Error.Log</code> - If an error occurs while handling the event.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>\*</code> | The event object. |

<a name="EventsHandlers+trigger"></a>

### eventsHandlers.trigger(ev) ÔçÆ <code>\*</code>
Triggers the event and returns the event object.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Returns**: <code>\*</code> - - The event object.  
**Throws**:

- <code>Error.Log</code> - If an error occurs while handling the event.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>\*</code> | The event object. |

<a name="EventsHandlers+next"></a>

### eventsHandlers.next(ev) ÔçÆ <code>\*</code>
Triggers the "next" event and returns the event object.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Returns**: <code>\*</code> - - The event object.  
**Throws**:

- <code>Error.Log</code> - If an error occurs while handling the event.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>\*</code> | The event object. |

<a name="EventsHandlers+back"></a>

### eventsHandlers.back(ev) ÔçÆ <code>\*</code>
Triggers the "back" event and logs a message to the console.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Returns**: <code>\*</code> - - The event object.  
**Throws**:

- <code>Error.Log</code> - If an error occurs while handling the event.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>\*</code> | The event object. |

<a name="EventsHandlers+repeat"></a>

### eventsHandlers.repeat(ev) ÔçÆ <code>\*</code>
Triggers the "repeat" event and logs a message to the console.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Returns**: <code>\*</code> - - The event object.  
**Throws**:

- <code>Error.Log</code> - If an error occurs while handling the event.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>\*</code> | The event object. |

<a name="EventsHandlers+answer"></a>

### eventsHandlers.answer(ev) ÔçÆ <code>\*</code>
Handles the "answer" event and returns the event object.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Returns**: <code>\*</code> - - The event object.  
**Throws**:

- <code>Error.Log</code> - If an error occurs while handling the event.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>\*</code> | The event object. |

<a name="EventsHandlers+error"></a>

### eventsHandlers.error(ev, err) ÔçÆ <code>Promise.&lt;any&gt;</code>
Handles error event.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Returns**: <code>Promise.&lt;any&gt;</code> - Promise that resolves to the event object if the event was handled successfully.  
**Throws**:

- <code>Error</code> Throws an error if an error occurred while executing the event handler.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>any</code> | The event object. |
| err | <code>Error</code> | The error object. |

<a name="EventsHandlers+end"></a>

### eventsHandlers.end(ev) ÔçÆ <code>Promise.&lt;any&gt;</code>
Handles end event.

**Kind**: instance method of [<code>EventsHandlers</code>](#EventsHandlers)  
**Returns**: <code>Promise.&lt;any&gt;</code> - Promise that resolves to the event object if the event was handled successfully.  
**Throws**:

- <code>Error</code> Throws an error if an error occurred while executing the event handler.


| Param | Type | Description |
| --- | --- | --- |
| ev | <code>any</code> | The event object. |

<a name="PoolForm"></a>

## PoolForm
Represents a form controller for a pool of questions.

**Kind**: global class  

* [PoolForm](#PoolForm)
    * [new PoolForm(setup, view)](#new_PoolForm_new)
    * [.getQuestion(id)](#PoolForm+getQuestion) ÔçÆ [<code>QuestionModel</code>](#QuestionModel)
    * [.getFirstQuestion()](#PoolForm+getFirstQuestion) ÔçÆ [<code>QuestionModel</code>](#QuestionModel)
    * [.setQuestion([setup])](#PoolForm+setQuestion)
    * [.startPool()](#PoolForm+startPool) ÔçÆ <code>Object</code>
    * [.getValue(keyPath)](#PoolForm+getValue) ÔçÆ <code>\*</code>
    * [.setValue(keyPath, value, [override])](#PoolForm+setValue)
    * [.start()](#PoolForm+start)
    * [.next()](#PoolForm+next) ÔçÆ <code>\*</code>
    * [.back()](#PoolForm+back) ÔçÆ <code>\*</code>
    * [.goTo(questionID)](#PoolForm+goTo)
    * [.goToView(viewPath, [params])](#PoolForm+goToView)

<a name="new_PoolForm_new"></a>

### new PoolForm(setup, view)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| setup | <code>Object</code> |  | The setup configuration for the form. |
| [setup.startQuestion] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The ID of the first question. |
| [setup.questions] | [<code>Array.&lt;QuestionModel&gt;</code>](#QuestionModel) | <code>[]</code> | The list of questions to be used in the form. |
| [setup.events] | [<code>EventsHandlers</code>](#EventsHandlers) | <code>{}</code> | The event handlers for the form. |
| [setup.values] | <code>Object</code> | <code>{}</code> | The default values for the form fields. |
| [setup.autoSaveAnswers] | <code>Boolean</code> | <code>false</code> | The default values for the form fields. |
| view | <code>Object</code> |  | The view object for the form. |

<a name="PoolForm+getQuestion"></a>

### poolForm.getQuestion(id) ÔçÆ [<code>QuestionModel</code>](#QuestionModel)
Returns the question object with the specified ID.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID of the question. |

<a name="PoolForm+getFirstQuestion"></a>

### poolForm.getFirstQuestion() ÔçÆ [<code>QuestionModel</code>](#QuestionModel)
Returns the first question object on the this.questions array list.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  
<a name="PoolForm+setQuestion"></a>

### poolForm.setQuestion([setup])
Adds a new question to the list of questions.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  

| Param | Type | Description |
| --- | --- | --- |
| [setup] | [<code>QuestionModel</code>](#QuestionModel) | The setup configuration for the question. |

<a name="PoolForm+startPool"></a>

### poolForm.startPool() ÔçÆ <code>Object</code>
Starts the form and triggers the "start" event.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  
**Returns**: <code>Object</code> - - The form data which is the result of the form filled.  
**Throws**:

- <code>Error</code> - If an error occurs during form execution.

<a name="PoolForm+getValue"></a>

### poolForm.getValue(keyPath) ÔçÆ <code>\*</code>
Retrieves the value at the given key path from the values object.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  
**Returns**: <code>\*</code> - The value at the given key path.  

| Param | Type | Description |
| --- | --- | --- |
| keyPath | <code>string</code> | The dot-separated path to the desired value. |

<a name="PoolForm+setValue"></a>

### poolForm.setValue(keyPath, value, [override])
Sets the value at the given key path in the values object.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| keyPath | <code>string</code> |  | The dot-separated path to the desired value. |
| value | <code>\*</code> |  | The new value to set at the given key path. |
| [override] | <code>boolean</code> | <code>false</code> | Whether to override the existing value(s) at the given key path with the new value. |

<a name="PoolForm+start"></a>

### poolForm.start()
Triggers the start event and goes to the startQuestion question.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  
**Throws**:

- When the start event or the error event thrown by goTo is rejected.

<a name="PoolForm+next"></a>

### poolForm.next() ÔçÆ <code>\*</code>
Triggers the next event and goes to the current.next question.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  
**Returns**: <code>\*</code> - The result of calling goTo with the current.next question ID.  
**Throws**:

- When the next event or the error event thrown by goTo is rejected.

<a name="PoolForm+back"></a>

### poolForm.back() ÔçÆ <code>\*</code>
Triggers the back event and goes to the current.back question.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  
**Returns**: <code>\*</code> - The result of calling goTo with the current.back question ID.  
**Throws**:

- When the back event or the error event thrown by goTo is rejected.

<a name="PoolForm+goTo"></a>

### poolForm.goTo(questionID)
Goes to the question with the given ID and triggers its trigger method.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  
**Throws**:

- When the trigger method of the question is rejected or the given question ID is not valid.


| Param | Type | Description |
| --- | --- | --- |
| questionID | <code>\*</code> | The ID of the question to go to. |

<a name="PoolForm+goToView"></a>

### poolForm.goToView(viewPath, [params])
Goes to the view with the given path and optional parameters.

**Kind**: instance method of [<code>PoolForm</code>](#PoolForm)  

| Param | Type | Description |
| --- | --- | --- |
| viewPath | <code>string</code> | The path to the view to go to. |
| [params] | <code>\*</code> | Optional parameters to pass to the view. |

<a name="QuestionModel"></a>

## QuestionModel
Class representing a question model.

**Kind**: global class  

* [QuestionModel](#QuestionModel)
    * [new QuestionModel(setup, ctrl)](#new_QuestionModel_new)
    * [.tools](#QuestionModel+tools) : [<code>ToolsCLI</code>](#ToolsCLI)
    * [.parentPool](#QuestionModel+parentPool) : [<code>ViewCLI</code>](#ViewCLI)
    * [.setValue(key, value)](#QuestionModel+setValue)
    * [.getValue(key)](#QuestionModel+getValue) ÔçÆ <code>\*</code>
    * [.getQuestion(id)](#QuestionModel+getQuestion) ÔçÆ [<code>QuestionModel</code>](#QuestionModel)
    * [.createPool(setup)](#QuestionModel+createPool) ÔçÆ [<code>PoolForm</code>](#PoolForm)
    * [.goNext()](#QuestionModel+goNext) ÔçÆ <code>\*</code>
    * [.trigger()](#QuestionModel+trigger) ÔçÆ <code>\*</code>
    * [.setListener(eventName, action)](#QuestionModel+setListener)
    * [.overrideListener(eventName, action)](#QuestionModel+overrideListener)

<a name="new_QuestionModel_new"></a>

### new QuestionModel(setup, ctrl)
Create a question model.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object. |
| setup.id | <code>string</code> | The question ID. |
| setup.type | <code>string</code> | The question type (default, form-control). |
| setup.text | <code>string</code> | The question text. |
| setup.required | <code>boolean</code> | Whether the question is required. |
| setup.next | <code>string</code> | The ID of the next question. |
| setup.events | [<code>EventsHandlers</code>](#EventsHandlers) | The events handlers object. |
| setup.formCtrl | [<code>PoolForm</code>](#PoolForm) | The pool form object. |
| ctrl | <code>Object</code> | The control object. |

<a name="QuestionModel+tools"></a>

### questionModel.tools : [<code>ToolsCLI</code>](#ToolsCLI)
The tools object.

**Kind**: instance property of [<code>QuestionModel</code>](#QuestionModel)  
<a name="QuestionModel+parentPool"></a>

### questionModel.parentPool : [<code>ViewCLI</code>](#ViewCLI)
The command-line interface control object.

**Kind**: instance property of [<code>QuestionModel</code>](#QuestionModel)  
<a name="QuestionModel+setValue"></a>

### questionModel.setValue(key, value)
Sets the value of a key.

**Kind**: instance method of [<code>QuestionModel</code>](#QuestionModel)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to set the value for. |
| value | <code>\*</code> | The value to set. |

<a name="QuestionModel+getValue"></a>

### questionModel.getValue(key) ÔçÆ <code>\*</code>
Gets the value of a key.

**Kind**: instance method of [<code>QuestionModel</code>](#QuestionModel)  
**Returns**: <code>\*</code> - The value of the key.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The key to get the value for. |

<a name="QuestionModel+getQuestion"></a>

### questionModel.getQuestion(id) ÔçÆ [<code>QuestionModel</code>](#QuestionModel)
Gets a question by ID.

**Kind**: instance method of [<code>QuestionModel</code>](#QuestionModel)  
**Returns**: [<code>QuestionModel</code>](#QuestionModel) - The question model object.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID of the question to get. |

<a name="QuestionModel+createPool"></a>

### questionModel.createPool(setup) ÔçÆ [<code>PoolForm</code>](#PoolForm)
**Kind**: instance method of [<code>QuestionModel</code>](#QuestionModel)  

| Param | Type | Description |
| --- | --- | --- |
| setup | [<code>PoolForm</code>](#PoolForm) | New PoolForm setup. |

<a name="QuestionModel+goNext"></a>

### questionModel.goNext() ÔçÆ <code>\*</code>
Goes to the next question.

**Kind**: instance method of [<code>QuestionModel</code>](#QuestionModel)  
**Returns**: <code>\*</code> - The next question.  
<a name="QuestionModel+trigger"></a>

### questionModel.trigger() ÔçÆ <code>\*</code>
Triggers the question.

**Kind**: instance method of [<code>QuestionModel</code>](#QuestionModel)  
**Returns**: <code>\*</code> - The result of the question trigger.  
<a name="QuestionModel+setListener"></a>

### questionModel.setListener(eventName, action)
Sets a listener for the specified event.

**Kind**: instance method of [<code>QuestionModel</code>](#QuestionModel)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | The name of the event to set the listener for. |
| action | <code>function</code> | The action to perform when the event is triggered. |

<a name="QuestionModel+overrideListener"></a>

### questionModel.overrideListener(eventName, action)
Overrides the listener for the specified event.

**Kind**: instance method of [<code>QuestionModel</code>](#QuestionModel)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | The name of the event to override the listener for. |
| action | <code>function</code> | The new action to perform when the event is triggered. |

<a name="ToolsCLI"></a>

## ToolsCLI
Class representing a set of utility tools for the command-line interface.

**Kind**: global class  

* [ToolsCLI](#ToolsCLI)
    * [new ToolsCLI()](#new_ToolsCLI_new)
    * [.StringBuilder](#ToolsCLI+StringBuilder) : [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.print(txt, [addHeader])](#ToolsCLI+print)
    * [.printError(err)](#ToolsCLI+printError)
    * [.printTemplate(stringContent)](#ToolsCLI+printTemplate)
    * [.printTable(data, [options])](#ToolsCLI+printTable)
    * [.boolAnswer(a, [strict])](#ToolsCLI+boolAnswer) ÔçÆ <code>boolean</code>

<a name="new_ToolsCLI_new"></a>

### new ToolsCLI()
Creates an instance of ToolsCLI.

<a name="ToolsCLI+StringBuilder"></a>

### toolsCLI.StringBuilder : [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
The StringTemplateBuilder instance used for constructing string templates.

**Kind**: instance property of [<code>ToolsCLI</code>](#ToolsCLI)  
<a name="ToolsCLI+print"></a>

### toolsCLI.print(txt, [addHeader])
Prints a message to the console with optional header and project name.

**Kind**: instance method of [<code>ToolsCLI</code>](#ToolsCLI)  

| Param | Type | Description |
| --- | --- | --- |
| txt | <code>string</code> | The text to be printed. |
| [addHeader] | <code>string</code> | The optional header to be added to the message. |

<a name="ToolsCLI+printError"></a>

### toolsCLI.printError(err)
Prints an error message to the console, including error name, message, and stack trace.

**Kind**: instance method of [<code>ToolsCLI</code>](#ToolsCLI)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error object to be printed. |

<a name="ToolsCLI+printTemplate"></a>

### toolsCLI.printTemplate(stringContent)
Prints a string template content to the console.

**Kind**: instance method of [<code>ToolsCLI</code>](#ToolsCLI)  

| Param | Type | Description |
| --- | --- | --- |
| stringContent | <code>string</code> | The string template content to be printed. |

<a name="ToolsCLI+printTable"></a>

### toolsCLI.printTable(data, [options])
Prints tabular data to the console as a table.

**Kind**: instance method of [<code>ToolsCLI</code>](#ToolsCLI)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to be displayed in the table. |
| [options] | <code>Object</code> | Additional options for printing the table, including headers. |

<a name="ToolsCLI+boolAnswer"></a>

### toolsCLI.boolAnswer(a, [strict]) ÔçÆ <code>boolean</code>
Converts a user input to a boolean value, considering 'y' or 'n' as affirmative and negative answers, respectively.

**Kind**: instance method of [<code>ToolsCLI</code>](#ToolsCLI)  
**Returns**: <code>boolean</code> - The boolean value based on the user input.  
**Throws**:

- <code>Error.Log</code> When strict mode is enabled and the input is not 'y' or 'n'.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | <code>string</code> |  | The user input to be converted to a boolean value ('y' or 'n'). |
| [strict] | <code>boolean</code> | <code>false</code> | If set to true, strict mode requires 'y' or 'n' input only. |

<a name="ViewCLI"></a>

## ViewCLI ÔçÉ [<code>ToolsCLI</code>](#ToolsCLI)
Class representing a command-line interface view with navigation capabilities.

**Kind**: global class  
**Extends**: [<code>ToolsCLI</code>](#ToolsCLI)  

* [ViewCLI](#ViewCLI) ÔçÉ [<code>ToolsCLI</code>](#ToolsCLI)
    * [new ViewCLI([setup], [cli])](#new_ViewCLI_new)
    * [.name](#ViewCLI+name) : <code>string</code>
    * [.Template](#ViewCLI+Template) : [<code>Component</code>](#Component)
    * [.poolForm](#ViewCLI+poolForm) : [<code>PoolForm</code>](#PoolForm)
    * [.navigator](#ViewCLI+navigator) : [<code>ViewNavigator</code>](#ViewNavigator)
    * [.StringBuilder](#ToolsCLI+StringBuilder) : [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.cli()](#ViewCLI+cli) : [<code>CLI</code>](#CLI)
    * [.goToView(viewPath, [params])](#ViewCLI+goToView)
    * [.getString()](#ViewCLI+getString) ÔçÆ <code>string</code>
    * [.render([tableHeaders])](#ViewCLI+render)
    * [.print(txt, [addHeader])](#ToolsCLI+print)
    * [.printError(err)](#ToolsCLI+printError)
    * [.printTemplate(stringContent)](#ToolsCLI+printTemplate)
    * [.printTable(data, [options])](#ToolsCLI+printTable)
    * [.boolAnswer(a, [strict])](#ToolsCLI+boolAnswer) ÔçÆ <code>boolean</code>

<a name="new_ViewCLI_new"></a>

### new ViewCLI([setup], [cli])
Creates an instance of ViewCLI.

**Throws**:

- <code>Error.Log</code> When essential parameters are missing.


| Param | Type | Description |
| --- | --- | --- |
| [setup] | <code>Object</code> | The configuration for the view instance. |
| [setup.name] | <code>string</code> | The name of the view. |
| [setup.poolForm] | [<code>PoolForm</code>](#PoolForm) | The pool form associated with the view. |
| [setup.navigator] | [<code>ViewNavigator</code>](#ViewNavigator) | The view navigator for navigating between views. |
| [setup.Template] | [<code>Component</code>](#Component) | The template component for rendering the view content. |
| [cli] | [<code>CLI</code>](#CLI) | The command-line interface instance. |

<a name="ViewCLI+name"></a>

### viewCLI.name : <code>string</code>
The name of the view.

**Kind**: instance property of [<code>ViewCLI</code>](#ViewCLI)  
<a name="ViewCLI+Template"></a>

### viewCLI.Template : [<code>Component</code>](#Component)
The template component for rendering the view content.

**Kind**: instance property of [<code>ViewCLI</code>](#ViewCLI)  
<a name="ViewCLI+poolForm"></a>

### viewCLI.poolForm : [<code>PoolForm</code>](#PoolForm)
The pool form associated with the view.

**Kind**: instance property of [<code>ViewCLI</code>](#ViewCLI)  
<a name="ViewCLI+navigator"></a>

### viewCLI.navigator : [<code>ViewNavigator</code>](#ViewNavigator)
The view navigator for navigating between views.

**Kind**: instance property of [<code>ViewCLI</code>](#ViewCLI)  
<a name="ToolsCLI+StringBuilder"></a>

### viewCLI.StringBuilder : [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
The StringTemplateBuilder instance used for constructing string templates.

**Kind**: instance property of [<code>ViewCLI</code>](#ViewCLI)  
**Overrides**: [<code>StringBuilder</code>](#ToolsCLI+StringBuilder)  
<a name="ViewCLI+cli"></a>

### viewCLI.cli() : [<code>CLI</code>](#CLI)
The command-line interface instance.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
<a name="ViewCLI+goToView"></a>

### viewCLI.goToView(viewPath, [params])
Navigates to a specific view path with optional parameters.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
**Throws**:

- <code>Error.Log</code> When an error occurs during view navigation.


| Param | Type | Description |
| --- | --- | --- |
| viewPath | <code>string</code> | The path of the view to navigate to. |
| [params] | <code>Object</code> | Additional parameters to be passed to the view. |

<a name="ViewCLI+getString"></a>

### viewCLI.getString() ÔçÆ <code>string</code>
Gets the rendered string content of the view.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
**Returns**: <code>string</code> - The rendered string content of the view.  
<a name="ViewCLI+render"></a>

### viewCLI.render([tableHeaders])
Renders the view, including its content, pool form, and navigator.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
**Throws**:

- <code>Error.Log</code> When an error occurs during view rendering.


| Param | Type | Description |
| --- | --- | --- |
| [tableHeaders] | <code>Object</code> | Additional headers for rendering tabular data. |

<a name="ToolsCLI+print"></a>

### viewCLI.print(txt, [addHeader])
Prints a message to the console with optional header and project name.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
**Overrides**: [<code>print</code>](#ToolsCLI+print)  

| Param | Type | Description |
| --- | --- | --- |
| txt | <code>string</code> | The text to be printed. |
| [addHeader] | <code>string</code> | The optional header to be added to the message. |

<a name="ToolsCLI+printError"></a>

### viewCLI.printError(err)
Prints an error message to the console, including error name, message, and stack trace.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
**Overrides**: [<code>printError</code>](#ToolsCLI+printError)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error object to be printed. |

<a name="ToolsCLI+printTemplate"></a>

### viewCLI.printTemplate(stringContent)
Prints a string template content to the console.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
**Overrides**: [<code>printTemplate</code>](#ToolsCLI+printTemplate)  

| Param | Type | Description |
| --- | --- | --- |
| stringContent | <code>string</code> | The string template content to be printed. |

<a name="ToolsCLI+printTable"></a>

### viewCLI.printTable(data, [options])
Prints tabular data to the console as a table.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
**Overrides**: [<code>printTable</code>](#ToolsCLI+printTable)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to be displayed in the table. |
| [options] | <code>Object</code> | Additional options for printing the table, including headers. |

<a name="ToolsCLI+boolAnswer"></a>

### viewCLI.boolAnswer(a, [strict]) ÔçÆ <code>boolean</code>
Converts a user input to a boolean value, considering 'y' or 'n' as affirmative and negative answers, respectively.

**Kind**: instance method of [<code>ViewCLI</code>](#ViewCLI)  
**Overrides**: [<code>boolAnswer</code>](#ToolsCLI+boolAnswer)  
**Returns**: <code>boolean</code> - The boolean value based on the user input.  
**Throws**:

- <code>Error.Log</code> When strict mode is enabled and the input is not 'y' or 'n'.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | <code>string</code> |  | The user input to be converted to a boolean value ('y' or 'n'). |
| [strict] | <code>boolean</code> | <code>false</code> | If set to true, strict mode requires 'y' or 'n' input only. |

<a name="ViewNavigator"></a>

## ViewNavigator ÔçÉ [<code>ToolsCLI</code>](#ToolsCLI)
Class representing a view navigator with navigation options.

**Kind**: global class  
**Extends**: [<code>ToolsCLI</code>](#ToolsCLI)  

* [ViewNavigator](#ViewNavigator) ÔçÉ [<code>ToolsCLI</code>](#ToolsCLI)
    * [new ViewNavigator([setup], parentView)](#new_ViewNavigator_new)
    * [.type](#ViewNavigator+type) : <code>string</code>
    * [.options](#ViewNavigator+options) : <code>Array</code>
    * [.question](#ViewNavigator+question) : <code>Object</code>
    * [.navSuccessCallback](#ViewNavigator+navSuccessCallback) : <code>function</code>
    * [.navErrorCallback](#ViewNavigator+navErrorCallback) : <code>function</code>
    * [.parentView](#ViewNavigator+parentView) ÔçÆ [<code>ViewCLI</code>](#ViewCLI)
    * [.StringBuilder](#ToolsCLI+StringBuilder) : [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [._parentView()](#ViewNavigator+_parentView) : [<code>ViewCLI</code>](#ViewCLI)
    * [.navTo(index, [params])](#ViewNavigator+navTo)
    * [.getOption(index)](#ViewNavigator+getOption) ÔçÆ [<code>NavigatorOption</code>](#NavigatorOption)
    * [.addOption(data)](#ViewNavigator+addOption) ÔçÆ [<code>ViewNavigator</code>](#ViewNavigator)
    * [.setOption(index, data, [override])](#ViewNavigator+setOption)
    * [.render([params])](#ViewNavigator+render) ÔçÆ <code>string</code>
    * [.fire([params])](#ViewNavigator+fire) ÔçÆ <code>Promise</code>
    * [.print(txt, [addHeader])](#ToolsCLI+print)
    * [.printError(err)](#ToolsCLI+printError)
    * [.printTemplate(stringContent)](#ToolsCLI+printTemplate)
    * [.printTable(data, [options])](#ToolsCLI+printTable)
    * [.boolAnswer(a, [strict])](#ToolsCLI+boolAnswer) ÔçÆ <code>boolean</code>

<a name="new_ViewNavigator_new"></a>

### new ViewNavigator([setup], parentView)
Creates an instance of ViewNavigator.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [setup] | <code>Object</code> |  | The configuration for the view navigator instance. |
| [setup.type] | <code>string</code> | <code>&quot;&#x27;nav&#x27;&quot;</code> | The type of navigation ('nav' or 'doc-list'). |
| [setup.options] | <code>Array</code> | <code>[]</code> | Array of navigation options. |
| [setup.navSuccessCallback] | <code>function</code> |  | Callback function on successful navigation. |
| [setup.navErrorCallback] | <code>function</code> |  | Callback function on navigation error. |
| [setup.question] | <code>Object</code> |  | Question configuration for prompting user input. |
| parentView | [<code>ViewCLI</code>](#ViewCLI) |  | The parent view associated with this navigator. |

<a name="ViewNavigator+type"></a>

### viewNavigator.type : <code>string</code>
The type of navigation ('nav' or 'doc-list').

**Kind**: instance property of [<code>ViewNavigator</code>](#ViewNavigator)  
<a name="ViewNavigator+options"></a>

### viewNavigator.options : <code>Array</code>
Array of navigation options.

**Kind**: instance property of [<code>ViewNavigator</code>](#ViewNavigator)  
<a name="ViewNavigator+question"></a>

### viewNavigator.question : <code>Object</code>
Question configuration for prompting user input.

**Kind**: instance property of [<code>ViewNavigator</code>](#ViewNavigator)  
<a name="ViewNavigator+navSuccessCallback"></a>

### viewNavigator.navSuccessCallback : <code>function</code>
Callback function on successful navigation.

**Kind**: instance property of [<code>ViewNavigator</code>](#ViewNavigator)  
<a name="ViewNavigator+navErrorCallback"></a>

### viewNavigator.navErrorCallback : <code>function</code>
Callback function on navigation error.

**Kind**: instance property of [<code>ViewNavigator</code>](#ViewNavigator)  
<a name="ViewNavigator+parentView"></a>

### viewNavigator.parentView ÔçÆ [<code>ViewCLI</code>](#ViewCLI)
Retrieves the parent view associated with this navigator.

**Kind**: instance property of [<code>ViewNavigator</code>](#ViewNavigator)  
**Returns**: [<code>ViewCLI</code>](#ViewCLI) - The parent view instance.  
<a name="ToolsCLI+StringBuilder"></a>

### viewNavigator.StringBuilder : [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
The StringTemplateBuilder instance used for constructing string templates.

**Kind**: instance property of [<code>ViewNavigator</code>](#ViewNavigator)  
**Overrides**: [<code>StringBuilder</code>](#ToolsCLI+StringBuilder)  
<a name="ViewNavigator+_parentView"></a>

### viewNavigator.\_parentView() : [<code>ViewCLI</code>](#ViewCLI)
The parent view associated with this navigator.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
<a name="ViewNavigator+navTo"></a>

### viewNavigator.navTo(index, [params])
Navigates to a specific navigation option by its index.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Throws**:

- <code>Error.Log</code> When an error occurs during navigation.


| Param | Type | Description |
| --- | --- | --- |
| index | <code>string</code> | The index of the navigation option to navigate to. |
| [params] | <code>Object</code> | Additional parameters to be passed to the view. |

<a name="ViewNavigator+getOption"></a>

### viewNavigator.getOption(index) ÔçÆ [<code>NavigatorOption</code>](#NavigatorOption)
Retrieves a navigation option by its index.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Returns**: [<code>NavigatorOption</code>](#NavigatorOption) - The navigation option instance.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>string</code> | The index of the navigation option to retrieve. |

<a name="ViewNavigator+addOption"></a>

### viewNavigator.addOption(data) ÔçÆ [<code>ViewNavigator</code>](#ViewNavigator)
Adds a new navigation option to the navigator.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Returns**: [<code>ViewNavigator</code>](#ViewNavigator) - The current ViewNavigator instance.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Data for the new navigation option. |

<a name="ViewNavigator+setOption"></a>

### viewNavigator.setOption(index, data, [override])
Sets or updates an existing navigation option by its index.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| index | <code>string</code> |  | The index of the navigation option to set or update. |
| data | <code>Object</code> |  | Data for the navigation option. |
| [override] | <code>boolean</code> | <code>false</code> | Indicates whether to override the existing option or merge the data. |

<a name="ViewNavigator+render"></a>

### viewNavigator.render([params]) ÔçÆ <code>string</code>
Renders the navigation options and displays them to the user.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Returns**: <code>string</code> - The rendered string output of the navigation options.  
**Throws**:

- <code>Error.Log</code> When an error occurs during rendering.


| Param | Type | Description |
| --- | --- | --- |
| [params] | <code>Object</code> | Additional parameters for rendering. |

<a name="ViewNavigator+fire"></a>

### viewNavigator.fire([params]) ÔçÆ <code>Promise</code>
Prompts user input based on the provided question text and navigates to the chosen option.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Returns**: <code>Promise</code> - A promise resolving to the result of navigation.  
**Throws**:

- <code>Error.Log</code> When an error occurs during navigation.


| Param | Type | Description |
| --- | --- | --- |
| [params] | <code>Object</code> | Additional parameters for rendering and navigation. |

<a name="ToolsCLI+print"></a>

### viewNavigator.print(txt, [addHeader])
Prints a message to the console with optional header and project name.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Overrides**: [<code>print</code>](#ToolsCLI+print)  

| Param | Type | Description |
| --- | --- | --- |
| txt | <code>string</code> | The text to be printed. |
| [addHeader] | <code>string</code> | The optional header to be added to the message. |

<a name="ToolsCLI+printError"></a>

### viewNavigator.printError(err)
Prints an error message to the console, including error name, message, and stack trace.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Overrides**: [<code>printError</code>](#ToolsCLI+printError)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error object to be printed. |

<a name="ToolsCLI+printTemplate"></a>

### viewNavigator.printTemplate(stringContent)
Prints a string template content to the console.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Overrides**: [<code>printTemplate</code>](#ToolsCLI+printTemplate)  

| Param | Type | Description |
| --- | --- | --- |
| stringContent | <code>string</code> | The string template content to be printed. |

<a name="ToolsCLI+printTable"></a>

### viewNavigator.printTable(data, [options])
Prints tabular data to the console as a table.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Overrides**: [<code>printTable</code>](#ToolsCLI+printTable)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to be displayed in the table. |
| [options] | <code>Object</code> | Additional options for printing the table, including headers. |

<a name="ToolsCLI+boolAnswer"></a>

### viewNavigator.boolAnswer(a, [strict]) ÔçÆ <code>boolean</code>
Converts a user input to a boolean value, considering 'y' or 'n' as affirmative and negative answers, respectively.

**Kind**: instance method of [<code>ViewNavigator</code>](#ViewNavigator)  
**Overrides**: [<code>boolAnswer</code>](#ToolsCLI+boolAnswer)  
**Returns**: <code>boolean</code> - The boolean value based on the user input.  
**Throws**:

- <code>Error.Log</code> When strict mode is enabled and the input is not 'y' or 'n'.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| a | <code>string</code> |  | The user input to be converted to a boolean value ('y' or 'n'). |
| [strict] | <code>boolean</code> | <code>false</code> | If set to true, strict mode requires 'y' or 'n' input only. |

<a name="Component"></a>

## Component ÔçÉ [<code>ValidateSchema</code>](#ValidateSchema)
Class representing a component with validation and rendering capabilities.

**Kind**: global class  
**Extends**: [<code>ValidateSchema</code>](#ValidateSchema)  

* [Component](#Component) ÔçÉ [<code>ValidateSchema</code>](#ValidateSchema)
    * [new Component(setup, validationRules)](#new_Component_new)
    * [.TEMPLATE_STRING](#Component+TEMPLATE_STRING) : <code>string</code>
    * [.setters](#Component+setters) : <code>Object</code>
    * [.addSubscription(subscription)](#Component+addSubscription)
    * [.loadDependencies()](#Component+loadDependencies) ÔçÆ <code>Promise</code>
    * [.updateMerge(data)](#Component+updateMerge)
    * [.loadSourceFile([path])](#Component+loadSourceFile) ÔçÆ <code>string</code>
    * [.string([value])](#Component+string) ÔçÆ <code>string</code>
    * [.array([itemValue], childTypeName)](#Component+array) ÔçÆ <code>string</code>
    * [.json(value)](#Component+json) ÔçÆ <code>string</code>
    * [.date(value)](#Component+date) ÔçÆ <code>string</code>
    * [.children(children)](#Component+children) ÔçÆ <code>string</code>
    * [.toMarkdown([params])](#Component+toMarkdown) ÔçÆ <code>string</code>
    * [.renderToString([params])](#Component+renderToString) ÔçÆ <code>string</code>
    * [.printOnScreen([params])](#Component+printOnScreen)
    * [.validate(data, [returnValidObj])](#ValidateSchema+validate) ÔçÆ <code>ValidationError</code> \| <code>Object</code>
    * [.placeDefault([customSelf])](#ValidateSchema+placeDefault) ÔçÆ <code>Object</code>

<a name="new_Component_new"></a>

### new Component(setup, validationRules)
Creates an instance of Component.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The configuration for the component instance. |
| validationRules | <code>Object</code> | Validation rules for the component. |

<a name="Component+TEMPLATE_STRING"></a>

### component.TEMPLATE\_STRING : <code>string</code>
Gets the template string content from the source file.

**Kind**: instance property of [<code>Component</code>](#Component)  
<a name="Component+setters"></a>

### component.setters : <code>Object</code>
Retrieves setters for component properties.

**Kind**: instance property of [<code>Component</code>](#Component)  
<a name="Component+addSubscription"></a>

### component.addSubscription(subscription)
Adds a subscription to the component.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Throws**:

- <code>Error.Log</code> When an error occurs while adding the subscription.


| Param | Type | Description |
| --- | --- | --- |
| subscription | <code>any</code> | The subscription to be added. |

<a name="Component+loadDependencies"></a>

### component.loadDependencies() ÔçÆ <code>Promise</code>
Loads dependencies of the component.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>Promise</code> - A promise resolving to the loaded component with dependencies.  
**Throws**:

- <code>Error.Log</code> When an error occurs while loading dependencies.

<a name="Component+updateMerge"></a>

### component.updateMerge(data)
Merges and updates component properties with provided data.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Throws**:

- <code>Error.Log</code> When an error occurs during data update.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Data to update the component with. |

<a name="Component+loadSourceFile"></a>

### component.loadSourceFile([path]) ÔçÆ <code>string</code>
Loads the source file content and updates the output model of the component.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>string</code> - The loaded output model.  
**Throws**:

- <code>Error.Log</code> When an error occurs while loading the source file.


| Param | Type | Description |
| --- | --- | --- |
| [path] | <code>string</code> | The path to the source file. |

<a name="Component+string"></a>

### component.string([value]) ÔçÆ <code>string</code>
Converts the given value to a string.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>string</code> - The converted string value.  
**Throws**:

- <code>Error.Log</code> When an invalid value format is provided.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [value] | <code>any</code> | <code>&#x27;&#x27;</code> | The value to convert to a string. |

<a name="Component+array"></a>

### component.array([itemValue], childTypeName) ÔçÆ <code>string</code>
Converts an array of items to a string based on the child type name.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>string</code> - The rendered string representation of the array.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [itemValue] | <code>Array</code> | <code>[]</code> | Array of items to convert to a string. |
| childTypeName | <code>string</code> |  | The child type name for rendering items. |

<a name="Component+json"></a>

### component.json(value) ÔçÆ <code>string</code>
Converts the given value to a JSON string.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>string</code> - The JSON string representation of the value.  
**Throws**:

- <code>Error.Log</code> When an error occurs during JSON conversion.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to convert to a JSON string. |

<a name="Component+date"></a>

### component.date(value) ÔçÆ <code>string</code>
Converts the given date value to a formatted string.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>string</code> - The formatted date string.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The date value to format. |

<a name="Component+children"></a>

### component.children(children) ÔçÆ <code>string</code>
Converts an array of children components to a concatenated string representation.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>string</code> - The concatenated string representation of children components.  

| Param | Type | Description |
| --- | --- | --- |
| children | <code>Array</code> | Array of child components to convert. |

<a name="Component+toMarkdown"></a>

### component.toMarkdown([params]) ÔçÆ <code>string</code>
Converts the component's output model to a markdown string based on provided parameters.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>string</code> - The converted markdown string.  
**Throws**:

- <code>Error.Log</code> When an error occurs during markdown conversion.


| Param | Type | Description |
| --- | --- | --- |
| [params] | <code>Object</code> | Parameters for converting the output model to markdown. |

<a name="Component+renderToString"></a>

### component.renderToString([params]) ÔçÆ <code>string</code>
Renders the component to a string based on provided parameters.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Returns**: <code>string</code> - The rendered string output of the component.  
**Throws**:

- <code>Error.Log</code> When an error occurs during rendering.


| Param | Type | Description |
| --- | --- | --- |
| [params] | <code>Object</code> | Parameters for rendering the component. |

<a name="Component+printOnScreen"></a>

### component.printOnScreen([params])
Prints the rendered component output on the screen based on provided parameters.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Throws**:

- <code>Error.Log</code> When an error occurs during printing.


| Param | Type | Description |
| --- | --- | --- |
| [params] | <code>Object</code> | Parameters for printing the component output. |

<a name="ValidateSchema+validate"></a>

### component.validate(data, [returnValidObj]) ÔçÆ <code>ValidationError</code> \| <code>Object</code>
Validates the provided data against the schema and returns the validation result.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Overrides**: [<code>validate</code>](#ValidateSchema+validate)  
**Returns**: <code>ValidationError</code> \| <code>Object</code> - - If `returnValidObj` is true, returns the validated object.
Otherwise, returns the validation error object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Object</code> |  | The data to be validated against the schema. |
| [returnValidObj] | <code>boolean</code> | <code>false</code> | A flag indicating whether to return the validated object. |

<a name="ValidateSchema+placeDefault"></a>

### component.placeDefault([customSelf]) ÔçÆ <code>Object</code>
Populates the schema fields with their default values if not provided in the input object.

**Kind**: instance method of [<code>Component</code>](#Component)  
**Overrides**: [<code>placeDefault</code>](#ValidateSchema+placeDefault)  
**Returns**: <code>Object</code> - - The populated object with default values.  

| Param | Type | Description |
| --- | --- | --- |
| [customSelf] | <code>Object</code> | The custom object to be populated (optional, uses the instance itself by default). |

<a name="StringTemplateBuilder"></a>

## StringTemplateBuilder
Class representing a string template builder with various formatting capabilities.

**Kind**: global class  

* [StringTemplateBuilder](#StringTemplateBuilder)
    * [new StringTemplateBuilder(setup)](#new_StringTemplateBuilder_new)
    * [.text(value)](#StringTemplateBuilder+text) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.separator()](#StringTemplateBuilder+separator) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.textColumn(text, [length])](#StringTemplateBuilder+textColumn) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.newLine([char])](#StringTemplateBuilder+newLine) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.var(name, type)](#StringTemplateBuilder+var) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.tab()](#StringTemplateBuilder+tab) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.indent([indentation])](#StringTemplateBuilder+indent) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
    * [.end()](#StringTemplateBuilder+end) ÔçÆ <code>string</code>

<a name="new_StringTemplateBuilder_new"></a>

### new StringTemplateBuilder(setup)
Creates an instance of StringTemplateBuilder.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| setup | <code>Object</code> |  | The configuration for the string template builder instance. |
| [setup.indentation] | <code>number</code> | <code>4</code> | The number of spaces to use for each indentation level. |

<a name="StringTemplateBuilder+text"></a>

### stringTemplateBuilder.text(value) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
Appends a string value to the template.

**Kind**: instance method of [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)  
**Returns**: [<code>StringTemplateBuilder</code>](#StringTemplateBuilder) - The current StringTemplateBuilder instance for method chaining.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | The string value to append to the template. |

<a name="StringTemplateBuilder+separator"></a>

### stringTemplateBuilder.separator() ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
Appends a separator line to the template.

**Kind**: instance method of [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)  
**Returns**: [<code>StringTemplateBuilder</code>](#StringTemplateBuilder) - The current StringTemplateBuilder instance for method chaining.  
<a name="StringTemplateBuilder+textColumn"></a>

### stringTemplateBuilder.textColumn(text, [length]) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
Appends a text with a specific column length to the template.

**Kind**: instance method of [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)  
**Returns**: [<code>StringTemplateBuilder</code>](#StringTemplateBuilder) - The current StringTemplateBuilder instance for method chaining.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>string</code> |  | The text to append. |
| [length] | <code>number</code> | <code>this.textColumnLength</code> | The column length. |

<a name="StringTemplateBuilder+newLine"></a>

### stringTemplateBuilder.newLine([char]) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
Appends a new line character to the template.

**Kind**: instance method of [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)  
**Returns**: [<code>StringTemplateBuilder</code>](#StringTemplateBuilder) - The current StringTemplateBuilder instance for method chaining.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [char] | <code>string</code> | <code>&quot;&#x27;\\n&#x27;&quot;</code> | The character to represent a new line. |

<a name="StringTemplateBuilder+var"></a>

### stringTemplateBuilder.var(name, type) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
Appends a variable placeholder to the template.

**Kind**: instance method of [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)  
**Returns**: [<code>StringTemplateBuilder</code>](#StringTemplateBuilder) - The current StringTemplateBuilder instance for method chaining.  
**Throws**:

- <code>Error.Log</code> When either `name` or `type` is missing.


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the variable. |
| type | <code>string</code> | The type of the variable. |

<a name="StringTemplateBuilder+tab"></a>

### stringTemplateBuilder.tab() ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
Appends a tab indentation to the template.

**Kind**: instance method of [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)  
**Returns**: [<code>StringTemplateBuilder</code>](#StringTemplateBuilder) - The current StringTemplateBuilder instance for method chaining.  
<a name="StringTemplateBuilder+indent"></a>

### stringTemplateBuilder.indent([indentation]) ÔçÆ [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)
Appends a specific number of spaces for indentation to the template.

**Kind**: instance method of [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)  
**Returns**: [<code>StringTemplateBuilder</code>](#StringTemplateBuilder) - The current StringTemplateBuilder instance for method chaining.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [indentation] | <code>number</code> | <code>this.indentation</code> | The number of spaces to use for indentation. |

<a name="StringTemplateBuilder+end"></a>

### stringTemplateBuilder.end() ÔçÆ <code>string</code>
Finalizes the template and returns the generated string.

**Kind**: instance method of [<code>StringTemplateBuilder</code>](#StringTemplateBuilder)  
**Returns**: <code>string</code> - The generated string template.  
<a name="AuthBucket"></a>

## AuthBucket
**Kind**: global class  

* [AuthBucket](#AuthBucket)
    * [new AuthBucket(setup, parent)](#new_AuthBucket_new)
    * _instance_
        * [.service](#AuthBucket+service)
        * [.password](#AuthBucket+password)
        * [.user](#AuthBucket+user)
        * [.userName](#AuthBucket+userName) ÔçÆ <code>string</code>
        * [.userUID](#AuthBucket+userUID) ÔçÆ <code>Object</code>
    * _static_
        * [.draft(user)](#AuthBucket.draft) ÔçÆ [<code>Promise.&lt;AuthBucket&gt;</code>](#AuthBucket)

<a name="new_AuthBucket_new"></a>

### new AuthBucket(setup, parent)
Creates a new instance of the AuthBucket class.

**Throws**:

- <code>Error.Log</code> If setup parameters are missing or invalid.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing authentication details. |
| setup.password | <code>string</code> | The hashed password associated with the user. |
| setup.user | <code>Object</code> | The user object containing user-specific details. |
| parent | <code>Object</code> | The parent object to which this AuthBucket belongs. |

<a name="AuthBucket+service"></a>

### authBucket.service
The AuthService instance associated with this AuthBucket.

**Kind**: instance property of [<code>AuthBucket</code>](#AuthBucket)  
**Properties**

| Type |
| --- |
| [<code>AuthService</code>](#AuthService) | 

<a name="AuthBucket+password"></a>

### authBucket.password
The hashed password associated with the user.

**Kind**: instance property of [<code>AuthBucket</code>](#AuthBucket)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="AuthBucket+user"></a>

### authBucket.user
The user object containing user-specific details.

**Kind**: instance property of [<code>AuthBucket</code>](#AuthBucket)  
**Properties**

| Type |
| --- |
| <code>Object</code> | 

<a name="AuthBucket+userName"></a>

### authBucket.userName ÔçÆ <code>string</code>
Gets the username associated with this AuthBucket.

**Kind**: instance property of [<code>AuthBucket</code>](#AuthBucket)  
**Returns**: <code>string</code> - - The username.  
<a name="AuthBucket+userUID"></a>

### authBucket.userUID ÔçÆ <code>Object</code>
Gets the unique identifier of the user associated with this AuthBucket.

**Kind**: instance property of [<code>AuthBucket</code>](#AuthBucket)  
**Returns**: <code>Object</code> - - The user's unique identifier.  
<a name="AuthBucket.draft"></a>

### AuthBucket.draft(user) ÔçÆ [<code>Promise.&lt;AuthBucket&gt;</code>](#AuthBucket)
Creates a draft AuthBucket for the given user.

**Kind**: static method of [<code>AuthBucket</code>](#AuthBucket)  
**Returns**: [<code>Promise.&lt;AuthBucket&gt;</code>](#AuthBucket) - - The created AuthBucket instance.  
**Throws**:

- <code>Error.Log</code> If there is an error during the AuthBucket creation process.


| Param | Type | Description |
| --- | --- | --- |
| user | <code>Object</code> | The user object containing necessary details. |

<a name="SafeValue"></a>

## SafeValue
Represents a SafeValue object used for encrypting and decrypting sensitive data.
Extends _Global class and encapsulates encryption and decryption functionality.

**Kind**: global class  

* [SafeValue](#SafeValue)
    * [new SafeValue(setup)](#new_SafeValue_new)
    * _instance_
        * [.binString](#SafeValue+binString) ÔçÆ <code>string</code>
        * [.setEncrypted(newValue)](#SafeValue+setEncrypted) ÔçÆ <code>Promise.&lt;Object&gt;</code>
        * [.read()](#SafeValue+read) ÔçÆ <code>string</code> \| <code>undefined</code>
    * _static_
        * [.createEncrypt(rawValue)](#SafeValue.createEncrypt) ÔçÆ <code>Promise.&lt;Object&gt;</code>

<a name="new_SafeValue_new"></a>

### new SafeValue(setup)
Creates a new SafeValue instance with the provided setup parameters.

**Throws**:

- <code>Error</code> If there's an error during instantiation, it is caught and logged.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing encryption details (encrypted, type, algorithm, iv, salt, derivatedKey, displayValue). |

<a name="SafeValue+binString"></a>

### safeValue.binString ÔçÆ <code>string</code>
Returns the binary string representation of the encrypted data.

**Kind**: instance property of [<code>SafeValue</code>](#SafeValue)  
**Returns**: <code>string</code> - Binary string representation of the encrypted data.  
**Read only**: true  
<a name="SafeValue+setEncrypted"></a>

### safeValue.setEncrypted(newValue) ÔçÆ <code>Promise.&lt;Object&gt;</code>
Updates the encrypted data with a new encrypted value.

**Kind**: instance method of [<code>SafeValue</code>](#SafeValue)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A Promise that resolves to the updated SafeValue object.  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>string</code> | The new encrypted value to be set. |

<a name="SafeValue+read"></a>

### safeValue.read() ÔçÆ <code>string</code> \| <code>undefined</code>
Decrypts and returns the original data from the SafeValue object.

**Kind**: instance method of [<code>SafeValue</code>](#SafeValue)  
**Returns**: <code>string</code> \| <code>undefined</code> - The decrypted original data, or undefined if the SafeValue is empty.  
<a name="SafeValue.createEncrypt"></a>

### SafeValue.createEncrypt(rawValue) ÔçÆ <code>Promise.&lt;Object&gt;</code>
Creates a new encrypted SafeValue instance with the given raw value.

**Kind**: static method of [<code>SafeValue</code>](#SafeValue)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A Promise that resolves to the created SafeValue object.  

| Param | Type | Description |
| --- | --- | --- |
| rawValue | <code>string</code> | The raw value to be encrypted. |

<a name="User"></a>

## User
**Kind**: global class  

* [User](#User)
    * [new User(setup)](#new_User_new)
    * _instance_
        * [.collectionName](#User+collectionName)
        * [.userName](#User+userName)
        * [.displayName](#User+displayName)
        * [.firstName](#User+firstName)
        * [.lastName](#User+lastName)
        * [.email](#User+email)
        * [.phone](#User+phone)
        * [.frontURL](#User+frontURL)
        * [.fullName](#User+fullName) ÔçÆ <code>string</code>
        * [.auth](#User+auth) ÔçÆ [<code>AuthBucket</code>](#AuthBucket)
        * [.authService](#User+authService) ÔçÆ [<code>AuthService</code>](#AuthService)
        * [.token](#User+token) ÔçÆ <code>string</code>
        * [.userSession](#User+userSession) ÔçÆ <code>Object</code>
        * [.currentUser](#User+currentUser) ÔçÆ <code>Object</code>
        * [.signOut()](#User+signOut) ÔçÆ <code>Promise</code>
        * [.toSession()](#User+toSession) ÔçÆ <code>Object</code>
        * [.toPublic(append)](#User+toPublic) ÔçÆ <code>Object</code>
    * _static_
        * [.userSession()](#User.userSession) ÔçÆ <code>Object</code>
        * [.currentUser()](#User.currentUser) ÔçÆ <code>Object</code>
        * [.getMyUser(filter)](#User.getMyUser) ÔçÆ [<code>Promise.&lt;User&gt;</code>](#User)
        * [.getUser(filter)](#User.getUser) ÔçÆ [<code>Promise.&lt;User&gt;</code>](#User)
        * [.isExist(userName, returnUID)](#User.isExist) ÔçÆ <code>Promise.&lt;(boolean\|string)&gt;</code>
        * [.create(setup, options)](#User.create) ÔçÆ <code>Promise</code>
        * [.signIn(userName, password)](#User.signIn) ÔçÆ <code>Promise.&lt;(User\|Error.Log)&gt;</code>

<a name="new_User_new"></a>

### new User(setup)
Creates a new instance of the User class.

**Throws**:

- <code>Error.Log</code> If setup parameters are missing or invalid.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing user details. |

<a name="User+collectionName"></a>

### user.collectionName
The collection name for this user.

**Kind**: instance property of [<code>User</code>](#User)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="User+userName"></a>

### user.userName
The username associated with this user.

**Kind**: instance property of [<code>User</code>](#User)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="User+displayName"></a>

### user.displayName
The display name of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="User+firstName"></a>

### user.firstName
The first name of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="User+lastName"></a>

### user.lastName
The last name of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="User+email"></a>

### user.email
The email address of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="User+phone"></a>

### user.phone
The phone number of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="User+frontURL"></a>

### user.frontURL
The front-end URL associated with this user.

**Kind**: instance property of [<code>User</code>](#User)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="User+fullName"></a>

### user.fullName ÔçÆ <code>string</code>
Gets the full name of the user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: <code>string</code> - - The full name of the user.  
<a name="User+auth"></a>

### user.auth ÔçÆ [<code>AuthBucket</code>](#AuthBucket)
Gets the AuthBucket instance associated with this user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: [<code>AuthBucket</code>](#AuthBucket) - - The AuthBucket instance.  
<a name="User+authService"></a>

### user.authService ÔçÆ [<code>AuthService</code>](#AuthService)
Gets the AuthService instance associated with this user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: [<code>AuthService</code>](#AuthService) - - The AuthService instance.  
<a name="User+token"></a>

### user.token ÔçÆ <code>string</code>
Gets the user token associated with this user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: <code>string</code> - - The user token.  
<a name="User+userSession"></a>

### user.userSession ÔçÆ <code>Object</code>
Gets the session information for this user.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: <code>Object</code> - - The user session information.  
<a name="User+currentUser"></a>

### user.currentUser ÔçÆ <code>Object</code>
Gets the current user session.

**Kind**: instance property of [<code>User</code>](#User)  
**Returns**: <code>Object</code> - - The current user session information.  
<a name="User+signOut"></a>

### user.signOut() ÔçÆ <code>Promise</code>
Signs out the user.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise</code> - - A promise resolving to the sign-out status.  
**Throws**:

- <code>Error.Log</code> If there is an error during the sign-out process.

<a name="User+toSession"></a>

### user.toSession() ÔçÆ <code>Object</code>
Converts the user information to a session object.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Object</code> - - The session object representing the user information.  
<a name="User+toPublic"></a>

### user.toPublic(append) ÔçÆ <code>Object</code>
Converts the user information to a public object, excluding sensitive data.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Object</code> - - The public object representing the user information.  

| Param | Type | Description |
| --- | --- | --- |
| append | <code>Object</code> | Additional data to append to the public object. |

<a name="User.userSession"></a>

### User.userSession() ÔçÆ <code>Object</code>
Static method to retrieve user session information.

**Kind**: static method of [<code>User</code>](#User)  
**Returns**: <code>Object</code> - - The user session information.  
<a name="User.currentUser"></a>

### User.currentUser() ÔçÆ <code>Object</code>
Static method to retrieve the current user session information.

**Kind**: static method of [<code>User</code>](#User)  
**Returns**: <code>Object</code> - - The current user session information.  
<a name="User.getMyUser"></a>

### User.getMyUser(filter) ÔçÆ [<code>Promise.&lt;User&gt;</code>](#User)
Static method to retrieve the current user's information.

**Kind**: static method of [<code>User</code>](#User)  
**Returns**: [<code>Promise.&lt;User&gt;</code>](#User) - - A promise resolving to the user object.  
**Throws**:

- <code>Error.Log</code> If there is an error during user retrieval.


| Param | Type | Description |
| --- | --- | --- |
| filter | <code>Object</code> | The filter object to use for user retrieval. |

<a name="User.getUser"></a>

### User.getUser(filter) ÔçÆ [<code>Promise.&lt;User&gt;</code>](#User)
Static method to retrieve user information based on the provided filter.

**Kind**: static method of [<code>User</code>](#User)  
**Returns**: [<code>Promise.&lt;User&gt;</code>](#User) - - A promise resolving to the user object.  
**Throws**:

- <code>Error.Log</code> If there is an error during user retrieval.


| Param | Type | Description |
| --- | --- | --- |
| filter | <code>Object</code> | The filter object to use for user retrieval. |

<a name="User.isExist"></a>

### User.isExist(userName, returnUID) ÔçÆ <code>Promise.&lt;(boolean\|string)&gt;</code>
Static method to check if a user with the given username exists.

**Kind**: static method of [<code>User</code>](#User)  
**Returns**: <code>Promise.&lt;(boolean\|string)&gt;</code> - - A promise resolving to `true` if the user exists, or the user ID if `returnUID` is `true`.  
**Throws**:

- <code>Error.Log</code> If there is an error during the existence check.


| Param | Type | Description |
| --- | --- | --- |
| userName | <code>string</code> | The username to check for existence. |
| returnUID | <code>boolean</code> | Indicates whether to return the user ID if the user exists. |

<a name="User.create"></a>

### User.create(setup, options) ÔçÆ <code>Promise</code>
Static method to create a new user.

**Kind**: static method of [<code>User</code>](#User)  
**Returns**: <code>Promise</code> - - A promise resolving to the user creation status.  
**Throws**:

- <code>Error.Log</code> If there is an error during user creation.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The user setup object containing necessary details. |
| options | <code>Object</code> | Additional options for user creation. |
| options.preventSignIn | <code>boolean</code> | Indicates whether to prevent automatic sign-in after user creation. |

<a name="User.signIn"></a>

### User.signIn(userName, password) ÔçÆ <code>Promise.&lt;(User\|Error.Log)&gt;</code>
Static method to sign in a user.

**Kind**: static method of [<code>User</code>](#User)  
**Returns**: <code>Promise.&lt;(User\|Error.Log)&gt;</code> - - A promise resolving to the signed-in user object, or an error object if sign-in fails.  
**Throws**:

- <code>Error.Log</code> If there is an error during sign-in.


| Param | Type | Description |
| --- | --- | --- |
| userName | <code>string</code> | The username of the user to sign in. |
| password | <code>string</code> | The user's password. |

<a name="EventStd"></a>

## EventStd
**Kind**: global class  

* [EventStd](#EventStd)
    * [new EventStd(setup)](#new_EventStd_new)
    * [.name](#EventStd+name)
    * [.handler](#EventStd+handler)
    * [.target](#EventStd+target)
    * [.listener](#EventStd+listener)
    * [.trigger(target)](#EventStd+trigger) ÔçÆ <code>\*</code>
    * [.add(context)](#EventStd+add) ÔçÆ <code>Object</code>
    * [.populateTarget(target)](#EventStd+populateTarget) ÔçÆ <code>Object</code>

<a name="new_EventStd_new"></a>

### new EventStd(setup)
Creates a new instance of the EventStd class.

**Throws**:

- <code>Error</code> - Throws an error if the setup object is not valid.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object. |
| setup.name | <code>string</code> | String with the event's name. |
| setup.handler | <code>function</code> | Function with the handler to be executed when the event is triggered. |
| setup.target | <code>Object</code> | The object that is wrapping the event (e.g., Workflow, Collection, etc.). |

<a name="EventStd+name"></a>

### eventStd.name
String with the event's name.

**Kind**: instance property of [<code>EventStd</code>](#EventStd)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="EventStd+handler"></a>

### eventStd.handler
Function with the handler to be executed when the event is triggered.

**Kind**: instance property of [<code>EventStd</code>](#EventStd)  
**Properties**

| Type |
| --- |
| <code>function</code> | 

<a name="EventStd+target"></a>

### eventStd.target
The object that is wrapping the event. For example: Workflow, Collection, etc.

**Kind**: instance property of [<code>EventStd</code>](#EventStd)  
**Properties**

| Type |
| --- |
| <code>Object</code> | 

<a name="EventStd+listener"></a>

### eventStd.listener
Event listener function handling the triggered event.

**Kind**: instance property of [<code>EventStd</code>](#EventStd)  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>\*</code> | Arguments passed with the event. |

<a name="EventStd+trigger"></a>

### eventStd.trigger(target) ÔçÆ <code>\*</code>
Triggers the event, emitting it to the specified target.

**Kind**: instance method of [<code>EventStd</code>](#EventStd)  
**Returns**: <code>\*</code> - - Returns the result of the event emission.  
**Throws**:

- <code>Error</code> - Throws an error if event triggering fails.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target object on which the event is triggered. |

<a name="EventStd+add"></a>

### eventStd.add(context) ÔçÆ <code>Object</code>
Adds an event listener to the specified context and handles event triggering.

**Kind**: instance method of [<code>EventStd</code>](#EventStd)  
**Returns**: <code>Object</code> - - The event listener added to the process.  
**Throws**:

- <code>Error</code> - Throws an error if event listener addition fails.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> | The context object to which the event listener is added. |

<a name="EventStd+populateTarget"></a>

### eventStd.populateTarget(target) ÔçÆ <code>Object</code>
Populates the target object with data from the database.

**Kind**: instance method of [<code>EventStd</code>](#EventStd)  
**Returns**: <code>Object</code> - - The populated target object.  
**Throws**:

- <code>Error</code> - Throws an error if target population fails.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | The target object to be populated. |

<a name="ErrorLog"></a>

## ErrorLog
**Kind**: global class  

* [ErrorLog](#ErrorLog)
    * [new ErrorLog(args, ...stringArgsParams)](#new_ErrorLog_new)
    * [.saveLog()](#ErrorLog+saveLog) ÔçÆ [<code>Promise.&lt;ErrorLog&gt;</code>](#ErrorLog)
    * [.append(append, ...params)](#ErrorLog+append) ÔçÆ [<code>ErrorLog</code>](#ErrorLog)
    * [](#ErrorLog+response) ÔçÆ <code>Object</code>
    * [.consolePrint()](#ErrorLog+consolePrint) ÔçÆ [<code>ErrorLog</code>](#ErrorLog)

<a name="new_ErrorLog_new"></a>

### new ErrorLog(args, ...stringArgsParams)
Creates a new instance of the ErrorLog class.

**Throws**:

- <code>Error</code> If the creation of error log fails.


| Param | Type | Description |
| --- | --- | --- |
| args | <code>Object</code> | The error log parameters. |
| ...stringArgsParams | <code>string</code> | Additional string parameters. |

<a name="ErrorLog+saveLog"></a>

### errorLog.saveLog() ÔçÆ [<code>Promise.&lt;ErrorLog&gt;</code>](#ErrorLog)
Asynchronously saves the error log to the database.

**Kind**: instance method of [<code>ErrorLog</code>](#ErrorLog)  
**Returns**: [<code>Promise.&lt;ErrorLog&gt;</code>](#ErrorLog) - - A promise resolving to the saved ErrorLog instance.  
**Throws**:

- <code>Error</code> If there is an error during the saving process.

<a name="ErrorLog+append"></a>

### errorLog.append(append, ...params) ÔçÆ [<code>ErrorLog</code>](#ErrorLog)
Appends additional error information to the error log.

**Kind**: instance method of [<code>ErrorLog</code>](#ErrorLog)  
**Returns**: [<code>ErrorLog</code>](#ErrorLog) - - The ErrorLog instance with appended information.  

| Param | Type | Description |
| --- | --- | --- |
| append | <code>Object</code> \| <code>string</code> | The error object or string to append. |
| ...params | <code>string</code> | Additional parameters for error information. |

<a name="ErrorLog+response"></a>

### errorLog ÔçÆ <code>Object</code>
Generates a response object representing the error log.

**Kind**: instance method of [<code>ErrorLog</code>](#ErrorLog)  
**Returns**: <code>Object</code> - - The response object containing error details.  
<a name="ErrorLog+consolePrint"></a>

### errorLog.consolePrint() ÔçÆ [<code>ErrorLog</code>](#ErrorLog)
Prints the error log to the console.

**Kind**: instance method of [<code>ErrorLog</code>](#ErrorLog)  
**Returns**: [<code>ErrorLog</code>](#ErrorLog) - - The ErrorLog instance for method chaining.  
<a name="LogBase"></a>

## LogBase
**Kind**: global class  

* [LogBase](#LogBase)
    * [new LogBase(params)](#new_LogBase_new)
    * [.toJSON()](#LogBase+toJSON) ÔçÆ <code>string</code>
    * *[.notify()](#LogBase+notify)*
    * *[.emailNotify()](#LogBase+emailNotify)*

<a name="new_LogBase_new"></a>

### new LogBase(params)
Creates a new instance of the LogBase class.


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | The parameters for the log. |
| params.status | <code>string</code> | The status of the log. |
| params.type | <code>string</code> | The type of the log (default is 'log'). |
| params.name | <code>string</code> | The name of the log. |
| params.message | <code>string</code> | The message of the log. |
| params.resource | <code>string</code> | The resource associated with the log. |

<a name="LogBase+toJSON"></a>

### logBase.toJSON() ÔçÆ <code>string</code>
Converts the log object to its JSON representation.

**Kind**: instance method of [<code>LogBase</code>](#LogBase)  
**Returns**: <code>string</code> - - The JSON representation of the log object.  
**Throws**:

- <code>Error</code> If there is an error during JSON stringification.

<a name="LogBase+notify"></a>

### *logBase.notify()*
Notifies relevant parties about the log.

**Kind**: instance abstract method of [<code>LogBase</code>](#LogBase)  
<a name="LogBase+emailNotify"></a>

### *logBase.emailNotify()*
Sends email notifications about the log.

**Kind**: instance abstract method of [<code>LogBase</code>](#LogBase)  
<a name="Logstamp"></a>

## Logstamp
**Kind**: global class  

* [Logstamp](#Logstamp)
    * [new Logstamp(setup)](#new_Logstamp_new)
    * [.timestamp](#Logstamp+timestamp) : <code>string</code>
    * [.activityType](#Logstamp+activityType) : <code>string</code>
    * [.activityDescription](#Logstamp+activityDescription) : <code>string</code>

<a name="new_Logstamp_new"></a>

### new Logstamp(setup)
Creates a new instance of the Logstamp class.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object. |
| setup.timestamp | <code>string</code> | The timestamp of the log entry. |
| setup.activityType | <code>string</code> | The type of activity associated with the log entry. |
| setup.activityDescription | <code>string</code> | The description of the activity in the log entry. |

<a name="Logstamp+timestamp"></a>

### logstamp.timestamp : <code>string</code>
The timestamp of the log entry.

**Kind**: instance property of [<code>Logstamp</code>](#Logstamp)  
<a name="Logstamp+activityType"></a>

### logstamp.activityType : <code>string</code>
The type of activity associated with the log entry.

**Kind**: instance property of [<code>Logstamp</code>](#Logstamp)  
<a name="Logstamp+activityDescription"></a>

### logstamp.activityDescription : <code>string</code>
The description of the activity in the log entry.

**Kind**: instance property of [<code>Logstamp</code>](#Logstamp)  
<a name="RequestAPI"></a>

## RequestAPI
**Kind**: global class  

* [RequestAPI](#RequestAPI)
    * [new RequestAPI(request, bodySchema)](#new_RequestAPI_new)
    * [.originalRequest](#RequestAPI+originalRequest)
    * [.getBody()](#RequestAPI+getBody) ÔçÆ <code>Object</code>

<a name="new_RequestAPI_new"></a>

### new RequestAPI(request, bodySchema)
Creates a new instance of the RequestAPI class.

**Throws**:

- <code>ValidationError</code> If the request body fails schema validation.


| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | The request object. |
| bodySchema | <code>Object</code> | The schema object to validate the request body against. |

<a name="RequestAPI+originalRequest"></a>

### requestAPI.originalRequest
The original request object.

**Kind**: instance property of [<code>RequestAPI</code>](#RequestAPI)  
**Properties**

| Type |
| --- |
| <code>Object</code> | 

<a name="RequestAPI+getBody"></a>

### requestAPI.getBody() ÔçÆ <code>Object</code>
Returns the validated request body object with any default values applied.

**Kind**: instance method of [<code>RequestAPI</code>](#RequestAPI)  
**Returns**: <code>Object</code> - - The validated request body object.  
<a name="Collection"></a>

## Collection
**Kind**: global class  

* [Collection](#Collection)
    * [new Collection(setup)](#new_Collection_new)
    * [.Types](#Collection+Types) : <code>mongoose.Schema.Types</code>
    * [.symbol](#Collection+symbol)
    * [.name](#Collection+name)
    * [.displayName](#Collection+displayName)
    * [.pluralLabel](#Collection+pluralLabel)
    * [.singularLabel](#Collection+singularLabel)
    * [.excludeGlobals](#Collection+excludeGlobals)
    * [.Model](#Collection+Model)
    * [.fieldsSet](#Collection+fieldsSet)
    * [.getFieldSet(fieldName)](#Collection+getFieldSet) ÔçÆ [<code>CollectionField</code>](#CollectionField)
    * [.addNewField(config)](#Collection+addNewField)

<a name="new_Collection_new"></a>

### new Collection(setup)
Creates a new instance of the Collection class.

**Throws**:

- <code>Error</code> If collection setup fails.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing collection details and configurations. |
| setup.name | <code>string</code> | The name of the collection. |
| setup.symbol | <code>string</code> | The symbol of the collection. |
| setup.displayName | <code>string</code> | The display name of the collection. |
| setup.pluralLabel | <code>string</code> | The plural label of the collection. |
| setup.singularLabel | <code>string</code> | The singular label of the collection. |
| setup.excludeGlobals | <code>Array.&lt;string&gt;</code> | Globals to be excluded from the collection. |
| setup.fieldsSet | [<code>Array.&lt;CollectionField&gt;</code>](#CollectionField) | The fields of the collection. |
| setup.Model | <code>object</code> | The collection's model. |

<a name="Collection+Types"></a>

### collection.Types : <code>mongoose.Schema.Types</code>
Represents MongoDB schema types.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
<a name="Collection+symbol"></a>

### collection.symbol
The symbol of the collection.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="Collection+name"></a>

### collection.name
The name of the collection.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="Collection+displayName"></a>

### collection.displayName
The display name of the collection.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="Collection+pluralLabel"></a>

### collection.pluralLabel
The plural label of the collection.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="Collection+singularLabel"></a>

### collection.singularLabel
The singular label of the collection.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="Collection+excludeGlobals"></a>

### collection.excludeGlobals
Globals to be excluded from the collection.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Properties**

| Type |
| --- |
| <code>Array.&lt;string&gt;</code> | 

<a name="Collection+Model"></a>

### collection.Model
The collection's model.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Properties**

| Type |
| --- |
| <code>object</code> | 

<a name="Collection+fieldsSet"></a>

### collection.fieldsSet
The fields of the collection.

**Kind**: instance property of [<code>Collection</code>](#Collection)  
**Properties**

| Type |
| --- |
| [<code>Array.&lt;CollectionField&gt;</code>](#CollectionField) | 

<a name="Collection+getFieldSet"></a>

### collection.getFieldSet(fieldName) ÔçÆ [<code>CollectionField</code>](#CollectionField)
Gets a specific field from the collection's field set.

**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: [<code>CollectionField</code>](#CollectionField) - - The CollectionField object representing the specified field.  
**Throws**:

- <code>Error.Log</code> - Throws an error if field retrieval fails.


| Param | Type | Description |
| --- | --- | --- |
| fieldName | <code>string</code> | The name of the field to retrieve. |

<a name="Collection+addNewField"></a>

### collection.addNewField(config)
Adds a new field to the collection.

**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>CollectionField</code>](#CollectionField) | The configuration object for the new field. |

<a name="CollectionEncrypt"></a>

## CollectionEncrypt ÔçÉ [<code>CollectionField</code>](#CollectionField)
Represents a collection field that references encrypted data stored in the 'safe_values' collection.
Extends CollectionField class and sets up the type as ObjectId, referencing 'safe_values' collection.

**Kind**: global class  
**Extends**: [<code>CollectionField</code>](#CollectionField)  

* [CollectionEncrypt](#CollectionEncrypt) ÔçÉ [<code>CollectionField</code>](#CollectionField)
    * [new CollectionEncrypt(setup)](#new_CollectionEncrypt_new)
    * [.isEncrypt](#CollectionField+isEncrypt) : <code>boolean</code>
    * [.toObject()](#CollectionField+toObject) ÔçÆ <code>Object</code>

<a name="new_CollectionEncrypt_new"></a>

### new CollectionEncrypt(setup)
Creates a new CollectionEncrypt instance with the provided setup parameters.

**Throws**:

- <code>Error.Log</code> If there is an error during instantiation, it is caught and logged.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing configuration details for the collection field. |

<a name="CollectionField+isEncrypt"></a>

### collectionEncrypt.isEncrypt : <code>boolean</code>
Indicates if the field is encrypted when saved to database.

**Kind**: instance property of [<code>CollectionEncrypt</code>](#CollectionEncrypt)  
**Overrides**: [<code>isEncrypt</code>](#CollectionField+isEncrypt)  
<a name="CollectionField+toObject"></a>

### collectionEncrypt.toObject() ÔçÆ <code>Object</code>
Converts the CollectionField object to a plain JavaScript object.

**Kind**: instance method of [<code>CollectionEncrypt</code>](#CollectionEncrypt)  
**Overrides**: [<code>toObject</code>](#CollectionField+toObject)  
**Returns**: <code>Object</code> - - The plain JavaScript object representing the CollectionField.  
<a name="CollectionField"></a>

## CollectionField
**Kind**: global class  

* [CollectionField](#CollectionField)
    * [new CollectionField(setup)](#new_CollectionField_new)
    * [.isEncrypt](#CollectionField+isEncrypt) : <code>boolean</code>
    * [.toObject()](#CollectionField+toObject) ÔçÆ <code>Object</code>

<a name="new_CollectionField_new"></a>

### new CollectionField(setup)
Creates a new instance of the CollectionField class.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object. |
| setup.type | <code>any</code> | The type of the field. |
| setup.fieldName | <code>string</code> | The name of the field. |
| setup.ref | <code>string</code> | The reference of the field. |
| setup.required | <code>boolean</code> | Indicates if the field is required. |
| setup.unique | <code>boolean</code> | Indicates if the field is unique. |
| setup.immutable | <code>boolean</code> | Indicates if the field is immutable. |
| setup.isEncrypt | <code>boolean</code> | Defines if the field should be saved encrypted on the database. |
| setup.enum | <code>Array.&lt;string&gt;</code> | Array with the allowed options for the field. |
| setup.refConfig | [<code>SchemaRefConfig</code>](#SchemaRefConfig) | The configuration for related fields with other collections. |
| setup.enumLabels | <code>object</code> | Array with the allowed options for the field. |
| setup.default | <code>string</code> \| <code>number</code> \| <code>Object</code> \| <code>Array</code> \| <code>Date</code> \| <code>Buffer</code> \| <code>function</code> | If a function was provided, it will execute the function runtime, and the default will be the result of the function. |

<a name="CollectionField+isEncrypt"></a>

### collectionField.isEncrypt : <code>boolean</code>
Indicates if the field is encrypted when saved to database.

**Kind**: instance property of [<code>CollectionField</code>](#CollectionField)  
<a name="CollectionField+toObject"></a>

### collectionField.toObject() ÔçÆ <code>Object</code>
Converts the CollectionField object to a plain JavaScript object.

**Kind**: instance method of [<code>CollectionField</code>](#CollectionField)  
**Returns**: <code>Object</code> - - The plain JavaScript object representing the CollectionField.  
<a name="Endpoint"></a>

## Endpoint
**Kind**: global class  

* [Endpoint](#Endpoint)
    * [new Endpoint(setup)](#new_Endpoint_new)
    * [.method](#Endpoint+method) : <code>string</code>
    * [.routePath](#Endpoint+routePath) : <code>string</code>
    * [.controller](#Endpoint+controller) : <code>function</code>
    * [.middlewares](#Endpoint+middlewares) : <code>Array.&lt;function()&gt;</code>
    * [.updateBodySchema(data)](#Endpoint+updateBodySchema)

<a name="new_Endpoint_new"></a>

### new Endpoint(setup)
Creates a new instance of the Endpoint class.

**Throws**:

- <code>Error.Log</code> If setup parameters are invalid.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing endpoint details and configurations. |
| setup.method | <code>string</code> | The HTTP method for the endpoint (default: 'GET'). |
| setup.routePath | <code>string</code> | The path of the endpoint's route. |
| setup.controller | <code>function</code> | The controller function handling the endpoint logic. |
| setup.bodySchema | <code>Object</code> | The schema object for validating the request body. |
| setup.isAuthRoute | <code>boolean</code> | Indicates if the endpoint requires authentication. |
| setup.authRule | <code>string</code> | The authorization rule for the authenticated users. |
| setup.middlewares | <code>Array.&lt;function()&gt;</code> | Additional middlewares to be applied to the endpoint. |
| setup.noValidateBody | <code>boolean</code> | Indicates if request body validation should be skipped. |

<a name="Endpoint+method"></a>

### endpoint.method : <code>string</code>
The HTTP method for the endpoint.

**Kind**: instance property of [<code>Endpoint</code>](#Endpoint)  
<a name="Endpoint+routePath"></a>

### endpoint.routePath : <code>string</code>
The path of the endpoint's route.

**Kind**: instance property of [<code>Endpoint</code>](#Endpoint)  
<a name="Endpoint+controller"></a>

### endpoint.controller : <code>function</code>
The controller function handling the endpoint logic.

**Kind**: instance property of [<code>Endpoint</code>](#Endpoint)  
<a name="Endpoint+middlewares"></a>

### endpoint.middlewares : <code>Array.&lt;function()&gt;</code>
Middleware functions to be applied to the endpoint.

**Kind**: instance property of [<code>Endpoint</code>](#Endpoint)  
<a name="Endpoint+updateBodySchema"></a>

### endpoint.updateBodySchema(data)
Updated the body schema of the endpoint.

**Kind**: instance method of [<code>Endpoint</code>](#Endpoint)  

| Param | Type |
| --- | --- |
| data | <code>object</code> | 

<a name="SchemaRefConfig"></a>

## SchemaRefConfig
**Kind**: global class  

* [SchemaRefConfig](#SchemaRefConfig)
    * [new SchemaRefConfig([setup])](#new_SchemaRefConfig_new)
    * [.type](#SchemaRefConfig+type) : <code>string</code>
    * [.relatedField](#SchemaRefConfig+relatedField) : <code>string</code>
    * [.toDelete](#SchemaRefConfig+toDelete) : <code>boolean</code>

<a name="new_SchemaRefConfig_new"></a>

### new SchemaRefConfig([setup])
Creates a new instance of the SchemaRefConfig class.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [setup] | <code>Object</code> |  | The setup object. |
| [setup.type] | <code>string</code> |  | The type of the reference. |
| [setup.relatedField] | <code>string</code> |  | The related field of the reference. |
| [setup.toDelete] | <code>boolean</code> | <code>false</code> | Indicates if the reference should be deleted. |

<a name="SchemaRefConfig+type"></a>

### schemaRefConfig.type : <code>string</code>
The value type of the reference.
Allowed: "array-oid" or "ObjectId"

**Kind**: instance property of [<code>SchemaRefConfig</code>](#SchemaRefConfig)  
<a name="SchemaRefConfig+relatedField"></a>

### schemaRefConfig.relatedField : <code>string</code>
The related field of the reference.

**Kind**: instance property of [<code>SchemaRefConfig</code>](#SchemaRefConfig)  
<a name="SchemaRefConfig+toDelete"></a>

### schemaRefConfig.toDelete : <code>boolean</code>
Indicates if the reference should be deleted.

**Kind**: instance property of [<code>SchemaRefConfig</code>](#SchemaRefConfig)  
<a name="Success"></a>

## Success
**Kind**: global class  

* [Success](#Success)
    * [new Success(data, message)](#new_Success_new)
    * [.success](#Success+success)
    * [.data](#Success+data)
    * [.message](#Success+message)
    * [.toJSON()](#Success+toJSON) ÔçÆ <code>string</code>

<a name="new_Success_new"></a>

### new Success(data, message)
Creates a new instance of the Success class.


| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data object to be included in the response. |
| message | <code>string</code> | The success message to be included in the response. |

<a name="Success+success"></a>

### success.success
A flag indicating the success of the API response.

**Kind**: instance property of [<code>Success</code>](#Success)  
**Properties**

| Type |
| --- |
| <code>boolean</code> | 

<a name="Success+data"></a>

### success.data
The data object included in the response.

**Kind**: instance property of [<code>Success</code>](#Success)  
**Properties**

| Type |
| --- |
| <code>Object</code> | 

<a name="Success+message"></a>

### success.message
The success message included in the response.

**Kind**: instance property of [<code>Success</code>](#Success)  
**Properties**

| Type |
| --- |
| <code>string</code> | 

<a name="Success+toJSON"></a>

### success.toJSON() ÔçÆ <code>string</code>
Converts the Success object to a JSON string.

**Kind**: instance method of [<code>Success</code>](#Success)  
**Returns**: <code>string</code> - - The JSON representation of the Success object.  
**Throws**:

- <code>Error</code> - Throws an error if JSON stringification fails.

<a name="Resources"></a>

## Resources
Class representing a resource manager for handling language-specific resources.

**Kind**: global class  

* [Resources](#Resources)
    * [new Resources([language])](#new_Resources_new)
    * [.text(path, ...params)](#Resources+text) ÔçÆ <code>string</code> \| <code>undefined</code>
    * [.templates(path, ...params)](#Resources+templates) ÔçÆ <code>string</code> \| <code>function</code>
    * [.error(path, ...params)](#Resources+error) ÔçÆ <code>string</code> \| <code>undefined</code>
    * [.getPath(pathString)](#Resources+getPath) ÔçÆ <code>function</code> \| <code>undefined</code>
    * [.loadResources(resources)](#Resources+loadResources)

<a name="new_Resources_new"></a>

### new Resources([language])
Creates an instance of Resources.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [language] | <code>string</code> | <code>&quot;&#x27;en_US&#x27;&quot;</code> | The language code for the desired language. Defaults to 'en_US'. |

<a name="Resources+text"></a>

### resources.text(path, ...params) ÔçÆ <code>string</code> \| <code>undefined</code>
Retrieves a text resource at the specified path.

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>string</code> \| <code>undefined</code> - The text resource or undefined if the path is not found.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to the text resource. |
| ...params | <code>any</code> | Additional parameters for the text resource function. |

<a name="Resources+templates"></a>

### resources.templates(path, ...params) ÔçÆ <code>string</code> \| <code>function</code>
Retrieves a template resource at the specified path.

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>string</code> \| <code>function</code> - The template resource or a rendering function if the path is found.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> \| <code>object</code> | The path to the template resource or a template object. |
| ...params | <code>any</code> | Additional parameters for the template resource function. |

<a name="Resources+error"></a>

### resources.error(path, ...params) ÔçÆ <code>string</code> \| <code>undefined</code>
Retrieves an error resource at the specified path.

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>string</code> \| <code>undefined</code> - The error resource or undefined if the path is not found.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to the error resource. |
| ...params | <code>any</code> | Additional parameters for the error resource function. |

<a name="Resources+getPath"></a>

### resources.getPath(pathString) ÔçÆ <code>function</code> \| <code>undefined</code>
Retrieves a resource at the specified path.

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Returns**: <code>function</code> \| <code>undefined</code> - The resource function or undefined if the path is not found.  
**Throws**:

- [<code>ErrorLog</code>](#ErrorLog) If the specified path is not found in the resource data.


| Param | Type | Description |
| --- | --- | --- |
| pathString | <code>string</code> | The path to the desired resource. |

<a name="Resources+loadResources"></a>

### resources.loadResources(resources)
Loads additional resources into the resource manager.

**Kind**: instance method of [<code>Resources</code>](#Resources)  
**Throws**:

- <code>Error</code> If an error occurs while loading the resources.


| Param | Type | Description |
| --- | --- | --- |
| resources | <code>Object</code> | The additional resources to be loaded. |

<a name="SafeValueClass"></a>

## SafeValueClass
Represents a utility class providing encryption and decryption methods for sensitive data.
It uses SafeValue and AuthService classes to perform encryption and decryption operations.

**Kind**: global class  

* [SafeValueClass](#SafeValueClass)
    * [.BSModel](#SafeValueClass+BSModel) : [<code>SafeValue</code>](#SafeValue)
    * [.displayValue](#SafeValueClass+displayValue) ÔçÆ <code>string</code> \| <code>undefined</code>
    * [.encrypt](#SafeValueClass+encrypt) ÔçÆ <code>Object</code> \| <code>undefined</code>

<a name="SafeValueClass+BSModel"></a>

### safeValueClass.BSModel : [<code>SafeValue</code>](#SafeValue)
The SafeValue class used for encryption and decryption operations.

**Kind**: instance property of [<code>SafeValueClass</code>](#SafeValueClass)  
<a name="SafeValueClass+displayValue"></a>

### safeValueClass.displayValue ÔçÆ <code>string</code> \| <code>undefined</code>
Retrieves a masked version of the decrypted data for display purposes.

**Kind**: instance property of [<code>SafeValueClass</code>](#SafeValueClass)  
**Returns**: <code>string</code> \| <code>undefined</code> - The masked version of the decrypted data or undefined if not encrypted.  
<a name="SafeValueClass+encrypt"></a>

### safeValueClass.encrypt ÔçÆ <code>Object</code> \| <code>undefined</code>
Encrypts the raw value and returns the encryption details.

**Kind**: instance property of [<code>SafeValueClass</code>](#SafeValueClass)  
**Returns**: <code>Object</code> \| <code>undefined</code> - An object containing encryption details (salt, derivatedKey, iv, encrypted),
or undefined if raw value is missing.  
<a name="AuthService"></a>

## AuthService
Class representing an authentication service for handling user authentication and authorization.

**Kind**: global class  

* [AuthService](#AuthService)
    * [new AuthService(setup)](#new_AuthService_new)
    * [.userUID](#AuthService+userUID) : <code>string</code> \| <code>undefined</code>
    * [.secretKey](#AuthService+secretKey) : <code>string</code>
    * [.signIn(password)](#AuthService+signIn) ÔçÆ [<code>Success</code>](#Success) \| <code>Error.Log</code>
    * [.generateKey(SECRET_KEY, salt)](#AuthService+generateKey) ÔçÆ <code>Buffer</code>
    * [.generateRandom()](#AuthService+generateRandom) ÔçÆ <code>Buffer</code>
    * [.encryptToken(token, key)](#AuthService+encryptToken) ÔçÆ <code>Object</code>
    * [.decryptToken(encryptedToken, iv, derivatedKey)](#AuthService+decryptToken) ÔçÆ <code>string</code>
    * [.genSalt([length])](#AuthService+genSalt) ÔçÆ <code>string</code>
    * [.createHash(password, [saltLength])](#AuthService+createHash) ÔçÆ <code>string</code>
    * [.createUserToken()](#AuthService+createUserToken) ÔçÆ <code>string</code>
    * [.createSessionToken()](#AuthService+createSessionToken) ÔçÆ <code>string</code>
    * [.createSessionToken()](#AuthService+createSessionToken) ÔçÆ <code>string</code>
    * [.genToken(data)](#AuthService+genToken) ÔçÆ <code>string</code>
    * [.validateToken(token)](#AuthService+validateToken) ÔçÆ <code>Object</code>
    * [.validateCredentials(password)](#AuthService+validateCredentials) ÔçÆ <code>boolean</code>
    * [.createSessionCLI()](#AuthService+createSessionCLI) ÔçÆ <code>void</code>
    * [.dropSessionCLI(token)](#AuthService+dropSessionCLI) ÔçÆ <code>void</code>
    * [.signOut(token)](#AuthService+signOut) ÔçÆ <code>boolean</code>

<a name="new_AuthService_new"></a>

### new AuthService(setup)
Creates an instance of AuthService.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing optional parameters. |
| setup.parent | <code>Object</code> | The parent object to which this AuthService instance belongs. |

<a name="AuthService+userUID"></a>

### authService.userUID : <code>string</code> \| <code>undefined</code>
Gets the user's unique identifier.

**Kind**: instance property of [<code>AuthService</code>](#AuthService)  
<a name="AuthService+secretKey"></a>

### authService.secretKey : <code>string</code>
Gets the secret key for generating JWT tokens.

**Kind**: instance property of [<code>AuthService</code>](#AuthService)  
<a name="AuthService+signIn"></a>

### authService.signIn(password) ÔçÆ [<code>Success</code>](#Success) \| <code>Error.Log</code>
Validates user credentials and signs in the user.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: [<code>Success</code>](#Success) \| <code>Error.Log</code> - A Success object if authentication is successful, or an Error.Log object if authentication fails.  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | The user's password to be validated. |

<a name="AuthService+generateKey"></a>

### authService.generateKey(SECRET_KEY, salt) ÔçÆ <code>Buffer</code>
To generate a key using PBKDF2

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>Buffer</code> - 100000 iterations, 32-byte key  

| Param | Type |
| --- | --- |
| SECRET_KEY | <code>string</code> | 
| salt | <code>Buffer</code> | 

<a name="AuthService+generateRandom"></a>

### authService.generateRandom() ÔçÆ <code>Buffer</code>
To generate a random IV (Initialization Vector)

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>Buffer</code> - 16 bytes (128 bits) IV for AES-256  
<a name="AuthService+encryptToken"></a>

### authService.encryptToken(token, key) ÔçÆ <code>Object</code>
To encrypt a token

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>Object</code> - Returns an object with the "iv" and the "encryptedToken".  

| Param | Type |
| --- | --- |
| token | <code>string</code> | 
| key | <code>Buffer</code> | 

<a name="AuthService+decryptToken"></a>

### authService.decryptToken(encryptedToken, iv, derivatedKey) ÔçÆ <code>string</code>
To decrypt a token

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>string</code> - The decrypted string of the value.  

| Param | Type | Description |
| --- | --- | --- |
| encryptedToken | <code>string</code> | The encrypted string token. |
| iv | <code>Buffer</code> | The "iv" used on the encrypt generator. |
| derivatedKey | <code>Buffer</code> | The key used on the encrypt generator. |

<a name="AuthService+genSalt"></a>

### authService.genSalt([length]) ÔçÆ <code>string</code>
Generates a salt for password hashing.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>string</code> - The generated salt.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [length] | <code>number</code> | <code>8</code> | The length of the generated salt. |

<a name="AuthService+createHash"></a>

### authService.createHash(password, [saltLength]) ÔçÆ <code>string</code>
Creates a password hash using the provided password and salt length.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>string</code> - The hashed password.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| password | <code>string</code> |  | The password to be hashed. |
| [saltLength] | <code>number</code> | <code>8</code> | The length of the salt for password hashing. |

<a name="AuthService+createUserToken"></a>

### authService.createUserToken() ÔçÆ <code>string</code>
Creates a JWT token for the user.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>string</code> - The generated JWT token.  
<a name="AuthService+createSessionToken"></a>

### authService.createSessionToken() ÔçÆ <code>string</code>
Creates a JWT session token for the user.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>string</code> - The generated JWT token.  
<a name="AuthService+createSessionToken"></a>

### authService.createSessionToken() ÔçÆ <code>string</code>
Creates a JWT token for the user.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>string</code> - The generated JWT token.  
<a name="AuthService+genToken"></a>

### authService.genToken(data) ÔçÆ <code>string</code>
Generates a JWT token based on the provided data.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>string</code> - The generated JWT token.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The data to be encoded into the JWT token. |

<a name="AuthService+validateToken"></a>

### authService.validateToken(token) ÔçÆ <code>Object</code>
Validates a JWT token.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>Object</code> - The decoded data from the validated JWT token.  
**Throws**:

- <code>Error.Log</code> If the token validation fails.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The JWT token to be validated. |

<a name="AuthService+validateCredentials"></a>

### authService.validateCredentials(password) ÔçÆ <code>boolean</code>
Validates user credentials against the stored password hash.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>boolean</code> - True if the password matches the stored hash, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>string</code> | The user's input password to be validated. |

<a name="AuthService+createSessionCLI"></a>

### authService.createSessionCLI() ÔçÆ <code>void</code>
Creates a session for the Command-Line Interface (CLI) user.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Throws**:

- <code>Error.Log</code> If an error occurs during session creation.

<a name="AuthService+dropSessionCLI"></a>

### authService.dropSessionCLI(token) ÔçÆ <code>void</code>
Drops a session for the Command-Line Interface (CLI) user.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Throws**:

- <code>Error.Log</code> If an error occurs during session dropping.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The JWT token representing the session to be dropped. |

<a name="AuthService+signOut"></a>

### authService.signOut(token) ÔçÆ <code>boolean</code>
Signs out the user and deletes the corresponding session.

**Kind**: instance method of [<code>AuthService</code>](#AuthService)  
**Returns**: <code>boolean</code> - True if the session is successfully deleted, false otherwise.  
**Throws**:

- <code>Error.Log</code> If an error occurs during sign-out.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The JWT token representing the user's session. |

<a name="DatabaseServer"></a>

## DatabaseServer
**Kind**: global class  

* [DatabaseServer](#DatabaseServer)
    * [new DatabaseServer(setup)](#new_DatabaseServer_new)
    * [.HOST](#DatabaseServer+HOST) : <code>string</code>
    * [.dbName](#DatabaseServer+dbName) : <code>string</code>
    * [.DBServer](#DatabaseServer+DBServer) : <code>mongoose.Connection</code>
    * [.collections](#DatabaseServer+collections) : <code>Array</code>
    * [.init(callbacks)](#DatabaseServer+init) ÔçÆ [<code>DatabaseServer</code>](#DatabaseServer)

<a name="new_DatabaseServer_new"></a>

### new DatabaseServer(setup)
Creates an instance of DatabaseServer.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| setup | <code>Object</code> |  | The configuration setup for the database server. |
| setup.dbName | <code>string</code> |  | The name of the database. |
| [setup.HOST] | <code>string</code> | <code>&quot;&#x27;mongodb://0.0.0.0:27017/&#x27;&quot;</code> | The host URL for the MongoDB server. |
| [setup.collections] | <code>Array</code> |  | Additional collections to be initialized along with the default ones. |

<a name="DatabaseServer+HOST"></a>

### databaseServer.HOST : <code>string</code>
The host URL for the MongoDB server.

**Kind**: instance property of [<code>DatabaseServer</code>](#DatabaseServer)  
<a name="DatabaseServer+dbName"></a>

### databaseServer.dbName : <code>string</code>
The name of the database.

**Kind**: instance property of [<code>DatabaseServer</code>](#DatabaseServer)  
<a name="DatabaseServer+DBServer"></a>

### databaseServer.DBServer : <code>mongoose.Connection</code>
The MongoDB server instance.

**Kind**: instance property of [<code>DatabaseServer</code>](#DatabaseServer)  
<a name="DatabaseServer+collections"></a>

### databaseServer.collections : <code>Array</code>
An array containing the initialized collections.

**Kind**: instance property of [<code>DatabaseServer</code>](#DatabaseServer)  
<a name="DatabaseServer+init"></a>

### databaseServer.init(callbacks) ÔçÆ [<code>DatabaseServer</code>](#DatabaseServer)
Initializes the database connection and sets up the collections.

**Kind**: instance method of [<code>DatabaseServer</code>](#DatabaseServer)  
**Returns**: [<code>DatabaseServer</code>](#DatabaseServer) - The DatabaseServer instance.  

| Param | Type | Description |
| --- | --- | --- |
| callbacks | <code>Object</code> | Success and error callbacks for database initialization. |
| callbacks.success | <code>function</code> | The success callback function to be executed after successful database connection. |
| callbacks.error | <code>function</code> | The error callback function to be executed if the database connection fails. |

<a name="Prompt"></a>

## Prompt
**Kind**: global class  

* [Prompt](#Prompt)
    * [new Prompt(setup)](#new_Prompt_new)
    * [.rootPath](#Prompt+rootPath) : <code>string</code>
    * [.cmd(command, options, dontPrint)](#Prompt+cmd) ÔçÆ <code>Object</code> \| <code>Error.Log</code>
    * [.exec(cmd)](#Prompt+exec) ÔçÆ <code>Promise</code>
    * [.question(questionText)](#Prompt+question) ÔçÆ <code>Promise.&lt;string&gt;</code>
    * [.strigifyParams(params)](#Prompt+strigifyParams) ÔçÆ <code>string</code>

<a name="new_Prompt_new"></a>

### new Prompt(setup)
Creates an instance of Prompt.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | Configuration options for the prompt. |
| setup.rootPath | <code>string</code> | The root path for the prompt (defaults to the current directory). |

<a name="Prompt+rootPath"></a>

### prompt.rootPath : <code>string</code>
The root path for the prompt.

**Kind**: instance property of [<code>Prompt</code>](#Prompt)  
<a name="Prompt+cmd"></a>

### prompt.cmd(command, options, dontPrint) ÔçÆ <code>Object</code> \| <code>Error.Log</code>
Executes a command in the shell synchronously.

**Kind**: instance method of [<code>Prompt</code>](#Prompt)  
**Returns**: <code>Object</code> \| <code>Error.Log</code> - An object containing the execution result or an Error.Log object if an error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| command | <code>string</code> | The command to be executed. |
| options | <code>Object</code> | Additional options for the execution. |
| dontPrint | <code>boolean</code> | If true, the command output will not be printed (defaults to false). |

<a name="Prompt+exec"></a>

### prompt.exec(cmd) ÔçÆ <code>Promise</code>
Asynchronously executes a command in the shell and returns a Promise.

**Kind**: instance method of [<code>Prompt</code>](#Prompt)  
**Returns**: <code>Promise</code> - A Promise that resolves with the execution result.  

| Param | Type | Description |
| --- | --- | --- |
| cmd | <code>string</code> | The command to be executed. |

<a name="Prompt+question"></a>

### prompt.question(questionText) ÔçÆ <code>Promise.&lt;string&gt;</code>
Asynchronously asks a question in the terminal and returns the user's input as a Promise.

**Kind**: instance method of [<code>Prompt</code>](#Prompt)  
**Returns**: <code>Promise.&lt;string&gt;</code> - A Promise that resolves with the user's input.  

| Param | Type | Description |
| --- | --- | --- |
| questionText | <code>string</code> | The text of the question to be asked. |

<a name="Prompt+strigifyParams"></a>

### prompt.strigifyParams(params) ÔçÆ <code>string</code>
Converts parameters into a string format suitable for command-line arguments.

**Kind**: instance method of [<code>Prompt</code>](#Prompt)  
**Returns**: <code>string</code> - A string representation of the parameters for command-line use.  
**Throws**:

- <code>Error.Log</code> If an error occurs during parameter conversion.


| Param | Type | Description |
| --- | --- | --- |
| params | <code>Array</code> \| <code>Object</code> \| <code>string</code> | The parameters to be converted. |

<a name="ServerAPI"></a>

## ServerAPI
**Kind**: global class  

* [ServerAPI](#ServerAPI)
    * [new ServerAPI(setup)](#new_ServerAPI_new)
    * [.init()](#ServerAPI+init)
    * [.listen(PORT, callback)](#ServerAPI+listen)
    * [.listenSSL(PORT, keySSLPath, certSSLPath, callback)](#ServerAPI+listenSSL)
    * [.runAppQueue()](#ServerAPI+runAppQueue)
    * [.createEndpoint(endpoint)](#ServerAPI+createEndpoint)

<a name="new_ServerAPI_new"></a>

### new ServerAPI(setup)
Creates an instance of ServerAPI.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | Configuration options for the server. |
| setup.projectName | <code>string</code> | The name of the project. |
| setup.databaseConfig | <code>Object</code> | Configuration options for the database. |
| setup.API_SECRET | <code>string</code> | The API secret key for session encryption. |
| setup.sessionCookiesMaxAge | <code>number</code> | Maximum age of session cookies (in milliseconds). |
| setup.staticPath | <code>string</code> | The path to static files. |
| setup.redisURL | <code>string</code> | The redis database url to use. Default is "redis://localhost:6379" |
| setup.listenCallback | <code>function</code> | Callback function to be executed when the server starts listening. |
| setup.compileFE | <code>boolean</code> | Flag indicating whether to compile frontend code (defaults to false). |
| setup.jsonLimit | <code>string</code> | Limit of JSON requests (defaults to '10mb'). |
| setup.sessionResave | <code>boolean</code> | Flag indicating whether to save session data back to the session store (defaults to true). |
| setup.sessionSaveUninitialized | <code>boolean</code> | Flag indicating whether to save uninitialized sessions to the session store (defaults to true). |
| setup.keySSLPath | <code>string</code> | The path to the SSL key file. |
| setup.certSSLPath | <code>string</code> | The path to the SSL certificate file. |
| setup.PORT | <code>number</code> | The port number on which the server will listen (defaults to 80). |

<a name="ServerAPI+init"></a>

### serverAPI.init()
Initializes the server, setting up routes, middleware, and listeners.

**Kind**: instance method of [<code>ServerAPI</code>](#ServerAPI)  
<a name="ServerAPI+listen"></a>

### serverAPI.listen(PORT, callback)
Starts the server to listen on the specified port.

**Kind**: instance method of [<code>ServerAPI</code>](#ServerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| PORT | <code>number</code> | The port number on which the server will listen. |
| callback | <code>function</code> | Callback function to be executed when the server starts listening. |

<a name="ServerAPI+listenSSL"></a>

### serverAPI.listenSSL(PORT, keySSLPath, certSSLPath, callback)
Starts the server with SSL encryption to listen on the specified port.

**Kind**: instance method of [<code>ServerAPI</code>](#ServerAPI)  

| Param | Type | Description |
| --- | --- | --- |
| PORT | <code>number</code> | The port number on which the server will listen. |
| keySSLPath | <code>string</code> | The path to the SSL key file. |
| certSSLPath | <code>string</code> | The path to the SSL certificate file. |
| callback | <code>function</code> | Callback function to be executed when the server starts listening. |

<a name="ServerAPI+runAppQueue"></a>

### serverAPI.runAppQueue()
Runs the queued application functions.

**Kind**: instance method of [<code>ServerAPI</code>](#ServerAPI)  
<a name="ServerAPI+createEndpoint"></a>

### serverAPI.createEndpoint(endpoint)
Creates an endpoint for the server.

**Kind**: instance method of [<code>ServerAPI</code>](#ServerAPI)  
**Throws**:

- <code>Error.Log</code> If the endpoint parameter is not an instance of the Endpoint class.


| Param | Type | Description |
| --- | --- | --- |
| endpoint | [<code>Endpoint</code>](#Endpoint) | The endpoint to be created. |

<a name="ComponentSubscription"></a>

## ComponentSubscription
Represents a subscription for a specific component in the application.
Extends SocketSubscription class.

**Kind**: global class  

* [ComponentSubscription](#ComponentSubscription)
    * [new ComponentSubscription(setup, connection)](#new_ComponentSubscription_new)
    * [.type](#ComponentSubscription+type) : <code>string</code>
    * [.component](#ComponentSubscription+component) : <code>Object</code>
    * [.toClient()](#ComponentSubscription+toClient)
    * [.toClientError(error)](#ComponentSubscription+toClientError)
    * [.updateComponent(mergeData)](#ComponentSubscription+updateComponent)
    * [.setClientChangeListener()](#ComponentSubscription+setClientChangeListener)
    * [.appendComponent()](#ComponentSubscription+appendComponent)

<a name="new_ComponentSubscription_new"></a>

### new ComponentSubscription(setup, connection)
Creates an instance of ComponentSubscription.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | Configuration options for the subscription. |
| connection | <code>Object</code> | The connection object for managing the subscription. |
| setup.component | <code>Object</code> | The component object associated with the subscription. |

<a name="ComponentSubscription+type"></a>

### componentSubscription.type : <code>string</code>
Type identifier for the subscription (component).

**Kind**: instance property of [<code>ComponentSubscription</code>](#ComponentSubscription)  
<a name="ComponentSubscription+component"></a>

### componentSubscription.component : <code>Object</code>
The component object associated with the subscription.

**Kind**: instance property of [<code>ComponentSubscription</code>](#ComponentSubscription)  
<a name="ComponentSubscription+toClient"></a>

### componentSubscription.toClient()
Sends the component data to the client.

**Kind**: instance method of [<code>ComponentSubscription</code>](#ComponentSubscription)  
<a name="ComponentSubscription+toClientError"></a>

### componentSubscription.toClientError(error)
Sends error data to the client in case of component subscription error.

**Kind**: instance method of [<code>ComponentSubscription</code>](#ComponentSubscription)  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>Object</code> | The error object to be sent to the client. |

<a name="ComponentSubscription+updateComponent"></a>

### componentSubscription.updateComponent(mergeData)
Updates the component data by merging the provided data.

**Kind**: instance method of [<code>ComponentSubscription</code>](#ComponentSubscription)  

| Param | Type | Description |
| --- | --- | --- |
| mergeData | <code>Object</code> | The data object to be merged with the component. |

<a name="ComponentSubscription+setClientChangeListener"></a>

### componentSubscription.setClientChangeListener()
Sets up the client change listener for component updates.

**Kind**: instance method of [<code>ComponentSubscription</code>](#ComponentSubscription)  
<a name="ComponentSubscription+appendComponent"></a>

### componentSubscription.appendComponent()
Appends the current component subscription to the connection.

**Kind**: instance method of [<code>ComponentSubscription</code>](#ComponentSubscription)  
<a name="DocSubscription"></a>

## DocSubscription
Represents a subscription for a specific document in a collection.
Extends SocketSubscription class.

**Kind**: global class  

* [DocSubscription](#DocSubscription)
    * [new DocSubscription(setup, connection)](#new_DocSubscription_new)
    * [.type](#DocSubscription+type) : <code>string</code>
    * [.doc](#DocSubscription+doc) : <code>Object</code>
    * [.collectionName](#DocSubscription+collectionName) : <code>string</code>
    * [.filter](#DocSubscription+filter) : <code>Object</code>
    * [.trigger()](#DocSubscription+trigger) ÔçÆ <code>Object</code>
    * [.handler()](#DocSubscription+handler) ÔçÆ <code>Object</code>

<a name="new_DocSubscription_new"></a>

### new DocSubscription(setup, connection)
Creates an instance of DocSubscription.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | Configuration options for the subscription. |
| connection | <code>Object</code> | The connection object for managing the subscription. |
| setup.doc | <code>Object</code> | The document object associated with the subscription. |
| setup.collectionName | <code>string</code> | The name of the collection to which the document belongs. |
| setup.filter | <code>Object</code> | The filter object used to query the document from the collection. |

<a name="DocSubscription+type"></a>

### docSubscription.type : <code>string</code>
Type identifier for the subscription (document).

**Kind**: instance property of [<code>DocSubscription</code>](#DocSubscription)  
<a name="DocSubscription+doc"></a>

### docSubscription.doc : <code>Object</code>
The document object associated with the subscription.

**Kind**: instance property of [<code>DocSubscription</code>](#DocSubscription)  
<a name="DocSubscription+collectionName"></a>

### docSubscription.collectionName : <code>string</code>
The name of the collection to which the document belongs.

**Kind**: instance property of [<code>DocSubscription</code>](#DocSubscription)  
<a name="DocSubscription+filter"></a>

### docSubscription.filter : <code>Object</code>
The filter object used to query the document from the collection.

**Kind**: instance property of [<code>DocSubscription</code>](#DocSubscription)  
<a name="DocSubscription+trigger"></a>

### docSubscription.trigger() ÔçÆ <code>Object</code>
Triggers the subscription and sends the document data to the client.

**Kind**: instance method of [<code>DocSubscription</code>](#DocSubscription)  
**Returns**: <code>Object</code> - - The document object if found, or an error object if not found.  
<a name="DocSubscription+handler"></a>

### docSubscription.handler() ÔçÆ <code>Object</code>
Handles the document subscription request by querying the database and initializing the document object.

**Kind**: instance method of [<code>DocSubscription</code>](#DocSubscription)  
**Returns**: <code>Object</code> - - The initialized document object.  
**Throws**:

- Will throw an error if the document retrieval or initialization fails.

<a name="SocketServer"></a>

## SocketServer
Represents a socket server that manages socket connections and subscriptions.

**Kind**: global class  

* [SocketServer](#SocketServer)
    * [new SocketServer(setup)](#new_SocketServer_new)
    * [.io](#SocketServer+io) : <code>object</code>
    * [.port](#SocketServer+port) : <code>number</code>
    * [.connections](#SocketServer+connections) : [<code>Array.&lt;SocketConnection&gt;</code>](#SocketConnection)
    * [.subscriptions](#SocketServer+subscriptions) : <code>Array</code>
    * [.getConnection(connectionID)](#SocketServer+getConnection) ÔçÆ [<code>SocketConnection</code>](#SocketConnection) \| <code>undefined</code>

<a name="new_SocketServer_new"></a>

### new SocketServer(setup)
Creates a new instance of the SocketServer class.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object. |
| setup.hosts | <code>Array.&lt;string&gt;</code> | An array of allowed hosts for CORS configuration. |
| setup.port | <code>number</code> | The port on which the socket server will listen. Defaults to the value specified in the configuration. |

<a name="SocketServer+io"></a>

### socketServer.io : <code>object</code>
The socket.io server instance.

**Kind**: instance property of [<code>SocketServer</code>](#SocketServer)  
<a name="SocketServer+port"></a>

### socketServer.port : <code>number</code>
The port on which the socket server is running.

**Kind**: instance property of [<code>SocketServer</code>](#SocketServer)  
<a name="SocketServer+connections"></a>

### socketServer.connections : [<code>Array.&lt;SocketConnection&gt;</code>](#SocketConnection)
An array of active socket connections.

**Kind**: instance property of [<code>SocketServer</code>](#SocketServer)  
<a name="SocketServer+subscriptions"></a>

### socketServer.subscriptions : <code>Array</code>
An array of active subscriptions.

**Kind**: instance property of [<code>SocketServer</code>](#SocketServer)  
<a name="SocketServer+getConnection"></a>

### socketServer.getConnection(connectionID) ÔçÆ [<code>SocketConnection</code>](#SocketConnection) \| <code>undefined</code>
Retrieves a socket connection based on the provided connection ID.

**Kind**: instance method of [<code>SocketServer</code>](#SocketServer)  
**Returns**: [<code>SocketConnection</code>](#SocketConnection) \| <code>undefined</code> - - The socket connection with the given ID or undefined if not found.  

| Param | Type | Description |
| --- | --- | --- |
| connectionID | <code>string</code> | The unique identifier of the socket connection. |

<a name="SocketConnection"></a>

## SocketConnection
Manages socket connections and subscriptions.

**Kind**: global class  

* [SocketConnection](#SocketConnection)
    * [new SocketConnection(socket, serverInstance)](#new_SocketConnection_new)
    * [.socket](#SocketConnection+socket) : <code>Object</code>
    * [.subscriptions](#SocketConnection+subscriptions) : <code>Array</code>
    * [.serverInstance](#SocketConnection+serverInstance) ÔçÆ <code>Object</code>
    * [._serverInstance()](#SocketConnection+_serverInstance) ÔçÆ <code>Object</code>
    * [.init()](#SocketConnection+init)
    * [.onConnectionStatus()](#SocketConnection+onConnectionStatus)
    * [.emitConnectionStatus()](#SocketConnection+emitConnectionStatus)
    * [.subscribeDOC(setup)](#SocketConnection+subscribeDOC) ÔçÆ <code>Object</code>
    * [.subscribeComponent(setup)](#SocketConnection+subscribeComponent) ÔçÆ <code>Object</code>
    * [.appendComponent(subscription)](#SocketConnection+appendComponent) ÔçÆ <code>Object</code>
    * [.getComponent(subscriptionUID)](#SocketConnection+getComponent) ÔçÆ <code>Object</code>
    * [.getSubscription(subscriptionUID)](#SocketConnection+getSubscription) ÔçÆ <code>Object</code>
    * [.updateComponent(subscriptionUID, mergeData)](#SocketConnection+updateComponent) ÔçÆ <code>Object</code>

<a name="new_SocketConnection_new"></a>

### new SocketConnection(socket, serverInstance)
Creates an instance of SocketConnection.


| Param | Type | Description |
| --- | --- | --- |
| socket | <code>Object</code> | The socket object representing the connection. |
| serverInstance | <code>Object</code> | The server instance associated with the connection. |

<a name="SocketConnection+socket"></a>

### socketConnection.socket : <code>Object</code>
The socket object representing the connection.

**Kind**: instance property of [<code>SocketConnection</code>](#SocketConnection)  
<a name="SocketConnection+subscriptions"></a>

### socketConnection.subscriptions : <code>Array</code>
Array to store active subscriptions.

**Kind**: instance property of [<code>SocketConnection</code>](#SocketConnection)  
<a name="SocketConnection+serverInstance"></a>

### socketConnection.serverInstance ÔçÆ <code>Object</code>
Gets the server instance associated with the connection.

**Kind**: instance property of [<code>SocketConnection</code>](#SocketConnection)  
**Returns**: <code>Object</code> - - The server instance.  
<a name="SocketConnection+_serverInstance"></a>

### socketConnection.\_serverInstance() ÔçÆ <code>Object</code>
Returns the server instance associated with the connection.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
**Returns**: <code>Object</code> - - The server instance.  
<a name="SocketConnection+init"></a>

### socketConnection.init()
Initializes socket event listeners and connection status.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
<a name="SocketConnection+onConnectionStatus"></a>

### socketConnection.onConnectionStatus()
Handles 'connection:status' event by emitting connection status.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
<a name="SocketConnection+emitConnectionStatus"></a>

### socketConnection.emitConnectionStatus()
Emits connection status to the client.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
<a name="SocketConnection+subscribeDOC"></a>

### socketConnection.subscribeDOC(setup) ÔçÆ <code>Object</code>
Subscribes to a document based on the provided setup.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
**Returns**: <code>Object</code> - - The document subscription instance.  

| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | Configuration options for the document subscription. |

<a name="SocketConnection+subscribeComponent"></a>

### socketConnection.subscribeComponent(setup) ÔçÆ <code>Object</code>
Subscribes to a component based on the provided setup.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
**Returns**: <code>Object</code> - - The component subscription instance.  

| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | Configuration options for the component subscription. |

<a name="SocketConnection+appendComponent"></a>

### socketConnection.appendComponent(subscription) ÔçÆ <code>Object</code>
Appends a component subscription to the subscribed components list.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
**Returns**: <code>Object</code> - - The component object.  

| Param | Type | Description |
| --- | --- | --- |
| subscription | <code>Object</code> | The component subscription instance. |

<a name="SocketConnection+getComponent"></a>

### socketConnection.getComponent(subscriptionUID) ÔçÆ <code>Object</code>
Gets the component object associated with the provided subscription UID.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
**Returns**: <code>Object</code> - - The component object.  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionUID | <code>string</code> | The unique identifier for the component subscription. |

<a name="SocketConnection+getSubscription"></a>

### socketConnection.getSubscription(subscriptionUID) ÔçÆ <code>Object</code>
Gets the subscription object associated with the provided subscription UID.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
**Returns**: <code>Object</code> - - The subscription object.  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionUID | <code>string</code> | The unique identifier for the subscription. |

<a name="SocketConnection+updateComponent"></a>

### socketConnection.updateComponent(subscriptionUID, mergeData) ÔçÆ <code>Object</code>
Updates the component associated with the provided subscription UID using merge data.

**Kind**: instance method of [<code>SocketConnection</code>](#SocketConnection)  
**Returns**: <code>Object</code> - - The updated component object.  

| Param | Type | Description |
| --- | --- | --- |
| subscriptionUID | <code>string</code> | The unique identifier for the component subscription. |
| mergeData | <code>Object</code> | The data used for merging and updating the component. |

<a name="SocketSubscription"></a>

## SocketSubscription
Represents a subscription in a socket connection.

**Kind**: global class  

* [SocketSubscription](#SocketSubscription)
    * [new SocketSubscription(setup, connection)](#new_SocketSubscription_new)
    * [.connection](#SocketSubscription+connection) : <code>Object</code>
    * [.socket](#SocketSubscription+socket) ÔçÆ <code>Object</code> \| <code>undefined</code>

<a name="new_SocketSubscription_new"></a>

### new SocketSubscription(setup, connection)
Creates an instance of SocketSubscription.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | Configuration options for the subscription. |
| connection | <code>Object</code> | The socket connection associated with the subscription. |

<a name="SocketSubscription+connection"></a>

### socketSubscription.connection : <code>Object</code>
The socket connection associated with the subscription.

**Kind**: instance property of [<code>SocketSubscription</code>](#SocketSubscription)  
<a name="SocketSubscription+socket"></a>

### socketSubscription.socket ÔçÆ <code>Object</code> \| <code>undefined</code>
Gets the socket object associated with the subscription.

**Kind**: instance property of [<code>SocketSubscription</code>](#SocketSubscription)  
**Returns**: <code>Object</code> \| <code>undefined</code> - - The socket object if the connection is available, otherwise undefined.  
<a name="XMLManager"></a>

## XMLManager
Manages operations related to XML files, including parsing, loading, and saving.

**Kind**: global class  

* [XMLManager](#XMLManager)
    * [new XMLManager(options)](#new_XMLManager_new)
    * [.fullPath](#XMLManager+fullPath) : <code>string</code>
    * [.fullPathArray](#XMLManager+fullPathArray) : <code>Array</code>
    * [.inputFileName](#XMLManager+inputFileName) : <code>string</code>
    * [.outputFileName](#XMLManager+outputFileName) : <code>string</code>
    * [.getParsedXML([path])](#XMLManager+getParsedXML) ÔçÆ <code>Promise.&lt;(Object\|Error)&gt;</code>
    * [.getFile([filePath])](#XMLManager+getFile) ÔçÆ <code>Promise.&lt;(string\|Error)&gt;</code>
    * [.parseFile(stringData)](#XMLManager+parseFile) ÔçÆ <code>Promise.&lt;(Object\|Error)&gt;</code>
    * [.saveFile(obj, [path])](#XMLManager+saveFile) ÔçÆ <code>Promise.&lt;(string\|Error)&gt;</code>

<a name="new_XMLManager_new"></a>

### new XMLManager(options)
Creates an instance of XMLManager.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Configuration options for XMLManager. |
| options.fullPath | <code>string</code> | The full path to the XML file. |
| options.outputFileName | <code>string</code> | The name of the output XML file (optional). |

<a name="XMLManager+fullPath"></a>

### xmlManager.fullPath : <code>string</code>
The full path to the XML file.

**Kind**: instance property of [<code>XMLManager</code>](#XMLManager)  
<a name="XMLManager+fullPathArray"></a>

### xmlManager.fullPathArray : <code>Array</code>
The array containing individual parts of the full path.

**Kind**: instance property of [<code>XMLManager</code>](#XMLManager)  
<a name="XMLManager+inputFileName"></a>

### xmlManager.inputFileName : <code>string</code>
The input file name extracted from the full path.

**Kind**: instance property of [<code>XMLManager</code>](#XMLManager)  
<a name="XMLManager+outputFileName"></a>

### xmlManager.outputFileName : <code>string</code>
The name of the output XML file.

**Kind**: instance property of [<code>XMLManager</code>](#XMLManager)  
<a name="XMLManager+getParsedXML"></a>

### xmlManager.getParsedXML([path]) ÔçÆ <code>Promise.&lt;(Object\|Error)&gt;</code>
Retrieves and parses the XML file located at the specified path.

**Kind**: instance method of [<code>XMLManager</code>](#XMLManager)  
**Returns**: <code>Promise.&lt;(Object\|Error)&gt;</code> - - A promise that resolves with the parsed XML object or an Error object if parsing fails.  

| Param | Type | Description |
| --- | --- | --- |
| [path] | <code>string</code> | The path to the XML file (optional, uses the instance's fullPath if not provided). |

<a name="XMLManager+getFile"></a>

### xmlManager.getFile([filePath]) ÔçÆ <code>Promise.&lt;(string\|Error)&gt;</code>
Reads the content of the specified file path.

**Kind**: instance method of [<code>XMLManager</code>](#XMLManager)  
**Returns**: <code>Promise.&lt;(string\|Error)&gt;</code> - - A promise that resolves with the file content or an Error object if reading fails.  

| Param | Type | Description |
| --- | --- | --- |
| [filePath] | <code>string</code> | The path to the file to be read (optional, uses the instance's fullPath if not provided). |

<a name="XMLManager+parseFile"></a>

### xmlManager.parseFile(stringData) ÔçÆ <code>Promise.&lt;(Object\|Error)&gt;</code>
Parses the given XML string into an object.

**Kind**: instance method of [<code>XMLManager</code>](#XMLManager)  
**Returns**: <code>Promise.&lt;(Object\|Error)&gt;</code> - - A promise that resolves with the parsed XML object or an Error object if parsing fails.  

| Param | Type | Description |
| --- | --- | --- |
| stringData | <code>string</code> | The XML string to be parsed. |

<a name="XMLManager+saveFile"></a>

### xmlManager.saveFile(obj, [path]) ÔçÆ <code>Promise.&lt;(string\|Error)&gt;</code>
Saves the given object as an XML file at the specified path.

**Kind**: instance method of [<code>XMLManager</code>](#XMLManager)  
**Returns**: <code>Promise.&lt;(string\|Error)&gt;</code> - - A promise that resolves with the saved XML content or an Error object if saving fails.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to be converted and saved as XML. |
| [path] | <code>string</code> | The path where the XML file will be saved (optional, uses the instance's fullPath if not provided). |

<a name="ValidateSchema"></a>

## ValidateSchema
Utility class for validating and handling MongoDB schemas in the application.

**Kind**: global class  

* [ValidateSchema](#ValidateSchema)
    * [new ValidateSchema(rules)](#new_ValidateSchema_new)
    * [.validate(data, [returnValidObj])](#ValidateSchema+validate) ÔçÆ <code>ValidationError</code> \| <code>Object</code>
    * [.placeDefault([customSelf])](#ValidateSchema+placeDefault) ÔçÆ <code>Object</code>

<a name="new_ValidateSchema_new"></a>

### new ValidateSchema(rules)
Constructs a ValidateSchema instance based on the provided rules.

**Throws**:

- <code>Error</code> - Throws an error if the provided rules are invalid or the collection name is not found.


| Param | Type | Description |
| --- | --- | --- |
| rules | <code>string</code> \| <code>Object</code> | A string indicating the collection name to use as schema, or an object specifying the Mongoose schema configurations. |

<a name="ValidateSchema+validate"></a>

### validateSchema.validate(data, [returnValidObj]) ÔçÆ <code>ValidationError</code> \| <code>Object</code>
Validates the provided data against the schema and returns the validation result.

**Kind**: instance method of [<code>ValidateSchema</code>](#ValidateSchema)  
**Returns**: <code>ValidationError</code> \| <code>Object</code> - - If `returnValidObj` is true, returns the validated object.
Otherwise, returns the validation error object.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>Object</code> |  | The data to be validated against the schema. |
| [returnValidObj] | <code>boolean</code> | <code>false</code> | A flag indicating whether to return the validated object. |

<a name="ValidateSchema+placeDefault"></a>

### validateSchema.placeDefault([customSelf]) ÔçÆ <code>Object</code>
Populates the schema fields with their default values if not provided in the input object.

**Kind**: instance method of [<code>ValidateSchema</code>](#ValidateSchema)  
**Returns**: <code>Object</code> - - The populated object with default values.  

| Param | Type | Description |
| --- | --- | --- |
| [customSelf] | <code>Object</code> | The custom object to be populated (optional, uses the instance itself by default). |

<a name="ValidationBase"></a>

## ValidationBase
Utility class for validating and manipulating data types and structures.

**Kind**: global class  

* [ValidationBase](#ValidationBase)
    * [new ValidationBase(value)](#new_ValidationBase_new)
    * _instance_
        * [.value](#ValidationBase+value) ÔçÆ <code>\*</code>
        * [.setValue(newValue)](#ValidationBase+setValue) ÔçÆ <code>\*</code>
        * [.string()](#ValidationBase+string) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
        * [.number()](#ValidationBase+number) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
        * [.array()](#ValidationBase+array) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
        * [.object()](#ValidationBase+object) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
        * [.function()](#ValidationBase+function) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
        * [.path([zeroIsFalse])](#ValidationBase+path) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
        * [.filled(zeroIsFalse)](#ValidationBase+filled) ÔçÆ <code>Object</code>
        * [.numberFilled()](#ValidationBase+numberFilled) ÔçÆ <code>boolean</code>
        * [.stringFilled()](#ValidationBase+stringFilled) ÔçÆ <code>boolean</code>
        * [.objectFilled()](#ValidationBase+objectFilled) ÔçÆ <code>boolean</code>
        * [.arrayFilled()](#ValidationBase+arrayFilled) ÔçÆ <code>boolean</code>
        * [.reject()](#ValidationBase+reject) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
        * [.eval([dontReturnValue])](#ValidationBase+eval) ÔçÆ <code>boolean</code> \| <code>\*</code>
    * _static_
        * [.isObjectID(obj)](#ValidationBase.isObjectID) ÔçÆ <code>boolean</code>
        * [.isCompleteDoc(obj)](#ValidationBase.isCompleteDoc) ÔçÆ <code>boolean</code>

<a name="new_ValidationBase_new"></a>

### new ValidationBase(value)
Constructs a ValidationBase instance with the provided value for validation.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to be validated. |

<a name="ValidationBase+value"></a>

### validationBase.value ÔçÆ <code>\*</code>
Gets the current value being validated.

**Kind**: instance property of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>\*</code> - - The value being validated.  
<a name="ValidationBase+setValue"></a>

### validationBase.setValue(newValue) ÔçÆ <code>\*</code>
Sets a new value for validation.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>\*</code> - - The new value after setting.  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>\*</code> | The new value to be set for validation. |

<a name="ValidationBase+string"></a>

### validationBase.string() ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
Validates if the value is a string.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: [<code>ValidationBase</code>](#ValidationBase) - - Returns the current instance if the value is a string; otherwise, rejects the validation.  
<a name="ValidationBase+number"></a>

### validationBase.number() ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
Validates if the value is a number and not NaN.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: [<code>ValidationBase</code>](#ValidationBase) - - Returns the current instance if the value is a valid number; otherwise, rejects the validation.  
<a name="ValidationBase+array"></a>

### validationBase.array() ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
Validates if the value is an array.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: [<code>ValidationBase</code>](#ValidationBase) - - Returns the current instance if the value is an array; otherwise, rejects the validation.  
<a name="ValidationBase+object"></a>

### validationBase.object() ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
Validates if the value is an object (excluding arrays).

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: [<code>ValidationBase</code>](#ValidationBase) - - Returns the current instance if the value is a non-array object; otherwise, rejects the validation.  
<a name="ValidationBase+function"></a>

### validationBase.function() ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
Validates if the value is a function.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: [<code>ValidationBase</code>](#ValidationBase) - - Returns the current instance if the value is a function; otherwise, rejects the validation.  
<a name="ValidationBase+path"></a>

### validationBase.path([zeroIsFalse]) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
Validates if the value exists and is not null, undefined, empty string, empty object, empty array, or zero (if zeroIsFalse is true for numbers).

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: [<code>ValidationBase</code>](#ValidationBase) - - Returns the current instance if the value is non-empty; otherwise, rejects the validation.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [zeroIsFalse] | <code>boolean</code> | <code>false</code> | A flag indicating whether zero should be considered a false value for numbers. |

<a name="ValidationBase+filled"></a>

### validationBase.filled(zeroIsFalse) ÔçÆ <code>Object</code>
Determines if the current value is considered filled based on its type and optional condition.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>Object</code> - - Returns the current object instance if the value is considered filled, otherwise rejects the object.  

| Param | Type | Description |
| --- | --- | --- |
| zeroIsFalse | <code>boolean</code> | A flag indicating whether the value 0 should be treated as false (optional). |

<a name="ValidationBase+numberFilled"></a>

### validationBase.numberFilled() ÔçÆ <code>boolean</code>
Validates if the number is non-zero and not NaN.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>boolean</code> - - Returns `true` if the number is non-zero and not NaN; otherwise, `false`.  
<a name="ValidationBase+stringFilled"></a>

### validationBase.stringFilled() ÔçÆ <code>boolean</code>
Validates if the string is non-empty.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>boolean</code> - - Returns `true` if the string is non-empty; otherwise, `false`.  
<a name="ValidationBase+objectFilled"></a>

### validationBase.objectFilled() ÔçÆ <code>boolean</code>
Validates if the object is non-empty (not null, undefined, or empty object).

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>boolean</code> - - Returns `true` if the object is non-empty; otherwise, `false`.  
<a name="ValidationBase+arrayFilled"></a>

### validationBase.arrayFilled() ÔçÆ <code>boolean</code>
Validates if the array is non-empty.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>boolean</code> - - Returns `true` if the array is non-empty; otherwise, `false`.  
<a name="ValidationBase+reject"></a>

### validationBase.reject() ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
Marks the validation as unsuccessful and sets the success flag to false.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: [<code>ValidationBase</code>](#ValidationBase) - - Returns the current instance after marking it as unsuccessful.  
<a name="ValidationBase+eval"></a>

### validationBase.eval([dontReturnValue]) ÔçÆ <code>boolean</code> \| <code>\*</code>
Checks if the validation was successful and evaluates the result.

**Kind**: instance method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>boolean</code> \| <code>\*</code> - - Returns `true` if successful, the validated value if `dontReturnValue` is false, 
or `false` on failure.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [dontReturnValue] | <code>boolean</code> | <code>false</code> | A flag indicating whether to return the value on success. |

<a name="ValidationBase.isObjectID"></a>

### ValidationBase.isObjectID(obj) ÔçÆ <code>boolean</code>
Static method to determine if the provided object is a MongoDB ObjectID.

**Kind**: static method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>boolean</code> - - `true` if the object is a MongoDB ObjectID, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object to be checked. |

<a name="ValidationBase.isCompleteDoc"></a>

### ValidationBase.isCompleteDoc(obj) ÔçÆ <code>boolean</code>
Static method to determine if the provided object IS A COMPLETE DOC

**Kind**: static method of [<code>ValidationBase</code>](#ValidationBase)  
**Returns**: <code>boolean</code> - - `true` if the object is a MongoDB ObjectID, `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>\*</code> | The object to be checked. |

<a name="ApiHealthCheck"></a>

## ApiHealthCheck : [<code>Endpoint</code>](#Endpoint)
Represents a controller endpoint for to check if the API is connected and working properly.

**Kind**: global variable  
<a name="AuthLogin"></a>

## AuthLogin : [<code>Endpoint</code>](#Endpoint)
Represents a controller endpoint to authenticate an user.

**Kind**: global variable  
<a name="AuthRegister"></a>

## AuthRegister : [<code>Endpoint</code>](#Endpoint)
Represents a controller endpoint for register an user.

**Kind**: global variable  
<a name="CollectionCreate"></a>

## CollectionCreate : [<code>Endpoint</code>](#Endpoint)
Represents a controller endpoint for creating a document in a collection.

**Kind**: global variable  
<a name="CollectionDelete"></a>

## CollectionDelete : [<code>Endpoint</code>](#Endpoint)
Represents a controller endpoint for deleting a document in a collection.

**Kind**: global variable  
<a name="CollectionGetDoc"></a>

## CollectionGetDoc : [<code>Endpoint</code>](#Endpoint)
Represents a controller endpoint for getting a document in a collection.

**Kind**: global variable  
<a name="CollectionGetQuery"></a>

## CollectionGetQuery : [<code>Endpoint</code>](#Endpoint)
Represents a controller endpoint for listing documents in a collection.

**Kind**: global variable  
<a name="CollectionUpdateDocument"></a>

## CollectionUpdateDocument : [<code>Endpoint</code>](#Endpoint)
Represents a controller endpoint for updating a document in a collection.

**Kind**: global variable  
<a name="ajax - Does AJAX requests"></a>

## ajax - Does AJAX requests
**Kind**: global variable  
<a name="Resource - Resource instance to call text and other resources."></a>

## Resource - Resource instance to call text and other resources.
**Kind**: global variable  
<a name="toolsCLI - CLI tools to use in everywhere."></a>

## toolsCLI - CLI tools to use in everywhere.
**Kind**: global variable  
<a name="Log - To log errors and any other log."></a>

## Log - To log errors and any other log.
**Kind**: global variable  
<a name="Models"></a>

## Models : <code>object</code>
Represents an authentication bucket associated with a user.

**Kind**: global namespace  
**Extends**: <code>\_Global</code>  
<a name="Models"></a>

## Models : <code>object</code>
Represents a user in the application.

**Kind**: global namespace  
**Extends**: <code>\_Global</code>  
<a name="Models"></a>

## Models : <code>object</code>
Model to set the events that will trigger actions throughout the app.

**Kind**: global namespace  
<a name="Models"></a>

## Models : <code>object</code>
Represents an error log entry in the application.

**Kind**: global namespace  
**Extends**: [<code>LogBase</code>](#LogBase)  
<a name="Models"></a>

## Models : <code>object</code>
Represents a base class for logging in the application.

**Kind**: global namespace  
<a name="Models"></a>

## Models : <code>object</code>
Represents a log entry with a timestamp, activity type, and description.

**Kind**: global namespace  
<a name="Models"></a>

## Models : <code>object</code>
Represents an API request handler which validates incoming request body against provided schema.

**Kind**: global namespace  
**Extends**: [<code>ValidateSchema</code>](#ValidateSchema)  
**Throws**:

- <code>ValidationError</code> If the request body fails schema validation.


| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | The request object. |
| bodySchema | <code>Object</code> | The schema object to validate the request body against. |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| originalRequest | <code>Object</code> | The original request object. |
| body | <code>Object</code> | The validated request body object. |

<a name="Models"></a>

## Models : <code>object</code>
Represents a schema for MongoDB database, including methods for initializing queries, events, and classes.

**Kind**: global namespace  
**Throws**:

- <code>Error</code> If initialization fails.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object containing schema details and configurations. |

<a name="Models"></a>

## Models : <code>object</code>
Represents a collection in the database.

**Kind**: global namespace  
**Extends**: <code>SchemaDB</code>  
<a name="Models"></a>

## Models : <code>object</code>
Represents a field in a collection.

**Kind**: global namespace  
<a name="Models"></a>

## Models : <code>object</code>
Represents an API endpoint configuration.

**Kind**: global namespace  
<a name="Models"></a>

## Models : <code>object</code>
Represents the reference configuration for a schema field.

**Kind**: global namespace  
<a name="Models"></a>

## Models : <code>object</code>
Represents a success response object used to convey successful API responses.

**Kind**: global namespace  
<a name="Services"></a>

## Services : <code>object</code>
Module providing CRUD (Create, Read, Update, Delete) operations for interacting with a database.

**Kind**: global namespace  
<a name="Services"></a>

## Services : <code>object</code>
Represents a database server with specified configurations and collections.

**Kind**: global namespace  
<a name="Services"></a>

## Services : <code>object</code>
Utility class for file system operations.

**Kind**: global namespace  
<a name="Services"></a>

## Services : <code>object</code>
Represents a command line prompt utility.

**Kind**: global namespace  
<a name="Services"></a>

## Services : <code>object</code>
Represents the main server class for the API.

**Kind**: global namespace  
<a name="Services"></a>

## Services : <code>object</code>
Module providing functionality for handling socket connections and managing subscriptions.

**Kind**: global namespace  
<a name="navDefaultQuestions"></a>

## navDefaultQuestions : <code>Object</code>
Default navigation questions for the ViewNavigator class.

**Kind**: global constant  
<a name="defaultRules"></a>

## defaultRules : <code>Object</code>
Default validation rules for the Component class.

**Kind**: global constant  
<a name="oid"></a>

## oid() ÔçÆ <code>boolean</code>
Method that evaluate if the provided object on "Object(objectToEval)" is a mongoose ObjectID or not.

**Kind**: global function  
<a name="+getPath"></a>

## #getPath(path) ÔçÆ <code>\*</code>
Method that that safely gets the values of an object property without throw errors bay an undefined path.

**Kind**: global function  
**Returns**: <code>\*</code> - - Anything that can be stored on the provided path  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> \| <code>array.&lt;string&gt;</code> | Can be a string path for the object property with each property separated by a ".", or can be an array of string where each string is a path. |

<a name="getObjectPath"></a>

## getObjectPath(obj, path) ÔçÆ <code>\*</code>
Retrieves a value from a nested object based on the specified object path.

**Kind**: global function  
**Returns**: <code>\*</code> - - The value at the specified object path or undefined if the path does not exist.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue accessing the object path.


| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> | The object to extract the value from. |
| path | <code>string</code> \| <code>Array</code> | The path to the desired property. Can be a string with dot notation or an array of keys. |

<a name="convertToMillis"></a>

## convertToMillis(value, unit) ÔçÆ <code>number</code>
Converts a numeric value from a specific time unit to milliseconds.

**Kind**: global function  
**Returns**: <code>number</code> - - The converted value in milliseconds.  
**Throws**:

- <code>Error</code> - Throws an error if the input value or unit is invalid.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The numeric value to be converted. |
| unit | <code>string</code> | The time unit of the input value (minute, hour, day, week, month, year). |

<a name="convertMillisTo"></a>

## convertMillisTo(value, unit) ÔçÆ <code>number</code>
Converts a numeric value from milliseconds to a specific time unit.

**Kind**: global function  
**Returns**: <code>number</code> - - The converted value in the specified time unit.  
**Throws**:

- <code>Error</code> - Throws an error if the input value or unit is invalid.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The numeric value to be converted (in milliseconds). |
| unit | <code>string</code> | The desired time unit of the output value (minute, hour, day, week, month, year). |

<a name="isCollectionExist"></a>

## isCollectionExist(collection) ÔçÆ <code>string</code> \| <code>undefined</code>
Checks if a collection exists in the MongoDB database.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - - The name of the existing collection or undefined if the collection does not exist.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue accessing the database.


| Param | Type | Description |
| --- | --- | --- |
| collection | <code>string</code> | The name of the collection to check. |

<a name="isDocExist"></a>

## isDocExist(collectionName, filter) ÔçÆ <code>Promise.&lt;boolean&gt;</code>
Checks if a document exists in a specific collection based on the provided filter.

**Kind**: global function  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - - A promise that resolves to true if the document exists, false otherwise.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue accessing the database.


| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to check. |
| filter | <code>Object</code> | The filter object to search for the document. |

<a name="getCollectionModel"></a>

## getCollectionModel(collection) ÔçÆ <code>Model</code>
Retrieves the Mongoose model for a given collection name.

**Kind**: global function  
**Returns**: <code>Model</code> - - The Mongoose model for the specified collection.  
**Throws**:

- <code>Error</code> - Throws an error if the collection does not exist.


| Param | Type | Description |
| --- | --- | --- |
| collection | <code>string</code> | The name of the collection to retrieve the model for. |

<a name="createCounter"></a>

## createCounter(collection)
Creates a counter document for a specific collection if it does not already exist.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue creating the counter document.


| Param | Type | Description |
| --- | --- | --- |
| collection | <code>Object</code> | The collection object containing 'name' and 'symbol' properties. |

<a name="increaseCounter"></a>

## increaseCounter(collection) ÔçÆ <code>Object</code>
Increases the counter value for a specific collection and returns the updated counter object.

**Kind**: global function  
**Returns**: <code>Object</code> - - The updated counter object.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue increasing the counter.


| Param | Type | Description |
| --- | --- | --- |
| collection | <code>string</code> | The name of the collection to increase the counter for. |

<a name="increaseLog"></a>

## increaseLog(logUID) ÔçÆ <code>Object</code>
Increases the 'groupedLogs' property of a specific log document and returns the updated log object.

**Kind**: global function  
**Returns**: <code>Object</code> - - The updated log object.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue increasing the log property.


| Param | Type | Description |
| --- | --- | --- |
| logUID | <code>string</code> | The unique identifier of the log document to increase the property for. |

<a name="increaseDocProp"></a>

## increaseDocProp(collectionName, filter, data) ÔçÆ <code>Object</code>
Increases specified properties of a document based on the provided filter and data object.

**Kind**: global function  
**Returns**: <code>Object</code> - - The updated document object.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue updating the document properties.


| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to update the document in. |
| filter | <code>Object</code> | The filter object to match the document. |
| data | <code>Object</code> | The data object containing properties to be incremented. |

<a name="pickQueryType"></a>

## pickQueryType(filter, type) ÔçÆ <code>string</code>
Determines the type of query based on the provided filter and the desired query type.

**Kind**: global function  
**Returns**: <code>string</code> - - The determined query type ('one' or 'many').  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>\*</code> | The filter object to analyze. |
| type | <code>string</code> | The desired query type ('one' for single document, 'many' for multiple documents). |

<a name="treatFilter"></a>

## treatFilter(filter) ÔçÆ <code>Object</code>
Validates and transforms a filter object to a format suitable for querying the database.

**Kind**: global function  
**Returns**: <code>Object</code> - - The transformed filter object suitable for database queries.  
**Throws**:

- <code>Error</code> - Throws an error if the filter is invalid.


| Param | Type | Description |
| --- | --- | --- |
| filter | <code>string</code> \| <code>Object</code> | The filter to be validated and transformed. |

<a name="findRelFields"></a>

## findRelFields(schema, exclude, levels, currentLevel) ÔçÆ <code>Array</code>
Finds and returns fields in a Mongoose schema that are references to other schemas.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of objects representing related fields and their respective schemas.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue analyzing the schema.


| Param | Type | Description |
| --- | --- | --- |
| schema | <code>Object</code> | The Mongoose schema object to search for related fields. |
| exclude | <code>Array</code> | An array of field names to exclude from the result. |
| levels | <code>number</code> | The number of levels to search for related fields (default is 1). |
| currentLevel | <code>number</code> | The current level of recursion (default is 1). |

<a name="createEncryptFields"></a>

## createEncryptFields(context) ÔçÆ <code>Object</code>
Encrypts specified fields in the given context object and adds encrypted values to the context of Mongoose Event.

**Kind**: global function  
**Returns**: <code>Object</code> - Updated context object with encrypted fields.  
**Throws**:

- <code>Error</code> If there's an error during encryption, it is caught and logged.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> | The context object containing data and encryptedFields property coming for the Mongoose Event. |

<a name="updateEncryptFields"></a>

## updateEncryptFields(context)
Updates encrypted fields in the given context object with new encrypted values of Mongoose Event.

**Kind**: global function  
**Throws**:

- <code>Error</code> If there's an error during encryption update, it is caught and logged.


| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> | The context object containing data, schema, and _update property coming for the Mongoose Event. |

<a name="preSave"></a>

## preSave(next)
Middleware function executed before saving a document.
Increments the counter for the current collection and sets index and cod fields.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue incrementing the counter or setting fields.


| Param | Type | Description |
| --- | --- | --- |
| next | <code>function</code> | The function to be called to proceed to the next middleware in the stack. |

<a name="preUpdateOne"></a>

## preUpdateOne(next)
Middleware function executed before updating a single document.
Updates the modifiedAt timestamp and handles relational updates.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue updating the document or handling relationships.


| Param | Type | Description |
| --- | --- | --- |
| next | <code>function</code> | The function to be called to proceed to the next middleware in the stack. |

<a name="postUpdateOne"></a>

## postUpdateOne()
Middleware function executed after updating a single document.
Emits events based on the updated document's status and filter.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue emitting events.

<a name="postSave"></a>

## postSave()
Middleware function executed after saving a document.
Handles relational updates and emits a create event for the collection.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue handling relationships or emitting events.

<a name="preDelete"></a>

## preDelete(next)
Middleware function executed before deleting a document.
Handles relational updates.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue handling relationships.


| Param | Type | Description |
| --- | --- | --- |
| next | <code>function</code> | The function to be called to proceed to the next middleware in the stack. |

<a name="postDelete"></a>

## postDelete()
Middleware function executed after deleting a document.
Does not perform any specific action.

**Kind**: global function  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue handling the post-delete process.

<a name="readable"></a>

## readable(options) ÔçÆ <code>Array</code>
A function to make query results readable by converting MongoDB documents to plain JavaScript objects.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of plain JavaScript objects representing the query results.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue converting the documents.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Additional options for query results (not used in the function). |

<a name="getUpdateProps"></a>

## getUpdateProps() ÔçÆ <code>Object</code>
Extracts the update properties from the current update operation object.

**Kind**: global function  
**Returns**: <code>Object</code> - - An object containing the update properties to be applied to the document.  
<a name="paginate"></a>

## paginate(options) ÔçÆ <code>Object</code>
Paginates query results based on the provided options.

**Kind**: global function  
**Returns**: <code>Object</code> - - The updated query object with pagination applied.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue with the pagination query.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Pagination options including 'views', 'page', and 'seeMore'. |

<a name="populateAll"></a>

## populateAll(options) ÔçÆ <code>Object</code>
Populates all specified relational fields in the query results.

**Kind**: global function  
**Returns**: <code>Object</code> - - The updated query object with relational fields populated.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue populating relational fields.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Population options including 'select', 'exclude', and 'levels'. |

<a name="initialize"></a>

## initialize(populate) ÔçÆ <code>Array</code> \| <code>Object</code>
Initializes query results by converting MongoDB documents to objects.

**Kind**: global function  
**Returns**: <code>Array</code> \| <code>Object</code> - - An array of initialized objects or a single initialized object representing the query results.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue initializing the documents.


| Param | Type | Description |
| --- | --- | --- |
| populate | <code>boolean</code> | Flag indicating whether to populate related fields in the documents. |

<a name="onCreate"></a>

## onCreate() ÔçÆ <code>Array</code>
Handles relational updates when a new document is created.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of updated documents after the relational updates.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue handling the updates.

<a name="onUpdate"></a>

## onUpdate() ÔçÆ <code>Array</code>
Handles relational updates when an existing document is updated.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of updated documents after the relational updates.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue handling the updates.

<a name="onDelete"></a>

## onDelete() ÔçÆ <code>Array</code>
Handles relational updates when a document is deleted.

**Kind**: global function  
**Returns**: <code>Array</code> - - An array of updated documents after the relational updates.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue handling the updates.

<a name="isObjectID"></a>

## isObjectID(value) ÔçÆ <code>boolean</code>
Checks if the provided value is an ObjectId or an array of ObjectIds.

**Kind**: global function  
**Returns**: <code>boolean</code> - - True if the value is an ObjectId or an array of ObjectIds, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Array</code> \| <code>Object</code> | The value to be checked. |

<a name="isAuthenticated"></a>

## isAuthenticated(token) ÔçÆ <code>boolean</code>
Checks if the provided token corresponds to an active authenticated session.

**Kind**: global function  
**Returns**: <code>boolean</code> - - True if the token is valid and corresponds to an active session, false otherwise.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue with the authentication process.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The token to be authenticated. |

<a name="createUserCLISession"></a>

## createUserCLISession(user) ÔçÆ <code>Object</code>
Creates or updates a user's session in the command-line interface (CLI) environment.

**Kind**: global function  
**Returns**: <code>Object</code> - - An object indicating the success or failure of the session creation/update process.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue creating or updating the user's session.


| Param | Type | Description |
| --- | --- | --- |
| user | <code>Object</code> | The user object containing session-related information. |

<a name="getSessionCurrentUser"></a>

## getSessionCurrentUser() ÔçÆ <code>string</code> \| <code>undefined</code>
Retrieves the current user ID from the CLI session.

**Kind**: global function  
**Returns**: <code>string</code> \| <code>undefined</code> - - The ID of the current user if available, undefined otherwise.  
**Throws**:

- <code>Error</code> - Throws an error if there is an issue retrieving the current user ID.

<a name="repeat"></a>

## repeat() ÔçÆ <code>Promise</code>
Calls the `repeat` event and goes back to the current question.

**Kind**: global function  
**Returns**: <code>Promise</code> - A promise that resolves with the result of calling `goTo(this.current.id)`.  
**Throws**:

- Throws an error if an error occurs when calling the `repeat` event.

<a name="setListener"></a>

## setListener(eventName) ÔçÆ <code>void</code>
Sets a new listener for the provided address

**Kind**: global function  
**Returns**: <code>void</code> - - Return nothing.  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | Name of the event. |

**Example**  
```js
-> `setListener('onTrigger', () => takeAnAction())`
```
<a name="overrideListener"></a>

## overrideListener() ÔçÆ <code>Promise</code>
Override a listerner on the PoolForm.

**Kind**: global function  
**Returns**: <code>Promise</code> - -  
**Throws**:

- Throws an error if an error occurs.

<a name="end"></a>

## end() ÔçÆ <code>Promise</code>
Calls the `end` event and goes back to the current question.

**Kind**: global function  
**Returns**: <code>Promise</code> - -  
**Throws**:

- Throws an error if an error occurs when calling the `end` event.

<a name="create"></a>

## create(collectionName, data, [options]) ÔçÆ <code>Promise.&lt;Object&gt;</code>
Creates a new document in the specified collection.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The created document or a draft object, if specified.  
**Throws**:

- <code>Error.Log</code> If an error occurs during document creation.


| Param | Type | Description |
| --- | --- | --- |
| collectionName | <code>string</code> | The name of the collection to create the document in. |
| data | <code>Object</code> | The data to be added to the document. |
| [options] | <code>Object</code> | Additional options for document creation. |
| [options.isDraft] | <code>boolean</code> | Indicates if the document is a draft. |

<a name="query"></a>

## query(setup) ÔçÆ <code>Query</code>
Performs a query on the specified collection based on the provided filter and sort options.

**Kind**: global function  
**Returns**: <code>Query</code> - The query result.  
**Throws**:

- <code>Error.Log</code> If the specified collection schema is not found or an error occurs during querying.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The query setup object. |
| setup.collectionName | <code>string</code> | The name of the collection to query. |
| [setup.filter] | <code>Object</code> | The filter criteria for the query. |
| [setup.sort] | <code>Object</code> | The sort criteria for the query. |

<a name="getDoc"></a>

## getDoc(setup) ÔçÆ <code>Object</code> \| <code>null</code>
Retrieves a single document from the specified collection based on the provided filter.

**Kind**: global function  
**Returns**: <code>Object</code> \| <code>null</code> - The retrieved document or null if no document is found.  
**Throws**:

- <code>Error.Log</code> If the specified collection schema is not found or an error occurs during document retrieval.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The setup object for retrieving the document. |
| setup.collectionName | <code>string</code> | The name of the collection to retrieve the document from. |
| [setup.filter] | <code>Object</code> | The filter criteria for retrieving the document. |

<a name="update"></a>

## update(setup) ÔçÆ <code>Promise.&lt;(Object\|Array.&lt;Object&gt;)&gt;</code>
Updates documents in the specified collection based on the provided filter and update data.

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Object\|Array.&lt;Object&gt;)&gt;</code> - The updated document(s) or success status, based on the update type and options.  
**Throws**:

- <code>Error.Log</code> If an error occurs during document update.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The update setup object. |
| setup.type | <code>string</code> | The type of update ('one' or 'many'). |
| setup.collectionName | <code>string</code> | The name of the collection to update documents in. |
| setup.filter | <code>Object</code> | The filter criteria for updating documents. |
| setup.data | <code>Object</code> | The update data for the documents. |
| [setup.options] | <code>Object</code> | Additional options for the update operation. |
| [setup.options.returnDocs] | <code>boolean</code> | Indicates whether to return the updated documents. |
| [setup.options.mongooseOpt] | <code>Object</code> | Mongoose options for the update operation. |

<a name="del"></a>

## del(setup) ÔçÆ <code>Promise.&lt;Object&gt;</code>
Deletes documents from the specified collection based on the provided filter and delete type.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The delete result.  
**Throws**:

- <code>Error.Log</code> If an error occurs during document deletion.


| Param | Type | Description |
| --- | --- | --- |
| setup | <code>Object</code> | The delete setup object. |
| setup.deleteType | <code>string</code> | The delete type ('one' or 'many'). |
| setup.collectionName | <code>string</code> | The name of the collection to delete documents from. |
| setup.filter | <code>string</code> \| <code>Object</code> | The filter criteria for deleting documents. |
| [setup.options] | <code>Object</code> | Additional options for the delete operation. |

<a name="build"></a>

## build(value) ÔçÆ [<code>ValidationBase</code>](#ValidationBase)
Factory function to create a ValidationBase instance for a specific value.

**Kind**: global function  
**Returns**: [<code>ValidationBase</code>](#ValidationBase) - - A ValidationBase instance for the provided value.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to be validated. |

