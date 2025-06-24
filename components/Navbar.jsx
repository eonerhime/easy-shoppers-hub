"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Shield,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import getUserSession from "@/actions/auth/getUserSession";
import { logoutAction } from "@/actions/auth/auth";
import { useRouter } from "next/navigation";
import useCartStore from "@/hooks/useCartStore";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mobileMenuRef = useRef(null);
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const pathname = usePathname();

  // Function to get user session
  const refreshUserSession = async () => {
    try {
      setIsLoading(true);
      const result = await getUserSession();

      if (result) {
        const { user: activeUser, session: activeSession } = result;

        setUser(activeUser);
        setSession(activeSession);

        return { user: activeUser, session: activeSession }; // Fix: use activeUser and activeSession
      } else {
        setUser(null);
        setSession(null);

        return null;
      }
    } catch (error) {
      console.error("Error getting user session:", error);
      setUser(null);
      setSession(null);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Check for user session on page load
  useEffect(() => {
    refreshUserSession();
  }, []);

  // Close navbar when clicking outside of it or any item in it (except search)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      if (
        error?.code === 401 ||
        error?.message?.toLowerCase().includes("missing scope")
      ) {
        // User is already logged out — safe to ignore
        console.warn("User already logged out or no active session.");
      } else {
        console.error("Logout failed:", error);
      }
    } finally {
      setSession(null);
      setUser(null);
      setIsMobileMenuOpen(false); // Close mobile menu on logout
      router.push("/");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchQuery.length) {
      router.push(`/search?searchTerm=${searchQuery}`);

      setIsMobileMenuOpen(false); // Close mobile menu on search
    }
  };

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false); // Close mobile menu on item click
  };

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b-2 border-gray-200">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent uppercase">
                esh
              </span>
            </Link>
          </div>

          {/* Centered Search - Hidden below md */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-md">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-100 border-gray-400 w-full"
              />
            </form>
          </div>

          {/* Right side - Cart and User menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div>
              <Link href="/cart" onClick={handleMenuItemClick}>
                <Button
                  size="icon"
                  className="relative bg-transparent hover:bg-transparent cursor-pointer"
                  variant="ghost"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-blue-500" />
                  {cartItems.length > 0 && (
                    <span className="absolute top-[-3px] right-[-3px] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {cartItems.length}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Show loading state */}
            {isLoading && (
              <div className="flex items-center">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white">
                    -
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Show user dropdown when user is logged in and not loading */}
            {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-blue-600 hover:via-teal-600 hover:to-green-600 text-white">
                        {user.name
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 " align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none bg-gradient-to-r from-purple-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                        {user?.name}
                      </p>

                      <p className="text-xs leading-none text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="bg-purple-800" />

                  <DropdownMenuItem className="focus:text-purple-600">
                    <Link href="/profile" className="flex w-full">
                      <User className="mr-2 h-4 w-4" />

                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:text-purple-600">
                    <Link href="/orders" className="flex w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />

                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:text-purple-600">
                    <Link
                      href="/privacy-policy"
                      className="flex w-full items-center"
                    >
                      <Shield className="mr-2 h-4 w-4" />

                      <span>Privacy Policy</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:text-purple-600">
                    <Link
                      href="/terms-of-service"
                      className="flex w-full items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />

                      <span>Terms of Service</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-purple-800" />

                  <DropdownMenuItem
                    className=" focus:text-purple-600 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />

                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Show login/signup buttons only when not loading and no user */}
            {!isLoading && !user && (
              <div className="flex space-x-2">
                <div>
                  <Link
                    href={`/auth?type=login&from=${encodeURIComponent(
                      pathname
                    )}`}
                  >
                    <Button
                      variant="outline"
                      className="bg-gradient-to-r from-purple-600 via-teal-500 to-green-500 bg-clip-text text-transparent border-2 border-gray-300 cursor-pointer"
                    >
                      Login
                    </Button>
                  </Link>
                </div>

                <div>
                  <Link
                    href={`/auth?type=signup&from=${encodeURIComponent(
                      pathname
                    )}`}
                  >
                    <Button className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white cursor-pointer">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={handleSearch} className=" mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white  "
              />
            </form>

            <Link
              href="/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-blue-500"
              onClick={handleMenuItemClick}
            >
              Cart
            </Link>
          </div>

          <div className="border-t border-gray-700 pt-4 pb-3">
            {!isLoading && user && (
              <div className="flex items-center px-5 mb-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-8 w-8 border-2 border-gray-700">
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="ml-3">
                  <div className="text-base font-medium bg-gradient-to-r from-purple-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                    {user.email}
                  </div>

                  <div className="text-sm font-medium text-gray-500">
                    {/* {user?.identifier} */}
                  </div>
                </div>
              </div>
            )}

            {!isLoading && user && (
              <div className="mt-3 px-2 space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-blue-500"
                  onClick={handleMenuItemClick}
                >
                  Your Profile
                </Link>

                <Link
                  href="/orders"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-blue-500"
                  onClick={handleMenuItemClick}
                >
                  Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-white hover:bg-blue-500 w-full text-left cursor-pointer"
                >
                  Log out
                </button>
              </div>
            )}
            {!isLoading && !user && (
              <div className="mt-3 px-2 space-y-1">
                <Link
                  href="/auth?type=login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-blue-500"
                  onClick={handleMenuItemClick}
                >
                  Login
                </Link>

                <Link
                  href="/auth?type=signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-blue-500"
                  onClick={handleMenuItemClick}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
