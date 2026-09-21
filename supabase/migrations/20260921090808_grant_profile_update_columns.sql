-- Profile editing is restricted to these non-authorization fields.
grant update (name, email, phone, avatar, code)
on public."user" to authenticated;
