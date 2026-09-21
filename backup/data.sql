--
-- PostgreSQL database dump
--

\restrict NuR9h34CCeCn6rJgW0YvBdjvM7gnTMK3f9OwF86bmBstZTcFTtcZAZtdH4FOxda

-- Dumped from database version 17.6
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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE auth.audit_log_entries DISABLE TRIGGER ALL;

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


ALTER TABLE auth.audit_log_entries ENABLE TRIGGER ALL;

--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.custom_oauth_providers DISABLE TRIGGER ALL;

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist) FROM stdin;
\.


ALTER TABLE auth.custom_oauth_providers ENABLE TRIGGER ALL;

--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state DISABLE TRIGGER ALL;

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


ALTER TABLE auth.flow_state ENABLE TRIGGER ALL;

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.users DISABLE TRIGGER ALL;

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	046a1bb0-9e60-4b15-a1ef-20707e3518c1	authenticated	authenticated	demo@hancod.com	$2a$10$EBGHAaojfgkALPAolgck6ujz15n4nc6tG9Q4dGnmM1.MxDkfmOn4C	2026-09-18 09:36:42.840851+00	\N		\N		\N			\N	2026-09-21 04:31:04.780111+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-09-18 09:36:42.814768+00	2026-09-21 04:31:04.807127+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d63235ef-f48f-4f82-93fd-c4c7661471ca	authenticated	authenticated	salim.alharrasi@f1oman.com	$2a$10$36mVxu6kGHnHlBn3QvtSleP6OIihofUuGY2waZG7chknPi1UEzCiG	2026-09-21 04:38:49.798092+00	\N		\N		\N			\N	2026-09-21 04:45:46.446378+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-09-21 04:38:49.782697+00	2026-09-21 04:45:46.45884+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	c266bb40-ade2-4850-9c0a-1035bc8ac96a	authenticated	authenticated	jithu@hancod.com	$2a$10$DRMxcAb/noU1fw7pRdz1iuH3sWglwPkj9Oc9YJ6c7aeBsbV0hZUZi	2026-09-16 12:48:31.566829+00	\N		\N	7e7c83bae5bd810a8ef0cb0521f2d2c70e90a7628e2901dcaa243368	2026-09-16 13:14:21.729555+00			\N	2026-09-21 04:48:57.180545+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-09-16 12:48:31.552289+00	2026-09-21 04:48:57.192693+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


ALTER TABLE auth.users ENABLE TRIGGER ALL;

--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.identities DISABLE TRIGGER ALL;

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
c266bb40-ade2-4850-9c0a-1035bc8ac96a	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{"sub": "c266bb40-ade2-4850-9c0a-1035bc8ac96a", "email": "jithu@hancod.com", "email_verified": false, "phone_verified": false}	email	2026-09-16 12:48:31.561866+00	2026-09-16 12:48:31.561925+00	2026-09-16 12:48:31.561925+00	421af612-4444-4fc6-a1e2-ebc027200d6a
046a1bb0-9e60-4b15-a1ef-20707e3518c1	046a1bb0-9e60-4b15-a1ef-20707e3518c1	{"sub": "046a1bb0-9e60-4b15-a1ef-20707e3518c1", "email": "demo@hancod.com", "email_verified": false, "phone_verified": false}	email	2026-09-18 09:36:42.831882+00	2026-09-18 09:36:42.831948+00	2026-09-18 09:36:42.831948+00	deadda3a-bf2c-4397-878d-33080c064261
d63235ef-f48f-4f82-93fd-c4c7661471ca	d63235ef-f48f-4f82-93fd-c4c7661471ca	{"sub": "d63235ef-f48f-4f82-93fd-c4c7661471ca", "email": "salim.alharrasi@f1oman.com", "email_verified": false, "phone_verified": false}	email	2026-09-21 04:38:49.790918+00	2026-09-21 04:38:49.790962+00	2026-09-21 04:38:49.790962+00	112d68b6-5b80-432c-84dd-d3414f3f40ad
\.


ALTER TABLE auth.identities ENABLE TRIGGER ALL;

--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.instances DISABLE TRIGGER ALL;

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


ALTER TABLE auth.instances ENABLE TRIGGER ALL;

--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.oauth_clients DISABLE TRIGGER ALL;

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


ALTER TABLE auth.oauth_clients ENABLE TRIGGER ALL;

--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions DISABLE TRIGGER ALL;

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
0694cf2d-6c96-4d15-ae79-9477ee1d7e1a	d63235ef-f48f-4f82-93fd-c4c7661471ca	2026-09-21 04:40:08.576743+00	2026-09-21 04:40:08.576743+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	202.164.139.235	\N	\N	\N	\N	\N
e9bb54f3-83f2-4f93-b1d3-68f5e4de96df	d63235ef-f48f-4f82-93fd-c4c7661471ca	2026-09-21 04:45:46.447037+00	2026-09-21 04:45:46.447037+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	103.78.17.222	\N	\N	\N	\N	\N
a9f01214-4b1e-4356-9a73-8f5aa15545ca	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-21 04:48:57.181261+00	2026-09-21 04:48:57.181261+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	45.115.89.95	\N	\N	\N	\N	\N
\.


ALTER TABLE auth.sessions ENABLE TRIGGER ALL;

--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims DISABLE TRIGGER ALL;

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
0694cf2d-6c96-4d15-ae79-9477ee1d7e1a	2026-09-21 04:40:08.593322+00	2026-09-21 04:40:08.593322+00	password	e9a195d4-5539-4074-b21b-070dc122f4ca
e9bb54f3-83f2-4f93-b1d3-68f5e4de96df	2026-09-21 04:45:46.461322+00	2026-09-21 04:45:46.461322+00	password	a2c03a96-5737-497d-a291-7633c92368c1
a9f01214-4b1e-4356-9a73-8f5aa15545ca	2026-09-21 04:48:57.195026+00	2026-09-21 04:48:57.195026+00	password	46706bff-b121-4c89-a0eb-a2f2bbea7864
\.


ALTER TABLE auth.mfa_amr_claims ENABLE TRIGGER ALL;

--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors DISABLE TRIGGER ALL;

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


ALTER TABLE auth.mfa_factors ENABLE TRIGGER ALL;

--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges DISABLE TRIGGER ALL;

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


ALTER TABLE auth.mfa_challenges ENABLE TRIGGER ALL;

--
-- Data for Name: mfa_recovery_code_sets; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_recovery_code_sets DISABLE TRIGGER ALL;

COPY auth.mfa_recovery_code_sets (id, user_id, mfa_factor_id, failed_verification_count, verification_locked_until, created_at, updated_at) FROM stdin;
\.


ALTER TABLE auth.mfa_recovery_code_sets ENABLE TRIGGER ALL;

--
-- Data for Name: mfa_recovery_codes; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_recovery_codes DISABLE TRIGGER ALL;

COPY auth.mfa_recovery_codes (id, mfa_recovery_code_set_id, code_hash, consumed_at, created_at) FROM stdin;
\.


ALTER TABLE auth.mfa_recovery_codes ENABLE TRIGGER ALL;

--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.oauth_authorizations DISABLE TRIGGER ALL;

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


ALTER TABLE auth.oauth_authorizations ENABLE TRIGGER ALL;

--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.oauth_client_states DISABLE TRIGGER ALL;

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


ALTER TABLE auth.oauth_client_states ENABLE TRIGGER ALL;

--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.oauth_consents DISABLE TRIGGER ALL;

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


ALTER TABLE auth.oauth_consents ENABLE TRIGGER ALL;

--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens DISABLE TRIGGER ALL;

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at, expires_at) FROM stdin;
838c07eb-9d20-4e46-b6be-c7bc0bb14004	c266bb40-ade2-4850-9c0a-1035bc8ac96a	recovery_token	7e7c83bae5bd810a8ef0cb0521f2d2c70e90a7628e2901dcaa243368	jithu@hancod.com	2026-09-16 13:14:23.55451	2026-09-16 13:14:23.55451	\N
\.


ALTER TABLE auth.one_time_tokens ENABLE TRIGGER ALL;

--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens DISABLE TRIGGER ALL;

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	32	wxd5uci5z3x4	d63235ef-f48f-4f82-93fd-c4c7661471ca	f	2026-09-21 04:40:08.588919+00	2026-09-21 04:40:08.588919+00	\N	0694cf2d-6c96-4d15-ae79-9477ee1d7e1a
00000000-0000-0000-0000-000000000000	33	jjwgtwf5v3me	d63235ef-f48f-4f82-93fd-c4c7661471ca	f	2026-09-21 04:45:46.45526+00	2026-09-21 04:45:46.45526+00	\N	e9bb54f3-83f2-4f93-b1d3-68f5e4de96df
00000000-0000-0000-0000-000000000000	34	nmvas5qgcn7f	c266bb40-ade2-4850-9c0a-1035bc8ac96a	f	2026-09-21 04:48:57.189899+00	2026-09-21 04:48:57.189899+00	\N	a9f01214-4b1e-4356-9a73-8f5aa15545ca
\.


ALTER TABLE auth.refresh_tokens ENABLE TRIGGER ALL;

--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers DISABLE TRIGGER ALL;

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


ALTER TABLE auth.sso_providers ENABLE TRIGGER ALL;

--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers DISABLE TRIGGER ALL;

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


ALTER TABLE auth.saml_providers ENABLE TRIGGER ALL;

--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states DISABLE TRIGGER ALL;

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


ALTER TABLE auth.saml_relay_states ENABLE TRIGGER ALL;

--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations DISABLE TRIGGER ALL;

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
20260821000000
20260821010000
20260824000000
20260824000001
20260831180000
\.


ALTER TABLE auth.schema_migrations ENABLE TRIGGER ALL;

--
-- Data for Name: scim_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.scim_tokens DISABLE TRIGGER ALL;

COPY auth.scim_tokens (id, sso_provider_id, token_hash, prefix, created_at, expires_at, revoked_at, last_used_at) FROM stdin;
\.


ALTER TABLE auth.scim_tokens ENABLE TRIGGER ALL;

--
-- Data for Name: scim_users; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.scim_users DISABLE TRIGGER ALL;

COPY auth.scim_users (id, sso_provider_id, user_id, resource, created_at, updated_at, deleted_at) FROM stdin;
\.


ALTER TABLE auth.scim_users ENABLE TRIGGER ALL;

--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains DISABLE TRIGGER ALL;

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


ALTER TABLE auth.sso_domains ENABLE TRIGGER ALL;

--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.webauthn_challenges DISABLE TRIGGER ALL;

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


ALTER TABLE auth.webauthn_challenges ENABLE TRIGGER ALL;

--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: -
--

ALTER TABLE auth.webauthn_credentials DISABLE TRIGGER ALL;

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


ALTER TABLE auth.webauthn_credentials ENABLE TRIGGER ALL;

--
-- Data for Name: A; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."A" DISABLE TRIGGER ALL;

COPY public."A" (id, inspection_date) FROM stdin;
\.


ALTER TABLE public."A" ENABLE TRIGGER ALL;

--
-- Data for Name: annexure; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.annexure DISABLE TRIGGER ALL;

COPY public.annexure (id, created_at, annexure, status, property_table_type) FROM stdin;
1	2026-09-16 13:09:18.157238+00	Equipment Nameplate	ACTIVE	CRANE CERTIFICATE
2	2026-09-17 08:01:36.485669+00	Previous Inspection Report	ACTIVE	ELEVATOR CERTIFICATE
\.


ALTER TABLE public.annexure ENABLE TRIGGER ALL;

--
-- Data for Name: area; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.area DISABLE TRIGGER ALL;

COPY public.area (id, created_at, thumbnail, status) FROM stdin;
1	2026-09-17 05:52:24.813144+00	Production Area	ACTIVE
2	2026-09-17 05:52:39.243245+00	Storage Area	ACTIVE
\.


ALTER TABLE public.area ENABLE TRIGGER ALL;

--
-- Data for Name: authority; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.authority DISABLE TRIGGER ALL;

COPY public.authority (id, created_at, authority, designation, status) FROM stdin;
1	2026-09-17 06:13:28.184379+00	Department of Occupational Safety	Chief Safety Inspector	ACTIVE
2	2026-09-17 08:21:33.385027+00	Industrial Safety Directorate	Director of Industrial Safety	ACTIVE
\.


ALTER TABLE public.authority ENABLE TRIGGER ALL;

--
-- Data for Name: equipment_type; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.equipment_type DISABLE TRIGGER ALL;

COPY public.equipment_type (id, created_at, equipment_type, category, status) FROM stdin;
1	2026-09-16 13:04:17.12899+00	Boiler	Pressure Equipment	ACTIVE
2	2026-09-17 05:51:57.583642+00	Compressor	Rotating Equipment	INACTIVE
\.


ALTER TABLE public.equipment_type ENABLE TRIGGER ALL;

--
-- Data for Name: site; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.site DISABLE TRIGGER ALL;

COPY public.site (id, created_at, site, area, status) FROM stdin;
2	2026-09-17 05:54:45.199082+00	Al Noor Industrial Plant	1	ACTIVE
1	2026-09-17 05:53:44.233864+00	Al Noor Industrial Plant	2	ACTIVE
\.


ALTER TABLE public.site ENABLE TRIGGER ALL;

--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.location DISABLE TRIGGER ALL;

COPY public.location (id, created_at, location, site, status) FROM stdin;
3	2026-09-17 06:18:13.750242+00	Boiler House	\N	ACTIVE
5	2026-09-17 06:58:15.768341+00	Pump House	\N	ACTIVE
\.


ALTER TABLE public.location ENABLE TRIGGER ALL;

--
-- Data for Name: major_category; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.major_category DISABLE TRIGGER ALL;

COPY public.major_category (id, created_at, major_category, equipment_type, status) FROM stdin;
1	2026-09-16 13:04:34.818582+00	Pressure Equipment	1	ACTIVE
2	2026-09-17 06:02:10.235757+00	Rotating Equipment	1	ACTIVE
\.


ALTER TABLE public.major_category ENABLE TRIGGER ALL;

--
-- Data for Name: manufacturer; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.manufacturer DISABLE TRIGGER ALL;

COPY public.manufacturer (id, created_at, manufacturer, address, status) FROM stdin;
2	2026-09-17 06:06:32.932535+00	Thermax Limited	D-13, MIDC Industrial Area, R. D. Aga Road, Chinchwad, Pune 411019, Maharashtra, India	ACTIVE
1	2026-09-17 05:45:59.208301+00	Kirloskar	Sveanagar, Dapodi, Pune, Maharashtra 411012, India	ACTIVE
3	2026-09-17 07:53:02.01452+00	Crosby Group	R. D. Aga Road, Chinchwad, apodi, Pune	ACTIVE
4	2026-09-17 08:19:00.661537+00	ABC Crane Systems	\N	ACTIVE
\.


ALTER TABLE public.manufacturer ENABLE TRIGGER ALL;

--
-- Data for Name: standard; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.standard DISABLE TRIGGER ALL;

COPY public.standard (id, created_at, standard, standard_type, remarks, status) FROM stdin;
1	2026-09-17 06:04:51.560247+00	ASME BPVC Section I	International Standard	Requirements for power boilers and related components.	ACTIVE
2	2026-09-17 06:05:25.391571+00	ASME BPVC Section V	International Standard	Requirements for non-destructive examination of boiler components.	ACTIVE
3	2026-09-17 07:53:02.01452+00	ASME BPVC Section IV	International Standard	Requirements for boiler components	ACTIVE
4	2026-09-17 08:19:00.661537+00	IS 807	\N	\N	ACTIVE
\.


ALTER TABLE public.standard ENABLE TRIGGER ALL;

--
-- Data for Name: minor_category; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.minor_category DISABLE TRIGGER ALL;

COPY public.minor_category (id, created_at, minor_category, major_category, standard, status) FROM stdin;
1	2026-09-17 06:15:52.84534+00	Compressor	2	2	ACTIVE
2	2026-09-17 06:16:27.73166+00	Pressure Vessel	1	1	ACTIVE
\.


ALTER TABLE public.minor_category ENABLE TRIGGER ALL;

--
-- Data for Name: owner; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.owner DISABLE TRIGGER ALL;

