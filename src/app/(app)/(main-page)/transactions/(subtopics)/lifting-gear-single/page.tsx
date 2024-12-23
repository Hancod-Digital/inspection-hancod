'use client'
import React, { useState } from 'react' 
import Header from './_components/Header'
import AddForm from './_components/AddLiftingGearSingle'
import { motion, AnimatePresence } from 'framer-motion' // Import Framer Motion

import dynamic from 'next/dynamic'
const Table = dynamic(
    () => import('./_components/Table'),
    { ssr: false }
  )

  import Location from '@/app/(app)/(main-page)/masters/(subtopics)/location/_components/AddEquipment'
  import Equipment from '@/app/(app)/(main-page)/masters/(subtopics)/equipment/_components/AddEquipment'
  import Standard from '@/app/(app)/(main-page)/masters/(subtopics)/standard/_components/AddEquipment'
  import Manufacturer from '@/app/(app)/(main-page)/masters/(subtopics)/manufacturer/_components/AddEquipment'
const LiftingEquipment = () => {
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const handleCloseAdd = () => {
        setIsAdd(false);
    };
    
    const handleOpenAdd = () => {
        setIsAdd(true)
    }
    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };
    const [changed, setChanged] = useState<boolean>(false);
    const [isSite, setIsSite] = useState<boolean>(false);
    const [isArea, setIsArea] = useState<boolean>(false);
    const [isLocation, setIsLocation] = useState<boolean>(false);
    const [isEquipment, setIsEquipment] = useState<boolean>(false);
    const [isStandard, setIsStandard] = useState<boolean>(false);
    const [isManufacturer, setIsManufacturer] = useState<boolean>(false);
    return (
        <motion.div 
            className='w-full bg-[#fafbfb]'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2 
                className='px-5 pt-5 text-xl font-[700]'
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
               {isSite && "Site"}
               {isArea && "Area"}
               {isLocation && "Location"}
               {isEquipment && "Equipment"}
               {isStandard && "Standard"}
               {isManufacturer && "Manufacturer"}
               {!isSite && !isArea && !isLocation && !isEquipment && !isStandard && !isManufacturer && "Lifting Gear Single"}
            </motion.h2>
            
            <AnimatePresence mode="wait">
                {!isAdd && (
                    <motion.div
                        key="header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Header onOpen={handleOpenAdd} onSearchChange={setSearchValue} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {!isAdd ? (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Table setIsSite={setIsSite} setIsArea={setIsArea} searchValue={searchValue} setIsLocation={setIsLocation} setIsEquipment={setIsEquipment} setIsStandard={setIsStandard} setIsManufacturer={setIsManufacturer} isLocation={isLocation} isEquipment={isEquipment} isStandard={isStandard} isManufacturer={isManufacturer} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="addForm"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        {isLocation && <Location onClose={()=>setIsLocation(false)} setIsSite={setIsSite} setIsArea={setIsArea} />}
                        {isEquipment && <Equipment changed={changed} onClose={()=>setIsEquipment(false)} setIsManufacturer={setIsManufacturer} setIsStandard={setIsStandard} setIsLocation={setIsLocation} isManufacturer={isManufacturer} isStandard={isStandard} isLocation={isLocation} />}
                        {isStandard && <Standard onClose={()=>setIsStandard(false)} />}
                        {isManufacturer && <Manufacturer onClose={()=>setIsManufacturer(false)} />}
                        {!isLocation && !isEquipment && !isStandard && !isManufacturer && (
                        <AddForm onClose={handleCloseAdd} setIsLocation={setIsLocation} setIsEquipment={setIsEquipment} setIsStandard={setIsStandard} setIsManufacturer={setIsManufacturer} />
                    )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default LiftingEquipment