/*
   hotel_sample_data.sql

   Inserts valid test data into the schema defined in hotel_schema.sql.
   
*/

BEGIN;

-------------------------------
-- 1) HOTELCHAIN
-------------------------------

INSERT INTO HotelChain (chain_name, address, headquarters_address, contact_phone, contact_email)
VALUES 
('LuxuryStay', '1234 Corporate Dr, Metropolis', '456 HQ Road, Metropolis', '111-111-1111', 'info@luxstay.com'), 
('BudgetRooms', '2345 Affordable St, Smallville', '789 HQ Lane, Smallville', '222-222-2222', 'contact@budgetrooms.com'), 
('CityHotels', '99 Downtown Ave, Gotham', '101 HQ Blvd, Gotham', '333-333-3333', 'hello@cityhotels.com'), 
('SeaSideChain', 'Ocean View Blvd, Atlantis', '12 HQ Pier, Atlantis', '444-444-4444', 'support@seasidechain.com'), 
('MountainResort', 'Alpine Way 567, Wakanda', 'Alpine HQ, Wakanda', '555-555-5555', 'contact@mountainresort.com'), 
('TestChainOmega', '1234 Test Dr, Ottawa, ON', 'HQ Road 789, Ottawa, ON', '999-999-9999', 'omega@testchain.com')
RETURNING chain_id;

-------------------------------
-- 2) HOTEL
-------------------------------

INSERT INTO Hotel (chain_id, hotel_name, category, address, manager_id)
VALUES
  (1, 'LuxuryStay Downtown', 5, '500 Grand Ave, Metropolis', NULL), (1, 'LuxuryStay Uptown', 5, '600 Grand Ave, Metropolis', NULL), (1, 'LuxuryStay Central', 4, '700 Grand Ave, Metropolis', NULL), (1, 'LuxuryStay East', 5, '800 Grand Ave, Metropolis', NULL), (1, 'LuxuryStay West', 5, '900 Grand Ave, Metropolis', NULL), (1, 'LuxuryStay Riverside', 5, '1000 River Rd, Metropolis', NULL), (1, 'LuxuryStay Parkview', 4, '1100 Park Ave, Metropolis', NULL), (1, 'LuxuryStay Garden', 5, '1200 Garden St, Metropolis', NULL), (1, 'LuxuryStay Heights', 5, '1300 Heights Blvd, Metropolis', NULL), (1, 'LuxuryStay Plaza', 5, '1400 Plaza Dr, Metropolis', NULL), (2, 'BudgetRooms Central', 4, '200 Affordable St, Smallville', NULL), (2, 'BudgetRooms East', 4, '210 Affordable St, Smallville', NULL), (2, 'BudgetRooms West', 3, '220 Affordable St, Smallville', NULL), (2, 'BudgetRooms North', 4, '230 Affordable St, Smallville', NULL), (2, 'BudgetRooms South', 4, '240 Affordable St, Smallville', NULL), (2, 'BudgetRooms Uptown', 4, '250 Affordable St, Smallville', NULL), (2, 'BudgetRooms Downtown', 4, '260 Affordable St, Smallville', NULL), (2, 'BudgetRooms Suburb', 3, '270 Affordable St, Smallville', NULL), (2, 'BudgetRooms Edge', 4, '280 Affordable St, Smallville', NULL), (2, 'BudgetRooms Corner', 4, '290 Affordable St, Smallville', NULL), (3, 'CityHotels Central', 3, '50 Downtown Ave, Gotham', NULL), (3, 'CityHotels East', 3, '60 Downtown Ave, Gotham', NULL), (3, 'CityHotels West', 3, '70 Downtown Ave, Gotham', NULL), (3, 'CityHotels North', 2, '80 Downtown Ave, Gotham', NULL), (3, 'CityHotels South', 3, '90 Downtown Ave, Gotham', NULL), (3, 'CityHotels Uptown', 3, '100 Downtown Ave, Gotham', NULL), (3, 'CityHotels Midtown', 3, '110 Downtown Ave, Gotham', NULL), (3, 'CityHotels Garden', 3, '120 Downtown Ave, Gotham', NULL), (3, 'CityHotels Plaza', 3, '130 Downtown Ave, Gotham', NULL), (3, 'CityHotels Riverside', 2, '140 Downtown Ave, Gotham', NULL), (4, 'SeaSideChain Bayview', 3, '10 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Harbor', 2, '20 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Coastline', 3, '30 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Marina', 2, '40 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Island', 3, '50 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Cove', 3, '60 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Shores', 2, '70 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Reef', 3, '80 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Lagoon', 2, '90 Ocean View Blvd, Atlantis', NULL), (4, 'SeaSideChain Bay', 3, '100 Ocean View Blvd, Atlantis', NULL),(5, 'MountainResort Peak', 2, '1500 Peak Dr, Wakanda', NULL), (5, 'MountainResort Base', 1, '100 Base Camp Rd, Wakanda', NULL), (5, 'MountainResort Summit', 2, '110 Summit Ave, Wakanda', NULL), (5, 'MountainResort Valley', 2, '120 Valley Rd, Wakanda', NULL), (5, 'MountainResort Ridge', 1, '130 Ridge Blvd, Wakanda', NULL), (5, 'MountainResort Meadow', 2, '140 Meadow Ln, Wakanda', NULL), (5, 'MountainResort Forest', 1, '150 Forest Rd, Wakanda', NULL), (5, 'MountainResort Lakeview', 2, '160 Lakeview Dr, Wakanda', NULL), (5, 'MountainResort Canyon', 1, '170 Canyon Rd, Wakanda', NULL), (5, 'MountainResort Plateau', 2, '180 Plateau Ave, Wakanda', NULL), (6, 'TestChainOmega Central', 1, '500 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega East', 1, '510 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega West', 1, '520 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega North', 1, '530 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega South', 1, '540 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega Downtown', 1, '550 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega Uptown', 1, '560 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega Suburb', 1, '570 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega Edge', 1, '580 Test Blvd, Ottawa, ON', NULL), (6, 'TestChainOmega Corner', 1, '590 Test Blvd, Ottawa, ON', NULL)