COPY public.owner (id, created_at, owner, address, code, status, qp_footer, non_qp_footer, client_specification, digital_signature) FROM stdin;
1	2026-09-17 06:09:00.365337+00	Al Noor Manufacturing LLC	Plot 15, Industrial Area, Abu Dhabi, United Arab Emirates	OWN-001	ACTIVE	<p>Quality Plan – Al Noor Manufacturing LLC</p>	<p>Al Noor Manufacturing LLC – Inspection Report</p>	<p>ANM-INS-001 – Equipment Inspection Specification</p>	\N
2	2026-09-17 07:53:02.01452+00	ABC Engineering Services Pvt. Ltd.	118 Rajiv Gandhi Salai, Thoraipakkam, Chennai 600097, Tamil Nadu, India	OWN-002	ACTIVE	<p>sndjs</p>	<p>cdfdcddd</p>	<p>dcd</p>	\N
3	2026-09-17 08:19:00.661537+00	Apex Engineering Pvt. Ltd.	\N	OWN-00452	ACTIVE	\N	\N	\N	\N
\.


ALTER TABLE public.owner ENABLE TRIGGER ALL;

--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.equipment DISABLE TRIGGER ALL;

COPY public.equipment (id, created_at, equipment_id, title, last_through_date, next_through_date, last_test_date, owner_id, model_no, manufacturer, test_certificate_no, location, standard, serial_no, annexure, year_of_manufacture, status, safe_working_load, proof_load, next_test_date, test_insp_frequency, equipment_no, test_insp_frequency_months, description, last_thorough_date, minor_category, next_thorough_date, registration_no, thorough_insp_frequency_months, item_type, property_table_type) FROM stdin;
1	2026-09-17 06:26:01.757657+00	\N	Air Receiver Tank 01	\N	\N	2026-06-15	1	AR-5000	2	TC-2025-001	3	1	ASME BPVC Section VIII	1	2025-06-15	ACTIVE	N/A*	15 bar	2027-06-15	12 Months	EQ-PV-001	\N	Horizontal compressed-air receiver vessel installed for storage and stabilization of compressed air supply.	2026-06-15	2	2031-06-15	PV-ANM-001	60	Lifting Equipment	CRANE CERTIFICATE
2	2026-09-17 07:31:41.423525+00	\N	Steam Boiler 01	\N	\N	2026-03-15	1	THX-B500	2	TC-BOI-2026-001	3	2	THX2026B001	1	2023-02-20	ACTIVE	5000 Kg	6250 Kg	2026-03-15	12 Months	EQ-BOI-001	\N	High-pressure steam boiler installed in the utility section for steam generation and process heating.	2026-02-15	2	Not Applicable	ANM-BOI-001	12 	Lifting Accessories	\N
3	2026-09-17 07:53:02.01452+00	\N	Chain Sling 2T	2026-09-17	2026-09-22	Not Applicable	2	\N	3	TLC-2025-08421	\N	3	CS2T-24-08156	\N	\N	ACTIVE	2,000 kg	2,500 kg	Not Available	\N	EQ-00247	\N	2-leg alloy steel chain sling for lifting machinery and general material handling.	\N	\N	\N	\N	\N	\N	\N
4	2026-09-17 08:19:00.661537+00	\N	Overhead Crane 5T	\N	\N	Not Available	3	EOT-5000	4	COC-2025-08421	\N	4	OHC5T-2021-0178	1	2022	ACTIVE	5000 kg	\N	Not Applicable	\N	EQ-CRN-00247	\N	Electric overhead travelling crane used for material handling in the fabrication workshop.	Not Applicable	\N	Not Applicable	REG-KL-45821	\N	Lifting Equipment	CRANE CERTIFICATE
\.


ALTER TABLE public.equipment ENABLE TRIGGER ALL;

--
-- Data for Name: surveyor; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.surveyor DISABLE TRIGGER ALL;

COPY public.surveyor (id, created_at, surveyor, qualification, code, digital_signature, status) FROM stdin;
1	2026-09-17 06:12:11.787897+00	James Wilson	B.Tech – Mechanical Engineering	SUR-001	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789625529070	ACTIVE
2	2026-09-17 08:19:20.647719+00	Arjun Nair	B.Tech – Mechanical Engineering	SUR-002	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789633158118	ACTIVE
\.


ALTER TABLE public.surveyor ENABLE TRIGGER ALL;

--
-- Data for Name: job_orders; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.job_orders DISABLE TRIGGER ALL;

COPY public.job_orders (id, created_at, client_name, email, contact_number, surveyor, site_contact_person, location, status, job_order_status, job_no, equipment_details) FROM stdin;
1	2026-09-17 06:31:08.913437+00	Gulf Industrial Services LLC	inspection@gulfindustrialservices.com	971503456789	1	Mohammed Ali	3	\N	PENDING	JOB-24-0001	Cooling Water Pump 01 – EQ-PU-001
\.


ALTER TABLE public.job_orders ENABLE TRIGGER ALL;

--
-- Data for Name: lifting_equipment; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.lifting_equipment DISABLE TRIGGER ALL;

COPY public.lifting_equipment (id, created_at, inspection_date, type_of_exam, job_order_no, equipment_no, title, equipment_description, test_cert_coc_no, serial_no, owner_id, model_no, manufacturer, year_of_manufacture, registration_no, standard, owner_name, surveyor, tested_standard, last_test_exam, last_thorough_exam, next_test_exam, next_thorough_exam, description, result, result_description, description_of_test, approval_status, properties, location, safe_working_load, authority, site, annexures, first_examination, six_month_interval, twelve_month_interval, correct_installation, examination_scheme, exceptional_circumstances, safe_to_use, defect_description, test_particulars, certificate_no, version, lift_location, last_test_exam_certificate_no, next_test_exam_certificate_no, next_thorough_exam_certificate_no, last_thorough_exam_certificate_no, updated_at) FROM stdin;
1	2026-09-17 08:19:00.923157+00	2026-09-17	Thorough	1	4	Overhead Crane 5T	Electric overhead travelling crane used for material handling in the fabrication workshop.	COC-2025-08421	OHC5T-2021-0178	3	EOT-5000	4	2022	REG-KL-45821	4	Apex Engineering Pvt. Ltd.	1	\N	Not Available	Not Applicable	Not Applicable	Not Applicable	<p>Equipment inspected for general condition, structural integrity, lifting mechanism, wire rope, hooks, brakes and safety devices. Equipment found in satisfactory condition with no significant defects observed.</p>	SATISFACTORY	Functional test and thorough examination carried out under unloaded and rated-load conditions. Hoisting, lowering, travelling, braking and limit switches were checked and found operational.	<p>Functional and load test carried out at 8 m radius with a test load of 5,000 kg. Hoisting, lowering, boom movement, brakes and safety limit devices were checked and found satisfactory.</p>	false	[{"SWL": "4000kg", "RADIUS": "8 m", "CONDITION": "Satisfactory", "TEST LOAD": "5000kg", "BOOM LENGTH": "12 m"}]	3	5000 kg	1	\N	[{"id": 1, "remarks": "Verified and attached", "property": "Test Certificate", "condition": "PLC-2025-0315", "created_at": "2026-09-16T13:09:18.432252+00:00", "annexure_id": 1, "property_group": "user"}]	f	f	f	f	f	f	f	No defects identified	\N	CRT-26-0004	1	\N		\N	\N		2026-09-17 08:19:00.923157+00
\.


ALTER TABLE public.lifting_equipment ENABLE TRIGGER ALL;

--
-- Data for Name: lifting_gear_multi; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.lifting_gear_multi DISABLE TRIGGER ALL;

COPY public.lifting_gear_multi (id, created_at, inspection_date, site, authority, job_order_no, equipment_no, title, test_cert_coc_no, safe_working_load, last_test_exam, next_test_exam, last_thorough_exam, next_thorough_exam, description, result, area, surveyor, work_order_no, owner_name, owner_address, manufacturer, type_of_exam, location, approval_status, first_examination, six_month_interval, twelve_month_interval, correct_installation, examination_scheme, exceptional_circumstances, safe_to_use, defect_description, equipment_description, proof_load, test_particulars, tested_standard, certificate_no, version, standard, last_test_exam_certificate_no, next_test_exam_certificate_no, next_thorough_exam_certificate_no, last_thorough_exam_certificate_no) FROM stdin;
1	2026-09-17 08:26:22.4671+00	2026-09-17	\N	1	1	3	Chain Sling 2T	TLC-2025-08421	2,000 kg	2026-09-17	Not Available	Not Applicable	Not Applicable	<p>Thorough examination carried out on the lifting gear. Chain links, hooks, identification markings and safety latches were inspected and found in satisfactory condition. No significant wear, deformation or corrosion observed.</p>	Satisfactory	\N	1	\N	2	\N	3	Test	3	true	t	f	t	f	t	f	t	No defects identified	2-leg alloy steel chain sling for lifting machinery and general material handling.	2,500 kg	\N	\N	CRT-26-0005	1	3	PLC-2025-0315	\N	\N	
\.


ALTER TABLE public.lifting_gear_multi ENABLE TRIGGER ALL;

--
-- Data for Name: lifting_gear_multi_equipments; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.lifting_gear_multi_equipments DISABLE TRIGGER ALL;

COPY public.lifting_gear_multi_equipments (id, created_at, equipment_no, title, equipment_description, test_cert_coc_no, safe_working_load, proof_load, last_test_exam, next_test_exam, next_thorough_exam, result, owner_name, surveyor, tested_standard, manufacturer, approval_status, last_thorough_exam, standard, lifting_gear_multi_id, inspection_date, type_of_exam, last_thorough_exam_certificate_no, last_test_exam_certificate_no) FROM stdin;
1	2026-09-17 08:23:20.711593+00	3	Chain Sling 2T	2-leg alloy steel chain sling for lifting machinery and general material handling.	TLC-2025-08421	2,000 kg	2,500 kg	2026-09-16	Not Available	Not Applicable	Satisfactory	ABC Engineering Services Pvt. Ltd.	1	\N	Crosby Group	Approved	Not Applicable	ASME BPVC Section IV	1	2026-09-17	Test	\N	\N
\.


ALTER TABLE public.lifting_gear_multi_equipments ENABLE TRIGGER ALL;

--
-- Data for Name: lifting_gear_single; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.lifting_gear_single DISABLE TRIGGER ALL;

COPY public.lifting_gear_single (id, created_at, inspection_date, site, standard, job_order_no, equipment_no, title, test_cert_coc_no, safe_working_load, last_test_exam, next_test_exam, last_thorough_exam, next_thorough_exam, result, surveyor, defect_description, test_particulars, work_order_no, proof_load, description, equipment_description, manufacturer, tested_standard, first_examination, six_month_interval, twelve_month_interval, correct_installation, examination_scheme, exceptional_circumstances, safe_to_use, approval_status, owner_name, location, type_of_exam, certificate_no, version, authority, last_test_exam_certificate_no, next_test_exam_certificate_no, last_thorough_exam_certificate_no, next_thorough_exam_certificate_no) FROM stdin;
1	2026-09-17 07:46:01.579104+00	2026-09-17	\N	1	1	1	Air Receiver Tank 01	TC-2025-001	N/A*	Not Applicable	Not Available	2026-06-15	Not Applicable	Satisfactory	1	Minor deformation on the lower hook 	\N	\N	15 bar	<p>Equipment inspected and found in satisfactory condition. No visible cracks, deformation, excessive wear, or corrosion observed. Chain links and hooks are in good working condition. Identification markings are clearly visible. Equipment approved for continued use within the specified SWL.</p>	Horizontal compressed-air receiver vessel installed for storage and stabilization of compressed air supply.	2	\N	t	t	f	t	t	f	t	t	1	3	Thorough	CRT-26-0002	1	1		\N	EC-2026-0910	\N
2	2026-09-17 07:53:02.246568+00	2026-09-17	\N	3	1	3	Chain Sling 2T	TLC-2025-08421	2,000 kg	Not Applicable	Not Available	2026-09-17	2026-09-22	Scrap	1	No defects identified	\N	\N	2,500 kg	<p>Equipment inspected and found in satisfactory condition. No visible cracks, deformation, excessive wear, or corrosion observed. Chain links and hooks are in good working condition. Identification markings are clearly visible. Equipment approved for continued use within the specified SWL.</p>	2-leg alloy steel chain sling for lifting machinery and general material handling.	3	\N	t	t	f	f	t	t	\N	t	2	3	Thorough	CRT-26-0003	1	1		\N	EC-2026-0910	\N
\.


ALTER TABLE public.lifting_gear_single ENABLE TRIGGER ALL;

--
-- Data for Name: property; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.property DISABLE TRIGGER ALL;

COPY public.property (id, created_at, property, property_type, status) FROM stdin;
1	2026-09-17 05:49:04.156742+00	Operating Pressure	Equipment	ACTIVE
2	2026-09-17 07:56:52.140393+00	Design Pressure	Equipment	ACTIVE
\.


ALTER TABLE public.property ENABLE TRIGGER ALL;

--
-- Data for Name: property_list; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.property_list DISABLE TRIGGER ALL;

COPY public.property_list (id, created_at, property, property_group, condition, annexure_id) FROM stdin;
1	2026-09-16 13:09:18.432252+00	Test	user	user	1
2	2026-09-17 08:01:36.805498+00	Previous Inspection Report	Inspection Records	Available	2
\.


ALTER TABLE public.property_list ENABLE TRIGGER ALL;

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.roles DISABLE TRIGGER ALL;

COPY public.roles (id, created_at, roles) FROM stdin;
\.


ALTER TABLE public.roles ENABLE TRIGGER ALL;

--
-- Data for Name: students_credentials; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.students_credentials DISABLE TRIGGER ALL;

COPY public.students_credentials (id, created_at, name, email, contact_number, address, gender, company, id_no, card_no, designation, model_level, issued_on, valid_untill, avatar, card_url, certificate_url, added_by, certificate_no, qr_url, card_html, course_duration, approval_status) FROM stdin;
6	2026-09-17 08:41:35.152015+00	Daniel Thomas	daniel.thomas@alnoorinspection.com		Al Noor Inspection Services LLC Office 402, Al Noor Business Centre Mussafah Industrial Area Abu Dhabi, United Arab Emirates	MALE	Al Noor Inspection Services LLC	AL-EMP-00898	QRS-TRA-26-0006	Director of Industrial Safety	Inspector	2026-09-17	2027-09-17	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789634492192_Portrait of a confident young smart looking man _ Premium AI-generated image.jpg	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789634793342	\N	Al Noor Inspection Services LLC	QRS-TRA-26-0006	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789634794169	\N	40	\N
7	2026-09-17 08:46:02.356168+00	Ahmed Rahman	ahmedrahman@alnoor.com	67876567	Al Noor Inspection Services LLC Office 402, Al Noor Business Centre Mussafah Industrial Area Abu Dhabi, United Arab Emirates	MALE	Al Noor Inspection Services LLC	EMP-09575	QRS-TRA-26-0007	Chief Safety Inspector	Inspector	2026-09-17	2027-09-17	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789634759612_AI-Enhanced Professional Portraits for a Powerful LinkedIn Presence.jpg	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789966020308	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789966095739	Al Noor Inspection Services LLC	QRS-TRA-26-0007	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789966021387	\N	26	\N
\.


ALTER TABLE public.students_credentials ENABLE TRIGGER ALL;

--
-- Data for Name: surveyor_competency; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.surveyor_competency DISABLE TRIGGER ALL;

COPY public.surveyor_competency (id, created_at, competency, validity, attachment, surveyor_id) FROM stdin;
1	2026-09-17 06:12:12.01502+00	Pressure Vessel Inspection	31-Dec-2027	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789625523341	1
2	2026-09-17 08:19:20.890281+00	Welding Inspection	31-Dec-2027	https://kwrxajdgwqxnvuyrkndp.supabase.co/storage/v1/object/public/students/filename1789633148085	2
\.


ALTER TABLE public.surveyor_competency ENABLE TRIGGER ALL;

--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public."user" DISABLE TRIGGER ALL;

COPY public."user" (id, created_at, name, email, phone, avatar, role, code) FROM stdin;
bddc742a-672a-4602-bc0a-10eed54b9375	2026-09-16 12:48:54.276288+00	Al Noor Inspection Services LLC	jithu@hancod.com	54475215	user/filename1789628140275	SUPERADMIN	+974
046a1bb0-9e60-4b15-a1ef-20707e3518c1	2026-09-18 09:37:31.593779+00	Demo	demo@hancod.com	9988774455		SUPERADMIN	+91
d63235ef-f48f-4f82-93fd-c4c7661471ca	2026-09-21 04:39:39.788585+00	Salim	salim.alharrasi@f1oman.com	\N		SUPERADMIN	\N
\.


