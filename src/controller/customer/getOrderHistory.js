const db = require('../../db')
const { get_customer_by_cid, get_customer_all_orders } = require('../../sql/sqlScript')

// customer/getCustomerOrderHistory/:cid
async function getCustomerOrderHistory(params) {
    const { cid } = params
    const getCustResponse = await db.query(get_customer_by_cid, [cid])

    if (getCustResponse.rows.length === 0) {
        throw Error("Invalid customer id provided.")
    }

    const {rows, rowCount} = await db.query(get_customer_all_orders, [cid])

    return {
        count: rowCount,
        orders: rows
    }
}

module.exports.get = getCustomerOrderHistory