RETURNING hotel_id;

-------------------------------
-- 3) CUSTOMER
-------------------------------

INSERT INTO Customer (customer_sin, full_name, address, registration_date, email, phone, id_type, payment_info, password)
VALUES
('CUST001', 'Alice Wonderland', '12 Fantasy Road, Wonderland', '2025-03-30', 'alice@wonderland.com', '111-222-3333', 'SSN', '4111-1111-1111-1111', 'alicepass'), 
('CUST002', 'Bob Marley', '52 Reggae St, Kingston', '2025-03-30', 'bob@reggae.com', '222-333-4444', 'DriverLicense', '4222-2222-2222-2222', 'bobpass'), 
('CUST003', 'Charlie Brown', '100 Snoopy Ln, Peanuts', '2025-03-30', 'charlie@peanuts.org', '333-444-5555', 'SIN', '4333-3333-3333-3333', 'charliepass'), 
('CUST004', 'Diana Prince', 'Themyscira, Paradise Island', '2025-03-30', 'diana@amazon.com', '444-555-6666', 'SSN', '4444-4444-4444-4444', 'dianapass'), 
('CUST005', 'Ethan Hunt', 'Impossible St, IMF HQ', '2025-03-30', 'ethan@imf.com', '555-666-7777', 'Passport', '4555-5555-5555-5555', 'ethanpass'), 
('CUST006', 'Fiona Shrek', 'Swamp 123, Far Far Away', '2025-03-30', 'fiona@swamp.gov', '666-777-8888', 'SIN', '4666-6666-6666-6666', 'fionapass'), 
('CUST007', 'George Jungle', 'Jungle Vine 45, Rainforest', '2025-03-30', 'george@jungle.org', '777-888-9999', 'DriverLicense', '4777-7777-7777-7777', 'georgepass'), 
('CUST008', 'Hannah Montana', 'Disney Lane 200, Hollywood', '2025-03-30', 'hannah@popstar.com', '888-999-0000', 'SIN', '4888-8888-8888-8888', 'hannahpass'), 
('CUST009', 'Ian Fleming', 'Bond Street 007, London', '2025-03-30', 'ian@bond.com', '999-000-1111', 'SSN', '4999-9999-9999-9999', 'ianpass'), 
('CUST010', 'Judy Garland', 'Yellow Brick Rd 99, Oz', '2025-03-30', 'judy@oz.com', '000-111-2222', 'Passport', '4000-0000-0000-0000', 'judypass'), 
('CUST013', 'Michael Corleone', '1 Godfather St, New York, NY', '2025-03-30', 'michael@corleone.com', '111-333-5555', 'SSN', '5111-1111-1111-1111', 'michaelpass'),
('CUST014', 'Vito Corleone', '2 Godfather St, New York, NY', '2025-03-30', 'vito@corleone.com', '222-333-5555', 'SSN', '5222-2222-2222-2222', 'vitopass'),
('CUST015', 'Tony Montana', '123 Scarface Ave, Miami, FL', '2025-03-30', 'tony@scarface.com', '333-444-6666', 'Passport', '5333-3333-3333-3333', 'tonypass'),
('CUST016', 'James Bond', '007 Bond St, London, UK', '2025-03-30', 'james@bond.com', '444-555-7777', 'DriverLicense', '5444-4444-4444-4444', 'bondpass'),
('CUST017', 'Ellen Ripley', 'Nostromo Rd, LV-426', '2025-03-30', 'ellen@ripley.com', '555-666-8888', 'SSN', '5555-5555-5555-5555', 'ripleypass'),
('CUST018', 'Neo Anderson', 'Matrix Blvd, Zion', '2025-03-30', 'neo@matrix.com', '666-777-9999', 'SSN', '5666-6666-6666-6666', 'neopass'),
('CUST019', 'Trinity', 'Matrix Blvd, Zion', '2025-03-30', 'trinity@matrix.com', '777-888-0000', 'DriverLicense', '5777-7777-7777-7777', 'trinitypass'),
('CUST020', 'Marty McFly', 'Hill Valley Rd, Hill Valley, CA', '2025-03-30', 'marty@mcfly.com', '888-999-1111', 'SSN', '5888-8888-8888-8888', 'martypass'),
('CUST021', 'Doc Brown', 'Emmett Dr, Hill Valley, CA', '2025-03-30', 'doc@brown.com', '999-000-2222', 'Passport', '5999-9999-9999-9999', 'docpass'),
('CUST022', 'Frodo Baggins', 'Bag End, Shire', '2025-03-30', 'frodo@shire.com', '101-202-3030', 'SSN', '6000-0000-0000-0000', 'frodo123'),
('CUST023', 'Samwise Gamgee', 'Bag End, Shire', '2025-03-30', 'sam@shire.com', '202-303-4040', 'SSN', '6111-1111-1111-1111', 'samwise'),
('CUST024', 'Aragorn', 'Ranger Rd, Gondor', '2025-03-30', 'aragorn@gondor.com', '303-404-5050', 'DriverLicense', '6222-2222-2222-2222', 'aragorn'),
('CUST025', 'Legolas', 'Mirkwood Ln, Mirkwood', '2025-03-30', 'legolas@mirkwood.com', '404-505-6060', 'SSN', '6333-3333-3333-3333', 'legopass'),
('CUST026', 'Gimli', 'Moria Mine, Middle Earth', '2025-03-30', 'gimli@moria.com', '505-606-7070', 'SSN', '6444-4444-4444-4444', 'gimlipass'),
('CUST027', 'Luke Skywalker', 'Tatooine, Outer Rim', '2025-03-30', 'luke@jedi.com', '606-707-8080', 'Passport', '6555-5555-5555-5555', 'lukepass'),
('CUST028', 'Leia Organa', 'Alderaan, Corellia', '2025-03-30', 'leia@rebels.com', '707-808-9090', 'SSN', '6666-6666-6666-6666', 'leiapass'),
('CUST029', 'Han Solo', 'Corellia, Mos Eisley', '2025-03-30', 'han@falcon.com', '808-909-0101', 'DriverLicense', '6777-7777-7777-7777', 'hanpass'),
('CUST030', 'Chewbacca', 'Kashyyyk, Endor', '2025-03-30', 'chewie@wookiee.com', '909-010-1112', 'SSN', '6888-8888-8888-8888', 'chewpass'),
('CUST012', 'Filip Ilijevski', 'Kashyyyk, Endor', '2025-03-30', 'filip@ilijevski.com', '919-111-1112', 'SSN', '6188-8118-8188-8181', 'filippass'),
('CUST011', 'Daniel Corleone', '111 Godfather St, New York, NY', '2025-03-30', 'daniel@corleone.com', '123-333-4455', 'SSN', '5111-1155-1151-5115', 'danielpass');


