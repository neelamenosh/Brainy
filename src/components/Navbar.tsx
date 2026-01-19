import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, Menu, X, LogOut, User, GraduationCap, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = user
    ? [
        { name: "Home", to: "/home" },
        { name: user.role === 'Student' ? "Results" : "Services", to: "/services" },
        { name: "Pricing", to: "/pricing" },
        { name: "About", to: "/about" },
        { name: "Contact", to: "/contact" },
      ]
    : [
        { name: "Home", to: "/" },
        { name: "Features", to: "/#features" },
        { name: "About", to: "/about" },
        { name: "Contact", to: "/contact" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 liquid-glass-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/home" : "/"} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 gradient-aurora rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-2.5 rounded-xl gradient-aurora shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="font-bold text-xl gradient-text-aurora">
              Brainy
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === tab.to
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {location.pathname === tab.to && (
                  <span className="absolute inset-0 rounded-xl liquid-glass glow-violet opacity-50" />
                )}
                <span className="relative">{tab.name}</span>
              </Link>
            ))}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-4 gap-2 hover:bg-white/5 rounded-xl transition-all duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 gradient-aurora rounded-full blur-sm opacity-60" />
                      <div className="relative w-8 h-8 rounded-full gradient-aurora flex items-center justify-center text-white font-semibold text-sm">
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                    </div>
                    <span className="hidden lg:inline text-gray-300">{user.fullName?.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 liquid-glass-strong border-white/10 rounded-2xl p-2">
                  <div className="px-3 py-3 border-b border-white/10 mb-2">
                    <p className="font-semibold text-white">{user.fullName}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-xs gradient-text-static mt-1 font-medium">{user.department}</p>
                  </div>
                  <DropdownMenuItem className="gap-2 cursor-pointer rounded-xl hover:bg-white/5 transition-colors">
                    <User className="w-4 h-4 text-violet-400" />
                    <span className="text-gray-300">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer rounded-xl hover:bg-white/5 transition-colors">
                    <GraduationCap className="w-4 h-4 text-pink-400" />
                    <span className="text-gray-300">My Progress</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 my-2" />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer rounded-xl hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="relative overflow-hidden rounded-xl btn-liquid gradient-aurora text-white font-semibold px-6 shadow-lg glow-violet">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-all duration-300 text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden liquid-glass-strong border-t border-white/10 fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((tab, index) => (
              <Link
                key={tab.to}
                to={tab.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 slide-up stagger-${index + 1} ${
                  location.pathname === tab.to
                    ? "liquid-glass text-white glow-violet"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                style={{ opacity: 0 }}
              >
                {tab.name}
              </Link>
            ))}

            {user ? (
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="px-4 py-2 mb-2">
                  <p className="font-semibold text-white">{user.fullName}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium gradient-aurora text-white text-center glow-violet"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
