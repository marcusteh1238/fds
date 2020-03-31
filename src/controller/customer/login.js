const db = require('../../db')
const { get_customer_by_name } = require('../../sql/sqlScript')
// Params: username, password
async function loginImpl(params) {

    const { username } = params
    
    const response = await db.query(get_customer_by_name, [username])
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