-------------------------------
-- 4) EMPLOYEE
-------------------------------

INSERT INTO Employee (employee_sin, full_name, address, hotel_id, email, password)
VALUES
('EMP001', 'Bruce Wayne', '1007 Mountain Drive, Metropolis', 1, 'bruce.wayne@luxstay.com', 'pass123'), 
('EMP002', 'Diana Prince', 'Themyscira Island, Metropolis', 1, 'diana.prince@luxstay.com', 'pass123'), 
('EMP003', 'Tony Stark', '10880 Malibu Point, Metropolis', 1, 'tony.stark@luxstay.com', 'pass123'), 
('EMP004', 'Clark Kent', '344 Clinton St, Metropolis', 1, 'clark.kent@luxstay.com', 'pass123'), 
('EMP005', 'Natasha Romanoff', 'Stalingrad Rd, Metropolis', 1, 'natasha.romanoff@luxstay.com', 'pass123'), 
('EMP006', 'Peter Parker', '20 Ingram Street, Metropolis', 11, 'peter.parker@luxstay.com', 'pass123'), 
('EMP007', 'Steve Rogers', '569 Leaman Ave, Metropolis', 11, 'steve.rogers@luxstay.com', 'pass123'), 
('EMP008', 'Wanda Maximoff', 'Avenger Tower, Metropolis', 11, 'wanda.maximoff@luxstay.com', 'pass123'), 
('EMP009', 'Barry Allen', 'Central City, Metropolis', 11, 'barry.allen@luxstay.com', 'pass123'), 
('EMP010', 'Hal Jordan', 'Coast City, Metropolis', 11, 'hal.jordan@luxstay.com', 'pass123'), 
('EMP011', 'Luke Skywalker', 'Tatooine, Outer Rim', 11, 'luke.skywalker@cityhotels.com', 'jedi123'),
('EMP012', 'Leia Organa', 'Alderaan, Corellia', 16, 'leia.organa@cityhotels.com', 'rebels123'),
('EMP013', 'Han Solo', 'Mos Eisley, Tatooine', 16, 'han.solo@cityhotels.com', 'falcon123'),
('EMP014', 'Chewbacca', 'Kashyyyk, Endor', 16, 'chewbacca@cityhotels.com', 'wookiee123'),
('EMP015', 'Obi-Wan Kenobi', 'Stewjon, Outer Rim', 16, 'obiwan@cityhotels.com', 'force123'),
('EMP016', 'Jack Sparrow', 'Tortuga, Caribbean', 21, 'jack.sparrow@seasidechain.com', 'rum123'),
('EMP017', 'Will Turner', 'Port Royal, Caribbean', 21, 'will.turner@seasidechain.com', 'cutlass123'),
('EMP018', 'Elizabeth Swann', 'Port Royal, Caribbean', 21, 'elizabeth.swann@seasidechain.com', 'pirate123'),
('EMP019', 'Davy Jones', 'Flying Dutchman, Ocean', 21, 'davy.jones@seasidechain.com', 'tentacle123'),
('EMP020', 'Gibbs', 'Shipyard, Caribbean', 21, 'gibbs@seasidechain.com', 'anchor123'),
('EMP021', 'Aragorn', 'Gondor, Middle Earth', 27, 'aragorn@mountainresort.com', 'king123'),
('EMP022', 'Legolas', 'Mirkwood, Middle Earth', 27, 'legolas@mountainresort.com', 'elf123'),
('EMP023', 'Gimli', 'Moria, Middle Earth', 27, 'gimli@mountainresort.com', 'dwarf123'),
('EMP024', 'Boromir', 'Rohan, Middle Earth', 27, 'boromir@mountainresort.com', 'horn123'),
('EMP025', 'Frodo Baggins', 'Shire, Middle Earth', 27, 'frodo@mountainresort.com', 'ring123'),
('EMP026', 'Indiana Jones', 'Marshall, USA', 31, 'indy@testchainomega.com', 'whip123'),
('EMP027', 'Ellen Ripley', 'LV-426, Space', 31, 'ellen.ripley@testchainomega.com', 'alien123'),
('EMP028', 'James T. Kirk', 'Enterprise, Space', 31, 'kirk@testchainomega.com', 'star123'),
('EMP029', 'Spock', 'Vulcan, Space', 31, 'spock@testchainomega.com', 'logic123'),
('EMP030', 'Leonard McCoy', 'Enterprise, Space', 31, 'mccoy@testchainomega.com', 'scotty123');

