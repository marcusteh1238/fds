const db = require('../../db')
const getPromo = require('./getPromo').get
const { get_avg_orders_received_during_campaign, get_orders_received_during_campaign_per_day } = require('../../sql/sqlScript')
// Params: none
// /restaurant/:pid
async function getPromoSummary(params) {
    const pid = params.pid
    // get promo first
    const { promo } = await getPromo(params)
    const {promoname, startdate, enddate, discountrate, rid, cid} = promo
    const response = await db.query(get_avg_orders_received_during_campaign, [rid, startdate, enddate]);
    // console.log(response.rows)
    const averageNoOfOrders = parseInt(response.rows[0].average, 10);
    
    const r2 = await db.query(get_orders_received_during_campaign_per_day, [rid, startdate, enddate]);
    console.log(r2.rows)
    return {
        promo,
        ordersCountPerDay,
        averageNoOfOrders
    }
}

module.exports.get = getPromoSummary;
