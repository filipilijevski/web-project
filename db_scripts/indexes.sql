/*
  indexes.sql

  This file creates indexes for the Hotel Booking DB.
  Run this after the schema is created.
*/

-- Index on Booking for (room_id, start_date, end_date)
CREATE INDEX idx_booking_room_dates
  ON Booking (room_id, start_date, end_date);

-- Index on Employee for (hotel_id)
CREATE INDEX idx_employee_hotel
  ON Employee (hotel_id);

-- Index on Customer for (email)
CREATE INDEX idx_customer_email
  ON Customer (email);

-- Index on Room for (price)
CREATE INDEX idx_room_price
  ON Room (price);

/*
  Justification:
    idx_booking_room_dates -> improves queries filtering by room_id & date range.
    idx_employee_hotel     -> speeds up lookups/joins by employee’s hotel_id.
    idx_customer_email     -> quickly finds a customer by email (common in user logins).
    idx_room_price         -> accelerates queries or range searches on room price.
*/