-------------------------------
-- 5) ROLE + EMPLOYEE_ROLE
-------------------------------

INSERT INTO Role (role_name)
VALUES
  ('Manager'),
  ('Receptionist'),
  ('FrontDesk'),
  ('Housekeeping'),
  ('Concierge')
RETURNING role_id;

INSERT INTO Employee_Role (employee_sin, role_id)
VALUES
  ('EMP001',5),
  ('EMP002',4),
  ('EMP003',3),
  ('EMP004',2),
  ('EMP005',1),
  ('EMP006',5),
  ('EMP007',5),
  ('EMP008',4),
  ('EMP009',3),
  ('EMP010',2),
  ('EMP011',1),
  ('EMP012',4),
  ('EMP013',3),
  ('EMP014',2),
  ('EMP015',1),
  ('EMP016',5),
  ('EMP017',4),
  ('EMP018',3),
  ('EMP019',2),
  ('EMP020',1),
  ('EMP021',5),
  ('EMP022',4),
  ('EMP023',3),
  ('EMP024',2),
  ('EMP025',1),
  ('EMP026',5),
  ('EMP027',4),
  ('EMP028',2),
  ('EMP029',3),
  ('EMP030',1);

-------------------------------
-- 6) Assign manager_ids
-------------------------------
UPDATE Hotel SET manager_id = 'EMP005' WHERE hotel_id = 1;
UPDATE Hotel SET manager_id = 'EMP011' WHERE hotel_id = 11;
UPDATE Hotel SET manager_id = 'EMP015' WHERE hotel_id = 16;
UPDATE Hotel SET manager_id = 'EMP020' WHERE hotel_id = 21;
UPDATE Hotel SET manager_id = 'EMP025' WHERE hotel_id = 27;
UPDATE Hotel SET manager_id = 'EMP030' WHERE hotel_id = 31;

-------------------------------
-- 7) ROOM (Close to 75 Rooms)
-------------------------------

INSERT INTO Room (hotel_id, price, room_capacity, bed_count, is_extendable)
VALUES
(1, 250.00, 'Double', 2, false), 
(1, 300.00, 'King', 1, true), 
(1, 280.00, 'Double', 2, false), 
(1, 260.00, 'Queen', 2, true), 
(1, 310.00, 'King', 1, true), 
(1, 240.00, 'Double', 2, false), 
(1, 290.00, 'Queen', 2, false), 
(1, 320.00, 'King', 1, true), 
(1, 270.00, 'Double', 2, false), 
(1, 300.00, 'Queen', 2, true), 
(1, 220.00, 'Double', 2, false),
(1, 400, 'King', 2, TRUE),
(1, 380, 'Queen', 2, TRUE),
(1, 350, 'Double', 2, FALSE),
(1, 370, 'King', 2, TRUE),
(11, 250.00, 'King', 1, true),
(11, 230.00, 'Double', 2, false),
(11, 240.00, 'Queen', 2, true),
(11, 260.00, 'King', 1, true),
(11, 180.00, 'Double', 2, false),
(11, 200.00, 'Queen', 2, true),
(11, 190.00, 'Double', 2, false),
(11, 210.00, 'King', 1, true),
(11, 195.00, 'Queen', 2, false),
(11, 230.00, 'Double', 2, false), 
(11, 260.00, 'King', 1, true),
(11, 250.00, 'Double', 2, false),
(11, 300, 'King',  1, TRUE),
(11, 280, 'Double',2, FALSE),
(11, 250, 'Queen', 2, FALSE),
(11, 270, 'King', 2, FALSE),
(11, 200, 'Double',2, FALSE),
(11, 350, 'King', 1, TRUE),
(11, 400, 'King', 2, TRUE),
(16, 180, 'Queen', 2, FALSE),
(16, 250, 'King',  1, TRUE),
(16, 250.00, 'King', 1, true),
(16, 230.00, 'Double', 2, false),
(16, 240.00, 'Queen', 2, true),
(16, 260.00, 'King', 1, true),
(16, 180.00, 'Double', 2, false),
(16, 200.00, 'Queen', 2, true),
(16, 190.00, 'Double', 2, false),
(21, 120.00, 'Queen', 2, true),
(21, 110.00, 'Double', 2, false),
(21, 130.00, 'King', 1, true),
(21, 115.00, 'Queen', 2, false),   
(21, 150, 'King', 2, TRUE),
(21, 80, 'Double', 2, FALSE),
(21, 60, 'Single', 1, TRUE),
(21, 90, 'Double', 2, FALSE),
(21, 85,'Double', 2, TRUE),
(21, 70,'Single', 1, FALSE),
(21, 120, 'Double', 2, FALSE),
(21, 200, 'King', 2, TRUE),
(21, 100, 'Queen',2, FALSE),
(27, 240.00, 'Queen', 2, true),
(27, 270.00, 'King', 1, true),
(27, 150.00, 'Double', 2, false),
(27, 170.00, 'Queen', 2, true),
(27, 160.00, 'Double', 2, false),
(27, 180.00, 'King', 1, true),
(27, 165.00, 'Queen', 2, false),
(27, 100.00, 'Double', 2, false),
(27, 120.00, 'Queen', 2, true),
(27, 110.00, 'Double', 2, false),
(27, 130.00, 'King', 1, true),
(27, 115.00, 'Queen', 2, false),   
(27, 150, 'King', 2, TRUE),
(31, 80, 'Double', 2, FALSE),
(31, 60, 'Single', 1, TRUE),
(31, 90, 'Double', 2, FALSE),
(31, 85,'Double', 2, TRUE),
(31, 70,'Single', 1, FALSE),
(31, 120, 'Double', 2, FALSE),
(21, 200, 'King', 2, TRUE),
(31, 100, 'Queen',2, FALSE)
RETURNING room_id;

