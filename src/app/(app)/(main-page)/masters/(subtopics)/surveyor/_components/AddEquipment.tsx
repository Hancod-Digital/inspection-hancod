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
import FormTable from './FormTable';
import SurveyorCompetencyPopup from './Popup';
import { useSubtopic } from '@/context/SubtopicContext';
import { makeApiCall } from '@/lib/apicaller';
import { UserService } from '@/services/api/user-service';
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const surveyorDetailsSchema = object({
  surveyor: z.string().nonempty('Surveyor is required'),
  qualification: z.string().nonempty('Qualification is required'),
  code: z.string().nonempty('Code is required'), 
  status: z.string().nonempty('Status is required'),
  digital_signature: z
    .any()
    .refine((files) => files && files.length > 0, {
      message: 'Digital signature file is required',
    }),
});

type SurveyorDetailsInput = TypeOf<typeof surveyorDetailsSchema>;

interface SurveyorDetailsFormProps {
  onClose: () => void;
}

export default function SurveyorDetailsForm({ onClose }: SurveyorDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { addRecord } = useSubtopic();
  const methods = useForm<SurveyorDetailsInput>({
    resolver: zodResolver(surveyorDetailsSchema),
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const [competencies, setCompetencies] = useState<[]>([]);

  
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

    return res?.fullPath
      ? `https://opwbtowotocyuravfiuq.supabase.co/storage/v1/object/public/${res.fullPath}`
      : null;
  };

  const onSubmitHandler: SubmitHandler<SurveyorDetailsInput> = async (values) => {
    setLoading(true);
     

    const file = values.digital_signature[0];
    const digitalSignatureUrl = await uploadImage(file);
    
    
    if (digitalSignatureUrl) {
      
    } else {
      console.error('Failed to upload digital signature');
    }
    // Combine form values and competencies before submitting
    
    await addRecord({status:values.status, surveyor: values.surveyor, qualification: values.qualification, code: values.code, digital_signature: digitalSignatureUrl },competencies,"surveyor");
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
                  <div className="grid grid-cols-[200px_1fr] w-1/2 gap-4">
                    <Label htmlFor="status" className="mt-3">Status</Label>
                    <div>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <p className="text-red-500 mt-1">{errors.status.message}</p>
                      )}
                    </div>
                  </div>
                

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="digital_signature" className="mt-3">
                      Digital Signature
                    </Label>
                    <div>
                      <label className="block">
                        <input
                          id="digital_signature"
                          type="file"
                          placeholder='Upload file'
                          {...methods.register('digital_signature')}
                          className="block border w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-primary file:font-bold file:bg-[#FFF1F5]
                   hover:file:bg-[#FFF1F5]"
                        />
                      </label>
                      {errors?.digital_signature && (
                        <p className="text-red-500 mt-1">{errors.digital_signature.message as string}</p>
                      )}
                    </div>
                  </div>


                  <div className="grid w-full gap-4">
                    <FormTable competencies={competencies} onFunction={() => setIsPopupOpen(true)} />
                  </div>
                </div>

                {isPopupOpen && (
                  <SurveyorCompetencyPopup
                    isPopupOpen={isPopupOpen}
                    setIsPopupOpen={setIsPopupOpen}
                    onAddCompetency={setCompetencies}
                  />
                )}

                <div className="flex justify-end gap-4">
                  <Button type="reset" className="px-10" onClick={onClose} variant="outline">
                    Cancel
                  </Button>
                  <Button className="px-10 hover:bg-secondary hover:text-primary hover:border-primary border " type="submit" disabled={loading}>
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
