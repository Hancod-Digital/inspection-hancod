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
        console.log(data, "major_data");

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
        console.log(data, error);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }


    async getLocationDetails() {
        const { data, error } = await this.supabase
            .rpc('get_location_details');  // Calling the SQL function

        console.log(data, "ss");


        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getMajorCategoryDetails() {
        const { data, error } = await this.supabase
            .rpc('get_major_category_data');  // Calling the SQL function

        console.log(data, "ss");


        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getMinorCategoryDetails() {
        const { data, error } = await this.supabase
            .rpc('get_minor_category_data');  // Calling the SQL function

        console.log(data, "ss");


        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async addRecordToSubtopic(subtopic: string, record: object, surveyorCompetency?: any) {
        await this.ensureAuthenticated();
        try {
            const { data, error } = await this.supabase
                .from(subtopic)
                .insert(record)
                .select();

            if (surveyorCompetency) {
                const competenciesToInsert = surveyorCompetency.map((comp: any) => ({
                    ...comp,
                    surveyor_id: data?.[0]?.id,
                }));
                const { data: competencyData, error: competencyError } = await this.supabase
                    .from("surveyor_competency")
                    .insert(competenciesToInsert)
                    .select();

                if (competencyError) {
                    throw new Error(competencyError.message);
                }
            }



            if (error) throw error;

            console.log(data);
            return data;
        } catch (error) {
            console.error('Error in addRecordToSubtopic:', error);
            throw error instanceof Error ? error : new Error('An unknown error occurred');
        }
    }
    async fetchCompetencies(surveyorId: number) {
        try {
          const { data, error } = await this.supabase
            .from('surveyor_competency')
            .select('*')
            .eq('surveyor_id', surveyorId);
    
          if (error) {
            console.error('Error fetching competencies:', error);
            return;
          }
    
          return data || [];
        } catch (error) {
          console.error('Error in fetchCompetencies:', error);
        }
      };
    
    async updateSubtopicDetails(subtopic: string, id: number, updates: object, surveyorCompetency?: any) {
        await this.ensureAuthenticated();
        try {
            const { data, error } = await this.supabase
                .from(subtopic)
                .update(updates)
                .eq('id', id)
                .select();

            if (error) throw error;
console.log(updates,surveyorCompetency,"lolokodksoskdoskdoskdoskodksodksodksodkoskodk");

            if (surveyorCompetency) {
                 

                // Insert new competencies
                const competenciesToInsert = surveyorCompetency.map((comp: any) => ({
                    ...comp,
                    surveyor_id: id,
                }));
                const { data: competencyData, error: competencyError } = await this.supabase
                    .from("surveyor_competency")
                    .insert(competenciesToInsert)
                    .select();

                if (competencyError) {
                    throw new Error(competencyError.message);
                }
            }

            console.log(data);
            return data;
        } catch (error) {
            console.error('Error in updateSubtopicDetails:', error);
            throw error instanceof Error ? error : new Error('An unknown error occurred');
        }
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