-------------------------------
-- 8) ROOMAMENITY 
-------------------------------
INSERT INTO RoomAmenity (room_id, amenity)
VALUES
  (1,'TV'), (1,'Air Conditioning'),
  (2,'TV'), (2,'Jacuzzi'),
  (3,'Mini Bar'), (3,'TV'),
  (4,'TV'),
  (5,'Mini Fridge'),
  (6,'TV'), (6,'Hair Dryer'),
  (7,'Mini Bar'), (7,'Air Conditioning'),
  (8,'TV'),
  (9,'WIFI'),
  (10,'Balcony'), (10,'TV'),
  (11,'TV'), (11,'Hair Dryer'),
  (12,'Balcony'), (12,'Mini Bar'),
  (13,'TV'), (13,'WIFI'),
  (14,'Jacuzzi'),
  (15,'WIFI'), (15,'Mini Fridge'),
  (16,'TV'),
  (17,'Jacuzzi'),
  (18,'WIFI'),
  (19,'Fireplace'),
  (20,'Balcony'),
  (21,'TV'),
  (22,'Balcony'),
  (23,'Jacuzzi'),
  (24,'WIFI'), (24,'Mini Fridge'),
  (25,'TV'),
  (26,'Jacuzzi'),
  (27,'WIFI'),
  (28,'Fireplace'),
  (29,'Balcony'),
  (30,'TV'),
  (31,'Balcony');

-------------------------------
-- 9) ROOMDAMAGE
-------------------------------
INSERT INTO RoomDamage (room_id, damage)
VALUES
  (2,'Broken lamp'),
  (7,'Stained carpet'),
  (10,'Cracked window'),
  (15,'Leaky faucet'),
  (19,'Wall scratch'),
  (21,'Broken lock'),
  (22,'Damaged curtain'),
  (3,'Broken lamp'),
  (8,'Stained carpet'),
  (11,'Cracked window'),
  (16,'Leaky faucet'),
  (20,'Wall scratch'),
  (23,'Broken lock'),
  (24,'Damaged curtain'),
  (4,'Broken lamp'),
  (9,'Stained carpet'),
  (12,'Cracked window'),
  (13,'Leaky faucet'),
  (25,'Wall scratch'),
  (17,'Broken lock'),
  (14,'Damaged curtain');

-------------------------------
-- 10) HOTELAMENITY
-------------------------------

INSERT INTO HotelAmenity (hotel_id, amenity) 
VALUES 
(1, 'Free WiFi'), (1, 'Complimentary Breakfast'), (1, 'Gym Access'), (1, 'Swimming Pool'), (1, 'Spa Services'), 
(11, 'In-Room Dining'), (11, 'Executive Lounge'), (11, 'Airport Shuttle'), (11, 'Free Parking'), (11, 'Pet Friendly'), 
(16, 'Conference Room'), (16, 'Business Center'), (16, '24-Hour Room Service'), (16, 'Laundry Service'), (16, 'Mini Bar'), 
(21, 'Evening Entertainment'), (21, 'Valet Parking'), (21, 'Airport Transfer'), (21, 'On-Site Restaurant'), (21, 'Bar Lounge'), 
(27, 'High-Speed Internet'), (27, 'Room Service'), (27, 'Fitness Center'), (27, 'Business Suite'), (27, 'Spa Access'), 
(31, 'Yoga Classes'), (31, 'Concierge Service'), (31, 'Valet Parking'), (31, 'Meeting Rooms'), (31, 'Executive Breakfast'), (31, 'Late Checkout');

-------------------------------
-- 11) HOTELCHAINAMENITY
-------------------------------

INSERT INTO HotelChainAmenity (chain_id, amenity)
VALUES
(1, 'Loyalty Program'), (1, 'VIP Lounge'), (1, 'Spa Access'), 
(2, 'Budget Car Rental Discounts'), (2, 'Free Breakfast'), (2, 'Discounted Tours'), 
(3, 'City Tour Partnerships'), (3, 'Business Center'), (3, 'Rooftop Bar'), 
(4, 'Free Beach Towels'), (4, 'Surf Lessons'), (4, 'Water Sports Rental'), 
(5, 'Mountain Guided Tours'), (5, 'Ski Rental Discounts'), (5, 'Hot Spring Access'), 
(6, 'Test Amenity A'), (6, 'Test Amenity B'), (6, 'Test Amenity C');

-------------------------------
-- 12) BOOKING
-------------------------------

INSERT INTO Booking (customer_sin, room_id, start_date, end_date, archived)
VALUES 
('CUST001', 1, '2025-12-01', '2025-12-05', false), 
('CUST002', 2, '2025-12-02', '2025-12-06', false), 
('CUST003', 3, '2025-12-03', '2025-12-07', false), 
('CUST004', 4, '2025-12-04', '2025-12-08', false), 
('CUST005', 5, '2025-12-05', '2025-12-09', false), 
('CUST006', 6, '2025-12-06', '2025-12-10', false), 
('CUST007', 7, '2025-12-07', '2025-12-11', false), 
('CUST008', 8, '2025-12-08', '2025-12-12', false), 
('CUST009', 9, '2025-12-09', '2025-12-13', false), 
('CUST010', 10, '2025-12-10', '2025-12-14', false), 
('CUST011', 11, '2025-12-11', '2025-12-15', false), 
('CUST012', 12, '2025-12-12', '2025-12-16', false), 
('CUST013', 13, '2025-12-13', '2025-12-17', false), 
('CUST014', 14, '2025-12-14', '2025-12-18', false), 
('CUST015', 15, '2025-12-15', '2025-12-19', false), 
('CUST016', 16, '2025-12-16', '2025-12-20', false), 
('CUST017', 17, '2025-12-17', '2025-12-21', false), 
('CUST018', 18, '2025-12-18', '2025-12-22', false), 
('CUST019', 19, '2025-12-19', '2025-12-23', false), 
('CUST020', 20, '2025-12-20', '2025-12-24', false);

