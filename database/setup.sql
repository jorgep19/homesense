CREATE DATABASE homesense;

-- Stores customer details
CREATE TABLE customer (
    cusID SERIAL,
    cusFirst VARCHAR(255) NOT NULL,
    cusLast VARCHAR(255) NOT NULL,
    cusMI CHAR(1) DEFAULT '',
    cusEmail VARCHAR(255) NOT NULL UNIQUE,
    cusPassword VARCHAR(255) NOT NULL,
    cusRegDate TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY (cusID)
);

-- Stores profile picture just for fun
CREATE TABLE customer_picture (
    cuspicID SERIAL,
    cusID integer REFERENCES customer(cusID),
    cuspicPicture bytea,
    PRIMARY KEY(cuspicID)
);

-- stores PhoneCarrier types
CREATE TABLE phone_carrier (
    pcID SERIAL,
    pcName VARCHAR(255) NOT NULL UNIQUE,
    pcEmailToSmsUrl VARCHAR(255),
    PRIMARY KEY(pcID)
);

-- stores types of phone numbers
CREATE TABLE phone_number_type (
    phtID SERIAL,
    phtDesc VARCHAR(255) UNIQUE,
    PRIMARY KEY(phtID)
);

-- stores customer phone numbers
CREATE TABLE phone_number (
    phID SERIAL,
    cusID INTEGER REFERENCES customer(cusID),
    pcID INTEGER REFERENCES phone_carrier(pcID),
    phtID INTEGER REFERENCES phone_number_type(phtID),
    phNumber VARCHAR(255) NOT NULL,
    PRIMARY KEY(phID)
);

-- Stores mapping between a customer and a Raspberry Pi device
CREATE TABLE device (
    devID SERIAL,
    cusID INTEGER REFERENCES Customer (cusID),
    devActivated BOOLEAN DEFAULT FALSE,
    devDesc VARCHAR(255) NOT NULL,
    devAddedDate TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY (devID)
);

-- Sensor: stores types of sensors we can attach to
CREATE TABLE sensor_type (
    stypeID SERIAL,
    stypeDesc VARCHAR(255) UNIQUE,
    PRIMARY KEY (stypeID)
);

-- Stores the mapping between a CustomerRasPi  device and sensors
CREATE TABLE Sensor (
    sensID SERIAL,
    cusID INTEGER REFERENCES customer (cusID),
    devID INTEGER REFERENCES device (devID),
    stypeID INTEGER REFERENCES sensor_type (stypeID),
    sensDesc VARCHAR(255) NOT NULL,
    PRIMARY KEY(sensID),
    UNIQUE(devID, stypeID, sensDesc)
);

-- stores various values from different sensor types
CREATE TABLE sensor_data (
    sdataID SERIAL,
    cusID INTEGER REFERENCES Customer (cusID),
    sensID INTEGER REFERENCES Sensor (sensID),
    sdataValue VARCHAR(255) NOT NULL,
    sdataRecordedDate TIMESTAMP DEFAULT current_timestamp,
    PRIMARY KEY(sdataID)
);