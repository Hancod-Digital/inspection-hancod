'use client'
import React, { useEffect, useState } from "react";
import Table from "./_components/Table";
import Header from "./_components/Header";
import AddForm from "./_components/AddProfile";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import PrintCardTable from "./_components/PrintCardTable";
import CertificateTable from "./_components/CertificateTable";
import { makeApiCall } from "@/lib/apicaller";
import { StudentService } from "@/services/api/students-service";

const LiftingGearMulti = () => {
  const [activeTab, setActiveTab] = useState("User Details");
  const [changed, setChanged] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleCloseAdd = () => {
    setIsAdd(false);
  };
  const handleOpenAdd = () => {
    setIsAdd(true);
  };

  useEffect(() => {
    makeApiCall(() => new StudentService().getStudents(activeTab === "User Details" ? true : false,activeTab === "Certificate" && true), {
      afterSuccess: (data:any) => {
        setData(data);
      },
    });
  }, [changed, activeTab]);

  const rearrangedData = data
    ? [...data].sort((a:any, b:any) => {
        const aMatch = a.name.toLowerCase().includes(searchValue.toLowerCase());
        const bMatch = b.name.toLowerCase().includes(searchValue.toLowerCase());
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      })
    : [];

  return (
    <motion.div
      className="w-full bg-[#fafbfb]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!isAdd && (
        <>
          <div className="flex w-full space-x-4 p-5">
            <Button
              className={`px-4 w-1/4 py-2 rounded-lg ${
                activeTab === "User Details"
                  ? "bg-primary text-white  hover:text-white hover:bg-primary"
                  : "bg-gray-100 text-gray-500 hover:text-primary hover:border-primary border border"
              }`}
              onClick={() => setActiveTab("User Details")}
            >
              User Details
            </Button>
            <Button
              className={`px-4 w-1/4  py-2 rounded-lg ${
                activeTab === "Print Cards"
                  ? "bg-primary text-white  hover:text-white hover:bg-primary"
                  : "bg-gray-100 text-gray-500 hover:text-primary hover:border-primary border border"
              }`}
              onClick={() => setActiveTab("Print Cards")}
            >
              Print Cards
            </Button>
            <Button
              className={`px-4 w-1/4  py-2 rounded-lg ${
                activeTab === "Certificate"
                  ? "bg-primary text-white hover:text-white hover:bg-primary"
                  : "bg-gray-100 text-gray-500 hover:text-primary hover:border-primary border border"
              }`}
              onClick={() => setActiveTab("Certificate")}
            >
              Certificate
            </Button>
          </div>
          <motion.h2
            className="px-5  text-xl font-[700]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {activeTab}
          </motion.h2>
        </>
      )}
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
            {activeTab === "User Details" ? (
              <Table data={rearrangedData} setChanged={setChanged} changed={changed} />
            ) : activeTab === "Print Cards" ? (
              <PrintCardTable data={rearrangedData} changed={changed} setChanged={setChanged} />
            ) : (
              <CertificateTable data={rearrangedData} setChanged={setChanged} changed={changed} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="addForm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <AddForm changed={changed} setChanged={setChanged} onClose={handleCloseAdd} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LiftingGearMulti;
