module.exports = {
    auth: {
        user_in_use: () => { return {
            name: 'AUTH_USER_IN_USE',
            message: `The username provided is already in use!`
        }},

        user_not_found: (userName) => { return {
            name: 'AUTH_USERNAME_NOT_FOUND',
            message: `The username provided "${userName}" wasn't found!`
        }},

        invalid_credentials: () => { return {
            name: 'AUTH_INVALID_CREDENTIALS',
            message: `The username or password provided is incorrect!`
        }},

        password_not_match: () => { return {
            name: 'AUTH_PASSWORD_NOT_MATCH',
            message: `The password and the confirm password don't match! Try again...`
        }}
    },
    apiResponse: {
        collection: {
            create: (collection) => { return {
                name: 'CollectionCreate',
                message: `Error caught at the document creation on collection "${collection}"!`
            }},

            create_doc_errors: (collection) => { return {
                name: 'CollectionCreateDocErrors',
                message: `There is an issue with the document creation at collection "${collection}"!`
            }},

            delete: () => { return {
                name: 'CollectionDelete',
                message: `Error caught deleting a document at endpoint "collection/delete"!`
            }},
            
            get: {
                doc: () => { return {
                    name: 'CollectionGetDoc',
                    message: `Error caught getting a document at endpoint "collection/get/doc"!`
                }},

                query_collection: () => { return {
                    name: 'CollectionGetQueryCollection',
                    message: `Error caught getting a query collection at endpoint "collection/get/queryCollection"!`
                }}
            }
        }
    },
    cli: {
        repos: {
            repo_not_found: () => { return {
                name: 'REPO-NOT-FOUND',
                message: `The selected repository wan't found on the pool values!`
            }}
        }
    },
    common: {
        required_params: (validationErrors, functionName) => {
            const validationMessages = validationErrors.map(item => '- ' + item.message).join('\n');

            return {
                name: 'RequiredParams',
                message: `at "${functionName || '--unknown-method--'}":\n${validationMessages}\n\n`
            }
        },

        missing_params: (paramName, at, file) => { return {
            name: 'CommonMissingParams',
            message: `The param(s) "${Array.isArray(paramName) ? paramName.join(', ') : paramName}" is required at ${at} file "${file}"!`
        }},

        bad_format_param: (paramName, at, expected, received, file) => { return {
            name: 'CommonBadFormatParam',
            message: `Param "${paramName}" at ${at}, file "${file}", expects a "${expected}", but received "${received}!`
        }},

        invalid_json_pattern: (received) => { return {
            name: 'CommonInvalidJsonPattern',
            message: `The JSON format provided is invalid!\nPovided: ${received}`
        }},

        request_creating_custom_schema: () => { return {
            name: 'CommonRequestCreatingCustomSchema',
            message: `An error was caught at custom schema creating on RequestBase model!`
        }},

        request_model_schema_not_found: (received) => { return {
            name: 'CommonRequestModelSchemaNotFound',
            message: `The collection name provided didn't match as any database schema! Provided -> ${received}`
        }},

        model_construction: (modelName) => { return {
            name: 'CommonModelSchemaValidation',
            message: `Error caught at the construction of "${modelName || 'Unknown Model'}" model!`
        }},

        number_expected: (received) => { return {
            name: 'CommonNumberExpected',
            message: `The index provided is not a number. Please provide a valid index number! But received "${received}".`
        }}
    },
    database: {
        collection_dont_exist: (collectionName) => { return {
            name: `DatabaseCollectionDoesntExist`,
            message: `The collection "${collectionName}" that you're trying to get doesn't exist!`
        }},

        getting_collection_model: (collectionName) => { return {
            name: 'DatabaseGettingCollectionModel',
            message: `An error occured it was trying to get the db collection model of "${collectionName}"!`
        }},

        schema_not_found: (collectionName) => { return {
            name: 'DatabaseSchemaNotFound',
            message: `Database schema not found for collection "${collectionName}"!`
        }},

        creating_document: (collectionName) => { return {
            name: 'DatabaseCreatingDocument',
            message: `An error occured while a document has being created at "${collectionName}" collection!`
        }},

        increasing_collection_counter: (collectionName) => { return {
            name: 'DatabaseIncreasingCollectionCounter',
            message: `An error occured while it was trying to increase the counter of collection "${collectionName}"!`
        }},

        writting_mofication_time: () => { return {
            name: 'DatabaseWrittingModificationTime',
            message: 'An error occured during the timestamp modification time was being placed!'
        }},

        updating_document: (filter) => { return {
            name: 'DatabaseUpdatingDocument',
            message: `An error occured when the document "${JSON.stringify(filter)}" was being updated!`
        }},

        deleting_document: (collectionName, docID) => { return {
            name: 'DatabaseDeletingDocument',
            message: `An error occured when deleting the document "${docID}" at collection "${collectionName}"!`
        }},

        querying_collection: (collectionName) => { return {
            name: 'DatabaseQueryingCollection',
            message: `An error occured when it was querying the collection "${collectionName}"!`
        }},

        getting_document: (collectionName, docID) => { return {
            name: 'DatabaseGettingDocument',
            message: `An error occured when it's trying to get the document using filter "${docID}" at collection "${collectionName}"!`
        }},

        document_dont_exist: () => { return {
            name: 'DatabaseDocumentDoesntExist',
            message: 'The document _id provided doesn\'t exist!'
        }},

        counter_verification: () => { return {
            name: 'DatabaseCounterVerification',
            message: 'An error occured on counter verification!'
        }},

        counter_creation: (collectionName) => { return {
            name: 'DatabaseCounterCreation',
            message: `An error occured on counter creation of collection ${collectionName}!`
        }},

        duplicated_counter: (collectionName) => { return {
            name: 'DatabaseDuplicatedCounter',
            message: `The counter for collection "${collectionName}" already exist!`
        }},

        counter_not_found: (collectionName) => { return {
            name: 'DatabaseCounterNotFound',
            message: `The counter for collection ${collectionName} wasn't found!`
        }},

        missing_schema: () => { return {
            name: 'DatabaseMissingSchema',
            message: `Schema wans't provided!`
        }},

        presaving_document_error: () => { return {
            name: 'DatabasePreSavingDocumentError',
            message: 'An error occured on pre event, before saving document!'
        }},

        making_docs_readable: () => { return {
            name: 'DatabaseMakingDocsReadable',
            message: 'An error occured when the readable(), query was executed!'
        }},

        populating_document: (collectionName) => { return {
            name: 'DatabasePupulatingDocument',
            message: `An error occured when a document at collection "${collectionName}" was being populated!`
        }},

        short_population: (filter) => { return {
            name: 'DatabaseShortPopulation',
            message: `Error caught during the slot query "shortPopulate" of slot "${JSON.stringify(filter)}"!`
        }},

        paginate_query: () => { return {
            name: 'DatabasePaginateQuery',
            message: `An error was caught during the pagination of the query ""`
        }},

        populating_slot: (slotID) => { return {
            name: 'DatabasePopulatingSlot',
            message: `An issue occured on the slot "${slotID}" population!`
        }},

        readable: () => { return {
            name: 'DatabaseReadable',
            message: `An issue occured when it was making doc readable by using the toObject()!`
        }},

        schema_init: () => { return {
            name: 'DatabaseSchemaInitialization',
            message: 'An error occured at schema initialization!'
        }},

        duplicated_schema: (name, symbol) => {return {
            name: 'DatabaseDuplicatedSchema',
            message: `The schema [${symbol}] - ${name} which is being initialized, already exists!`
        }},

        duplicated_schema_name: (name) => {return {
            name: 'DatabaseDuplicatedSchemaName',
            message: `he schema name "${name}" being initialized already exists!`
        }},

        duplicated_schema_symbol: (symbol) => {return {
            name: 'DatabaseDuplicatedSchemaSymbol',
            message: `he schema symbol [${symbol}] initialized already exists!`
        }},

        getting_schema: (schemaName) => { return {
            name: 'DatabaseGettingSchema',
            message: `It seems that the schema "${schemaName}" don't exist!`
        }},

        duplicated_collection_config: () => { return {
            name: 'DatabaseDuplicatedColletionConfig',
            message: 'The collection name and symbol should be UNIQUE!'
        }},

        saving_log: (logName, logMessage) => { return {
            name: 'DatabaseSavingLog',
            message: `An error occured when it was trying to create a new log!\nLog: "${logName}"\nMessage: "${logMessage}"`
        }},

        init_document: (collectionName, docID) => { return {
            name: 'DatabaseInitializingDocument',
            message: `An error occured on collection "${collectionName}" - "${docID}" at the document initialization!`
        }},

        init_queries: () => { return {
            name: 'DatabaseInitQueries',
            message: `Error caught at queries initialization of the database schema!`
        }},

        init_events: () => { return {
            name: 'DatabaseInitEvents',
            message: `Error caught at events initialization of the database schema!`
        }},

        init_classes: () => { return {
            name: 'DatabaseInitClasses',
            message: `Error caught at classes initialization of the database schema!`
        }},

        events: {
            pre_save: () => { return {
                name: 'DatabaseEventsPreSave',
                message: `Error caught on "preSave" event of database!`
            }},

            post_save: () => { return {
                name: 'DatabaseEventsPostSave',
                message: `Error caught on "postSave" event of database!`
            }},

            pre_delete: () => { return {
                name: 'DatabaseEventsPreDelete',
                message: `Error caught during the preDelete event!`
            }},

            post_delete: () => { return {
                name: 'DatabaseEventsPostDelete',
                message: `Error caught during the postDelete event!`
            }},

            post_delete_not_acknowledged: () => { return {
                name: 'DatabaseEventsPostDeleteNotAcknowledged',
                message: `The update on postDelete event is not acknowledged when it was updating the related documents in linked collections!`
            }},

            slot_post_update: () => { return {
                name: 'DatabaseSlotPostUpdate',
                message: `Error caught during slot post update event execution!`
            }},

            slots_post_update_slot_not_found: (slotUID) => { return {
                name: 'DatabaseSlotPostUpdateSlotNotFound',
                message: `Slot "${slotUID}" wasn't found during slot post update event execution!`
            }},

            position_post_update: () => { return {
                name: 'DatabasePositionPostUpdate',
                message: `Error caught during position post update event execution!`
            }},

            transfer_post_save: () => { return {
                name: 'DatabaseTransferPostUpdate',
                message: `Error caught during transfer post save event execution!`
            }}
        }
    },
    helpers: {
        find_rel_fields: () => { return {
            name: 'HelpersFindRelFields',
            message: `Error caught at helper findRelFields!`
        }},

        treat_filter: () => { return {
            name: 'HelpersTreatFilter',
            message: `Error caught at helper treatFilter()!`
        }},

        is_collection_exist: (collectionName) => { return {
            name: 'HelpersIsCollectionExist',
            message: `Error checking collection existence of "${collectionName}"!`
        }},

        get_collection_model: () => { return {
            name: 'HelpersGetCollectionModel',
            message: `Error caught on the database helper getCollectionModel!`
        }},

        create_counter: () => { return {
            name: 'HelpersCreateCounter',
            message: `Error caught on the database helper createCounter!`
        }},

        increase_doc_prop: (collectionName, filter, value) => { return {
            name: 'HELPERS-INCREASE-PROP',
            message: `Error caught during the document property increase of:\nFilter: "${typeof filter === 'object' ? JSON.parse(filter, null, 2) : String(filter)}"\nCollection: "${collectionName}"\nValue: ${typeof value === 'object' ? JSON.parse(value, null, 2) : String(value)}\n\n`
        }},

        increase_doc_prop_collection_not_defined: (collectionName, filter, value) => { return {
            name: 'HELPERS-INCREASE-PROP',
            message: `Is required to declare the collectionName property of the class that is extending the _Global class of collections!`
        }},

        increase_counter: (collectionName) => { return {
            name: 'HelpersIncreaseCounter',
            message: `Error caught during the counter increase of collection "${collectionName}"!`
        }}
    },
    resources: {
        path_string_not_found: (pathString) => { return {
            name: `ResourcePathNotFound`,
            message: `The resource path "${pathString}" wasn't found!`
        }},

        error_path_not_found: (pathString) => { return {
            name: 'ErrorPathNotFound',
            message: `The string path "${pathString}" provided at Error.Log don't exist!`
        }}
    },
    services: {
        XMLManager: {
            loading_file: (filePath, fileName) => { return {
                name: 'ServicesXMLManagerLoadingFile',
                message: `Error caught during xml file loading!\Path: ${filePath}\nFile:${fileName}.`
            }},

            parsing_xml: (filePath, fileName) => { return {
                name: 'ServicesXMLManagerParsingFile',
                message: `Error caught while the xml file was being parsed!\Path: ${filePath}\nFile:${fileName}.`
            }},

            saving_file: (filePath, fileName) => { return {
                name: 'ServicesXMLManagerSavingFile',
                message: `Error caught during xml file was being parsed!\Path: ${filePath}\nFile:${fileName}.`
            }}
        },
        GitHubAPI: {
            RepoManager: {
                get_current_branch: () => { return {
                    name: 'GitHubAPIRepoManagerGetCurrentBranch',
                    message: `Error caught getting the current local branch!`
                }},
                
                is_branch_exist: () => { return {
                    name: 'GitHubAPIRepoManagerIsBranchExist',
                    message: `Error caught checking if the branch exist!`
                }},

                is_local_branch_exist: () => { return {
                    name: 'GitHubAPIRepoManagerIsLocalBranchExist',
                    message: `Error caught checking if the local branch exist!`
                }},

                is_remote_branch_exist: () => { return {
                    name: 'GitHubAPIRepoManagerIsRemoteBranchExist',
                    message: `Error caught checking if the remote branch exist!`
                }},

                base_branch_is_not_current: () => { return {
                    name: 'GitHubAPIRepoManagerBaseBranchIsNotCurrent',
                    message: `The current branch is not the base branch provided to create the new branch!`
                }},

                branch_is_exist: (name, branch) => { return {
                    name: 'GitHubAPIRepoManagerBranchIsExist',
                    message: `The branch "${name}" is already exist on ${branch.isLocalExist ? 'local' : ''}${branch.isLocalExist && branch.isRemoteExist ? ' and ' : ''}${branch.isRemoteExist ? 'remote' : ''}\n`
                }},

                creating_branch: () => { return {
                    name: 'GitHubAPIRepoManagerCreatingBranch',
                    message: `Error caught while is creating a branch!`
                }},

                creating_stash: () => { return {
                    name: 'GitHubAPIRepoManagerCreatingStash',
                    message: `Error caught while is creating a stash!`
                }},

                repo_uid_required: () => { return {
                    name: 'GitHubAPIRepoManagerRepoUIDRequired',
                    message: `If the RepoManager doesn't have a repo parent it's required to provide the "repoUID" param!`
                }},

                getting_stash: () => { return {
                    name: 'GitHubAPIRepoManagerGettingStash',
                    message: `Error caught when getting a stash(es) at RepoManager.getStash()!`
                }},

                apply_stash: () => { return {
                    name: 'GitHubAPIRepoManagerApplyStash',
                    message: `Error caught when applying a stash at RepoManager.applyStash()!`
                }},

                saving_stash: () => { return {
                    name: 'GitHubAPIRepoManagerSavingStash',
                    message: `Error caught when saving a stash at RepoManager.applyStash()!`
                }},

                checkout_branch_is_current: (branchName) => { return {
                    name: 'GitHubAPIRepoManagerCheckoutBranchIsCurrent',
                    message: `You already is using the "${branchName}" branch!`
                }},

                checkout_branch_not_found: (branchName) => { return {
                    name: 'GitHubAPIRepoManagerCheckoutBranchNotFound',
                    message: `The branch "${branchName}" wasn't found!`
                }},

                checkout_local_branch_not_found: (branchName) => { return {
                    name: 'GitHubAPIRepoManagerCheckoutLocalBranchNotFound',
                    message: `The branch "${branchName}" wasn't found at local repository!`
                }},

                checkout_stashing_error: () => { return {
                    name: 'GitHubAPIRepoManagerCheckoutStashingError',
                    message: `An error was caught during the stash creation!`
                }},

                checkout_git_error: () => { return {
                    name: 'RepoManagerCheckoutGitError',
                    message: `Error caught on checkout method of RepoManager!`
                }},

                checkout: () => { return {
                    name: 'GitHubAPIRepoManagerCheckout',
                    message: `Error caught at RepoManager.checkout()!`
                }},

                add_changes: () => { return {
                    name: 'GitHubAPIRepoManagerAddChanges',
                    message: `Error adding changes to head of git repository!`
                }},

                current_changes: () => { return {
                    name: 'GitHubAPIRepoManagerCurrentChanges',
                    message: `Something went wrong getting the current changes!`
                }},

                commiting: () => { return {
                    name: 'GitHubAPIRepoManagerCommiting',
                    message: `Something went wrong commiting the current changes!`
                }},

                pushing: () => { return {
                    name: 'GitHubAPIRepoManagerPushing',
                    message: `Something went wrong pushing the current commits!`
                }},

                creating_pull_request: () => { return {
                    name: 'GitHubAPIRepoManagerCreatingPullRequest',
                    message: `Something went wrong creating the pull request!`
                }}
            },
            GitHubConnection: {
                ajax: (url) => { return {
                    name: 'GitHubConnectionAjax',
                    message: `An error occured during the GitHubConnection.ajax call for the URL: ${url}`
                }}
            }
        }
    },
    stash: {
        creating_loading:  () => { return {
            name: 'StashCreatingLoading',
            message: `An error occurred while creating or loading a stash.`
        }}
    },
    user: {
        get_master_account: (userUID, userName) => { return {
            name: 'UserGetMasterAccount',
            message: `Error caught getting user's master account of [${userUID}] - ${userName}!`
        }},

        get_open_trades: (userUID, userName) => { return {
            name: 'UserGetOpenTrades',
            message: `Error caught getting the user's open trades of [${userUID}] - ${userName}!`
        }},

        not_found: (filter) => { return {
            name: 'USER-NOT-FOUND',
            message: `The user for the filter "${JSON.stringify(filter)}" wasn't found!`
        }}
    }
};
