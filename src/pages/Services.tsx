import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-extrabold mb-4">Services</h1>
        <p className="text-lg text-muted-foreground mb-6">
          We offer a variety of quiz-based learning services tailored for individuals
          and teams. This is a stub page — replace with real content.
        </p>
        <Link to="/home" className="text-primary hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Services;
