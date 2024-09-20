import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { logout } from "@/store/auth-slice";
import { useDispatch } from "react-redux";

export default function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logout());
  }
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex justify-end flex-1">
        <Button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}
