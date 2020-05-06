const db = require('../../db')
const { check_rid_food_item, update_FoodItem_DailyLimit } = require('../../sql/sqlScript')

// Params: none
// /restaurant/updateDailyOrderLimit/:rid/:fooditemid/:newLimit
async function updateDailyOrderLimit(params) {
    const verification = await db.query(check_rid_food_item, [params.rid, params.fooditemid])
    const restaurantHasFoodItemId = verification.rowCount > 0;
    if (!restaurantHasFoodItemId) {
        throw new Error(`The restaurant with rid of ${params.rid} does not have the food item with fooditemid of ${params.fooditemid}`)
    }
    const response = await db.query(update_FoodItem_DailyLimit, [params.newLimit, params.fooditemid])
    return {}
}

module.exports.post = updateDailyOrderLimit;
