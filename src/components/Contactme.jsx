import React from "react";

 export const Contactme = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill out all fields");
      return;
    }
    toast.success("Message sent! I'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
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



// export default Contactme