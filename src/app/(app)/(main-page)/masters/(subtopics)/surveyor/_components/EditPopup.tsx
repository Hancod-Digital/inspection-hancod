'use client';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler, FormProvider, Controller } from 'react-hook-form';
import { z, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormTable from './FormTable';
import SurveyorCompetencyPopup from './Popup';
import { useSubtopic } from '@/context/SubtopicContext';
import { makeApiCall } from '@/lib/apicaller';
import { UserService } from '@/services/api/user-service';
import { MasterService } from '@/services/api/masters-service';

const surveyorDetailsSchema = object({
  surveyor: z.string().nonempty('Surveyor is required'),
  qualification: z.string().nonempty('Qualification is required'),
  code: z.string().nonempty('Code is required'), 
   digital_signature: z.string().optional(), // Optional in edit form; required only if changing the file
});

type SurveyorDetailsInput = TypeOf<typeof surveyorDetailsSchema>;

interface SurveyorDetailsFormProps {
  onClose: () => void;
  id: number;
}

export default function SurveyorDetailsForm({ onClose, id }: SurveyorDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { updateRecord, findRecordById } = useSubtopic();
  const methods = useForm<SurveyorDetailsInput>({
    resolver: zodResolver(surveyorDetailsSchema),
  });

  const {
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  const [competencies, setCompetencies] = useState<[]>([]);
  const [dummy,setDummy] = useState<any>([]);
  const record =  findRecordById(id);

  useEffect(() => {
    // Fetch existing record data
    const fetchRecord = async () => {
      
      if (record) {
        reset({
          surveyor: record.surveyor,
          qualification: record.qualification,
          code: record.code,
          digital_signature: record.digital_signature,
           // digital_signature is handled separately
        });
        makeApiCall(
            () => new MasterService().fetchCompetencies(id),
            {
                afterSuccess: (data: any) => {
                    console.log(data,"sdsd",id);
                    
                    setCompetencies(data || []);
                },
            }
        );
        // If you have a URL for the existing digital signature, you might want to display it
      }
    };
    fetchRecord();
  }, [id, findRecordById, reset]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    let res: any;
    await makeApiCall(
      () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
      {
        afterSuccess: (data: any) => {
          res = data;
        },
      }
    );
    console.log(res);

    return res?.fullPath
      ? `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`
      : null;
  };

  const onSubmitHandler: SubmitHandler<SurveyorDetailsInput> = async (values) => {
    setLoading(true);
    let digitalSignatureUrl = null;

    if (values.digital_signature && values.digital_signature.length > 0 && typeof values.digital_signature !== 'string') {
      const file = values.digital_signature[0];
      digitalSignatureUrl = await uploadImage(file);
      if (!digitalSignatureUrl) {
        console.error('Failed to upload digital signature');
        setLoading(false);
        return;
      }
      console.log('Uploaded Digital Signature URL:', digitalSignatureUrl);
    }
console.log(record,digitalSignatureUrl);

    // Combine form values and competencies
    const updatedData = {
      surveyor: values.surveyor,
      qualification: values.qualification,
      code: values.code,
      
      
      digital_signature: digitalSignatureUrl? digitalSignatureUrl : record?.digital_signature, // This will be null if not updated
    };

    console.log('Form Values:', updatedData);
    console.log('Competencies:', competencies);

    await updateRecord(id, updatedData, dummy);
    setLoading(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border-0 p-0 hover:bg-white">
        <CardContent>
          <FormProvider {...methods}>
            <form
              className="space-y-4"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <div className="space-y-4 pt-10">
                <div className="grid gap-4 grid-cols-1">
                  {/* Surveyor Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="surveyor" className="mt-3">
                      Surveyor
                    </Label>
                    <div>
                      <Input id="surveyor" {...methods.register('surveyor')} />
                      {errors.surveyor && (
                        <p className="text-red-500 mt-1">{errors.surveyor.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Qualification Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="qualification" className="mt-3">
                      Qualification
                    </Label>
                    <div>
                      <Input id="qualification" {...methods.register('qualification')} />
                      {errors.qualification && (
                        <p className="text-red-500 mt-1">{errors.qualification.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Code Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="code" className="mt-3">
                      Code
                    </Label>
                    <div>
                      <Input id="code" {...methods.register('code')} />
                      {errors.code && (
                        <p className="text-red-500 mt-1">{errors.code.message}</p>
                      )}
                    </div>
                  </div>

                  
                  

                  {/* Digital Signature Field */}
                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="digital_signature" className="mt-3">
                      Digital Signature
                    </Label>
                    <div>
                      <label className="block">
                        <input
                          id="digital_signature"
                          type="file"
                          placeholder="Upload file"
                          {...methods.register('digital_signature')}
                          className="block border w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-primary file:font-bold file:bg-[#FFF1F5]
                   hover:file:bg-[#FFF1F5]"
                        />
                      </label>
                      {errors.digital_signature && (
                        <p className="text-red-500 mt-1">{errors.digital_signature.message}</p>
                      )}
                      {/* Optionally display existing digital signature */}
                      {/* 
                      {existingDigitalSignatureUrl && (
                        <a href={existingDigitalSignatureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2 block">
                          View Existing Signature
                        </a>
                      )}
                      */}
                    </div>
                  </div>

                  {/* Competencies Table */}
                  <div className="grid w-full gap-4">
                    <FormTable competencies={competencies} onFunction={() => setIsPopupOpen(true)} />
                  </div>
                </div>

                {/* Competency Popup */}
                {isPopupOpen && (
                  <SurveyorCompetencyPopup
                    isPopupOpen={isPopupOpen}
                    setIsPopupOpen={setIsPopupOpen}
                    onAddCompetency={setDummy}
                    setCompetencies={setCompetencies}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  <Button type="reset" className="px-10" onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                  <Button className="px-10" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </motion.div>
  );
}
