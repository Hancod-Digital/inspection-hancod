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
        console.log(data,"major_data");
        
        return data;
    }
    
    async getMergedDataOfSingleDoc(subtopic: string, references: { from: string, to: string }[]) {

        await this.ensureAuthenticated();
        console.log(references);
        
    console.log("sdsd");
    
        // Build the select string dynamically by looping through the references
        const referencesSelect = references.map(ref => `${ref.to}:${ref.from} (*)`).join(', ');
    
        // Build the query
        const { data, error } = await this.supabase
            .from(subtopic)
            .select(`*, ${referencesSelect}`);
    console.log(data,error);
    
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
        .rpc('get_major_category_data');  // Calling the SQL function
         
        console.log(data,"ss");
         

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getMinorCategoryDetails(){
        const { data, error } = await this.supabase
        .rpc('get_minor_category_data');  // Calling the SQL function
         
        console.log(data,"ss");
         

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async addRecordToSubtopic(subtopic: string, record: object, surveyorCompetency?: any) {
        await this.ensureAuthenticated();

        try {
            let surveyorId: string | undefined;

            if (surveyorCompetency) {
                const { data: competencyData, error: competencyError } = await this.supabase
                    .from("surveyor_competency")
                    .insert(surveyorCompetency)
                    .select();

                if (competencyError) throw competencyError;
                surveyorId = competencyData[0]?.surveyor_id;
            }

            const { data, error } = await this.supabase
                .from(subtopic)
                .insert(surveyorId ? { ...record, surveyor_id: surveyorId } : record)
                .select();

            if (error) throw error;

            console.log(data);
            return data;
        } catch (error) {
            console.error('Error in addRecordToSubtopic:', error);
            throw error instanceof Error ? error : new Error('An unknown error occurred');
        }
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
