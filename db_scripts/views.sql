/*
  views.sql

  This file defines multiple views for the Hotel Booking DB.
  Run this after the schema and sample data are both loaded.
*/

/* AvailableRoomsPerArea */
CREATE OR REPLACE VIEW AvailableRoomsPerArea AS
SELECT
    h.address AS area,
    COUNT(r.room_id) AS available_rooms
FROM Hotel h
JOIN Room r 
  ON h.hotel_id = r.hotel_id
LEFT JOIN Booking b
  ON b.room_id = r.room_id
  AND b.archived = FALSE
  AND CURRENT_DATE BETWEEN b.start_date AND b.end_date
WHERE b.booking_id IS NULL
GROUP BY h.address;


/* AggregatedRoomCapacity */
CREATE OR REPLACE VIEW AggregatedRoomCapacity AS
SELECT
    h.hotel_id,
    h.hotel_name,
    SUM(r.bed_count) AS total_beds
FROM Hotel h
JOIN Room r ON h.hotel_id = r.hotel_id
GROUP BY h.hotel_id, h.hotel_name;


/* AvgPricePerHotel */
CREATE OR REPLACE VIEW AvgPricePerHotel AS
SELECT
    h.hotel_id,
    h.hotel_name,
    AVG(r.price) AS avg_price
FROM Hotel h
JOIN Room r ON h.hotel_id = r.hotel_id
GROUP BY h.hotel_id, h.hotel_name;


/* ManagerInfo */
CREATE OR REPLACE VIEW ManagerInfo AS
SELECT
    h.hotel_id,
    h.hotel_name,
    e.employee_sin AS manager_sin,
    e.full_name    AS manager_name
FROM Hotel h
LEFT JOIN Employee e
  ON h.manager_id = e.employee_sin;


/* CustomerBookingHistory */
CREATE OR REPLACE VIEW CustomerBookingHistory AS
SELECT
    c.customer_sin,
    c.full_name AS customer_name,
    b.booking_id,
    b.start_date,
    b.end_date,
    b.archived AS booking_archived,
    h.hotel_name
FROM Booking b
JOIN Customer c    ON b.customer_sin = c.customer_sin
JOIN Room r        ON b.room_id = r.room_id
JOIN Hotel h       ON r.hotel_id = h.hotel_id;


/* RoomDetailedInfo */
CREATE OR REPLACE VIEW RoomDetailedInfo AS
SELECT
    r.room_id,
    r.hotel_id,
    r.price,
    r.room_capacity,
    r.bed_count,
    r.is_extendable,
    COALESCE(string_agg(DISTINCT ra.amenity, ', '), 'None') AS amenities,
    COALESCE(string_agg(DISTINCT rd.damage, ', '), 'No Damages') AS damages
FROM Room r
LEFT JOIN RoomAmenity ra ON r.room_id = ra.room_id
LEFT JOIN RoomDamage rd  ON r.room_id = rd.room_id
GROUP BY r.room_id, r.hotel_id, r.price, r.room_capacity, r.bed_count, r.is_extendable;

/*
  Explanation:
    1) AvailableRoomsPerArea -> # rooms free in each address (area).
    2) AggregatedRoomCapacity -> sum of bed_count per hotel.
    3) AvgPricePerHotel -> average room price per hotel.
    4) ManagerInfo -> which manager (employee) runs each hotel.
    5) CustomerBookingHistory -> all bookings per customer (not just archived).
    6) RoomDetailedInfo -> merges room info, amenities, and damages in one row.
*/


