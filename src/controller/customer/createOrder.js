const db = require('../../db')
const { add_order_with_details_transaction } = require('../../sql/sqlScript')
const getMenu = require('../restaurant/getMenu').get;
const getCustomer = require('./getCustomer').get;
/**
 * Creates a brand new order
 * /createOrder
 * @param {JSON} body 
 */
async function createOrderImpl({cid, address, promoId = null, rid, foodItems, specialRequest = "None"}) {
    const { customer } = await getCustomer({cid});
    if (!customer) {
        throw Error("Customer does not exists!");
    }
    // verify food ids are in menu.
    const menu = await getMenu({rid});
    // ds: [[foodId, quantity],[foodId2, quantity]]
    foodItems = Object.entries(foodItems).map(([foodIdStr, quantity]) => [parseInt(foodIdStr, 10), quantity]);
    if (foodItems.length === 0) {
        throw new Error("Cannot create an order without foodItems!")
    }
    const invalidOrder = foodItems.filter(([foodId, quantity]) => {
        return menu.foodItems
            .filter(item => {
                return item.fooditemid === foodId && item.rid === rid 
            })
            .length === 0
    });
    if (invalidOrder.length !== 0) {
        throw new Error(`Invalid food items specified in order: ${invalidOrder}`);
    }

    const valuesQueryString = foodItems
        .map(([foodId, quantity]) => `((SELECT newOid.oid FROM newOid), ${foodId}, ${quantity}, '${specialRequest}')`)
        .join(', ');
    const finalQueryString = add_order_with_details_transaction.replace("$VALUES$", valuesQueryString)
    console.log(finalQueryString)
    console.log('cid, rid, address, promoId: ', cid, rid, address, promoId);
    const res = await db.query(finalQueryString, [cid, rid, address, promoId]);
    
    return {};
}

module.exports.put = createOrderImpl;
