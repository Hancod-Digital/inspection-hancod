import { AxiosRequestConfig } from "axios";
import { BuildUrl, Supabase } from "./utils";
import "../interceptor";
import { Service } from ".";

export class MasterService extends Supabase {
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

    async getAllSubtopicDetails(subtopic: string) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
            .from(subtopic)
            .select('*');

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    
    async getMergedDataOfSingleDoc(subtopic: string, from: string, to: string) {

        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
            .from(subtopic)
            .select(`*, ${to}:${from} (*)`)


        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async getLocationDetails(){
        const { data, error } = await this.supabase
        .rpc('get_location_details');  // Calling the SQL function
         
        console.log(data,"ss");
         

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getMajorCategoryDetails(){
        const { data, error } = await this.supabase
        .rpc('get_major_category_details');  // Calling the SQL function
         
        console.log(data,"ss");
         

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    
    async addRecordToSubtopic(subtopic: string, record: object) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
            .from(subtopic)
            .insert(record)
            .select(); // Optional: Returns the inserted record(s)

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async updateSubtopicDetails(subtopic: string, id: number, updates: object) {
        await this.ensureAuthenticated();

        const { data, error } = await this.supabase
            .from(subtopic)
            .update(updates)
            .eq('id', id);
        console.log(updates, id, error, data);

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async deleteSubtopicDetails(subtopic: string, id: number) {
        await this.ensureAuthenticated();

        const { data, error } = await this.supabase
            .from(subtopic)
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
}
