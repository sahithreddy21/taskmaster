import { useState } from "react";

// ═══════════════════════════════════════════════
// THEME — Deep dark purple-black palette
// ═══════════════════════════════════════════════
const T = {
  bg:   "#07071a", s1:"#0d0d22", s2:"#13132e", s3:"#1a1a3a", s4:"#222248",
  b0:   "#2a2a50", b1:"#3c3c68",
  acc:  "#7c6fff", accH:"#9480ff", accD:"#28205a", accL:"#b0a4ff",
  t1:   "#e8e8f6", t2:"#8888aa", t3:"#48486a",
  ok:   "#22d374", okD:"#061a10",
  war:  "#f59e0b", warD:"#1c1500",
  err:  "#ef4444", errD:"#1e0808",
  hot:  "#ff3870", hotD:"#1e0610",
};

const PRI = {
  low:    { label:"Low",    bg:"#091509", tc:"#4ade80", dot:"#22c55e" },
  medium: { label:"Medium", bg:"#191400", tc:"#fbbf24", dot:"#f59e0b" },
  high:   { label:"High",   bg:"#190909", tc:"#f87171", dot:"#ef4444" },
  urgent: { label:"Urgent", bg:"#1f0610", tc:"#ff6b9d", dot:"#ff3870" },
};

const COLS = [
  { id:"todo",       label:"To Do",       accent:T.t2,  icon:"○" },
  { id:"inprogress", label:"In Progress", accent:T.war, icon:"◑" },
  { id:"done",       label:"Done",        accent:T.ok,  icon:"●" },
];

const USERS = [
  { id:1, name:"Sahith Reddy", short:"Sahith", ini:"SR", clr:"#7c6fff", role:"Admin" },
  { id:2, name:"Priya S",      short:"Priya",  ini:"PS", clr:"#22d374", role:"Member" },
  { id:3, name:"Arjun N",      short:"Arjun",  ini:"AN", clr:"#f59e0b", role:"Member" },
  { id:4, name:"Kavya R",      short:"Kavya",  ini:"KR", clr:"#ff6b9d", role:"Member" },
];

const CATS = ["Work","Design","Backend","Testing","DevOps","Personal"];

let _nid = 8;
const SEED = [
  { id:1, title:"Design landing page",   desc:"Wireframes and mockups for the new homepage redesign",         pri:"high",   st:"todo",       uid:2, cat:"Design",  due:"2026-06-20", ts:Date.now()-86400e3 },
  { id:2, title:"Fix OAuth login bug",   desc:"Google sign-in broken — blocking all new user onboarding",     pri:"urgent", st:"todo",       uid:3, cat:"Backend", due:"2026-06-16", ts:Date.now()-43200e3 },
  { id:3, title:"Build REST API",        desc:"CRUD endpoints for the task management service",                pri:"high",   st:"inprogress", uid:1, cat:"Backend", due:"2026-06-18", ts:Date.now()-172800e3 },
  { id:4, title:"Write unit tests",      desc:"Jest + Supertest coverage across all controllers",              pri:"medium", st:"inprogress", uid:2, cat:"Testing", due:"2026-06-22", ts:Date.now()-259200e3 },
  { id:5, title:"Mobile responsive UI",  desc:"Make the app work cleanly from 320px up",                      pri:"medium", st:"todo",       uid:4, cat:"Design",  due:"2026-06-25", ts:Date.now()-3600e3  },
  { id:6, title:"Setup CI/CD pipeline",  desc:"GitHub Actions with Docker and auto tests on every PR",        pri:"medium", st:"done",       uid:4, cat:"DevOps",  due:"2026-06-10", ts:Date.now()-432000e3 },
  { id:7, title:"Database schema",       desc:"PostgreSQL tables, indexes, and foreign key constraints",       pri:"high",   st:"done",       uid:1, cat:"Backend", due:"2026-06-12", ts:Date.now()-518400e3 },
];

// ═══════════════════════════════════════════════
// SMALL ATOMS
// ═══════════════════════════════════════════════
function Avatar({ uid, size = 28 }) {
  const u = USERS.find(x => x.id === uid);
  if (!u) return null;
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%",
      background:u.clr+"1c", border:`1.5px solid ${u.clr}50`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:size*0.36, fontWeight:800, color:u.clr, flexShrink:0, letterSpacing:0,
    }}>{u.ini}</div>
  );
}

