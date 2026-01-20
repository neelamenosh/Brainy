import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="liquid-glass-strong rounded-3xl p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Contact</h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
          Get in touch with us — this is a stub contact page. Replace with a contact form as needed.
          </p>
          <Link to="/home" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
