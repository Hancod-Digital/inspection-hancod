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
            .select('*')
            .order('id', { ascending: false });
 
        if (error) {
            throw new Error(error.message);
        }
      
        return data;
    }

    async getSingleSubtopicDetails(subtopic: string,id:string) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
            .from(subtopic)
            .select('*')
            .eq('id',id);
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }

    async getMergedDataOfSingleDoc(subtopic: string, references: { from: string, to: string }[]) {

        await this.ensureAuthenticated();
     
        // Build the select string dynamically by looping through the references
        const referencesSelect = references.map(ref => `${ref.to}:${ref.from} (*)`).join(', ');

        // Build the query
        const { data, error } = await this.supabase
            .from(subtopic)
            .select(`*, ${referencesSelect}`);
     
        if (error) {
            throw new Error(error.message);
        }

        return data;
    }


    async getLocationDetails() {
        const { data, error } = await this.supabase
            .rpc('get_location_details');  // Calling the SQL function

       

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async addEquipment(result:any){
        const {data,error} = await this.supabase
                             .from('lifting_gear_multi_equipments').insert(result).select()

              
                             
        if (error) {
            throw new Error(error.message);
        }
        return data[0];
    }

    async deleteMultiEquipment(id:number){
         
        const {data,error} = await this.supabase.from('lifting_gear_multi_equipments').delete().eq('id',Number(id))
        if(error) throw error;
        return data;
    }
    async getMajorCategoryDetails() {
        const { data, error } = await this.supabase
            .rpc('get_major_category_data');  // Calling the SQL function

      

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getMinorCategoryDetails() {
        const { data, error } = await this.supabase
            .rpc('get_minor_category_data');  // Calling the SQL function

      

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async fetchEquipmentView(){
        const {data,error} = await this.supabase.from('v_equipment').select('*');
        
        if(error) throw error;
        return data;
    }
    async liftingEquipmentView(){
        const {data,error} = await this.supabase.from('lifting_equipment_view').select('*');
        
        if(error) throw error;
        return data;
    }
    async liftingMultiGearView(){
        const {data,error} = await this.supabase.from('lifting_gear_multi_view').select('*');
       
        if(error) throw error;
        return data;
    }
    async liftingSingleGearView(){
        const {data,error} = await this.supabase.from('lifting_gear_single_view').select('*');
        
        if(error) throw error;
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
    
    async fetchAllEquipments(id:number|string) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
            .from("lifting_gear_multi_equipments")
            .select("*")
            .eq('lifting_gear_multi_id', Number(id));
        
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async updateSubtopicDetails(subtopic: string, id: number, updates: object, surveyorCompetency?: any) {
        await this.ensureAuthenticated();
        try {
            const { data, error } = await this.supabase
                .from(subtopic)
                .update(updates)
                .eq('id', Number(id))
                .select();

            if (error) throw error;
 
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

        
            return data;
        } catch (error) {
            console.error('Error in updateSubtopicDetails:', error);
            throw error instanceof Error ? error : new Error('An unknown error occurred');
        }
    }

    async fetchSerialNos(id: string) {
        await this.ensureAuthenticated()
 

        const {data,error} = await this.supabase.from('equipment')
        .select('serial_no')
        .eq('id',Number(id))
 
        
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
    async getAllProperties() {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('property_list').select('*');
        if (error) throw error;
        return data;
    }
    async addPropertyToAnnexure(record: object) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('property_list').insert(record);
        if (error) throw error;
        return data;
    }
    async fetchEquipmentDetails(id: string) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('equipment').select('*').eq('id', id);
        if (error) throw error;
        return data;
    }
    async updatePropertyToAnnexure(id: number, updates: object) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('property_list').update(updates).eq('id', id);
        if (error) throw error;
        return data;
    }

    async deletePropertyFromAnnexure(id: number) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('property_list').delete().eq('id', id);
        if (error) throw error;
        return data;
    }

    async getAnnexures(id: string) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('annexure').select('*').eq('id', id);
        if (error) throw error;
        return data;
    }

    async getPropertyList(id: string) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('property_list').select('*').eq('annexure_id', id);
        if (error) throw error;
        return data;
    }

    async deleteProperty(id: number) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('property_list').delete().eq('id', id);
        if (error) throw error;
        return data;
    }

}
