const { add_order } = require('../../sql/sqlScript')

/**
 * Creates a brand new order
 * @param {JSON} body 
 */
async function createOrderImpl({cid, address, promoId = ""}) {
    const { rowCount } = await db.query(get_customer_by_name, [username]);
    if (rowCount === 0) {
        throw Error("Customer does not exists!");
    }
    const { rows } = await db.query(add_order, [cid, address, promoId]);
    return {}; // success
}

module.exports.put = createOrderImpl;
