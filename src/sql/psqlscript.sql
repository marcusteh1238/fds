DROP TABLE IF EXISTS FoodItemCategories CASCADE;
DROP TABLE IF EXISTS FoodItems CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Promo CASCADE;
DROP TABLE IF EXISTS PromoForCustomer CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS OrderDetails CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS RestaurantsStaff CASCADE;
DROP TABLE IF EXISTS fdsmanagers CASCADE;
DROP TABLE IF EXISTS DeliveryRiders CASCADE;
DROP TABLE IF EXISTS WorkInterval CASCADE;
DROP TABLE IF EXISTS EmploymentType CASCADE;


CREATE TABLE Customers(
cId INTEGER NOT NULL,
username VARCHAR(10) UNIQUE NOT NULL,
password VARCHAR(10) NOT NULL,
rewardPoints INTEGER DEFAULT 0,
joinDate Date NOT NULL,
registeredCreditCard VARCHAR(16),
PRIMARY KEY(cId)
);

CREATE TABLE RestaurantsStaff(
username VARCHAR(10) NOT NULL,
password VARCHAR(10) NOT NULL,
PRIMARY KEY(username)
);

CREATE TABLE FDSManagers(
username VARCHAR(10) NOT NULL,
password VARCHAR(10) NOT NULL,
PRIMARY KEY(username)
);

CREATE TABLE Restaurants (
RId INTEGER,
RName VARCHAR(50) UNIQUE NOT NULL,
minOrderPrice NUMERIC NOT NULL check (minOrderPrice>0) ,
locationArea VARCHAR(30) NOT NULL,
RAddress VARCHAR(100) NOT NULL,
PRIMARY KEY (RId)
);

CREATE TABLE EmploymentType(
employmentTypeId INTEGER NOT NULL,
employmentTypeName VARCHAR(10) UNIQUE NOT NULL,
baseSalary NUMERIC NOT NULL,
perOrderSalary NUMERIC NOT NULL,
PRIMARY KEY(employmentTypeId)

);

CREATE TABLE DeliveryRiders(
rId INTEGER NOT NULL,
name VARCHAR(10) NOT NULL,
phoneNo INTEGER NOT NULL,
password VARCHAR(10) NOT NULL,
startDate Date NOT NULL,
employmentTypeId INTEGER references employmentType(employmentTypeId),
PRIMARY KEY (rId)
);


CREATE TABLE FoodItemCategories (
categoryId INTEGER,
name VARCHAR(20) NOT NULL UNIQUE,
PRIMARY KEY (categoryId)
);
 
 
CREATE TABLE FoodItems (
foodItemId  INTEGER,
foodName VARCHAR(20) NOT NULL,
price NUMERIC NOT NULL,
daily_limit INTEGER NOT NULL,
itemAvailability VARCHAR (1) check (itemAvailability in ('T','F')),
rId INTEGER REFERENCES Restaurants,
categoryId INTEGER REFERENCES FoodItemCategories,
PRIMARY KEY (foodItemId)
);
 


CREATE TABLE Promo (
pId INTEGER,
promoName VARCHAR(20) NOT NULL,
startDate Date NOT NULL,
endDate Date NOT NULL,
discountRate NUMERIC NOT NULL,
rID INTEGER REFERENCES Restaurants,
cId Integer REFERENCES Customers,
PRIMARY KEY (pId)
);



CREATE TABLE Orders(
oId INTEGER NOT NULL,
rid INTEGER NOT NULL REFERENCES Restaurants,
cId INTEGER REFERENCES Customers,
riderId INTEGER REFERENCES DeliveryRiders (rId),
address VARCHAR(20) NOT NULL,
rating INTEGER DEFAULT 5 check (rating>=0 and rating <=5),
reviews VARCHAR(50),
pId INTEGER REFERENCES Promo,
timeOrderPlaced Date NOT NULL,
timeRiderDepartsToCollect Date ,
timeRiderArrivesRes Date ,
timeRiderDepartsRes Date ,
timeRiderDeliversOrder Date ,
complete boolean DEFAULT FALSE,
PRIMARY KEY (oId)
);

CREATE TABLE OrderDetails(
oId INTEGER REFERENCES Orders,
fId INTEGER REFERENCES FoodItems,
quantity INTEGER NOT NULL check (quantity>0),
specialRequest VARCHAR(100),
PRIMARY KEY(oId,fId)
);



