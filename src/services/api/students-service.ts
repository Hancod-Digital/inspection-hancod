import { Supabase } from "./utils";

type StudentSearchType = "name" | "card";

interface GetStudentsOptions {
    page?: number;
    pageSize?: number;
    searchValue?: string;
    searchType?: StudentSearchType;
}

export class StudentService extends Supabase {
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
    
    async deleteStudent(id:string){
        await this.ensureAuthenticated();

        const { data, error } = await this.supabase
            .from("students_credentials")
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getAllCompanies(){
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
        .from('unique_companies')
        .select('*')
       
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getAllCourses(){
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
        .from('unique_courses')
        .select('*')
       
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getAllModelLevels(){
        await this.ensureAuthenticated();
        const { data, error } = await this.supabase
        .from('unique_model_levels')
        .select('*')
      
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
     
    async getStudents(is_card: boolean, is_qrl: boolean = false, options: GetStudentsOptions = {}) {
        await this.ensureAuthenticated();

        const page = Math.max(1, options.page ?? 1);
        const pageSize = Math.max(1, options.pageSize ?? 6);
        const start = (page - 1) * pageSize;
        const end = start + pageSize - 1;
        const searchValue = options.searchValue?.trim();

        let query = this.supabase
            .from('students_credentials')
            .select('*', { count: 'exact' });

        if (!is_card) {
            query = is_qrl
                ? query.not('qr_url', 'is', null)
                : query.not('card_url', 'is', null);
        }

        if (searchValue) {
            if (options.searchType === "card") {
                const escaped = searchValue
                    .replace(/,/g, '\\,')
                    .replace(/\(/g, '\\(')
                    .replace(/\)/g, '\\)');

                query = query.or(
                    `id_no.ilike.%${escaped}%,card_no.ilike.%${escaped}%,model_level.ilike.%${escaped}%,company.ilike.%${escaped}%`
                );
            } else {
                query = query.ilike('name', `%${searchValue}%`);
            }
        }

        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(start, end);

        if (error) {
            throw new Error(error.message);
        }

        return {
            data: data ?? [],
            count: count ?? 0,
            page,
            pageSize,
        };
    }
   
    async updateStudentQRUrl(id: number, qr_url: string) {
        await this.ensureAuthenticated();
        
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update({ qr_url:qr_url }) // Update only the qr_url field
            .eq("id", Number(id))
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
         
            throw new Error(error.message);
        }
         
        return data;
    }
    async updateStudentCardUrl(id: number, card: string) {
        await this.ensureAuthenticated();
     
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update({ card_url:card }) // Update only the qr_url field
            .eq("id", Number(id))
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
             
            throw new Error(error.message);
        }
        
        return data;
    }
    async updateStudentCertificateQRUrl(id: number, qr_url: string) {
        await this.ensureAuthenticated();
    
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update({ certificate_url:qr_url }) // Update only the qr_url field
            .eq("id", Number(id))
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
            
            throw new Error(error.message);
        }
        
        return data;
    }
    async updateStudentCertificateUrl(id: number, card: string) {
        await this.ensureAuthenticated();
        
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update({ certificate_url:card }) // Update only the qr_url field
            .eq("id", Number(id))
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
   
            throw new Error(error.message);
        }
        
        return data;
    }
    
    async addStudent(record: any) {
        await this.ensureAuthenticated()
       
        const { data, error } = await this.supabase
            .from("students_credentials")
            .insert(record)
            .select(); // Optional: Returns the inserted record(s)

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async editStudent(id: number, updatedRecord: any) {
        await this.ensureAuthenticated(); // Ensures the user is authenticated
       
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update(updatedRecord) // Update the record with new data
            .eq("id", id) // Match the student by their ID
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    
}  