-- Archive an example
UPDATE Booking
   SET archived = TRUE
 WHERE booking_id = 3;

-------------------------------
-- 13) RENTING
-------------------------------

INSERT INTO Renting (customer_sin, room_id, employee_sin, start_date, end_date, archived)
VALUES
('CUST001', 4, 'EMP004', '2025-12-01', '2025-12-03', false), 
('CUST002', 5, 'EMP004', '2025-12-02', '2025-12-04', false), 
('CUST003', 6, 'EMP003', '2025-12-03', '2025-12-05', false), 
('CUST004', 7, 'EMP004', '2025-12-04', '2025-12-06', false),  
('CUST021', 21, 'EMP007', '2025-12-20', '2025-12-22', false), 
('CUST022', 22, 'EMP007', '2025-12-20', '2025-12-22', false),
('CUST023', 23, 'EMP007', '2025-12-20', '2025-12-22', false),
('CUST024', 24, 'EMP007', '2025-12-20', '2025-12-22', false), 
('CUST005', 36, 'EMP012', '2025-12-05', '2025-12-07', false), 
('CUST006', 37, 'EMP012', '2025-12-06', '2025-12-08', false), 
('CUST007', 38, 'EMP012', '2025-12-07', '2025-12-09', false), 
('CUST008', 39, 'EMP012', '2025-12-08', '2025-12-10', false), 
('CUST009', 46, 'EMP018', '2025-12-09', '2025-12-11', false), 
('CUST010', 47, 'EMP018', '2025-12-10', '2025-12-12', false), 
('CUST011', 48, 'EMP018', '2025-12-11', '2025-12-13', false), 
('CUST012', 49, 'EMP018', '2025-12-12', '2025-12-14', false), 
('CUST013', 62, 'EMP023', '2025-12-13', '2025-12-15', false), 
('CUST014', 63, 'EMP023', '2025-12-14', '2025-12-16', false), 
('CUST015', 64, 'EMP023', '2025-12-15', '2025-12-17', false), 
('CUST016', 65, 'EMP023', '2025-12-16', '2025-12-18', false), 
('CUST017', 70, 'EMP027', '2025-12-17', '2025-12-19', false), 
('CUST018', 71, 'EMP027', '2025-12-18', '2025-12-20', false), 
('CUST019', 72, 'EMP027', '2025-12-19', '2025-12-21', false), 
('CUST020', 73, 'EMP027', '2025-12-20', '2025-12-22', false);


COMMIT;

