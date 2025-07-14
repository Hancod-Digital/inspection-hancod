"use client"
import Sidebar from '@/components/layout/Sidebar'
import React from 'react'
import { motion } from 'framer-motion'

export default function page() {
  return (
    <motion.h2 
    className='px-5 pt-5 text-xl font-[700]'
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
>
   Reports
</motion.h2> 
  )
}
