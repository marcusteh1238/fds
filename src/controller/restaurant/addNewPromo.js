const { add_promo } = require('../../sql/sqlScript')

/**
 * 
 * @param {JSON} body 
 */
async function addNewPromoImpl({startDate, endDate, discountRate, rId}) {
    const { rows, rowCount } = await db.query(add_promo, [startDate, endDate, discountRate, rId]);
}

module.exports.post = addNewPromoImpl;