-- Insert new manager employees for hotels needing a manager.
-- Note: This INSERT assumes that no manager with these SIN values exists already.
INSERT INTO Employee (employee_sin, full_name, address, hotel_id, email, password)
VALUES
  ('EMP032', 'Manager for Hotel 2', 'Manager Address for Hotel 2', 2, 'manager2@example.com', 'manager123'),
  ('EMP033', 'Manager for Hotel 3', 'Manager Address for Hotel 3', 3, 'manager3@example.com', 'manager123'),
  ('EMP034', 'Manager for Hotel 4', 'Manager Address for Hotel 4', 4, 'manager4@example.com', 'manager123'),
  ('EMP035', 'Manager for Hotel 5', 'Manager Address for Hotel 5', 5, 'manager5@example.com', 'manager123'),
  ('EMP036', 'Manager for Hotel 6', 'Manager Address for Hotel 6', 6, 'manager6@example.com', 'manager123'),
  ('EMP037', 'Manager for Hotel 7', 'Manager Address for Hotel 7', 7, 'manager7@example.com', 'manager123'),
  ('EMP038', 'Manager for Hotel 8', 'Manager Address for Hotel 8', 8, 'manager8@example.com', 'manager123'),
  ('EMP039', 'Manager for Hotel 9', 'Manager Address for Hotel 9', 9, 'manager9@example.com', 'manager123'),
  ('EMP040', 'Manager for Hotel 10', 'Manager Address for Hotel 10', 10, 'manager10@example.com', 'manager123'),
  ('EMP041', 'Manager for Hotel 12', 'Manager Address for Hotel 12', 12, 'manager12@example.com', 'manager123'),
  ('EMP042', 'Manager for Hotel 13', 'Manager Address for Hotel 13', 13, 'manager13@example.com', 'manager123'),
  ('EMP043', 'Manager for Hotel 14', 'Manager Address for Hotel 14', 14, 'manager14@example.com', 'manager123'),
  ('EMP044', 'Manager for Hotel 15', 'Manager Address for Hotel 15', 15, 'manager15@example.com', 'manager123'),
  ('EMP045', 'Manager for Hotel 17', 'Manager Address for Hotel 17', 17, 'manager17@example.com', 'manager123'),
  ('EMP046', 'Manager for Hotel 18', 'Manager Address for Hotel 18', 18, 'manager18@example.com', 'manager123'),
  ('EMP047', 'Manager for Hotel 19', 'Manager Address for Hotel 19', 19, 'manager19@example.com', 'manager123'),
  ('EMP048', 'Manager for Hotel 20', 'Manager Address for Hotel 20', 20, 'manager20@example.com', 'manager123'),
  ('EMP049', 'Manager for Hotel 22', 'Manager Address for Hotel 22', 22, 'manager22@example.com', 'manager123'),
  ('EMP050', 'Manager for Hotel 23', 'Manager Address for Hotel 23', 23, 'manager23@example.com', 'manager123'),
  ('EMP051', 'Manager for Hotel 24', 'Manager Address for Hotel 24', 24, 'manager24@example.com', 'manager123'),
  ('EMP052', 'Manager for Hotel 25', 'Manager Address for Hotel 25', 25, 'manager25@example.com', 'manager123'),
  ('EMP053', 'Manager for Hotel 26', 'Manager Address for Hotel 26', 26, 'manager26@example.com', 'manager123'),
  ('EMP054', 'Manager for Hotel 28', 'Manager Address for Hotel 28', 28, 'manager28@example.com', 'manager123'),
  ('EMP055', 'Manager for Hotel 29', 'Manager Address for Hotel 29', 29, 'manager29@example.com', 'manager123'),
  ('EMP056', 'Manager for Hotel 30', 'Manager Address for Hotel 30', 30, 'manager30@example.com', 'manager123'),
  ('EMP057', 'Manager for Hotel 32', 'Manager Address for Hotel 32', 32, 'manager32@example.com', 'manager123'),
  ('EMP058', 'Manager for Hotel 33', 'Manager Address for Hotel 33', 33, 'manager33@example.com', 'manager123'),
  ('EMP059', 'Manager for Hotel 34', 'Manager Address for Hotel 34', 34, 'manager34@example.com', 'manager123'),
  ('EMP060', 'Manager for Hotel 35', 'Manager Address for Hotel 35', 35, 'manager35@example.com', 'manager123'),
  ('EMP061', 'Manager for Hotel 36', 'Manager Address for Hotel 36', 36, 'manager36@example.com', 'manager123'),
  ('EMP062', 'Manager for Hotel 37', 'Manager Address for Hotel 37', 37, 'manager37@example.com', 'manager123'),
  ('EMP063', 'Manager for Hotel 38', 'Manager Address for Hotel 38', 38, 'manager38@example.com', 'manager123'),
  ('EMP064', 'Manager for Hotel 39', 'Manager Address for Hotel 39', 39, 'manager39@example.com', 'manager123'),
  ('EMP065', 'Manager for Hotel 40', 'Manager Address for Hotel 40', 40, 'manager40@example.com', 'manager123'),
  ('EMP066', 'Manager for Hotel 41', 'Manager Address for Hotel 41', 41, 'manager41@example.com', 'manager123'),
  ('EMP067', 'Manager for Hotel 42', 'Manager Address for Hotel 42', 42, 'manager42@example.com', 'manager123'),
  ('EMP068', 'Manager for Hotel 43', 'Manager Address for Hotel 43', 43, 'manager43@example.com', 'manager123'),
  ('EMP069', 'Manager for Hotel 44', 'Manager Address for Hotel 44', 44, 'manager44@example.com', 'manager123'),
  ('EMP070', 'Manager for Hotel 45', 'Manager Address for Hotel 45', 45, 'manager45@example.com', 'manager123'),
  ('EMP071', 'Manager for Hotel 46', 'Manager Address for Hotel 46', 46, 'manager46@example.com', 'manager123'),
  ('EMP072', 'Manager for Hotel 47', 'Manager Address for Hotel 47', 47, 'manager47@example.com', 'manager123'),
  ('EMP073', 'Manager for Hotel 48', 'Manager Address for Hotel 48', 48, 'manager48@example.com', 'manager123'),
  ('EMP074', 'Manager for Hotel 49', 'Manager Address for Hotel 49', 49, 'manager49@example.com', 'manager123'),
  ('EMP075', 'Manager for Hotel 50', 'Manager Address for Hotel 50', 50, 'manager50@example.com', 'manager123'),
  ('EMP076', 'Manager for Hotel 51', 'Manager Address for Hotel 51', 51, 'manager51@example.com', 'manager123'),
  ('EMP077', 'Manager for Hotel 52', 'Manager Address for Hotel 52', 52, 'manager52@example.com', 'manager123'),
  ('EMP078', 'Manager for Hotel 53', 'Manager Address for Hotel 53', 53, 'manager53@example.com', 'manager123'),
  ('EMP079', 'Manager for Hotel 54', 'Manager Address for Hotel 54', 54, 'manager54@example.com', 'manager123'),
  ('EMP080', 'Manager for Hotel 55', 'Manager Address for Hotel 55', 55, 'manager55@example.com', 'manager123'),
  ('EMP081', 'Manager for Hotel 56', 'Manager Address for Hotel 56', 56, 'manager56@example.com', 'manager123'),
  ('EMP082', 'Manager for Hotel 57', 'Manager Address for Hotel 57', 57, 'manager57@example.com', 'manager123'),
  ('EMP083', 'Manager for Hotel 58', 'Manager Address for Hotel 58', 58, 'manager58@example.com', 'manager123'),
  ('EMP084', 'Manager for Hotel 59', 'Manager Address for Hotel 59', 59, 'manager59@example.com', 'manager123'),
  ('EMP085', 'Manager for Hotel 60', 'Manager Address for Hotel 60', 60, 'manager60@example.com', 'manager123');

INSERT INTO Employee_Role (employee_sin, role_id)
VALUES
  ('EMP032', 1),
  ('EMP033', 1),
  ('EMP034', 1),
  ('EMP035', 1),
  ('EMP036', 1),
  ('EMP037', 1),
  ('EMP038', 1),
  ('EMP039', 1),
  ('EMP040', 1),
  ('EMP041', 1),
  ('EMP042', 1),
  ('EMP043', 1),
  ('EMP044', 1),
  ('EMP045', 1),
  ('EMP046', 1),
  ('EMP047', 1),
  ('EMP048', 1),
  ('EMP049', 1),
  ('EMP050', 1),
  ('EMP051', 1),
  ('EMP052', 1),
  ('EMP053', 1),
  ('EMP054', 1),
  ('EMP055', 1),
  ('EMP056', 1),
  ('EMP057', 1),
  ('EMP058', 1),
  ('EMP059', 1),
  ('EMP060', 1),
  ('EMP061', 1),
  ('EMP062', 1),
  ('EMP063', 1),
  ('EMP064', 1),
  ('EMP065', 1),
  ('EMP066', 1),
  ('EMP067', 1),
  ('EMP068', 1),
  ('EMP069', 1),
  ('EMP070', 1),
  ('EMP071', 1),
  ('EMP072', 1),
  ('EMP073', 1),
  ('EMP074', 1),
  ('EMP075', 1),
  ('EMP076', 1),
  ('EMP077', 1),
  ('EMP078', 1),
  ('EMP079', 1),
  ('EMP080', 1),
  ('EMP081', 1),
  ('EMP082', 1),
  ('EMP083', 1),
  ('EMP084', 1),
  ('EMP085', 1);

