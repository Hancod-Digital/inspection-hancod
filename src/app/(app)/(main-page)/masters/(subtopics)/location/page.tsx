'use client'
import React, { useState } from 'react'
import Table from './_components/Table'
import Header from './_components/Header'
import AddForm from './_components/AddEquipment'
import { motion, AnimatePresence } from 'framer-motion' // Import Framer Motion
import Area from '../_common/Area'
import Site from '../_common/Site'
const Location = () => {
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState("");
    const handleCloseAdd = () => {
        setIsAdd(false);
    };
    const handleOpenAdd = () => {
        setIsAdd(true)
    }
    const [changed,setChanged] = useState(false)
   const [isArea,setIsArea] = useState<boolean>(false)
    const [isSite,setIsSite] = useState<boolean>(false)
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
               {isArea && "Area"}
               {isSite && "Site"}
               {!isArea && !isSite && "Location"}
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
                        <Header onOpen={handleOpenAdd}  onSearchChange={setSearchValue} />
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
                        <Table  searchValue={searchValue} setIsSite={setIsSite} isSite={isSite} setIsArea={setIsArea} isArea={isArea} setIsChanged={setChanged} isChanged={changed}/>
                    </motion.div>
                ) : (
                    <motion.div
                        key="addForm"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    > {isArea && (<Area onClose={() => setIsArea(false)} changed={changed} setChanged={setChanged} />)}
                    {isSite && (<Site onClose={()=>setIsSite(false)} changed={changed} setChanged={setChanged} />)}
                        {!isArea && !isSite && (<AddForm onClose={handleCloseAdd} setIsSite={setIsSite} setIsArea={setIsArea} setIsChanged={setChanged} isChanged={changed}/>)}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Location