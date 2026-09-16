--
-- PostgreSQL database dump
--

-- \restrict 7Hbr2IXgudqCoNflayuNQwTSDRDTaUaythd7RrJ5kMzfhNEfbiWLVRNgWu2MUMA

-- Dumped from database version 15.8
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

-- CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender AS ENUM (
    'MALE',
    'FEMALE'
);


ALTER TYPE public.gender OWNER TO postgres;

--
-- Name: status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.status OWNER TO postgres;

--
-- Name: user_roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_roles AS ENUM (
    'SUPERADMIN',
    'EMPLOYEE'
);


ALTER TYPE public.user_roles OWNER TO postgres;

--
-- Name: generate_card_and_certificate_no(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_card_and_certificate_no() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Get the current year's last two digits
    DECLARE
        current_year_suffix TEXT := to_char(CURRENT_DATE, 'YY');
    BEGIN
        -- Generate the card_no and certificate_no with the desired format
        NEW.card_no := 'QRS-TRA-' || current_year_suffix || '-' || LPAD(nextval('certificate_id_seq')::TEXT, 4, '0');
        NEW.certificate_no := NEW.card_no;

        RETURN NEW;
    END;
END;
$$;


ALTER FUNCTION public.generate_card_and_certificate_no() OWNER TO postgres;

--
-- Name: generate_transaction_no(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_transaction_no() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    current_year_suffix TEXT := to_char(CURRENT_DATE, 'YY');  -- Get last two digits of current year
    certificate_number TEXT;
BEGIN
    -- Ensure the sequence exists or create it (if needed)
    PERFORM setval('transaction_certificate_id_seq', COALESCE((SELECT last_value FROM transaction_certificate_id_seq), 0));

    -- Generate certificate number: CRT-24-4142
    certificate_number := 'CRT-' || current_year_suffix || '-' || LPAD(nextval('transaction_certificate_id_seq')::TEXT, 4, '0');
    
    -- Return the generated certificate number
    RETURN certificate_number;
END;
$$;


ALTER FUNCTION public.generate_transaction_no() OWNER TO postgres;

--
-- Name: get_location_details(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_location_details() RETURNS jsonb
    LANGUAGE plpgsql
    AS $$BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'location', 
                    CASE 
                        WHEN location.id IS NOT NULL THEN json_build_object(
                            'id', location.id,
                            'created_at', location.created_at,
                            'name', location.location,
                            'status', location.status
                        )
                        ELSE NULL
                    END,
                'site', 
                    CASE 
                        WHEN site.id IS NOT NULL THEN json_build_object(
                            'id', site.id,
                            'created_at', site.created_at,
                            'name', site.site,
                            'status', site.status
                        )
                        ELSE NULL
                    END,
                'area', 
                    CASE 
                        WHEN area.id IS NOT NULL THEN json_build_object(
                            'id', area.id,
                            'name', area.thumbnail,
                            'status', area.status
                        )
                        ELSE NULL
                    END
            )
        ) AS result
        FROM location
        LEFT JOIN site ON location.site = site.id
        LEFT JOIN area ON site.area = area.id
    );
END;$$;


ALTER FUNCTION public.get_location_details() OWNER TO postgres;

--
-- Name: get_major_category_details(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_major_category_details() RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'major_category', json_build_object(
                    'id', major_category.id,
                    'created_at', major_category.created_at,
                    'name', major_category.major_category
                ),
                'equipment_type', json_build_object(
                    'id', equipment_type.id,
                    'created_at', equipment_type.created_at,
                    'status', equipment_type.status,
                    'category', equipment_type.category,
                    'equipmentType', equipment_type.equipment_type
                )
            )
        )
        FROM major_category
        JOIN equipment_type ON major_category.equipment_type = equipment_type.id
    );
END;
$$;


ALTER FUNCTION public.get_major_category_details() OWNER TO postgres;

--
-- Name: get_minor_category_data(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_minor_category_data() RETURNS json
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN (
        SELECT json_agg(
            json_build_object(
                'minor_category', json_build_object(
                    'id', minor_category.id,
                    'created_at', minor_category.created_at,
                    'name', minor_category.minor_category,
                    'status', minor_category.status
                ),
                'major_category', json_build_object(
                    'id', major_category.id,
                    'created_at', major_category.created_at,
                    'name', major_category.major_category,
                    'status', major_category.status
                ),
                'standard', json_build_object(
                    'id', standard.id,
                    'created_at', standard.created_at,
                    'name', standard.standard,
                    'type', standard.standard_type,
                    'remarks', standard.remarks,
                    'status', standard.status
                )
            )
        )
        FROM minor_category
        JOIN major_category ON minor_category.major_category = major_category.id
        JOIN standard ON minor_category.standard = standard.id
    );
END;
$$;


ALTER FUNCTION public.get_minor_category_data() OWNER TO postgres;

--
-- Name: manual_data_entry_for_lifting_equipment(text, text, text, text, text, text, text, text, text, text, text, text, text, text, bigint, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text DEFAULT NULL::text, _next_test_date text DEFAULT NULL::text, _last_thorough_date text DEFAULT NULL::text, _next_thorough_date text DEFAULT NULL::text) RETURNS TABLE(equipment_id bigint, manufacturer_id bigint, owner_id bigint, standard_id bigint)
    LANGUAGE plpgsql
    AS $$DECLARE
    new_equipment_id BIGINT;
    new_manufacturer_id BIGINT;
    new_owner_id BIGINT;
    new_standard_id BIGINT;
BEGIN
    RAISE LOG '------FUNCTION CALLED FOR MANUAL ENTER LIFTING EQUIPMENT';

    -- Always create fresh rows in each master table
    INSERT INTO manufacturer (manufacturer) 
    VALUES (_manufacturer_name) 
    RETURNING id INTO new_manufacturer_id;
    
    INSERT INTO owner (owner, code)  -- Include code column
    VALUES (_owner_name, _owner_code) 
    RETURNING id INTO new_owner_id;
    
    INSERT INTO standard (standard) 
    VALUES (_standard_code) 
    RETURNING id INTO new_standard_id;

    -- Insert the physical equipment record with all fields
    INSERT INTO equipment (
        equipment_no,
        serial_no,
        title,
        description,
        manufacturer,
        owner_id,
        standard,
        test_certificate_no,
        safe_working_load,
        model_no,
        year_of_manufacture,
        registration_no,
        last_test_date,
        next_test_date,
        last_thorough_date,
        next_thorough_date,
        annexure,
        property_table_type,
        item_type,
        status
    )
    VALUES (
        _equipment_no,
        _serial_no,
        _title,
        _description,
        new_manufacturer_id,
        new_owner_id,
        new_standard_id,
        _test_certificate_no,
        _safe_working_load,
        _model_no,
        _year_of_manufacture,
        _registration_no,
        _last_test_date,
        _next_test_date,
        _last_thorough_date,
        _next_thorough_date,
        _annexure_id,
        _property_table_type,
        'Lifting Equipment',
        'ACTIVE'
    )
    RETURNING id INTO new_equipment_id;

    -- Return the IDs so the client can use them
    RETURN QUERY
        SELECT new_equipment_id,
               new_manufacturer_id,
               new_owner_id,
               new_standard_id;
END;$$;


ALTER FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text) OWNER TO postgres;

