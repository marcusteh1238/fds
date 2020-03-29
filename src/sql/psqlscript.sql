DROP TABLE IF EXISTS FoodItemCategories CASCADE;
DROP TABLE IF EXISTS FoodItems CASCADE;
DROP TABLE IF EXISTS Restaurants CASCADE;
DROP TABLE IF EXISTS Promo CASCADE;
DROP TABLE IF EXISTS PromoForCustomer CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS OrderDetails CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;
DROP TABLE IF EXISTS Restaurants_Staff CASCADE;
DROP TABLE IF EXISTS FDS_Managers CASCADE;
DROP TABLE IF EXISTS DeliveryRiders CASCADE;
DROP TABLE IF EXISTS WorkInterval CASCADE;


CREATE TABLE Customers(
cId INTEGER NOT NULL,
username VARCHAR(10),
password VARCHAR(10),
rewardPoints INTEGER DEFAULT 0,
joinDate Date NOT NULL,
registedCreditCard VARCHAR(16),
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
RName VARCHAR(20) NOT NULL,
minOrderPrice NUMERIC NOT NULL,
locationArea VARCHAR(20) NOT NULL,
RAddress VARCHAR(20) NOT NULL,
PRIMARY KEY (RId)
);

CREATE TABLE DeliveryRiders(
rId INTEGER NOT NULL,
name VARCHAR(10) NOT NULL,
phoneNo INTEGER NOT NULL,
password VARCHAR(10) NOT NULL,
startDate Date NOT NULL,
employmentType VARCHAR(4) NOT NULL check (employmentType in ('full','part')),
PRIMARY KEY (rId)
);
CREATE TABLE FoodItemCategories (
categoryId INTEGER,
name VARCHAR(20) NOT NULL,
PRIMARY KEY (categoryId)
);
 
CREATE TABLE FoodItems (
foodItemId  INTEGER,
foodname VARCHAR(20) NOT NULL,
price NUMERIC NOT NULL,
daily_limit INTEGER NOT NULL,
itemAvailability VARCHAR (1) check (itemAvailability in ('T','F')),
rId INTEGER REFERENCES Restaurants,
categoryId INTEGER REFERENCES FoodItemCategories,
PRIMARY KEY (foodItemId)
);
 


CREATE TABLE Promo (
pId INTEGER,
startDate Date NOT NULL,
endDate Date,
discountRate NUMERIC NOT NULL,
rID INTEGER REFERENCES Restaurants,
PRIMARY KEY (PId)
);

CREATE TABLE PromoForCustomer(
pId INTEGER REFERENCES Promo,
cId INTEGER REFERENCES Customers,
expirationDate Date NOT NULL,
PRIMARY KEY(pId,cId)
);

CREATE TABLE Orders(
oId INTEGER NOT NULL,
cId INTEGER REFERENCES Customers,
riderId INTEGER REFERENCES DeliveryRiders,
address VARCHAR(20) NOT NULL,
rating INTEGER DEFAULT 5,
reviews VARCHAR(50),
pId INTEGER REFERENCES Promo,
timeOrderPlaced Date not null,
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
quantity INTEGER NOT NULL,
specialRequest VARCHAR(30),
PRIMARY KEY(oId,fId)
);



CREATE TABLE WorkInterval(
riderId Integer NOT NULL references DeliveryRiders,
intervalId  Integer NOT NULL,
date Date NOT NULL,
start_time TIME NOT NULL,
end_time TIME NOT NULL,
weekNum INTEGER NOT NULL,
mwsID INTEGER,
PRIMARY KEY(riderId, intervalId)    
);

-- TRIGGER 1: check food item limit
CREATE OR REPLACE FUNCTION check_food_limit()
RETURNS TRIGGER AS $$
    DECLARE count NUMERIC;
    DECLARE id Integer;
    BEGIN
    SELECT od.fid, sum(fi.quantity) as count FROM FoodItems fi, Orders o, OrderDetails od
    WHERE NEW.date(timeOrderPlaced) = o.date(timeOrderPlaced) AND
    o.oid = od.oid AND
    od.fid = fi.fid; 
    IF count = fi.daily_limit THEN
    UPDATE FoodItems SET itemAvailability = 'F' WHERE fid = id;
    END IF;
    END;
    
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_new_food_limit
BEFORE INSERT OR UPDATE ON Orders
EXECUTE PROCEDURE check_food_limit();

-- TRIGGER 2: check minimum order amount
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
EXECUTE PROCEDURE check_minimum();


-- TRIGGER 3: add reward point to customer after order has been completed
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
EXECUTE PROCEDURE add_reward_point();



