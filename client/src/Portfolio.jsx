import { useEffect, useMemo, useState, useRef } from "react";
import ResumePdf from "./components/ResumePdf";
import AboutSection from "./components/AboutSection";
import { createPortal } from "react-dom";
import {
  FaCss3Alt,
  FaGithub,
  FaHtml5,
  FaJava,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa";

import {
  SiExpress,
  SiGit,
  SiGooglecolab,
  SiJavascript,
  SiKeras,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNumpy,
  SiOpencv,
  SiPandas,
  SiPostgresql,
  SiPostman,
  SiRedux,
  SiRender,
  SiTailwindcss,
  SiTensorflow,
  SiTypescript,
  SiVercel,
  SiLeetcode,
} from "react-icons/si";

import { VscVscode } from "react-icons/vsc";

import {
  BarChart3,
  Boxes,
  BrainCircuit,
  ChartNoAxesCombined,
  CircuitBoard,
  Code2,
  Database,
  Eye,
  Layers3,
  Network,
  ScanSearch,
  ServerCog,
  TableProperties,
  ChevronLeft,
} from "lucide-react";

import { TbApi, TbBrandCSharp } from "react-icons/tb";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Braces,
  ChevronRight,
  Download,
  ExternalLink,
  GraduationCap,
  Github,
  Linkedin,
  Mail,
  Menu,
  Trophy,
  X,
} from "lucide-react";

