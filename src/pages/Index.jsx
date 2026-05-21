import { useEffect } from "react";
import Portfolio from "@/components/Portfolio.jsx";

const Index = () => {
  useEffect(() => {
    document.title = "Nikita Bhange — Portfolio";
    const meta =
      document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "Portfolio of Nikita Bhange — MERN stack developer building modern, scalable web apps. View projects, skills, and get in touch."
    );
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  return <Portfolio />;
};

export default Index;
