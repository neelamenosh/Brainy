import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh noise-overlay pt-16 px-4">
      <div className="text-center liquid-glass-strong rounded-3xl p-10 max-w-md w-full">
        <h1 className="mb-3 text-5xl font-bold tracking-tight">404</h1>
        <p className="mb-6 text-base text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
