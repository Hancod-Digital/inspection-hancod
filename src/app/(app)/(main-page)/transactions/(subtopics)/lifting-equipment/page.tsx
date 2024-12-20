'use client'
import React, { useState } from 'react'
import Table from './_components/Table'
import Header from './_components/Header'
import AddForm from './_components/AddEquipment'
import { motion, AnimatePresence } from 'framer-motion' // Import Framer Motion
import Location from '../../../masters/(subtopics)/location/_components/AddEquipment'
import Equipment from '../../../masters/(subtopics)/equipment/_components/AddEquipment'
import Standard from '../../../masters/(subtopics)/standard/_components/AddEquipment'
import Owner from '../../../masters/(subtopics)/owner/_components/AddEquipment'
import Manufacturer from '../../../masters/(subtopics)/manufacturer/_components/AddEquipment'
import Area from '../../../masters/(subtopics)/area/_components/AddEquipment'
const LiftingEquipment = () => {
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const handleCloseAdd = () => {
        setIsAdd(false);
    };
    const handleOpenAdd = () => {
        setIsAdd(true)
    }
    const [isLocation, setIsLocation] = useState<boolean>(false);
    const [isEquipment, setIsEquipment] = useState<boolean>(false);
    const [isStandard, setIsStandard] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isManufacturer, setIsManufacturer] = useState<boolean>(false);
    const [isSite, setIsSite] = useState<boolean>(false);
    const [isArea, setIsArea] = useState<boolean>(false);


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
               {isOwner && "Owner"}
               {isManufacturer && "Manufacturer"}
               {!isSite && !isArea && !isLocation && !isEquipment && !isStandard && !isOwner && !isManufacturer && "Lifting Equipment"}
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
                        <Header setSearchValue={setSearchValue} onOpen={handleOpenAdd} />
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
                        <Table searchValue={searchValue}  setIsSite={setIsSite} setIsArea={setIsArea} setIsLocation={setIsLocation} setIsEquipment={setIsEquipment} setIsStandard={setIsStandard} setIsOwner={setIsOwner} setIsManufacturer={setIsManufacturer} isLocation={isLocation} isEquipment={isEquipment} isStandard={isStandard} isOwner={isOwner} isManufacturer={isManufacturer} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="addForm"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >{isLocation && <Location onClose={()=>setIsLocation(false)} setIsSite={setIsSite} setIsArea={setIsArea} />}
                        {isEquipment && <Equipment onClose={() => setIsEquipment(false)} setIsManufacturer={setIsManufacturer} setIsStandard={setIsStandard} setIsLocation={setIsLocation} isManufacturer={isManufacturer} isStandard={isStandard} isLocation={isLocation} />}
                        {isStandard && <Standard onClose={()=>setIsStandard(false)} />}
                        {isOwner && <Owner onClose={()=>setIsOwner(false)} />}
                        {isManufacturer && <Manufacturer onClose={()=>setIsManufacturer(false)} />}
                        {!isLocation && !isEquipment && !isStandard && !isOwner && !isManufacturer && <AddForm onClose={handleCloseAdd} setIsLocation={setIsLocation} setIsEquipment={setIsEquipment} setIsStandard={setIsStandard} setIsOwner={setIsOwner} setIsManufacturer={setIsManufacturer} />}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default LiftingEquipment