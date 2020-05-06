const db = require('../../db')
const { update_Customer_By_cid } = require('../../sql/sqlScript')
const getCustomer = require('./getCustomer').get

/**
 * updateCustomer/:cid
 * @param {*} params contains cid
 * @param {*} body contains customer object schema to be updated.
 */
async function updateCustomerImpl(params, body) {
    const { customer } = await getCustomer(params);
    // verify correct info
    const invalidKeys = Object.keys(body)
        .filter(key => Object.keys(customer).indexOf(key) === -1);
    if (invalidKeys.length > 0) {
        throw new Error(`Invalid params provided: ${invalidKeys}`);
    }
    
    // update_Customer_By_cid: 'UPDATE Customers SET username = $1, password = $2, rewardPoints = $3, registeredCreditCard = $4, WHERE cid = $5'
    // im lazy to do this properly so..
    const args = ["username", "password", "rewardpoints", "registeredcreditcard", "cid"]
        .map(columnName => {
            let toUpdate = body[columnName];
            if (!toUpdate) {
                // no exist, so use old one
                toUpdate = customer[columnName];
            }
            return toUpdate;
        });
    const response = await db.query(update_Customer_By_cid, args);
    return {
        customer: response.rows[0]
    };
}

module.exports.post = updateCustomerImpl
