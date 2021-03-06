DROP TABLE IF EXISTS FoodItemCategories CASCADE;
DROP TABLE IF EXISTS FoodItems CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Promo CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS OrderDetails CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS RestaurantsStaff CASCADE;
DROP TABLE IF EXISTS fdsmanagers CASCADE;
DROP TABLE IF EXISTS DeliveryRiders CASCADE;
DROP TABLE IF EXISTS WorkInterval CASCADE;
DROP TABLE IF EXISTS EmploymentType CASCADE;


CREATE TABLE Customers(
cId SERIAL PRIMARY KEY,
username VARCHAR(10) UNIQUE NOT NULL,
password VARCHAR(10) NOT NULL,
rewardPoints INTEGER DEFAULT 0,
joinDate Date NOT NULL,
registeredCreditCard VARCHAR(16)
);



CREATE TABLE FDSManagers(
username VARCHAR(10) NOT NULL,
password VARCHAR(10) NOT NULL,
PRIMARY KEY(username)
);

CREATE TABLE Restaurants (
rId SERIAL PRIMARY KEY,
rName VARCHAR(50) UNIQUE NOT NULL,
minOrderPrice NUMERIC NOT NULL check (minOrderPrice>0) ,
locationArea VARCHAR(30) NOT NULL,
rAddress VARCHAR(100) NOT NULL
);

CREATE TABLE RestaurantsStaff(
username VARCHAR(10) NOT NULL,
password VARCHAR(10) NOT NULL,
rId INTEGER REFERENCES Restaurants(rId),
PRIMARY KEY(username)
);

CREATE TABLE EmploymentType(
employmentTypeId SERIAL PRIMARY KEY,
employmentTypeName VARCHAR(10) UNIQUE NOT NULL,
baseSalary NUMERIC NOT NULL,
perOrderSalary NUMERIC NOT NULL
);

CREATE TABLE DeliveryRiders(
drId SERIAL NOT NULL,
name VARCHAR(10) NOT NULL,
phoneNo INTEGER UNIQUE NOT NULL,
password VARCHAR(10) NOT NULL,
startDate Date NOT NULL,
employmentTypeId INTEGER references employmentType(employmentTypeId),
PRIMARY KEY (drId)
);


CREATE TABLE FoodItemCategories (
categoryId SERIAL PRIMARY KEY,
name VARCHAR(20) NOT NULL UNIQUE
);
 
 
CREATE TABLE FoodItems (
foodItemId SERIAL NOT NULL UNIQUE,
foodName VARCHAR(20) NOT NULL,
price NUMERIC NOT NULL,
daily_limit INTEGER NOT NULL,
itemAvailability VARCHAR (1) check (itemAvailability in ('T','F')),
rId INTEGER REFERENCES Restaurants,
categoryId INTEGER REFERENCES FoodItemCategories,
PRIMARY KEY(rId, foodItemId),
UNIQUE(foodName,rId )
);



CREATE TABLE Promo (
pId SERIAL PRIMARY KEY,
promoName VARCHAR(20) NOT NULL,
startDate Date NOT NULL,
endDate Date NOT NULL,
discountRate NUMERIC NOT NULL,
rID INTEGER REFERENCES Restaurants(rId),
cId Integer REFERENCES Customers(cId)
);



CREATE TABLE Orders(
oId SERIAL NOT NULL,
rid INTEGER NOT NULL REFERENCES Restaurants,
cId INTEGER NOT NULL REFERENCES Customers,
riderId INTEGER REFERENCES DeliveryRiders (drId),
address VARCHAR(20) NOT NULL,
rating INTEGER DEFAULT 5 check (rating>=0 and rating <=5),
reviews VARCHAR(50),
pId INTEGER REFERENCES Promo,
timeOrderPlaced TIMESTAMP NOT NULL,
timeRiderDepartsToCollect TIMESTAMP ,
timeRiderArrivesRes TIMESTAMP ,
timeRiderDepartsRes TIMESTAMP ,
timeRiderDeliversOrder TIMESTAMP ,
complete boolean DEFAULT FALSE,
PRIMARY KEY (oId)
);

