/* 
   hotel_schema.sql

   This script creates the bulk of the hotelbookingapp schema in PostgreSQL.

*/


CREATE EXTENSION IF NOT EXISTS btree_gist;

/* -------------------------------------------------------------------
   2) HOTELCHAIN
------------------------------------------------------------------- */
CREATE TABLE HotelChain (
    chain_id             SERIAL PRIMARY KEY,
    chain_name           VARCHAR(100) NOT NULL UNIQUE,
    address              TEXT NOT NULL,
    headquarters_address TEXT,        --  HQ address
    contact_phone        VARCHAR(20),
    contact_email        VARCHAR(100)
);

/* -------------------------------------------------------------------
   3) HOTEL
------------------------------------------------------------------- */
CREATE TABLE Hotel (
    hotel_id  SERIAL PRIMARY KEY,
    chain_id  INT NOT NULL,
    hotel_name VARCHAR(100) NOT NULL,
    category   INT NOT NULL CHECK (category BETWEEN 1 AND 5),
    address    TEXT NOT NULL -- Add manager_id later
);

/* Establish FK from Hotel to HotelChain */
ALTER TABLE Hotel
  ADD CONSTRAINT fk_hotel_chain
  FOREIGN KEY (chain_id)
  REFERENCES HotelChain(chain_id)
  ON DELETE CASCADE;

/* -------------------------------------------------------------------
   4) CUSTOMER
------------------------------------------------------------------- */
CREATE TABLE Customer (
    customer_sin     VARCHAR(15) PRIMARY KEY, 
    full_name        VARCHAR(100) NOT NULL,
    address          TEXT NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE
        CHECK (registration_date <= CURRENT_DATE),

    /* Newly added columns: */
    email     VARCHAR(100),
    phone     VARCHAR(20),
    id_type   VARCHAR(20) 

    /* Optional format checks:
       CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' OR email IS NULL),
       CHECK (phone ~ '^[0-9+ \-()]+$' OR phone IS NULL),
       CHECK (id_type IN ('SIN','SSN','DriverLicense','Passport'))
    */
);

/* -------------------------------------------------------------------
   5) EMPLOYEE
------------------------------------------------------------------- */
CREATE TABLE Employee (
    employee_sin  VARCHAR(15) PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    address       TEXT NOT NULL,
    hotel_id      INT,  

    CONSTRAINT fk_emp_hotel
      FOREIGN KEY (hotel_id)
      REFERENCES Hotel(hotel_id)
      ON DELETE SET NULL
);

