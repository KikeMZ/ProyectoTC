import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Sidebar from "../components/sidebar"
import Header from "../components/header"
import Toast from "../components/toast"

const LayoutAlumno = () => {

    return(
        <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6 scrollbar-hide">
            <Toast></Toast>
            <Sidebar/>
            <div className="xl:col-span-5 bg bg-secondary-900 ">
                <div className="h-full overflow-y-scroll scrollbar-hide p-4 bg-secondary-100">
                    <Outlet/>
                </div>
            </div>
        </div>
    )


};

export default LayoutAlumno;