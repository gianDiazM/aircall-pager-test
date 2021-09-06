const convict = require('convict');
const path = require('path');
const config = convict({
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
})

config.loadFile(path.join(__dirname, './config/environment.json'));

config.validate();
module.exports = config
