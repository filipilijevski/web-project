CREATE OR REPLACE FUNCTION enforce_manager_hotel_consistency()
RETURNS TRIGGER AS $$
DECLARE
  mgr_hotel_id INTEGER;
BEGIN
  -- Check if this employee is a manager in any hotel.
  SELECT hotel_id INTO mgr_hotel_id
    FROM Hotel
   WHERE manager_id = NEW.employee_sin
   LIMIT 1;
  
  -- If the employee is a manager, ensure their hotel_id matches the hotel's id.
  IF mgr_hotel_id IS NOT NULL AND NEW.hotel_id IS DISTINCT FROM mgr_hotel_id THEN
    RAISE EXCEPTION 'Manager % must have hotel_id %', NEW.employee_sin, mgr_hotel_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_manager_consistency
BEFORE UPDATE ON Employee
FOR EACH ROW
EXECUTE PROCEDURE enforce_manager_hotel_consistency();

