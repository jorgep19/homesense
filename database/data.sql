-- Insert carriers
INSERT INTO Phone_Carrier (pcName, pcEmailToSmsUrl)
VALUES
    ('att', 'txt.att.net'),
    ('verizon', 'vtext.com'),
    ('tmobile', 'tmomail.net');

-- Insert Sensor Types
INSERT INTO Sensor_Type
VALUES
    (1, 'Temperature'),
    (2, 'Motion'),
    (3, 'Luminosity'),
    (4, 'Humidity')
;

-- insert a customer
INSERT INTO
   Customer(cusFirst, cusLast, cusEmail, cusPassword)
VALUES
   ('Andrei', 'Sura', 'indera@gmail.com', '12345');

-- Adding a device to a customer
INSERT INTO device 
   (cusID, devDesc)
SELECT
   cusID, 'Window_PI'
FROM
   customer
WHERE
   cusEmail = 'indera@gmail.com'
;

-- Adding a temp sensor to the "garage PI"
INSERT INTO Sensor
   (cusID, devID, stypeID, sensDesc)
SELECT
   c.cusID, devID, stypeID, 'Window_PI_Temp'
FROM
   Customer c, Device, Sensor_Type
WHERE
   cusEmail = 'indera@gmail.com'
   AND devDesc = 'Window_PI'
   AND stypeDesc = 'Temperature'
;

-- Adding data to this sensor
INSERT INTO Sensor_Data 
   (cusID, sensID, sdataValue)
SELECT
    c.cusID, sensID, 20
FROM
   Customer c
   NATURAL JOIN Device
   NATURAL JOIN Sensor
   NATURAL JOIN Sensor_Type
WHERE
   cusEmail = 'indera@gmail.com'
   AND devDesc = 'Window_PI'
   AND sensDesc = 'Window_PI_Temp'
;
