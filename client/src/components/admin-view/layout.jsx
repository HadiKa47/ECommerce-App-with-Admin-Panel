import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

export default function AdminLayout() {
  return (
    <div className="flex w-full min-h-screen">
      {/* admin sidebar */}
      <AdminSideBar />
      <div className="flex flex-col flex-1">
        {/* admin header */}
        <AdminHeader />
        <main className="flex flex-col flex-1 p-4 bg-muted/40 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
