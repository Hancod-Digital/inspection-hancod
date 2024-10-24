import { AxiosRequestConfig } from "axios";
import { BuildUrl, Supabase } from "./utils";
import "../interceptor";
import { Service } from ".";

export class UserService extends Supabase {
  constructor() {
    super();
  }
  private async checkAuth(): Promise<boolean> {
    const { session } = (await this.supabase.auth.getSession()).data;
    return !!session?.access_token;
  }

  private async ensureAuthenticated() {
    const isAuthenticated = await this.checkAuth();
    if (!isAuthenticated) {
      throw new Error('Authentication required. Please log in.');
    }
  }

  async freezeUser(username: string, activeStatus: boolean) {
    await this.ensureAuthenticated()
    const { data, error } = await this.supabase
      .from('user')
      .update({ is_frozen: !activeStatus })
      .eq('user_name', username);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async uploadFile(file:  FormData, filename: string, bucket: string) {
    await this.ensureAuthenticated()
    
    const { data, error } = await this.supabase
      .storage
      .from(bucket)
      .upload(`/${"filename"+filename}`, file);
       
    if (error) {
      
      throw new Error(error.message);
    }
   
    
    return error || data;
  }

  async updateUser({name, email, phone, avatar, id} : {name:string,email:string,phone:number,avatar:string,id:number}) {
    await this.ensureAuthenticated()
     
    const { data, error } = await this.supabase
      .from('user')
      .update({ name, email, phone, avatar })
      .eq('id', id)
      if (error) {
        throw new Error(error.message);
      }
      return data;

  }


  async searchUsers(regexPattern: string) {
    await this.ensureAuthenticated()
    const { data, error } = await this.supabase
      .from('user')
      .select('*')
      .ilike('name', `${regexPattern}%`); // Using wildcard only at the end for starting match

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }


  async pagination(idx: number, type: string, subscription_plan: string) {
    await this.ensureAuthenticated()
    const { data, error } = await this.supabase
      .from('user')
      .select('*')
      .eq('user_type', type)
      .eq('subscription_plan', subscription_plan)
      .range(idx * 5, (idx + 1) * 5 - 1);
    if (error) {
      throw new Error();
    }
    return data
  }
}