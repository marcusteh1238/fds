const db = require('../../db')
const { add_customer, get_customer_by_name } = require('../../sql/sqlScript')

/**
 * 
 * @param {JSON} body 
 */
async function addNewCustomerImpl({username, password, registeredCreditCard}) {
    const { rows, rowCount } = await db.query(get_customer_by_name, [username]);
    if (rowCount > 0) {
        throw Error("Customer already exists!");
    }
    const response = await db.query(add_customer, [username, password, registeredCreditCard])
    const newCust = await db.query(get_customer_by_name, [username]);
    return newCust.rows[0]
}

module.exports.post = addNewCustomerImpl;
