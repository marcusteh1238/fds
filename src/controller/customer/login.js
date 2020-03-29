const db = require('../../db')
// Params: username, password
async function loginImpl(params) {

    const { username, password } = params;
    
    const response = await db.query("SELECT * FROM customers c WHERE c.username = $1 AND c.password = $2", [username, password])
    const rows = response.rows;
    if (rows.length < 1) {
        return {
            isLoginSuccess: false
        }
    }
    const user = rows[0]
    // return endpoint results
    return {
        isLoginSuccess: true,
        user
    };
}

module.exports.get = loginImpl;
