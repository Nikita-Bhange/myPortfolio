import { motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import {
  ArrowDown, ExternalLink,  Mail, Moon, Sun, Send,
  Code2, Rocket, Target, Sparkles,
} from "lucide-react";
// import { SiGithub,  SiLinkedIn } from "react-icons/si";
import { useEffect, useRef, useState } from "react";
import {
  SiReact, SiJavascript, SiTailwindcss,  SiHtml5,
  SiNodedotjs, SiExpress, SiPython, 
  SiMongodb, SiMysql,
  SiGit, SiVercel, SiPostman,
} from "react-icons/si";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme.jsx";
import { cn } from "@/lib/utils.js";
import  emailjs  from "@emailjs/browser";
/* ---------------- MagneticButton ---------------- */
const MagneticButton = ({ children, variant = "primary", className, ...props }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
    });
  };
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.5 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-colors",
        variant === "primary" && "gradient-bg text-primary-foreground glow hover:opacity-90",
        variant === "outline" && "border border-border bg-background/50 backdrop-blur hover:bg-secondary",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

/* ---------------- CursorGlow ---------------- */
const CursorGlow = () => {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.6 });
  const [visible, setVisible] = useState(false);
  const idleTimer = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setVisible(false), 600);
    };
    const handleLeave = () => setVisible(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  if (isTouch) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle, hsl(var(--primary) / 0.45) 0%, hsl(var(--primary) / 0.20) 40%, transparent 72%)",
        filter: "blur(30px)",
      }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
      transition={{ opacity: { duration: 0.3 }, scale: { duration: 0.4 } }}
    />
  );
};

/* ---------------- ScrollProgress ---------------- */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 gradient-bg origin-left z-[60]"
    />
  );
};

/* ---------------- Navbar ---------------- */
const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
const Navbar = () => {
  const { theme, toggle } = useTheme();
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container flex h-16 items-center justify-between">
        <a href="#home" className="font-display text-lg font-bold gradient-text">
          &lt;Nik/&gt;
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 gradient-bg group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </motion.nav>
  );
};

/* ---------------- Hero ---------------- */
const taglines = [
  "Building scalable web apps.",
  "Crafting clean user experiences.",
  "Full Stack Developer.",
];
const Hero = () => {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = taglines[idx];
    const speed = del ? 40 : 80;
    const t = setTimeout(() => {
      if (!del) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDel(true), 1500);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDel(false);
          setIdx((i) => (i + 1) % taglines.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, idx]);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden grain bg-background flex items-center justify-center"
    >
      <div className="absolute inset-0 mesh-bg" />
      <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-radial)" }} />
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
      />

      <div className="container relative z-10 text-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4"
        >
          Hi, I'm <span className="gradient-text">Nikita Bhange</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl md:text-3xl text-muted-foreground mb-2"
        >
          Full Stack Web Developer 
        </motion.p>

        <div className="text-base md:text-lg text-foreground/80 mb-10 h-7">
          <span className="font-mono">{text}</span>
          <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-blink align-middle" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          <MagneticButton onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            View Projects
          </MagneticButton>
          <MagneticButton
            variant="outline"
             onClick={() => window.open("/resume.pdf", "_blank", "noopener,noreferrer") }
          >
            <ExternalLink className="h-4 w-4" />
            View Resume
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6"
        >
          {[
            // { Icon: "Github", href: "https://github.com" },
            // { Icon:  "LinkedIn" , href: "https://linkedin.com" },
            { Icon: Mail, href: "mailto:nikitabhange05@gmail.com" },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground hover:scale-110 transition-all"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground flex items-center gap-2 text-xs font-mono z-20"
      >
        scroll <ArrowDown className="h-4 w-4" />
      </motion.div>
    </section>
  );
};

