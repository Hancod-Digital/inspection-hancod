"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, X } from "lucide-react"

// Spinner component to match your existing code
const Spinner2 = () => <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>

interface DeletePopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  onConfirm: () => Promise<void> | void
}

export default function DeletePopup({
  isOpen,
  onClose,
  title = "Delete Labels / Priorities",
  description = "Are you sure you want to delete this Labels / Priorities? This action cannot be undone.",
  onConfirm,
}: DeletePopupProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("Delete failed:", error)
    } finally {
      setLoading(false)
    }
  }

//   const handleCancel = () => {
//     onClose()
//     router.back()
//   }

    const handleCancel = () => {
        onClose()
    }

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.85,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth feel
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      y: 10,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0,
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -5,
      transition: { duration: 0.1 }
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent 
            className="sm:max-w-md p-0 gap-0 bg-white border-none overflow-hidden"
            
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit" 
            >
              <motion.div 
                className="p-6"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Icon with subtle animation */}
                <motion.div 
                  className="flex justify-start mb-2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: { delay: 0, duration: 0.3, ease: "backOut" }
                  }}
                >
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
                    <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4.05322" y="4.43164" width="48" height="48" rx="24" fill="white"/>
                      <rect x="4.05322" y="4.43164" width="48" height="48" rx="24" stroke="#FFEBEB" strokeWidth="8"/>
                      <path d="M32.0532 22.4316V21.6316C32.0532 20.5115 32.0532 19.9515 31.8352 19.5237C31.6435 19.1473 31.3375 18.8414 30.9612 18.6496C30.5334 18.4316 29.9733 18.4316 28.8532 18.4316H27.2532C26.1331 18.4316 25.5731 18.4316 25.1452 18.6496C24.7689 18.8414 24.463 19.1473 24.2712 19.5237C24.0532 19.9515 24.0532 20.5115 24.0532 21.6316V22.4316M26.0532 27.9316V32.9316M30.0532 27.9316V32.9316M19.0532 22.4316H37.0532M35.0532 22.4316V33.6316C35.0532 35.3118 35.0532 36.1519 34.7262 36.7936C34.4386 37.3581 33.9797 37.817 33.4152 38.1047C32.7735 38.4316 31.9334 38.4316 30.2532 38.4316H25.8532C24.1731 38.4316 23.333 38.4316 22.6913 38.1047C22.1268 37.817 21.6678 37.3581 21.3802 36.7936C21.0532 36.1519 21.0532 35.3118 21.0532 33.6316V22.4316" stroke="#D12F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </motion.div>

                {/* Content with staggered animation */}
                <DialogHeader className="text-center space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0, duration: 0.25 }
                    }}
                  >
                    <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
                  </motion.div>
                  <motion.p 
                    className="text-sm text-gray-600 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.25, duration: 0.25 }
                    }}
                  >
                    {description}
                  </motion.p>
                </DialogHeader>
                
                {/* Buttons with staggered animation */}
                <motion.div 
                  className="flex gap-3 mt-4"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0, duration: 0.25 }
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-[45%]"
                  >
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline" 
                      className="w-full hover:bg-merit-red bg-merit-white hover:text-merit-white text-red-900 hover:border-merit-red hover:border-2 transition-colors duration-200"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-[52%]"
                  >
                    <Button
                      type="button"
                      onClick={handleConfirm}
                      className="w-full bg-red-900 hover:bg-merit-white text-white hover:border-red-900 hover:border-2 transition-colors duration-200"
                      disabled={loading}
                    >
                      <motion.div
                        initial={false}
                        animate={loading ? { opacity: 1 } : { opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {loading ? <Spinner2 /> : "Delete"}
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}