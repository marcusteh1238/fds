const db = require('../../db')
// Params: username, password
async function loginImpl(params) {

    const { username, password } = params;
    
    const dbPass = await getCustomerFromUsername(username);
    const isMatchingPassword = dbPass === password;

    // return endpoint results
    return {
        username: username,
        correctPass: isMatchingPassword
    };
}

async function getCustomerFromUsername(username) {
    // return db.query('BLAH')
    return 'password'
}

module.exports.get = loginImpl;
