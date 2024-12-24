'use client'
import React, { useEffect, useState } from 'react'
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
import { MasterService } from '@/services/api/masters-service'
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
    const [changed,setChanged] = useState<any>(false);
    const [minorCategoryOptions, setMinorCategoryOptions] = useState<any[]>([]);
    const [supplierOptions, setSupplierOptions] = useState<any[]>([]);
    const [standardOptions, setStandardOptions] = useState<any[]>([]);
    const [annexureOptions, setAnnexureOptions] = useState<any[]>([]);
    const [locationOptions, setLocationOptions] = useState<any[]>([]);
    const [ownerOptions, setOwnerOptions] = useState<any[]>([]);
    useEffect(() => {
        const fetchOptions = async () => {
          try {
            const masterService = new MasterService();
            // Fetch minor category options
            const minorCategories = await masterService.getAllSubtopicDetails('minor_category');
            if (minorCategories) {
              setMinorCategoryOptions(minorCategories.filter((item:any)=>item.status==="ACTIVE"));
            }
    
            // Fetch supplier options
            const suppliers = await masterService.getAllSubtopicDetails('manufacturer');
            if (suppliers) {
                
              setSupplierOptions(suppliers.filter((item:any)=>item.status==="ACTIVE"));
            }
    
            // Fetch standard options
            const standards = await masterService.getAllSubtopicDetails('standard');
            if (standards) {
              setStandardOptions(standards.filter((item:any)=>item.status==="ACTIVE"));
            }
    
            // Fetch annexure options
            const annexures = await masterService.getAllSubtopicDetails('annexure');
            if (annexures) {
              setAnnexureOptions(annexures.filter((item:any)=>item.status==="ACTIVE"));
            }
    
            // Fetch location options
            const locations = await masterService.getAllSubtopicDetails('location');
            if (locations) {
              setLocationOptions(locations.filter((item:any)=>item.status==="ACTIVE"));
            }
            // Fetch owner options
            const owners = await masterService.getAllSubtopicDetails('owner');
            if (owners) {
              setOwnerOptions(owners.filter((item:any)=>item.status==="ACTIVE"));
            }
    
          
          } catch (error) {
            console.error('Error fetching options:', error);
            // Optionally, handle the error (e.g., show a notification)
          }
        };
        fetchOptions();
        console.log("refetchiongg");
        
      }, [changed]);
    return (
        <motion.div 
            className='w-full bg-[#fafbfb] h-full relative'
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
                        {isEquipment && <Equipment changed={changed} onClose={() => setIsEquipment(false)} setIsManufacturer={setIsManufacturer} setIsStandard={setIsStandard} setIsLocation={setIsLocation} isManufacturer={isManufacturer} isStandard={isStandard} isLocation={isLocation} minorCategoryOptions={minorCategoryOptions} supplierOptions={supplierOptions} standardOptions={standardOptions} annexureOptions={annexureOptions} locationOptions={locationOptions} ownerOptions={ownerOptions} />}
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