CREATE TABLE OrderDetails(
oId INTEGER REFERENCES Orders,
fId INTEGER REFERENCES FoodItems(foodItemId),
quantity INTEGER NOT NULL check (quantity>0),
specialRequest VARCHAR(100),
PRIMARY KEY(oId,fId)
);



CREATE TABLE WorkInterval(
drId Integer NOT NULL references DeliveryRiders(drId),
intervalId  Integer NOT NULL,
date Date NOT NULL,
start_time TIME NOT NULL,
end_time TIME NOT NULL,
weekNum INTEGER NOT NULL,
mwsId INTEGER,
PRIMARY KEY(drId, intervalId)    
);




-- TRIGGER 1.1: check food item limit before inserting orderDetails
CREATE OR REPLACE FUNCTION check_food_limit()
RETURNS TRIGGER AS $$
	DECLARE 
		foodName text;
    BEGIN
		SELECT FoodItems.foodName into foodName FROM FoodItems WHERE FoodItems.foodItemId = NEW.fId and FoodItems.itemAvailability='F';
        IF foodName is not null THEN
			RAISE exception 'The Food Item with id % name % is not available for ordering because it has reached its daily maximum', NEW.fId, NEW.foodName;
    END IF;
    RETURN NEW;
    END;
    
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_new_food_limit ON OrderDetails;
CREATE TRIGGER check_new_food_limit
BEFORE UPDATE OF quantity or INSERT ON OrderDetails
FOR EACH ROW 
EXECUTE FUNCTION check_food_limit();

-- TRIGGER 2: update the status of foodItems into 'F' if it reaches daily limit
CREATE OR REPLACE FUNCTION update_food_status()
RETURNS TRIGGER AS $$ 
	DECLARE totalNumberSold NUMERIC;
    DECLARE daily_limit INTEGER;
    DECLARE itemAvailability text;
    DECLARE selectedFID INTEGER;
    BEGIN 
		SELECT sum(od.quantity) INTO totalNumberSold FROM FoodItems fi, Orders o, OrderDetails od
		WHERE o.oid = od.oid AND
		od.fid = fi.foodItemId AND
		od.fid = NEW.fid;

    SELECT fi.daily_limit INTO daily_limit FROM FoodItems fi, Orders o, OrderDetails od
		WHERE o.oid = od.oid AND
		od.fid = fi.foodItemId AND
		od.fid = NEW.fid;

    SELECT fi.itemAvailability INTO itemAvailability FROM FoodItems fi, Orders o, OrderDetails od
		WHERE o.oid = od.oid AND
		od.fid = fi.foodItemId AND
		od.fid = NEW.fid;

    select NEW.fId into selectedFID;
      
		IF totalNumberSold = daily_limit AND itemAvailability <> 'F' THEN
		UPDATE FoodItems SET itemAvailability ='F' WHERE foodItemId = selectedFID;
  
		END IF;
		RETURN NULL;
	END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS updateLimitTrigger ON OrderDetails;
CREATE TRIGGER updateLimitTrigger 
AFTER INSERT OR UPDATE ON OrderDetails
FOR EACH ROW 
EXECUTE FUNCTION update_food_status();
    
    

-- TRIGGER 3: check minimum order amount
CREATE OR REPLACE FUNCTION check_minimum()
RETURNS TRIGGER AS $$
    DECLARE total NUMERIC;
    DECLARE minimumAmount NUMERIC;
    BEGIN
    SELECT sum(od.quantity*fi.price) INTO total 
    FROM FoodItems fi, OrderDetails od
    WHERE od.fid = fi.foodItemId
    GROUP BY od.oId
    HAVING od.oId = NEW.oId;

    SELECT r.minOrderPrice INTO minimumAmount
    FROM Restaurants r
    WHERE r.rId = NEW.rId;

    IF total >= minimumAmount THEN
    RETURN NEW;
    ELSE RAISE exception 'The order amount % has not reach the minimum order amount %',total,minimumAmount ;
    END IF;
    RETURN NULL;    
    END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS check_min_order ON Orders;
