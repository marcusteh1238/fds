const db = require('../../db')
const { delete_customer, get_customer_by_cid } = require('../../sql/sqlScript')

/**
 * /delete/:cid
 * @param {*} params Delete customer by cid 
 */
async function deleteCustomer(params) {
    const { cid } = params
    const response = await db.query(get_customer_by_cid, [cid])
    const rows = response.rows
    if (rows.length === 0) {
        throw Error("Invalid customer id provided.")
    }
    const deleteResponse = await db.query(delete_customer, [cid])
    return {
    }
}

module.exports.post = deleteCustomer