import { useState } from "react";

const C = {
  bg: "#f4f5f9",
  white: "#ffffff",
  border: "#e2e4ec",
  sidebar: "#2d2250",
  accent: "#3b2d7e",
  accentHover: "#4e3ea8",
  teal: "#0d9488",
  tealLight: "#ccfbf1",
  textPrimary: "#1a1a2e",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  success: "#16a34a",
  successLight: "#dcfce7",
  error: "#dc2626",
  errorLight: "#fee2e2",
  warning: "#d97706",
  warningLight: "#fef3c7",
  purpleLight: "#ede9fe",
  cardBorder: "#e2e4ec",
};

const font = "'DM Sans', sans-serif";
const display = "'Sora', sans-serif";

// ─── Primitives ─────────────────────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {label && (
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.textPrimary, marginBottom: 6, fontFamily: font }}>
          {label} {required && <span style={{ color: C.error }}>*</span>}
        </label>
      )}
      {hint && <p style={{ fontSize: 12, color: C.textMuted, margin: "-4px 0 6px", fontFamily: font }}>{hint}</p>}
      {children}
    </div>
  );
}

function useInputStyle() {
  const [focused, setFocused] = useState(false);
  const style = {
    width: "100%", padding: "10px 14px", border: `1.5px solid ${focused ? C.accent : C.border}`,
    borderRadius: 8, fontSize: 14, color: C.textPrimary, background: C.white,
    outline: "none", boxSizing: "border-box", fontFamily: font,
    boxShadow: focused ? `0 0 0 3px ${C.purpleLight}` : "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  return { style, onFocus: () => setFocused(true), onBlur: () => setFocused(false) };
}

function TextInput({ label, required, hint, ...props }) {
  const inp = useInputStyle();
  return (
    <Field label={label} required={required} hint={hint}>
      <input {...inp} {...props} style={{ ...inp.style, ...(props.style || {}) }} />
    </Field>
  );
}

function SelectInput({ label, required, hint, options, placeholder, value, onChange }) {
  const inp = useInputStyle();
  return (
    <Field label={label} required={required} hint={hint}>
      <select value={value} onChange={onChange} {...{ onFocus: inp.onFocus, onBlur: inp.onBlur }}
        style={{ ...inp.style, appearance: "none", cursor: "pointer", paddingRight: 36,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
        <option value="">{placeholder || "Select…"}</option>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </Field>
  );
}

function TextareaInput({ label, required, hint, rows = 4, ...props }) {
  const inp = useInputStyle();
  return (
    <Field label={label} required={required} hint={hint}>
      <textarea rows={rows} {...inp} {...props} style={{ ...inp.style, resize: "vertical", lineHeight: 1.6 }} />
    </Field>
  );
}

function RadioGroup({ label, required, options, value, onChange }) {
  return (
    <Field label={label} required={required}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {options.map(o => {
          const val = o.value || o; const lbl = o.label || o;
          const selected = value === val;
          return (
            <button key={val} onClick={() => onChange(val)}
              style={{ padding: "9px 18px", borderRadius: 8, border: `1.5px solid ${selected ? C.accent : C.border}`,
                background: selected ? C.purpleLight : C.white, color: selected ? C.accent : C.textSecondary,
                fontWeight: selected ? 700 : 500, fontSize: 13, cursor: "pointer", fontFamily: font,
                transition: "all 0.15s" }}>
              {selected ? "● " : "○ "}{lbl}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function Divider({ title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "24px 0 18px" }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: font, whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function UploadBox({ label, hint }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  return (
    <Field label={label} hint={hint}>
      <div onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
        onClick={() => document.getElementById("file-upload")?.click()}
        style={{ border: `2px dashed ${dragging ? C.accent : C.border}`, borderRadius: 10, padding: "20px 16px",
          textAlign: "center", cursor: "pointer", background: dragging ? C.purpleLight : "#fafbff",
          transition: "all 0.2s" }}>
        <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
        {file ? (
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.accent, fontFamily: font }}>✓ {file.name}</p>
        ) : (
          <>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.textSecondary, fontFamily: font }}>Click to upload or drag & drop</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: C.textMuted, fontFamily: font }}>PDF, DOCX, XLSX, JPG, PNG — max 10MB</p>
          </>
        )}
        <input id="file-upload" type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
      </div>
    </Field>
  );
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepBar({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "20px 28px 0", gap: 0 }}>
      {steps.map((s, i) => {
        const done = i < current; const active = i === current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? C.success : active ? C.accent : C.border,
                color: done || active ? "#fff" : C.textMuted, fontSize: done ? 14 : 13, fontWeight: 700, fontFamily: font,
                transition: "all 0.3s" }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: active ? C.accent : done ? C.success : C.textMuted,
                fontFamily: font, textAlign: "center", maxWidth: 60, lineHeight: 1.2, whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? C.success : C.border, margin: "0 6px", marginBottom: 18, transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Org Card ────────────────────────────────────────────────────────────────
function OrgCard({ icon, name, subtitle, selected, onClick }) {
  return (
    <button onClick={onClick}
      style={{ width: "100%", padding: "16px 18px", borderRadius: 12, border: `2px solid ${selected ? C.accent : C.border}`,
        background: selected ? C.purpleLight : C.white, cursor: "pointer", textAlign: "left",
        transition: "all 0.2s", marginBottom: 10,
        boxShadow: selected ? `0 0 0 3px ${C.purpleLight}` : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: selected ? C.accent : C.bg,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, transition: "all 0.2s" }}>
          {icon}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: selected ? C.accent : C.textPrimary, fontFamily: display }}>{name}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textSecondary, fontFamily: font }}>{subtitle}</p>
        </div>
        {selected && <div style={{ marginLeft: "auto", color: C.accent, fontSize: 18 }}>✓</div>}
      </div>
    </button>
  );
}

// ─── Dynamic Fields by Org ───────────────────────────────────────────────────
function AcademyFields({ form, set }) {
  return (
    <>
      <Divider title="Training Details" />
      <SelectInput label="Training Program of Interest" required value={form.trainingProgram || ""} onChange={e => set("trainingProgram", e.target.value)}
        options={["Construction Skills", "Entertainment Skills", "Digital Skills", "Technical Skills Training", "Agripreneur Skills Training", "Others"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <TextInput label="Number of Participants" required type="number" placeholder="e.g. 20" value={form.participants || ""} onChange={e => set("participants", e.target.value)} />
        <SelectInput label="Organization Industry" required value={form.industry || ""} onChange={e => set("industry", e.target.value)}
          options={["Oil & Gas", "Construction", "Finance / Banking", "Healthcare", "Government / Public Sector", "Manufacturing", "Telecoms", "Education", "Logistics", "Other"]} />
      </div>
      <RadioGroup label="Preferred Training Mode" required options={["Physical", "Virtual", "Hybrid"]} value={form.trainingMode || ""} onChange={v => set("trainingMode", v)} />
      <SelectInput label="Preferred Training Location" value={form.trainingLocation || ""} onChange={e => set("trainingLocation", e.target.value)}
        options={["HTA Akilo Center", "HTA Tijani Center", "HTA Abule Egba Center", "HTA Magodo Center", "HTA Oshogbo Center", "HTA Ibadan Center", "HTA Abuja Center", "HTA Kano Center", "Client's Premises", "Virtual / Online"]} />
      <TextInput label="Desired Training Date" type="date" value={form.trainingDate || ""} onChange={e => set("trainingDate", e.target.value)} />
      <TextareaInput label="Additional Training Needs" placeholder="Any specific topics, certifications, or requirements…" value={form.trainingNeeds || ""} onChange={e => set("trainingNeeds", e.target.value)} rows={3} />
    </>
  );
}

function ConstructionFields({ form, set }) {
  return (
    <>
      <Divider title="Construction Project Details" />
      <RadioGroup label="Type of Construction Project" required
        options={["Civil Construction", "Industrial Project", "Infrastructure", "Renovation / Upgrade", "Site Inspection"]}
        value={form.constructionType || ""} onChange={v => set("constructionType", v)} />
      <TextInput label="Project Location" required placeholder="City, State, Country" value={form.projectLocation || ""} onChange={e => set("projectLocation", e.target.value)} />
      <TextareaInput label="Estimated Project Size / Scope" required placeholder="Describe the size, area (sq meters), or scope of work…" value={form.projectScope || ""} onChange={e => set("projectScope", e.target.value)} rows={3} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
        <TextInput label="Expected Start Date" type="date" value={form.startDate || ""} onChange={e => set("startDate", e.target.value)} />
        <SelectInput label="Expected Completion Timeline" value={form.timeline || ""} onChange={e => set("timeline", e.target.value)}
          options={["Less than 3 months", "3 – 6 months", "6 – 12 months", "1 – 2 years", "Over 2 years"]} />
      </div>
      <RadioGroup label="Do you have architectural drawings?" required options={["Yes", "No"]} value={form.hasDrawings || ""} onChange={v => set("hasDrawings", v)} />
      {form.hasDrawings === "Yes" && <UploadBox label="Upload Drawings" hint="PDF, DWG, JPG accepted — max 10MB" />}
      <SelectInput label="Estimated Budget Range" value={form.budgetRange || ""} onChange={e => set("budgetRange", e.target.value)}
        options={["Below ₦10M", "₦10M – ₦50M", "₦50M – ₦200M", "₦200M – ₦1B", "Above ₦1B", "To be discussed"]} />
    </>
  );
}

function GlobalServicesFields({ form, set }) {
  return (
    <>
      <Divider title="Service Category" />
      <RadioGroup label="Select Service Category" required
        options={["Equipment Leasing", "Mining Services", "Real Estate Development", "Logistics Support"]}
        value={form.serviceCategory || ""} onChange={v => set("serviceCategory", v)} />

      {form.serviceCategory === "Equipment Leasing" && (
        <>
          <Divider title="Equipment Leasing Details" />
          <SelectInput label="Equipment Type" required value={form.equipmentType || ""} onChange={e => set("equipmentType", e.target.value)}
            options={["Excavators", "Cranes", "Bulldozers", "Generators", "Compressors", "Drilling Equipment", "Heavy Trucks", "Forklifts", "Scaffolding", "Other"]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <TextInput label="Quantity Needed" required type="number" placeholder="e.g. 3" value={form.equipmentQty || ""} onChange={e => set("equipmentQty", e.target.value)} />
            <SelectInput label="Rental Duration" required value={form.rentalDuration || ""} onChange={e => set("rentalDuration", e.target.value)}
              options={["Daily", "Weekly", "Monthly", "3 Months", "6 Months", "1 Year", "Custom"]} />
          </div>
          <TextInput label="Project Site Location" required placeholder="City, State" value={form.siteLocation || ""} onChange={e => set("siteLocation", e.target.value)} />
          <RadioGroup label="Delivery Required?" options={["Yes", "No"]} value={form.deliveryRequired || ""} onChange={v => set("deliveryRequired", v)} />
        </>
      )}

      {form.serviceCategory === "Mining Services" && (
        <>
          <Divider title="Mining Details" />
          <SelectInput label="Mineral Type" required value={form.mineralType || ""} onChange={e => set("mineralType", e.target.value)}
            options={["Coal", "Iron Ore", "Gold", "Limestone", "Granite", "Sand & Gravel", "Tin", "Lead", "Other"]} />
          <TextInput label="Mining Location" required placeholder="State / Region" value={form.miningLocation || ""} onChange={e => set("miningLocation", e.target.value)} />
          <TextareaInput label="Project Scope" required placeholder="Describe the mining scope and objectives…" value={form.miningScope || ""} onChange={e => set("miningScope", e.target.value)} rows={3} />
          <SelectInput label="Duration of Operation" value={form.miningDuration || ""} onChange={e => set("miningDuration", e.target.value)}
            options={["Short-term (< 6 months)", "Medium-term (6–12 months)", "Long-term (1–3 years)", "Ongoing"]} />
        </>
      )}

      {form.serviceCategory === "Real Estate Development" && (
        <>
          <Divider title="Real Estate Details" />
          <SelectInput label="Property Type" required value={form.propertyType || ""} onChange={e => set("propertyType", e.target.value)}
            options={["Residential (Housing Estate)", "Commercial (Office / Retail)", "Industrial (Warehouse / Factory)", "Mixed-Use Development", "Land Acquisition", "Other"]} />
          <TextInput label="Development Location" required placeholder="City, State, Country" value={form.devLocation || ""} onChange={e => set("devLocation", e.target.value)} />
          <SelectInput label="Investment Range" value={form.investmentRange || ""} onChange={e => set("investmentRange", e.target.value)}
            options={["Below ₦50M", "₦50M – ₦200M", "₦200M – ₦500M", "₦500M – ₦1B", "Above ₦1B", "To be discussed"]} />
          <RadioGroup label="Preferred Arrangement" required options={["Partnership", "Full Ownership", "Joint Venture", "Undecided"]} value={form.reArrangement || ""} onChange={v => set("reArrangement", v)} />
        </>
      )}

      {form.serviceCategory === "Logistics Support" && (
        <>
          <Divider title="Logistics Details" />
          <SelectInput label="Logistics Service" required value={form.logisticsService || ""} onChange={e => set("logisticsService", e.target.value)}
            options={["Freight & Haulage", "Warehousing", "Supply Chain Management", "Last Mile Delivery", "Port Logistics", "Other"]} />
          <TextInput label="Origin" placeholder="Pickup location" value={form.logisticsOrigin || ""} onChange={e => set("logisticsOrigin", e.target.value)} />
          <TextInput label="Destination" placeholder="Delivery location" value={form.logisticsDest || ""} onChange={e => set("logisticsDest", e.target.value)} />
          <SelectInput label="Cargo Type" value={form.cargoType || ""} onChange={e => set("cargoType", e.target.value)}
            options={["General Cargo", "Hazardous Materials", "Perishables", "Heavy Equipment", "Bulk Materials", "Other"]} />
        </>
      )}
    </>
  );
}

// ─── MAIN FORM ───────────────────────────────────────────────────────────────
const ORGS = [
  { id: "academy", icon: "🎓", name: "Honeytreat Trade Academy", subtitle: "Training & Development Programs" },
  { id: "limited", icon: "🏗️", name: "Honeytreat Limited", subtitle: "Construction & Engineering" },
  { id: "global", icon: "⚙️", name: "Honeytreat Global Services", subtitle: "Equipment Leasing, Mining & Real Estate" },
];

const STEPS = ["Organization", "Service Type", "Contact", "Service Details", "Documents", "Appointment", "Final"];

function SmartForm({ mode, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setE = k => e => set(k, e.target.value);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const submit = () => setSubmitted(true);

  const org = ORGS.find(o => o.id === form.org);

  if (submitted) {
    const ref = mode === "appointment"
      ? `SCH-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`
      : `REQ-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
    return (
      <div style={{ padding: "52px 28px", textAlign: "center", fontFamily: font }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{mode === "appointment" ? "📅" : "✅"}</div>
        <h3 style={{ fontFamily: display, fontSize: 22, color: C.textPrimary, margin: "0 0 10px" }}>
          {mode === "appointment" ? "Appointment Requested!" : "Request Submitted!"}
        </h3>
        <p style={{ color: C.textSecondary, fontSize: 14, margin: "0 0 8px" }}>
          Routed to <strong>{org?.name}</strong>
        </p>
        <p style={{ color: C.textSecondary, fontSize: 14, margin: "0 0 24px" }}>
          Our team will be in touch shortly via your preferred contact method.
        </p>
        <div style={{ display: "inline-block", padding: "6px 20px", borderRadius: 20, background: C.successLight, color: C.success, fontWeight: 700, fontSize: 13 }}>
          ✓ Reference: {ref}
        </div>
        <button onClick={onClose} style={{ display: "block", margin: "24px auto 0", padding: "11px 32px", background: C.accent, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: font }}>
          Done
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: font }}>
      {/* Header */}
      <div style={{ padding: "22px 28px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: mode === "appointment" ? C.tealLight : C.purpleLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            {mode === "appointment" ? "📅" : "📋"}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.textPrimary, fontFamily: display }}>
              {mode === "appointment" ? "Book an Appointment" : "New Service Request"}
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textSecondary }}>
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, fontSize: 20, padding: 4, borderRadius: 6 }}
          onMouseEnter={e => { e.target.style.background = C.bg; e.target.style.color = C.textPrimary; }}
          onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = C.textMuted; }}>✕</button>
      </div>

      {/* Step bar */}
      <StepBar steps={STEPS} current={step} />

      {/* Body */}
      <div style={{ padding: "24px 28px 8px", maxHeight: "55vh", overflowY: "auto" }}>

        {/* STEP 0 — Organization */}
        {step === 0 && (
          <>
            <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 18px" }}>Which Honeytreat subsidiary are you reaching out to?</p>
            {ORGS.map(o => (
              <OrgCard key={o.id} {...o} selected={form.org === o.id} onClick={() => set("org", o.id)} />
            ))}
          </>
        )}

        {/* STEP 1 — Service Type */}
        {step === 1 && (
          <>
            <RadioGroup label="Are you a new or existing client?" required
              options={[{ value: "new", label: "New Service Request" }, { value: "existing", label: "Existing Client Request" }]}
              value={form.clientType || ""} onChange={v => set("clientType", v)} />
            {form.clientType === "existing" && (
              <>
                <Divider title="Existing Client Details" />
                <TextInput label="Client ID" hint="Optional — found on your previous invoice or contract" placeholder="e.g. HT-2024-001" value={form.clientId || ""} onChange={setE("clientId")} />
                <TextInput label="Previous Project / Service Reference" placeholder="e.g. Office Cleaning Contract Q1 2024" value={form.prevRef || ""} onChange={setE("prevRef")} />
                <TextInput label="Account Manager (if known)" placeholder="Name of your account manager" value={form.accountManager || ""} onChange={setE("accountManager")} />
              </>
            )}
          </>
        )}

        {/* STEP 2 — Contact */}
        {step === 2 && (
          <>
            <Divider title="Your Information" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <TextInput label="Full Name" required placeholder="Your full name" value={form.fullName || ""} onChange={setE("fullName")} />
              <TextInput label="Company / Organization" placeholder="Your company name" value={form.company || ""} onChange={setE("company")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <TextInput label="Email Address" required type="email" placeholder="you@company.com" value={form.email || ""} onChange={setE("email")} />
              <TextInput label="Phone Number" required type="tel" placeholder="+234 000 000 0000" value={form.phone || ""} onChange={setE("phone")} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <SelectInput label="Country / Location" required value={form.country || ""} onChange={e => set("country", e.target.value)}
                options={["Nigeria", "Ghana", "South Africa", "Kenya", "United Kingdom", "United States", "United Arab Emirates", "Other"]} />
              <RadioGroup label="Preferred Contact Method" required
                options={["Email", "Phone", "Virtual Meeting"]}
                value={form.contactMethod || ""} onChange={v => set("contactMethod", v)} />
            </div>
          </>
        )}

        {/* STEP 3 — Dynamic Service Fields */}
        {step === 3 && (
          <>
            {form.org === "academy" && <AcademyFields form={form} set={set} />}
            {form.org === "limited" && <ConstructionFields form={form} set={set} />}
            {form.org === "global" && <GlobalServicesFields form={form} set={set} />}
          </>
        )}

        {/* STEP 4 — Documents */}
        {step === 4 && (
          <>
            <Divider title="Request Details" />
            <TextareaInput label="Detailed Description of Request" required rows={5}
              placeholder="Provide as much detail as possible about your needs, timelines, and expectations…"
              value={form.description || ""} onChange={setE("description")} />
          </>
        )}

        {/* STEP 5 — Appointment */}
        {step === 5 && (
          <>
            <Divider title="Appointment Preferences" />
            <RadioGroup label="Preferred Meeting Type" required options={["Virtual", "Physical", "Phone Call"]} value={form.meetingType || ""} onChange={v => set("meetingType", v)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <TextInput label="Preferred Date" required type="date" value={form.apptDate || ""} onChange={setE("apptDate")} />
              <SelectInput label="Preferred Time" required value={form.apptTime || ""} onChange={e => set("apptTime", e.target.value)}
                options={["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"]} />
            </div>
            {form.meetingType === "Physical" && (
              <SelectInput label="Meeting Location" value={form.meetingLocation || ""} onChange={e => set("meetingLocation", e.target.value)}
                options={["HTG Office — Lagos", "HTA Akilo Center", "HTA Tijani Center", "HTA Abule Egba Center", "HTA Magodo Center", "HTA Oshogbo Center", "HTA Ibadan Center", "HTA Abuja Center", "HTA Kano Center", "Client's Premises"]} />
            )}
            <TextareaInput label="Purpose of Meeting" required rows={3}
              placeholder="Briefly describe what you'd like to discuss or achieve in this meeting…"
              value={form.meetingPurpose || ""} onChange={setE("meetingPurpose")} />
          </>
        )}

        {/* STEP 6 — Final */}
        {step === 6 && (
          <>
            <Divider title="Final Details" />
            <SelectInput label="How did you hear about us?" value={form.hearAboutUs || ""} onChange={e => set("hearAboutUs", e.target.value)}
              options={["Google / Search Engine", "Social Media (LinkedIn)", "Social Media (Instagram)", "Social Media (Facebook)", "Referral from a colleague", "Industry Event / Conference", "Email / Newsletter", "Our Website", "Other"]} />
            <TextareaInput label="Additional Comments" rows={3} placeholder="Any other information you'd like us to know…" value={form.comments || ""} onChange={setE("comments")} />
            <div style={{ padding: "14px 16px", background: C.purpleLight, borderRadius: 10, marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <input type="checkbox" id="consent" checked={form.consent || false} onChange={e => set("consent", e.target.checked)}
                style={{ marginTop: 2, accentColor: C.accent, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }} />
              <label htmlFor="consent" style={{ fontSize: 13, color: C.textPrimary, fontFamily: font, cursor: "pointer", lineHeight: 1.5 }}>
                I agree to be contacted by Honeytreat Group regarding this request. My information will be handled in accordance with applicable data protection policies.
              </label>
            </div>
            {/* Summary */}
            <div style={{ background: C.bg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: font }}>Summary</p>
              {[
                ["Organization", org?.name],
                ["Client Type", form.clientType === "new" ? "New Service Request" : "Existing Client"],
                ["Name", form.fullName],
                ["Email", form.email],
                ["Phone", form.phone],
              ].map(([k, v]) => v && (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: C.textSecondary, fontFamily: font }}>{k}</span>
                  <span style={{ color: C.textPrimary, fontWeight: 600, fontFamily: font }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa", borderRadius: "0 0 16px 16px" }}>
        <button onClick={back} disabled={step === 0}
          style={{ padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${C.border}`, background: C.white, color: step === 0 ? C.textMuted : C.textSecondary,
            fontWeight: 600, fontSize: 14, cursor: step === 0 ? "not-allowed" : "pointer", fontFamily: font, opacity: step === 0 ? 0.5 : 1 }}>
          ← Back
        </button>
        <span style={{ fontSize: 12, color: C.textMuted, fontFamily: font }}>{step + 1} / {STEPS.length}</span>
        {step < STEPS.length - 1 ? (
          <button onClick={next} disabled={step === 0 && !form.org}
            style={{ padding: "10px 24px", borderRadius: 8, border: "none",
              background: (step === 0 && !form.org) ? C.border : (mode === "appointment" ? C.teal : C.accent),
              color: (step === 0 && !form.org) ? C.textMuted : "#fff",
              fontWeight: 700, fontSize: 14, cursor: (step === 0 && !form.org) ? "not-allowed" : "pointer", fontFamily: font }}>
            Next →
          </button>
        ) : (
          <button onClick={submit} disabled={!form.consent}
            style={{ padding: "10px 24px", borderRadius: 8, border: "none",
              background: form.consent ? (mode === "appointment" ? C.teal : C.accent) : C.border,
              color: form.consent ? "#fff" : C.textMuted,
              fontWeight: 700, fontSize: 14, cursor: form.consent ? "pointer" : "not-allowed", fontFamily: font }}>
            {mode === "appointment" ? "Book Appointment ✓" : "Submit Request ✓"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Modal Shell ─────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,10,35,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: C.white, borderRadius: 16, width: "100%", maxWidth: 620, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.25)", animation: "slideUp 0.22s ease" }}>
        {children}
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [modal, setModal] = useState(null);

  return (
    <div style={{ fontFamily: font, background: C.bg, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Top bar */}
      <div style={{ background: C.sidebar, padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 12, fontFamily: display }}>HG</div>
          <span style={{ fontWeight: 700, color: "#fff", fontFamily: display, fontSize: 15 }}>Honey Treat Group</span>
          <span style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(22,163,74,0.2)", color: "#4ade80", fontSize: 11, fontWeight: 600, fontFamily: font }}>● Approved · Corporate</span>
        </div>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: font }}>Mitchell & Co. Holdings — Lara Mitchell</span>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 760, margin: "70px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 26 }}>🏢</div>
        <h1 style={{ fontFamily: display, fontSize: 30, color: C.textPrimary, margin: "0 0 12px" }}>HTG Client Portal</h1>
        <p style={{ color: C.textSecondary, fontSize: 15, margin: "0 0 48px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Our intelligent form will guide you through the right questions based on your selected subsidiary and service.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
          <button onClick={() => setModal("appointment")}
            style={{ padding: "14px 32px", borderRadius: 10, background: C.teal, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(13,148,136,0.35)", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(13,148,136,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(13,148,136,0.35)"; }}>
            📅 Book Appointment
          </button>
          <button onClick={() => setModal("request")}
            style={{ padding: "14px 32px", borderRadius: 10, background: C.accent, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(59,45,126,0.35)", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(59,45,126,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,45,126,0.35)"; }}>
            📋 New Service Request
          </button>
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, textAlign: "left" }}>
          {ORGS.map(o => (
            <div key={o.id} style={{ background: C.white, borderRadius: 12, padding: "18px 16px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{o.icon}</div>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: C.textPrimary, fontFamily: display }}>{o.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: C.textSecondary, fontFamily: font }}>{o.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={modal === "appointment"} onClose={() => setModal(null)}>
        <SmartForm mode="appointment" onClose={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === "request"} onClose={() => setModal(null)}>
        <SmartForm mode="request" onClose={() => setModal(null)} />
      </Modal>
    </div>
  );
}