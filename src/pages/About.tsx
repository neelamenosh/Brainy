import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Code2,
  Cpu,
  ExternalLink,
  Github,
  GitBranch,
  GraduationCap,
  Globe,
  Headphones,
  Layers,
  Laptop,
  Music,
  Sparkles,
} from "lucide-react";

const About = () => {
  const [photoError, setPhotoError] = useState(false);
  const photoSrc = "/neelam-enosh.jpg";

  const links = [
    {
      label: "GitHub Profile",
      href: "https://github.com/neelamenosh",
      icon: Github,
      description: "Projects, contributions, and repos",
    },
    {
      label: "Brainy Repository",
      href: "https://github.com/neelamenosh/Brainy",
      icon: GitBranch,
      description: "Source code for this project",
    },
    {
      label: "Live Demo",
      href: "https://brainy-eta.vercel.app/",
      icon: Globe,
      description: "Deployed app on Vercel",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-mesh noise-overlay">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-24 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-48 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-24 left-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="liquid-glass-strong rounded-3xl p-8 sm:p-10 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-muted-teal" />
            <span className="gradient-text-static">Technology-focused learner • Developer • Creator</span>
          </div>

          <div className="grid lg:grid-cols-[220px,1fr] gap-8 items-center">
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-muted-teal/30 via-primary/10 to-amber-300/20 blur-2xl opacity-80" />
                <div className="relative rounded-[2.5rem] p-1.5 bg-gradient-to-br from-muted-teal via-primary to-amber-300 shadow-2xl">
                  <div className="rounded-[2.3rem] liquid-glass-strong border border-white/10 p-3">
                    {!photoError ? (
                      <img
                        src={photoSrc}
                        alt="Neelam Enosh"
                        className="w-44 h-44 sm:w-48 sm:h-48 rounded-[2rem] object-cover"
                        onError={() => setPhotoError(true)}
                      />
                    ) : (
                      <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-[2rem] flex items-center justify-center bg-secondary/60 border border-border">
                        <div className="text-center">
                          <div className="text-4xl font-extrabold gradient-text-aurora">NE</div>
                          <div className="text-xs text-muted-foreground mt-2">Add photo at: public/neelam-enosh.jpg</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                <span className="text-foreground">Neelam </span>
                <span className="gradient-text-aurora text-glow">Enosh</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
                I’m a technology-focused learner and developer with strong interest in software engineering, web development,
                and digital systems. I build academic, technical, and creative projects that combine programming accuracy,
                system design, and real-world usability.
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-3 py-1.5 rounded-full liquid-glass text-foreground/80 text-sm font-medium">
                  Software Engineering
                </span>
                <span className="px-3 py-1.5 rounded-full liquid-glass text-foreground/80 text-sm font-medium">
                  Web Development
                </span>
                <span className="px-3 py-1.5 rounded-full liquid-glass text-foreground/80 text-sm font-medium">
                  Music Technology
                </span>
                <span className="px-3 py-1.5 rounded-full liquid-glass text-foreground/80 text-sm font-medium">
                  Audio Production
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-2xl btn-liquid gradient-sunset text-white font-semibold shadow-xl"
                >
                  Get in Touch
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center h-12 px-6 rounded-2xl liquid-glass border border-border text-foreground font-semibold hover:bg-secondary/40 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="liquid-glass-card rounded-3xl p-8 mb-10">
          <div className="flex items-center justify-between gap-6 flex-wrap mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              <span className="text-foreground">Links & </span>
              <span className="gradient-text-static">Profiles</span>
            </h2>
            <p className="text-muted-foreground">Quick access to my work and the live app.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="liquid-glass rounded-2xl p-5 border border-white/10 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5 text-muted-teal" />
                      <p className="font-semibold text-foreground">{item.label}</p>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <div className="liquid-glass-card rounded-3xl p-8 card-3d hover-glow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/70 border border-border flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Learning Style</h2>
            </div>
            <p className="text-muted-foreground">
              I learn concepts deeply—understanding not only how something works, but why it works—so I can apply that
              knowledge confidently in projects and problem-solving.
            </p>
          </div>

          <div className="liquid-glass-card rounded-3xl p-8 card-3d hover-glow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/70 border border-border flex items-center justify-center">
                <Layers className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Core Areas</h2>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• C Programming, Java, Python</li>
              <li>• Operating Systems & Software Engineering</li>
              <li>• Exam-oriented clarity + practical implementation</li>
            </ul>
          </div>

          <div className="liquid-glass-card rounded-3xl p-8 card-3d hover-glow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/70 border border-border flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Workflow</h2>
            </div>
            <p className="text-muted-foreground">
              I build with modern tooling and clean structure, using GitHub for proper version control and AI-assisted
              workflows to improve productivity while maintaining correctness.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="liquid-glass-strong rounded-3xl p-8 card-3d hover-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-aurora shadow-lg flex items-center justify-center">
                <Laptop className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Web Development</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="liquid-glass rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-5 h-5 text-muted-teal" />
                  <p className="font-semibold text-foreground">Tools</p>
                </div>
                <p className="text-muted-foreground text-sm">VS Code, GitHub, HTML, CSS, JavaScript</p>
              </div>

              <div className="liquid-glass rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-5 h-5 text-muted-teal" />
                  <p className="font-semibold text-foreground">Modern Stack</p>
                </div>
                <p className="text-muted-foreground text-sm">React, Vite, component-driven UI, clean structure</p>
              </div>
            </div>

            <p className="text-muted-foreground mt-5">
              I transitioned from mobile IDEs to professional desktop environments and focus on building real, usable
              interfaces with strong fundamentals.
            </p>
          </div>

          <div className="liquid-glass-strong rounded-3xl p-8 card-3d hover-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-sunset shadow-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Music Tech & Audio</h2>
            </div>

            <p className="text-muted-foreground">
              I’m deeply involved in music technology and audio production, aiming for studio-quality results through
              technical precision and careful sound engineering.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <div className="liquid-glass rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones className="w-5 h-5 text-amber-300" />
                  <p className="font-semibold text-foreground">Production</p>
                </div>
                <p className="text-muted-foreground text-sm">Logic Pro, MainStage, mixing, sound design</p>
              </div>

              <div className="liquid-glass rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="w-5 h-5 text-amber-300" />
                  <p className="font-semibold text-foreground">Instrument Building</p>
                </div>
                <p className="text-muted-foreground text-sm">Custom sampled instruments, realistic tones, plugins/VST exploration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="liquid-glass-card rounded-3xl p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            <span className="text-foreground">Let’s build something </span>
            <span className="gradient-text-static">useful</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I enjoy projects that blend clear fundamentals with real-world outcomes—whether it’s engineering learning
            tools, web apps, or audio systems.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center h-12 px-6 rounded-2xl btn-liquid gradient-sunset text-white font-semibold shadow-xl"
            >
              Contact
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center h-12 px-6 rounded-2xl liquid-glass border border-border text-foreground font-semibold hover:bg-secondary/40 transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
