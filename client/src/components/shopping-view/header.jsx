import { HousePlug, Menu, ShoppingCart, LogOut, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { logout, resetTokenAndCredentials } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";

export default function ShoppingHeader() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function isActiveButton(menuItem) {
    const isHomeActive =
      menuItem.id === "home" && location.pathname === "/shop/home";
    const isProductsActive =
      menuItem.id === "products" &&
      (location.pathname === "/shop/products" ||
        (location.pathname.includes("listing") &&
          !searchParams.get("category")));
    const isCategoryActive =
      menuItem.id !== "products" &&
      searchParams.get("category")?.split(",").includes(menuItem.id);
    const isSearchActive =
      menuItem.id === "search" && location.pathname.includes("search");

    return (
      isHomeActive || isProductsActive || isCategoryActive || isSearchActive
    );
  }

  function MenuItems() {
    const navigate = useNavigate();

    function handleNavigate(getCurrentMenuItem) {
      sessionStorage.removeItem("filters");
      const currentFilter =
        getCurrentMenuItem.id !== "home" &&
        getCurrentMenuItem.id !== "products" &&
        getCurrentMenuItem.id !== "search"
          ? { category: [getCurrentMenuItem.id] }
          : null;

      sessionStorage.setItem("filters", JSON.stringify(currentFilter));

      const targetPath =
        location.pathname.includes("listing") && currentFilter
          ? `/shop/listing?category=${getCurrentMenuItem.id}`
          : getCurrentMenuItem.path;

      navigate(targetPath);
    }

    return (
      <nav className="flex flex-col gap-6 mb-3 lg:mb-0 lg:items-center lg:flex-row">
        {shoppingViewHeaderMenuItems.map((menuItem) => (
          <Button
            onClick={() => handleNavigate(menuItem)}
            className={`text-sm font-medium cursor-pointer rounded-md ${
              isActiveButton(menuItem)
                ? "bg-primary text-white"
                : "bg-transparent text-black"
            }`}
            key={menuItem.id}
          >
            {menuItem.label}
          </Button>
        ))}
      </nav>
    );
  }

  function HeaderRightContent() {
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    useEffect(() => {
      dispatch(fetchCartItems(user?.id));
    }, [dispatch]);

    return (
      <div className="flex items-center gap-3">
        <Sheet
          open={openCartSheet}
          onOpenChange={() => setOpenCartSheet(false)}
        >
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="outline"
            size="icon"
            className="relative"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-[-5px] right-[2px] font-bold text-sm text-red-500">
              {cartItems?.items?.length || 0}
            </span>
            <span className="sr-only">User Cart</span>
          </Button>
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={
              cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items
                : []
            }
          />
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
              <AvatarFallback className="font-extrabold text-white bg-black">
                {user?.userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="w-4 h-4 mr-2" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isMenuOpen && <span className="font-bold">Toggle Header Menu</span>}
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="w-6 h-6" />
          <span className="font-bold">StyleHub</span>
        </Link>

        <Sheet onOpenChange={(open) => setIsMenuOpen(open)}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <div className="mb-6">
              <SheetTitle>
                <HeaderRightContent />
              </SheetTitle>
            </div>
            <MenuItems />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:flex">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}
