import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hotel, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencyToggle } from "./CurrencyToggle";
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

const navLinks = [
  { title: "Hotels", href: "/hotels" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const linkClasses =
    "text-sm font-medium hover:text-primary transition-colors";
  const mobileLinkClasses =
    "text-lg font-medium hover:text-primary transition-colors";

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-4 py-3 border-b sm:px-8 md:px-12 lg:px-20 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Hotel className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Orrio
          </span>
        </Link>

        <nav className="items-center hidden gap-6 md:flex">
          <Link to="/" className={linkClasses}>
            Home
          </Link>
          <SignedIn>
            <Link
              to={isAdmin ? "/admin/dashboard" : "/dashboard"}
              className={linkClasses}
            >
              {isAdmin ? "Admin Dashboard" : "Dashboard"}
            </Link>
          </SignedIn>
          {navLinks.map((link) => (
            <Link key={link.title} to={link.href} className={linkClasses}>
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <CurrencyToggle />
          <ThemeToggle />
          <div className="items-center hidden gap-2 sm:flex">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
          <div className="md:hidden">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute left-0 w-full shadow-lg md:hidden top-full bg-background/95 backdrop-blur-sm"
        >
          <nav className="flex flex-col items-center gap-6 py-8">
            <Link
              to="/"
              className={mobileLinkClasses}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <SignedIn>
              <Link
                to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                className={mobileLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>
            </SignedIn>
            {navLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className={mobileLinkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-6 mt-4 border-t sm:hidden">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Sign Up</Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
