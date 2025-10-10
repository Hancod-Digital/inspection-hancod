import { AxiosRequestConfig } from "axios";
import { BuildUrl, Supabase } from "./utils";
import "../interceptor";
import { Service } from ".";
import { makeApiCall } from "@/lib/apicaller";

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
            .order('created_at', { ascending: false });
 
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
            .select(`*, ${referencesSelect}`)
            .order('created_at', {ascending:false})
     
        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async manualDataEntryFromSingleEquipment(data: {
        equipment_no: string;
        title: string;
        description: string;
        manufacturer_name: string;
        owner_name: string;
        standard_code: string;
        serial_no?: string;
        test_certificate_no?: string;
        safe_working_load?: string;
        proof_load?: string;
        last_test_date?: string;
        last_through_date?: string;
        next_test_date?: string;
        next_through_date?: string;
    }) {
        await this.ensureAuthenticated();
        
        return this.supabase.rpc('manual_data_entry_from_single_equipment', {
            _equipment_no: data.equipment_no,
            _serial_no: data.serial_no ?? null,
            _title: data.title,
            _description: data.description,
            _manufacturer_name: data.manufacturer_name,
            _owner_name: data.owner_name,
            _standard_code: data.standard_code,
            _test_certificate_no: data.test_certificate_no,
            _safe_working_load: data.safe_working_load,
            _proof_load: data.proof_load,
            _last_test_date: data.last_test_date,
            _last_through_date: data.last_through_date,
            _next_test_date: data.next_test_date,
            _next_through_date: data.next_through_date,
        });
    }

    // ------------------------------------------------------------------
    // Manual data entry for MULTI-gear equipment certificates
    // Calls the RPC: manual_data_entry_from_multi_equipment
    async manualDataEntryFromMultiEquipment(data: {
        equipment_no: string;
        title: string;
        description: string;
        manufacturer_name: string;
        owner_name: string;
        standard_code: string;
        serial_no?: string;
        test_certificate_no?: string;
        safe_working_load?: string;
        proof_load?: string;
        last_test_date?: string;
        next_test_date?: string;
        last_through_date?: string;
        next_through_date?: string;
    }) {
        await this.ensureAuthenticated();

        return this.supabase.rpc('manual_data_entry_from_multi_equipment', {
            _equipment_no: data.equipment_no,
            _serial_no: data.serial_no ?? null,
            _title: data.title,
            _description: data.description,
            _manufacturer_name: data.manufacturer_name,
            _owner_name: data.owner_name,
            _standard_code: data.standard_code,
            _test_certificate_no: data.test_certificate_no,
            _safe_working_load: data.safe_working_load,
            _proof_load: data.proof_load,
            _last_test_date: data.last_test_date,
            _next_test_date: data.next_test_date,
            _last_through_date: data.last_through_date,
            _next_through_date: data.next_through_date,
        });
    }

    async getLocationDetails() {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
            .rpc('get_location_details');  // Calling the SQL function

        if (error) {
            throw new Error(error.message);
        }
        
        // Sort the data by location's created_at in descending order (latest first)
        return data.sort((a:any, b:any) => {
            const dateA = new Date(a.location.created_at).getTime();
            const dateB = new Date(b.location.created_at).getTime();
            return dateB - dateA; // Descending order
        });
    }
    async addOwner(result:any){
        const {data,error} = await this.supabase
                             .from('owner').insert(result).select()
        if(error) throw error;
        return data[0];
    }
    async addManufacturer(result:any){
        const {data,error} = await this.supabase
                             .from('manufacturer').insert(result).select()
        if(error) throw error;
        return data[0];
    }
    async addStandard(result:any){
        const {data,error} = await this.supabase
                             .from('standard').insert(result).select()
        if(error) throw error;
        return data[0];
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

    async getAnnexureByPropertyTableType(property_table_type: string) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.from('annexure').select('*').eq('property_table_type', property_table_type);
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

    async manualDataEntryForLiftingEquipment(params: {
        manufacturer_name: string;
        owner_name: string;
        standard_code: string;
        equipment_no: string;
        serial_no: string;
        title: string;
        description: string;
        test_certificate_no: string;
        safe_working_load: string;
        model_no: string;
        year_of_manufacture: string;
        registration_no: string;
        property_table_type: string;
        annexure_id: number;
        last_test_date?: string;
        next_test_date?: string;
        last_thorough_date?: string;
        next_thorough_date?: string;
    }) {
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase.rpc('manual_data_entry_for_lifting_equipment', {
            _manufacturer_name: params.manufacturer_name,
            _owner_name: params.owner_name,
            _standard_code: params.standard_code,
            _equipment_no: params.equipment_no,
            _serial_no: params.serial_no,
            _title: params.title,
            _description: params.description,
            _test_certificate_no: params.test_certificate_no,
            _safe_working_load: params.safe_working_load,
            _model_no: params.model_no,
            _year_of_manufacture: params.year_of_manufacture,
            _registration_no: params.registration_no,
            _property_table_type: params.property_table_type,
            _annexure_id: params.annexure_id,
            _last_test_date: params.last_test_date || null,
            _next_test_date: params.next_test_date || null,
            _last_thorough_date: params.last_thorough_date || null,
            _next_thorough_date: params.next_thorough_date || null,
        });
        if (error) throw error;
        return data;
    }

}
