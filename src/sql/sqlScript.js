module.exports = {

    // create customer
    add_customer: 'INSERT INTO customers (username, password,registeredCreditCard,joinDate) VALUES($1, $2, $3, CAST (NOW() AS DATE))',
    add_restaurantsStaff: 'INSERT INTO RestaurantsStaff (username) VALUES ($1)',
    add_fdsManagers: 'INSERT INTO FDSManagers VALUES ($1)',
    add_deliveryDrivers: 'INSERT INTO DeliveryRiders(rId, name, phoneNo, startDate, employmentType) VALUES ($1,$2, $3,CAST (NOW() AS DATE),$5 )',
    add_order: 'INSERT INTO Orders (cId, address,pId,timeOrderPlaced) VALUES ($1,$2,$3,CAST (NOW() AS TIMESTAMP)) RETURNING oId',
    add_promo: 'INSERT INTO Promo(startDate, endDate, discountDate,rId) VALUES($1,$2,$3,$4)',
    add_order_details: 'INSERT INTO OrderDetails (oid, rid, fid, quantity, specialrequest) VALUES', // values to be appended
    add_food_item: 'INSERT INTO FoodItems (foodname, price, daily_limit, itemavailability, rid, categoryid) VALUES ($1, $2, $3, $4, $5, $6)',
    add_order_with_details_transaction: `WITH newOid AS (
        INSERT INTO Orders (cId, rid, address, pId, timeOrderPlaced) 
        VALUES ($1,$2,$3,$4,CAST (NOW() AS TIMESTAMP)) 
        RETURNING oid
      )
      INSERT INTO OrderDetails (oid, fid, quantity, specialrequest) VALUES $VALUES$`,

    // retrieve
    get_customer_by_name: 'SELECT * FROM Customers WHERE username = $1',
    login_customer: 'SELECT * FROM Customers WHERE username = $1 AND password = $2',
    get_customer_by_cid: 'SELECT * FROM Customers WHERE cid = $1',

    get_customer_all_orders: 'SELECT * FROM Orders WHERE cid = $1',
    get_food_item_by_category: 'SELECT * FROM FoodItems WHERE categoryId = $1 and rId = $2',
    get_food_item_by_restaurants_id: 'SELECT * FROM FoodItems WHERE rid = $1',
    get_food_item_by_restaurants_name: 'SELECT * FROM FoodItems f WHERE f.rId = (select r.rId FROM Restaurants r where r.rname = $1)',
    get_reviews_by_restaurants_name: 'SELECT reviews FROM Orders WHERE rId = (select r.rId FROM Restaurants r where r.rname = $1)',
    get_average_rating_by_restaurants_name: 'SELECT avg(rating) FROM Orders WHERE rId = (select r.rId FROM Restaurants r where r.rname = $1)',

    get_monthly_completed_order_by_restaurants_id: 'SELECT * FROM Orders o WHERE o.timeRiderDeliversOrder IS NOT NULL and o.rid = $1 and o.timeRiderDeliversOrder between $2 and $3',
    get_total_cost_of_completed_Order_by_restaurants_id: 'WITH X AS(SELECT oId FROM Orders WHERE rId = $1 ), Y AS (SELECT oId, sum(od.quantity*f.price) as sumPerOrder FROM OrderDetails od JOIN FoodItems f on od.fId = f.foodItemId WHERE fId In X ORDER BY oId) select sum(sumPerOrder) from Y',
    get_top_5_favourite_foodItem_by_restaurants_id: 'WITH X AS(SELECT * FROM FoodItems f WHERE f.rId = $1) SELECT f.foodItemId, sum(quantity) as quantity FROM X f JOIN OrderDetails od on f.foodItemId = od.fid GROUP BY f.foodItemId order by quantity Desc limit 5',
    get_orders_by_date: 'SELECT * FROM Orders WHERE timeRiderDeliversOrder BETWEEN $1 AND $2',
    get_all_restaurants: 'SELECT * FROM Restaurants',
    get_restaurant: 'SELECT * FROM Restaurants WHERE rid = $1',
    get_promo: 'SELECT * FROM Promo WHERE pid = $1',

    get_rider_login: 'SELECT * FROM DeliveryRiders dr WHERE dr.name = $1 AND dr.password = $2',
    get_FDS_Manager_login: 'SELECT * FROM FDSManagers fm WHERE fm.username = $1 AND fm.password = $2',
    get_restaurant_staff_login: 'SELECT * FROM restaurantsstaff rs WHERE rs.username = $1 AND rs.password = $2',
    get_order_by_oid: 'SELECT * FROM Orders WHERE oid = $1',

    /*View total number of new customer for each month */
    get_total_new_customer_for_each_month: 'SELECT count(*) FROM Customers c WHERE c.joinDate BETWEEN $1 AND $2',

    /* View total number of orders for each month */
    get_total_new_orders_for_each_month: 'SELECT count(*) FROM Orders o WHERE o.timeOrderPlaced BETWEEN $1 AND $2',
    get_avg_orders_received_during_campaign: 
    `WITH filtered AS (
        SELECT COUNT(*), timeorderplaced::date as date FROM Orders
        WHERE rid = $1 AND timeorderplaced BETWEEN $2 AND $3
        GROUP BY date
    )
    SELECT CASE WHEN AVG(count) IS NULL
        THEN 0
        ELSE AVG(count) END AS average
    FROM filtered`,
    get_orders_received_during_campaign_per_day: `SELECT COUNT(*), timeorderplaced::date as date FROM Orders
    WHERE rid = $1 AND timeorderplaced BETWEEN $2 AND $3
    GROUP BY timeorderplaced::date`,

    // update

    update_FoodItem_DailyLimit: 'UPDATE FoodItems SET daily_limit = $1 WHERE foodItemId = $2',
    check_rid_food_item: 'SELECT 1 FROM FoodItems WHERE rid = $1 and foodItemId = $2',
    update_Min_Amount: 'UPDATE Restaurants SET minOrderPrice = $1 WHERE rId = $2',
    update_FoodItem: 'UPDATE FoodItems SET foodName=$1, price=$2, daily_limit=$3, categoryId=$4 WHERE foodItemId=$5',
    update_FoodItem_Availability: 'UPDATE FoodItems SET itemAvailability = $1 WHERE foodItemId=$2',
    update_Customer_By_cid: 'UPDATE Customers SET username = $1, password = $2, rewardPoints = $3, registeredCreditCard = $4 WHERE cid = $5',
    update_order_status_rider_departs: 'UPDATE Orders SET (riderId, timeriderdepartstocollect) VALUES ($1, CAST NOW() AS TIMESTAMP) WHERE oid = $2',
    update_order_status_rider_arrived_restaurant: 'UPDATE Orders SET (timeriderarrivesres) VALUES (CAST NOW() AS TIMESTAMP) WHERE oid = $1',
    update_order_status_delivery_success: 'UPDATE Orders SET (timeriderdeliversorder, complete) VALUES (CAST NOW() AS TIMESTAMP, TRUE) WHERE oid = $1',

    /* View total cost of all orders for each month */
    get_total_cost_of_all_orders: 'WITH OrderSubtotal AS (SELECT o.timeRiderDeliversOrder, o.oid, CASE WHEN (o.pid IS NOT NULL) THEN (SELECT od.quantity*fi.price*p.discountRate as subTotal FROM Orders o JOIN OrderDetails od USING (oid) JOIN FoodItems fi ON (od.fId = fi.foodItemId) JOIN PROMO p USING (pid)) ELSE (SELECT od.quantity*fi.price as subTotal FROM Orders o JOIN OrderDetails od USING (oid) JOIN FoodItems fi ON (od.fId = fi.foodItemId)) END AS subTotal FROM Orders o ) SELECT sum(subTotal) FROM OrderSubtotal o WHERE o.timeRiderDeliversOrder BETWEEN $1 AND $2',

    /* View total number of orders placed for specific hour for specific location area */


    /* View total number of orders delivered by a rider for a month */
    get_total_order_delivered_by_rider: 'SELECT count(*) FROM Orders WHERE riderId = $1 AND timeOrderPlaced BETWEEN $2 AND $3',

    /* View total number of hours worked by a rider for a month */
    get_total_hours_worked_by_rider: 'SELECT count(*) FROM Orders WHERE riderId = $1 AND timeOrderPlaced BETWEEN $2 AND $3 AND rating IS NOT NULL',

    /* View average rating received by a rider for all the orders for that month */
    get_avg_rating_for_a_rider: 'SELECT avg(rating) FROM Orders WHERE riderId = $1 AND timeOrderPlaced BETWEEN $2 AND $3 AND rating IS NOT NULL',

    /* A list of free riders currently 

    /* Total Base salary by a part time rider with rider id  between date to date (Without the bonus for each order)  */
    get_total_base_salary_by_part_time_rider:'SELECT baseSalary * (SELECT count(distinct weeknum) from WorkInterval wd WHERE date Between $1 And $2 and wd.drId = $3 ) AS sum FROM EmploymentType JOIN DeliveryRiders dr using (employmentTypeId) where dr.drId = $3',
    /* Total Base salary by a full time rider with rider id  between date to date */
    get_total_base_salary_by_full_time_rider:'SELECT baseSalary * (SELECT count(distinct mwsId) from WorkInterval wd WHERE date Between $1 And $2 and wd.drId = $3 ) AS sum FROM EmploymentType JOIN DeliveryRiders dr using (employmentTypeId) where dr.drid = $3',
    
    /* Total hours worked by the rider 1 from Date 2 to Date 3 */
    get_total_work_hour:'SELECT sum(start_time-end_time) FROM WorkInterval WHERE date BETWEEN $2 AND $3 and drId = $1',


    /* Delete customer */
    delete_customer: 'DELETE FROM Customers WHERE cid=$1',
    
    
}
