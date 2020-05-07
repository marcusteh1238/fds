const db = require('../../db')
const { update_order_status_rider_departs } = require('../../sql/sqlScript')
const getOrder = require('./getOrder').get;
// update_order_status_rider_departs: 'UPDATE Orders SET (riderId, timeriderdepartstocollect) VALUES ($1, CAST NOW() AS TIME) WHERE oid = $2'
/**
 * /rider/:riderId/updateOrder/accept/:oid
 * @param {*} params 
 */
async function acceptOrder({riderId, oid}) {
    const { order } = await getOrder({oid});
    if (!order) {
        throw new Error("Order does not exist!");
    }
    const { rows, rowCount } = await db.query(update_order_status_rider_departs, [riderId, oid])
    return {};
}

module.exports.post = acceptOrder
