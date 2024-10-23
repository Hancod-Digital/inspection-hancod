// 'use client';
// import { motion } from 'framer-motion';
// import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
// import { z, object, string, TypeOf } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useEffect, useState } from 'react';
// import { X } from 'lucide-react';
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { makeApiCall } from '@/lib/apicaller';
// import { UserService } from '@/services/api/user-service';
// import { useSubtopic } from '@/context/SubtopicContext';

// const surveyorCompetencySchema = object({
//   competency: z.string().nonempty('Competency is required'),
//   validity: z.string().nonempty('Validity is required'),
//   attachment: z
//     .any()
//     .refine((files) => files && files.length > 0, {
//       message: 'Attachment is required',
//     }),
// });

// type SurveyorCompetencyInput = TypeOf<typeof surveyorCompetencySchema>;

// export default function Component({
//   isPopupOpen,
//   setIsPopupOpen,
//   onAddCompetency
// }: {
//   isPopupOpen: boolean,
//   setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>,
//   onAddCompetency: (competency: any) => void
// }) {
//   const [open, setOpen] = useState(true);
//   const [loading, setLoading] = useState(false);
//  const {addRecord} = useSubtopic();
//   const methods = useForm<SurveyorCompetencyInput>({
//     resolver: zodResolver(surveyorCompetencySchema),
//   });

//   const {
//     reset,
//     handleSubmit,
//     formState: { isSubmitSuccessful, errors },
//   } = methods;

//   useEffect(() => {
//     if (isSubmitSuccessful) {
//       reset();
//     }
//   }, [isSubmitSuccessful, reset]);

//   const uploadImage = async (file: File) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     let res: any;
//     await makeApiCall(
//       () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
//       {
//         afterSuccess: (data: any) => {
//           res = data;
//         },
//       }
//     );
//     console.log(res);

//     return res?.fullPath
//       ? `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`
//       : null;
//   };

//   const onSubmitHandler: SubmitHandler<SurveyorCompetencyInput> = async (values) => {
//     setLoading(true);
//     const file = values.attachment[0];
//     const attachmentUrl = await uploadImage(file);
    
//     if (attachmentUrl) {
//       onAddCompetency({...values, attachment: attachmentUrl});
//     } else {
//       console.error('Failed to upload attachment');
//     }
    
//     setLoading(false);
//     setIsPopupOpen(false);
//   };

//   return (
//     <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
//       <DialogContent className="sm:max-w-[425px] p-0">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: 20 }}
//           transition={{ duration: 0.3 }}
//         >
//           <FormProvider {...methods}>
//             <form
//               className="space-y-4"
//               noValidate
//               autoComplete="off"
//               onSubmit={handleSubmit(onSubmitHandler)}
//             >
//               <div className="p-6 space-y-6">
//                 <div className="flex justify-between items-center border-b pb-4">
//                   <h2 className="text-lg font-semibold">Add Surveyor Competency</h2>
                   
//                 </div>
//                 <div className="space-y-4">
//                   <div className="space-y-2 grid grid-cols-2 ">
//                     <Label htmlFor="competency" className="text-sm mt-3 font-medium ">
//                       Competency:<span className="text-red-500">*</span>
//                     </Label>
//                     <div>
//                       <Input id="competency" {...methods.register('competency')} className="w-full" />
//                       {errors.competency && (
//                         <p className="text-red-500 mt-1">{errors.competency.message}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="space-y-2 grid grid-cols-2 ">
//                     <Label htmlFor="validity" className="text-sm mt-3 font-medium">
//                       Validity:
//                     </Label>
//                     <Input id="validity" {...methods.register('validity')} className="w-full" />
//                   </div>
//                   {errors.validity && (
//                     <p className="text-red-500 mt-1">{errors.validity.message}</p>
//                   )}
//                   <div className="flex items-center border">
//                     <label
//                       htmlFor="attachment"
//                       className="ml-auto py-2 px-4 rounded-md border-0 text-black font-bold bg-[#F0F6FD] hover:bg-[#F0F6FD] cursor-pointer"
//                     >
//                       Upload attachment
//                     </label>
//                     <input
//                       id="attachment"
//                       type="file"
//                       {...methods.register('attachment')}
//                       className="hidden"
//                     />
//                   </div>
//                   {errors.attachment && (
//                     <p className="text-red-500 mt-1">{errors.attachment.message}</p>
//                   )}
//                 </div>
//                 <Button 
//                   type="submit" 
//                   className="w-full bg-[#8E2E47] hover:bg-[#7D2940] text-white"
//                   disabled={loading}
//                 >
//                   {loading ? 'Saving...' : 'Save'}
//                 </Button>
//               </div>
//             </form>
//           </FormProvider>
//         </motion.div>
//       </DialogContent>
//     </Dialog>
//   );
// }
