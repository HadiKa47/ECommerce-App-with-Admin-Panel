import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { logout, resetTokenAndCredentials } from "@/store/auth-slice";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleLogout() {
    // dispatch(logout());
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
    toast({
      title: "Logout Successful",
      description: "You have successfully logged out.",
      className: "bg-green-500 text-white",
    });
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
