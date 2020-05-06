module.exports = {

    // create customer
    add_customer: 'INSERT INTO customers (username, fullName, rewardPoints,registeredCreditCard,joinDate) VALUES($1, $2, $3, $4, CAST (NOW() AS TIME))',
    add_restaurantsStaff: 'INSERT INTO RestaurantsStaff (username) VALUES ($1)',
    add_fdsManagers: 'INSERT INTO FDSManagers VALUES ($1)',
    add_deliveryDrivers: 'INSERT INTO DeliveryRiders(rId, name, phoneNo, startDate, employmentType) VALUES ($1,$2, $3,CAST (NOW() AS TIME),$5 )',
    add_order: 'INSERT INTO Orders (cId, address,pId,timeOrderPlaced) VALUES ($1,$2,$3,CAST (NOW() AS TIME))',
    add_promo: 'INSERT INTO Promo(startDate, endDate, discountDate,rId) VALUES($1,$2,$3,$4)',



    // retrieve
    get_customer_by_name: 'SELECT * FROM Customers WHERE username = $1',
    get_customer_by_cid: 'SELECT * FROM Customers WHERE cid = $1',
    get_food_item_by_category: 'SELECT * FROM FoodItem WHERE categoryId = $1 and rId = $2',
    get_food_item_by_restaurants_id: 'SELECT * FROM FoodItem WHERE rid = $1',
    get_food_item_by_restaurants_name: 'SELECT * FROM FoodItem f WHERE f.rId = (select r.rId FROM Restaurants r where r.name = $1',
    get_reviews_by_restaurants_name: 'SELECT reviews FROM Orders WHERE rId = (select r.rId FROM Restaurants r where r.name = $1',
    get_average_rating_by_restaurants_name: 'SELECT avg(rating) FROM Orders WHERE rId = (select r.rId FROM Restaurants r where r.name = $1',
    get_monthly_completed_order_by_restaurants_id: 'SELECT * FROM Orders o WHERE o.timeRiderDeliversOrder IS NOT NULL and o.rid = $1 and o.timeRiderDeliversOrder between $2 and $3',
    get_total_cost_of_completed_Order_by_restaurants_id: 'WITH X AS(SELECT oId FROM Orders WHERE rId = $1 ), Y AS (SELECT oId, sum(od.quantity*f.price) as sumPerOrder FROM OrderDetails od JOIN FoodItems f on od.fId = f.foodItemId WHERE fId In X ORDER BY oId) select sum(sumPerOrder) from Y',
    get_top_5_favourite_foodItem_by_restaurants_id: 'WITH X AS(SELECT * FROM FoodItems f WHERE f.rId = $1), Y AS (SELECT f.fId, sum(quantity) FROM X f JOIN OrderDetails od on f.foodItemId = od.fId order by f.fId Desc limit 5',
    get_orders_by_date: 'SELECT * FROM Orders WHERE timeRiderDeliversOrder IS BETWEEN $1 AND $2',
    get_all_restaurants: 'SELECT * FROM Restaurants',

    get_rider_login: 'SELECT * FROM DeliveryRiders dr WHERE dr.username = $1 AND dr.password = $2',
    get_FDS_Manager_login: 'SELECT * FROM FDSManagers fm WHERE fm.username = $1 AND fm.password = $2',
    get_restaurant_staff_login: 'SELECT * FROM restaurantsstaff rs WHERE rs.username = $1 AND rs.password = $2',

    /*View total number of new customer for each month */
    get_total_new_customer_for_each_month: 'SELECT count(*) FROM Customers c WHERE c.joinDate >= $1 AND c.joinDate < $2',

    /* View total number of orders for each month */
    get_total_new_orders_for_each_month: 'SELECT count(*) FROM Orders o WHERE o.timeOrderPlaced >= $1 AND o.timeOrderPlaced < $2',


    // update

    update_FoodItem_DailyLimit: 'UPDATE FoodItems SET dailyLimit = $1 WHERE foodItemId = $2',
    update_Min_Amount: 'UPDATE Restuarants SET minOrderPrice = $1 WHERE rId = $2',
    update_FoodItem: 'UPDATE FoodItems SET foodName=$1, price=$2, dailyLimit=$3, categoryId=$4 WHERE foodItemId=$5',
    update_FoodItem_Availability: 'UPDATE FoodItems SET itemAvailability = $1 WHERE foodItemId=$2',
    update_Customer_By_cid: 'UPDATE Customers SET username = $1, password = $2, rewardPoints = $3, registeredCreditCard = $4 WHERE cid = $5',
    

    /* View total cost of all orders for each month */
    get_total_cost_of_all_orders: 'WITH OrderSubtotal AS (SELECT o.timeRiderDeliversOrder, o.oid, CASE WHEN (o.pid IS NOT NULL) THEN (SELECT od.quantity*fi.price*p.discountRate as subTotal FROM Orders o JOIN Order_Details od USING (oid) JOIN FoodItems fi ON (od.fId = fi.foodItemId) JOIN PROMO p USING (pid)) ELSE (SELECT od.quantity*fi.price as subTotal FROM Orders o JOIN Order_Details od USING (oid) JOIN FoodItems fi ON (od.fId = fi.foodItemId)) END AS subTotal FROM Orders o JOIN Order_Details od USING (oid) JOIN FoodItems fi ON (od.fId = fi.foodItemId) JOIN PROMO p USING (pid)) SELECT sum(subTotal) FROM OrderSubtotal WHERE o.timeRiderDeliversOrder BETWEEN $1 AND $2',

    /* View total number of orders placed for specific hour for specific location area */


    /* View total number of orders delivered by a rider for a month */
    get_total_order_delivered_by_rider: 'SELECT count(*) FROM Orders WHERE riderId = $1 AND timeOrderPlaced >= $2 AND o.timeOrderPlaced < $3',

    /* View total number of hours worked by a rider for a month */
    get_total_hours_worked_by_rider: 'SELECT count(*) FROM Orders WHERE riderId = $1 AND timeOrderPlaced >= $2 AND o.timeOrderPlaced < $3 AND rating IS NOT NULL',

    /* View average rating received by a rider for all the orders for that month */
    get_avg_rating_for_a_rider: 'SELECT avg(rating) FROM Orders WHERE riderId = $1 AND timeOrderPlaced >= $2 AND o.timeOrderPlaced < $3 AND rating IS NOT NULL',

    /* A list of free riders currently 

    /* Total Base salary by a part time rider with rider id  between date to date (Without the bonus for each order)  */
    get_total_base_salary_by_part_time_rider:'SELECT baseSalary * (SELECT count(distinct week) from WorkInteval WHERE date Between $1 And $2 and rId = $3 ) AS sum FROM EmploymentType JOIN DeliveryRiders using (employmentTypeId) where rId = $3',
    /* Total Base salary by a full time rider with rider id  between date to date */
    get_total_base_salary_by_full_time_rider:'SELECT baseSalary * (SELECT count(distinct mwsId) from WorkInteval WHERE date Between $1 And $2 and rId = $3 ) AS sum FROM EmploymentType JOIN DeliveryRiders using (employmentTypeId) where rId = $3',
    
    /* Total hours worked by the rider 1 from Date 2 to Date 3 */
    get_total_work_hour:'SELECT sum(start_time-end_time) FROM WorkInterval WHERE date BETWEEN $2 AND $3 and rId = $1',


    /* Delete customer */
    delete_customer: 'DELETE FROM Customers WHERE cid=$1',
    
    
}
