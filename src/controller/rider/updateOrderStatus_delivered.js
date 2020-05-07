const db = require('../../db')
const { update_order_status_delivery_success } = require('../../sql/sqlScript')
const getOrder = require('./getOrder').get;
/**
 * /rider/:riderId/updateOrder/delivered/:oid
 * @param {*} params 
 */
async function delivered({riderId, oid}) {
    const { order } = await getOrder({oid});
    if (!order) {
        throw new Error("Order does not exist!");
    }
    const res = await db.query(update_order_status_delivery_success, [oid])
    return {};
}

module.exports.post = delivered
