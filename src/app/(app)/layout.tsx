import Sidebar from "@/components/layout/Sidebar";
import Navbar from "./_components/navbar/Navbar";

export default function Layout({ children }:{children:any}) {
    return(
        <>
        <Navbar />
        <div className="flex relative  leading-loose">

        <Sidebar />
            {children}
        </div></>
    )
}