--
-- Name: manual_data_entry_from_multi_equipment(text, text, text, text, text, text, text, text, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) RETURNS TABLE(equipment_id bigint, manufacturer_id bigint, owner_id bigint, standard_id bigint)
    LANGUAGE plpgsql
    AS $$DECLARE
    new_equipment_id BIGINT;
    new_manufacturer_id BIGINT;
    new_owner_id BIGINT;
    new_standard_id BIGINT;
BEGIN
    RAISE LOG '------FUNCTION CALLED FOR MANUAL ENTER MULTI gear';

    -- Always create fresh rows in each master table
    INSERT INTO manufacturer (manufacturer) VALUES (_manufacturer_name) RETURNING id INTO new_manufacturer_id;
    INSERT INTO owner (owner) VALUES (_owner_name) RETURNING id INTO new_owner_id;
    INSERT INTO standard (standard) VALUES (_standard_code) RETURNING id INTO new_standard_id;

    -- Insert the physical equipment record with all new fields
    INSERT INTO equipment (
        equipment_no,
        serial_no,
        title,
        description,
        manufacturer,
        owner_id,
        standard,
        test_certificate_no,
        safe_working_load,
        proof_load,
        last_test_date,
        next_test_date,
        last_through_date,
        next_through_date
    )
    VALUES (
        _equipment_no,
        _serial_no,
        _title,
        _description,
        new_manufacturer_id,
        new_owner_id,
        new_standard_id,
        _test_certificate_no,
        _safe_working_load,
        _proof_load,
        _last_test_date,
        _next_test_date,
        _last_through_date,
        _next_through_date
    )
    RETURNING id INTO new_equipment_id;

    -- Return the IDs so the client can use them
    RETURN QUERY
        SELECT new_equipment_id,
               new_manufacturer_id,
               new_owner_id,
               new_standard_id;
END;$$;


ALTER FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) OWNER TO postgres;

--
-- Name: manual_data_entry_from_single_equipment(text, text, text, text, text, text, text, text, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) RETURNS TABLE(equipment_id bigint, manufacturer_id bigint, owner_id bigint, standard_id bigint)
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_equipment_id BIGINT;
    new_manufacturer_id BIGINT;
    new_owner_id BIGINT;
    new_standard_id BIGINT;
BEGIN
    RAISE LOG '------FUNCTION CALLED FOR MANUAL ENTER MULTI gear';

    -- Always create fresh rows in each master table
    INSERT INTO manufacturer (manufacturer) VALUES (_manufacturer_name) RETURNING id INTO new_manufacturer_id;
    INSERT INTO owner (owner) VALUES (_owner_name) RETURNING id INTO new_owner_id;
    INSERT INTO standard (standard) VALUES (_standard_code) RETURNING id INTO new_standard_id;

    -- Insert the physical equipment record with all new fields
    INSERT INTO equipment (
        equipment_no,
        serial_no,
        title,
        description,
        manufacturer,
        owner_id,
        standard,
        test_certificate_no,
        safe_working_load,
        proof_load,
        last_test_date,
        next_test_date,
        last_through_date,
        next_through_date
    )
    VALUES (
        _equipment_no,
        _serial_no,
        _title,
        _description,
        new_manufacturer_id,
        new_owner_id,
        new_standard_id,
        _test_certificate_no,
        _safe_working_load,
        _proof_load,
        _last_test_date,
        _next_test_date,
        _last_through_date,
        _next_through_date
    )
    RETURNING id INTO new_equipment_id;

    -- Return the IDs so the client can use them
    RETURN QUERY
        SELECT new_equipment_id,
               new_manufacturer_id,
               new_owner_id,
               new_standard_id;
END;
$$;


ALTER FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) OWNER TO postgres;

--
-- Name: set_certificate_no_before_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_certificate_no_before_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Set the certificate_no column to the value generated by the function
    NEW.certificate_no := generate_transaction_no();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_certificate_no_before_insert() OWNER TO postgres;

