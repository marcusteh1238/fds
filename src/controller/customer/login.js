const db = require('../../db')
// Params: username, password
async function loginImpl(params) {

    const { username, password } = params;
    
    const dbPass = await getCustomerFromUsername(username);
    const isMatchingPassword = dbPass === password;
    const res = await db.query("SELECT 1 FROM customers c WHERE c.username = $1 AND c.password = $2", [username, password], (err, res)=>{console.log(res)})
    console.log(res)
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
