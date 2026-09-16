import { AxiosRequestConfig } from "axios";
import { Service } from ".";
import { BuildUrl } from "./utils";

export class EdgeFunctionService extends Service {
    constructor(config?: AxiosRequestConfig) {
        super(config);
    }
    changePassword({ id,password }: { id: string,password:string }) {
        this.url = new BuildUrl().supabase('/reset-password')
    
        this.axiosPost({id,newPassword:password}); 
        return this;
    }
}