-- Custom SQL migration file, put your code below! --
CREATE OR REPLACE FUNCTION interval_to_iso8601(i interval) RETURNS text AS $$
DECLARE
    years int;
    months int;
    days int;
    hours int;
    minutes int;
    seconds numeric;
    result text := 'P';
BEGIN
    -- Extraer componentes
    years := EXTRACT(YEAR FROM i);
    months := EXTRACT(MONTH FROM i);
    days := EXTRACT(DAY FROM i);
    hours := EXTRACT(HOUR FROM i);
    minutes := EXTRACT(MINUTE FROM i);
    seconds := EXTRACT(SECOND FROM i);

    -- Construir parte de fecha
    IF years > 0 THEN
        result := result || years || 'Y';
    END IF;

    IF months > 0 THEN
        result := result || months || 'M';
    END IF;

    IF days > 0 THEN
        result := result || days || 'D';
    END IF;

    -- Agregar T si hay componentes de tiempo
    IF hours > 0 OR minutes > 0 OR seconds > 0 THEN
        result := result || 'T';

        IF hours > 0 THEN
            result := result || hours || 'H';
        END IF;

        IF minutes > 0 THEN
            result := result || minutes || 'M';
        END IF;

        IF seconds > 0 THEN
            result := result || TRIM(TO_CHAR(seconds, '999D999999')) || 'S';
        END IF;
    END IF;

    -- Manejar caso de intervalo vacío
    IF result = 'P' THEN
        result := 'PT0S';
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