--
-- Name: set_job_no(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_job_no() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_seq_val INTEGER;
  formatted_val TEXT;
BEGIN
  -- Get the next value from the sequence
  new_seq_val := nextval('job_no_sequence');
  
  -- Format it as a 4-digit zero-padded number (e.g., 0001, 0002, etc.)
  formatted_val := lpad(new_seq_val::text, 4, '0');
  
  -- Set the job_no field with the prefix and the formatted sequence
  NEW.job_no := 'JOB-24-' || formatted_val;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_job_no() OWNER TO postgres;

--
-- Name: set_updated_at_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at_timestamp() OWNER TO postgres;

--
-- Name: update_version(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_version() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.version := OLD.version + 1;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_version() OWNER TO postgres;

--
-- Name: verify_user_password(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verify_user_password(password text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid() AND encrypted_password = crypt(password, encrypted_password)
  );
END;
$$;


ALTER FUNCTION public.verify_user_password(password text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: A; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."A" (
    id bigint NOT NULL,
    inspection_date text
);


ALTER TABLE public."A" OWNER TO postgres;

--
-- Name: annexure; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annexure (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    annexure text,
    status public.status DEFAULT 'ACTIVE'::public.status,
    property_table_type text
);


ALTER TABLE public.annexure OWNER TO postgres;

--
-- Name: TABLE annexure; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.annexure IS 'annexure';


--
-- Name: annexure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.annexure ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.annexure_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: area; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.area (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    thumbnail text,
    status public.status DEFAULT 'ACTIVE'::public.status NOT NULL
);


ALTER TABLE public.area OWNER TO postgres;

--
-- Name: area_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.area ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.area_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authority; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authority (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    authority text,
    designation text,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.authority OWNER TO postgres;

--
-- Name: authority_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.authority ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.authority_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: certificate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificate_id_seq OWNER TO postgres;

--
-- Name: equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    equipment_id text,
    title text,
    last_through_date text,
    next_through_date text,
    last_test_date text,
    owner_id bigint,
    model_no text,
    manufacturer bigint,
    test_certificate_no text,
    location bigint,
    standard bigint,
    serial_no text,
    annexure bigint,
    year_of_manufacture text,
    status public.status DEFAULT 'ACTIVE'::public.status,
    safe_working_load text,
    proof_load text,
    next_test_date text,
    test_insp_frequency text,
    equipment_no text,
    test_insp_frequency_months text,
    description text,
    last_thorough_date text,
    minor_category bigint,
    next_thorough_date text,
    registration_no text,
    thorough_insp_frequency_months text,
    item_type text,
    property_table_type text
);


ALTER TABLE public.equipment OWNER TO postgres;

--
-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.equipment ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.equipment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: equipment_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment_type (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    equipment_type text,
    category text,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.equipment_type OWNER TO postgres;

--
-- Name: equipment_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.equipment_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.equipment_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: job_no_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_no_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_no_sequence OWNER TO postgres;

--
-- Name: job_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_orders (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    client_name text,
    email text,
    contact_number text,
    surveyor bigint,
    site_contact_person text,
    location bigint,
    status text,
    job_order_status text,
    job_no text,
    equipment_details text
);


ALTER TABLE public.job_orders OWNER TO postgres;

--
-- Name: job_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.job_orders ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.job_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lifting_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lifting_equipment (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    inspection_date text,
    type_of_exam text,
    job_order_no bigint,
    equipment_no bigint,
    title text,
    equipment_description text,
    test_cert_coc_no text,
    serial_no text,
    owner_id bigint,
    model_no text,
    manufacturer bigint,
    year_of_manufacture text,
    registration_no text,
    standard bigint,
    owner_name text,
    surveyor bigint,
    tested_standard text,
    last_test_exam text,
    last_thorough_exam text,
    next_test_exam text,
    next_thorough_exam text,
    description text,
    result text,
    result_description text,
    description_of_test text,
    approval_status text,
    properties jsonb,
    location bigint,
    safe_working_load text,
    authority bigint,
    site bigint,
    annexures jsonb,
    first_examination boolean,
    six_month_interval boolean,
    twelve_month_interval boolean,
    correct_installation boolean,
    examination_scheme boolean,
    exceptional_circumstances boolean,
    safe_to_use boolean,
    defect_description text,
    test_particulars text,
    certificate_no text,
    version integer DEFAULT 1 NOT NULL,
    lift_location text,
    last_test_exam_certificate_no text,
    next_test_exam_certificate_no text,
    next_thorough_exam_certificate_no text,
    last_thorough_exam_certificate_no text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lifting_equipment OWNER TO postgres;

--
-- Name: lifting_equipment_certificate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lifting_equipment ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lifting_equipment_certificate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    location text,
    site bigint,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.location OWNER TO postgres;

--
-- Name: manufacturer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.manufacturer (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    manufacturer text,
    address text,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.manufacturer OWNER TO postgres;

--
-- Name: owner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.owner (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner text,
    address text,
    code text,
    status public.status DEFAULT 'ACTIVE'::public.status,
    qp_footer text,
    non_qp_footer text,
    client_specification text,
    digital_signature text
);


ALTER TABLE public.owner OWNER TO postgres;

--
-- Name: site; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    site text,
    area bigint,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.site OWNER TO postgres;

--
-- Name: standard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.standard (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    standard text,
    standard_type text,
    remarks text,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.standard OWNER TO postgres;

--
-- Name: surveyor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.surveyor (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    surveyor text,
    qualification text,
    code text,
    digital_signature text,
    status text
);


ALTER TABLE public.surveyor OWNER TO postgres;

--
-- Name: lifting_equipment_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.lifting_equipment_view AS
 SELECT le.id,
    le.created_at,
    le.inspection_date,
    le.type_of_exam,
    le.job_order_no,
    le.equipment_no,
    eq.equipment_no AS equipment,
    le.title,
    le.equipment_description,
    le.test_cert_coc_no,
    le.serial_no,
    le.owner_id,
    o.owner,
    le.model_no,
    m.manufacturer,
    le.year_of_manufacture,
    le.registration_no,
    s.standard,
    sur.surveyor,
    le.tested_standard,
    le.last_test_exam,
    le.last_thorough_exam,
    le.next_test_exam,
    le.next_thorough_exam,
    le.description,
    le.result,
    le.result_description,
    le.description_of_test,
    le.approval_status,
    le.properties,
    loc.location,
    le.safe_working_load,
    auth.authority,
    site.site,
    le.annexures,
    le.first_examination,
    le.six_month_interval,
    le.twelve_month_interval,
    le.correct_installation,
    le.examination_scheme,
    le.exceptional_circumstances,
    le.safe_to_use,
    le.defect_description,
    le.test_particulars,
    le.certificate_no,
    le.version,
    le.lift_location
   FROM (((((((((public.lifting_equipment le
     LEFT JOIN public.job_orders jo ON ((le.job_order_no = jo.id)))
     LEFT JOIN public.equipment eq ON ((le.equipment_no = eq.id)))
     LEFT JOIN public.owner o ON ((le.owner_id = o.id)))
     LEFT JOIN public.manufacturer m ON ((le.manufacturer = m.id)))
     LEFT JOIN public.standard s ON ((le.standard = s.id)))
     LEFT JOIN public.surveyor sur ON ((le.surveyor = sur.id)))
     LEFT JOIN public.location loc ON ((le.location = loc.id)))
     LEFT JOIN public.authority auth ON ((le.authority = auth.id)))
     LEFT JOIN public.site site ON ((le.site = site.id)));


ALTER VIEW public.lifting_equipment_view OWNER TO postgres;

--
-- Name: lifting_gear_multi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lifting_gear_multi (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    inspection_date text,
    site bigint,
    authority bigint,
    job_order_no bigint,
    equipment_no bigint,
    title text,
    test_cert_coc_no text,
    safe_working_load text,
    last_test_exam text,
    next_test_exam text,
    last_thorough_exam text,
    next_thorough_exam text,
    description text,
    result text DEFAULT 'VERIFIED'::text,
    area bigint,
    surveyor bigint,
    work_order_no text,
    owner_name bigint,
    owner_address bigint,
    manufacturer bigint,
    type_of_exam text,
    location bigint,
    approval_status text,
    first_examination boolean,
    six_month_interval boolean,
    twelve_month_interval boolean,
    correct_installation boolean,
    examination_scheme boolean,
    exceptional_circumstances boolean,
    safe_to_use boolean,
    defect_description text,
    equipment_description text,
    proof_load text,
    test_particulars text,
    tested_standard text,
    certificate_no text,
    version integer DEFAULT 1 NOT NULL,
    standard bigint,
    last_test_exam_certificate_no text,
    next_test_exam_certificate_no text,
    next_thorough_exam_certificate_no text,
    last_thorough_exam_certificate_no text
);


ALTER TABLE public.lifting_gear_multi OWNER TO postgres;

--
-- Name: lifting_gear_multi_equipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lifting_gear_multi_equipments (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    equipment_no text,
    title text,
    equipment_description text,
    test_cert_coc_no text,
    safe_working_load text,
    proof_load text,
    last_test_exam text,
    next_test_exam text,
    next_thorough_exam text,
    result text,
    owner_name text,
    surveyor text,
    tested_standard text,
    manufacturer text,
    approval_status text,
    last_thorough_exam text,
    standard text,
    lifting_gear_multi_id bigint,
    inspection_date text,
    type_of_exam text,
    last_thorough_exam_certificate_no text,
    last_test_exam_certificate_no text
);


ALTER TABLE public.lifting_gear_multi_equipments OWNER TO postgres;

--
-- Name: lifting_gear_multi_equipments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lifting_gear_multi_equipments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lifting_gear_multi_equipments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lifting_gear_multi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lifting_gear_multi ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lifting_gear_multi_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lifting_gear_multi_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.lifting_gear_multi_view AS
 SELECT lgm.id AS lifting_gear_id,
    lgm.location,
    s.id AS site_id,
    s.site,
    auth.id AS authority_id,
    auth.authority,
    jo.id AS job_order_id,
    jo.job_no AS job_order_no,
    lgm.approval_status
   FROM (((public.lifting_gear_multi lgm
     LEFT JOIN public.site s ON ((lgm.site = s.id)))
     LEFT JOIN public.authority auth ON ((lgm.authority = auth.id)))
     LEFT JOIN public.job_orders jo ON ((lgm.job_order_no = jo.id)));


ALTER VIEW public.lifting_gear_multi_view OWNER TO postgres;

--
-- Name: lifting_gear_single; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lifting_gear_single (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    inspection_date text,
    site bigint,
    standard bigint,
    job_order_no bigint,
    equipment_no bigint,
    title text,
    test_cert_coc_no text,
    safe_working_load text,
    last_test_exam text,
    next_test_exam text,
    last_thorough_exam text,
    next_thorough_exam text,
    result text,
    surveyor bigint,
    defect_description text,
    test_particulars text,
    work_order_no text,
    proof_load text,
    description text,
    equipment_description text,
    manufacturer bigint,
    tested_standard text,
    first_examination boolean,
    six_month_interval boolean,
    twelve_month_interval boolean,
    correct_installation boolean,
    examination_scheme boolean,
    exceptional_circumstances boolean,
    safe_to_use boolean,
    approval_status boolean,
    owner_name bigint,
    location bigint,
    type_of_exam text,
    certificate_no text,
    version integer DEFAULT 1 NOT NULL,
    authority bigint,
    last_test_exam_certificate_no text,
    next_test_exam_certificate_no text,
    last_thorough_exam_certificate_no text,
    next_thorough_exam_certificate_no text
);


ALTER TABLE public.lifting_gear_single OWNER TO postgres;

--
-- Name: lifting_gear_single_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."A" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lifting_gear_single_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lifting_gear_single_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lifting_gear_single ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lifting_gear_single_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lifting_gear_single_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.lifting_gear_single_view AS
 SELECT lgs.id,
    lgs.created_at,
    lgs.inspection_date,
    lgs.type_of_exam,
    s.site AS site_name,
    auth.authority AS authority_name,
    st.standard AS standard_name,
    jo.job_no AS job_order_no,
    lgs.equipment_no,
    lgs.title,
    lgs.test_cert_coc_no,
    lgs.safe_working_load,
    lgs.last_test_exam,
    lgs.next_test_exam,
    lgs.last_thorough_exam,
    lgs.next_thorough_exam,
    lgs.result,
    sur.surveyor AS surveyor_name,
    lgs.defect_description,
    lgs.test_particulars,
    lgs.work_order_no,
    lgs.proof_load,
    lgs.equipment_description,
    mf.manufacturer AS manufacturer_name,
    lgs.tested_standard,
    lgs.first_examination,
    lgs.six_month_interval,
    lgs.twelve_month_interval,
    lgs.correct_installation,
    lgs.examination_scheme,
    lgs.exceptional_circumstances,
    lgs.safe_to_use,
    lgs.approval_status,
    lgs.owner_name,
    o.owner AS owner_full_name,
    lgs.location,
    loc.location AS location_name,
    lgs.certificate_no,
    lgs.version
   FROM (((((((((public.lifting_gear_single lgs
     LEFT JOIN public.site s ON ((lgs.site = s.id)))
     LEFT JOIN public.authority auth ON ((lgs.authority = auth.id)))
     LEFT JOIN public.standard st ON ((lgs.standard = st.id)))
     LEFT JOIN public.job_orders jo ON ((lgs.job_order_no = jo.id)))
     LEFT JOIN public.equipment eq ON ((lgs.equipment_no = eq.id)))
     LEFT JOIN public.surveyor sur ON ((lgs.surveyor = sur.id)))
     LEFT JOIN public.manufacturer mf ON ((lgs.manufacturer = mf.id)))
     LEFT JOIN public.owner o ON ((lgs.owner_name = o.id)))
     LEFT JOIN public.location loc ON ((lgs.location = loc.id)));


ALTER VIEW public.lifting_gear_single_view OWNER TO postgres;

--
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.location ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: major_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.major_category (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    major_category text,
    equipment_type bigint,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.major_category OWNER TO postgres;

--
-- Name: major_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.major_category ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.major_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: manufacturer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.manufacturer ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.manufacturer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: minor_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.minor_category (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    minor_category text,
    major_category bigint,
    standard bigint,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.minor_category OWNER TO postgres;

--
-- Name: minor_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.minor_category ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.minor_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: owner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.owner ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.owner_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: property; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    property text,
    property_type text,
    status public.status DEFAULT 'ACTIVE'::public.status
);


ALTER TABLE public.property OWNER TO postgres;

--
-- Name: property_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.property ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.property_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: property_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.property_list (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    property text,
    property_group text,
    condition text,
    annexure_id bigint
);


ALTER TABLE public.property_list OWNER TO postgres;

--
-- Name: property_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.property_list ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.property_list_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    roles public.user_roles NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: site_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.site ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.site_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: standard_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.standard ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.standard_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: students_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students_credentials (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    contact_number text,
    address text,
    gender public.gender,
    company text,
    id_no text,
    card_no text,
    designation text,
    model_level text,
    issued_on text,
    valid_untill text,
    avatar text,
    card_url text,
    certificate_url text,
    added_by text,
    certificate_no text,
    qr_url text,
    card_html text,
    course_duration text,
    approval_status boolean
);


ALTER TABLE public.students_credentials OWNER TO postgres;

--
-- Name: students_credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.students_credentials ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.students_credentials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: surveyor_competency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.surveyor_competency (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    competency text,
    validity text,
    attachment text,
    surveyor_id bigint
);


ALTER TABLE public.surveyor_competency OWNER TO postgres;

--
-- Name: surveyor_competency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.surveyor_competency ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.surveyor_competency_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: surveyor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.surveyor ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.surveyor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: transaction_certificate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_certificate_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_certificate_id_seq OWNER TO postgres;

--
-- Name: unique_companies; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.unique_companies AS
 SELECT DISTINCT students_credentials.company
   FROM public.students_credentials
  WHERE (students_credentials.company IS NOT NULL);


ALTER VIEW public.unique_companies OWNER TO postgres;

--
-- Name: unique_courses; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.unique_courses AS
 SELECT DISTINCT students_credentials.designation
   FROM public.students_credentials
  WHERE (students_credentials.designation IS NOT NULL);


ALTER VIEW public.unique_courses OWNER TO postgres;

--
-- Name: unique_model_levels; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.unique_model_levels AS
 SELECT DISTINCT students_credentials.model_level
   FROM public.students_credentials
  WHERE (students_credentials.model_level IS NOT NULL);


ALTER VIEW public.unique_model_levels OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text DEFAULT ''::text,
    email text DEFAULT ''::text NOT NULL,
    phone bigint,
    avatar text DEFAULT ''::text,
    role public.user_roles DEFAULT 'SUPERADMIN'::public.user_roles NOT NULL,
    code text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: v_equipment; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_equipment AS
 SELECT e.id,
    e.created_at,
    e.equipment_id,
    e.title,
    e.last_through_date,
    e.next_through_date,
    e.last_test_date,
    o.owner AS owner_name,
    e.model_no,
    m.manufacturer,
    e.test_certificate_no,
    l.location,
    s.standard,
    e.serial_no,
    e.annexure,
    e.year_of_manufacture,
    e.status,
    e.safe_working_load,
    e.proof_load,
    e.next_test_date,
    e.test_insp_frequency,
    e.equipment_no,
    e.description,
    e.last_thorough_date,
    mc.minor_category,
    e.next_thorough_date,
    e.registration_no,
    e.thorough_insp_frequency_months,
    e.item_type,
    e.property_table_type
   FROM (((((public.equipment e
     LEFT JOIN public.owner o ON ((e.owner_id = o.id)))
     LEFT JOIN public.manufacturer m ON ((e.manufacturer = m.id)))
     LEFT JOIN public.location l ON ((e.location = l.id)))
     LEFT JOIN public.standard s ON ((e.standard = s.id)))
     LEFT JOIN public.minor_category mc ON ((e.minor_category = mc.id)));


ALTER VIEW public.v_equipment OWNER TO postgres;

--
-- Name: annexure annexure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annexure
    ADD CONSTRAINT annexure_pkey PRIMARY KEY (id);


--
-- Name: area area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.area
    ADD CONSTRAINT area_pkey PRIMARY KEY (id);


--
-- Name: authority authority_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authority
    ADD CONSTRAINT authority_pkey PRIMARY KEY (id);


--
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);


--
-- Name: equipment_type equipment_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_type
    ADD CONSTRAINT equipment_type_pkey PRIMARY KEY (id);


--
-- Name: job_orders job_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_pkey PRIMARY KEY (id);


--
-- Name: lifting_equipment lifting_equipment_certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_certificate_pkey PRIMARY KEY (id);


--
-- Name: lifting_gear_multi_equipments lifting_gear_multi_equipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi_equipments
    ADD CONSTRAINT lifting_gear_multi_equipments_pkey PRIMARY KEY (id);


--
-- Name: lifting_gear_multi lifting_gear_multi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_pkey PRIMARY KEY (id);


--
-- Name: A lifting_gear_single_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."A"
    ADD CONSTRAINT lifting_gear_single_pkey PRIMARY KEY (id);


--
-- Name: lifting_gear_single lifting_gear_single_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_pkey1 PRIMARY KEY (id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- Name: major_category major_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.major_category
    ADD CONSTRAINT major_category_pkey PRIMARY KEY (id);


--
-- Name: manufacturer manufacturer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.manufacturer
    ADD CONSTRAINT manufacturer_pkey PRIMARY KEY (id);


--
-- Name: minor_category minor_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minor_category
    ADD CONSTRAINT minor_category_pkey PRIMARY KEY (id);


--
-- Name: owner owner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owner
    ADD CONSTRAINT owner_pkey PRIMARY KEY (id);


--
-- Name: property_list property_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_list
    ADD CONSTRAINT property_list_pkey PRIMARY KEY (id);


--
-- Name: property property_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property
    ADD CONSTRAINT property_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: site site_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site
    ADD CONSTRAINT site_pkey PRIMARY KEY (id);


--
-- Name: standard standard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standard
    ADD CONSTRAINT standard_pkey PRIMARY KEY (id);


--
-- Name: students_credentials students_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students_credentials
    ADD CONSTRAINT students_credentials_pkey PRIMARY KEY (id);


--
-- Name: surveyor_competency surveyor_competency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surveyor_competency
    ADD CONSTRAINT surveyor_competency_pkey PRIMARY KEY (id);


--
-- Name: surveyor surveyor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surveyor
    ADD CONSTRAINT surveyor_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: lifting_equipment before_insert_lifting_equipment; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER before_insert_lifting_equipment BEFORE INSERT ON public.lifting_equipment FOR EACH ROW EXECUTE FUNCTION public.set_certificate_no_before_insert();


--
-- Name: lifting_gear_multi before_insert_lifting_gear_multi; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER before_insert_lifting_gear_multi BEFORE INSERT ON public.lifting_gear_multi FOR EACH ROW EXECUTE FUNCTION public.set_certificate_no_before_insert();


--
-- Name: lifting_gear_single before_insert_lifting_gear_single; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER before_insert_lifting_gear_single BEFORE INSERT ON public.lifting_gear_single FOR EACH ROW EXECUTE FUNCTION public.set_certificate_no_before_insert();


--
-- Name: job_orders job_no_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER job_no_trigger BEFORE INSERT ON public.job_orders FOR EACH ROW EXECUTE FUNCTION public.set_job_no();


--
-- Name: students_credentials set_custom_card_and_certificate_no; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_custom_card_and_certificate_no BEFORE INSERT ON public.students_credentials FOR EACH ROW EXECUTE FUNCTION public.generate_card_and_certificate_no();


--
-- Name: lifting_equipment trigger_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.lifting_equipment FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();


--
-- Name: lifting_equipment trigger_update_version; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_version BEFORE UPDATE ON public.lifting_equipment FOR EACH ROW EXECUTE FUNCTION public.update_version();


--
-- Name: lifting_gear_multi trigger_update_version; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_version BEFORE UPDATE ON public.lifting_gear_multi FOR EACH ROW EXECUTE FUNCTION public.update_version();


--
-- Name: lifting_gear_single trigger_update_version; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_version BEFORE UPDATE ON public.lifting_gear_single FOR EACH ROW EXECUTE FUNCTION public.update_version();


--
-- Name: equipment equipment_annexure_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_annexure_fkey FOREIGN KEY (annexure) REFERENCES public.annexure(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: equipment equipment_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: equipment equipment_manufacturer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_manufacturer_fkey FOREIGN KEY (manufacturer) REFERENCES public.manufacturer(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: equipment equipment_minor_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_minor_category_fkey FOREIGN KEY (minor_category) REFERENCES public.minor_category(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: equipment equipment_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owner(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: equipment equipment_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_orders job_orders_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_orders job_orders_surveyor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_orders
    ADD CONSTRAINT job_orders_surveyor_fkey FOREIGN KEY (surveyor) REFERENCES public.surveyor(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_authority_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_authority_fkey FOREIGN KEY (authority) REFERENCES public.authority(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_equipment_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_equipment_no_fkey FOREIGN KEY (equipment_no) REFERENCES public.equipment(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_job_order_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_job_order_no_fkey FOREIGN KEY (job_order_no) REFERENCES public.job_orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_manufacturer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_manufacturer_fkey FOREIGN KEY (manufacturer) REFERENCES public.manufacturer(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owner(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_site_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_site_fkey FOREIGN KEY (site) REFERENCES public.site(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_equipment lifting_equipment_surveyor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_equipment
    ADD CONSTRAINT lifting_equipment_surveyor_fkey FOREIGN KEY (surveyor) REFERENCES public.surveyor(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_area_fkey FOREIGN KEY (area) REFERENCES public.area(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_authority_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_authority_fkey FOREIGN KEY (authority) REFERENCES public.authority(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_equipment_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_equipment_no_fkey FOREIGN KEY (equipment_no) REFERENCES public.equipment(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi_equipments lifting_gear_multi_equipments_lifting_gear_multi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi_equipments
    ADD CONSTRAINT lifting_gear_multi_equipments_lifting_gear_multi_id_fkey FOREIGN KEY (lifting_gear_multi_id) REFERENCES public.lifting_gear_multi(id) ON DELETE CASCADE;


--
-- Name: lifting_gear_multi lifting_gear_multi_job_order_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_job_order_no_fkey FOREIGN KEY (job_order_no) REFERENCES public.job_orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_manufacturer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_manufacturer_fkey FOREIGN KEY (manufacturer) REFERENCES public.manufacturer(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_owner_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_owner_address_fkey FOREIGN KEY (owner_address) REFERENCES public.owner(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_owner_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_owner_name_fkey FOREIGN KEY (owner_name) REFERENCES public.owner(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_site_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_site_fkey FOREIGN KEY (site) REFERENCES public.site(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_multi lifting_gear_multi_surveyor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_multi
    ADD CONSTRAINT lifting_gear_multi_surveyor_fkey FOREIGN KEY (surveyor) REFERENCES public.surveyor(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: lifting_gear_single lifting_gear_single_authority_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_authority_fkey FOREIGN KEY (authority) REFERENCES public.authority(id) ON DELETE SET NULL;


--
-- Name: lifting_gear_single lifting_gear_single_equipment_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_equipment_no_fkey FOREIGN KEY (equipment_no) REFERENCES public.equipment(id) ON DELETE SET NULL;


--
-- Name: lifting_gear_single lifting_gear_single_job_order_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_job_order_no_fkey FOREIGN KEY (job_order_no) REFERENCES public.job_orders(id) ON DELETE SET NULL;


--
-- Name: lifting_gear_single lifting_gear_single_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON DELETE SET NULL;


--
-- Name: lifting_gear_single lifting_gear_single_manufacturer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_manufacturer_fkey FOREIGN KEY (manufacturer) REFERENCES public.manufacturer(id);


--
-- Name: lifting_gear_single lifting_gear_single_owner_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_owner_name_fkey FOREIGN KEY (owner_name) REFERENCES public.owner(id);


--
-- Name: lifting_gear_single lifting_gear_single_site_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_site_fkey FOREIGN KEY (site) REFERENCES public.site(id);


--
-- Name: lifting_gear_single lifting_gear_single_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id);


--
-- Name: lifting_gear_single lifting_gear_single_surveyor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lifting_gear_single
    ADD CONSTRAINT lifting_gear_single_surveyor_fkey FOREIGN KEY (surveyor) REFERENCES public.surveyor(id);


--
-- Name: location location_site_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_site_fkey FOREIGN KEY (site) REFERENCES public.site(id) ON DELETE SET NULL;


--
-- Name: major_category major_category_equipment_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.major_category
    ADD CONSTRAINT major_category_equipment_type_fkey FOREIGN KEY (equipment_type) REFERENCES public.equipment_type(id) ON DELETE SET NULL;


--
-- Name: minor_category minor_category_major_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minor_category
    ADD CONSTRAINT minor_category_major_category_fkey FOREIGN KEY (major_category) REFERENCES public.major_category(id) ON DELETE SET NULL;


--
-- Name: minor_category minor_category_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.minor_category
    ADD CONSTRAINT minor_category_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id) ON DELETE SET NULL;


--
-- Name: property_list property_list_annexure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.property_list
    ADD CONSTRAINT property_list_annexure_id_fkey FOREIGN KEY (annexure_id) REFERENCES public.annexure(id) ON DELETE SET NULL;


--
-- Name: site site_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site
    ADD CONSTRAINT site_area_fkey FOREIGN KEY (area) REFERENCES public.area(id) ON DELETE SET NULL;


--
-- Name: surveyor_competency surveyor_competency_surveyor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surveyor_competency
    ADD CONSTRAINT surveyor_competency_surveyor_id_fkey FOREIGN KEY (surveyor_id) REFERENCES public.surveyor(id) ON DELETE SET NULL;


--
-- Name: A; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."A" ENABLE ROW LEVEL SECURITY;

--
-- Name: area all operations policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "all operations policy" ON public.area TO authenticated USING (true);


--
-- Name: annexure; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.annexure ENABLE ROW LEVEL SECURITY;

--
-- Name: annexure annexure_table_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY annexure_table_policy ON public.annexure TO authenticated USING (true);


--
-- Name: area; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.area ENABLE ROW LEVEL SECURITY;

--
-- Name: authority; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.authority ENABLE ROW LEVEL SECURITY;

--
-- Name: authority authority_table_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY authority_table_policy ON public.authority TO authenticated USING (true);


--
-- Name: equipment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

--
-- Name: equipment equipment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY equipment ON public.equipment TO authenticated USING (true);


--
-- Name: equipment_type; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.equipment_type ENABLE ROW LEVEL SECURITY;

--
-- Name: equipment_type equipment_type_table_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY equipment_type_table_policy ON public.equipment_type TO authenticated USING (true);


--
-- Name: job_orders job_order_policy_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY job_order_policy_all ON public.job_orders TO authenticated USING (true);


--
-- Name: job_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: lifting_equipment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lifting_equipment ENABLE ROW LEVEL SECURITY;

--
-- Name: lifting_gear_single lifting_g; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lifting_g ON public.lifting_gear_single TO authenticated USING (true);


--
-- Name: lifting_gear_multi; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lifting_gear_multi ENABLE ROW LEVEL SECURITY;

--
-- Name: lifting_gear_multi lifting_gear_multi_all_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lifting_gear_multi_all_policy ON public.lifting_gear_multi TO authenticated USING (true);


--
-- Name: lifting_gear_multi_equipments lifting_gear_multi_all_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY lifting_gear_multi_all_policy ON public.lifting_gear_multi_equipments TO authenticated USING (true);


--
-- Name: lifting_gear_multi_equipments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lifting_gear_multi_equipments ENABLE ROW LEVEL SECURITY;

--
-- Name: lifting_gear_single; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lifting_gear_single ENABLE ROW LEVEL SECURITY;

--
-- Name: location; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.location ENABLE ROW LEVEL SECURITY;

--
-- Name: location location_table_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY location_table_policy ON public.location TO authenticated USING (true);


--
-- Name: major_category; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.major_category ENABLE ROW LEVEL SECURITY;

--
-- Name: major_category major_category; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY major_category ON public.major_category TO authenticated USING (true);


--
-- Name: manufacturer; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.manufacturer ENABLE ROW LEVEL SECURITY;

--
-- Name: manufacturer manufacturer_table_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY manufacturer_table_policy ON public.manufacturer TO authenticated USING (true);


--
-- Name: minor_category; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.minor_category ENABLE ROW LEVEL SECURITY;

--
-- Name: minor_category minor_category_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY minor_category_policy ON public.minor_category TO authenticated USING (true);


--
-- Name: owner; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.owner ENABLE ROW LEVEL SECURITY;

--
-- Name: owner owner; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY owner ON public.owner TO authenticated USING (true);


--
-- Name: lifting_equipment policy_all_lifting_equipment_certificate; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY policy_all_lifting_equipment_certificate ON public.lifting_equipment TO authenticated USING (true);


--
-- Name: surveyor_competency policy_all_surveor_compenency; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY policy_all_surveor_compenency ON public.surveyor_competency USING (true);


--
-- Name: property; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.property ENABLE ROW LEVEL SECURITY;

--
-- Name: property_list; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.property_list ENABLE ROW LEVEL SECURITY;

--
-- Name: property_list property_list_table_all_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY property_list_table_all_policy ON public.property_list TO authenticated USING (true);


--
-- Name: property property_policy_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY property_policy_all ON public.property TO authenticated USING (true);


--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: roles roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY roles ON public.roles TO authenticated USING (true);


--
-- Name: site; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.site ENABLE ROW LEVEL SECURITY;

--
-- Name: site site_table_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY site_table_policy ON public.site TO authenticated USING (true);


--
-- Name: standard; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.standard ENABLE ROW LEVEL SECURITY;

--
-- Name: standard standard_table_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY standard_table_policy ON public.standard TO authenticated USING (true);


--
-- Name: students_credentials; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.students_credentials ENABLE ROW LEVEL SECURITY;

--
-- Name: students_credentials students_credentials_all_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY students_credentials_all_policy ON public.students_credentials TO authenticated USING (true);


--
-- Name: surveyor; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.surveyor ENABLE ROW LEVEL SECURITY;

--
-- Name: surveyor_competency; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.surveyor_competency ENABLE ROW LEVEL SECURITY;

--
-- Name: surveyor surveyor_table_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY surveyor_table_policy ON public.surveyor TO authenticated USING (true);


--
-- Name: user; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;

--
-- Name: user user_create_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_create_policy ON public."user" FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: user user_delete_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_delete_policy ON public."user" FOR DELETE TO authenticated USING (true);


--
-- Name: user user_read_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_read_policy ON public."user" FOR SELECT TO authenticated, anon USING (true);


--
-- Name: user user_update_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_update_policy ON public."user" FOR UPDATE TO authenticated USING (true);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION generate_card_and_certificate_no(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_card_and_certificate_no() TO anon;
GRANT ALL ON FUNCTION public.generate_card_and_certificate_no() TO authenticated;
GRANT ALL ON FUNCTION public.generate_card_and_certificate_no() TO service_role;


--
-- Name: FUNCTION generate_transaction_no(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_transaction_no() TO anon;
GRANT ALL ON FUNCTION public.generate_transaction_no() TO authenticated;
GRANT ALL ON FUNCTION public.generate_transaction_no() TO service_role;


--
-- Name: FUNCTION get_location_details(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_location_details() TO anon;
GRANT ALL ON FUNCTION public.get_location_details() TO authenticated;
GRANT ALL ON FUNCTION public.get_location_details() TO service_role;


--
-- Name: FUNCTION get_major_category_details(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_major_category_details() TO anon;
GRANT ALL ON FUNCTION public.get_major_category_details() TO authenticated;
GRANT ALL ON FUNCTION public.get_major_category_details() TO service_role;


--
-- Name: FUNCTION get_minor_category_data(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_minor_category_data() TO anon;
GRANT ALL ON FUNCTION public.get_minor_category_data() TO authenticated;
GRANT ALL ON FUNCTION public.get_minor_category_data() TO service_role;


--
-- Name: FUNCTION manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text) TO anon;
GRANT ALL ON FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text) TO authenticated;
GRANT ALL ON FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text) TO service_role;


--
-- Name: FUNCTION manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO anon;
GRANT ALL ON FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO authenticated;
GRANT ALL ON FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO service_role;


--
-- Name: FUNCTION manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO anon;
GRANT ALL ON FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO authenticated;
GRANT ALL ON FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO service_role;


--
-- Name: FUNCTION set_certificate_no_before_insert(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_certificate_no_before_insert() TO anon;
GRANT ALL ON FUNCTION public.set_certificate_no_before_insert() TO authenticated;
GRANT ALL ON FUNCTION public.set_certificate_no_before_insert() TO service_role;


--
-- Name: FUNCTION set_job_no(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_job_no() TO anon;
GRANT ALL ON FUNCTION public.set_job_no() TO authenticated;
GRANT ALL ON FUNCTION public.set_job_no() TO service_role;


--
-- Name: FUNCTION set_updated_at_timestamp(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_updated_at_timestamp() TO anon;
GRANT ALL ON FUNCTION public.set_updated_at_timestamp() TO authenticated;
GRANT ALL ON FUNCTION public.set_updated_at_timestamp() TO service_role;


--
-- Name: FUNCTION update_version(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_version() TO anon;
GRANT ALL ON FUNCTION public.update_version() TO authenticated;
GRANT ALL ON FUNCTION public.update_version() TO service_role;


--
-- Name: FUNCTION verify_user_password(password text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.verify_user_password(password text) TO anon;
GRANT ALL ON FUNCTION public.verify_user_password(password text) TO authenticated;
GRANT ALL ON FUNCTION public.verify_user_password(password text) TO service_role;


--
-- Name: TABLE "A"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."A" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."A" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."A" TO service_role;


--
-- Name: TABLE annexure; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.annexure TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.annexure TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.annexure TO service_role;


--
-- Name: SEQUENCE annexure_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.annexure_id_seq TO anon;
GRANT ALL ON SEQUENCE public.annexure_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.annexure_id_seq TO service_role;


--
-- Name: TABLE area; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.area TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.area TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.area TO service_role;


--
-- Name: SEQUENCE area_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.area_id_seq TO anon;
GRANT ALL ON SEQUENCE public.area_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.area_id_seq TO service_role;


--
-- Name: TABLE authority; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.authority TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.authority TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.authority TO service_role;


--
-- Name: SEQUENCE authority_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.authority_id_seq TO anon;
GRANT ALL ON SEQUENCE public.authority_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.authority_id_seq TO service_role;


--
-- Name: SEQUENCE certificate_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.certificate_id_seq TO anon;
GRANT ALL ON SEQUENCE public.certificate_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.certificate_id_seq TO service_role;


--
-- Name: TABLE equipment; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment TO service_role;


--
-- Name: SEQUENCE equipment_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.equipment_id_seq TO anon;
GRANT ALL ON SEQUENCE public.equipment_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.equipment_id_seq TO service_role;


--
-- Name: TABLE equipment_type; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment_type TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment_type TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment_type TO service_role;


--
-- Name: SEQUENCE equipment_type_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.equipment_type_id_seq TO anon;
GRANT ALL ON SEQUENCE public.equipment_type_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.equipment_type_id_seq TO service_role;


--
-- Name: SEQUENCE job_no_sequence; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.job_no_sequence TO anon;
GRANT ALL ON SEQUENCE public.job_no_sequence TO authenticated;
GRANT ALL ON SEQUENCE public.job_no_sequence TO service_role;


--
-- Name: TABLE job_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.job_orders TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.job_orders TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.job_orders TO service_role;


--
-- Name: SEQUENCE job_orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.job_orders_id_seq TO anon;
GRANT ALL ON SEQUENCE public.job_orders_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.job_orders_id_seq TO service_role;


--
-- Name: TABLE lifting_equipment; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment TO service_role;


--
-- Name: SEQUENCE lifting_equipment_certificate_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lifting_equipment_certificate_id_seq TO anon;
GRANT ALL ON SEQUENCE public.lifting_equipment_certificate_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.lifting_equipment_certificate_id_seq TO service_role;


--
-- Name: TABLE location; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.location TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.location TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.location TO service_role;


--
-- Name: TABLE manufacturer; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.manufacturer TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.manufacturer TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.manufacturer TO service_role;


--
-- Name: TABLE owner; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.owner TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.owner TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.owner TO service_role;


--
-- Name: TABLE site; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.site TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.site TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.site TO service_role;


--
-- Name: TABLE standard; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.standard TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.standard TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.standard TO service_role;


--
-- Name: TABLE surveyor; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor TO service_role;


--
-- Name: TABLE lifting_equipment_view; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment_view TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment_view TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment_view TO service_role;


--
-- Name: TABLE lifting_gear_multi; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi TO service_role;


--
-- Name: TABLE lifting_gear_multi_equipments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_equipments TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_equipments TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_equipments TO service_role;


--
-- Name: SEQUENCE lifting_gear_multi_equipments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lifting_gear_multi_equipments_id_seq TO anon;
GRANT ALL ON SEQUENCE public.lifting_gear_multi_equipments_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.lifting_gear_multi_equipments_id_seq TO service_role;


--
-- Name: SEQUENCE lifting_gear_multi_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lifting_gear_multi_id_seq TO anon;
GRANT ALL ON SEQUENCE public.lifting_gear_multi_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.lifting_gear_multi_id_seq TO service_role;


--
-- Name: TABLE lifting_gear_multi_view; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_view TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_view TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_view TO service_role;


--
-- Name: TABLE lifting_gear_single; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single TO service_role;


--
-- Name: SEQUENCE lifting_gear_single_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq TO anon;
GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq TO service_role;


--
-- Name: SEQUENCE lifting_gear_single_id_seq1; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq1 TO anon;
GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq1 TO authenticated;
GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq1 TO service_role;


--
-- Name: TABLE lifting_gear_single_view; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single_view TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single_view TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single_view TO service_role;


--
-- Name: SEQUENCE location_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.location_id_seq TO anon;
GRANT ALL ON SEQUENCE public.location_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.location_id_seq TO service_role;


--
-- Name: TABLE major_category; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.major_category TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.major_category TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.major_category TO service_role;


--
-- Name: SEQUENCE major_category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.major_category_id_seq TO anon;
GRANT ALL ON SEQUENCE public.major_category_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.major_category_id_seq TO service_role;


--
-- Name: SEQUENCE manufacturer_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.manufacturer_id_seq TO anon;
GRANT ALL ON SEQUENCE public.manufacturer_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.manufacturer_id_seq TO service_role;


--
-- Name: TABLE minor_category; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.minor_category TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.minor_category TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.minor_category TO service_role;


--
-- Name: SEQUENCE minor_category_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.minor_category_id_seq TO anon;
GRANT ALL ON SEQUENCE public.minor_category_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.minor_category_id_seq TO service_role;


--
-- Name: SEQUENCE owner_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.owner_id_seq TO anon;
GRANT ALL ON SEQUENCE public.owner_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.owner_id_seq TO service_role;


--
-- Name: TABLE property; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property TO service_role;


--
-- Name: SEQUENCE property_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.property_id_seq TO anon;
GRANT ALL ON SEQUENCE public.property_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.property_id_seq TO service_role;


--
-- Name: TABLE property_list; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property_list TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property_list TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property_list TO service_role;


--
-- Name: SEQUENCE property_list_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.property_list_id_seq TO anon;
GRANT ALL ON SEQUENCE public.property_list_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.property_list_id_seq TO service_role;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.roles TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.roles TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.roles TO service_role;


--
-- Name: SEQUENCE roles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.roles_id_seq TO anon;
GRANT ALL ON SEQUENCE public.roles_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.roles_id_seq TO service_role;


--
-- Name: SEQUENCE site_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.site_id_seq TO anon;
GRANT ALL ON SEQUENCE public.site_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.site_id_seq TO service_role;


--
-- Name: SEQUENCE standard_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.standard_id_seq TO anon;
GRANT ALL ON SEQUENCE public.standard_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.standard_id_seq TO service_role;


--
-- Name: TABLE students_credentials; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.students_credentials TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.students_credentials TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.students_credentials TO service_role;


--
-- Name: SEQUENCE students_credentials_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.students_credentials_id_seq TO anon;
GRANT ALL ON SEQUENCE public.students_credentials_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.students_credentials_id_seq TO service_role;


--
-- Name: TABLE surveyor_competency; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor_competency TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor_competency TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor_competency TO service_role;


--
-- Name: SEQUENCE surveyor_competency_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.surveyor_competency_id_seq TO anon;
GRANT ALL ON SEQUENCE public.surveyor_competency_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.surveyor_competency_id_seq TO service_role;


--
-- Name: SEQUENCE surveyor_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.surveyor_id_seq TO anon;
GRANT ALL ON SEQUENCE public.surveyor_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.surveyor_id_seq TO service_role;


--
-- Name: SEQUENCE transaction_certificate_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.transaction_certificate_id_seq TO anon;
GRANT ALL ON SEQUENCE public.transaction_certificate_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.transaction_certificate_id_seq TO service_role;


--
-- Name: TABLE unique_companies; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_companies TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_companies TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_companies TO service_role;


--
-- Name: TABLE unique_courses; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_courses TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_courses TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_courses TO service_role;


--
-- Name: TABLE unique_model_levels; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_model_levels TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_model_levels TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_model_levels TO service_role;


--
-- Name: TABLE "user"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."user" TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."user" TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."user" TO service_role;


--
-- Name: TABLE v_equipment; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.v_equipment TO anon;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.v_equipment TO authenticated;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.v_equipment TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


-- --
-- -- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
-- --

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


-- --
-- -- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
-- --

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

-- \unrestrict 7Hbr2IXgudqCoNflayuNQwTSDRDTaUaythd7RrJ5kMzfhNEfbiWLVRNgWu2MUMA

