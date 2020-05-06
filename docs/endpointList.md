## Customer Routes: /customer

* GET: /customer/login/:username/:password
    * Check if username and password combo matches
* GET: /customer/getCustomer/:cid
    * Gets a customer by its customer id
* POST: /customer/addNewCustomer
    * Body params: username, fullName, rewardPoints, registeredCreditCard
    * Registers a new customer.
* PUT: /customer/createOrder
    * Body params: cid, address, promoId
    * Creates an order.
* POST: /customer/updateCustomer/:cid
    * Body params (CASE SENSITIVE!): username, password, rewardpoints, registeredcreditcard
    * Updates a customer with the supplied information. Body param keys are optional.
* POST: /customer/deleteCustomer/:cid
    * Deletes a customer with the specified cid from the database.

## Rider Routes: /rider

* GET: /rider/login/:username/:password
    * Check if username and password combo matches

## FDS Manager Routes: /fdsmanager

* GET: /fdsmanager/login/:username/:password
    * Check if username and password combo matches

## Restaurant Staff Routes: /restaurantstaff

* GET: /restaurantstaff/login/:username/:password
    * Check if username and password combo matches

## Restaurant Routes: /restaurant

* GET: /restaurant/list
    * List of restaurants
