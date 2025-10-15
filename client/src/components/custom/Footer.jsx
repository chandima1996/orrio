import React from "react";
import { Hotel, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-gray-300 bg-gray-900">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Section 1: Logo and Brand */}
          <div className="col-span-1 mb-6 md:mb-0">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Hotel className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Orrio
              </span>
            </Link>
            <p className="text-sm">
              Your ultimate destination for finding the perfect stay. Powered by
              AI, designed for you.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="mb-4 font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/hotels"
                  className="transition-colors hover:text-primary"
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Connect */}
          <div>
            <h3 className="mb-4 font-bold text-white">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">info@orrio.com</li>
              <li className="flex items-start">+94 11 234 5678</li>
              <li className="flex items-start">Colombo, Sri Lanka</li>
            </ul>
          </div>

          {/* Section 4: Social Media */}
          <div>
            <h3 className="mb-4 font-bold text-white">Follow Us</h3>
            <div className="flex items-center gap-4">
              <Link to="#" className="transition-colors hover:text-primary">
                <Github />
              </Link>
              <Link to="#" className="transition-colors hover:text-primary">
                <Twitter />
              </Link>
              <Link to="#" className="transition-colors hover:text-primary">
                <Linkedin />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-12 text-sm text-center border-t border-gray-700">
          <p>&copy; {new Date().getFullYear()} Orrio. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
