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
import FormTable from './FormTable'
const surveyorDetailsSchema = object({
   surveyor: z.string().nonempty('Surveyor is required'),
  qualification: z.string().nonempty('Qualification is required'),
  code: z.string().nonempty('Code is required'),
  status: z.string().nonempty('Status is required'),
  user: z.string().nonempty('User is required'),
});
import SurveyorCompetencyPopup from './Popup'
import { useSubtopic } from '@/context/SubtopicContext';

type SurveyorDetailsInput = TypeOf<typeof surveyorDetailsSchema>;

interface SurveyorDetailsFormProps {
  onClose: () => void;
  id: number
}

export default function SurveyorDetailsForm({ onClose,id }: SurveyorDetailsFormProps) {
  const [loading, setLoading] = useState(false);
  const { updateRecord, findRecordById } = useSubtopic();
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const methods = useForm<SurveyorDetailsInput>({
    resolver: zodResolver(surveyorDetailsSchema),
  });

  const { reset, handleSubmit, control, formState: { isSubmitSuccessful, errors } } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<SurveyorDetailsInput> = async(values) => {
    setLoading(true);
    console.log(values);
    await updateRecord(id,values)
    setLoading(false);
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
                    <Label htmlFor="surveyor" className="mt-3">Surveyor</Label>
                    <div>
                      <Input id="surveyor" {...methods.register('surveyor')} />
                      {errors.surveyor && (
                        <p className="text-red-500 mt-1">{errors.surveyor.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="qualification" className="mt-3">Qualification</Label>
                    <div>
                      <Input id="qualification" {...methods.register('qualification')} />
                      {errors.qualification && (
                        <p className="text-red-500 mt-1">{errors.qualification.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="code" className="mt-3">Code</Label>
                    <div>
                      <Input id="code" {...methods.register('code')} />
                      {errors.code && (
                        <p className="text-red-500 mt-1">{errors.code.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] w-1/2 items-start gap-4">
                    <Label htmlFor="user" className="mt-3">User</Label>
                    <div>
                      <Input id="user" {...methods.register('user')} />
                      {errors.user && (
                        <p className="text-red-500 mt-1">{errors.user.message}</p>
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
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.status && (
                        <p className="text-red-500 mt-1">{errors.status.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid w-full gap-4">
                  
                    
                      <FormTable onFunction={()=>setIsPopupOpen(true)} />
                     
                    </div>

                </div>
                {isPopupOpen && (
        <SurveyorCompetencyPopup
           
        />
      )}

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
