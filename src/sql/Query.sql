/* Delivery rider login */
SELECT * FROM DeliveryRiders dr WHERE dr.username = ${username} AND dr.password = ${password}



/* FDS Manager login */
SELECT * FROM FDS_Managers fm WHERE fm.username = ${username} AND fm.password = ${password}

/*View total number of new customer for each month */
SELECT count(*) FROM Customers c WHERE c.joinDate >= ${monthBefore} AND c.joinDate < ${monthAfter}
    
/* View total number of orders for each month */
SELECT count(*) FROM Orders o WHERE o.timeOrderPlaced >= ${monthBefore} 
    AND o.timeOrderPlaced < ${monthAfter}
    
/* View total cost of all orders  for each month */
WITH OrderSubtotal AS (SELECT o.oid, CASE
    WHEN (o.pid IS NOT NULL) THEN (SELECT od.quantity*fi.price*p.discountRate as subTotal 
    FROM Orders o JOIN Order_Details od USING (oid) JOIN FoodItems fi
    ON (od.fId = fi.foodItemId) JOIN PROMO p USING (pid))
    ELSE (SELECT od.quantity*fi.price as subTotal 
    FROM Orders o JOIN Order_Details od USING (oid) JOIN FoodItems fi
    ON (od.fId = fi.foodItemId))
END AS subTotal
FROM Orders o JOIN Order_Details od USING (oid) JOIN FoodItems fi
    ON (od.fId = fi.foodItemId) JOIN PROMO p USING (pid))
SELECT sum(subTotal) FROM OrderSubtotal GROUP BY oid

/* View total number of orders placed for specific hour for specific location area */


/* View total number of orders delivered by a rider for a month */
SELECT count(*) FROM Orders WHERE riderId = ${riderId} AND timeOrderPlaced >= ${monthBefore} 
    AND o.timeOrderPlaced < ${monthAfter}
    
/* View total number of hours worked by a rider for a month */
SELECT count(*) FROM Orders WHERE riderId = ${riderId} AND timeOrderPlaced >= ${monthBefore} 
    AND o.timeOrderPlaced < ${monthAfter} AND rating IS NOT NULL

/* View average rating received by a rider for all the orders for that month */
SELECT avg(rating) FROM Orders WHERE riderId = ${riderId} AND timeOrderPlaced >= ${monthBefore} 
    AND o.timeOrderPlaced < ${monthAfter} AND rating IS NOT NULL

