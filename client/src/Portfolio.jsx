import { useEffect, useMemo, useState } from "react";
import ResumePdf from "./components/ResumePdf";
import AboutSection from "./components/AboutSection";
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
} from "lucide-react";

import { TbApi, TbBrandCSharp } from "react-icons/tb";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
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
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.985]);
  return (
    <motion.section
      id={id}
      style={{ scale }}
      className="chapter bg-[#080d14] py-14 md:py-20"
    >
      <div className="container">
        <div className="mb-8 flex items-center gap-4">
          <span className="label">{number} /</span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-px flex-1 origin-left bg-gradient-to-r from-cyan-300/60 to-transparent"
          />
        </div>
        {children}
      </div>
    </motion.section>
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
function Projects({ items }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const cats = ["All", ...new Set(items.map((x) => x.category))];
  const shown =
    filter === "All" ? items : items.filter((x) => x.category === filter);
  return (
    <>
      <Reveal>
        <p className="label">Projects</p>
        <h2 className="mt-5 text-5xl font-semibold">Things I have built.</h2>
      </Reveal>
      <div className="mt-10 flex gap-2 overflow-x-auto pb-3">
        {cats.map((x) => (
          <button
            onClick={() => setFilter(x)}
            className={`btn shrink-0 ${filter === x ? "border-cyan-300 text-cyan-200" : ""}`}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <motion.div
        layout
        className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {shown.map((p, i) => (
          <motion.button
            layoutId={`project-${p._id}`}
            onClick={() => setSelected(p)}
            key={p._id}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass group overflow-hidden rounded-3xl text-left"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[#0d1822]">
              {p.coverImage?.url ? (
                <img
                  src={p.coverImage.url}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <Braces size={50} className="text-cyan-300/60" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071019] to-transparent" />
            </div>
            <div className="p-5">
              <div className="flex justify-between">
                <span className="label">
                  {String(i + 1).padStart(2, "0")} / {p.category}
                </span>
                <ArrowUpRight className="text-cyan-300" />
              </div>
              <h3 className="mt-5 text-2xl font-medium">{p.name}</h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                {p.shortDescription}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.technologies?.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} close={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
function ProjectModal({ project, close }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-xl"
    >
      <motion.article
        layoutId={`project-${project._id}`}
        style={{ maxWidth: "950px" }}
        className="glass relative grid max-h-[88vh] w-full overflow-hidden rounded-3xl md:grid-cols-[42%_58%]"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close project"
          className="glass absolute right-4 top-4 z-20 rounded-full p-3 transition hover:border-cyan-300 hover:text-cyan-200"
        >
          <X size={19} />
        </button>

        <div className="h-56 overflow-hidden bg-[#0d1822] md:h-auto">
          {project.coverImage?.url ? (
            <img
              src={project.coverImage.url}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full min-h-64 place-items-center">
              <Braces size={55} className="text-cyan-300/60" />
            </div>
          )}
        </div>

        <div className="overflow-y-auto p-6 md:p-9">
          <p className="label">
            {project.category}
            {project.year && ` / ${project.year}`}
          </p>

          <h3 className="mt-4 pr-10 text-3xl font-semibold">
            {project.name}
          </h3>

          <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
            {project.description || project.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies?.map((technology) => (
              <span
                className="rounded-full border border-white/15 px-3 py-1 text-xs"
                key={technology}
              >
                {technology}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
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
        </div>
      </motion.article>
    </motion.div>
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
            className="glass grid overflow-hidden rounded-3xl lg:grid-cols-2"
          >
            <button
              onClick={() => setOpen(x)}
              className={`${i % 2 ? "lg:order-2" : ""} overflow-hidden bg-white/5`}
            >
              <img
                src={x.image?.url}
                alt={x.name}
                className="h-full min-h-72 w-full object-contain transition duration-700 hover:scale-105"
              />
            </button>
            <div className="p-8 md:p-12">
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
