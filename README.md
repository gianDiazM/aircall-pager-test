# aircall-pager-test

## Installation

aircall-pager-test requires [Node.js](https://nodejs.org/) v14.15+ to run.

Install the dependencies and devDependencies 

```sh
npm install
```

## Code structure

Summary of the most relevant directories

- __tests _ : Here all the unit tests are defined with the use cases required for the Aircall test
- cache: Directory to define the in-memory caches to be used in the service
- config: Config implementation defined in ./lib/config.js with the convict library, this configuration can be rewritten for different environments
- dataSources: Here we define the data source that the services will use, common interfaces that will be implemented by different providers that may be making database queries, requests to APIs, redis cache, etc.
- models: All the models and interfaces of the entities that we identify within the application are defined in this directory.
- services: Are all the services described in the architecture defined in the test statement
- utils: Directory containing all common methods, used in the system
```
project
│   README.md
│   -- project config files
│
└───lib
    │   config.js -- project configuration
    |
    └─── __tests__
    │
    └─── cache
    │   ...
    └─── config
    │   ...
    └─── datasources
    │   ...
    └─── models
    │   ...
    └─── services
    │   ...
    └─── utils

```

| GitHub | [https://github.com/gianDiazM/aircall-pager-test][PlGh] |


## Configuration
In this project we use node-convict to manage application settings, following this configuration where the environment variables, and the default values are defined,

the file with the configuration values is defined inside ./config/ directory

```
{
    dataSource:{
        escalationPolicy:{
            provider:{
                doc: 'value that indicates which provider we want to use',
                format: 'String',
                default: 'MOCK',
                env: 'DATA_SOURCE_EP_POLICY_PROVIDER',
            }
        },
        pager:{
            provider:{
                doc: 'value that indicates which provider we want to use',
                format: 'String',
                default: 'MOCK',
                env: 'DATA_SOURCE_PAGER_PROVIDER',
            }
        }
    },
    services:{
        timer:{
            timeout:{
                doc: 'default minutes  for the Acknowledgement Timeout',
                format: 'int',
                default: 15,
                env: 'ACKNOWLEDGEMENT_TIMEOUT',
            }
        }
    }
}
```

## Run tests


to run all the tests, we execute:
```sh
npm test
```

to run the tests case by case use these commands

>Given a Monitored Service in a Healthy State,
when the Pager receives an Alert related to this Monitored Service,
then the Monitored Service becomes Unhealthy,
the Pager notifies all targets of the first level of the escalation policy,
and sets a 15-minutes acknowledgement delay

```sh
npm test lib/__tests__/_use_case_scenarios_/case-1.test.js
```

>Given a Monitored Service in an Unhealthy State,
the corresponding Alert is not Acknowledged
and the last level has not been notified,
when the Pager receives the Acknowledgement Timeout,
then the Pager notifies all targets of the next level of the escalation policy
and sets a 15-minutes acknowledgement delay.
```sh
 npm test lib/__tests__/_use_case_scenarios_/case-2.test.js 
```

>Given a Monitored Service in an Unhealthy State
when the Pager receives the Acknowledgement
and later receives the Acknowledgement Timeout,
then the Pager doesn't notify any Target
and doesn't set an acknowledgement delay.
```sh
 npm test lib/__tests__/_use_case_scenarios_/case-3.test.js
```

>Given a Monitored Service in an Unhealthy State,
when the Pager receives an Alert related to this Monitored Service,
then the Pager doesn’t notify any Target
and doesn’t set an acknowledgement delay
```sh
 npm test lib/__tests__/_use_case_scenarios_/case-4.test.js 
```

>Given a Monitored Service in an Unhealthy State,
when the Pager receives a Healthy event related to this Monitored Service
and later receives the Acknowledgement Timeout,
then the Monitored Service becomes Healthy,
the Pager doesn’t notify any Target
and doesn’t set an acknowledgement delay
```sh
 npm test lib/__tests__/_use_case_scenarios_/case-5.test.js
```

## License

MIT

**Free Software, Hell Yeah!**
