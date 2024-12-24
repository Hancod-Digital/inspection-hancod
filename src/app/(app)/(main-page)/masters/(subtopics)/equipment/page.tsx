'use client'
import React, { useEffect, useState } from 'react'
import Table from './_components/Table'
import Header from './_components/Header'
import AddForm from './_components/AddEquipment'
import { motion, AnimatePresence } from 'framer-motion' // Import Framer Motion
import Manufacturer from '../_common/Manufacturer'
import Standard from '../_common/Standard'
import Location from '../_common/Location'
import { useSubtopic } from '@/context/SubtopicContext'
import { MasterService } from '@/services/api/masters-service'
const Equipment = () => {
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState("");
    const { getAllSingleSubtopic } = useSubtopic();
    const [isManufacturer, setIsManufacturer] = useState<boolean>(false);
    const [isStandard, setIsStandard] = useState<boolean>(false);
    const [isLocation, setIsLocation] = useState<boolean>(false);
    const handleCloseAdd = () => {
        setIsAdd(false);
    };
    const handleOpenAdd = () => {
        setIsAdd(true)
    }
    const [changed,setChanged] = useState<any>(false);
    const handleCloseManufacturer = () => {
        setIsManufacturer(false);
    }
    const handleCloseStandard = () => {
        setIsStandard(false);
    }
    const handleCloseLocation = () => {
        setIsLocation(false);
    }
    console.log(changed);
    
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
              setMinorCategoryOptions(minorCategories);
            }
    
            // Fetch supplier options
            const suppliers = await masterService.getAllSubtopicDetails('manufacturer');
            if (suppliers) {
                console.log("suppliers",suppliers);
                
              setSupplierOptions(suppliers);
            }
    
            // Fetch standard options
            const standards = await masterService.getAllSubtopicDetails('standard');
            if (standards) {
              setStandardOptions(standards);
            }
    
            // Fetch annexure options
            const annexures = await masterService.getAllSubtopicDetails('annexure');
            if (annexures) {
              setAnnexureOptions(annexures);
            }
    
            // Fetch location options
            const locations = await masterService.getAllSubtopicDetails('location');
            if (locations) {
              setLocationOptions(locations);
            }
            // Fetch owner options
            const owners = await masterService.getAllSubtopicDetails('owner');
            if (owners) {
              setOwnerOptions(owners);
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
                {isManufacturer &&"Manufacturer"}
                {isStandard && "Standard"}
                {isLocation && "Location"}
                {!isManufacturer && !isStandard && !isLocation && "Equipment"}
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
                        <Table searchValue={searchValue} isManufacturer={isManufacturer} isStandard={isStandard} isLocation={isLocation}  setIsManufacturer={setIsManufacturer} setIsStandard={setIsStandard} setIsLocation={setIsLocation}/>
                    </motion.div>
                ) : (
                    <motion.div
                        key="addForm"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >  
                        {isManufacturer && (<Manufacturer setChanged={setChanged} changed={changed} onClose={handleCloseManufacturer}/>)}
                        {isStandard && (<Standard setChanged={setChanged} changed={changed} onClose={handleCloseStandard} />)}
                        {isLocation && (<Location setChanged={setChanged} changed={changed} onClose={handleCloseLocation}/>)}
                    
                        {!isManufacturer && !isStandard && !isLocation && (<AddForm minorCategoryOptions={minorCategoryOptions} supplierOptions={supplierOptions} standardOptions={standardOptions} annexureOptions={annexureOptions} locationOptions={locationOptions} ownerOptions={ownerOptions} changed={changed} onClose={handleCloseAdd} isManufacturer={isManufacturer} isStandard={isStandard} isLocation={isLocation}  setIsManufacturer={setIsManufacturer} setIsStandard={setIsStandard} setIsLocation={setIsLocation}/>)}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Equipment