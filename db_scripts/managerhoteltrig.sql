-- Create trigger that checks that the manager_id corresponds to role_id 1
CREATE OR REPLACE FUNCTION enforce_manager_role()
RETURNS trigger AS $$
DECLARE
  mgr_role INTEGER;
BEGIN
  -- Only check if a manager_id is provided
  IF NEW.manager_id IS NOT NULL THEN
    SELECT role_id INTO mgr_role FROM Employee_Role WHERE employee_sin = NEW.manager_id;
    IF mgr_role IS NULL OR mgr_role <> 1 THEN
      RAISE EXCEPTION 'manager_id % does not correspond to a manager role (role_id must be 1)', NEW.manager_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on Hotel for INSERT and UPDATE
CREATE TRIGGER trg_enforce_manager_role
BEFORE INSERT OR UPDATE ON Hotel
FOR EACH ROW
EXECUTE FUNCTION enforce_manager_role();

