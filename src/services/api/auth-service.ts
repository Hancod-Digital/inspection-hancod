import { AxiosRequestConfig } from "axios";
import { BuildUrl, Supabase } from "./utils";
import "../interceptor";
import { Service } from ".";
import { Session } from "inspector";


export class AuthService extends Supabase {
    constructor() {
        super();
    }
    async verify_user_password(password: string) {
        const { data, error } = await this.supabase.rpc('verify_user_password', { password })
        if (error) {
            return false
        }
         
        
        return data
    }
    async reset_password(email: string) {
        const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/new-password', // URL to handle password reset
          });
          if (error) {
            
            throw new Error("An Error Occured")
        }
        return data
    }
    async change_authenticated_password(password: string){
        const { data, error } = await this.supabase.auth.updateUser({
            password
          })
          
          if (error) {
            throw new Error("An Error Occured")
          } 
          return data
          
    }
    async change_password(password: string, accessToken: string){
        const { error } = await this.supabase.auth.updateUser({
            password,
           
          });
      
          if (error) {
            throw new Error("An Error Occured")
          } 
    }
    async userVerify(email: string) {
        const { data, error } = await this.supabase
            .from('user')
            .select('*')
            .eq('email', email)

        if (error) {
            return false
        }
        return data
    }
    async userLogin(email: string, password: string) {
        const result = await this.userVerify(email)
        if (!result) {
            throw new Error("invalid credentials")
        }

        const { data, error } = await this.supabase.auth.signInWithPassword({ email, password })

        if (error) {
            throw new Error(error.message)
        }

        return error || data;
    }

    async userLogout() {
        const { error } = await this.supabase.auth.signOut()
        if (error) {
            throw new Error(error.message)
        }
        return error;
    }

    async isUserActive() {
        const { session } = (await this.supabase.auth.getSession()).data
        return session
    }
    async getActiveUser() {
        const result = (await this.supabase.auth.getSession()).data
        return result
    }
    async getUserId() {
        const { session } = (await this.supabase.auth.getSession()).data
        return session?.user.id
    }
    async getUserDetails(id: string) {
        const { data, error } = await this.supabase
            .from('user')
            .select('*')
            .eq('id', id)
            .single()
        return data
    }
    async uploadImage(email: string) {

    }
}

export const fetchUserActiveStatus = async () => {
    const service = new AuthService();
    const response = await service.getActiveUser();


    return response.session?.user;
};

export const fetchUserDetails = async () => {
    const service = new AuthService();
 
    const response = await service.getUserDetails((await service.getActiveUser()).session?.user.id!)

    return response
}