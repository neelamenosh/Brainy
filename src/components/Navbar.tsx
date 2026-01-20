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
            <div className="w-10 h-10 rounded-2xl bg-secondary/80 border border-border flex items-center justify-center">
              <Brain className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">Brainy</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  location.pathname === tab.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {location.pathname === tab.to && (
                  <span className="absolute inset-0 rounded-xl bg-secondary/70" />
                )}
                <span className="relative">{tab.name}</span>
              </Link>
            ))}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-3 gap-2 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-secondary/80 border border-border flex items-center justify-center text-foreground font-semibold text-sm">
                      {user.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden lg:inline text-foreground/80">{user.fullName?.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 liquid-glass-strong border-border rounded-2xl p-2">
                  <div className="px-3 py-3 border-b border-border mb-2">
                    <p className="font-semibold text-foreground">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{user.department}</p>
                  </div>
                  <DropdownMenuItem className="gap-2 cursor-pointer rounded-xl hover:bg-secondary/60 transition-colors">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground/80">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer rounded-xl hover:bg-secondary/60 transition-colors">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground/80">My Progress</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border my-2" />
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer rounded-xl hover:bg-destructive/10 transition-colors">
                    <LogOut className="w-4 h-4 text-destructive" />
                    <span className="text-destructive">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login">
                  <Button variant="ghost" className="rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-xl">
                    <Sparkles className="w-4 h-4" />
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-secondary/60 transition-colors text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden liquid-glass-strong border-t border-border fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((tab, index) => (
              <Link
                key={tab.to}
                to={tab.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 slide-up stagger-${index + 1} ${
                  location.pathname === tab.to
                    ? "bg-secondary/70 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
                style={{ opacity: 0 }}
              >
                {tab.name}
              </Link>
            ))}

            {user ? (
              <div className="border-t border-border pt-4 mt-4">
                <div className="px-4 py-2 mb-2">
                  <p className="font-semibold text-foreground">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-border pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium bg-primary text-primary-foreground text-center"
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