/* ---------------- About ---------------- */
const aboutPanels = [
  { icon: Sparkles, title: "About Me", body: "I'm a passionate full-stack developer who loves turning ideas into elegant, performant products. I learn fast and build with intent." },
  { icon: Code2, title: "What I Do", body: "I build modern web apps with React, Node.js and MongoDB , MySql— from polished UIs to scalable APIs. I obsess over DX and clean architecture." },
  { icon: Rocket, title: "Skills Snapshot", body: "MERN stack, HTML, CSS, JavaScript, Tailwind, REST  APIs, MySQL, MongoDB, Git, Postman, Vercel" },
  { icon: Target, title: "The Goal", body: "Land an Developer role at a product-driven team where I can ship at scale, mentor, and keep raising the engineering bar." },
];
const About = () => (
  <section id="about" className="relative py-16 md:py-20 bg-background grain overflow-hidden">
    <div className="absolute inset-0 mesh-bg opacity-40" />
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 md:mb-16"
      >
      
        <h2 className="font-display text-4xl md:text-5xl font-bold">
          Get to <span className="gradient-text">know me</span>
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        {aboutPanels.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl glass card-shadow p-6 md:p-8 group overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors" />
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-2xl gradient-bg mb-4">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-2">{p.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{p.body}</p>
                <div className="mt-4 font-mono text-[10px] text-muted-foreground">
                  0{i + 1} / 0{aboutPanels.length}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ---------------- Projects ---------------- */
const projects = [
  { title: "EduMind_AI", description: "A full-stack learning platform with AI-generated quizzes, Summaries, personalized learning paths for documentation and notes, and real-time progress analytics.", stack: ["React.js", "Node.js", "Express", "MongoDB", "Gemini API", "Tailwind"], github: "https://github.com/Nikita-Bhange/EduMind_AI", demo: "https://edu-mind-ai-psi.vercel.app/"},
  { title: "ReWear", description: "Ecommerce site to sell and buy second hand used products, admin panel to analyze the items and users analytics, having two factor authentication ", stack: ["Reactjs","Tailwind CSS", "Nodejs", "Express", "MySql","deploy soon..."], github: "https://github.com/Nikita-Bhange/ReWear"}
];

const Projects = () => {
  // const featured = projects.find((p) => p.featured);
  // const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-24 md:py-32 grain">
      <div className="absolute inset-0 mesh-bg opacity-30" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
        
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Selected <span className="gradient-text">work</span>
          </h2>
        </motion.div>

        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="mb-12 group"
          >
            <div className="relative rounded-3xl glass card-shadow p-8 md:p-12 overflow-hidden hover:scale-[1.01] transition-transform">
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors" />

              <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

              <div className="relative z-10">
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  {p.title}
                </h3>

                <p className="text-muted-foreground text-lg max-w-2xl mb-6">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {p.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-secondary border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm hover:bg-background transition-colors"
                  >
                    Code
                  </a>

                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-bg text-primary-foreground text-sm hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
    
     
  


/* ---------------- Skills ---------------- */
const skillGroups = [
  { title: "Programming Languages", skills: [
    { name: "Python", Icon: SiPython }, 
    { name: "Java", Icon: SiJava },

  ]},
  { title: "Frontend", skills: [
    { name: "React", Icon: SiReact }, 
    { name: "JavaScript", Icon: SiJavascript },
    { name: "Tailwind", Icon: SiTailwindcss }, { name: "HTML5", Icon: SiHtml5 },
    { name: "CSS", Icon: SiCss3 },
  ]},
  { title: "Backend", skills: [
    { name: "Node.js", Icon: SiNodedotjs }, { name: "Express", Icon: SiExpress },
    
  ]},
  { title: "Database", skills: [
    { name: "MongoDB", Icon: SiMongodb },
     { name: "MySQL", Icon: SiMysql },
  ]},
  { title: "Tools", skills: [
    { name: "Git", Icon: SiGit }, 
    { name: "Vercel", Icon: SiVercel }, { name: "Postman", Icon: SiPostman },
  ]},
];
const Skills = () => (
  <section id="skills" className="relative py-24 md:py-32 bg-secondary/30 grain">
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
      
        <h2 className="font-display text-4xl md:text-5xl font-bold">
          My <span className="gradient-text">toolkit</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillGroups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: gi * 0.1 }}
            className="rounded-2xl glass card-shadow p-6"
          >
            <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full gradient-bg" />
              {g.title}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {g.skills.map(({ name, Icon }) => (
                <div key={name} className="group flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-secondary transition-colors">
                  <Icon className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] text-muted-foreground text-center">{name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- Contact ---------------- */
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!form.name || !form.email || !form.message) {
  //     toast.error("Please fill out all fields");
  //     return;
  //   }
  //   toast.success("Message sent! I'll get back to you soon.");
  //   setForm({ name: "", email: "", message: "" });
  // };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.message) {
    toast.error("Please fill out all fields");
    return;
  }

  try {
    await emailjs.send(
      "service_vrmkjiq",
      "template_aynjyib",
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
      },
      "Ry8tJoDl2W2-P8_iT"
    );

    toast.success("Message sent successfully!");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  } catch (error) {
    console.log(error);
    toast.error("Failed to send message");
  }
};
  return (
    <section id="contact" className="relative py-24 md:py-32 grain">
      <div className="absolute inset-0 mesh-bg opacity-30" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* <p className="text-sm font-mono text-primary mb-2"> contact</p> */}
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Let's <span className="gradient-text">build something</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Have a project in mind or just want to say hi? My inbox is always open.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              { Icon: Mail, label: "Email", value: "nikitabhange05@gmail.com", href: "mailto:nikitabhange05@gmail.com" },
              { Icon: "Github", label: "GitHub", value: "@Nikita-Bhange", href: "https://github.com/Nikita-Bhange" },
              { Icon: "Linkedin", label: "LinkedIn", value: "in/nikita-bhange", href: "https://linkedin.com/in/nikita-bhange" },
            ].map(({ Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl glass card-shadow hover:scale-[1.02] transition-transform group"
              >
                <div className="p-3 rounded-xl gradient-bg">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium group-hover:text-primary transition-colors">{value}</p>
                </div>
              </a>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="rounded-2xl glass card-shadow p-6 space-y-4"
          >
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border focus:outline-none focus:border-primary transition-colors text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border focus:outline-none focus:border-primary transition-colors text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Message</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <MagneticButton type="submit" className="w-full">
              <Send className="h-4 w-4" />
              Send Message
            </MagneticButton>
          </motion.form>
        </div>
      </div>

      <footer className="container relative z-10 mt-24 pt-8 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Nikita Bhange. Built with React, Tailwind & Framer Motion.
      </footer>
    </section>
  );
};

/* ---------------- Portfolio (root) ---------------- */
const Portfolio = () => (
  <main className="bg-background text-foreground min-h-screen">
    <CursorGlow />
    <ScrollProgress />
    <Navbar />
    <Hero />
    <About />
    <Projects />
    <Skills />
    <Contact />
  </main>
);
  
export default Portfolio;