ALTER TABLE public."user" ENABLE TRIGGER ALL;

--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

ALTER TABLE realtime.schema_migrations DISABLE TRIGGER ALL;

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-09-16 11:34:02
20211116045059	2026-09-16 11:34:02
20211116050929	2026-09-16 11:34:02
20211116051442	2026-09-16 11:34:02
20211116212300	2026-09-16 11:34:02
20211116213355	2026-09-16 11:34:02
20211116213934	2026-09-16 11:34:02
20211116214523	2026-09-16 11:34:02
20211122062447	2026-09-16 11:34:02
20211124070109	2026-09-16 11:34:02
20211202204204	2026-09-16 11:34:02
20211202204605	2026-09-16 11:34:02
20211210212804	2026-09-16 11:34:02
20211228014915	2026-09-16 11:34:02
20220107221237	2026-09-16 11:34:02
20220228202821	2026-09-16 11:34:02
20220312004840	2026-09-16 11:34:02
20220603231003	2026-09-16 11:34:02
20220603232444	2026-09-16 11:34:02
20220615214548	2026-09-16 11:34:02
20220712093339	2026-09-16 11:34:02
20220908172859	2026-09-16 11:34:02
20220916233421	2026-09-16 11:34:02
20230119133233	2026-09-16 11:34:02
20230128025114	2026-09-16 11:34:02
20230128025212	2026-09-16 11:34:02
20230227211149	2026-09-16 11:34:02
20230228184745	2026-09-16 11:34:02
20230308225145	2026-09-16 11:34:02
20230328144023	2026-09-16 11:34:02
20231018144023	2026-09-16 11:34:02
20231204144023	2026-09-16 11:34:02
20231204144024	2026-09-16 11:34:02
20231204144025	2026-09-16 11:34:02
20240108234812	2026-09-16 11:34:02
20240109165339	2026-09-16 11:34:02
20240227174441	2026-09-16 11:34:02
20240311171622	2026-09-16 11:34:02
20240321100241	2026-09-16 11:34:02
20240401105812	2026-09-16 11:34:02
20240418121054	2026-09-16 11:34:02
20240523004032	2026-09-16 11:34:02
20240618124746	2026-09-16 11:34:02
20240801235015	2026-09-16 11:34:02
20240805133720	2026-09-16 11:34:02
20240827160934	2026-09-16 11:34:02
20240919163303	2026-09-16 11:34:02
20240919163305	2026-09-16 11:34:02
20241019105805	2026-09-16 11:34:02
20241030150047	2026-09-16 11:34:02
20241108114728	2026-09-16 11:34:02
20241121104152	2026-09-16 11:34:02
20241130184212	2026-09-16 11:34:02
20241220035512	2026-09-16 11:34:02
20241220123912	2026-09-16 11:34:02
20241224161212	2026-09-16 11:34:02
20250107150512	2026-09-16 11:34:02
20250110162412	2026-09-16 11:34:02
20250123174212	2026-09-16 11:34:02
20250128220012	2026-09-16 11:34:02
20250506224012	2026-09-16 11:34:02
20250523164012	2026-09-16 11:34:02
20250714121412	2026-09-16 11:34:02
20250905041441	2026-09-16 11:34:02
20251103001201	2026-09-16 11:34:02
20251120212548	2026-09-16 11:34:02
20251120215549	2026-09-16 11:34:02
20260218120000	2026-09-16 11:34:02
20260326120000	2026-09-16 11:34:02
20260514120000	2026-09-16 11:34:02
20260527120000	2026-09-16 11:34:02
20260528120000	2026-09-16 11:34:02
20260603120000	2026-09-16 11:34:02
20260605120000	2026-09-16 11:34:02
20260606110000	2026-09-16 11:34:02
20260616120000	2026-09-16 11:34:02
20260624120000	2026-09-16 11:34:02
20260626120000	2026-09-16 11:34:02
20260706120000	2026-09-16 11:34:02
20260707120000	2026-09-16 11:34:02
20260709120000	2026-09-16 11:34:02
20260714120000	2026-09-16 11:34:02
20260827120000	2026-09-16 11:34:02
\.


ALTER TABLE realtime.schema_migrations ENABLE TRIGGER ALL;

--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription DISABLE TRIGGER ALL;

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
\.


ALTER TABLE realtime.subscription ENABLE TRIGGER ALL;

--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets DISABLE TRIGGER ALL;

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type, versioning_status) FROM stdin;
students	students	\N	2026-09-16 12:33:38.738874+00	2026-09-16 12:33:38.738874+00	t	f	\N	\N	\N	STANDARD	DISABLED
user	user	\N	2026-09-16 12:33:50.112078+00	2026-09-16 12:33:50.112078+00	t	f	\N	\N	\N	STANDARD	DISABLED
\.


ALTER TABLE storage.buckets ENABLE TRIGGER ALL;

--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics DISABLE TRIGGER ALL;

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


ALTER TABLE storage.buckets_analytics ENABLE TRIGGER ALL;

--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors DISABLE TRIGGER ALL;

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


ALTER TABLE storage.buckets_vectors ENABLE TRIGGER ALL;

--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations DISABLE TRIGGER ALL;

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-09-16 09:52:52.240354
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-09-16 09:52:52.313833
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-09-16 09:52:52.319115
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-09-16 09:52:52.372747
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-09-16 09:52:52.397189
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-09-16 09:52:52.405859
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-09-16 09:52:52.417346
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-09-16 09:52:52.425475
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-09-16 09:52:52.435356
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-09-16 09:52:52.442343
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-09-16 09:52:52.449354
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-09-16 09:52:52.457148
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-09-16 09:52:52.465876
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-09-16 09:52:52.477347
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-09-16 09:52:52.488587
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-09-16 09:52:52.601521
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-09-16 09:52:52.621359
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-09-16 09:52:52.634121
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-09-16 09:52:52.644765
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-09-16 09:52:52.659453
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-09-16 09:52:52.66874
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-09-16 09:52:52.683985
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-09-16 09:52:52.713119
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-09-16 09:52:52.734349
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-09-16 09:52:52.743531
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-09-16 09:52:52.750961
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-09-16 09:52:52.757356
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-09-16 09:52:52.763647
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-09-16 09:52:52.772351
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-09-16 09:52:52.777398
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-09-16 09:52:52.782736
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-09-16 09:52:52.787342
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-09-16 09:52:52.791906
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-09-16 09:52:52.798181
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-09-16 09:52:52.802573
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-09-16 09:52:52.809988
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-09-16 09:52:52.815127
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-09-16 09:52:52.8198
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-09-16 09:52:52.825257
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-09-16 09:52:52.839993
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-09-16 09:52:52.844657
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-09-16 09:52:52.848878
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-09-16 09:52:52.85312
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-09-16 09:52:52.857392
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-09-16 09:52:52.862133
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-09-16 09:52:52.866978
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-09-16 09:52:52.88075
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-09-16 09:52:52.886969
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-09-16 09:52:52.893038
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-09-16 09:52:52.923012
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-09-16 09:52:52.928507
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-09-16 09:52:53.738816
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-09-16 09:52:53.766616
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-09-16 09:52:53.785757
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-09-16 09:52:53.788349
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-09-16 09:52:53.789873
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-09-16 09:52:53.799707
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-09-16 09:52:53.808172
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-09-16 09:52:53.812583
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-09-16 09:52:53.817923
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-09-16 09:52:53.822913
61	mark-filename-immutable	fe0096517ae9d60aaec1d110172ba9036dc66bb7	2026-09-16 09:52:53.828026
62	object-versioning-core	0b855f00ff3be0bfca91efee02a9858912491a9a	2026-09-16 09:52:53.832157
63	fix-search-name-relative-to-prefix	c7485e417624f795ce8bb2da21927f48e088904d	2026-09-16 09:52:53.840657
64	fix-search-by-timestamp-sqli	0af424ecd388a39bb1645184b222185a12149675	2026-09-16 09:52:53.847969
65	objects-key-version-index	603c1c55658e982d35839001e2c2b59a50703904	2026-09-16 09:52:53.871276
66	objects-current-version-index	191466c93aa2c46a00e36505577c5fcab8d7cb4b	2026-09-16 09:52:53.880692
67	objects-null-version-index	15bfe8c35b66642b6c78ba60060fa8793bd2207a	2026-09-16 09:52:53.889171
\.


ALTER TABLE storage.migrations ENABLE TRIGGER ALL;

--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

