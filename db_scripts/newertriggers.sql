DROP TRIGGER IF EXISTS trg_sync_manager_change ON Hotel;
DROP FUNCTION IF EXISTS sync_manager_change();

-- Create new trigger function with logging
CREATE OR REPLACE FUNCTION sync_manager_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.manager_id IS DISTINCT FROM OLD.manager_id THEN
    -- If old manager, clear their hotel_id:
    IF OLD.manager_id IS NOT NULL THEN
      RAISE NOTICE 'Clearing old manager: %', OLD.manager_id;
      UPDATE Employee
         SET hotel_id = NULL
       WHERE employee_sin = OLD.manager_id;
    END IF;
    -- Set new manager hotel_id to match the hotel hotel_id:
    IF NEW.manager_id IS NOT NULL THEN
      RAISE NOTICE 'Setting new manager: % to hotel_id %', NEW.manager_id, NEW.hotel_id;
      UPDATE Employee
         SET hotel_id = NEW.hotel_id
       WHERE employee_sin = NEW.manager_id;
    END IF;
  ELSE
    RAISE NOTICE 'Manager unchanged: %', NEW.manager_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on Hotel table for update of manager_id
CREATE TRIGGER trg_sync_manager_change
AFTER UPDATE OF manager_id ON Hotel
FOR EACH ROW
EXECUTE PROCEDURE sync_manager_change();

