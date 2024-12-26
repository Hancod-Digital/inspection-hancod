'use client'
import React, { useState } from 'react'
import Table from './_components/Table'
import Header from './_components/Header'
import AddForm from './_components/AddEquipment'
import { motion, AnimatePresence } from 'framer-motion' // Import Framer Motion

const JobOrders = () => {
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isState, setIsState] = useState<boolean>(false)
    const handleCloseAdd = () => {
        setIsAdd(false);
    };
    const handleOpenAdd = () => {
        setIsAdd(true)
    }
    const [search,setSearch]=useState<string>("")
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
               Job Orders
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
                        <Header search={search} setSearch={setSearch} onOpen={handleOpenAdd} />
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
                        <Table isState={isState} setIsState={setIsState} search={search} setSearch={setSearch} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="addForm"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                    >
                        <AddForm onClose={handleCloseAdd} setIsState={setIsState} isState={isState} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default JobOrders