ALTER TABLE storage.objects DISABLE TRIGGER ALL;

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, archived_at, is_delete_marker, is_versioned) FROM stdin;
ca093ef4-5c9f-4150-bcba-45f6d8398260	user	filename1789619995510	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 04:39:56.740172+00	2026-09-17 04:39:56.740172+00	2026-09-17 04:39:56.740172+00	{"eTag": "\\"2cd41e81ffb3627473a7093ed1810862\\"", "size": 926778, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T04:39:57.000Z", "contentLength": 926778, "httpStatusCode": 200}	b6b2dedd-895c-40ad-94df-e56ae7b94193	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
66bcd36a-6609-4272-9cfd-90a7d5367063	students	filename1789633148085	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 08:19:10.741529+00	2026-09-17 08:19:10.741529+00	2026-09-17 08:19:10.741529+00	{"eTag": "\\"f6ed906330156225792ec5d7795f52a2\\"", "size": 205644, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T08:19:11.000Z", "contentLength": 205644, "httpStatusCode": 200}	5dd2b07e-6b13-4e10-b3e8-6e04e0be5c7c	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
e71b393d-fdc7-4fe7-89f6-2d11d66e1dd4	user	filename1789620003234	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 04:40:03.999127+00	2026-09-17 04:40:03.999127+00	2026-09-17 04:40:03.999127+00	{"eTag": "\\"2cd41e81ffb3627473a7093ed1810862\\"", "size": 926778, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T04:40:04.000Z", "contentLength": 926778, "httpStatusCode": 200}	7122a10a-8c36-40ab-925e-e0186133da13	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
f2656bee-50f1-4e9c-9fde-124d1340abc9	students	filename1789620038934_cf24ba5b-f86b-4fa7-96af-e643ce3a060e.png	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 04:40:39.800556+00	2026-09-17 04:40:39.800556+00	2026-09-17 04:40:39.800556+00	{"eTag": "\\"2cd41e81ffb3627473a7093ed1810862\\"", "size": 926778, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T04:40:40.000Z", "contentLength": 926778, "httpStatusCode": 200}	e545c027-2c66-4773-a6f2-04875e413e6c	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
6ca1c3d3-79a6-4ac3-ac6b-7039c2bf6ed8	students	filename1789633158118	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 08:19:20.447071+00	2026-09-17 08:19:20.447071+00	2026-09-17 08:19:20.447071+00	{"eTag": "\\"3101da8d336180e03623d018c2c12ab9\\"", "size": 89403, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T08:19:21.000Z", "contentLength": 89403, "httpStatusCode": 200}	d058073d-9cd2-493e-a399-711bbb3685b3	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
aeb6bdea-42ce-4874-9e66-dd8f5b7e7312	students	filename1789634793342	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 08:46:35.683643+00	2026-09-17 08:46:35.683643+00	2026-09-17 08:46:35.683643+00	{"eTag": "\\"72f7f3409a1f88f0dff2d0141f851ad6\\"", "size": 115822, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T08:46:36.000Z", "contentLength": 115822, "httpStatusCode": 200}	e5c32d2c-503f-44c7-9dde-f674a00eda47	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
a8f61787-1ed5-4488-b747-318c082f6ef1	students	filename1789620053379	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 04:40:53.741034+00	2026-09-17 04:40:53.741034+00	2026-09-17 04:40:53.741034+00	{"eTag": "\\"04e5a72d3dd11b9478d7ed82fa3b6abb\\"", "size": 7451, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T04:40:54.000Z", "contentLength": 7451, "httpStatusCode": 200}	13070465-9927-4cf2-a9e7-97d8f0ed3589	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
322f3265-f619-436d-a524-37636ea16e7c	user	filename1789623161162	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 05:32:41.938347+00	2026-09-17 05:32:41.938347+00	2026-09-17 05:32:41.938347+00	{"eTag": "\\"a329710e979307d4791fcb29addf143e\\"", "size": 907031, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T05:32:42.000Z", "contentLength": 907031, "httpStatusCode": 200}	1c54493e-3f44-4e54-a0da-95acaac3b8e2	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
73b361e3-7146-4527-873d-6149c3e4e08f	students	filename1789634794169	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 08:46:36.317049+00	2026-09-17 08:46:36.317049+00	2026-09-17 08:46:36.317049+00	{"eTag": "\\"76985707ddd864224d70912c2f40a1cc\\"", "size": 7418, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T08:46:37.000Z", "contentLength": 7418, "httpStatusCode": 200}	ae85ff27-aa4f-4702-a200-d701243e8c51	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
5112e1f5-2215-4623-b8d2-622a5dbf1a0e	user	filename1789623358364	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 05:35:59.187792+00	2026-09-17 05:35:59.187792+00	2026-09-17 05:35:59.187792+00	{"eTag": "\\"a329710e979307d4791fcb29addf143e\\"", "size": 907031, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T05:36:00.000Z", "contentLength": 907031, "httpStatusCode": 200}	a9860343-684b-4316-92a9-6c3ace25adda	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
8694c8e4-cf92-468b-ae29-6b49c6f11c4b	user	filename1789624551229	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 05:55:51.898478+00	2026-09-17 05:55:51.898478+00	2026-09-17 05:55:51.898478+00	{"eTag": "\\"a329710e979307d4791fcb29addf143e\\"", "size": 907031, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T05:55:52.000Z", "contentLength": 907031, "httpStatusCode": 200}	67aacd2f-7735-44e6-9365-bcfbaa09a81a	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
6f7b3a80-5d34-41ed-aa22-4a1bad8d206c	user	filename1789624573840	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 05:56:14.382912+00	2026-09-17 05:56:14.382912+00	2026-09-17 05:56:14.382912+00	{"eTag": "\\"a329710e979307d4791fcb29addf143e\\"", "size": 907031, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T05:56:15.000Z", "contentLength": 907031, "httpStatusCode": 200}	b5b3c65c-ae17-4974-8e87-3ec51abd80d4	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
6705e365-aafe-4860-9faf-bf9ba2d7611b	user	filename1789624833968	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:00:34.652387+00	2026-09-17 06:00:34.652387+00	2026-09-17 06:00:34.652387+00	{"eTag": "\\"a329710e979307d4791fcb29addf143e\\"", "size": 907031, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T06:00:35.000Z", "contentLength": 907031, "httpStatusCode": 200}	810c61f5-ae66-4224-98fb-641f9efdd24b	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
d203e80b-2765-4558-b980-5424e70f399b	students	filename1789625523341	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:12:06.042958+00	2026-09-17 06:12:06.042958+00	2026-09-17 06:12:06.042958+00	{"eTag": "\\"634c410805920574cd9174b41997b25d\\"", "size": 205666, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T06:12:06.000Z", "contentLength": 205666, "httpStatusCode": 200}	50ce374a-5f25-40b6-9b1c-f937d93bbb9f	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
7beea318-2476-4ac3-acfd-cbe1cc5305a2	students	filename1789625529070	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:12:11.618692+00	2026-09-17 06:12:11.618692+00	2026-09-17 06:12:11.618692+00	{"eTag": "\\"d590a00f7176ee253552827d09fcf697\\"", "size": 73383, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T06:12:12.000Z", "contentLength": 73383, "httpStatusCode": 200}	64783155-44bb-4e0d-a417-23810fdcc506	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
c9e1fbdb-b8e7-4d85-9da2-407d9677962a	user	filename1789625985871	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:19:48.526373+00	2026-09-17 06:19:48.526373+00	2026-09-17 06:19:48.526373+00	{"eTag": "\\"3f6b25db073a5a648ba0be880112ca13\\"", "size": 267476, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T06:19:49.000Z", "contentLength": 267476, "httpStatusCode": 200}	a52266dc-4323-452a-9b7f-28aa97d32cc2	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
758d9070-2dfc-43b7-b7ad-2eeea084f040	user	filename1789625990526	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:19:53.194889+00	2026-09-17 06:19:53.194889+00	2026-09-17 06:19:53.194889+00	{"eTag": "\\"3f6b25db073a5a648ba0be880112ca13\\"", "size": 267476, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T06:19:54.000Z", "contentLength": 267476, "httpStatusCode": 200}	13706ce6-4f5f-4e72-b90d-c3e5edbd00e9	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
16c6a863-5aae-47e3-8f6f-523d5eee0549	students	qube-logo.jpg	\N	2026-09-17 06:23:27.054234+00	2026-09-17 06:23:27.054234+00	2026-09-17 06:23:27.054234+00	{"eTag": "\\"5e67b7c4fe1aa5d327ef1bafa5f2476b\\"", "size": 26800, "mimetype": "image/jpeg", "cacheControl": "no-cache", "lastModified": "2026-09-17T06:23:28.000Z", "contentLength": 26800, "httpStatusCode": 200}	aa07ffa5-cd88-4594-8a81-b0861e0ff4a1	\N	{}	\N	f	f
66ab5805-1309-4b17-ad6c-e3d9b95f4cbd	students	han-logo.png	\N	2026-09-17 06:23:27.422238+00	2026-09-17 06:23:27.422238+00	2026-09-17 06:23:27.422238+00	{"eTag": "\\"94397645c16758e9974b5aa0772d6860\\"", "size": 53777, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T06:23:28.000Z", "contentLength": 53777, "httpStatusCode": 200}	6dfb24e7-063e-426c-86c3-34c0cb8f78de	\N	{}	\N	f	f
e3fdaca4-c6fa-408f-94e1-b0fba0dcc77f	students	filename1789627007642_image (28).png	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:36:48.552864+00	2026-09-17 06:36:48.552864+00	2026-09-17 06:36:48.552864+00	{"eTag": "\\"8cda77f000b284f27280be908709a390\\"", "size": 1812025, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T06:36:49.000Z", "contentLength": 1812025, "httpStatusCode": 200}	bded5758-debb-41fa-9923-26aac4b434bf	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
028b1cac-278a-4cb7-acce-f7d87d22924c	students	filename1789627267116_Portrait of a confident young smart looking man _ Premium AI-generated image.jpg	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:41:09.877599+00	2026-09-17 06:41:09.877599+00	2026-09-17 06:41:09.877599+00	{"eTag": "\\"f12f37a580349c171e0cb7ff6f3e8331\\"", "size": 39784, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T06:41:10.000Z", "contentLength": 39784, "httpStatusCode": 200}	40d1654f-d145-4f03-9720-9cc6f59d22c4	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
6d1ea440-48ba-4038-b99d-7caa0ff45bd2	students	filename1789627278363	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:41:21.038909+00	2026-09-17 06:41:21.038909+00	2026-09-17 06:41:21.038909+00	{"eTag": "\\"ce6176a8695eb1078df159f60d17d567\\"", "size": 126813, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T06:41:21.000Z", "contentLength": 126813, "httpStatusCode": 200}	92086828-e38a-44f9-8f22-1354c15ed181	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
bc993f29-ed26-4143-83ad-43290cc7d798	students	filename1789627279181	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:41:21.608418+00	2026-09-17 06:41:21.608418+00	2026-09-17 06:41:21.608418+00	{"eTag": "\\"176d182b058a2fad25b6cd5af36d47fe\\"", "size": 7330, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T06:41:22.000Z", "contentLength": 7330, "httpStatusCode": 200}	757a6b40-ca2b-4d20-bb90-768d86bc8357	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
c3c57395-a72e-42a8-8d87-8eb0215c29cd	students	filename1789620052587	\N	2026-09-17 06:23:27.661046+00	2026-09-17 06:42:10.229026+00	2026-09-17 06:23:27.661046+00	{"eTag": "\\"be254dc707464394bd67df713bc19794\\"", "size": 51010, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T06:42:11.000Z", "contentLength": 51010, "httpStatusCode": 200}	df63c354-ba4b-4c7d-95aa-22b22fc42e1d	\N	{}	\N	f	f
24c92401-a77c-4685-8f76-564e891e3e31	user	filename1789628086058	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:54:46.300745+00	2026-09-17 06:54:46.300745+00	2026-09-17 06:54:46.300745+00	{"eTag": "\\"40168142cc200408891d464df390d0d0\\"", "size": 1548, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T06:54:47.000Z", "contentLength": 1548, "httpStatusCode": 200}	6feb6a93-559a-4f05-90eb-49bd06e7e57c	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
8494d1e0-b6b1-445d-9376-20619526186c	user	filename1789628140275	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 06:55:42.76138+00	2026-09-17 06:55:42.76138+00	2026-09-17 06:55:42.76138+00	{"eTag": "\\"b43c9cd837ec29b497e29d0baf68aa68\\"", "size": 11461, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T06:55:43.000Z", "contentLength": 11461, "httpStatusCode": 200}	b1cb8124-d30b-498f-9e14-99f8e440ae45	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
4dd7dffe-3416-4e46-b76f-6dac9d802fa8	students	filename1789630276331_14faf509-cad8-4493-a550-8fb8916b4324.png	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:31:16.929951+00	2026-09-17 07:31:16.929951+00	2026-09-17 07:31:16.929951+00	{"eTag": "\\"f0c457769a92c66843bf22b6a8f7b763\\"", "size": 933396, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T07:31:17.000Z", "contentLength": 933396, "httpStatusCode": 200}	409160a8-4e45-4c27-875a-199466b1d6de	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
9f4af917-7e18-44b1-a4f4-915762c1f440	students	filename1789630279894	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:31:20.13805+00	2026-09-17 07:31:20.13805+00	2026-09-17 07:31:20.13805+00	{"eTag": "\\"c79be9e721476a93ac912be3124ae4bd\\"", "size": 111668, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T07:31:21.000Z", "contentLength": 111668, "httpStatusCode": 200}	01eef99f-e2f8-45a5-affe-e277965268b9	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
b612cea6-24fd-4d5e-ba07-a2c6a1468d29	students	filename1789634492192_Portrait of a confident young smart looking man _ Premium AI-generated image.jpg	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 08:41:34.933808+00	2026-09-17 08:41:34.933808+00	2026-09-17 08:41:34.933808+00	{"eTag": "\\"f12f37a580349c171e0cb7ff6f3e8331\\"", "size": 39784, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T08:41:35.000Z", "contentLength": 39784, "httpStatusCode": 200}	9c93dc76-9e82-47ab-971b-06eb49075726	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
410333fb-f159-4a0c-a8e4-def612734b66	students	filename1789630280504	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:31:21.339282+00	2026-09-17 07:31:21.339282+00	2026-09-17 07:31:21.339282+00	{"eTag": "\\"17cd9f4aba2f17cd64459e72b70a2a07\\"", "size": 7436, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T07:31:22.000Z", "contentLength": 7436, "httpStatusCode": 200}	9a6bd458-871a-4ca5-9bfb-3e0e81d3b028	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
4152bff5-ed6e-44de-9570-29131770315b	students	filename1789630652142_image (28).png	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:37:33.17397+00	2026-09-17 07:37:33.17397+00	2026-09-17 07:37:33.17397+00	{"eTag": "\\"8cda77f000b284f27280be908709a390\\"", "size": 1812025, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T07:37:34.000Z", "contentLength": 1812025, "httpStatusCode": 200}	4044462d-2b25-4d0a-8192-1b90622b456d	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
1eb9456c-3266-4e2f-ae1e-bf55202b0073	students	filename1789634759612_AI-Enhanced Professional Portraits for a Powerful LinkedIn Presence.jpg	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 08:46:02.116219+00	2026-09-17 08:46:02.116219+00	2026-09-17 08:46:02.116219+00	{"eTag": "\\"ff618b2711c032eb15e77baa4949c49e\\"", "size": 61188, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T08:46:03.000Z", "contentLength": 61188, "httpStatusCode": 200}	fb77d9f6-3f33-478b-895e-18d504930e2e	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
871084a5-450a-4517-82cb-87daf0d10c1d	students	filename1789630655761	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:37:36.017875+00	2026-09-17 07:37:36.017875+00	2026-09-17 07:37:36.017875+00	{"eTag": "\\"2a75df840abf9e9c709a4bd418b825df\\"", "size": 93653, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T07:37:36.000Z", "contentLength": 93653, "httpStatusCode": 200}	be6120d9-d87a-4748-982a-89f4c149a263	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
1a77a8fd-4fac-4fed-8aa9-5bfee18dd640	students	filename1789966020308	d63235ef-f48f-4f82-93fd-c4c7661471ca	2026-09-21 04:47:01.197424+00	2026-09-21 04:47:01.197424+00	2026-09-21 04:47:01.197424+00	{"eTag": "\\"418022106921a1e59a613f9ca72995ae\\"", "size": 241377, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-21T04:47:02.000Z", "contentLength": 241377, "httpStatusCode": 200}	f5d8f913-0c78-428a-9310-c14eeddfe9c7	d63235ef-f48f-4f82-93fd-c4c7661471ca	{}	\N	f	f
fd7c804e-6353-4d4b-b5c2-65c983b7423f	students	filename1789630656332	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:37:36.502651+00	2026-09-17 07:37:36.502651+00	2026-09-17 07:37:36.502651+00	{"eTag": "\\"761eb6c6bd0f35c88792cd2d6d2b3e8c\\"", "size": 7362, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T07:37:37.000Z", "contentLength": 7362, "httpStatusCode": 200}	cd326d8a-dcb3-411f-bb1c-720f8bcf6940	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
c7e257dc-e21b-4656-9339-2bb8b2a093df	students	filename1789630901835_14faf509-cad8-4493-a550-8fb8916b4324.png	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:41:42.68593+00	2026-09-17 07:41:42.68593+00	2026-09-17 07:41:42.68593+00	{"eTag": "\\"f0c457769a92c66843bf22b6a8f7b763\\"", "size": 933396, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T07:41:43.000Z", "contentLength": 933396, "httpStatusCode": 200}	6df88632-60d6-4f3e-bc78-4041e4504a17	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
cb407c29-adb4-439e-b896-979eb8f6cd75	students	filename1789966021387	d63235ef-f48f-4f82-93fd-c4c7661471ca	2026-09-21 04:47:01.689964+00	2026-09-21 04:47:01.689964+00	2026-09-21 04:47:01.689964+00	{"eTag": "\\"0f9dd4c3812c55b3e5f7cf7a6c60704c\\"", "size": 7419, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-21T04:47:02.000Z", "contentLength": 7419, "httpStatusCode": 200}	baabcfc9-7ba0-49db-afee-b15c6405c0f2	d63235ef-f48f-4f82-93fd-c4c7661471ca	{}	\N	f	f
d88d96aa-5f93-4aef-a3a3-40321eb695be	students	filename1789630905092	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:41:45.331162+00	2026-09-17 07:41:45.331162+00	2026-09-17 07:41:45.331162+00	{"eTag": "\\"9586dbb96a4a09b8adc61f1b599aa9a4\\"", "size": 108388, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-17T07:41:46.000Z", "contentLength": 108388, "httpStatusCode": 200}	8c01ea4b-8b5c-4cb7-97b8-dd2cfef4df76	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
91b17453-2b46-4d5a-ad3e-8a8f596961b9	students	filename1789630905657	c266bb40-ade2-4850-9c0a-1035bc8ac96a	2026-09-17 07:41:45.773732+00	2026-09-17 07:41:45.773732+00	2026-09-17 07:41:45.773732+00	{"eTag": "\\"866f5ddee42fb13e90cf615ff7d77c94\\"", "size": 7476, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-09-17T07:41:46.000Z", "contentLength": 7476, "httpStatusCode": 200}	c1c3b0b8-e0bb-47a4-8232-866345d45ac8	c266bb40-ade2-4850-9c0a-1035bc8ac96a	{}	\N	f	f
1b7bbd76-9120-4ea8-89e9-f73a555becd4	students	filename1789966095739	d63235ef-f48f-4f82-93fd-c4c7661471ca	2026-09-21 04:48:16.141622+00	2026-09-21 04:48:16.141622+00	2026-09-21 04:48:16.141622+00	{"eTag": "\\"0b0441ff8ed1933f31c68c0d67ec1239\\"", "size": 88414, "mimetype": "image/png", "cacheControl": "no-cache", "lastModified": "2026-09-21T04:48:17.000Z", "contentLength": 88414, "httpStatusCode": 200}	475186ee-385c-4fce-9c37-cb3f96f71d7a	d63235ef-f48f-4f82-93fd-c4c7661471ca	{}	\N	f	f
\.


ALTER TABLE storage.objects ENABLE TRIGGER ALL;

--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads DISABLE TRIGGER ALL;

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


ALTER TABLE storage.s3_multipart_uploads ENABLE TRIGGER ALL;

--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts DISABLE TRIGGER ALL;

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


ALTER TABLE storage.s3_multipart_uploads_parts ENABLE TRIGGER ALL;

--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes DISABLE TRIGGER ALL;

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


ALTER TABLE storage.vector_indexes ENABLE TRIGGER ALL;

--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

ALTER TABLE supabase_migrations.schema_migrations DISABLE TRIGGER ALL;

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
202508212621	{"--\n-- PostgreSQL database dump\n--\n\n-- \\\\restrict 7Hbr2IXgudqCoNflayuNQwTSDRDTaUaythd7RrJ5kMzfhNEfbiWLVRNgWu2MUMA\n\n-- Dumped from database version 15.8\n-- Dumped by pg_dump version 18.6\n\nSET statement_timeout = 0","SET lock_timeout = 0","SET idle_in_transaction_session_timeout = 0","SET transaction_timeout = 0","SET client_encoding = 'UTF8'","SET standard_conforming_strings = on","SELECT pg_catalog.set_config('search_path', '', false)","SET check_function_bodies = false","SET xmloption = content","SET client_min_messages = warning","SET row_security = off","--\n-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner\n--\n\n-- CREATE SCHEMA public;\n\n\nALTER SCHEMA public OWNER TO pg_database_owner","--\n-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner\n--\n\nCOMMENT ON SCHEMA public IS 'standard public schema'","--\n-- Name: gender; Type: TYPE; Schema: public; Owner: postgres\n--\n\nCREATE TYPE public.gender AS ENUM (\n    'MALE',\n    'FEMALE'\n)","ALTER TYPE public.gender OWNER TO postgres","--\n-- Name: status; Type: TYPE; Schema: public; Owner: postgres\n--\n\nCREATE TYPE public.status AS ENUM (\n    'ACTIVE',\n    'INACTIVE'\n)","ALTER TYPE public.status OWNER TO postgres","--\n-- Name: user_roles; Type: TYPE; Schema: public; Owner: postgres\n--\n\nCREATE TYPE public.user_roles AS ENUM (\n    'SUPERADMIN',\n    'EMPLOYEE'\n)","ALTER TYPE public.user_roles OWNER TO postgres","--\n-- Name: generate_card_and_certificate_no(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.generate_card_and_certificate_no() RETURNS trigger\n    LANGUAGE plpgsql\n    AS $$\nBEGIN\n    -- Get the current year's last two digits\n    DECLARE\n        current_year_suffix TEXT := to_char(CURRENT_DATE, 'YY');\n    BEGIN\n        -- Generate the card_no and certificate_no with the desired format\n        NEW.card_no := 'QRS-TRA-' || current_year_suffix || '-' || LPAD(nextval('certificate_id_seq')::TEXT, 4, '0');\n        NEW.certificate_no := NEW.card_no;\n\n        RETURN NEW;\n    END;\nEND;\n$$","ALTER FUNCTION public.generate_card_and_certificate_no() OWNER TO postgres","--\n-- Name: generate_transaction_no(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.generate_transaction_no() RETURNS text\n    LANGUAGE plpgsql\n    AS $$\nDECLARE\n    current_year_suffix TEXT := to_char(CURRENT_DATE, 'YY');  -- Get last two digits of current year\n    certificate_number TEXT;\nBEGIN\n    -- Ensure the sequence exists or create it (if needed)\n    PERFORM setval('transaction_certificate_id_seq', COALESCE((SELECT last_value FROM transaction_certificate_id_seq), 0));\n\n    -- Generate certificate number: CRT-24-4142\n    certificate_number := 'CRT-' || current_year_suffix || '-' || LPAD(nextval('transaction_certificate_id_seq')::TEXT, 4, '0');\n    \n    -- Return the generated certificate number\n    RETURN certificate_number;\nEND;\n$$","ALTER FUNCTION public.generate_transaction_no() OWNER TO postgres","--\n-- Name: get_location_details(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.get_location_details() RETURNS jsonb\n    LANGUAGE plpgsql\n    AS $$BEGIN\n    RETURN (\n        SELECT json_agg(\n            json_build_object(\n                'location', \n                    CASE \n                        WHEN location.id IS NOT NULL THEN json_build_object(\n                            'id', location.id,\n                            'created_at', location.created_at,\n                            'name', location.location,\n                            'status', location.status\n                        )\n                        ELSE NULL\n                    END,\n                'site', \n                    CASE \n                        WHEN site.id IS NOT NULL THEN json_build_object(\n                            'id', site.id,\n                            'created_at', site.created_at,\n                            'name', site.site,\n                            'status', site.status\n                        )\n                        ELSE NULL\n                    END,\n                'area', \n                    CASE \n                        WHEN area.id IS NOT NULL THEN json_build_object(\n                            'id', area.id,\n                            'name', area.thumbnail,\n                            'status', area.status\n                        )\n                        ELSE NULL\n                    END\n            )\n        ) AS result\n        FROM location\n        LEFT JOIN site ON location.site = site.id\n        LEFT JOIN area ON site.area = area.id\n    );\nEND;$$","ALTER FUNCTION public.get_location_details() OWNER TO postgres","--\n-- Name: get_major_category_details(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.get_major_category_details() RETURNS jsonb\n    LANGUAGE plpgsql\n    AS $$\nBEGIN\n    RETURN (\n        SELECT json_agg(\n            json_build_object(\n                'major_category', json_build_object(\n                    'id', major_category.id,\n                    'created_at', major_category.created_at,\n                    'name', major_category.major_category\n                ),\n                'equipment_type', json_build_object(\n                    'id', equipment_type.id,\n                    'created_at', equipment_type.created_at,\n                    'status', equipment_type.status,\n                    'category', equipment_type.category,\n                    'equipmentType', equipment_type.equipment_type\n                )\n            )\n        )\n        FROM major_category\n        JOIN equipment_type ON major_category.equipment_type = equipment_type.id\n    );\nEND;\n$$","ALTER FUNCTION public.get_major_category_details() OWNER TO postgres","--\n-- Name: get_minor_category_data(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.get_minor_category_data() RETURNS json\n    LANGUAGE plpgsql\n    AS $$\nBEGIN\n    RETURN (\n        SELECT json_agg(\n            json_build_object(\n                'minor_category', json_build_object(\n                    'id', minor_category.id,\n                    'created_at', minor_category.created_at,\n                    'name', minor_category.minor_category,\n                    'status', minor_category.status\n                ),\n                'major_category', json_build_object(\n                    'id', major_category.id,\n                    'created_at', major_category.created_at,\n                    'name', major_category.major_category,\n                    'status', major_category.status\n                ),\n                'standard', json_build_object(\n                    'id', standard.id,\n                    'created_at', standard.created_at,\n                    'name', standard.standard,\n                    'type', standard.standard_type,\n                    'remarks', standard.remarks,\n                    'status', standard.status\n                )\n            )\n        )\n        FROM minor_category\n        JOIN major_category ON minor_category.major_category = major_category.id\n        JOIN standard ON minor_category.standard = standard.id\n    );\nEND;\n$$","ALTER FUNCTION public.get_minor_category_data() OWNER TO postgres","--\n-- Name: manual_data_entry_for_lifting_equipment(text, text, text, text, text, text, text, text, text, text, text, text, text, text, bigint, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text DEFAULT NULL::text, _next_test_date text DEFAULT NULL::text, _last_thorough_date text DEFAULT NULL::text, _next_thorough_date text DEFAULT NULL::text) RETURNS TABLE(equipment_id bigint, manufacturer_id bigint, owner_id bigint, standard_id bigint)\n    LANGUAGE plpgsql\n    AS $$DECLARE\n    new_equipment_id BIGINT;\n    new_manufacturer_id BIGINT;\n    new_owner_id BIGINT;\n    new_standard_id BIGINT;\nBEGIN\n    RAISE LOG '------FUNCTION CALLED FOR MANUAL ENTER LIFTING EQUIPMENT';\n\n    -- Always create fresh rows in each master table\n    INSERT INTO manufacturer (manufacturer) \n    VALUES (_manufacturer_name) \n    RETURNING id INTO new_manufacturer_id;\n    \n    INSERT INTO owner (owner, code)  -- Include code column\n    VALUES (_owner_name, _owner_code) \n    RETURNING id INTO new_owner_id;\n    \n    INSERT INTO standard (standard) \n    VALUES (_standard_code) \n    RETURNING id INTO new_standard_id;\n\n    -- Insert the physical equipment record with all fields\n    INSERT INTO equipment (\n        equipment_no,\n        serial_no,\n        title,\n        description,\n        manufacturer,\n        owner_id,\n        standard,\n        test_certificate_no,\n        safe_working_load,\n        model_no,\n        year_of_manufacture,\n        registration_no,\n        last_test_date,\n        next_test_date,\n        last_thorough_date,\n        next_thorough_date,\n        annexure,\n        property_table_type,\n        item_type,\n        status\n    )\n    VALUES (\n        _equipment_no,\n        _serial_no,\n        _title,\n        _description,\n        new_manufacturer_id,\n        new_owner_id,\n        new_standard_id,\n        _test_certificate_no,\n        _safe_working_load,\n        _model_no,\n        _year_of_manufacture,\n        _registration_no,\n        _last_test_date,\n        _next_test_date,\n        _last_thorough_date,\n        _next_thorough_date,\n        _annexure_id,\n        _property_table_type,\n        'Lifting Equipment',\n        'ACTIVE'\n    )\n    RETURNING id INTO new_equipment_id;\n\n    -- Return the IDs so the client can use them\n    RETURN QUERY\n        SELECT new_equipment_id,\n               new_manufacturer_id,\n               new_owner_id,\n               new_standard_id;\nEND;$$","ALTER FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text) OWNER TO postgres","--\n-- Name: manual_data_entry_from_multi_equipment(text, text, text, text, text, text, text, text, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) RETURNS TABLE(equipment_id bigint, manufacturer_id bigint, owner_id bigint, standard_id bigint)\n    LANGUAGE plpgsql\n    AS $$DECLARE\n    new_equipment_id BIGINT;\n    new_manufacturer_id BIGINT;\n    new_owner_id BIGINT;\n    new_standard_id BIGINT;\nBEGIN\n    RAISE LOG '------FUNCTION CALLED FOR MANUAL ENTER MULTI gear';\n\n    -- Always create fresh rows in each master table\n    INSERT INTO manufacturer (manufacturer) VALUES (_manufacturer_name) RETURNING id INTO new_manufacturer_id;\n    INSERT INTO owner (owner) VALUES (_owner_name) RETURNING id INTO new_owner_id;\n    INSERT INTO standard (standard) VALUES (_standard_code) RETURNING id INTO new_standard_id;\n\n    -- Insert the physical equipment record with all new fields\n    INSERT INTO equipment (\n        equipment_no,\n        serial_no,\n        title,\n        description,\n        manufacturer,\n        owner_id,\n        standard,\n        test_certificate_no,\n        safe_working_load,\n        proof_load,\n        last_test_date,\n        next_test_date,\n        last_through_date,\n        next_through_date\n    )\n    VALUES (\n        _equipment_no,\n        _serial_no,\n        _title,\n        _description,\n        new_manufacturer_id,\n        new_owner_id,\n        new_standard_id,\n        _test_certificate_no,\n        _safe_working_load,\n        _proof_load,\n        _last_test_date,\n        _next_test_date,\n        _last_through_date,\n        _next_through_date\n    )\n    RETURNING id INTO new_equipment_id;\n\n    -- Return the IDs so the client can use them\n    RETURN QUERY\n        SELECT new_equipment_id,\n               new_manufacturer_id,\n               new_owner_id,\n               new_standard_id;\nEND;$$","ALTER FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) OWNER TO postgres","--\n-- Name: manual_data_entry_from_single_equipment(text, text, text, text, text, text, text, text, text, text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) RETURNS TABLE(equipment_id bigint, manufacturer_id bigint, owner_id bigint, standard_id bigint)\n    LANGUAGE plpgsql\n    AS $$\nDECLARE\n    new_equipment_id BIGINT;\n    new_manufacturer_id BIGINT;\n    new_owner_id BIGINT;\n    new_standard_id BIGINT;\nBEGIN\n    RAISE LOG '------FUNCTION CALLED FOR MANUAL ENTER MULTI gear';\n\n    -- Always create fresh rows in each master table\n    INSERT INTO manufacturer (manufacturer) VALUES (_manufacturer_name) RETURNING id INTO new_manufacturer_id;\n    INSERT INTO owner (owner) VALUES (_owner_name) RETURNING id INTO new_owner_id;\n    INSERT INTO standard (standard) VALUES (_standard_code) RETURNING id INTO new_standard_id;\n\n    -- Insert the physical equipment record with all new fields\n    INSERT INTO equipment (\n        equipment_no,\n        serial_no,\n        title,\n        description,\n        manufacturer,\n        owner_id,\n        standard,\n        test_certificate_no,\n        safe_working_load,\n        proof_load,\n        last_test_date,\n        next_test_date,\n        last_through_date,\n        next_through_date\n    )\n    VALUES (\n        _equipment_no,\n        _serial_no,\n        _title,\n        _description,\n        new_manufacturer_id,\n        new_owner_id,\n        new_standard_id,\n        _test_certificate_no,\n        _safe_working_load,\n        _proof_load,\n        _last_test_date,\n        _next_test_date,\n        _last_through_date,\n        _next_through_date\n    )\n    RETURNING id INTO new_equipment_id;\n\n    -- Return the IDs so the client can use them\n    RETURN QUERY\n        SELECT new_equipment_id,\n               new_manufacturer_id,\n               new_owner_id,\n               new_standard_id;\nEND;\n$$","ALTER FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) OWNER TO postgres","--\n-- Name: set_certificate_no_before_insert(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.set_certificate_no_before_insert() RETURNS trigger\n    LANGUAGE plpgsql\n    AS $$\nBEGIN\n    -- Set the certificate_no column to the value generated by the function\n    NEW.certificate_no := generate_transaction_no();\n    RETURN NEW;\nEND;\n$$","ALTER FUNCTION public.set_certificate_no_before_insert() OWNER TO postgres","--\n-- Name: set_job_no(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.set_job_no() RETURNS trigger\n    LANGUAGE plpgsql\n    AS $$\nDECLARE\n  new_seq_val INTEGER;\n  formatted_val TEXT;\nBEGIN\n  -- Get the next value from the sequence\n  new_seq_val := nextval('job_no_sequence');\n  \n  -- Format it as a 4-digit zero-padded number (e.g., 0001, 0002, etc.)\n  formatted_val := lpad(new_seq_val::text, 4, '0');\n  \n  -- Set the job_no field with the prefix and the formatted sequence\n  NEW.job_no := 'JOB-24-' || formatted_val;\n  \n  RETURN NEW;\nEND;\n$$","ALTER FUNCTION public.set_job_no() OWNER TO postgres","--\n-- Name: set_updated_at_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.set_updated_at_timestamp() RETURNS trigger\n    LANGUAGE plpgsql\n    AS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$","ALTER FUNCTION public.set_updated_at_timestamp() OWNER TO postgres","--\n-- Name: update_version(); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.update_version() RETURNS trigger\n    LANGUAGE plpgsql\n    AS $$\nBEGIN\n  NEW.version := OLD.version + 1;\n  RETURN NEW;\nEND;\n$$","ALTER FUNCTION public.update_version() OWNER TO postgres","--\n-- Name: verify_user_password(text); Type: FUNCTION; Schema: public; Owner: postgres\n--\n\nCREATE FUNCTION public.verify_user_password(password text) RETURNS boolean\n    LANGUAGE plpgsql SECURITY DEFINER\n    AS $$\nBEGIN\n  RETURN EXISTS (\n    SELECT 1\n    FROM auth.users\n    WHERE id = auth.uid() AND encrypted_password = crypt(password, encrypted_password)\n  );\nEND;\n$$","ALTER FUNCTION public.verify_user_password(password text) OWNER TO postgres","SET default_tablespace = ''","SET default_table_access_method = heap","--\n-- Name: A; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.\\"A\\" (\n    id bigint NOT NULL,\n    inspection_date text\n)","ALTER TABLE public.\\"A\\" OWNER TO postgres","--\n-- Name: annexure; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.annexure (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    annexure text,\n    status public.status DEFAULT 'ACTIVE'::public.status,\n    property_table_type text\n)","ALTER TABLE public.annexure OWNER TO postgres","--\n-- Name: TABLE annexure; Type: COMMENT; Schema: public; Owner: postgres\n--\n\nCOMMENT ON TABLE public.annexure IS 'annexure'","--\n-- Name: annexure_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.annexure ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.annexure_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: area; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.area (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    thumbnail text,\n    status public.status DEFAULT 'ACTIVE'::public.status NOT NULL\n)","ALTER TABLE public.area OWNER TO postgres","--\n-- Name: area_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.area ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.area_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: authority; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.authority (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    authority text,\n    designation text,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.authority OWNER TO postgres","--\n-- Name: authority_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.authority ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.authority_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: certificate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nCREATE SEQUENCE public.certificate_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1","ALTER SEQUENCE public.certificate_id_seq OWNER TO postgres","--\n-- Name: equipment; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.equipment (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    equipment_id text,\n    title text,\n    last_through_date text,\n    next_through_date text,\n    last_test_date text,\n    owner_id bigint,\n    model_no text,\n    manufacturer bigint,\n    test_certificate_no text,\n    location bigint,\n    standard bigint,\n    serial_no text,\n    annexure bigint,\n    year_of_manufacture text,\n    status public.status DEFAULT 'ACTIVE'::public.status,\n    safe_working_load text,\n    proof_load text,\n    next_test_date text,\n    test_insp_frequency text,\n    equipment_no text,\n    test_insp_frequency_months text,\n    description text,\n    last_thorough_date text,\n    minor_category bigint,\n    next_thorough_date text,\n    registration_no text,\n    thorough_insp_frequency_months text,\n    item_type text,\n    property_table_type text\n)","ALTER TABLE public.equipment OWNER TO postgres","--\n-- Name: equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.equipment ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.equipment_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: equipment_type; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.equipment_type (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    equipment_type text,\n    category text,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.equipment_type OWNER TO postgres","--\n-- Name: equipment_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.equipment_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.equipment_type_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: job_no_sequence; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nCREATE SEQUENCE public.job_no_sequence\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1","ALTER SEQUENCE public.job_no_sequence OWNER TO postgres","--\n-- Name: job_orders; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.job_orders (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    client_name text,\n    email text,\n    contact_number text,\n    surveyor bigint,\n    site_contact_person text,\n    location bigint,\n    status text,\n    job_order_status text,\n    job_no text,\n    equipment_details text\n)","ALTER TABLE public.job_orders OWNER TO postgres","--\n-- Name: job_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.job_orders ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.job_orders_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: lifting_equipment; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.lifting_equipment (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    inspection_date text,\n    type_of_exam text,\n    job_order_no bigint,\n    equipment_no bigint,\n    title text,\n    equipment_description text,\n    test_cert_coc_no text,\n    serial_no text,\n    owner_id bigint,\n    model_no text,\n    manufacturer bigint,\n    year_of_manufacture text,\n    registration_no text,\n    standard bigint,\n    owner_name text,\n    surveyor bigint,\n    tested_standard text,\n    last_test_exam text,\n    last_thorough_exam text,\n    next_test_exam text,\n    next_thorough_exam text,\n    description text,\n    result text,\n    result_description text,\n    description_of_test text,\n    approval_status text,\n    properties jsonb,\n    location bigint,\n    safe_working_load text,\n    authority bigint,\n    site bigint,\n    annexures jsonb,\n    first_examination boolean,\n    six_month_interval boolean,\n    twelve_month_interval boolean,\n    correct_installation boolean,\n    examination_scheme boolean,\n    exceptional_circumstances boolean,\n    safe_to_use boolean,\n    defect_description text,\n    test_particulars text,\n    certificate_no text,\n    version integer DEFAULT 1 NOT NULL,\n    lift_location text,\n    last_test_exam_certificate_no text,\n    next_test_exam_certificate_no text,\n    next_thorough_exam_certificate_no text,\n    last_thorough_exam_certificate_no text,\n    updated_at timestamp with time zone DEFAULT now() NOT NULL\n)","ALTER TABLE public.lifting_equipment OWNER TO postgres","--\n-- Name: lifting_equipment_certificate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.lifting_equipment ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.lifting_equipment_certificate_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: location; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.location (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    location text,\n    site bigint,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.location OWNER TO postgres","--\n-- Name: manufacturer; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.manufacturer (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    manufacturer text,\n    address text,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.manufacturer OWNER TO postgres","--\n-- Name: owner; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.owner (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    owner text,\n    address text,\n    code text,\n    status public.status DEFAULT 'ACTIVE'::public.status,\n    qp_footer text,\n    non_qp_footer text,\n    client_specification text,\n    digital_signature text\n)","ALTER TABLE public.owner OWNER TO postgres","--\n-- Name: site; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.site (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    site text,\n    area bigint,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.site OWNER TO postgres","--\n-- Name: standard; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.standard (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    standard text,\n    standard_type text,\n    remarks text,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.standard OWNER TO postgres","--\n-- Name: surveyor; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.surveyor (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    surveyor text,\n    qualification text,\n    code text,\n    digital_signature text,\n    status text\n)","ALTER TABLE public.surveyor OWNER TO postgres","--\n-- Name: lifting_equipment_view; Type: VIEW; Schema: public; Owner: postgres\n--\n\nCREATE VIEW public.lifting_equipment_view AS\n SELECT le.id,\n    le.created_at,\n    le.inspection_date,\n    le.type_of_exam,\n    le.job_order_no,\n    le.equipment_no,\n    eq.equipment_no AS equipment,\n    le.title,\n    le.equipment_description,\n    le.test_cert_coc_no,\n    le.serial_no,\n    le.owner_id,\n    o.owner,\n    le.model_no,\n    m.manufacturer,\n    le.year_of_manufacture,\n    le.registration_no,\n    s.standard,\n    sur.surveyor,\n    le.tested_standard,\n    le.last_test_exam,\n    le.last_thorough_exam,\n    le.next_test_exam,\n    le.next_thorough_exam,\n    le.description,\n    le.result,\n    le.result_description,\n    le.description_of_test,\n    le.approval_status,\n    le.properties,\n    loc.location,\n    le.safe_working_load,\n    auth.authority,\n    site.site,\n    le.annexures,\n    le.first_examination,\n    le.six_month_interval,\n    le.twelve_month_interval,\n    le.correct_installation,\n    le.examination_scheme,\n    le.exceptional_circumstances,\n    le.safe_to_use,\n    le.defect_description,\n    le.test_particulars,\n    le.certificate_no,\n    le.version,\n    le.lift_location\n   FROM (((((((((public.lifting_equipment le\n     LEFT JOIN public.job_orders jo ON ((le.job_order_no = jo.id)))\n     LEFT JOIN public.equipment eq ON ((le.equipment_no = eq.id)))\n     LEFT JOIN public.owner o ON ((le.owner_id = o.id)))\n     LEFT JOIN public.manufacturer m ON ((le.manufacturer = m.id)))\n     LEFT JOIN public.standard s ON ((le.standard = s.id)))\n     LEFT JOIN public.surveyor sur ON ((le.surveyor = sur.id)))\n     LEFT JOIN public.location loc ON ((le.location = loc.id)))\n     LEFT JOIN public.authority auth ON ((le.authority = auth.id)))\n     LEFT JOIN public.site site ON ((le.site = site.id)))","ALTER VIEW public.lifting_equipment_view OWNER TO postgres","--\n-- Name: lifting_gear_multi; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.lifting_gear_multi (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    inspection_date text,\n    site bigint,\n    authority bigint,\n    job_order_no bigint,\n    equipment_no bigint,\n    title text,\n    test_cert_coc_no text,\n    safe_working_load text,\n    last_test_exam text,\n    next_test_exam text,\n    last_thorough_exam text,\n    next_thorough_exam text,\n    description text,\n    result text DEFAULT 'VERIFIED'::text,\n    area bigint,\n    surveyor bigint,\n    work_order_no text,\n    owner_name bigint,\n    owner_address bigint,\n    manufacturer bigint,\n    type_of_exam text,\n    location bigint,\n    approval_status text,\n    first_examination boolean,\n    six_month_interval boolean,\n    twelve_month_interval boolean,\n    correct_installation boolean,\n    examination_scheme boolean,\n    exceptional_circumstances boolean,\n    safe_to_use boolean,\n    defect_description text,\n    equipment_description text,\n    proof_load text,\n    test_particulars text,\n    tested_standard text,\n    certificate_no text,\n    version integer DEFAULT 1 NOT NULL,\n    standard bigint,\n    last_test_exam_certificate_no text,\n    next_test_exam_certificate_no text,\n    next_thorough_exam_certificate_no text,\n    last_thorough_exam_certificate_no text\n)","ALTER TABLE public.lifting_gear_multi OWNER TO postgres","--\n-- Name: lifting_gear_multi_equipments; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.lifting_gear_multi_equipments (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    equipment_no text,\n    title text,\n    equipment_description text,\n    test_cert_coc_no text,\n    safe_working_load text,\n    proof_load text,\n    last_test_exam text,\n    next_test_exam text,\n    next_thorough_exam text,\n    result text,\n    owner_name text,\n    surveyor text,\n    tested_standard text,\n    manufacturer text,\n    approval_status text,\n    last_thorough_exam text,\n    standard text,\n    lifting_gear_multi_id bigint,\n    inspection_date text,\n    type_of_exam text,\n    last_thorough_exam_certificate_no text,\n    last_test_exam_certificate_no text\n)","ALTER TABLE public.lifting_gear_multi_equipments OWNER TO postgres","--\n-- Name: lifting_gear_multi_equipments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.lifting_gear_multi_equipments ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.lifting_gear_multi_equipments_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: lifting_gear_multi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.lifting_gear_multi ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.lifting_gear_multi_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: lifting_gear_multi_view; Type: VIEW; Schema: public; Owner: postgres\n--\n\nCREATE VIEW public.lifting_gear_multi_view AS\n SELECT lgm.id AS lifting_gear_id,\n    lgm.location,\n    s.id AS site_id,\n    s.site,\n    auth.id AS authority_id,\n    auth.authority,\n    jo.id AS job_order_id,\n    jo.job_no AS job_order_no,\n    lgm.approval_status\n   FROM (((public.lifting_gear_multi lgm\n     LEFT JOIN public.site s ON ((lgm.site = s.id)))\n     LEFT JOIN public.authority auth ON ((lgm.authority = auth.id)))\n     LEFT JOIN public.job_orders jo ON ((lgm.job_order_no = jo.id)))","ALTER VIEW public.lifting_gear_multi_view OWNER TO postgres","--\n-- Name: lifting_gear_single; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.lifting_gear_single (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    inspection_date text,\n    site bigint,\n    standard bigint,\n    job_order_no bigint,\n    equipment_no bigint,\n    title text,\n    test_cert_coc_no text,\n    safe_working_load text,\n    last_test_exam text,\n    next_test_exam text,\n    last_thorough_exam text,\n    next_thorough_exam text,\n    result text,\n    surveyor bigint,\n    defect_description text,\n    test_particulars text,\n    work_order_no text,\n    proof_load text,\n    description text,\n    equipment_description text,\n    manufacturer bigint,\n    tested_standard text,\n    first_examination boolean,\n    six_month_interval boolean,\n    twelve_month_interval boolean,\n    correct_installation boolean,\n    examination_scheme boolean,\n    exceptional_circumstances boolean,\n    safe_to_use boolean,\n    approval_status boolean,\n    owner_name bigint,\n    location bigint,\n    type_of_exam text,\n    certificate_no text,\n    version integer DEFAULT 1 NOT NULL,\n    authority bigint,\n    last_test_exam_certificate_no text,\n    next_test_exam_certificate_no text,\n    last_thorough_exam_certificate_no text,\n    next_thorough_exam_certificate_no text\n)","ALTER TABLE public.lifting_gear_single OWNER TO postgres","--\n-- Name: lifting_gear_single_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.\\"A\\" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.lifting_gear_single_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: lifting_gear_single_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.lifting_gear_single ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.lifting_gear_single_id_seq1\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: lifting_gear_single_view; Type: VIEW; Schema: public; Owner: postgres\n--\n\nCREATE VIEW public.lifting_gear_single_view AS\n SELECT lgs.id,\n    lgs.created_at,\n    lgs.inspection_date,\n    lgs.type_of_exam,\n    s.site AS site_name,\n    auth.authority AS authority_name,\n    st.standard AS standard_name,\n    jo.job_no AS job_order_no,\n    lgs.equipment_no,\n    lgs.title,\n    lgs.test_cert_coc_no,\n    lgs.safe_working_load,\n    lgs.last_test_exam,\n    lgs.next_test_exam,\n    lgs.last_thorough_exam,\n    lgs.next_thorough_exam,\n    lgs.result,\n    sur.surveyor AS surveyor_name,\n    lgs.defect_description,\n    lgs.test_particulars,\n    lgs.work_order_no,\n    lgs.proof_load,\n    lgs.equipment_description,\n    mf.manufacturer AS manufacturer_name,\n    lgs.tested_standard,\n    lgs.first_examination,\n    lgs.six_month_interval,\n    lgs.twelve_month_interval,\n    lgs.correct_installation,\n    lgs.examination_scheme,\n    lgs.exceptional_circumstances,\n    lgs.safe_to_use,\n    lgs.approval_status,\n    lgs.owner_name,\n    o.owner AS owner_full_name,\n    lgs.location,\n    loc.location AS location_name,\n    lgs.certificate_no,\n    lgs.version\n   FROM (((((((((public.lifting_gear_single lgs\n     LEFT JOIN public.site s ON ((lgs.site = s.id)))\n     LEFT JOIN public.authority auth ON ((lgs.authority = auth.id)))\n     LEFT JOIN public.standard st ON ((lgs.standard = st.id)))\n     LEFT JOIN public.job_orders jo ON ((lgs.job_order_no = jo.id)))\n     LEFT JOIN public.equipment eq ON ((lgs.equipment_no = eq.id)))\n     LEFT JOIN public.surveyor sur ON ((lgs.surveyor = sur.id)))\n     LEFT JOIN public.manufacturer mf ON ((lgs.manufacturer = mf.id)))\n     LEFT JOIN public.owner o ON ((lgs.owner_name = o.id)))\n     LEFT JOIN public.location loc ON ((lgs.location = loc.id)))","ALTER VIEW public.lifting_gear_single_view OWNER TO postgres","--\n-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.location ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.location_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: major_category; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.major_category (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    major_category text,\n    equipment_type bigint,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.major_category OWNER TO postgres","--\n-- Name: major_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.major_category ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.major_category_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: manufacturer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.manufacturer ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.manufacturer_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: minor_category; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.minor_category (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    minor_category text,\n    major_category bigint,\n    standard bigint,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.minor_category OWNER TO postgres","--\n-- Name: minor_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.minor_category ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.minor_category_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: owner_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.owner ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.owner_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: property; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.property (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    property text,\n    property_type text,\n    status public.status DEFAULT 'ACTIVE'::public.status\n)","ALTER TABLE public.property OWNER TO postgres","--\n-- Name: property_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.property ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.property_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: property_list; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.property_list (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    property text,\n    property_group text,\n    condition text,\n    annexure_id bigint\n)","ALTER TABLE public.property_list OWNER TO postgres","--\n-- Name: property_list_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.property_list ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.property_list_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: roles; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.roles (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    roles public.user_roles NOT NULL\n)","ALTER TABLE public.roles OWNER TO postgres","--\n-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.roles ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.roles_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: site_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.site ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.site_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: standard_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.standard ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.standard_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: students_credentials; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.students_credentials (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    name text NOT NULL,\n    email text NOT NULL,\n    contact_number text,\n    address text,\n    gender public.gender,\n    company text,\n    id_no text,\n    card_no text,\n    designation text,\n    model_level text,\n    issued_on text,\n    valid_untill text,\n    avatar text,\n    card_url text,\n    certificate_url text,\n    added_by text,\n    certificate_no text,\n    qr_url text,\n    card_html text,\n    course_duration text,\n    approval_status boolean\n)","ALTER TABLE public.students_credentials OWNER TO postgres","--\n-- Name: students_credentials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.students_credentials ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.students_credentials_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: surveyor_competency; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.surveyor_competency (\n    id bigint NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    competency text,\n    validity text,\n    attachment text,\n    surveyor_id bigint\n)","ALTER TABLE public.surveyor_competency OWNER TO postgres","--\n-- Name: surveyor_competency_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.surveyor_competency ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.surveyor_competency_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: surveyor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.surveyor ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (\n    SEQUENCE NAME public.surveyor_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1\n)","--\n-- Name: transaction_certificate_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres\n--\n\nCREATE SEQUENCE public.transaction_certificate_id_seq\n    START WITH 1\n    INCREMENT BY 1\n    NO MINVALUE\n    NO MAXVALUE\n    CACHE 1","ALTER SEQUENCE public.transaction_certificate_id_seq OWNER TO postgres","--\n-- Name: unique_companies; Type: VIEW; Schema: public; Owner: postgres\n--\n\nCREATE VIEW public.unique_companies AS\n SELECT DISTINCT students_credentials.company\n   FROM public.students_credentials\n  WHERE (students_credentials.company IS NOT NULL)","ALTER VIEW public.unique_companies OWNER TO postgres","--\n-- Name: unique_courses; Type: VIEW; Schema: public; Owner: postgres\n--\n\nCREATE VIEW public.unique_courses AS\n SELECT DISTINCT students_credentials.designation\n   FROM public.students_credentials\n  WHERE (students_credentials.designation IS NOT NULL)","ALTER VIEW public.unique_courses OWNER TO postgres","--\n-- Name: unique_model_levels; Type: VIEW; Schema: public; Owner: postgres\n--\n\nCREATE VIEW public.unique_model_levels AS\n SELECT DISTINCT students_credentials.model_level\n   FROM public.students_credentials\n  WHERE (students_credentials.model_level IS NOT NULL)","ALTER VIEW public.unique_model_levels OWNER TO postgres","--\n-- Name: user; Type: TABLE; Schema: public; Owner: postgres\n--\n\nCREATE TABLE public.\\"user\\" (\n    id uuid DEFAULT gen_random_uuid() NOT NULL,\n    created_at timestamp with time zone DEFAULT now() NOT NULL,\n    name text DEFAULT ''::text,\n    email text DEFAULT ''::text NOT NULL,\n    phone bigint,\n    avatar text DEFAULT ''::text,\n    role public.user_roles DEFAULT 'SUPERADMIN'::public.user_roles NOT NULL,\n    code text\n)","ALTER TABLE public.\\"user\\" OWNER TO postgres","--\n-- Name: v_equipment; Type: VIEW; Schema: public; Owner: postgres\n--\n\nCREATE VIEW public.v_equipment AS\n SELECT e.id,\n    e.created_at,\n    e.equipment_id,\n    e.title,\n    e.last_through_date,\n    e.next_through_date,\n    e.last_test_date,\n    o.owner AS owner_name,\n    e.model_no,\n    m.manufacturer,\n    e.test_certificate_no,\n    l.location,\n    s.standard,\n    e.serial_no,\n    e.annexure,\n    e.year_of_manufacture,\n    e.status,\n    e.safe_working_load,\n    e.proof_load,\n    e.next_test_date,\n    e.test_insp_frequency,\n    e.equipment_no,\n    e.description,\n    e.last_thorough_date,\n    mc.minor_category,\n    e.next_thorough_date,\n    e.registration_no,\n    e.thorough_insp_frequency_months,\n    e.item_type,\n    e.property_table_type\n   FROM (((((public.equipment e\n     LEFT JOIN public.owner o ON ((e.owner_id = o.id)))\n     LEFT JOIN public.manufacturer m ON ((e.manufacturer = m.id)))\n     LEFT JOIN public.location l ON ((e.location = l.id)))\n     LEFT JOIN public.standard s ON ((e.standard = s.id)))\n     LEFT JOIN public.minor_category mc ON ((e.minor_category = mc.id)))","ALTER VIEW public.v_equipment OWNER TO postgres","--\n-- Name: annexure annexure_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.annexure\n    ADD CONSTRAINT annexure_pkey PRIMARY KEY (id)","--\n-- Name: area area_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.area\n    ADD CONSTRAINT area_pkey PRIMARY KEY (id)","--\n-- Name: authority authority_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.authority\n    ADD CONSTRAINT authority_pkey PRIMARY KEY (id)","--\n-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.equipment\n    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id)","--\n-- Name: equipment_type equipment_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.equipment_type\n    ADD CONSTRAINT equipment_type_pkey PRIMARY KEY (id)","--\n-- Name: job_orders job_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.job_orders\n    ADD CONSTRAINT job_orders_pkey PRIMARY KEY (id)","--\n-- Name: lifting_equipment lifting_equipment_certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_certificate_pkey PRIMARY KEY (id)","--\n-- Name: lifting_gear_multi_equipments lifting_gear_multi_equipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi_equipments\n    ADD CONSTRAINT lifting_gear_multi_equipments_pkey PRIMARY KEY (id)","--\n-- Name: lifting_gear_multi lifting_gear_multi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_pkey PRIMARY KEY (id)","--\n-- Name: A lifting_gear_single_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.\\"A\\"\n    ADD CONSTRAINT lifting_gear_single_pkey PRIMARY KEY (id)","--\n-- Name: lifting_gear_single lifting_gear_single_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_pkey1 PRIMARY KEY (id)","--\n-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.location\n    ADD CONSTRAINT location_pkey PRIMARY KEY (id)","--\n-- Name: major_category major_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.major_category\n    ADD CONSTRAINT major_category_pkey PRIMARY KEY (id)","--\n-- Name: manufacturer manufacturer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.manufacturer\n    ADD CONSTRAINT manufacturer_pkey PRIMARY KEY (id)","--\n-- Name: minor_category minor_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.minor_category\n    ADD CONSTRAINT minor_category_pkey PRIMARY KEY (id)","--\n-- Name: owner owner_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.owner\n    ADD CONSTRAINT owner_pkey PRIMARY KEY (id)","--\n-- Name: property_list property_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.property_list\n    ADD CONSTRAINT property_list_pkey PRIMARY KEY (id)","--\n-- Name: property property_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.property\n    ADD CONSTRAINT property_pkey PRIMARY KEY (id)","--\n-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.roles\n    ADD CONSTRAINT roles_pkey PRIMARY KEY (id)","--\n-- Name: site site_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.site\n    ADD CONSTRAINT site_pkey PRIMARY KEY (id)","--\n-- Name: standard standard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.standard\n    ADD CONSTRAINT standard_pkey PRIMARY KEY (id)","--\n-- Name: students_credentials students_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.students_credentials\n    ADD CONSTRAINT students_credentials_pkey PRIMARY KEY (id)","--\n-- Name: surveyor_competency surveyor_competency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.surveyor_competency\n    ADD CONSTRAINT surveyor_competency_pkey PRIMARY KEY (id)","--\n-- Name: surveyor surveyor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.surveyor\n    ADD CONSTRAINT surveyor_pkey PRIMARY KEY (id)","--\n-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.\\"user\\"\n    ADD CONSTRAINT user_pkey PRIMARY KEY (id)","--\n-- Name: lifting_equipment before_insert_lifting_equipment; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER before_insert_lifting_equipment BEFORE INSERT ON public.lifting_equipment FOR EACH ROW EXECUTE FUNCTION public.set_certificate_no_before_insert()","--\n-- Name: lifting_gear_multi before_insert_lifting_gear_multi; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER before_insert_lifting_gear_multi BEFORE INSERT ON public.lifting_gear_multi FOR EACH ROW EXECUTE FUNCTION public.set_certificate_no_before_insert()","--\n-- Name: lifting_gear_single before_insert_lifting_gear_single; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER before_insert_lifting_gear_single BEFORE INSERT ON public.lifting_gear_single FOR EACH ROW EXECUTE FUNCTION public.set_certificate_no_before_insert()","--\n-- Name: job_orders job_no_trigger; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER job_no_trigger BEFORE INSERT ON public.job_orders FOR EACH ROW EXECUTE FUNCTION public.set_job_no()","--\n-- Name: students_credentials set_custom_card_and_certificate_no; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER set_custom_card_and_certificate_no BEFORE INSERT ON public.students_credentials FOR EACH ROW EXECUTE FUNCTION public.generate_card_and_certificate_no()","--\n-- Name: lifting_equipment trigger_set_updated_at; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.lifting_equipment FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp()","--\n-- Name: lifting_equipment trigger_update_version; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER trigger_update_version BEFORE UPDATE ON public.lifting_equipment FOR EACH ROW EXECUTE FUNCTION public.update_version()","--\n-- Name: lifting_gear_multi trigger_update_version; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER trigger_update_version BEFORE UPDATE ON public.lifting_gear_multi FOR EACH ROW EXECUTE FUNCTION public.update_version()","--\n-- Name: lifting_gear_single trigger_update_version; Type: TRIGGER; Schema: public; Owner: postgres\n--\n\nCREATE TRIGGER trigger_update_version BEFORE UPDATE ON public.lifting_gear_single FOR EACH ROW EXECUTE FUNCTION public.update_version()","--\n-- Name: equipment equipment_annexure_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.equipment\n    ADD CONSTRAINT equipment_annexure_fkey FOREIGN KEY (annexure) REFERENCES public.annexure(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: equipment equipment_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.equipment\n    ADD CONSTRAINT equipment_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: equipment equipment_manufacturer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.equipment\n    ADD CONSTRAINT equipment_manufacturer_fkey FOREIGN KEY (manufacturer) REFERENCES public.manufacturer(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: equipment equipment_minor_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.equipment\n    ADD CONSTRAINT equipment_minor_category_fkey FOREIGN KEY (minor_category) REFERENCES public.minor_category(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: equipment equipment_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.equipment\n    ADD CONSTRAINT equipment_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owner(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: equipment equipment_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.equipment\n    ADD CONSTRAINT equipment_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: job_orders job_orders_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.job_orders\n    ADD CONSTRAINT job_orders_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: job_orders job_orders_surveyor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.job_orders\n    ADD CONSTRAINT job_orders_surveyor_fkey FOREIGN KEY (surveyor) REFERENCES public.surveyor(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_authority_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_authority_fkey FOREIGN KEY (authority) REFERENCES public.authority(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_equipment_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_equipment_no_fkey FOREIGN KEY (equipment_no) REFERENCES public.equipment(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_job_order_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_job_order_no_fkey FOREIGN KEY (job_order_no) REFERENCES public.job_orders(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_manufacturer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_manufacturer_fkey FOREIGN KEY (manufacturer) REFERENCES public.manufacturer(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owner(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_site_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_site_fkey FOREIGN KEY (site) REFERENCES public.site(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_equipment lifting_equipment_surveyor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_equipment\n    ADD CONSTRAINT lifting_equipment_surveyor_fkey FOREIGN KEY (surveyor) REFERENCES public.surveyor(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_area_fkey FOREIGN KEY (area) REFERENCES public.area(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_authority_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_authority_fkey FOREIGN KEY (authority) REFERENCES public.authority(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_equipment_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_equipment_no_fkey FOREIGN KEY (equipment_no) REFERENCES public.equipment(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi_equipments lifting_gear_multi_equipments_lifting_gear_multi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi_equipments\n    ADD CONSTRAINT lifting_gear_multi_equipments_lifting_gear_multi_id_fkey FOREIGN KEY (lifting_gear_multi_id) REFERENCES public.lifting_gear_multi(id) ON DELETE CASCADE","--\n-- Name: lifting_gear_multi lifting_gear_multi_job_order_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_job_order_no_fkey FOREIGN KEY (job_order_no) REFERENCES public.job_orders(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_manufacturer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_manufacturer_fkey FOREIGN KEY (manufacturer) REFERENCES public.manufacturer(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_owner_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_owner_address_fkey FOREIGN KEY (owner_address) REFERENCES public.owner(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_owner_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_owner_name_fkey FOREIGN KEY (owner_name) REFERENCES public.owner(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_site_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_site_fkey FOREIGN KEY (site) REFERENCES public.site(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_multi lifting_gear_multi_surveyor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_multi\n    ADD CONSTRAINT lifting_gear_multi_surveyor_fkey FOREIGN KEY (surveyor) REFERENCES public.surveyor(id) ON UPDATE CASCADE ON DELETE RESTRICT","--\n-- Name: lifting_gear_single lifting_gear_single_authority_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_authority_fkey FOREIGN KEY (authority) REFERENCES public.authority(id) ON DELETE SET NULL","--\n-- Name: lifting_gear_single lifting_gear_single_equipment_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_equipment_no_fkey FOREIGN KEY (equipment_no) REFERENCES public.equipment(id) ON DELETE SET NULL","--\n-- Name: lifting_gear_single lifting_gear_single_job_order_no_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_job_order_no_fkey FOREIGN KEY (job_order_no) REFERENCES public.job_orders(id) ON DELETE SET NULL","--\n-- Name: lifting_gear_single lifting_gear_single_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_location_fkey FOREIGN KEY (location) REFERENCES public.location(id) ON DELETE SET NULL","--\n-- Name: lifting_gear_single lifting_gear_single_manufacturer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_manufacturer_fkey FOREIGN KEY (manufacturer) REFERENCES public.manufacturer(id)","--\n-- Name: lifting_gear_single lifting_gear_single_owner_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_owner_name_fkey FOREIGN KEY (owner_name) REFERENCES public.owner(id)","--\n-- Name: lifting_gear_single lifting_gear_single_site_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_site_fkey FOREIGN KEY (site) REFERENCES public.site(id)","--\n-- Name: lifting_gear_single lifting_gear_single_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id)","--\n-- Name: lifting_gear_single lifting_gear_single_surveyor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.lifting_gear_single\n    ADD CONSTRAINT lifting_gear_single_surveyor_fkey FOREIGN KEY (surveyor) REFERENCES public.surveyor(id)","--\n-- Name: location location_site_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.location\n    ADD CONSTRAINT location_site_fkey FOREIGN KEY (site) REFERENCES public.site(id) ON DELETE SET NULL","--\n-- Name: major_category major_category_equipment_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.major_category\n    ADD CONSTRAINT major_category_equipment_type_fkey FOREIGN KEY (equipment_type) REFERENCES public.equipment_type(id) ON DELETE SET NULL","--\n-- Name: minor_category minor_category_major_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.minor_category\n    ADD CONSTRAINT minor_category_major_category_fkey FOREIGN KEY (major_category) REFERENCES public.major_category(id) ON DELETE SET NULL","--\n-- Name: minor_category minor_category_standard_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.minor_category\n    ADD CONSTRAINT minor_category_standard_fkey FOREIGN KEY (standard) REFERENCES public.standard(id) ON DELETE SET NULL","--\n-- Name: property_list property_list_annexure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.property_list\n    ADD CONSTRAINT property_list_annexure_id_fkey FOREIGN KEY (annexure_id) REFERENCES public.annexure(id) ON DELETE SET NULL","--\n-- Name: site site_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.site\n    ADD CONSTRAINT site_area_fkey FOREIGN KEY (area) REFERENCES public.area(id) ON DELETE SET NULL","--\n-- Name: surveyor_competency surveyor_competency_surveyor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres\n--\n\nALTER TABLE ONLY public.surveyor_competency\n    ADD CONSTRAINT surveyor_competency_surveyor_id_fkey FOREIGN KEY (surveyor_id) REFERENCES public.surveyor(id) ON DELETE SET NULL","--\n-- Name: A; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.\\"A\\" ENABLE ROW LEVEL SECURITY","--\n-- Name: area all operations policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY \\"all operations policy\\" ON public.area TO authenticated USING (true)","--\n-- Name: annexure; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.annexure ENABLE ROW LEVEL SECURITY","--\n-- Name: annexure annexure_table_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY annexure_table_policy ON public.annexure TO authenticated USING (true)","--\n-- Name: area; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.area ENABLE ROW LEVEL SECURITY","--\n-- Name: authority; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.authority ENABLE ROW LEVEL SECURITY","--\n-- Name: authority authority_table_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY authority_table_policy ON public.authority TO authenticated USING (true)","--\n-- Name: equipment; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY","--\n-- Name: equipment equipment; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY equipment ON public.equipment TO authenticated USING (true)","--\n-- Name: equipment_type; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.equipment_type ENABLE ROW LEVEL SECURITY","--\n-- Name: equipment_type equipment_type_table_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY equipment_type_table_policy ON public.equipment_type TO authenticated USING (true)","--\n-- Name: job_orders job_order_policy_all; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY job_order_policy_all ON public.job_orders TO authenticated USING (true)","--\n-- Name: job_orders; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.job_orders ENABLE ROW LEVEL SECURITY","--\n-- Name: lifting_equipment; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.lifting_equipment ENABLE ROW LEVEL SECURITY","--\n-- Name: lifting_gear_single lifting_g; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY lifting_g ON public.lifting_gear_single TO authenticated USING (true)","--\n-- Name: lifting_gear_multi; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.lifting_gear_multi ENABLE ROW LEVEL SECURITY","--\n-- Name: lifting_gear_multi lifting_gear_multi_all_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY lifting_gear_multi_all_policy ON public.lifting_gear_multi TO authenticated USING (true)","--\n-- Name: lifting_gear_multi_equipments lifting_gear_multi_all_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY lifting_gear_multi_all_policy ON public.lifting_gear_multi_equipments TO authenticated USING (true)","--\n-- Name: lifting_gear_multi_equipments; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.lifting_gear_multi_equipments ENABLE ROW LEVEL SECURITY","--\n-- Name: lifting_gear_single; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.lifting_gear_single ENABLE ROW LEVEL SECURITY","--\n-- Name: location; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.location ENABLE ROW LEVEL SECURITY","--\n-- Name: location location_table_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY location_table_policy ON public.location TO authenticated USING (true)","--\n-- Name: major_category; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.major_category ENABLE ROW LEVEL SECURITY","--\n-- Name: major_category major_category; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY major_category ON public.major_category TO authenticated USING (true)","--\n-- Name: manufacturer; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.manufacturer ENABLE ROW LEVEL SECURITY","--\n-- Name: manufacturer manufacturer_table_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY manufacturer_table_policy ON public.manufacturer TO authenticated USING (true)","--\n-- Name: minor_category; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.minor_category ENABLE ROW LEVEL SECURITY","--\n-- Name: minor_category minor_category_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY minor_category_policy ON public.minor_category TO authenticated USING (true)","--\n-- Name: owner; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.owner ENABLE ROW LEVEL SECURITY","--\n-- Name: owner owner; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY owner ON public.owner TO authenticated USING (true)","--\n-- Name: lifting_equipment policy_all_lifting_equipment_certificate; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY policy_all_lifting_equipment_certificate ON public.lifting_equipment TO authenticated USING (true)","--\n-- Name: surveyor_competency policy_all_surveor_compenency; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY policy_all_surveor_compenency ON public.surveyor_competency USING (true)","--\n-- Name: property; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.property ENABLE ROW LEVEL SECURITY","--\n-- Name: property_list; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.property_list ENABLE ROW LEVEL SECURITY","--\n-- Name: property_list property_list_table_all_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY property_list_table_all_policy ON public.property_list TO authenticated USING (true)","--\n-- Name: property property_policy_all; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY property_policy_all ON public.property TO authenticated USING (true)","--\n-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.roles ENABLE ROW LEVEL SECURITY","--\n-- Name: roles roles; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY roles ON public.roles TO authenticated USING (true)","--\n-- Name: site; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.site ENABLE ROW LEVEL SECURITY","--\n-- Name: site site_table_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY site_table_policy ON public.site TO authenticated USING (true)","--\n-- Name: standard; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.standard ENABLE ROW LEVEL SECURITY","--\n-- Name: standard standard_table_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY standard_table_policy ON public.standard TO authenticated USING (true)","--\n-- Name: students_credentials; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.students_credentials ENABLE ROW LEVEL SECURITY","--\n-- Name: students_credentials students_credentials_all_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY students_credentials_all_policy ON public.students_credentials TO authenticated USING (true)","--\n-- Name: surveyor; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.surveyor ENABLE ROW LEVEL SECURITY","--\n-- Name: surveyor_competency; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.surveyor_competency ENABLE ROW LEVEL SECURITY","--\n-- Name: surveyor surveyor_table_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY surveyor_table_policy ON public.surveyor TO authenticated USING (true)","--\n-- Name: user; Type: ROW SECURITY; Schema: public; Owner: postgres\n--\n\nALTER TABLE public.\\"user\\" ENABLE ROW LEVEL SECURITY","--\n-- Name: user user_create_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY user_create_policy ON public.\\"user\\" FOR INSERT TO authenticated WITH CHECK (true)","--\n-- Name: user user_delete_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY user_delete_policy ON public.\\"user\\" FOR DELETE TO authenticated USING (true)","--\n-- Name: user user_read_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY user_read_policy ON public.\\"user\\" FOR SELECT TO authenticated, anon USING (true)","--\n-- Name: user user_update_policy; Type: POLICY; Schema: public; Owner: postgres\n--\n\nCREATE POLICY user_update_policy ON public.\\"user\\" FOR UPDATE TO authenticated USING (true)","--\n-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner\n--\n\nGRANT USAGE ON SCHEMA public TO postgres","GRANT USAGE ON SCHEMA public TO anon","GRANT USAGE ON SCHEMA public TO authenticated","GRANT USAGE ON SCHEMA public TO service_role","--\n-- Name: FUNCTION generate_card_and_certificate_no(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.generate_card_and_certificate_no() TO anon","GRANT ALL ON FUNCTION public.generate_card_and_certificate_no() TO authenticated","GRANT ALL ON FUNCTION public.generate_card_and_certificate_no() TO service_role","--\n-- Name: FUNCTION generate_transaction_no(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.generate_transaction_no() TO anon","GRANT ALL ON FUNCTION public.generate_transaction_no() TO authenticated","GRANT ALL ON FUNCTION public.generate_transaction_no() TO service_role","--\n-- Name: FUNCTION get_location_details(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.get_location_details() TO anon","GRANT ALL ON FUNCTION public.get_location_details() TO authenticated","GRANT ALL ON FUNCTION public.get_location_details() TO service_role","--\n-- Name: FUNCTION get_major_category_details(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.get_major_category_details() TO anon","GRANT ALL ON FUNCTION public.get_major_category_details() TO authenticated","GRANT ALL ON FUNCTION public.get_major_category_details() TO service_role","--\n-- Name: FUNCTION get_minor_category_data(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.get_minor_category_data() TO anon","GRANT ALL ON FUNCTION public.get_minor_category_data() TO authenticated","GRANT ALL ON FUNCTION public.get_minor_category_data() TO service_role","--\n-- Name: FUNCTION manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text) TO anon","GRANT ALL ON FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text) TO authenticated","GRANT ALL ON FUNCTION public.manual_data_entry_for_lifting_equipment(_manufacturer_name text, _owner_name text, _owner_code text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _model_no text, _year_of_manufacture text, _registration_no text, _property_table_type text, _annexure_id bigint, _last_test_date text, _next_test_date text, _last_thorough_date text, _next_thorough_date text) TO service_role","--\n-- Name: FUNCTION manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO anon","GRANT ALL ON FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO authenticated","GRANT ALL ON FUNCTION public.manual_data_entry_from_multi_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO service_role","--\n-- Name: FUNCTION manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO anon","GRANT ALL ON FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO authenticated","GRANT ALL ON FUNCTION public.manual_data_entry_from_single_equipment(_manufacturer_name text, _owner_name text, _standard_code text, _equipment_no text, _serial_no text, _title text, _description text, _test_certificate_no text, _safe_working_load text, _proof_load text, _last_test_date text, _next_test_date text, _last_through_date text, _next_through_date text) TO service_role","--\n-- Name: FUNCTION set_certificate_no_before_insert(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.set_certificate_no_before_insert() TO anon","GRANT ALL ON FUNCTION public.set_certificate_no_before_insert() TO authenticated","GRANT ALL ON FUNCTION public.set_certificate_no_before_insert() TO service_role","--\n-- Name: FUNCTION set_job_no(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.set_job_no() TO anon","GRANT ALL ON FUNCTION public.set_job_no() TO authenticated","GRANT ALL ON FUNCTION public.set_job_no() TO service_role","--\n-- Name: FUNCTION set_updated_at_timestamp(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.set_updated_at_timestamp() TO anon","GRANT ALL ON FUNCTION public.set_updated_at_timestamp() TO authenticated","GRANT ALL ON FUNCTION public.set_updated_at_timestamp() TO service_role","--\n-- Name: FUNCTION update_version(); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.update_version() TO anon","GRANT ALL ON FUNCTION public.update_version() TO authenticated","GRANT ALL ON FUNCTION public.update_version() TO service_role","--\n-- Name: FUNCTION verify_user_password(password text); Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON FUNCTION public.verify_user_password(password text) TO anon","GRANT ALL ON FUNCTION public.verify_user_password(password text) TO authenticated","GRANT ALL ON FUNCTION public.verify_user_password(password text) TO service_role","--\n-- Name: TABLE \\"A\\"; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.\\"A\\" TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.\\"A\\" TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.\\"A\\" TO service_role","--\n-- Name: TABLE annexure; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.annexure TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.annexure TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.annexure TO service_role","--\n-- Name: SEQUENCE annexure_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.annexure_id_seq TO anon","GRANT ALL ON SEQUENCE public.annexure_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.annexure_id_seq TO service_role","--\n-- Name: TABLE area; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.area TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.area TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.area TO service_role","--\n-- Name: SEQUENCE area_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.area_id_seq TO anon","GRANT ALL ON SEQUENCE public.area_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.area_id_seq TO service_role","--\n-- Name: TABLE authority; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.authority TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.authority TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.authority TO service_role","--\n-- Name: SEQUENCE authority_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.authority_id_seq TO anon","GRANT ALL ON SEQUENCE public.authority_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.authority_id_seq TO service_role","--\n-- Name: SEQUENCE certificate_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.certificate_id_seq TO anon","GRANT ALL ON SEQUENCE public.certificate_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.certificate_id_seq TO service_role","--\n-- Name: TABLE equipment; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment TO service_role","--\n-- Name: SEQUENCE equipment_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.equipment_id_seq TO anon","GRANT ALL ON SEQUENCE public.equipment_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.equipment_id_seq TO service_role","--\n-- Name: TABLE equipment_type; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment_type TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment_type TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.equipment_type TO service_role","--\n-- Name: SEQUENCE equipment_type_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.equipment_type_id_seq TO anon","GRANT ALL ON SEQUENCE public.equipment_type_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.equipment_type_id_seq TO service_role","--\n-- Name: SEQUENCE job_no_sequence; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.job_no_sequence TO anon","GRANT ALL ON SEQUENCE public.job_no_sequence TO authenticated","GRANT ALL ON SEQUENCE public.job_no_sequence TO service_role","--\n-- Name: TABLE job_orders; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.job_orders TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.job_orders TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.job_orders TO service_role","--\n-- Name: SEQUENCE job_orders_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.job_orders_id_seq TO anon","GRANT ALL ON SEQUENCE public.job_orders_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.job_orders_id_seq TO service_role","--\n-- Name: TABLE lifting_equipment; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment TO service_role","--\n-- Name: SEQUENCE lifting_equipment_certificate_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.lifting_equipment_certificate_id_seq TO anon","GRANT ALL ON SEQUENCE public.lifting_equipment_certificate_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.lifting_equipment_certificate_id_seq TO service_role","--\n-- Name: TABLE location; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.location TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.location TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.location TO service_role","--\n-- Name: TABLE manufacturer; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.manufacturer TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.manufacturer TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.manufacturer TO service_role","--\n-- Name: TABLE owner; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.owner TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.owner TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.owner TO service_role","--\n-- Name: TABLE site; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.site TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.site TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.site TO service_role","--\n-- Name: TABLE standard; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.standard TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.standard TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.standard TO service_role","--\n-- Name: TABLE surveyor; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor TO service_role","--\n-- Name: TABLE lifting_equipment_view; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment_view TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment_view TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_equipment_view TO service_role","--\n-- Name: TABLE lifting_gear_multi; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi TO service_role","--\n-- Name: TABLE lifting_gear_multi_equipments; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_equipments TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_equipments TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_equipments TO service_role","--\n-- Name: SEQUENCE lifting_gear_multi_equipments_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.lifting_gear_multi_equipments_id_seq TO anon","GRANT ALL ON SEQUENCE public.lifting_gear_multi_equipments_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.lifting_gear_multi_equipments_id_seq TO service_role","--\n-- Name: SEQUENCE lifting_gear_multi_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.lifting_gear_multi_id_seq TO anon","GRANT ALL ON SEQUENCE public.lifting_gear_multi_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.lifting_gear_multi_id_seq TO service_role","--\n-- Name: TABLE lifting_gear_multi_view; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_view TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_view TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_multi_view TO service_role","--\n-- Name: TABLE lifting_gear_single; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single TO service_role","--\n-- Name: SEQUENCE lifting_gear_single_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq TO anon","GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq TO service_role","--\n-- Name: SEQUENCE lifting_gear_single_id_seq1; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq1 TO anon","GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq1 TO authenticated","GRANT ALL ON SEQUENCE public.lifting_gear_single_id_seq1 TO service_role","--\n-- Name: TABLE lifting_gear_single_view; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single_view TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single_view TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.lifting_gear_single_view TO service_role","--\n-- Name: SEQUENCE location_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.location_id_seq TO anon","GRANT ALL ON SEQUENCE public.location_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.location_id_seq TO service_role","--\n-- Name: TABLE major_category; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.major_category TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.major_category TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.major_category TO service_role","--\n-- Name: SEQUENCE major_category_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.major_category_id_seq TO anon","GRANT ALL ON SEQUENCE public.major_category_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.major_category_id_seq TO service_role","--\n-- Name: SEQUENCE manufacturer_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.manufacturer_id_seq TO anon","GRANT ALL ON SEQUENCE public.manufacturer_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.manufacturer_id_seq TO service_role","--\n-- Name: TABLE minor_category; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.minor_category TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.minor_category TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.minor_category TO service_role","--\n-- Name: SEQUENCE minor_category_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.minor_category_id_seq TO anon","GRANT ALL ON SEQUENCE public.minor_category_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.minor_category_id_seq TO service_role","--\n-- Name: SEQUENCE owner_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.owner_id_seq TO anon","GRANT ALL ON SEQUENCE public.owner_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.owner_id_seq TO service_role","--\n-- Name: TABLE property; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property TO service_role","--\n-- Name: SEQUENCE property_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.property_id_seq TO anon","GRANT ALL ON SEQUENCE public.property_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.property_id_seq TO service_role","--\n-- Name: TABLE property_list; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property_list TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property_list TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.property_list TO service_role","--\n-- Name: SEQUENCE property_list_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.property_list_id_seq TO anon","GRANT ALL ON SEQUENCE public.property_list_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.property_list_id_seq TO service_role","--\n-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.roles TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.roles TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.roles TO service_role","--\n-- Name: SEQUENCE roles_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.roles_id_seq TO anon","GRANT ALL ON SEQUENCE public.roles_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.roles_id_seq TO service_role","--\n-- Name: SEQUENCE site_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.site_id_seq TO anon","GRANT ALL ON SEQUENCE public.site_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.site_id_seq TO service_role","--\n-- Name: SEQUENCE standard_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.standard_id_seq TO anon","GRANT ALL ON SEQUENCE public.standard_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.standard_id_seq TO service_role","--\n-- Name: TABLE students_credentials; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.students_credentials TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.students_credentials TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.students_credentials TO service_role","--\n-- Name: SEQUENCE students_credentials_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.students_credentials_id_seq TO anon","GRANT ALL ON SEQUENCE public.students_credentials_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.students_credentials_id_seq TO service_role","--\n-- Name: TABLE surveyor_competency; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor_competency TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor_competency TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.surveyor_competency TO service_role","--\n-- Name: SEQUENCE surveyor_competency_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.surveyor_competency_id_seq TO anon","GRANT ALL ON SEQUENCE public.surveyor_competency_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.surveyor_competency_id_seq TO service_role","--\n-- Name: SEQUENCE surveyor_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.surveyor_id_seq TO anon","GRANT ALL ON SEQUENCE public.surveyor_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.surveyor_id_seq TO service_role","--\n-- Name: SEQUENCE transaction_certificate_id_seq; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT ALL ON SEQUENCE public.transaction_certificate_id_seq TO anon","GRANT ALL ON SEQUENCE public.transaction_certificate_id_seq TO authenticated","GRANT ALL ON SEQUENCE public.transaction_certificate_id_seq TO service_role","--\n-- Name: TABLE unique_companies; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_companies TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_companies TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_companies TO service_role","--\n-- Name: TABLE unique_courses; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_courses TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_courses TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_courses TO service_role","--\n-- Name: TABLE unique_model_levels; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_model_levels TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_model_levels TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.unique_model_levels TO service_role","--\n-- Name: TABLE \\"user\\"; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.\\"user\\" TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.\\"user\\" TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.\\"user\\" TO service_role","--\n-- Name: TABLE v_equipment; Type: ACL; Schema: public; Owner: postgres\n--\n\nGRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.v_equipment TO anon","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.v_equipment TO authenticated","GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.v_equipment TO service_role","--\n-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres\n--\n\nALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres","ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon","ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated","ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role","--\n-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin\n--\n\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;\n\n\n--\n-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres\n--\n\n-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;\n\n\n-- --\n-- -- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin\n-- --\n\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;\n\n\n--\n-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres\n--\n\n-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;\n\n\n-- --\n-- -- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin\n-- --\n\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO postgres;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO anon;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO authenticated;\n-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO service_role;\n\n\n--\n-- PostgreSQL database dump complete\n--\n\n-- \\\\unrestrict 7Hbr2IXgudqCoNflayuNQwTSDRDTaUaythd7RrJ5kMzfhNEfbiWLVRNgWu2MUMA"}	remote_schema
\.


ALTER TABLE supabase_migrations.schema_migrations ENABLE TRIGGER ALL;

--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

ALTER TABLE vault.secrets DISABLE TRIGGER ALL;

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


ALTER TABLE vault.secrets ENABLE TRIGGER ALL;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 34, true);


--
-- Name: annexure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.annexure_id_seq', 2, true);


--
-- Name: area_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.area_id_seq', 2, true);


--
-- Name: authority_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.authority_id_seq', 2, true);


--
-- Name: certificate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.certificate_id_seq', 7, true);


--
-- Name: equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.equipment_id_seq', 4, true);


--
-- Name: equipment_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.equipment_type_id_seq', 2, true);


--
-- Name: job_no_sequence; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_no_sequence', 1, true);


--
-- Name: job_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.job_orders_id_seq', 1, true);


--
-- Name: lifting_equipment_certificate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lifting_equipment_certificate_id_seq', 1, true);


--
-- Name: lifting_gear_multi_equipments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lifting_gear_multi_equipments_id_seq', 1, true);


--
-- Name: lifting_gear_multi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lifting_gear_multi_id_seq', 1, true);


--
-- Name: lifting_gear_single_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lifting_gear_single_id_seq', 1, false);


--
-- Name: lifting_gear_single_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lifting_gear_single_id_seq1', 2, true);


--
-- Name: location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.location_id_seq', 5, true);


--
-- Name: major_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.major_category_id_seq', 2, true);


--
-- Name: manufacturer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.manufacturer_id_seq', 4, true);


--
-- Name: minor_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.minor_category_id_seq', 2, true);


--
-- Name: owner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.owner_id_seq', 3, true);


--
-- Name: property_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.property_id_seq', 2, true);


--
-- Name: property_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.property_list_id_seq', 2, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_id_seq', 2, true);


--
-- Name: standard_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.standard_id_seq', 4, true);


--
-- Name: students_credentials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.students_credentials_id_seq', 7, true);


--
-- Name: surveyor_competency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.surveyor_competency_id_seq', 2, true);


--
-- Name: surveyor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.surveyor_id_seq', 2, true);


--
-- Name: transaction_certificate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transaction_certificate_id_seq', 5, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict NuR9h34CCeCn6rJgW0YvBdjvM7gnTMK3f9OwF86bmBstZTcFTtcZAZtdH4FOxda

