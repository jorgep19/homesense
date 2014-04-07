-- Insert carriers
INSERT INTO phone_carrier (pcName, pcEmailToSmsUrl)
VALUES
    ('att', 'txt.att.net'),
    ('verizon', 'vtext.com'),
    ('tmobile', 'tmomail.net');

-- Insert Sensor Types
INSERT INTO sensor_type
VALUES
    (1, 'Temperature'),
    (2, 'Motion'),
    (3, 'Luminosity');

--SAMPLE DATA
-- insert a customer
INSERT INTO
   customer(cusFirst, cusLast, cusEmail, cusPassword)
VALUES
   ('Jorge', 'Paez', 'jorgep@gmail.com', 'password');

-- Adding a device to a customer
INSERT INTO device (cusID, devDesc)
VALUES ( (SELECT cusID FROM customer where cusEmail = 'jorgep@gmail.com'), 'Garage_PI');

-- Adding a temp sensor to the "garage PI"
INSERT INTO sensor(cusID, devID, stypeID, sensDesc)
VALUES (
    (SELECT cusID FROM customer where cusEmail = 'jorgep@gmail.com'),
    (SELECT devID FROM device WHERE devDesc = 'Garage_PI'),
    (SELECT stypeID FROM  sensor_type WHERE stypeDesc = 'Temperature'),
    'Garage_Temp');

-- Adding data o this sensor
INSERT INTO sensor_data (cusID, sensID, sdataValue)
VALUES (
    (SELECT cusID FROM Customer WHERE cusEmail = 'jorgep@gmail.com'),
    (SELECT sensID FROM Device, Sensor WHERE devDesc = 'Garage_Pi' AND sensDesc = 'Garage_Temp'),
    10
);
