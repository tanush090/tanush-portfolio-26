import { useEffect, useState } from "react";

import {
  Lock,
  LogIn,
  ShieldCheck,
  FolderKanban,
  Code2,
  Briefcase,
  Award,
  FileText,
  MessageSquare,
  BarChart3,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Upload,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL;

type Section =
  | "dashboard"
  | "about"
  | "projects"
  | "skills"
  | "career"
  | "certifications"
  | "resume"
  | "messages";

type Item = Record<string, any>;

function AdminApp() {
  const [token, setToken] = useState(
    sessionStorage.getItem("adminToken")
  );

  const [section, setSection] =
    useState<Section>("dashboard");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editing, setEditing] =
    useState<Item | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] =
    useState<Item>({});

  const [resume, setResume] =
    useState<Item | null>(null);

  const [resumeFile, setResumeFile] =
    useState<File | null>(null);

  const [certificationImageFile, setCertificationImageFile] =
    useState<File | null>(null);

  const [projectImageFile, setProjectImageFile] =
    useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: ShieldCheck,
    },
    {
      id: "about",
      label: "About",
      icon: BarChart3,
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
    },
    {
      id: "skills",
      label: "Skills",
      icon: Code2,
    },
    {
      id: "career",
      label: "Career",
      icon: Briefcase,
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
    },
    {
      id: "resume",
      label: "Resume",
      icon: FileText,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
    },
  ] as const;

  /* ---------------- HELPERS ---------------- */

 const getAssetUrl = (value: string) => {
  if (!value) return "";

  const API_ORIGIN = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

  return value.startsWith("http")
    ? value
    : `${API_ORIGIN}${value}`;
};
  /* ---------------- LOGIN ---------------- */

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await fetch(
        `${API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      sessionStorage.setItem(
        "adminToken",
        data.token
      );

      setToken(data.token);
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    setToken(null);
    setSection("dashboard");
  };

  /* ---------------- API ---------------- */

  const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
  ) => {
    const currentToken =
      sessionStorage.getItem("adminToken");

    const response = await fetch(
      `${API}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",

          ...(currentToken
            ? {
                Authorization: `Bearer ${currentToken}`,
              }
            : {}),

          ...(options.headers || {}),
        },
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (response.status === 401) {
      logout();

      throw new Error(
        "Session expired. Please login again."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message || "Request failed"
      );
    }

    return data;
  };

  /* ---------------- LOAD DATA ---------------- */

  const loadSection = async (
    currentSection: Section
  ) => {
    if (
      currentSection === "dashboard" ||
      currentSection === "resume"
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpointMap: Record<
        string,
        string
      > = {
        about: "/about",
        projects: "/projects",
        skills: "/skills",
        career: "/career",
        certifications: "/certifications",
        messages: "/messages",
      };

      const data = await apiRequest(
        endpointMap[currentSection]
      );

      if (currentSection === "about") {
        setItems([data]);
      } else {
        setItems(
          Array.isArray(data)
            ? data
            : data.items || []
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadSection(section);
    }
  }, [section, token]);

  const loadResume = async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await apiRequest("/resume");

      setResume(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load resume"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      token &&
      section === "resume"
    ) {
      loadResume();
    }
  }, [section, token]);

  /* ---------------- FORMS ---------------- */

  const openAdd = () => {
    setEditing(null);

    setCertificationImageFile(null);
    setProjectImageFile(null);

    if (section === "projects") {
      setForm({
        title: "",
        description: "",
        image: "",
        liveDemoUrl: "",
        githubUrl: "",
        order: 0,
      });
    }

    if (section === "skills") {
      setForm({
        name: "",
        icon: "",
        category: "Working",
        progress: 50,
        order: 0,
      });
    }

    if (section === "career") {
      setForm({
        year: "",
        title: "",
        subtitle: "",
        description: "",
        icon: "briefcase",
        order: 0,
      });
    }

    if (
      section === "certifications"
    ) {
      setForm({
        title: "",
        issuer: "",
        date: "",
        description: "",
        image: "",
        verificationLink: "",
        order: 0,
      });
    }

    setShowForm(true);
  };

  const openEdit = (item: Item) => {
    setEditing(item);

    setCertificationImageFile(null);
    setProjectImageFile(null);

    if (section === "skills") {
      setForm({
        ...item,
        progress:
          item.progress !== undefined
            ? Number(item.progress)
            : 50,
      });
    } else {
      setForm({ ...item });
    }

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({});

    setCertificationImageFile(null);
    setProjectImageFile(null);
  };

  /* ---------------- CERTIFICATE IMAGE UPLOAD ---------------- */

  const uploadCertificationImage = async (
    file: File
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        "Certificate image must be 5 MB or smaller."
      );
    }

    const formData = new FormData();

    formData.append("image", file);

    const currentToken =
      sessionStorage.getItem(
        "adminToken"
      );

    const response = await fetch(
      `${API}/certifications/upload-image`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${currentToken}`,
        },

        body: formData,
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (response.status === 401) {
      logout();

      throw new Error(
        "Session expired. Please login again."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Certificate image upload failed"
      );
    }

    return data.image as string;
  };

  /* ---------------- PROJECT IMAGE UPLOAD ---------------- */

  const uploadProjectImage = async (
    file: File
  ) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        "Project image must be 5 MB or smaller."
      );
    }

    const formData = new FormData();

    formData.append("image", file);

    const currentToken =
      sessionStorage.getItem(
        "adminToken"
      );

    const response = await fetch(
      `${API}/projects/upload-image`,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${currentToken}`,
        },

        body: formData,
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    if (response.status === 401) {
      logout();

      throw new Error(
        "Session expired. Please login again."
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Project image upload failed"
      );
    }

    return data.image as string;
  };

  /* ---------------- SAVE ---------------- */

  const saveItem = async () => {
    setSaving(true);
    setError("");

    try {
      const endpointMap: Record<
        string,
        string
      > = {
        about: "/about",
        projects: "/projects",
        skills: "/skills",
        career: "/career",
        certifications:
          "/certifications",
      };

      const endpoint =
        endpointMap[section];

      if (!endpoint) {
        throw new Error(
          "Invalid section"
        );
      }

      let payload = {
        ...form,
      };

      if (section === "about") {
        payload = {
          graduationYear:
            items[0]?.graduationYear || "",
          coreProjects:
            items[0]?.coreProjects || "",
          technicalSkills:
            items[0]?.technicalSkills || "",
          developmentFocus:
            items[0]?.developmentFocus || "",
        };
      }

      /* -------- SKILLS -------- */

      if (section === "skills") {
        payload = {
          ...payload,

          name: String(
            payload.name || ""
          ).trim(),

          icon: String(
            payload.icon || ""
          ).trim(),

          category:
            payload.category ||
            "Working",

          progress:
            payload.progress === "" ||
            payload.progress ===
              undefined ||
            payload.progress === null
              ? 50
              : Number(
                  payload.progress
                ),

          order:
            payload.order === "" ||
            payload.order ===
              undefined ||
            payload.order === null
              ? 0
              : Number(
                  payload.order
                ),
        };
      }

      /* -------- CERTIFICATIONS -------- */

      if (
        section === "certifications" &&
        certificationImageFile
      ) {
        const imagePath =
          await uploadCertificationImage(
            certificationImageFile
          );

        payload.image = imagePath;
      }

      if (
        section === "projects" &&
        projectImageFile
      ) {
        const imagePath =
          await uploadProjectImage(
            projectImageFile
          );

        payload.image = imagePath;
      }

      await apiRequest(
        section === "about"
          ? endpoint
          : editing
            ? `${endpoint}/${editing._id}`
            : endpoint,
        {
          method:
            section === "about"
              ? "PUT"
              : editing
                ? "PUT"
                : "POST",

          body: JSON.stringify(
            payload
          ),
        }
      );

      closeForm();

      await loadSection(section);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteItem = async (
    item: Item
  ) => {
    if (
      !window.confirm(
        "Delete this item?"
      )
    ) {
      return;
    }

    try {
      const endpointMap: Record<
        string,
        string
      > = {
        projects: "/projects",
        skills: "/skills",
        career: "/career",
        certifications:
          "/certifications",
        messages: "/messages",
      };

      await apiRequest(
        `${endpointMap[section]}/${item._id}`,
        {
          method: "DELETE",
        }
      );

      await loadSection(section);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Delete failed"
      );
    }
  };

  /* ---------------- MESSAGE STATUS ---------------- */

  const updateMessageStatus = async (
    id: string,
    status: string
  ) => {
    try {
      await apiRequest(
        `/messages/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
        }
      );

      await loadSection(
        "messages"
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update message"
      );
    }
  };

  /* ---------------- RESUME ---------------- */

  const uploadResume = async () => {
    if (!resumeFile) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "resume",
        resumeFile
      );

      const currentToken =
        sessionStorage.getItem(
          "adminToken"
        );

      const response = await fetch(
        `${API}/resume/upload`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${currentToken}`,
          },

          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Resume upload failed"
        );
      }

      setResumeFile(null);

      await loadResume();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Resume upload failed"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- LOGIN SCREEN ---------------- */

  if (!token) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_45%)]" />

        <div className="relative w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <h1 className="text-3xl font-semibold">
              Admin Access
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Sign in to manage your portfolio
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Username
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(
                        e.target.value
                      )
                    }
                    required
                    autoComplete="username"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-white/30"
                    placeholder="Admin username"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-white/30"
                    placeholder="Admin password"
                  />
                </div>
              </div>

              {loginError && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-medium text-black disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />

                {loginLoading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------- ADMIN PANEL ---------------- */

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Admin Dashboard
          </h1>

          <p className="text-sm text-white/40">
            Tanush Kumar Portfolio
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-81px)]">
        <aside className="hidden w-64 border-r border-white/10 p-4 md:block">
          <nav className="space-y-1">
            {navItems.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  section ===
                  item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setSection(
                        item.id
                      )
                    }
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                      active
                        ? "bg-white text-black"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />

                    {item.label}
                  </button>
                );
              }
            )}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {section === "about" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  About
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Edit the four values shown in the About section.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    key: "graduationYear",
                    label: "Graduation Year",
                    value:
                      items[0]?.graduationYear ||
                      "",
                  },
                  {
                    key: "coreProjects",
                    label: "Core Projects",
                    value:
                      items[0]?.coreProjects ||
                      "",
                  },
                  {
                    key: "technicalSkills",
                    label: "Technical Skills",
                    value:
                      items[0]?.technicalSkills ||
                      "",
                  },
                  {
                    key: "developmentFocus",
                    label: "Development Focus",
                    value:
                      items[0]?.developmentFocus ||
                      "",
                  },
                ].map((field) => (
                  <div
                    key={field.key}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <label className="mb-2 block text-sm text-white/60">
                      {field.label}
                    </label>

                    <input
                      value={field.value}
                      onChange={(e) => {
                        setItems([
                          {
                            ...(items[0] || {}),
                            [field.key]:
                              e.target.value,
                          },
                        ]);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={saveItem}
                disabled={saving}
                className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          )}

          {section ===
            "dashboard" && (
            <Dashboard
              onSelect={(value) =>
                setSection(value)
              }
            />
          )}

          {section ===
            "projects" && (
            <ManagementSection
              title="Projects"
              description="Manage portfolio projects."
              items={items}
              loading={loading}
              fields={[
                "title",
                "description",
                "image",
                "liveDemoUrl",
                "githubUrl",
                "order",
                "gridClass",
              ]}
              form={form}
              setForm={setForm}
              showForm={showForm}
              editing={editing}
              saving={saving}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={deleteItem}
              onSave={saveItem}
              onCancel={closeForm}
              projectImageFile={
                projectImageFile
              }
              setProjectImageFile={
                setProjectImageFile
              }
              getAssetUrl={getAssetUrl}
            />
          )}

          {section ===
            "skills" && (
            <ManagementSection
              title="Skills"
              description="Manage technical skills."
              items={items}
              loading={loading}
              fields={[
                "name",
                "icon",
                "category",
                "progress",
                "order",
              ]}
              form={form}
              setForm={setForm}
              showForm={showForm}
              editing={editing}
              saving={saving}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={deleteItem}
              onSave={saveItem}
              onCancel={closeForm}
            />
          )}

          {section ===
            "career" && (
            <ManagementSection
              title="Career"
              description="Manage career and experience."
              items={items}
              loading={loading}
              fields={[
                "year",
                "title",
                "subtitle",
                "description",
                "icon",
                "order",
              ]}
              form={form}
              setForm={setForm}
              showForm={showForm}
              editing={editing}
              saving={saving}
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={deleteItem}
              onSave={saveItem}
              onCancel={closeForm}
            />
          )}

          {section ===
            "certifications" && (
            <ManagementSection
              title="Certifications"
              description="Manage certificates."
              items={items}
              loading={loading}
              fields={[
                "title",
                "issuer",
                "date",
                "description",
                "image",
                "verificationLink",
                "order",
              ]}
              form={form}
              setForm={setForm}
              showForm={showForm}
              editing={editing}
              saving={saving}
              certificationImageFile={
                certificationImageFile
              }
              setCertificationImageFile={
                setCertificationImageFile
              }
              getAssetUrl={
                getAssetUrl
              }
              onAdd={openAdd}
              onEdit={openEdit}
              onDelete={deleteItem}
              onSave={saveItem}
              onCancel={closeForm}
            />
          )}

          {section ===
            "messages" && (
            <MessagesSection
              items={items}
              loading={loading}
              onDelete={deleteItem}
              onStatus={
                updateMessageStatus
              }
            />
          )}

          {section ===
            "resume" && (
            <ResumeSection
              resume={resume}
              file={resumeFile}
              setFile={setResumeFile}
              saving={saving}
              loading={loading}
              onUpload={
                uploadResume
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard({
  onSelect,
}: {
  onSelect: (section: Section) => void;
}) {
  const cards = [
    ["projects", FolderKanban, "Projects"],
    ["skills", Code2, "Skills"],
    ["career", Briefcase, "Career"],
    ["certifications", Award, "Certifications"],
    ["resume", FileText, "Resume"],
    ["messages", MessageSquare, "Messages"],
  ] as const;

  return (
    <>
      <h2 className="text-3xl font-semibold">
        Manage Portfolio
      </h2>

      <p className="mt-2 mb-8 text-white/50">
        Manage your portfolio content from one place.
      </p>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(
          ([id, Icon, title]) => (
            <button
              key={id}
              onClick={() =>
                onSelect(id)
              }
              className="text-left rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.08] transition"
            >
              <Icon className="mb-5 h-6 w-6 text-white/70" />

              <h3 className="text-lg font-medium">
                {title}
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Manage{" "}
                {title.toLowerCase()}.
              </p>
            </button>
          )
        )}
      </div>
    </>
  );
}

/* ---------------- CRUD SECTION ---------------- */

function ManagementSection({
  title,
  description,
  items,
  loading,
  fields,
  form,
  setForm,
  showForm,
  editing,
  saving,

  certificationImageFile,
  setCertificationImageFile,

  projectImageFile,
  setProjectImageFile,

  getAssetUrl,

  onAdd,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}: any) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold">
            {title}
          </h2>

          <p className="mt-2 text-white/50">
            {description}
          </p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
        >
          <Plus className="h-4 w-4" />
          Add {title.slice(0, -1)}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium">
              {editing ? "Edit" : "Add"}{" "}
              {title.slice(0, -1)}
            </h3>

            <button
              onClick={onCancel}
            >
              <X className="h-5 w-5 text-white/50 hover:text-white" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(
              (field: string) => (
                <div
                  key={field}
                  className={
                    field === "description"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  {field === "image" &&
                  (title ===
                    "Certifications" ||
                    title ===
                      "Projects") ? (
                    <div>
                      <label className="mb-2 block text-xs text-white/50">
                        {title ===
                        "Projects"
                          ? "Project Image"
                          : "Certificate Image"}
                      </label>

                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-6 hover:bg-white/[0.04]">
                        <Upload className="mb-3 h-6 w-6 text-white/50" />

                        <span className="text-sm text-center">
                          {title ===
                          "Projects"
                            ? projectImageFile
                              ? projectImageFile.name
                              : editing &&
                                form.image
                                ? "Choose a new project image"
                                : "Choose project image"
                            : certificationImageFile
                              ? certificationImageFile.name
                              : editing &&
                                form.image
                                ? "Choose a new certificate image"
                                : "Choose certificate image"}
                        </span>

                        <span className="mt-2 text-xs text-white/30">
                          JPG, PNG or WEBP · max 5 MB
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                          onChange={(e) => {
                            const file =
                              e.target.files?.[0] ||
                              null;

                            if (
                              title ===
                              "Projects"
                            ) {
                              setProjectImageFile(
                                file
                              );
                            } else {
                              setCertificationImageFile(
                                file
                              );
                            }
                          }}
                        />
                      </label>

                      {editing &&
                        form.image && (
                          <div className="mt-4">
                            <p className="mb-2 text-xs text-white/40">
                              Current image
                            </p>

                            <img
                              src={getAssetUrl(
                                form.image
                              )}
                              alt="Current certificate"
                              className="h-32 w-auto max-w-full rounded-lg border border-white/10 object-contain"
                            />
                          </div>
                        )}
                    </div>
                  ) : field ===
                    "description" ? (
                    <>
                      <label className="mb-2 block text-xs text-white/50 capitalize">
                        {field.replace(
                          /([A-Z])/g,
                          " $1"
                        )}
                      </label>

                      <textarea
                        value={
                          form[field] || ""
                        }
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [field]:
                              e.target.value,
                          })
                        }
                        rows={5}
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                      />
                    </>
                  ) : (
                    <>
                      <label className="mb-2 block text-xs text-white/50 capitalize">
                        {field.replace(
                          /([A-Z])/g,
                          " $1"
                        )}
                      </label>

                      <input
                        value={
                          form[field] ??
                          ""
                        }
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [field]:
                              e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-white/30"
                      />
                    </>
                  )}
                </div>
              )
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50"
            >
              <Check className="h-4 w-4" />

              {saving
                ? "Saving..."
                : "Save"}
            </button>

            <button
              onClick={onCancel}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/70 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-white/40">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">
          No {title.toLowerCase()} found.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(
            (item: Item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  {item.image &&
                    (title ===
                      "Projects" ||
                      title ===
                        "Certifications") && (
                      <img
                        src={getAssetUrl(
                          item.image
                        )}
                        alt={item.title || title}
                        className="mb-4 h-24 w-36 rounded-lg border border-white/10 object-cover"
                      />
                    )}

                  <h3 className="truncate text-lg font-medium">
                    {item.title ||
                      item.name ||
                      item.year ||
                      "Untitled"}
                  </h3>

                  <p className="mt-1 text-sm text-white/40">
                    {item.description ||
                      item.subtitle ||
                      item.category ||
                      item.issuer ||
                      ""}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() =>
                      onEdit(item)
                    }
                    className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(item)
                    }
                    className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- MESSAGES ---------------- */

function MessagesSection({
  items,
  loading,
  onDelete,
  onStatus,
}: any) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold">
          Messages
        </h2>

        <p className="mt-2 text-white/50">
          Messages received through your portfolio.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-white/40">
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">
          No messages found.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(
            (message: Item) => (
              <div
                key={message._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {message.name}
                    </h3>

                    <p className="mt-1 text-sm text-white/40">
                      {message.email}
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                    {message.status ||
                      "new"}
                  </span>
                </div>

                <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-white/70">
                  {message.message}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      onStatus(
                        message._id,
                        "read"
                      )
                    }
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/10"
                  >
                    Mark Read
                  </button>

                  <button
                    onClick={() =>
                      onStatus(
                        message._id,
                        "replied"
                      )
                    }
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/10"
                  >
                    Mark Replied
                  </button>

                  <button
                    onClick={() =>
                      onDelete(message)
                    }
                    className="rounded-xl border border-red-500/20 px-4 py-2 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- RESUME ---------------- */

function ResumeSection({
  resume,
  file,
  setFile,
  saving,
  loading,
  onUpload,
}: any) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-semibold">
          Resume
        </h2>

        <p className="mt-2 text-white/50">
          Manage the resume shown on your portfolio.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-white/40">
          Loading...
        </div>
      ) : (
        <div className="max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {resume?.fileUrl && (
            <a
              href={resume.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mb-6 block rounded-xl border border-white/10 p-4 text-sm text-white/70 hover:bg-white/10"
            >
              View current resume
            </a>
          )}

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 p-8 hover:bg-white/[0.04]">
            <Upload className="mb-3 h-6 w-6 text-white/50" />

            <span className="text-sm">
              {file
                ? file.name
                : "Choose resume PDF"}
            </span>

            <span className="mt-2 text-xs text-white/30">
              PDF only
            </span>

            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] ||
                    null
                )
              }
            />
          </label>

          <button
            onClick={onUpload}
            disabled={!file || saving}
            className="mt-5 flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />

            {saving
              ? "Uploading..."
              : "Upload Resume"}
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminApp;