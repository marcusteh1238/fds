const { Client } = require('pg')
const saltRounds = 5;

const client = new Client()
// Params: username, password
async function loginImpl(params) {

    const { username, password } = params;
    
    const dbPass = await getPassword(username);
    const isMatchingPassword = dbPass === password;

    // return endpoint results
    return {
        username: username,
        correctPass: isMatchingPassword
    };
}

async function getPassword(username) {
    // return client.query('BLAH')
    return 'password'
}

module.exports.get = loginImpl;
