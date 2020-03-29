module.exports = {

    // create customer
    add_customr: 'INSERT INTO customers (username, fullName, rewardPoints,registeredCreditCard,joinDate) VALUES($1, $2, $3, $4, $6, CAST (NOW() AS TIME))',
    add_restaurantsStaff: 'INSERT INTO RestaurantsStaff (username) VALUES ($1)',
    add_fdsManagers: 'INSERT INTO FDSManagers VALUES ($1)',
    add_deliveryDrivers: 'INSERT INTO DeliveryRiders(rId, name, phoneNo, startDate, employmentType) VALUES ($1,$2, $3,CAST (NOW() AS TIME),$5 )',
    add_order: 'INSERT INTO Orders (cId, address,pId,timeOrderPlaced) VALUES ($1,$2,$3,CAST (NOW() AS TIME))',
    add_Promo: 'INSERT INTO Promo(startDate, endDate, discountDate,rId) VALUES($1,$2,$3,$4)',
    
    
    // retrieve
    get_customer_by_name:'SELECT * FROM Customers WHERE username = $1',
    get_food_item_by_category: 'SELECT * FROM FoodItem WHERE categoryId = $1',
    get_food_item_by_restaurants_id: 'SELECT * FROM FoodItem WHERE rid = $1',
    get_food_item_by_restaurants_name: 'SELECT * FROM FoodItem f WHERE f.rId = (select r.rId FROM Restaurants r where r.name = $1',
    get_reviews_by_restaurants_name: 'SELECT reviews FROM Orders WHERE rId = (select r.rId FROM Restaurants r where r.name = $1',
    get_average_rating_by_restaurants_name:'SELECT avg(rating) FROM Orders WHERE rId = (select r.rId FROM Restaurants r where r.name = $1',
    get_monthly_completed_order_by_restaurants_id:'SELECT * FROM Orders o WHERE o.timeRiderDeliversOrder IS NOT NULL and o.rid = $1 and o.timeRiderDeliversOrder between $2 and $3',
    get_total_cost_of_completed_Order_by_restaurants_id: 'WITH X AS(SELECT oId FROM Orders WHERE rId = $1 ), Y AS (SELECT oId, sum(od.quantity*f.price) as sumPerOrder FROM OrderDetails od JOIN FoodItems f on od.fId = f.foodItemId WHERE fId In X ORDER BY oId) select sum(sumPerOrder) from Y',
    get_top_5_favourite_foodItem_by_restaurants_id:'WITH X AS(SELECT * FROM FoodItems f WHERE f.rId = $1), Y AS (SELECT f.fId, sum(quantity) FROM X f JOIN OrderDetails od on f.foodItemId = od.fId order by f.fId Desc limit 5',
    get_Orders_By_Date:'SELECT * FROM Orders WHERE timeRiderDeliversOrder IS BETWEEN $1 AND $2',


    // update

    update_FoodItem_DailyLimit:'UPDATE FoodItems SET daily_limit = $1 WHERE foodItemId = $2',
    update_Min_Order_Amount:'UPDATE Restaurants SET minOrderPrice = $1 WHERE rId = $2'
    

     


    
    
    
    /*
    
    get_bids_passenger: 'SELECT * FROM Bids WHERE pid = $1',
    get_win_bid: 'SELECT pid FROM Bids WHERE did = $1 AND rdate = $2 AND rtime = $3 AND is_win',
    get_current_deal: 'SELECT R.uid, R.rdate, R.rtime, R.origin, R.destination, R.capacity, B.price, D.atime FROM Rides AS R, Bids AS B, Deals AS D WHERE R.uid = B.did AND B.did = D.did AND R.rdate = B.rdate AND B.rdate = D.rdate AND R.rtime = B.rtime AND B.rtime = D.rtime AND B.pid = $1 AND B.is_win AND R.reached = FALSE',
    get_deal: 'SELECT D.pid, R.rdate, R.rtime, R.origin, R.destination, B.price, D.atime FROM Rides AS R, Bids AS B, Deals AS D WHERE R.uid = $1 AND R.uid = B.did AND B.did = D.did AND R.rdate = $2 AND R.rdate = B.rdate AND B.rdate = D.rdate AND R.rtime = $3 AND R.rtime = B.rtime AND B.rtime = D.rtime AND B.is_win',
    check_password: 'SELECT uid FROM Users WHERE uid = $1 and password = $2',
    get_account: 'SELECT * FROM Users WHERE uid = $1',
    get_car: 'SELECT * FROM Owns AS O JOIN Cars AS C ON O.cid = C.plate WHERE O.uid = $1',
    get_evaluations: 'SELECT * FROM Evaluates WHERE did = $1',

    // update
    add_balance: 'UPDATE Users SET balance = balance + $2 WHERE uid = $1',
    delete_balance: 'UPDATE Users SET balance = balance - $2 WHERE uid = $1',
    update_win_bid: 'UPDATE Bids SET is_pending = FALSE, is_win = TRUE WHERE did = $1 AND pid = $2 AND rdate = $3 AND rtime = $4',
    update_other_bid: 'UPDATE Bids SET is_pending  = FALSE WHERE did = $1 AND rdate = $2 AND rtime = $3 AND is_win = FALSE',
    update_start_time: 'UPDATE Deals SET dtime = CAST (NOW() AS TIME) WHERE did = $1 AND rdate = $2 AND rtime = $3',
    update_ride_status: 'UPDATE Rides SET reached = TRUE WHERE uid = $1 AND rdate = $2 AND rtime = $3',
    
    // complex queries
    // 1: get all rides before current time
    get_all_rides: 'WITH X AS( SELECT * FROM Rides GROUP BY uid,rdate,rtime HAVING CAST (NOW() AS DATE)< rdate OR ( CAST (NOW() AS DATE)= rdate AND CAST (NOW() AS TIME)< rtime)) SELECT uid AS driver, rdate AS start_date, rtime AS start_time, origin, destination,capacity FROM X WHERE reached = FALSE ORDER BY uid',
    // 2: auto select bid
    auto_select: 'WITH X AS ( SELECT * FROM Bids WHERE did = $1 AND rdate = $2 AND rtime = $3 ORDER BY price DESC,pid ASC LIMIT 1) UPDATE Bids AS B SET is_win = TRUE, is_pending = FALSE FROM X WHERE B.did = X.did AND B.rdate = X.rdate AND B.rtime = X.rtime AND B.pid = X.pid',
    // 3: rank all rides according to driver ranking
    rank_drivers: 'WITH X AS ( SELECT D.uid FROM Drivers AS D WHERE D.uid IN ( SELECT R.uid FROM Rides AS R WHERE R.reached = FALSE )), Y AS ( SELECT E.did, AVG(rank) AS avgrank FROM Evaluates AS E GROUP BY E.did ) SELECT X.uid FROM X, Y WHERE X.uid = Y.did ORDER BY Y.avgrank DESC;'
    
}
*/