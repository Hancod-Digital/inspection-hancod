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
import Layout from "./_components/BulkWright/_components/Layout";

const PAGE_SIZE = 6;

const LiftingGearMulti = () => {
  const [activeTab, setActiveTab] = useState("User Details");
  const [changed, setChanged] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [data, setData] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState<{ value: string; type: "name" | "card" }>({
    value: "",
    type: "name",
  });

  const handleCloseAdd = () => {
    setIsAdd(false);
  };
  const handleOpenAdd = () => {
    setIsAdd(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, isBulk, searchParams]);

  useEffect(() => {
    makeApiCall(
      () =>
        new StudentService().getStudents(
          activeTab === "User Details",
          activeTab === "Certificate",
          {
            page: currentPage,
            pageSize: PAGE_SIZE,
            searchValue: searchParams.value,
            searchType: searchParams.type,
          }
        ),
      {
        afterSuccess: (response: any) => {
          const items = response?.data ?? [];
          const count = response?.count ?? 0;
          const nextTotalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

          setTotalPages(nextTotalPages);

          if (currentPage > nextTotalPages) {
            setData(items);
            setCurrentPage(nextTotalPages);
            return;
          }

          setData(items);
        },
      }
    );
  }, [changed, activeTab, isBulk, currentPage, searchParams]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(nextPage);
  };



  return (
    <motion.div
      className="w-full bg-[#fafbfb] h-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >< motion.h2 
    className='px-5 pt-5 text-xl font-[700]'
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
>
  {isAdd ? "Add Profile" : "Print Cards"}
</motion.h2>

      {!isAdd && !isBulk && (
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
        {!isAdd && !isBulk && (
          <motion.div
            key="header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Header 
            onOpen={handleOpenAdd} 
            setIsBulk={setIsBulk} 
            onSearchChange={(value: string, type: string) =>
              setSearchParams({ value, type: type === "card" ? "card" : "name" })
            } 
          /> 
          {/* //for sorted search */}
            {/* <Header onOpen={handleOpenAdd} setIsBulk={setIsBulk} onSearchChange={setSearchValue} /> */}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isBulk? (
<Layout  setIsBulk={setIsBulk} /> 
        ):!isAdd ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "User Details" ? (
              <Table
                data={data}
                setChanged={setChanged}
                changed={changed}
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onPageChange={goToPage}
              />
            ) : activeTab === "Print Cards" ? (
              <PrintCardTable
                data={data}
                changed={changed}
                setChanged={setChanged}
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onPageChange={goToPage}
              />
            ) : (
              <CertificateTable
                data={data}
                setChanged={setChanged}
                changed={changed}
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onPageChange={goToPage}
              />
            )}
          </motion.div>
        )  : (
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
 
