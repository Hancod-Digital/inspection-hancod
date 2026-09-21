revoke execute on function public.verify_user_password(text) from public, anon;

revoke execute on function
  public.assert_same_business(),
  public.generate_card_and_certificate_no(),
  public.set_certificate_no_before_insert(),
  public.set_job_no()
from public, anon, authenticated;