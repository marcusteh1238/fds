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