UPDATE Hotel SET manager_id = 'EMP032' WHERE hotel_id = 2;
UPDATE Hotel SET manager_id = 'EMP033' WHERE hotel_id = 3;
UPDATE Hotel SET manager_id = 'EMP034' WHERE hotel_id = 4;
UPDATE Hotel SET manager_id = 'EMP035' WHERE hotel_id = 5;
UPDATE Hotel SET manager_id = 'EMP036' WHERE hotel_id = 6;
UPDATE Hotel SET manager_id = 'EMP037' WHERE hotel_id = 7;
UPDATE Hotel SET manager_id = 'EMP038' WHERE hotel_id = 8;
UPDATE Hotel SET manager_id = 'EMP039' WHERE hotel_id = 9;
UPDATE Hotel SET manager_id = 'EMP040' WHERE hotel_id = 10;
UPDATE Hotel SET manager_id = 'EMP041' WHERE hotel_id = 12;
UPDATE Hotel SET manager_id = 'EMP042' WHERE hotel_id = 13;
UPDATE Hotel SET manager_id = 'EMP043' WHERE hotel_id = 14;
UPDATE Hotel SET manager_id = 'EMP044' WHERE hotel_id = 15;
UPDATE Hotel SET manager_id = 'EMP045' WHERE hotel_id = 17;
UPDATE Hotel SET manager_id = 'EMP046' WHERE hotel_id = 18;
UPDATE Hotel SET manager_id = 'EMP047' WHERE hotel_id = 19;
UPDATE Hotel SET manager_id = 'EMP048' WHERE hotel_id = 20;
UPDATE Hotel SET manager_id = 'EMP049' WHERE hotel_id = 22;
UPDATE Hotel SET manager_id = 'EMP050' WHERE hotel_id = 23;
UPDATE Hotel SET manager_id = 'EMP051' WHERE hotel_id = 24;
UPDATE Hotel SET manager_id = 'EMP052' WHERE hotel_id = 25;
UPDATE Hotel SET manager_id = 'EMP053' WHERE hotel_id = 26;
UPDATE Hotel SET manager_id = 'EMP054' WHERE hotel_id = 28;
UPDATE Hotel SET manager_id = 'EMP055' WHERE hotel_id = 29;
UPDATE Hotel SET manager_id = 'EMP056' WHERE hotel_id = 30;
UPDATE Hotel SET manager_id = 'EMP057' WHERE hotel_id = 32;
UPDATE Hotel SET manager_id = 'EMP058' WHERE hotel_id = 33;
UPDATE Hotel SET manager_id = 'EMP059' WHERE hotel_id = 34;
UPDATE Hotel SET manager_id = 'EMP060' WHERE hotel_id = 35;
UPDATE Hotel SET manager_id = 'EMP061' WHERE hotel_id = 36;
UPDATE Hotel SET manager_id = 'EMP062' WHERE hotel_id = 37;
UPDATE Hotel SET manager_id = 'EMP063' WHERE hotel_id = 38;
UPDATE Hotel SET manager_id = 'EMP064' WHERE hotel_id = 39;
UPDATE Hotel SET manager_id = 'EMP065' WHERE hotel_id = 40;
UPDATE Hotel SET manager_id = 'EMP066' WHERE hotel_id = 41;
UPDATE Hotel SET manager_id = 'EMP067' WHERE hotel_id = 42;
UPDATE Hotel SET manager_id = 'EMP068' WHERE hotel_id = 43;
UPDATE Hotel SET manager_id = 'EMP069' WHERE hotel_id = 44;
UPDATE Hotel SET manager_id = 'EMP070' WHERE hotel_id = 45;
UPDATE Hotel SET manager_id = 'EMP071' WHERE hotel_id = 46;
UPDATE Hotel SET manager_id = 'EMP072' WHERE hotel_id = 47;
UPDATE Hotel SET manager_id = 'EMP073' WHERE hotel_id = 48;
UPDATE Hotel SET manager_id = 'EMP074' WHERE hotel_id = 49;
UPDATE Hotel SET manager_id = 'EMP075' WHERE hotel_id = 50;
UPDATE Hotel SET manager_id = 'EMP076' WHERE hotel_id = 51;
UPDATE Hotel SET manager_id = 'EMP077' WHERE hotel_id = 52;
UPDATE Hotel SET manager_id = 'EMP078' WHERE hotel_id = 53;
UPDATE Hotel SET manager_id = 'EMP079' WHERE hotel_id = 54;
UPDATE Hotel SET manager_id = 'EMP080' WHERE hotel_id = 55;
UPDATE Hotel SET manager_id = 'EMP081' WHERE hotel_id = 56;
UPDATE Hotel SET manager_id = 'EMP082' WHERE hotel_id = 57;
UPDATE Hotel SET manager_id = 'EMP083' WHERE hotel_id = 58;
UPDATE Hotel SET manager_id = 'EMP084' WHERE hotel_id = 59;
UPDATE Hotel SET manager_id = 'EMP085' WHERE hotel_id = 60;

-- Add Manager and Hotel Enforcement Rule After This

