const db = require('../../db')
const { get_promo } = require('../../sql/sqlScript')

/**
 * /getPromo/:id
 * @param {*} params 
 */
async function getPromo(params) {
    const pid = params.pid;
    // get promo first
    const { rows, rowCount } = await db.query(get_promo, [pid])
    if (rowCount === 0) {
        throw Error("Invalid promo id provided.")
    }
    return {
        promo: rows[0]
    }
}

module.exports.get = getPromo;