function PriBadge({ pri }) {
  const p = PRI[pri] || PRI.medium;
  return (
    <span style={{
      background:p.bg, color:p.tc, fontSize:10, fontWeight:800,
      padding:"3px 8px", borderRadius:6, letterSpacing:"0.06em", textTransform:"uppercase",
      display:"inline-flex", alignItems:"center", gap:4,
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:p.dot, flexShrink:0 }}/>
      {p.label}
    </span>
  );
}

function CatTag({ cat }) {
  return (
    <span style={{ background:T.s4, color:T.t2, fontSize:10, fontWeight:600,
      padding:"3px 8px", borderRadius:6, border:`1px solid ${T.b0}` }}>{cat}</span>
  );
}

function Fld({ label, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:"block", fontSize:11, color:T.t2, fontWeight:700,
        textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}

function SideLabel({ children }) {
  return <p style={{ fontSize:9, color:T.t3, fontWeight:800, letterSpacing:"0.12em",
    textTransform:"uppercase", padding:"0 6px", marginBottom:7 }}>{children}</p>;
}

// ═══════════════════════════════════════════════
// TASK CARD
// ═══════════════════════════════════════════════
function TaskCard({ task, onEdit, onDelete, onMove }) {
  const [hov, setHov] = useState(false);
  const user = USERS.find(u => u.id === task.uid);
  const isOverdue = task.due && task.st !== "done" && new Date(task.due) < new Date();
  const dueStr = task.due ? new Date(task.due).toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : null;
  const isDone = task.st === "done";

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => onEdit(task)}
      style={{
        background:hov ? T.s3 : T.s2, border:`1px solid ${hov ? T.b1 : T.b0}`,
        borderRadius:12, padding:"14px 15px", marginBottom:9,
        cursor:"pointer", transition:"all 0.15s", position:"relative",
      }}
    >
      {/* Urgent accent strip */}
      {task.pri === "urgent" && !isDone && (
        <div style={{ position:"absolute", left:0, top:12, bottom:12, width:3, background:T.hot, borderRadius:"0 3px 3px 0" }}/>
      )}

      {/* Hover actions */}
      {hov && (
        <div style={{ position:"absolute", top:10, right:10, display:"flex", gap:5 }} onClick={e => e.stopPropagation()}>
          <button onClick={() => onEdit(task)} style={iconBtn(T.s4, T.b0, T.t2)}>✎</button>
          <button onClick={() => onDelete(task.id)} style={iconBtn(T.errD, T.err+"30", T.err)}>✕</button>
        </div>
      )}

      {/* Title */}
      <div style={{ fontSize:14, fontWeight:600, color:isDone ? T.t3 : T.t1,
        textDecoration:isDone ? "line-through" : "none", lineHeight:1.4,
        marginBottom:6, paddingRight:hov ? 64 : 0 }}>
        {task.title}
      </div>

      {/* Desc */}
      {task.desc && (
        <div style={{ fontSize:12, color:T.t3, lineHeight:1.55, marginBottom:10,
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {task.desc}
        </div>
      )}

      {/* Badges */}
      <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
        <PriBadge pri={task.pri}/><CatTag cat={task.cat}/>
      </div>

      {/* Footer */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <Avatar uid={task.uid} size={22}/>
          <span style={{ fontSize:11, color:T.t3 }}>{user?.short}</span>
        </div>
        {dueStr && (
          <span style={{ fontSize:11, fontWeight:isOverdue ? 700 : 400,
            color:isOverdue ? T.err : T.t3, background:isOverdue ? T.errD : "transparent",
            padding:isOverdue ? "2px 6px" : "0", borderRadius:4 }}>
            {isOverdue ? "⚠ " : "🗓 "}{dueStr}
          </span>
        )}
      </div>

      {/* Move controls */}
      {hov && !isDone && (
        <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${T.b0}`,
          display:"flex", gap:6 }} onClick={e => e.stopPropagation()}>
          {task.st === "todo" && (
            <button onClick={() => onMove(task.id,"inprogress")} style={moveBtn(T.warD, T.war)}>▶ Start</button>
          )}
          {task.st === "inprogress" && (<>
            <button onClick={() => onMove(task.id,"todo")}       style={moveBtn(T.s4, T.b1)}>◀ Back</button>
            <button onClick={() => onMove(task.id,"done")}       style={moveBtn(T.okD, T.ok)}>✓ Done</button>
          </>)}
        </div>
      )}
    </div>
  );
}

const iconBtn = (bg, border, color) => ({
  width:26, height:26, background:bg, border:`1px solid ${border}`,
  borderRadius:6, cursor:"pointer", color, fontSize:12,
  display:"flex", alignItems:"center", justifyContent:"center",
});
const moveBtn = (bg, c) => ({
  flex:1, background:bg, border:`1px solid ${c}30`,
  borderRadius:7, padding:"5px 0", cursor:"pointer",
  color:c, fontSize:11, fontWeight:800,
});

// ═══════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [sel, setSel] = useState(null);
  return (
    <div style={{ height:"100vh", background:T.bg, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}`}</style>

      {/* Brand */}
      <div style={{ textAlign:"center", marginBottom:38 }}>
        <div style={{ width:62, height:62, borderRadius:18, background:T.accD,
          border:`2px solid ${T.acc}`, display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 16px", fontSize:28 }}>⚡</div>
        <h1 style={{ fontSize:30, fontWeight:900, color:T.t1, letterSpacing:"-0.5px" }}>
          Task<span style={{ color:T.acc }}>Master</span>
        </h1>
        <p style={{ color:T.t2, fontSize:14, marginTop:6 }}>Select your profile to continue</p>
      </div>

      {/* User cards */}
      <div style={{ display:"flex", gap:13, flexWrap:"wrap", justifyContent:"center", padding:"0 20px", maxWidth:560 }}>
        {USERS.map(u => (
          <div key={u.id} onClick={() => setSel(u.id)} style={{
            background:sel===u.id ? T.s3 : T.s1,
            border:`2px solid ${sel===u.id ? T.acc : T.b0}`,
            borderRadius:16, padding:"22px 26px", cursor:"pointer",
            textAlign:"center", minWidth:118, transition:"all 0.18s",
            transform:sel===u.id ? "scale(1.05)" : "scale(1)",
          }}>
            <div style={{ width:50, height:50, borderRadius:"50%", background:u.clr+"20",
              border:`2px solid ${u.clr}`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:14, fontWeight:900, color:u.clr,
              margin:"0 auto 10px" }}>{u.ini}</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.t1 }}>{u.name}</div>
            <div style={{ fontSize:11, color:T.t3, marginTop:3 }}>{u.role}</div>
          </div>
        ))}
      </div>

      <button onClick={() => sel && onLogin(USERS.find(u => u.id === sel))} disabled={!sel}
        style={{ marginTop:28, background:sel ? T.acc : T.b0, color:sel ? "#fff" : T.t3,
          border:"none", borderRadius:12, padding:"12px 44px", fontSize:15, fontWeight:800,
          cursor:sel ? "pointer" : "not-allowed", transition:"all 0.18s" }}>
        {sel ? "Continue →" : "Select a profile"}
      </button>
      <p style={{ color:T.t3, fontSize:11, marginTop:12 }}>Demo app — no password required</p>
    </div>
  );
}

// ═══════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════
function Sidebar({ user, stats, view, setView, onLogout, open, onToggle }) {
  if (!open) return (
    <div style={{ width:46, background:T.s1, borderRight:`1px solid ${T.b0}`,
      display:"flex", flexDirection:"column", alignItems:"center", padding:"14px 0", gap:14, flexShrink:0 }}>
      <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", color:T.t3, fontSize:16 }}>▶</button>
      <div style={{ width:30, height:30, borderRadius:8, background:T.accD, display:"flex",
        alignItems:"center", justifyContent:"center", fontSize:14 }}>⚡</div>
    </div>
  );

  return (
    <div style={{ width:218, flexShrink:0, background:T.s1, borderRight:`1px solid ${T.b0}`,
      display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* Logo */}
      <div style={{ padding:"16px 16px 13px", borderBottom:`1px solid ${T.b0}`,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:T.accD,
            border:`1px solid ${T.acc}40`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:14 }}>⚡</div>
          <span style={{ fontSize:14, fontWeight:900, color:T.t1 }}>
            Task<span style={{ color:T.acc }}>Master</span>
          </span>
        </div>
        <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", color:T.t3, fontSize:15 }}>◀</button>
      </div>

      {/* Nav */}
      <div style={{ flex:1, overflow:"auto", padding:"13px 11px" }}>
        <SideLabel>Views</SideLabel>
        {[{ id:"board", label:"Kanban Board", icon:"▦" }, { id:"list", label:"List View", icon:"≡" }].map(n => (
          <button key={n.id} onClick={() => setView(n.id)} style={{
            display:"flex", alignItems:"center", gap:8, width:"100%",
            background:view===n.id ? T.s4 : "transparent",
            border:`1px solid ${view===n.id ? T.b1 : "transparent"}`,
            borderRadius:8, padding:"8px 10px", cursor:"pointer",
            color:view===n.id ? T.t1 : T.t2, fontSize:13,
            fontWeight:view===n.id ? 700 : 400, marginBottom:3, transition:"all 0.12s", textAlign:"left",
          }}>
            <span style={{ fontSize:14 }}>{n.icon}</span>{n.label}
          </button>
        ))}

        {/* Stats */}
        <SideLabel style={{ marginTop:20 }}>Overview</SideLabel>
        <div style={{ background:T.s2, borderRadius:10, padding:"10px 12px", border:`1px solid ${T.b0}` }}>
          {[
            ["Total tasks", stats.total, T.t1],
            ["To do", stats.todo, T.t2],
            ["In progress", stats.inprogress, T.war],
            ["Completed", stats.done, T.ok],
            ...(stats.urgent ? [["Urgent", stats.urgent, T.hot]] : []),
          ].map(([l, v, c]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <span style={{ fontSize:11, color:T.t3 }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:800, color:c }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Team */}
        <SideLabel style={{ marginTop:20 }}>Team</SideLabel>
        {USERS.map(u => (
          <div key={u.id} style={{ display:"flex", alignItems:"center", gap:8,
            padding:"6px 6px", borderRadius:7, marginBottom:2 }}>
            <div style={{ width:26, height:26, borderRadius:"50%", background:u.clr+"1c",
              border:`1.5px solid ${u.clr}50`, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:9, fontWeight:900, color:u.clr, flexShrink:0 }}>{u.ini}</div>
            <span style={{ fontSize:12, color:T.t2, flex:1 }}>{u.name}</span>
            {u.id === 1 && <span style={{ fontSize:9, background:T.accD, color:T.accL,
              padding:"1px 5px", borderRadius:4, fontWeight:700 }}>Admin</span>}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div style={{ padding:"13px 13px", borderTop:`1px solid ${T.b0}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:11 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:user.clr+"20",
            border:`2px solid ${user.clr}`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:11, fontWeight:900, color:user.clr, flexShrink:0 }}>{user.ini}</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.t1 }}>{user.name}</div>
            <div style={{ fontSize:10, color:T.t3 }}>{user.role} · Active</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ width:"100%", background:"transparent",
          border:`1px solid ${T.b0}`, borderRadius:8, padding:"7px", cursor:"pointer",
          color:T.t3, fontSize:12, transition:"all 0.12s" }}>Sign out</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════
function Header({ search, setSearch, filter, setFilter, priF, setPriF, onAdd, sideOpen, onToggleSide }) {
  const inp = { background:T.s2, border:`1px solid ${T.b0}`, borderRadius:9,
    color:T.t1, fontSize:13, fontFamily:"inherit", outline:"none" };
  return (
    <div style={{ padding:"13px 18px", borderBottom:`1px solid ${T.b0}`,
      display:"flex", alignItems:"center", gap:9, flexWrap:"wrap" }}>
      {!sideOpen && (
        <button onClick={onToggleSide} style={{ background:"none", border:"none",
          cursor:"pointer", color:T.t3, fontSize:17, flexShrink:0 }}>▶</button>
      )}
      <div style={{ position:"relative", flex:"1 1 150px", minWidth:150 }}>
        <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.t3, fontSize:12 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search tasks…" style={{ ...inp, width:"100%", padding:"8px 12px 8px 30px" }}/>
      </div>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
        {[["all","All"],["mine","Mine"],["urgent","🔥 Urgent"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            background:filter===v ? T.s4 : "transparent",
            border:`1px solid ${filter===v ? T.b1 : T.b0}`,
            borderRadius:8, padding:"7px 13px", cursor:"pointer",
            color:filter===v ? T.t1 : T.t2, fontSize:12,
            fontWeight:filter===v ? 700 : 400, transition:"all 0.12s",
          }}>{l}</button>
        ))}
      </div>
      <select value={priF} onChange={e => setPriF(e.target.value)}
        style={{ ...inp, padding:"7px 10px", cursor:"pointer" }}>
        <option value="all">All priority</option>
        {Object.entries(PRI).map(([k,p]) => <option key={k} value={k}>{p.label}</option>)}
      </select>
      <button onClick={onAdd} style={{ background:T.acc, color:"#fff", border:"none",
        borderRadius:9, padding:"8px 18px", fontSize:13, fontWeight:800,
        cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>+ New Task</button>
    </div>
  );
}

// ═══════════════════════════════════════════════
// STATS BAR
// ═══════════════════════════════════════════════
function StatsBar({ stats }) {
  return (
    <div style={{ display:"flex", gap:10, padding:"13px 18px 6px", flexWrap:"wrap" }}>
      {[
        { label:"Total Tasks",  val:stats.total,      c:T.acc },
        { label:"In Progress",  val:stats.inprogress, c:T.war },
        { label:"Completed",    val:stats.done,       c:T.ok  },
        { label:"Urgent",       val:stats.urgent,     c:T.hot },
      ].map(c => (
        <div key={c.label} style={{ flex:"1 1 90px", background:T.s1,
          border:`1px solid ${T.b0}`, borderRadius:11, padding:"12px 15px" }}>
          <div style={{ fontSize:22, fontWeight:900, color:c.c, letterSpacing:"-0.5px" }}>{c.val}</div>
          <div style={{ fontSize:10, color:T.t3, marginTop:2, fontWeight:700,
            textTransform:"uppercase", letterSpacing:"0.06em" }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// BOARD VIEW
// ═══════════════════════════════════════════════
function Board({ tasks, onEdit, onDelete, onMove }) {
  return (
    <div style={{ display:"flex", gap:13, paddingTop:14, alignItems:"flex-start", minHeight:300 }}>
      {COLS.map(col => {
        const colTasks = tasks.filter(t => t.st === col.id);
        return (
          <div key={col.id} style={{ flex:"1 1 0", minWidth:230 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:11, padding:"0 2px" }}>
              <span style={{ color:col.accent, fontSize:13 }}>{col.icon}</span>
              <span style={{ fontSize:12, fontWeight:800, color:T.t1, textTransform:"uppercase", letterSpacing:"0.06em" }}>{col.label}</span>
              <span style={{ background:T.s4, color:T.t2, fontSize:11, padding:"2px 8px",
                borderRadius:20, border:`1px solid ${T.b0}`, marginLeft:"auto", fontWeight:700 }}>{colTasks.length}</span>
            </div>
            {colTasks.length === 0
              ? <div style={{ background:T.s1, border:`1px dashed ${T.b0}`, borderRadius:11,
                  padding:20, textAlign:"center", color:T.t3, fontSize:12 }}>No tasks here</div>
              : colTasks.map(t => (
                <TaskCard key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onMove={onMove}/>
              ))
            }
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// LIST VIEW
// ═══════════════════════════════════════════════
function ListView({ tasks, onEdit, onDelete, onMove }) {
  const th = { fontSize:10, color:T.t3, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", padding:"9px 12px" };
  return (
    <div style={{ paddingTop:14 }}>
      <div style={{ background:T.s1, border:`1px solid ${T.b0}`, borderRadius:14, overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.b0}` }}>
              {["Task","Priority","Category","Assignee","Due Date","Status",""].map(h => (
                <th key={h} style={{ ...th, textAlign:"left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0
              ? <tr><td colSpan={7} style={{ textAlign:"center", padding:"44px 0", color:T.t3 }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>📋</div>
                  <p style={{ fontSize:13 }}>No tasks found</p>
                </td></tr>
              : tasks.map((t, i) => {
                const u = USERS.find(x => x.id === t.uid);
                const col = COLS.find(c => c.id === t.st);
                const isOverdue = t.due && t.st !== "done" && new Date(t.due) < new Date();
                const isDone = t.st === "done";
                return (
                  <tr key={t.id} onClick={() => onEdit(t)}
                    style={{ borderBottom:i<tasks.length-1 ? `1px solid ${T.b0}` : "none", cursor:"pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = T.s2}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding:"11px 12px", fontSize:13, fontWeight:600,
                      color:isDone ? T.t3 : T.t1, textDecoration:isDone ? "line-through" : "none" }}>{t.title}</td>
                    <td style={{ padding:"11px 12px" }}><PriBadge pri={t.pri}/></td>
                    <td style={{ padding:"11px 12px" }}><CatTag cat={t.cat}/></td>
                    <td style={{ padding:"11px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <Avatar uid={t.uid} size={20}/>
                        <span style={{ fontSize:11, color:T.t3 }}>{u?.short}</span>
                      </div>
                    </td>
                    <td style={{ padding:"11px 12px", fontSize:11, fontWeight:isOverdue?700:400, color:isOverdue ? T.err : T.t3 }}>
                      {t.due ? new Date(t.due).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "—"}
                    </td>
                    <td style={{ padding:"11px 12px" }}>
                      <span style={{ fontSize:11, color:col?.accent, background:T.s3,
                        padding:"3px 9px", borderRadius:20, border:`1px solid ${T.b0}`, fontWeight:600 }}>{col?.label}</span>
                    </td>
                    <td style={{ padding:"11px 12px" }}>
                      <div style={{ display:"flex", gap:4 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => onEdit(t)} style={{ background:T.s3, border:`1px solid ${T.b0}`,
                          borderRadius:5, padding:"3px 8px", cursor:"pointer", color:T.t2, fontSize:11 }}>Edit</button>
                        <button onClick={() => onDelete(t.id)} style={{ background:T.errD, border:`1px solid ${T.err}25`,
                          borderRadius:5, padding:"3px 8px", cursor:"pointer", color:T.err, fontSize:11 }}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TASK MODAL (with Claude AI Assist)
// ═══════════════════════════════════════════════
function TaskModal({ mode, task, currentUser, onSave, onClose }) {
  const blank = { title:"", desc:"", pri:"medium", st:"todo", uid:currentUser.id, cat:"Work", due:"" };
  const [form, setForm] = useState(mode === "edit" ? { ...task } : blank);
  const [err, setErr]   = useState("");
  const [ai, setAi]     = useState("idle"); // idle | loading | done | error
  const [aiData, setAiData] = useState(null);
  const fld = (k, v) => setForm(f => ({ ...f, [k]:v }));

  const inp = (extra={}) => ({
    background:T.s2, border:`1px solid ${T.b0}`, borderRadius:9,
    padding:"9px 12px", color:T.t1, fontSize:13, width:"100%",
    fontFamily:"inherit", outline:"none", ...extra,
  });

  const handleSave = () => {
    if (!form.title.trim()) { setErr("Task title is required"); return; }
    onSave(form);
  };

  const runAI = async () => {
    if (!form.title.trim()) { setErr("Add a title first for AI suggestions"); return; }
    setErr(""); setAi("loading"); setAiData(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{ role:"user", content:
            `You are a project management AI assistant. For the software task titled: "${form.title}", generate structured suggestions.
Respond ONLY with valid JSON, no markdown or code fences, like this:
{"description":"A concise 1-2 sentence task description","priority":"medium","category":"Backend","acceptance_criteria":["Criterion 1","Criterion 2","Criterion 3"]}
Available categories: ${CATS.join(", ")}. Valid priorities: low, medium, high, urgent.` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "{}";
      const json = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setAiData(json); setAi("done");
    } catch (e) {
      setAi("error");
    }
  };

  const applyAI = () => {
    if (!aiData) return;
    if (aiData.description) fld("desc", aiData.description);
    if (aiData.priority && PRI[aiData.priority]) fld("pri", aiData.priority);
    if (aiData.category && CATS.includes(aiData.category)) fld("cat", aiData.category);
    setAi("idle"); setAiData(null);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,12,0.82)",
      backdropFilter:"blur(8px)", display:"flex", alignItems:"center",
      justifyContent:"center", zIndex:200, padding:16 }}>
      <div style={{ background:T.s1, border:`1px solid ${T.b1}`, borderRadius:20,
        padding:26, width:"100%", maxWidth:500, maxHeight:"92vh", overflow:"auto" }}>

        {/* Modal header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <h2 style={{ fontSize:17, fontWeight:900, color:T.t1 }}>
            {mode === "edit" ? "✎ Edit Task" : "✦ New Task"}
          </h2>
          <button onClick={onClose} style={{ width:30, height:30, background:T.s3,
            border:`1px solid ${T.b0}`, borderRadius:8, cursor:"pointer", color:T.t2,
            fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* AI Assist Panel */}
        <div style={{ background:T.s2, border:`1px solid ${T.accD}`,
          borderRadius:13, padding:"13px 15px", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:T.accL }}>✨ AI Assist</div>
              <div style={{ fontSize:11, color:T.t3, marginTop:1 }}>Claude writes your task details</div>
            </div>
            <button onClick={runAI} disabled={ai==="loading"} style={{
              background:ai==="loading" ? T.b0 : T.acc, color:ai==="loading" ? T.t3 : "#fff",
              border:"none", borderRadius:9, padding:"7px 14px", cursor:ai==="loading" ? "not-allowed" : "pointer",
              fontSize:12, fontWeight:800, transition:"all 0.15s",
            }}>{ai==="loading" ? "Thinking…" : "Suggest ✦"}</button>
          </div>

          {ai==="error" && (
            <p style={{ color:T.err, fontSize:12, marginTop:10, paddingTop:10, borderTop:`1px solid ${T.b0}` }}>
              Couldn't reach AI. Check your connection and try again.
            </p>
          )}

          {ai==="done" && aiData && (
            <div style={{ borderTop:`1px solid ${T.b0}`, marginTop:12, paddingTop:12 }}>
              <p style={{ fontSize:13, color:T.t2, lineHeight:1.6, marginBottom:10 }}>{aiData.description}</p>
              <div style={{ display:"flex", gap:7, marginBottom:9, flexWrap:"wrap" }}>
                {aiData.priority && PRI[aiData.priority] && <PriBadge pri={aiData.priority}/>}
                {aiData.category && CATS.includes(aiData.category) && <CatTag cat={aiData.category}/>}
              </div>
              {aiData.acceptance_criteria?.length > 0 && (
                <ul style={{ paddingLeft:16, marginBottom:11 }}>
                  {aiData.acceptance_criteria.map((c, i) => (
                    <li key={i} style={{ fontSize:12, color:T.t3, marginBottom:4, lineHeight:1.5 }}>{c}</li>
                  ))}
                </ul>
              )}
              <button onClick={applyAI} style={{ background:T.accD, color:T.accL,
                border:`1px solid ${T.acc}40`, borderRadius:8, padding:"6px 14px",
                cursor:"pointer", fontSize:12, fontWeight:800 }}>Apply suggestions ↑</button>
            </div>
          )}
        </div>

        {/* Title */}
        <Fld label="Title *">
          <input value={form.title} onChange={e => { fld("title",e.target.value); setErr(""); }}
            placeholder="What needs to be done?" style={{ ...inp(), border:`1px solid ${err && !form.title ? T.err : T.b0}` }}/>
          {err && <p style={{ color:T.err, fontSize:11, marginTop:4 }}>{err}</p>}
        </Fld>

        {/* Description */}
        <Fld label="Description">
          <textarea value={form.desc} onChange={e => fld("desc",e.target.value)}
            placeholder="Add context, notes, or acceptance criteria…" rows={3}
            style={{ ...inp(), resize:"vertical" }}/>
        </Fld>

        {/* Grid fields */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Fld label="Priority">
            <select value={form.pri} onChange={e => fld("pri",e.target.value)} style={inp()}>
              {Object.entries(PRI).map(([k,p]) => <option key={k} value={k}>{p.label}</option>)}
            </select>
          </Fld>
          <Fld label="Status">
            <select value={form.st} onChange={e => fld("st",e.target.value)} style={inp()}>
              {COLS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </Fld>
          <Fld label="Category">
            <select value={form.cat} onChange={e => fld("cat",e.target.value)} style={inp()}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Fld>
          <Fld label="Assignee">
            <select value={form.uid} onChange={e => fld("uid",parseInt(e.target.value))} style={inp()}>
              {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </Fld>
        </div>

        {/* Due date */}
        <Fld label="Due Date">
          <input type="date" value={form.due} onChange={e => fld("due",e.target.value)}
            style={{ ...inp(), colorScheme:"dark" }}/>
        </Fld>

        {/* Actions */}
        <div style={{ display:"flex", gap:10, marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1, background:"transparent",
            border:`1px solid ${T.b0}`, borderRadius:10, padding:"10px", cursor:"pointer",
            color:T.t2, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>Cancel</button>
          <button onClick={handleSave} style={{ flex:2, background:T.acc, color:"#fff",
            border:"none", borderRadius:10, padding:"10px", cursor:"pointer",
            fontSize:13, fontWeight:800, fontFamily:"inherit" }}>
            {mode === "edit" ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════════════════════
function Toast({ msg, type }) {
  const c = type === "ok" ? T.ok : type === "warn" ? T.war : T.err;
  const icon = type === "ok" ? "✓" : type === "warn" ? "⚠" : "✕";
  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:300,
      background:T.s3, borderRadius:11, padding:"11px 18px",
      border:`1px solid ${c}30`, borderLeft:`3px solid ${c}`,
      fontSize:13, color:T.t1, display:"flex", alignItems:"center", gap:9,
      fontFamily:"'Inter',system-ui,sans-serif",
    }}>
      <span style={{ color:c, fontSize:15 }}>{icon}</span>{msg}
    </div>
  );
}

// ═══════════════════════════════════════════════
// DELETE CONFIRM MODAL
// ═══════════════════════════════════════════════
function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,12,0.8)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:300 }}>
      <div style={{ background:T.s1, border:`1px solid ${T.err}50`, borderRadius:16,
        padding:"24px 28px", maxWidth:340, textAlign:"center" }}>
        <div style={{ fontSize:28, marginBottom:12 }}>🗑</div>
        <h3 style={{ color:T.t1, fontSize:15, fontWeight:800, marginBottom:8 }}>Delete Task?</h3>
        <p style={{ color:T.t2, fontSize:13, lineHeight:1.5, marginBottom:20 }}>This action cannot be undone.</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, background:"transparent", border:`1px solid ${T.b0}`,
            borderRadius:9, padding:"9px", cursor:"pointer", color:T.t2, fontSize:13, fontFamily:"inherit" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, background:T.errD, border:`1px solid ${T.err}40`,
            borderRadius:9, padding:"9px", cursor:"pointer", color:T.err, fontSize:13, fontWeight:800, fontFamily:"inherit" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════
export default function App() {
  const [user, setUser]     = useState(null);
  const [tasks, setTasks]   = useState(SEED);
  const [modal, setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [priF, setPriF]     = useState("all");
  const [view, setView]     = useState("board");
  const [toast, setToast]   = useState(null);
  const [sideOpen, setSide] = useState(true);

  const notify = (msg, type="ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addTask    = t  => { setTasks(p => [...p, { ...t, id:_nid++, ts:Date.now() }]); notify("Task created ✓"); };
  const updateTask = t  => { setTasks(p => p.map(x => x.id === t.id ? t : x)); notify("Task updated ✓"); };
  const deleteTask = id => { setTasks(p => p.filter(x => x.id !== id)); notify("Task deleted", "warn"); };
  const moveTask   = (id, st) => setTasks(p => p.map(x => x.id === id ? { ...x, st } : x));

  const visible = tasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "mine"   && t.uid !== user?.id)    return false;
    if (filter === "urgent" && t.pri !== "urgent")    return false;
    if (priF !== "all"      && t.pri !== priF)        return false;
    return true;
  });

  const stats = {
    total:      tasks.length,
    todo:       tasks.filter(t => t.st === "todo").length,
    inprogress: tasks.filter(t => t.st === "inprogress").length,
    done:       tasks.filter(t => t.st === "done").length,
    urgent:     tasks.filter(t => t.pri === "urgent").length,
  };

  if (!user) return <LoginScreen onLogin={setUser}/>;

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bg,
      color:T.t1, fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${T.b1};border-radius:10px;}
        input,select,textarea,button{font-family:inherit;outline:none;}
        input::placeholder,textarea::placeholder{color:${T.t3};}
        select option{background:${T.s2};color:${T.t1};}
      `}</style>

      <Sidebar
        user={user} stats={stats} view={view} setView={setView}
        onLogout={() => setUser(null)} open={sideOpen}
        onToggle={() => setSide(v => !v)}
      />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
        <Header
          search={search} setSearch={setSearch}
          filter={filter} setFilter={setFilter}
          priF={priF} setPriF={setPriF}
          onAdd={() => setModal({ mode:"create", task:null })}
          sideOpen={sideOpen} onToggleSide={() => setSide(v => !v)}
        />
        <StatsBar stats={stats}/>
        <div style={{ flex:1, overflow:"auto", padding:"0 18px 24px" }}>
          {view === "board"
            ? <Board tasks={visible}
                onEdit={t => setModal({ mode:"edit", task:t })}
                onDelete={id => setConfirm(id)}
                onMove={moveTask}/>
            : <ListView tasks={visible}
                onEdit={t => setModal({ mode:"edit", task:t })}
                onDelete={id => setConfirm(id)}
                onMove={moveTask}/>
          }
        </div>
      </div>

      {modal && (
        <TaskModal
          mode={modal.mode} task={modal.task} currentUser={user}
          onSave={t => { modal.mode==="create" ? addTask(t) : updateTask(t); setModal(null); }}
          onClose={() => setModal(null)}
        />
      )}

      {confirm && (
        <ConfirmDelete
          onConfirm={() => { deleteTask(confirm); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </div>
  );
}