import { api } from "./api";
const iconMap = {
  // Programming
  java: FaJava,
  python: FaPython,
  javascript: SiJavascript,
  typescript: SiTypescript,

  // Core computer science
  dsa: Braces,
  "data structures and algorithms": Braces,
  oop: Boxes,
  dbms: Database,
  "operating systems": ServerCog,
  "computer networks": Network,
  "system design": CircuitBoard,

  // Full-stack development
  html: FaHtml5,
  html5: FaHtml5,
  css: FaCss3Alt,
  css3: FaCss3Alt,
  react: FaReact,
  "react.js": FaReact,
  reactjs: FaReact,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  "redux toolkit": SiRedux,
  redux: SiRedux,
  "node.js": FaNodeJs,
  nodejs: FaNodeJs,
  "express.js": SiExpress,
  expressjs: SiExpress,
  "rest api": Code2,
  "rest apis": Code2,
  tailwind: SiTailwindcss,
  "tailwind css": SiTailwindcss,

  // Databases
  mongodb: SiMongodb,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,

  // Artificial intelligence and machine learning
  "machine learning": BrainCircuit,
  "deep learning": BrainCircuit,
  tensorflow: SiTensorflow,
  keras: SiKeras,
  opencv: SiOpencv,
  yolo: ScanSearch,
  numpy: SiNumpy,
  pandas: SiPandas,
  cnn: Network,
  "convolutional neural network": Network,
  "transfer learning": Layers3,
  "image classification": Eye,
  "object detection": ScanSearch,
  "image segmentation": TableProperties,

  // Data
  "data analytics": ChartNoAxesCombined,
  "power bi": BarChart3,
  powerbi: BarChart3,
  "data visualization": BarChart3,

  // Tools
  git: SiGit,
  github: FaGithub,
  "vs code": VscVscode,
  vscode: VscVscode,
  postman: SiPostman,
  "google colab": SiGooglecolab,
  colab: SiGooglecolab,
  vercel: SiVercel,
  render: SiRender,
};
const fallback = {
  profile: {
    name: "Hemanth M Sirvi",
    headline: "ENGINEERING IDEAS INTO REALITY.",
    intro:
      "A final-year engineering student who enjoys solving problems, building practical digital products, and continuously exploring new technologies.",
    heroMode: "animation",
    availability: "Open to opportunities",
  },
  about: {
    heading: "CURIOUS BY NATURE. ENGINEERED FOR PROGRESS.",
    bio: "I enjoy understanding how systems work, converting ideas into functional solutions and continuously improving through practical experimentation.",
    approach: ["Think", "Design", "Build", "Improve"],
  },
  educations: [],
  experiences: [],
  techCategories: [],
  achievements: [],
  hobbies: [],
  contact: { formEnabled: true },
};
export default function Portfolio() {
  const [data, setData] = useState({
    portfolio: fallback,
    projects: [],
    certificates: [],
    resumes: [],
  });
  const [loading, setLoading] = useState(!sessionStorage.getItem("introSeen"));
  const [menu, setMenu] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30 });
  useEffect(() => {
    api("/content/public")
      .then((d) => setData({ ...d, portfolio: d.portfolio || fallback }))
      .catch(() => {});
    if (loading) {
      const t = setTimeout(() => {
        sessionStorage.setItem("introSeen", "1");
        setLoading(false);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, []);
  const p = data.portfolio || fallback;
  const published = (x) => x?.published !== false;
  const chapters = [
    {
      id: "about",
      label: "About",
      show: Boolean(p.about?.heading || p.about?.bio),
      content: <AboutSection data={p.about} />,
    },
    {
      id: "education",
      label: "Education",
      show: p.educations?.some(published),
      content: <Education items={p.educations} />,
    },
    {
      id: "experience",
      label: "Experience",
      show: p.experiences?.some(published),
      content: <Experience items={p.experiences} />,
    },
    {
      id: "tech",
      label: "Tech",
      show: p.techCategories?.some((x) => x.items?.length),
      content: <Tech categories={p.techCategories} />,
    },
    {
      id: "projects",
      label: "Projects",
      show: data.projects.length > 0,
      content: <Projects items={data.projects} />,
    },
    {
      id: "certifications",
      label: "Certifications",
      show: data.certificates.length > 0,
      content: <Certificates items={data.certificates} />,
    },
    {
      id: "achievements",
      label: "Achievements",
      show: p.achievements?.some(published),
      content: <Achievements items={p.achievements} />,
    },
    {
      id: "resume",
      label: "Resume",
      show: data.resumes.length > 0,
      content: <Resumes items={data.resumes} />,
    },
    {
      id: "hobbies",
      label: "Hobbies",
      show: p.hobbies?.some(published),
      content: <Hobbies items={p.hobbies} />,
    },
    {
      id: "contact",
      label: "Connect",
      show: true,
      content: <Contact data={p.contact} />,
    },
  ].filter((x) => x.show);
  const sections = chapters.map(({ id, label }) => [id, label]);
  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[100] h-0.5 origin-left bg-cyan-300"
        style={{ scaleX: progress, width: "100%" }}
      />
      <AnimatePresence>{loading && <Loader />}</AnimatePresence>
      <Nav
        name={p.profile?.name}
        sections={sections}
        open={menu}
        setOpen={setMenu}
      />
      <main>
        <Hero profile={p.profile} />
        {chapters.map((chapter, index) => (
          <Chapter
            key={chapter.id}
            id={chapter.id}
            number={String(index + 1).padStart(2, "0")}
          >
            {chapter.content}
          </Chapter>
        ))}
      </main>
    </>
  );
}
function Loader() {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[200] grid place-items-center bg-[#05080d]"
    >
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="label"
        >
          Initializing portfolio
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className="mx-auto mt-5 h-px w-60 origin-left bg-cyan-300"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 font-mono text-xs tracking-[.35em] text-white"
        >
          SYSTEM READY
        </motion.p>
      </div>
    </motion.div>
  );
}
function Nav({ name, sections, open, setOpen }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 p-4">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3">
        <a
          href="#top"
          className="relative overflow-hidden text-sm font-bold tracking-[.13em]"
        >
          <motion.span
            className="nav-name inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -3, 0],
              color: ["#f1f5f9", "#67e8f9", "#f1f5f9"],
              textShadow: [
                "0 0 0px rgba(103,232,249,0)",
                "0 0 16px rgba(103,232,249,0.75)",
                "0 0 0px rgba(103,232,249,0)",
              ],
            }}
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              color: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              textShadow: {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={{
              scale: 1.06,
              color: "#67e8f9",
            }}
          >
            {name?.toUpperCase()}
          </motion.span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {sections.map(([id, label]) => (
            <a
              className="text-[11px] uppercase tracking-widest text-slate-400 hover:text-cyan-200"
              key={id}
              href={`#${id}`}
            >
              {label}
            </a>
          ))}
        </div>
        <a href="#contact" className="btn hidden md:flex">
          Connect <ArrowUpRight size={15} />
        </a>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mt-2 rounded-2xl p-5 md:hidden"
          >
            {sections.map(([id, label], i) => (
              <a
                onClick={() => setOpen(false)}
                className="flex border-b border-white/10 py-4 text-lg"
                key={id}
                href={`#${id}`}
              >
                <span className="mr-4 font-mono text-xs text-cyan-300">
                  0{i + 1}
                </span>
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
function Hero({ profile }) {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-28">
      <div className="container grid min-h-[calc(100vh-7rem)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="label">Engineer · Problem solver · Builder</p>
          <h1 className="gradient mt-6 text-6xl font-semibold leading-[.93] tracking-[-.06em] sm:text-8xl">
            {profile?.headline}
          </h1>
          <p className="mt-8 max-w-2xl border-l border-cyan-300/40 pl-5 text-lg leading-8 text-slate-400">
            I’m {profile?.name}, {profile?.intro}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a className="btn" href="#projects">
              Explore my work <ArrowDownRight size={16} />
            </a>
            <a className="btn" href="#resume">
              View resume <ArrowUpRight size={16} />
            </a>
          </div>
        </motion.div>
        <HeroVisual profile={profile} />
      </div>
    </section>
  );
}
function HeroVisual({ profile }) {
  if (profile?.heroMode === "image" && profile.heroImage?.url)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 -z-10 bg-cyan-300/15 blur-3xl" />
        <img
          src={profile.heroImage.url}
          alt="Hemanth M Sirvi"
          className="mx-auto max-h-[70vh] rounded-[2rem] object-cover [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
        />
      </motion.div>
    );
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.35 }}
      className="orb relative mx-auto aspect-square w-full max-w-md"
    >
      <div className="absolute inset-0 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="orb-ring" />
      <div className="orb-ring" />
      <div className="orb-ring" />
      <Braces
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-200"
        size={64}
      />
      {["THINK", "DESIGN", "BUILD", "IMPROVE"].map((x, i) => (
        <motion.span
          key={x}
          animate={{ y: [0, -7, 0] }}
          transition={{ repeat: Infinity, delay: i * 0.35, duration: 2 }}
          className={`absolute label ${[
            ["left-0", "top-1/2"],
            ["right-0", "top-1/3"],
            ["left-1/3", "top-0"],
            ["bottom-0", "right-1/3"],
          ][i].join(" ")}`}
        >
          {x}
        </motion.span>
      ))}
    </motion.div>
  );
}
function Chapter({ id, number, children }) {
  return (
    <section
      id={id}
      className="chapter bg-[#080d14] py-14 md:py-20"
    >
      <div className="container">
        <div className="mb-8 flex items-center gap-4">
          <span className="label">{number} /</span>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="h-px flex-1 origin-left bg-gradient-to-r from-cyan-300/60 to-transparent"
          />
        </div>

        {children}
      </div>
    </section>
  );
}
function Reveal({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 38, filter: "blur(7px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Education({ items = [] }) {
  const visible = items
    .filter((x) => x.published !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <>
      <Reveal>
        <p className="label">Education</p>
        <h2 className="mt-5 text-5xl font-semibold">
          The foundation behind my engineering.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {visible.map((x, i) => (
          <Reveal
            key={x._id || `${x.institution}-${i}`}
            className="glass group relative overflow-hidden rounded-3xl p-7"
          >
            <div className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/5 text-cyan-300 transition group-hover:rotate-6 group-hover:scale-110">
              <GraduationCap size={23} />
            </div>
            <p className="label">
              {x.period || `Education ${String(i + 1).padStart(2, "0")}`}
            </p>
            <h3 className="mt-7 max-w-[80%] text-2xl font-semibold">
              {x.degree}
            </h3>
            {x.field && <p className="mt-2 text-cyan-200">{x.field}</p>}
            <p className="mt-5 text-lg text-slate-300">{x.institution}</p>
            {x.score && (
              <span className="mt-5 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {x.score}
              </span>
            )}
            {x.description && (
              <p className="mt-5 leading-7 text-slate-400">{x.description}</p>
            )}
          </Reveal>
        ))}
      </div>
    </>
  );
}

function Experience({ items }) {
  return (
    <>
      <Reveal>
        <p className="label">Experience</p>
        <h2 className="mt-5 text-5xl font-semibold">Where I’ve contributed.</h2>
      </Reveal>
      <div className="mt-12 space-y-4">
        {items
          .filter((x) => x.published)
          .map((x) => (
            <Reveal
              key={x._id}
              className="glass grid gap-4 rounded-2xl p-6 md:grid-cols-[1fr_1fr_2fr]"
            >
              <h3 className="text-xl">{x.title}</h3>
              <p className="text-cyan-200">
                {x.company}
                <br />
                <span className="text-sm text-slate-500">{x.period}</span>
              </p>
              <p className="text-slate-400">{x.description}</p>
            </Reveal>
          ))}
      </div>
    </>
  );
}
function Tech({ categories = [] }) {
  return (
    <>
      <Reveal>
        <p className="label">Engineering toolkit</p>

        <h2 className="mt-5 text-5xl font-semibold">
          Technologies behind what I build.
        </h2>

        <p className="mt-5 max-w-2xl leading-7 text-slate-400">
          Languages, frameworks and tools I use to transform ideas into
          functional digital products.
        </p>
      </Reveal>

      <div className="tech-marquee-container mt-12">
        {categories.map((category, categoryIndex) => {
          const repeatedItems = [
            ...category.items,
            ...category.items,
            ...category.items,
          ];

          return (
            <Reveal key={category.name} className="tech-marquee-row">
              <div className="tech-category">
                <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
                {category.name}
              </div>

              <div className="tech-marquee-window">
                <div
                  className={`tech-marquee-track ${
                    categoryIndex % 2 ? "tech-marquee-reverse" : ""
                  }`}
                >
                  {repeatedItems.map((name, index) => {
                    const normalizedName = name.trim().toLowerCase();
                    const Icon = iconMap[normalizedName];

                    return (
                      <div
                        className="tech-tool"
                        key={`${category.name}-${name}-${index}`}
                      >
                        <span className="tech-tool-icon">
                          {Icon ? <Icon /> : <Braces size={22} />}
                        </span>

                        <span>{name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
function Projects({ items = [] }) {
  const categories = [
    ...new Set(
      items.map((project) => project.category?.trim()).filter(Boolean),
    ),
  ];

  const DEFAULT_CATEGORY = "Frontend Application";

const [activeCategory, setActiveCategory] = useState(
  DEFAULT_CATEGORY,
);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
  if (!categories.length) return;

  if (!categories.includes(activeCategory)) {
    const defaultCategory = categories.find(
      (category) =>
        category.toLowerCase() ===
        DEFAULT_CATEGORY.toLowerCase(),
    );

    setActiveCategory(defaultCategory || categories[0]);
  }
}, [items, activeCategory]);

  const visibleProjects = items.filter(
    (project) => project.category?.trim() === activeCategory,
  );

  if (!categories.length) return null;

  return (
    <>
      <Reveal>
        <p className="label">Selected work</p>

        <h2 className="mt-5 text-5xl font-semibold">
          Projects built across different domains.
        </h2>
      </Reveal>

      {/* Category Tabs */}
      <div className="mt-10 flex items-center gap-10 border-b border-white/10">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`relative pb-4 text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
              activeCategory === category
                ? "text-cyan-300"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {category}

            {activeCategory === category && (
              <span className="absolute bottom-0 left-0 h-[3px] w-full bg-cyan-300" />
            )}
          </button>
        ))}
      </div>

      {/* Only selected category is displayed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -35 }}
          transition={{ duration: 0.35 }}
          className="mt-10"
        >
          <ProjectSlider
            category={activeCategory}
            projects={visibleProjects}
            openProject={setSelected}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} close={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
function ProjectSlider({ category, projects, openProject }) {
  const sliderRef = useRef(null);
  const [paused, setPaused] = useState(false);

  function slide(direction) {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction * Math.min(slider.clientWidth * 0.85, 900),
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (paused || projects.length <= 1) return;

    const timer = setInterval(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const reachedEnd =
        slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 20;

      slider.scrollTo({
        left: reachedEnd ? 0 : slider.scrollLeft + 360,
        behavior: "smooth",
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [paused, projects.length]);

  return (
    <Reveal>
      <div className="mb-6 flex items-center justify-between gap-4">
        {projects.length > 1 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => slide(-1)}
              aria-label={`Previous ${category} projects`}
              className="project-slider-arrow"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={() => slide(1)}
              aria-label={`Next ${category} projects`}
              className="project-slider-arrow"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={sliderRef}
        className="project-slider"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        {projects.map((project, index) => (
          <motion.button
            type="button"
            key={project._id}
            onClick={() => openProject(project)}
            whileHover={{
              y: -8,
              scale: 1.035,
            }}
            whileTap={{ scale: 0.98 }}
            className="project-slide-card glass group"
          >
            <div className="relative aspect-video overflow-hidden bg-[#0d1822]">
              {project.coverImage?.url ? (
                <img
                  src={project.coverImage.url}
                  alt={project.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <Braces size={44} className="text-cyan-300/50" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071019] via-transparent to-transparent" />

              <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-200 backdrop-blur">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="p-5 text-left">
              <p className="label">{project.category}</p>

              <h3 className="mt-4 text-xl font-semibold">{project.name}</h3>

              <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-400">
                {project.shortDescription}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.technologies?.slice(0, 4).map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-300"
                  >
                    {technology}
                  </span>
                ))}
              </div>

              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
                View project
                <ArrowUpRight size={14} />
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </Reveal>
  );
}
function ProjectModal({ project, close }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        close();
      }
    }

    // Prevent the website behind the modal from scrolling
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"
    >
      <motion.article
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.97,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        onMouseDown={(event) => event.stopPropagation()}
        className="glass relative grid h-[90dvh] max-h-[720px] w-full max-w-[950px] grid-rows-[220px_minmax(0,1fr)] overflow-hidden rounded-3xl md:grid-cols-[42%_58%] md:grid-rows-1"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label="Close project"
          className="glass absolute right-4 top-4 z-30 rounded-full p-3 transition hover:border-cyan-300 hover:text-cyan-200"
        >
          <X size={19} />
        </button>

        {/* Fixed image panel */}
        <div className="relative min-h-0 overflow-hidden bg-[#05080d]">
          {project.coverImage?.url ? (
            <img
              src={project.coverImage.url}
              alt={project.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <Braces size={56} className="text-cyan-300/50" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        {/* Independently scrollable project information */}
        <div className="project-modal-content min-h-0 overflow-y-auto p-6 md:p-9">
          <p className="label">
            {project.category}
            {project.year && ` / ${project.year}`}
          </p>

          <h3 className="mt-5 pr-12 text-3xl font-semibold">{project.name}</h3>

          <p className="mt-5 whitespace-pre-line leading-7 text-slate-300">
            {project.description || project.shortDescription}
          </p>

          {project.technologies?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}

          {(project.githubUrl || project.demoUrl) && (
            <div className="mt-8 flex flex-wrap gap-3 pb-2">
              {project.githubUrl && (
                <a
                  className="btn"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={16} />
                  GitHub
                </a>
              )}

              {project.demoUrl && (
                <a
                  className="btn"
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live demo
                  <ExternalLink size={15} />
                </a>
              )}
            </div>
          )}
        </div>
      </motion.article>
    </motion.div>,
    document.body,
  );
}

function Certificates({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <Reveal>
        <p className="label">Certifications</p>
        <h2 className="mt-5 text-5xl font-semibold">Continuously learning.</h2>
      </Reveal>
      <div className="mt-12 space-y-8">
        {items.map((x, i) => (
          <Reveal
            key={x._id}
            className="glass mx-auto grid w-[96%] overflow-hidden rounded-3xl lg:grid-cols-2"
          >
            <button
              onClick={() => setOpen(x)}
              className={`${i % 2 ? "lg:order-2" : ""} overflow-hidden bg-white/5`}
            >
              <img
                src={x.image?.url}
                alt={x.name}
                className="h-[260px] w-[85%] object-contain mx-auto transition duration-700 hover:scale-105"
              />
            </button>
            <div className="p-7 md:p-9">
              <p className="label">
                {x.year} {x.issuer && `/ ${x.issuer}`}
              </p>
              <h3 className="mt-5 text-3xl">{x.name}</h3>
              <p className="mt-5 leading-7 text-slate-400">{x.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {x.technologies?.map((t) => (
                  <span
                    className="rounded-full border border-white/10 px-3 py-1 text-xs"
                    key={t}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[90] grid place-items-center bg-black/90 p-6"
          >
            <button className="absolute right-5 top-5">
              <X />
            </button>
            <img
              src={open.image?.url}
              className="max-h-[90vh] max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Achievements({ items = [] }) {
  const visible = items
    .filter((x) => x.published !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <>
      <Reveal>
        <p className="label">Participation & achievements</p>
        <h2 className="mt-5 text-5xl font-semibold">
          Proof of practice, persistence and progress.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((x, i) => (
          <Reveal
            key={x._id || `${x.title}-${i}`}
            className="glass group flex min-h-72 flex-col rounded-3xl p-7 transition hover:-translate-y-1 hover:border-cyan-300/40"
          >
            <div className="flex items-start justify-between">
              <span className="label">
                {x.type || "Achievement"} {x.year && `/ ${x.year}`}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                <Trophy size={21} />
              </span>
            </div>
            <h3 className="mt-8 text-2xl font-semibold">{x.title}</h3>
            {x.organization && (
              <p className="mt-2 text-sm text-cyan-200">{x.organization}</p>
            )}
            <p className="mt-5 flex-1 leading-7 text-slate-400">
              {x.description}
            </p>
            {x.metric && (
              <p className="mt-5 border-l-2 border-cyan-300 pl-3 font-mono text-sm text-slate-200">
                {x.metric}
              </p>
            )}
            {x.link && (
              <a
                href={x.link}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-300"
              >
                View evidence <ArrowUpRight size={14} />
              </a>
            )}
          </Reveal>
        ))}
      </div>
    </>
  );
}
function Resumes({ items }) {
  const [active, setActive] = useState(items[0]?._id);
  useEffect(() => {
    setActive(items[0]?._id);
  }, [items]);
  const current = items.find((x) => x._id === active) || items[0];
  return (
    <>
      <Reveal>
        <p className="label">Resume</p>
        <h2 className="mt-5 text-5xl font-semibold">
          My skills, education and work.
        </h2>
      </Reveal>
      {items.length ? (
        <div className="mt-10">
          <div className="flex justify-center gap-2">
            {items.map((x) => (
              <button
                onClick={() => setActive(x._id)}
                key={x._id}
                className={`relative px-5 py-3 text-sm font-semibold ${active === x._id ? "text-cyan-200" : "text-slate-500"}`}
              >
                {x.track}
                {active === x._id && (
                  <motion.span
                    layoutId="resume-tab"
                    className="absolute inset-x-2 bottom-0 h-0.5 bg-cyan-300"
                  />
                )}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current._id}
                initial={{ opacity: 0, x: 35, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -35 }}
                className="glass mt-7 overflow-hidden rounded-3xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                  <span className="label">{current.track} Resume</span>
                  <a className="btn" href={current.file?.url} download>
                    <Download size={15} /> Download
                  </a>
                </div>
                <ResumePdf url={current.file?.url} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <p className="mt-8 text-slate-500">
          Resume is currently being updated.
        </p>
      )}
    </>
  );
}
function Hobbies({ items }) {
  return (
    <>
      <Reveal>
        <p className="label">Beyond engineering</p>
        <h2 className="mt-5 text-5xl font-semibold">What keeps me curious.</h2>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items
          .filter((x) => x.published)
          .map((x) => (
            <Reveal
              key={x._id}
              className="glass group overflow-hidden rounded-2xl"
            >
              {x.image?.url && (
                <img
                  src={x.image.url}
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl">{x.name}</h3>
                <p className="mt-3 text-slate-400">{x.description}</p>
              </div>
            </Reveal>
          ))}
      </div>
    </>
  );
}
function Contact({ data = {} }) {
  const [status, setStatus] = useState("");
  async function submit(e) {
    e.preventDefault();
    setStatus("Sending…");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api("/content/messages", {
        method: "POST",
        body: JSON.stringify(body),
      });
      e.currentTarget.reset();
      setStatus("Message received. I’ll get back to you soon.");
    } catch (e) {
      setStatus(e.message);
    }
  }
  return (
    <>
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="label">Let’s connect</p>
          <h2 className="mt-5 text-5xl font-semibold">
            Have an idea, opportunity or conversation?
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
            I’m open to opportunities, collaborations and conversations around
            engineering and technology.
          </p>
          <div className="mt-10 space-y-4">
            {data.email && (
              <a
                className="flex items-center gap-3"
                href={`mailto:${data.email}`}
              >
                <Mail className="text-cyan-300" />
                {data.email}
              </a>
            )}
            {data.linkedin && (
              <a className="flex items-center gap-3" href={data.linkedin}>
                <Linkedin className="text-cyan-300" />
                LinkedIn
              </a>
            )}
            {data.github && (
              <a className="flex items-center gap-3" href={data.github}>
                <Github className="text-cyan-300" />
                GitHub
              </a>
            )}
            {data.leetcode && (
              <a
                className="flex items-center gap-3 transition hover:text-cyan-200"
                href={data.leetcode}
                target="_blank"
                rel="noreferrer"
              >
                <SiLeetcode className="text-cyan-300" size={22} />
                LeetCode
              </a>
            )}
          </div>
        </Reveal>
        {data.formEnabled && (
          <Reveal>
            <form onSubmit={submit} className="glass space-y-4 rounded-3xl p-7">
              <input
                className="field"
                name="name"
                required
                placeholder="Name"
              />
              <input
                className="field"
                name="email"
                type="email"
                required
                placeholder="Email"
              />
              <input className="field" name="subject" placeholder="Subject" />
              <textarea
                className="field min-h-36"
                name="message"
                required
                placeholder="Message"
              />
              <button className="btn" type="submit">
                Send message <ArrowUpRight size={16} />
              </button>
              {status && <p className="text-sm text-cyan-200">{status}</p>}
            </form>
          </Reveal>
        )}
      </div>
      <footer className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs uppercase tracking-widest text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Hemanth M Sirvi</span>
        <span>Engineered with React · Tailwind · Framer Motion</span>
        <a href="/admin">Admin access</a>
      </footer>
    </>
  );
}