/* -------------------------------------------------------------------
   6) ROLE 
------------------------------------------------------------------- */
CREATE TABLE Role (
    role_id   SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

/* -------------------------------------------------------------------
   7) EMPLOYEE_ROLE 
------------------------------------------------------------------- */
CREATE TABLE Employee_Role (
    employee_sin VARCHAR(15) NOT NULL,
    role_id      INT NOT NULL,
    PRIMARY KEY (employee_sin, role_id),

    CONSTRAINT fk_emp_role_emp
      FOREIGN KEY (employee_sin)
      REFERENCES Employee(employee_sin)
      ON DELETE CASCADE,

    CONSTRAINT fk_emp_role_role
      FOREIGN KEY (role_id)
      REFERENCES Role(role_id)
      ON DELETE CASCADE
);

/* -------------------------------------------------------------------
   8) Add manager_id to Hotel
------------------------------------------------------------------- */
ALTER TABLE Hotel
  ADD COLUMN manager_id VARCHAR(15);

ALTER TABLE Hotel
  ADD CONSTRAINT fk_hotel_manager
  FOREIGN KEY (manager_id)
  REFERENCES Employee(employee_sin)
  ON DELETE SET NULL;  


/* -------------------------------------------------------------------
   9) ROOM
------------------------------------------------------------------- */
CREATE TABLE Room (
    room_id       SERIAL PRIMARY KEY,
    hotel_id      INT NOT NULL,
    price         DECIMAL(10,2) NOT NULL CHECK (price > 0),
    room_capacity VARCHAR(10)   NOT NULL 
       CHECK (room_capacity IN ('Single','Double','Queen','King')),
    bed_count     INT NOT NULL CHECK (bed_count > 0),
    is_extendable BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_room_hotel
      FOREIGN KEY (hotel_id)
      REFERENCES Hotel(hotel_id)
      ON DELETE CASCADE
);

/* -------------------------------------------------------------------
   10) ROOMAMENITY
------------------------------------------------------------------- */
CREATE TABLE RoomAmenity (
    room_id INT NOT NULL,
    amenity VARCHAR(50) NOT NULL,
    PRIMARY KEY (room_id, amenity),

    CONSTRAINT fk_roomamenity_room
      FOREIGN KEY (room_id)
      REFERENCES Room(room_id)
      ON DELETE CASCADE
);

/* -------------------------------------------------------------------
   11) ROOMDAMAGE
------------------------------------------------------------------- */
CREATE TABLE RoomDamage (
    room_id INT NOT NULL,
    damage  VARCHAR(255) NOT NULL,
    PRIMARY KEY (room_id, damage),

    CONSTRAINT fk_roomdamage_room
      FOREIGN KEY (room_id)
      REFERENCES Room(room_id)
      ON DELETE CASCADE
);

/* -------------------------------------------------------------------
   12) HOTELAMENITY 
------------------------------------------------------------------- */
CREATE TABLE HotelAmenity (
    hotel_id INT NOT NULL,
    amenity  VARCHAR(50) NOT NULL,
    PRIMARY KEY (hotel_id, amenity),

    FOREIGN KEY (hotel_id)
      REFERENCES Hotel(hotel_id)
      ON DELETE CASCADE
);

/* -------------------------------------------------------------------
   13) HOTELCHAINAMENITY 
------------------------------------------------------------------- */
CREATE TABLE HotelChainAmenity (
    chain_id INT NOT NULL,
    amenity  VARCHAR(50) NOT NULL,
    PRIMARY KEY (chain_id, amenity),

    FOREIGN KEY (chain_id)
      REFERENCES HotelChain(chain_id)
      ON DELETE CASCADE
);

/* -------------------------------------------------------------------
   14) BOOKING
------------------------------------------------------------------- */
CREATE TABLE Booking (
    booking_id        SERIAL PRIMARY KEY,
    customer_sin      VARCHAR(15) NOT NULL,
    room_id           INT NOT NULL,
    start_date        DATE NOT NULL,
    end_date          DATE NOT NULL,
    booking_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        CHECK (booking_timestamp <= start_date),
    archived          BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_booking_customer
      FOREIGN KEY (customer_sin)
      REFERENCES Customer(customer_sin)
      ON DELETE SET NULL,

    CONSTRAINT fk_booking_room
      FOREIGN KEY (room_id)
      REFERENCES Room(room_id)
      ON DELETE RESTRICT,

    CONSTRAINT check_booking_dates
      CHECK (start_date <= end_date)
);

/* Prevent overlapping Bookings: */

ALTER TABLE Booking
    ADD CONSTRAINT no_overlapping_bookings
    EXCLUDE USING gist (
      room_id WITH =,
      daterange(start_date, end_date, '[]') WITH &&
);


/* -------------------------------------------------------------------
   15) RENTING
------------------------------------------------------------------- */
CREATE TABLE Renting (
    renting_id   SERIAL PRIMARY KEY,
    customer_sin VARCHAR(15) NOT NULL,
    room_id      INT NOT NULL,
    employee_sin VARCHAR(15) NOT NULL,
    start_date   DATE NOT NULL,
    end_date     DATE,
    archived     BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_renting_customer
      FOREIGN KEY (customer_sin)
      REFERENCES Customer(customer_sin)
      ON DELETE SET NULL,

    CONSTRAINT fk_renting_room
      FOREIGN KEY (room_id)
      REFERENCES Room(room_id)
      ON DELETE RESTRICT,

    CONSTRAINT fk_renting_employee
      FOREIGN KEY (employee_sin)
      REFERENCES Employee(employee_sin)
      ON DELETE SET NULL,

    CONSTRAINT check_renting_dates
      CHECK (end_date IS NULL OR start_date <= end_date)
);

/* -------------------------------------------------------------------
   TRIGGERS
------------------------------------------------------------------- */

-- Ensure manager_id references an Employee whose hotel_id matches the Hotel

CREATE OR REPLACE FUNCTION check_manager_consistency()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.manager_id IS NOT NULL THEN
    IF (SELECT hotel_id FROM Employee 
        WHERE employee_sin = NEW.manager_id) != NEW.hotel_id THEN
      RAISE EXCEPTION 'Manager must work at the same hotel. manager_sin=%, hotel_id=%',
                      NEW.manager_id, NEW.hotel_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_manager_consistency
BEFORE INSERT OR UPDATE
ON Hotel
FOR EACH ROW
EXECUTE PROCEDURE check_manager_consistency();

--  Alternative to exclusion constraint to prevent overlapping bookings in case we did not use bgist

CREATE OR REPLACE FUNCTION prevent_overlapping_bookings()
RETURNS TRIGGER AS $$
DECLARE
  overlapping_count INT;
BEGIN
  SELECT COUNT(*) INTO overlapping_count
  FROM Booking
  WHERE room_id = NEW.room_id
    AND archived = FALSE
    AND NOT (NEW.end_date < start_date OR NEW.start_date > end_date)
    AND Booking.booking_id != NEW.booking_id;  -- in case of update, ignore

  IF overlapping_count > 0 THEN
    RAISE EXCEPTION 'Overlapping booking detected for room %', NEW.room_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_booking_overlap
BEFORE INSERT OR UPDATE
ON Booking
FOR EACH ROW
EXECUTE PROCEDURE prevent_overlapping_bookings();

-- Employee & Room must belong to the same Hotel in Renting

CREATE OR REPLACE FUNCTION check_renting_hotel_consistency()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT hotel_id FROM Employee WHERE employee_sin = NEW.employee_sin)
     != (SELECT hotel_id FROM Room WHERE room_id = NEW.room_id) THEN
    RAISE EXCEPTION 'Employee % does not belong to the hotel of room %', 
                    NEW.employee_sin, NEW.room_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_renting_consistency
BEFORE INSERT
ON Renting
FOR EACH ROW
EXECUTE PROCEDURE check_renting_hotel_consistency();


