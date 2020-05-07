const db = require('../../db')
const { update_order_status_rider_arrived_restaurant } = require('../../sql/sqlScript')
const getOrder = require('./getOrder').get;
/**
 * /rider/:riderId/updateOrder/arrived/:oid
 * @param {*} params 
 */
async function arrived({riderId, oid}) {
    const { order } = await getOrder({oid});
    if (!order) {
        throw new Error("Order does not exist!");
    }
    const res = await db.query(update_order_status_rider_arrived_restaurant, [oid])
    return {};
}

module.exports.post = arrived
