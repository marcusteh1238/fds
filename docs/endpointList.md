## Customer Routes: /customer

* GET: /customer/login/:username/:password
    * Check if username and password combo matches
* GET: /customer/getCustomer/:cid
    * Gets a customer by its customer id
* GET: /customer/getCustomerOrderHistory/:cid
    * Gets a customer's all-time order history
* POST: /customer/addNewCustomer
    * Body params: username, rewardPoints, registeredCreditCard
    * Registers a new customer.
* PUT: /customer/createOrder
    * Body params: cid, address, promoId, rid
    * Creates an order.
* POST: /customer/updateCustomer/:cid
    * Body params (CASE SENSITIVE!): username, password, rewardpoints, registeredcreditcard
    * Updates a customer with the supplied information. Body param keys are optional.
* POST: /customer/deleteCustomer/:cid
    * Deletes a customer with the specified cid from the database.

## Rider Routes: /rider

* GET: /rider/login/:username/:password
    * Check if username and password combo matches
* GET: /rider/viewTotalNumberOfOrders/:rid/:startDate/:endDate
    * View total number of orders made in a time period.
* GET: /rider/getOrder/:oid
    * Gets an order from its oid.

## FDS Manager Routes: /fdsmanager

* GET: /fdsmanager/login/:username/:password
    * Check if username and password combo matches
* GET: /fdsmanager/getMonthlyNewCustomer/:startDate/:endDate
    * Get the number of new customers that joined during a time period.
* GET: /fdsmanager/getMonthlyTotalOrder/:startDate/:endDate
    * Get the total number of orders made during a time period.
* GET: /fdsmanager/viewTotalCostOfAllOrders/:startDate/:endDate
    * Get the total cost of all orders made during a time period.

## Restaurant Staff Routes: /restaurantstaff

* GET: /restaurantstaff/login/:username/:password
    * Check if username and password combo matches
* POST: /restaurantStaff/:rid/:rstaffId/addFoodItem
    * Body params: {foodItem: {foodname, price, daily_limit, itemavailability = 'T', category}}

## Restaurant Routes: /restaurant

* GET: /restaurant/list
    * List of restaurants
* GET: /restaurant/getRestaurant/:rid
    * Obtain info about a restaurant.
* GET: /restaurant/viewMonthlyOrder/:startDate/:endDate
    * Views the orders made during a time period.
* GET: /restaurant/viewTotalCostOfOrder/:rid/:startDate/:endDate
    *  Views the total cost of all orders made for a single restaurant during a time period.
* GET: /restaurant/viewTopFiveItems/:rId
    * Gets the top 5 food items for a restaurant.
* GET: /restaurant/getPromo/:pid
    * Get basic info about a promo.
* GET: /restaurant/getPromoSummary/:pid
    * View a summary of the promotion with the given promo id.
* GET: /restaurant/getMenu/:rid
    * View the restaurant's menu.
* POST: /restaurant/updateDailyOrderLimit/:rid/:fooditemid/:newLimit
    * Body not required.
    * Updates the daily order limit of a particular food item id.
* POST: /restaurant/updateMinOrderAmt/:rid/:newMinAmt
    * Updates the minimum order amount for a restaurant.
