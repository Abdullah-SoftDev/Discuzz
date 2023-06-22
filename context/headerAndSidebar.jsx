'use client'
import { createContext, useContext, useState } from "react";

const HeaderAndSideBarContext = createContext()

export default function HeaderAndSideBarProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return <HeaderAndSideBarContext.Provider value={{ sidebarOpen,setSidebarOpen }}>
        {children}
    </HeaderAndSideBarContext.Provider>
}

export const useHeaderAndSideBar = () => useContext(HeaderAndSideBarContext)