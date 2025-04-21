-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION validate_messages(data JSONB, users TEXT[])
RETURNS BOOLEAN AS $$
DECLARE
    item JSONB;
    keys TEXT[];
BEGIN
    IF jsonb_typeof(data) != 'array' THEN
        RETURN FALSE;
    END IF;

    FOR item IN SELECT * FROM jsonb_array_elements(data)
    LOOP
        IF jsonb_typeof(item) != 'object' THEN
            RETURN FALSE;
        END IF;

        SELECT array_agg(key) INTO keys FROM jsonb_object_keys(item) AS t(key);

        IF array_length(keys, 1) != 2 OR
           NOT ('user' = ANY(keys)) OR
           NOT ('message' = ANY(keys)) THEN
            RETURN FALSE;
        END IF;

        IF jsonb_typeof(item->'user') != 'number' THEN
            RETURN FALSE;
        END IF;

        IF NOT ((item->'user')::TEXT = ANY(users)) THEN
            RETURN FALSE;
        END IF;

        IF jsonb_typeof(item->'message') != 'string' THEN
            RETURN FALSE;
        END IF;
    END LOOP;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
