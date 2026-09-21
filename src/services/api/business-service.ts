import { Supabase } from "./utils";

export type BusinessRole = "OWNER" | "ADMIN" | "EMPLOYEE" | "VIEWER";

export type Business = {
  id: string;
  name: string;
  slug?: string;
  status?: string;
  owner_id: string | null;
  created_at: string;
};

export type BusinessMember = {
  business_id: string;
  user_id: string;
  role: BusinessRole;
  status?: string;
  created_at: string;
  business?: Business | Business[];
};

export class BusinessService extends Supabase {
  async getCurrentBusinessId(): Promise<string | null> {
    const { data, error } = await this.supabase.rpc("current_business_id");
    if (error) throw new Error(error.message);
    return data;
  }

  async listMyMemberships(): Promise<BusinessMember[]> {
    const { data, error } = await this.supabase
      .from("business_members")
      .select("business_id,user_id,role,created_at,business:business_id(id,name,owner_id,created_at)")
      .eq("user_id", (await this.supabase.auth.getUser()).data.user?.id ?? "")
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []) as BusinessMember[];
  }

  async createBusiness(name: string, slug: string): Promise<string> {
    const { data, error } = await this.supabase.rpc("create_business", {
      p_name: name,
      p_slug: slug,
    });
    if (error) throw new Error(error.message);
    return data as string;
  }

  async setActiveBusiness(businessId: string): Promise<void> {
    const { data, error } = await this.supabase.rpc("set_active_business", {
      p_business_id: businessId,
    });
    if (error) throw new Error(error.message);

    // The access-token hook must persist the active business claim. Refreshing
    // here makes the new claim available to later requests once the hook is enabled.
    const { error: refreshError } = await this.supabase.auth.refreshSession();
    if (refreshError) throw new Error(refreshError.message);
    void data;
  }
}
