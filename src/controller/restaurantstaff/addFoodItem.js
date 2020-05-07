const db = require('../../db')
const { add_food_item } = require('../../sql/sqlScript')
/**
 * /restaurantStaff/:rid/:rstaffId/addFoodItem
 * // body: food item
 * @param {*} params 
 */
async function addFoodItem(params, {foodItem}) {
    const rstaffId = params.rstaffId;
    const {foodname, price, daily_limit, itemavailability = 'T', category} = foodItem;
    const args = [foodname, price, daily_limit, itemavailability, params.rid, category];
    const res = await db.query(add_food_item, args)
    return {};
}

module.exports.post = addFoodItem