CREATE constraint TRIGGER check_min_order
AFTER INSERT OR UPDATE ON Orders
DEFERRABLE INITIALLY DEFERRED 
FOR EACH ROW
EXECUTE FUNCTION check_minimum();


-- TRIGGER 4: add reward point to customer after order has been completed
CREATE OR REPLACE FUNCTION add_reward_point()
RETURNS TRIGGER AS $$
    DECLARE total NUMERIC;
    DECLARE customerId Integer;
    BEGIN
    SELECT sum(od.quantity*fi.price) INTO total 
    FROM FoodItems fi, OrderDetails od
    WHERE od.fid = fi.foodItemId
    GROUP BY od.oId
    HAVING od.oId = NEW.oId;
    UPDATE Customers SET rewardPoints = rewardPoints + CAST(total AS INT) WHERE cId = NEW.cId;
    RETURN NULL;

    END;   

$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS add_point ON Orders;
CREATE constraint TRIGGER add_point
AFTER INSERT ON Orders
DEFERRABLE INITIALLY DEFERRED 
FOR EACH ROW
EXECUTE FUNCTION add_reward_point();


--dummy data
INSERT INTO Customers(cId,username,password,rewardPoints,joinDate,registeredCreditCard) VALUES (1, 'Mark', 'owowats', 1, '02-02-2020', '1234123412341234');

INSERT INTO Restaurants(RId,RName,minOrderPrice,locationArea,RAddress) VALUES(1,'Maggy',100,'21875','37248'),(2,'Chadwick',12,'624770','10468'),(3,'Beau',15,'48565','25083'),(4,'Hasad',17,'920639','211930'),(5,'Kieran',12,'24503','51963'),(6,'Xander',18,'027649','6082'),(7,'Yeo',16,'63669','P2J 5Y9'),(8,'Leila',16,'GY3L 8JL','7123'),(9,'Abdul',19,'Z0165','07086'),(10,'Fatima',17,'11964','41182');
-- INSERT INTO RestaurantsStaff(username,password) VALUES('Adara','9808'),('Kasper','1801'),('Philip','3267'),('Alison','3087'),('Tall','6471'),('Deacon','5480'),('Ali','8239'),('Beck','1964'),('Xenos','9717'),('Chris','7723');
-- INSERT INTO FDSManagers(username,password) VALUES('Tiger','4974'),('Dahlia','9056'),('Lara','9681'),('Ali','3152'),('Iona','3652'),('Clayton','1429'),('Fulton','1588'),('Blair','4301'),('Molly','2595'),('Davis','6345');
INSERT INTO FoodItemCategories(categoryId,name) VALUES(1,'Chicken'),(2,'Fish'),(3,'Rice'),(4,'Noodle'),(5,'Drinks');


-- WITH X AS(SELECT oId FROM Orders WHERE rId = $1 ),
--  Y AS (SELECT oId, sum(od.quantity*f.price) as sumPerOrder FROM OrderDetails od JOIN FoodItems f on od.fId = f.foodItemId WHERE fId In X ORDER BY oId) 
--  select sum(sumPerOrder) from Y

INSERT INTO FoodItems(fooditemid, foodname, price, daily_limit, itemavailability, rid, categoryId) VALUES(1, 'ice cream', 1, 1, 'T', 1, 1);
WITH newOid AS (
        INSERT INTO Orders (cId, rid, address, pId, timeOrderPlaced)
        VALUES (1,2,'address',null,CAST (NOW() AS DATE))
        RETURNING oid
      )
INSERT INTO OrderDetails (oid, fid, quantity, specialrequest) VALUES ((SELECT newOid.oid FROM newOid), 1, 1, 'None');

WITH newOid AS (
        INSERT INTO Orders (cId, rid, address, pId, timeOrderPlaced)
        VALUES (1,2,'address',null,CAST (NOW() AS DATE))
        RETURNING oid
      )
INSERT INTO OrderDetails (oid, fid, quantity, specialrequest) VALUES ((SELECT newOid.oid FROM newOid), 1, 1, 'None');


