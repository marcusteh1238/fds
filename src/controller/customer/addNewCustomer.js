const db = require('../../db')
const { add_customer, get_customer_by_name } = require('../../sql/sqlScript')

/**
 * 
 * @param {JSON} body 
 */
// async function addNewCustomerImpl({username, password, rewardPoints, registeredCreditCard}) {
    async function addNewCustomerImpl(body) {
        console.log('body: ', body);
    const { rows, rowCount } = await db.query(get_customer_by_name, [username]);
    if (rowCount > 0) {
        throw Error("Customer already exists!");
    }
    const response = await db.query(add_customer, [username, password, rewardPoints, registeredCreditCard])
    return db.query(get_customer_by_name, [username]);
}

module.exports.post = addNewCustomerImpl;