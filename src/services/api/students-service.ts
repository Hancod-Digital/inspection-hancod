import { Supabase } from "./utils";

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
     
    async getStudents(is_card:boolean, is_qrl?:boolean) {
        await this.ensureAuthenticated();
        if(is_card){
            const { data, error } = await this.supabase
            .from('students_credentials')
            .select('*')
            if (error) {
                return false;
            }
            return data;
        }else if(is_qrl){
            const { data, error } = await this.supabase
            .from('students_credentials')
            .select('*')
            .not('qr_url', 'is', null); // Replace 'card' with your field name
            if (error) {
                return false;
            }
            return data;
        }else{
            const { data, error } = await this.supabase
            .from('students_credentials')
            .select('*')
            .not('card_url', 'is', null); // Replace 'card' with your field name
            if (error) {
                return false;
            }
            return data;
        }
       
        
    }
   
    async updateStudentQRUrl(id: number, qr_url: string) {
        await this.ensureAuthenticated();
        console.log(`Updating QR URL for student with ID: ${id}`,qr_url);
    
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update({ qr_url:qr_url }) // Update only the qr_url field
            .eq("id", Number(id))
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
            console.log(error);
            
            throw new Error(error.message);
        }
        console.log(data);
        
        return data;
    }
    async updateStudentCardUrl(id: number, card: string) {
        await this.ensureAuthenticated();
        console.log(`Updating QR URL for student with ID: ${id}`,card);
    
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update({ card_url:card }) // Update only the qr_url field
            .eq("id", Number(id))
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
            console.log(error);
            
            throw new Error(error.message);
        }
        console.log(data);
        
        return data;
    }
    async updateStudentCertificateQRUrl(id: number, qr_url: string) {
        await this.ensureAuthenticated();
        console.log(`Updating QR URL for student with ID: ${id}`,qr_url);
    
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update({ certificate_qr_url:qr_url }) // Update only the qr_url field
            .eq("id", Number(id))
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
            console.log(error);
            
            throw new Error(error.message);
        }
        console.log(data);
        
        return data;
    }
    async updateStudentCertificateUrl(id: number, card: string) {
        await this.ensureAuthenticated();
        console.log(`Updating QR URL for student with ID: ${id}`,card);
    
        const { data, error } = await this.supabase
            .from("students_credentials")
            .update({ certificate_url:card }) // Update only the qr_url field
            .eq("id", Number(id))
            .select(); // Optional: Returns the updated record(s)
    
        if (error) {
            console.log(error);
            
            throw new Error(error.message);
        }
        console.log(data);
        
        return data;
    }
    
    async addStudent(record: any) {
        await this.ensureAuthenticated()
        console.log(record, "redcc");

        const { data, error } = await this.supabase
            .from("students_credentials")
            .insert(record)
            .select(); // Optional: Returns the inserted record(s)

        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
}  