CREATE TABLE WorkInterval(
rId Integer NOT NULL references DeliveryRiders,
intervalId  Integer NOT NULL,
date Date NOT NULL,
start_time TIME NOT NULL,
end_time TIME NOT NULL,
weekNum INTEGER NOT NULL,
mwsId INTEGER,
PRIMARY KEY(rId, intervalId)    
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
    BEGIN 
		SELECT sum(fi.quantity) INTO totalNumberSold FROM FoodItems fi, Orders o, OrderDetails od
		WHERE NEW.date(timeOrderPlaced) = o.date(timeOrderPlaced) AND
		o.oid = od.oid AND
		od.fid = fi.fid AND
		od.fid = NEW.fid; 
		IF totalNumberSold = fi.daily_limit AND itemAvailability <> 'F' THEN
		UPDATE FoodItems SET itemAvailability = 'F' WHERE fid = NEW.fid;
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
    DECLARE rId Integer;
    BEGIN
    SELECT r.RId as rId, sum(od.quantity*fi.price) as total FROM FoodItems fi, 
    Orders o JOIN OrderDetails od USING (oid), Restaurants r
    WHERE NEW.oid = o.oid AND
    od.fid = fi.fid;
    IF total >= r.minOrderPrice THEN
    RETURN NEW;
    ELSE RAISE exception 'The order has not reach the minimum order amount';
    END IF;
    RETURN NULL;    
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_min_order
BEFORE INSERT OR UPDATE ON Orders
EXECUTE FUNCTION check_minimum();


-- TRIGGER 4: add reward point to customer after order has been completed
CREATE OR REPLACE FUNCTION add_reward_point()
RETURNS TRIGGER AS $$
    DECLARE total NUMERIC;
    DECLARE customerId Integer;
    BEGIN
    SELECT c.cId as customerId, sum(od.quantity*fi.price) as total FROM FoodItems fi, 
    Orders o JOIN OrderDetails od USING (oid), Customers c
    WHERE NEW.oid = o.oid AND
    od.fid = fi.fid;
    UPDATE Customers SET rewardPoints = rewardPoints + CAST(total AS INT) WHERE cId = customerId;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_point
AFTER INSERT ON Orders
EXECUTE FUNCTION add_reward_point();


--dummy data
-- INSERT INTO Customers(cId,username,rewardPoints,joinDate,registeredCreditCard) VALUES(1,'Sade',0,'11/01/2019','5377830405202395'),(2,'Laura',0,'08/22/2020','5499023976889336'),(3,'Bruce',0,'01/02/2021','5117954070692188'),(4,'Kylynn',0,'03/12/2021','5448082263759919'),(5,'Tad',0,'04/03/2019','5382940467214320'),(6,'Nigel',0,'05/07/2019','5225096766781138'),(7,'Nita',0,'07/23/2020','5192549986365057'),(8,'Keelie',0,'09/01/2019','5527789691763594'),(9,'Deirdre',0,'05/26/2020','5109510697360730'),(10,'Celeste',0,'01/12/2020','5130375140838275');
INSERT INTO Restaurants(RId,RName,minOrderPrice,locationArea,RAddress) VALUES(1,'Maggy',16,'21875','37248'),(2,'Chadwick',12,'624770','10468'),(3,'Beau',15,'48565','25083'),(4,'Hasad',17,'920639','211930'),(5,'Kieran',12,'24503','51963'),(6,'Xander',18,'027649','6082'),(7,'Yeo',16,'63669','P2J 5Y9'),(8,'Leila',16,'GY3L 8JL','7123'),(9,'Abdul',19,'Z0165','07086'),(10,'Fatima',17,'11964','41182');
-- INSERT INTO RestaurantsStaff(username,password) VALUES('Adara','9808'),('Kasper','1801'),('Philip','3267'),('Alison','3087'),('Tall','6471'),('Deacon','5480'),('Ali','8239'),('Beck','1964'),('Xenos','9717'),('Chris','7723');
-- INSERT INTO FDSManagers(username,password) VALUES('Tiger','4974'),('Dahlia','9056'),('Lara','9681'),('Ali','3152'),('Iona','3652'),('Clayton','1429'),('Fulton','1588'),('Blair','4301'),('Molly','2595'),('Davis','6345');
INSERT INTO FoodItemCategories(categoryId,name) VALUES(1,'Chicken'),(2,'Fish'),(3,'Rice'),(4,'Noodle'),(5,'Drinks');