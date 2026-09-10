import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, upload } from "../api";
import {
  Award,
  Briefcase,
  FileText,
  FolderGit2,
  GraduationCap,
  Heart,
  Inbox,
  LockKeyhole,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  Trash2,
  Trophy,
  UploadCloud,
} from "lucide-react";
const tabs = [
  ["profile", "Profile", Settings],
  ["education", "Education", GraduationCap],
  ["experience", "Experience", Briefcase],
  ["tech", "Tech stack", Sparkles],
  ["projects", "Projects", FolderGit2],
  ["certificates", "Certificates", Award],
  ["achievements", "Participation & achievements", Trophy],
  ["resumes", "Resumes", FileText],
  ["hobbies", "Hobbies & likes", Heart],
  ["messages", "Inbox", Inbox],
  ["security", "Security", LockKeyhole],
];
export default function Admin() {
  const [mode, setMode] = useState("loading");
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("profile");
  const [notice, setNotice] = useState("");
  const nav = useNavigate();
  useEffect(() => {
    api("/auth/status").then((s) =>
      s.setupRequired
        ? setMode("setup")
        : api("/auth/me")
            .then(() => {
              setMode("admin");
              refresh();
            })
            .catch(() => setMode("login")),
    );
  }, []);
  async function refresh() {
    setData(await api("/content/admin"));
  }
  if (mode === "loading") return <Center>Loading control room…</Center>;
  if (mode === "login" || mode === "setup")
    return (
      <Auth
        setup={mode === "setup"}
        done={() => {
          setMode("admin");
          refresh();
        }}
      />
    );
  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setMode("login");
  }
  return (
    <main className="min-h-screen bg-[#05080d] p-4 md:p-7">
      <div className="mx-auto max-w-7xl">
        <header className="glass flex items-center justify-between rounded-2xl p-5">
          <div>
            <p className="label">Portfolio control room</p>
            <h1 className="mt-1 text-2xl font-semibold">Hemanth M Sirvi</h1>
          </div>
          <div className="flex gap-2">
            <button className="btn" onClick={() => nav("/")}>
              View site
            </button>
            <button className="btn" onClick={logout}>
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </header>
        {notice && (
          <p className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-sm text-cyan-200">
            {notice}
          </p>
        )}
        <div className="mt-5 grid gap-5 lg:grid-cols-[230px_1fr]">
          <aside className="glass h-fit rounded-2xl p-3">
            {tabs.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${tab === id ? "bg-cyan-300 text-slate-950" : "text-slate-400 hover:bg-white/5"}`}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </aside>
          <section className="glass min-h-[70vh] rounded-2xl p-5 md:p-7">
            {data && (
              <Panel
                tab={tab}
                data={data}
                refresh={refresh}
                notice={setNotice}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
function Center({ children }) {
  return (
    <main className="grid min-h-screen place-items-center">
      <p className="label">{children}</p>
    </main>
  );
}
function Auth({ setup, done }) {
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api(`/auth/${setup ? "setup" : "login"}`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      done();
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8">
        <p className="label">
          {setup ? "Create owner account" : "Owner access"}
        </p>
        <h1 className="mt-4 text-3xl font-semibold">
          {setup ? "Secure your portfolio" : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {setup
            ? "This one-time setup creates the only administrator. Use a new password that you have not used elsewhere."
            : "Enter your administrator credentials."}
        </p>
        <div className="mt-7 space-y-4">
          <input
            className="field"
            name="email"
            type="email"
            required
            placeholder="Email"
          />
          <input
            className="field"
            name="password"
            type="password"
            minLength="10"
            required
            placeholder="Password"
          />
          <button className="btn w-full justify-center">
            {setup ? "Create admin" : "Sign in"}
          </button>
          {error && <p className="text-sm text-rose-300">{error}</p>}
        </div>
      </form>
    </main>
  );
}
function Panel({ tab, data, refresh, notice }) {
  if (tab === "profile")
    return <Profile data={data.portfolio} refresh={refresh} notice={notice} />;
  if (tab === "education")
    return (
      <Education data={data.portfolio} refresh={refresh} notice={notice} />
    );
  if (tab === "experience")
    return (
      <ExperienceManager
        data={data.portfolio}
        refresh={refresh}
        notice={notice}
      />
    );
  if (tab === "tech")
    return <Tech data={data.portfolio} refresh={refresh} notice={notice} />;
  if (tab === "projects")
    return <Projects items={data.projects} refresh={refresh} notice={notice} />;
  if (tab === "certificates")
    return (
      <Certificates
        items={data.certificates}
        refresh={refresh}
        notice={notice}
      />
    );
  if (tab === "achievements")
    return (
      <Achievements data={data.portfolio} refresh={refresh} notice={notice} />
    );
  if (tab === "resumes")
    return <Resumes items={data.resumes} refresh={refresh} notice={notice} />;
  if (tab === "hobbies")
    return (
      <HobbiesManager data={data.portfolio} refresh={refresh} notice={notice} />
    );
  if (tab === "messages")
    return <Messages items={data.messages} refresh={refresh} />;
  return <Security notice={notice} />;
}
async function savePortfolio(payload, refresh, notice) {
  await api("/content/portfolio", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  notice("Changes saved.");
  refresh();
}
function Profile({ data, refresh, notice }) {
  const [profileImage, setProfileImage] = useState(
    data?.about?.image || null,
  );
  const [uploading, setUploading] = useState(false);

  async function handleImage(file) {
    if (!file?.size) return;

    try {
      setUploading(true);
      notice("Uploading profile image…");

      const uploadedImage = await upload(file);
      setProfileImage(uploadedImage);

      notice("Image uploaded. Click Save changes.");
    } catch (error) {
      notice(error.message || "Profile image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();

    const f = Object.fromEntries(new FormData(e.currentTarget));

    await savePortfolio(
      {
        profile: {
          ...data?.profile,
          name: f.name,
          headline: f.headline,
          intro: f.intro,
          location: f.location,
          availability: f.availability,
        },

        about: {
          ...data?.about,
          heading: f.aboutHeading,
          bio: f.bio,
          image: profileImage,
        },

        contact: {
          ...data?.contact,
          email: f.email,
          linkedin: f.linkedin,
          github: f.github,
          location: f.location,
          formEnabled: true,
        },
      },
      refresh,
      notice,
    );
  }

  return (
    <form onSubmit={submit}>
      <Title
        title="Profile and contact"
        sub="Manage the information visitors see across the portfolio."
      />

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        <Field
          label="Full name"
          name="name"
          value={data?.profile?.name}
        />

        <Field
          label="Availability"
          name="availability"
          value={data?.profile?.availability}
        />

        <Field
          label="Hero headline"
          name="headline"
          value={data?.profile?.headline}
          wide
        />

        <Area
          label="Hero introduction"
          name="intro"
          value={data?.profile?.intro}
          wide
        />

        <Field
          label="About heading"
          name="aboutHeading"
          value={data?.about?.heading}
          wide
        />

        <Area
          label="About biography"
          name="bio"
          value={data?.about?.bio}
          wide
        />

        <div className="md:col-span-2 rounded-2xl border border-white/10 p-5">
          <span className="mb-4 block text-xs uppercase tracking-widest text-slate-500">
            Profile image
          </span>

          <div className="flex flex-wrap items-center gap-5">
            {profileImage?.url ? (
              <img
                src={profileImage.url}
                alt="Current profile"
                className="h-28 w-28 rounded-full border-2 border-cyan-300/50 object-cover"
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-full border border-dashed border-white/20 text-xs text-slate-500">
                No image
              </div>
            )}

            <label className="btn cursor-pointer border-cyan-300">
              <UploadCloud size={16} />

              {uploading
                ? "Uploading..."
                : profileImage?.url
                  ? "Change image"
                  : "Upload image"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(event) =>
                  handleImage(event.target.files?.[0])
                }
              />
            </label>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Select an image, wait for the upload to finish, and click Save
            changes.
          </p>
        </div>

        <Field
          label="Email"
          name="email"
          value={data?.contact?.email}
        />

        <Field
          label="Location"
          name="location"
          value={data?.contact?.location}
        />

        <Field
          label="LinkedIn URL"
          name="linkedin"
          value={data?.contact?.linkedin}
        />

        <Field
          label="GitHub URL"
          name="github"
          value={data?.contact?.github}
        />
      </div>

      <Save />
    </form>
  );
}
function Education({ data, refresh, notice }) {
  const [items, setItems] = useState(data?.educations || []);
  const update = (i, key, value) =>
    setItems(items.map((x, j) => (j === i ? { ...x, [key]: value } : x)));
  return (
    <div>
      <Title
        title="Education"
        sub="Add qualifications in display order. This section stays hidden until at least one published entry exists."
      />
      {items.map((x, i) => (
        <div
          key={x._id || i}
          className="mt-5 grid gap-3 rounded-2xl border border-white/10 p-5 md:grid-cols-2"
        >
          <input
            className="field"
            placeholder="Institution"
            value={x.institution || ""}
            onChange={(e) => update(i, "institution", e.target.value)}
          />
          <input
            className="field"
            placeholder="Degree"
            value={x.degree || ""}
            onChange={(e) => update(i, "degree", e.target.value)}
          />
          <input
            className="field"
            placeholder="Field of study"
            value={x.field || ""}
            onChange={(e) => update(i, "field", e.target.value)}
          />
          <input
            className="field"
            placeholder="Period, e.g. 2023 – 2027"
            value={x.period || ""}
            onChange={(e) => update(i, "period", e.target.value)}
          />
          <input
            className="field"
            placeholder="CGPA / percentage (optional)"
            value={x.score || ""}
            onChange={(e) => update(i, "score", e.target.value)}
          />
          <input
            className="field"
            type="number"
            placeholder="Display order"
            value={x.order ?? i}
            onChange={(e) => update(i, "order", Number(e.target.value))}
          />
          <textarea
            className="field min-h-24 md:col-span-2"
            placeholder="Description"
            value={x.description || ""}
            onChange={(e) => update(i, "description", e.target.value)}
          />
          <PublishControl
            checked={x.published !== false}
            onChange={(v) => update(i, "published", v)}
          />
          <button
            className="justify-self-end p-3 text-rose-300"
            onClick={() => setItems(items.filter((_, j) => j !== i))}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <ManagerActions
        add={() =>
          setItems([...items, { published: true, order: items.length }])
        }
        save={() => savePortfolio({ educations: items }, refresh, notice)}
        label="Education"
      />
    </div>
  );
}
function ExperienceManager({ data, refresh, notice }) {
  const [items, setItems] = useState(data?.experiences || []);
  const update = (i, key, value) =>
    setItems(items.map((x, j) => (j === i ? { ...x, [key]: value } : x)));
  return (
    <div>
      <Title
        title="Experience"
        sub="Add internships, employment or volunteer engineering work. Unpublished items remain private."
      />
      {items.map((x, i) => (
        <div
          key={x._id || i}
          className="mt-5 grid gap-3 rounded-2xl border border-white/10 p-5 md:grid-cols-2"
        >
          <input
            className="field"
            placeholder="Role / title"
            value={x.title || ""}
            onChange={(e) => update(i, "title", e.target.value)}
          />
          <input
            className="field"
            placeholder="Company / organization"
            value={x.company || ""}
            onChange={(e) => update(i, "company", e.target.value)}
          />
          <input
            className="field"
            placeholder="Period"
            value={x.period || ""}
            onChange={(e) => update(i, "period", e.target.value)}
          />
          <input
            className="field"
            type="number"
            placeholder="Display order"
            value={x.order ?? i}
            onChange={(e) => update(i, "order", Number(e.target.value))}
          />
          <textarea
            className="field min-h-28 md:col-span-2"
            placeholder="What you contributed"
            value={x.description || ""}
            onChange={(e) => update(i, "description", e.target.value)}
          />
          <PublishControl
            checked={x.published !== false}
            onChange={(v) => update(i, "published", v)}
          />
          <button
            className="justify-self-end p-3 text-rose-300"
            onClick={() => setItems(items.filter((_, j) => j !== i))}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <ManagerActions
        add={() =>
          setItems([...items, { published: true, order: items.length }])
        }
        save={() => savePortfolio({ experiences: items }, refresh, notice)}
        label="Experience"
      />
    </div>
  );
}
function Achievements({ data, refresh, notice }) {
  const [items, setItems] = useState(data?.achievements || []);
  const update = (i, key, value) =>
    setItems(items.map((x, j) => (j === i ? { ...x, [key]: value } : x)));
  return (
    <div>
      <Title
        title="Participation and achievements"
        sub="Add hackathons, LeetCode milestones, competitions, leadership and other recognitions."
      />
      {items.map((x, i) => (
        <div
          key={x._id || i}
          className="mt-5 grid gap-3 rounded-2xl border border-white/10 p-5 md:grid-cols-2"
        >
          <input
            className="field"
            placeholder="Title"
            value={x.title || ""}
            onChange={(e) => update(i, "title", e.target.value)}
          />
          <select
            className="field"
            value={x.type || "Hackathon"}
            onChange={(e) => update(i, "type", e.target.value)}
          >
            <option>Hackathon</option>
            <option>Coding</option>
            <option>Competition</option>
            <option>Achievement</option>
            <option>Leadership</option>
            <option>Open Source</option>
            <option>Other</option>
          </select>
          <input
            className="field"
            placeholder="Organization / platform"
            value={x.organization || ""}
            onChange={(e) => update(i, "organization", e.target.value)}
          />
          <input
            className="field"
            placeholder="Year"
            value={x.year || ""}
            onChange={(e) => update(i, "year", e.target.value)}
          />
          <input
            className="field"
            placeholder="Metric, e.g. 350+ problems solved"
            value={x.metric || ""}
            onChange={(e) => update(i, "metric", e.target.value)}
          />
          <input
            className="field"
            type="url"
            placeholder="Proof / profile URL (optional)"
            value={x.link || ""}
            onChange={(e) => update(i, "link", e.target.value)}
          />
          <textarea
            className="field min-h-28 md:col-span-2"
            placeholder="Description and outcome"
            value={x.description || ""}
            onChange={(e) => update(i, "description", e.target.value)}
          />
          <PublishControl
            checked={x.published !== false}
            onChange={(v) => update(i, "published", v)}
          />
          <button
            className="justify-self-end p-3 text-rose-300"
            onClick={() => setItems(items.filter((_, j) => j !== i))}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <ManagerActions
        add={() =>
          setItems([
            ...items,
            { type: "Hackathon", published: true, order: items.length },
          ])
        }
        save={() => savePortfolio({ achievements: items }, refresh, notice)}
        label="Achievement"
      />
    </div>
  );
}
function HobbiesManager({ data, refresh, notice }) {
  const [items, setItems] = useState(data?.hobbies || []);
  const update = (i, key, value) =>
    setItems(items.map((x, j) => (j === i ? { ...x, [key]: value } : x)));
  async function addImage(i, file) {
    if (!file?.size) return;
    notice("Uploading image…");
    const image = await upload(file);
    update(i, "image", image);
    notice("Image uploaded. Save changes to publish it.");
  }
  return (
    <div>
      <Title
        title="Hobbies and likes"
        sub="Optional personal interests. The public section stays hidden until a published item exists."
      />
      {items.map((x, i) => (
        <div
          key={x._id || i}
          className="mt-5 grid gap-3 rounded-2xl border border-white/10 p-5 md:grid-cols-2"
        >
          <input
            className="field"
            placeholder="Hobby / interest"
            value={x.name || ""}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <input
            className="field"
            type="number"
            placeholder="Display order"
            value={x.order ?? i}
            onChange={(e) => update(i, "order", Number(e.target.value))}
          />
          <textarea
            className="field min-h-24 md:col-span-2"
            placeholder="Short description"
            value={x.description || ""}
            onChange={(e) => update(i, "description", e.target.value)}
          />
          <label>
            <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
              Optional image
            </span>
            <input
              className="field"
              type="file"
              accept="image/*"
              onChange={(e) => addImage(i, e.target.files?.[0])}
            />
          </label>
          {x.image?.url && (
            <img
              src={x.image.url}
              alt=""
              className="h-24 w-36 rounded-xl object-cover"
            />
          )}
          <PublishControl
            checked={x.published !== false}
            onChange={(v) => update(i, "published", v)}
          />
          <button
            className="justify-self-end p-3 text-rose-300"
            onClick={() => setItems(items.filter((_, j) => j !== i))}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <ManagerActions
        add={() =>
          setItems([...items, { published: true, order: items.length }])
        }
        save={() => savePortfolio({ hobbies: items }, refresh, notice)}
        label="Hobby"
      />
    </div>
  );
}
function PublishControl({ checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-cyan-300"
      />
      Show on portfolio
    </label>
  );
}
function ManagerActions({ add, save, label }) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={add} className="btn">
        <Plus size={16} />
        Add {label}
      </button>
      <button type="button" onClick={save} className="btn border-cyan-300">
        Save changes
      </button>
    </div>
  );
}
function Tech({ data, refresh, notice }) {
  const [categories, setCategories] = useState(data?.techCategories || []);
  function add() {
    setCategories([...categories, { name: "New category", items: [] }]);
  }
  return (
    <div>
      <Title
        title="Tech stack"
        sub="Enter comma-separated technology names. Logos are matched automatically when available."
      />
      {categories.map((c, i) => (
        <div
          className="mt-5 grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-[.6fr_1.4fr_auto]"
          key={i}
        >
          <input
            className="field"
            value={c.name}
            onChange={(e) =>
              setCategories(
                categories.map((x, j) =>
                  j === i ? { ...x, name: e.target.value } : x,
                ),
              )
            }
          />
          <input
            className="field"
            value={c.items.join(", ")}
            onChange={(e) =>
              setCategories(
                categories.map((x, j) =>
                  j === i
                    ? {
                        ...x,
                        items: e.target.value
                          .split(",")
                          .map((v) => v.trim())
                          .filter(Boolean),
                      }
                    : x,
                ),
              )
            }
          />
          <button
            onClick={() => setCategories(categories.filter((_, j) => j !== i))}
            className="p-3 text-rose-300"
          >
            <Trash2 />
          </button>
        </div>
      ))}
      <div className="mt-5 flex gap-3">
        <button onClick={add} className="btn">
          <Plus size={16} />
          Category
        </button>
        <button
          onClick={() =>
            savePortfolio({ techCategories: categories }, refresh, notice)
          }
          className="btn border-cyan-300"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
function Title({ title, sub }) {
  return (
    <div>
      <p className="label">Content manager</p>
      <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{sub}</p>
    </div>
  );
}
function Field({ label, name, value = "", wide = false, type = "text" }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <input
        className="field"
        name={name}
        type={type}
        defaultValue={value || ""}
      />
    </label>
  );
}
function Area({ label, name, value = "", wide = false }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <textarea
        className="field min-h-28"
        name={name}
        defaultValue={value || ""}
      />
    </label>
  );
}
function Save() {
  return (
    <button className="btn mt-6 border-cyan-300" type="submit">
      Save changes
    </button>
  );
}
function Projects({ items, refresh, notice }) {
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    let coverImage = {};
    const file = fd.get("image");
    if (file?.size) coverImage = await upload(file);
    const body = {
      name: fd.get("name"),
      category: fd.get("category"),
      shortDescription: fd.get("shortDescription"),
      description: fd.get("description"),
      githubUrl: fd.get("githubUrl"),
      demoUrl: fd.get("demoUrl"),
      technologies: String(fd.get("technologies"))
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      coverImage,
      published: true,
    };
    await api("/content/projects", {
      method: "POST",
      body: JSON.stringify(body),
    });
    form.reset();
    notice("Project published.");
    refresh();
  }
  return (
    <div>
      <Title
        title="Projects"
        sub="Create categories directly while adding projects. Categories appear automatically in public filters."
      />
      <form
        onSubmit={submit}
        className="mt-7 grid gap-4 rounded-2xl border border-white/10 p-5 md:grid-cols-2"
      >
        <Field label="Project name" name="name" />
        <Field label="Category" name="category" />
        <Area label="Short description" name="shortDescription" wide />
        <Area label="Detailed description" name="description" wide />
        <Field label="GitHub URL" name="githubUrl" type="url" />
        <Field label="Live demo URL" name="demoUrl" type="url" />
        <Field label="Technologies, comma separated" name="technologies" wide />
        <label className="md:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
            Cover image
          </span>
          <input className="field" name="image" type="file" accept="image/*" />
        </label>
        <button className="btn w-fit border-cyan-300">
          <Plus size={16} />
          Publish project
        </button>
      </form>
      <ItemList items={items} type="projects" refresh={refresh} />
    </div>
  );
}
function Certificates({ items, refresh, notice }) {
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("image");
    if (!file?.size) return notice("Select a certificate image.");
    const image = await upload(file);
    await api("/content/certificates", {
      method: "POST",
      body: JSON.stringify({
        name: fd.get("name"),
        year: fd.get("year"),
        issuer: fd.get("issuer"),
        description: fd.get("description"),
        technologies: String(fd.get("technologies"))
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        image,
        published: true,
      }),
    });
    form.reset();
    notice("Certificate published.");
    refresh();
  }
  return (
    <div>
      <Title
        title="Certifications"
        sub="Upload the certificate and describe what you learned."
      />
      <form
        onSubmit={submit}
        className="mt-7 grid gap-4 rounded-2xl border border-white/10 p-5 md:grid-cols-2"
      >
        <Field label="Certificate name" name="name" />
        <Field label="Year" name="year" />
        <Field label="Issuer" name="issuer" wide />
        <Area label="Description" name="description" wide />
        <Field label="Technologies learned" name="technologies" wide />
        <label className="md:col-span-2">
          <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
            Certificate image
          </span>
          <input
            className="field"
            name="image"
            type="file"
            accept="image/*"
            required
          />
        </label>
        <button className="btn w-fit border-cyan-300">
          <UploadCloud size={16} />
          Publish certificate
        </button>
      </form>
      <ItemList items={items} type="certificates" refresh={refresh} />
    </div>
  );
}
function Resumes({ items, refresh, notice }) {
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file");
    if (!file?.size) return;
    const uploaded = await upload(file);
    await api("/content/resumes", {
      method: "POST",
      body: JSON.stringify({
        track: fd.get("track"),
        file: uploaded,
        isDefault: items.length === 0,
        published: true,
      }),
    });
    form.reset();
    notice("Resume uploaded.");
    refresh();
  }
  return (
    <div>
      <Title
        title="Resumes"
        sub="Add SDE, Data, ML or any future resume track."
      />
      <form
        onSubmit={submit}
        className="mt-7 grid gap-4 rounded-2xl border border-white/10 p-5 md:grid-cols-2"
      >
        <Field label="Track name" name="track" />
        <label>
          <span className="mb-2 block text-xs uppercase tracking-widest text-slate-500">
            PDF file
          </span>
          <input
            className="field"
            name="file"
            type="file"
            accept="application/pdf"
            required
          />
        </label>
        <button className="btn w-fit border-cyan-300">
          <UploadCloud size={16} />
          Upload resume
        </button>
      </form>
      <ItemList items={items} type="resumes" refresh={refresh} />
    </div>
  );
}
function ItemList({ items, type, refresh }) {
  return (
    <div className="mt-8">
      <p className="label">Published items</p>
      <div className="mt-3 space-y-2">
        {items.map((x) => (
          <div
            className="flex items-center justify-between rounded-xl border border-white/10 p-4"
            key={x._id}
          >
            <div>
              <p className="font-medium">{x.name || x.track}</p>
              <p className="mt-1 text-xs text-slate-500">
                {x.category || x.year || "Published"}
              </p>
            </div>
            <button
              aria-label="Delete"
              onClick={async () => {
                if (confirm("Delete this item?")) {
                  await api(`/content/${type}/${x._id}`, { method: "DELETE" });
                  refresh();
                }
              }}
              className="p-2 text-rose-300"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
function Messages({ items, refresh }) {
  return (
    <div>
      <Title
        title="Contact inbox"
        sub="Messages submitted through the portfolio contact form."
      />
      <div className="mt-7 space-y-3">
        {items.map((x) => (
          <article
            key={x._id}
            className={`rounded-2xl border p-5 ${x.read ? "border-white/10" : "border-cyan-300/40 bg-cyan-300/5"}`}
          >
            <div className="flex justify-between">
              <div>
                <h3>
                  {x.name} ·{" "}
                  <a className="text-cyan-200" href={`mailto:${x.email}`}>
                    {x.email}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-slate-500">{x.subject}</p>
              </div>
              <button
                onClick={async () => {
                  await api(`/content/messages/${x._id}`, { method: "DELETE" });
                  refresh();
                }}
                className="text-rose-300"
              >
                <Trash2 size={17} />
              </button>
            </div>
            <p className="mt-4 leading-7 text-slate-300">{x.message}</p>
            {!x.read && (
              <button
                onClick={async () => {
                  await api(`/content/messages/${x._id}/read`, {
                    method: "PUT",
                  });
                  refresh();
                }}
                className="mt-4 text-xs text-cyan-300"
              >
                MARK AS READ
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
function Security({ notice }) {
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      await api("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(body),
      });
      form.reset();
      notice("Password changed successfully.");
    } catch (e) {
      notice(e.message);
    }
  }
  return (
    <form onSubmit={submit} className="max-w-xl">
      <Title
        title="Security"
        sub="Change the administrator password. Use a unique password of at least 10 characters."
      />
      <div className="mt-7 space-y-4">
        <Field
          label="Current password"
          name="currentPassword"
          type="password"
        />
        <Field label="New password" name="newPassword" type="password" />
        <button className="btn border-cyan-300">Change password</button>
      </div>
    </form>
  );
}
