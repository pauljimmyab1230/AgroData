import { useState, useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const handleOpenMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggle={handleToggleSidebar}
        onMobileClose={handleCloseMobileSidebar}
      />

      <div
        className="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{ marginLeft: isDesktop ? (sidebarCollapsed ? 76 : 256) : 0 }}
      >
        <Header onToggleSidebar={handleOpenMobileSidebar} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto min-h-full w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
