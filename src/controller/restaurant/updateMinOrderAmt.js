const db = require('../../db')
const { update_Min_Amount } = require('../../sql/sqlScript')

// Params: none
// /restaurant/updateMinOrderAmt/:rid/:newMinAmt
async function updateMinOrderAmt(params) {
    const response = await db.query(update_Min_Amount, [params.newMinAmt, params.rid])
    return {}
}

module.exports.post = updateMinOrderAmt;
