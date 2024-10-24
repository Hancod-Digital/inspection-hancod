// SurveyorCompetencyPopup.tsx
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { makeApiCall } from '@/lib/apicaller';
import { UserService } from '@/services/api/user-service';

interface SurveyorCompetencyPopupProps {
  isPopupOpen: boolean;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddCompetency: any
  setCompetencies?:any
}

interface SurveyorCompetency {
  competency: string;
  validity: string;
  attachment: any; // URL of the uploaded attachment
}

export default function SurveyorCompetencyPopup({
  isPopupOpen,
  setIsPopupOpen,
  onAddCompetency,
  setCompetencies
}: SurveyorCompetencyPopupProps) {
  const [loading, setLoading] = useState(false);
  const [competency, setCompetency] = useState('');
  const [validity, setValidity] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      let res: any;
      await makeApiCall(
        () => new UserService().uploadFile(formData, `${Date.now()}`, 'students'),
        {
          afterSuccess: (data: any) => {
            res = data;
          },
        }
      ); 

      if (res?.fullPath) {
        return `https://seqptsvnihezsfbnpkpz.supabase.co/storage/v1/object/public/${res.fullPath}`;
      } else {
        console.error('Invalid response from upload:', res);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!competency.trim()) newErrors.competency = 'Competency is required';
    if (!validity.trim()) newErrors.validity = 'Validity is required';
    if (!attachmentFile) newErrors.attachment = 'Attachment is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    if (attachmentFile) {
      const attachmentUrl = await uploadImage(attachmentFile);
   
      if (attachmentUrl) {
        const newCompetency: SurveyorCompetency = {
          competency: competency.trim(),
          validity: validity.trim(),
          attachment: attachmentUrl,
        };  
        onAddCompetency((prevCompetencies:any) => [...prevCompetencies, newCompetency]);
        if(setCompetencies){
          setCompetencies((prevCompetencies:any) => [...prevCompetencies, newCompetency]);
        }
        setIsPopupOpen(false);
      } else {
        console.error('Failed to upload attachment');
        setErrors((prev) => ({
          ...prev,
          attachment: 'Failed to upload attachment. Please try again.',
        }));
      }
    }

    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachmentFile(e.target.files[0]);
      // Clear any existing attachment errors
      setErrors((prev) => ({ ...prev, attachment: '' }));
    }
  };

  return (
    <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg font-semibold">Add Surveyor Competency</h2>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Competency Field */}
                <div className="space-y-2 grid grid-cols-2">
                  <Label htmlFor="competency" className="text-sm mt-3 font-medium">
                    Competency:<span className="text-red-500">*</span>
                  </Label>
                  <div>
                    <Input
                      id="competency"
                      value={competency}
                      onChange={(e) => setCompetency(e.target.value)}
                      className="w-full"
                      placeholder="Enter competency"
                    />
                    {errors.competency && (
                      <p className="text-red-500 mt-1">{errors.competency}</p>
                    )}
                  </div>
                </div>

                {/* Validity Field */}
                <div className="space-y-2 grid grid-cols-2">
                  <Label htmlFor="validity" className="text-sm mt-3 font-medium">
                    Validity:<span className="text-red-500">*</span>
                  </Label>
                  <div>
                    <Input
                      id="validity"
                      value={validity}
                      onChange={(e) => setValidity(e.target.value)}
                      className="w-full"
                      placeholder="Enter validity"
                    />
                    {errors.validity && (
                      <p className="text-red-500 mt-1">{errors.validity}</p>
                    )}
                  </div>
                </div>

                {/* Attachment Field */}
                <div className="flex items-center border">
                  <label
                    htmlFor="attachment"
                    className="ml-auto py-2 px-4 rounded-md border-0 text-black font-bold bg-[#F0F6FD] hover:bg-[#F0F6FD] cursor-pointer"
                  >
                    Upload Attachment<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="attachment"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {errors.attachment && (
                  <p className="text-red-500 mt-1">{errors.attachment}</p>
                )}
              </div>
              <Button
                type="button"
                className="w-full bg-[#8E2E47] hover:bg-[#7D2940] text-white"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
