import { uiTranslations } from "./i18n.js";
import { systemOrder, getSystem } from "./anatomy-data.js";
import { QUESTIONS_PER_ROUND, SECONDS_PER_QUESTION, buildRound, pointsFor } from "./quiz.js";
import * as Auth from "./auth.js";
import { startLesson } from "./lessons.js";
import { PARTS, partLabel } from "./parts.js";

// three.js is loaded lazily from a CDN; if it fails the site still works without 3D.
const m3dReady = import("./models3d.js").catch(() => null);

const shapeIcons = ["shape-tri.svg", "shape-dia.svg", "shape-dot.svg", "shape-sq.svg"];
const answerColors = ["btn-red", "btn-blue", "btn-yellow", "btn-green"];
const svgCache = new Map();

const els = {
    langSelect: document.getElementById("langSelect"),
    themeBtn: document.getElementById("themeBtn"),
    navPath: document.getElementById("nav-path"),
    navQuiz: document.getElementById("nav-quiz"),
    navStudy: document.getElementById("nav-study"),
    startTitle: document.getElementById("startTitle"),
    startDesc: document.getElementById("startDesc"),
    startBtn: document.getElementById("startBtnText"),
    scoreLabel: document.getElementById("txt-score"),
    encyclopediaTitle: document.getElementById("txt-encyclopedia-title"),
    encyclopediaSub: document.getElementById("txt-encyclopedia-sub"),
    nextBtn: document.getElementById("nextQBtn"),
    closeBtn: document.getElementById("closeBtnText"),
    footer: document.getElementById("footerNote"),
    resultsTitle: document.getElementById("resultsTitle"),
    resultsDesc: document.getElementById("resultsDesc"),
    replayBtn: document.getElementById("replayBtn"),
    txtFinalScore: document.getElementById("txt-final-score"),
    txtBestStreak: document.getElementById("txt-best-streak"),
    txtAccuracy: document.getElementById("txt-accuracy")
};

let currentLang = localStorage.getItem("ae-lang") || "bs";
let openSystemKey = null;
let round = [];
let qIndex = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let correctCount = 0;
let timer = SECONDS_PER_QUESTION;
let timerId = null;
let isAnswered = false;
let learner = Auth.loadProgress();
if (typeof learner.dailyXP !== "number") learner.dailyXP = 0;
if (learner.dailyDate !== todayKey()) { learner.dailyXP = 0; learner.dailyDate = todayKey(); saveLearner(); }
let activeLessonKey = null;
const dailyGoal = 50;

function saveLearner() { Auth.saveProgress(learner); }
function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; }
function updateStreak() {
    const today = todayKey();
    if (learner.lastStudy !== today) {
        const d = new Date(); d.setDate(d.getDate()-1);
        const yesterday = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
        learner.streak = learner.lastStudy === yesterday ? learner.streak + 1 : 1;
        learner.lastStudy = today; saveLearner();
    }
}
function renderPath() {
    const bs = currentLang === "bs";
    const completed = learner.completed;
    document.getElementById("xpVal").textContent = learner.xp;
    document.getElementById("levelVal").textContent = Math.floor(learner.xp / 100) + 1;
    document.getElementById("streakDays").textContent = `${learner.streak} ${bs ? "dana" : "days"}`;
    document.getElementById("xpCaption").textContent = `${learner.dailyXP} / ${dailyGoal} ${bs ? "dnevni cilj" : "daily goal"}`;
    document.getElementById("dailyProgress").style.width = `${Math.min(100, learner.dailyXP / dailyGoal * 100)}%`;
    document.getElementById("unitCount").textContent = `${completed.length} / ${systemOrder.length} ${bs ? "završeno" : "complete"}`;
    document.getElementById("questValue").textContent = `${learner.dailyXP} / ${dailyGoal} XP`;
    document.getElementById("questProgress").style.width = `${Math.min(100, learner.dailyXP / dailyGoal * 100)}%`;
    document.getElementById("badgeDesc").textContent = completed.length >= 3 ? (bs ? "Prva značka otključana — samo nastavi!" : "First badge unlocked — keep going!") : (bs ? `Još ${3-completed.length} lekcije do prve značke.` : `${3-completed.length} more lessons to your first badge.`);
    document.getElementById("badgeRow").innerHTML = [[3,"🧠"],[6,"🫀"],[11,"🏆"]].map(([n,icon]) => `<span class="${completed.length >= n ? "unlocked" : "locked-badge"}" title="${n} lessons">${icon}</span>`).join("");
    const path = document.getElementById("lessonPath"); path.innerHTML = "";
    const offsets = [0, 46, 74, 46, 0, -46, -74, -46];
    systemOrder.forEach((key, index) => {
        const sys = getSystem(currentLang, key); const done = completed.includes(key); const locked = index > 0 && !completed.includes(systemOrder[index-1]); const isCurrent = !done && !locked;
        const title = sys.title.replace(/^\d+\.\s*/, "");
        const step = document.createElement("div"); step.className = "path-step"; step.style.setProperty("--off", `${offsets[index % offsets.length]}px`); step.style.setProperty("--node-accent", sys.accent);
        const btn = document.createElement("button"); btn.type = "button"; btn.disabled = locked;
        btn.className = `step-node ${done ? "done" : ""} ${locked ? "locked" : ""} ${isCurrent ? "current" : ""}`;
        btn.setAttribute("aria-label", `${bs ? "Misija" : "Mission"} ${index+1}: ${title}${locked ? (bs ? " (zaključano)" : " (locked)") : ""}`);
        const img = document.createElement("img"); img.src = `assets/svg/${sys.icon}`; img.alt = ""; btn.appendChild(img);
        const badge = document.createElement("span"); badge.className = "step-badge"; badge.textContent = done ? "✓" : locked ? "🔒" : ""; if (badge.textContent) btn.appendChild(badge);
        const label = document.createElement("div"); label.className = "step-label";
        label.innerHTML = "<small></small><strong></strong>"; label.querySelector("small").textContent = `${bs ? "MISIJA" : "MISSION"} ${String(index+1).padStart(2,"0")}`; label.querySelector("strong").textContent = title;
        if (isCurrent) { const go = document.createElement("span"); go.className = "step-start"; go.textContent = bs ? "POČNI" : "START"; step.appendChild(go); }
        btn.addEventListener("click", () => openLesson(key, index));
        step.append(btn, label); path.appendChild(step);
    });
    renderBoard(); updateAccountBtn();
}
function openLesson(key, index) {
    const bs = currentLang === "bs";
    const sys = getSystem(currentLang, key); activeLessonKey = key;
    document.getElementById("lessonTag").textContent = `${bs ? "LEKCIJA" : "LESSON"} ${String(index+1).padStart(2,"0")}`;
    document.getElementById("lessonTitle").textContent = sys.title.replace(/^\d+\.\s*/, "");
    document.getElementById("lessonIntro").textContent = sys.desc || sys.hook;
    document.getElementById("lessonFact").textContent = sys.tldr;
    document.getElementById("lessonOrgans").innerHTML = sys.organs.slice(0,4).map(x => `<span>${highlight(x.replace(/\*\*/g,"").split(":")[0])}</span>`).join("");
    const done = learner.completed.includes(key);
    document.getElementById("lessonReward").textContent = done ? (bs ? "+5 XP (vježba)" : "+5 XP (practice)") : "+20 XP";
    const btn = document.getElementById("completeLesson");
    btn.disabled = false; btn.textContent = done ? (bs ? "Vježbaj ▶" : "Practice ▶") : (bs ? "Započni lekciju ▶" : "Start lesson ▶");
    document.getElementById("lessonPanel").hidden = false; document.getElementById("lessonPanel").scrollIntoView({behavior:"smooth",block:"center"});
}

async function launchLesson() {
    if (!activeLessonKey) return;
    const key = activeLessonKey; const first = !learner.completed.includes(key); const sys = getSystem(currentLang, key);
    const m = await m3dReady;
    startLesson({
        key, lang: currentLang, systemTitle: sys.title.replace(/^\d+\.\s*/, ""), accent: sys.accent, first,
        webgl: !!(m && m.webglAvailable()), createViewer: m ? m.createViewer : null,
        onOpen: () => { if (hero) hero.pause(true); if (atlasViewer) atlasViewer.pause(true); },
        onClose: () => { if (hero) hero.pause(false); if (atlasViewer && openSystemKey) atlasViewer.pause(false); },
        onFinish: ({ xp }) => {
            learner.xp += xp; learner.dailyXP += xp;
            if (first && !learner.completed.includes(key)) learner.completed.push(key);
            updateStreak(); saveLearner();
            document.getElementById("lessonPanel").hidden = true;
            renderPath();
            if (!Auth.currentUser() && first) toast(currentLang === "bs" ? "Napravi račun da sačuvaš napredak i uđeš na rang listu 🏆" : "Create an account to keep your progress and join the leaderboard 🏆");
        }
    });
}

function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; t.setAttribute("role", "status");
    document.body.appendChild(t); setTimeout(() => t.classList.add("out"), 4200); setTimeout(() => t.remove(), 4800);
}

function renderBoard() {
    const bs = currentLang === "bs";
    const list = document.getElementById("boardList"); if (!list) return;
    document.getElementById("boardEyebrow").textContent = bs ? "RANG LISTA" : "LEADERBOARD";
    document.getElementById("boardTitle").textContent = bs ? "Najbolji učenici" : "Top learners";
    const me = Auth.currentUser(); const rows = Auth.leaderboard(5);
    list.innerHTML = "";
    rows.forEach((r, i) => {
        const li = document.createElement("li"); if (me && me.id === r.id) li.className = "me";
        const rank = document.createElement("b"); rank.textContent = String(i + 1);
        const av = document.createElement("span"); av.textContent = r.avatar;
        const nm = document.createElement("em"); nm.textContent = r.name;
        const xp = document.createElement("strong"); xp.textContent = `${r.xp} XP`;
        li.append(rank, av, nm, xp); list.appendChild(li);
    });
    document.getElementById("boardNote").textContent = rows.length
        ? (bs ? "Učenici s računom na ovom uređaju." : "Learners with an account on this device.")
        : (bs ? "Još nema računa. Napravi prvi i vodi rang listu!" : "No accounts yet. Create the first one and lead the board!");
}

/* ---------------------------- 3D (hero + atlas) ---------------------------- */
let hero = null, atlasViewer = null;

async function initHero() {
    const m = await m3dReady; const box = document.getElementById("heroModel");
    if (!m || !m.webglAvailable()) { box.hidden = true; return; }
    hero = m.createViewer(box, { autoRotate: true });
    const seq = ["circulatory", "nervous", "respiratory", "skeletal", "digestive"]; let i = 0;
    hero.setSystem(seq[0]);
    setInterval(() => { i = (i + 1) % seq.length; hero.setSystem(seq[i]); }, 7000);
}

async function mountAtlas(sys) {
    const m = await m3dReady; const holder = document.getElementById("atlasViewer"); const block = holder.closest(".atlas-3d");
    if (!m || !m.webglAvailable()) { block.hidden = true; return; }
    block.hidden = false;
    const bs = currentLang === "bs";
    document.getElementById("atlasHeading").textContent = bs ? "3D model" : "3D model";
    document.getElementById("atlasHint").textContent = bs ? "Povuci da zarotiraš. Pređi mišem ili dodirni dio modela." : "Drag to rotate. Hover or tap a part of the model.";
    document.getElementById("atlasSelected").textContent = "";
    if (!atlasViewer) atlasViewer = m.createViewer(holder, { lang: currentLang, labels: true, autoRotate: true, onPick: (k) => selectAtlasPart(k), onHover: (k) => highlightChip(k) });
    atlasViewer.setLang(currentLang); atlasViewer.setSystem(sys.key); atlasViewer.highlight(null); atlasViewer.pause(false);
    const chips = document.getElementById("atlasParts"); chips.innerHTML = "";
    Object.keys(PARTS[sys.key]).forEach((k) => {
        const b = document.createElement("button"); b.type = "button"; b.className = "atlas-chip"; b.dataset.part = k; b.textContent = partLabel(sys.key, k, currentLang);
        b.addEventListener("click", () => selectAtlasPart(k));
        b.addEventListener("mouseenter", () => atlasViewer.highlight(k)); b.addEventListener("mouseleave", () => atlasViewer.highlight(null));
        chips.appendChild(b);
    });
}
function highlightChip(k) { document.querySelectorAll(".atlas-chip").forEach((c) => c.classList.toggle("hover", c.dataset.part === k)); }
function selectAtlasPart(k) {
    document.querySelectorAll(".atlas-chip").forEach((c) => c.classList.toggle("active", c.dataset.part === k));
    if (atlasViewer) { atlasViewer.highlight(k); atlasViewer.flash(k, 0x3ee0c5, 700); }
    document.getElementById("atlasSelected").textContent = openSystemKey ? partLabel(openSystemKey, k, currentLang) : "";
}

/* ------------------------------- accounts UI ------------------------------- */
const AT = {
    bs: { signup: "Napravi račun", login: "Prijava", username: "Korisničko ime", password: "Lozinka (min. 8 znakova)", avatar: "Odaberi avatar", keep: "Prenesi moj trenutni napredak na račun", submitUp: "Napravi račun", submitIn: "Prijavi me", guest: "Nastavi kao gost", close: "Zatvori",
        localNote: "Račun i napredak se čuvaju samo u ovom pregledniku, na ovom uređaju. Zaboravljena lozinka se ne može povratiti. Ne tražimo e-mail niti lične podatke.",
        storageWarn: "Ovaj preglednik ne dozvoljava spremanje podataka, pa napredak neće ostati nakon zatvaranja.",
        errors: { nameInvalid: "Ime: 3–20 znakova (slova, brojevi, _ . -).", passShort: "Lozinka mora imati najmanje 8 znakova.", nameTaken: "To ime je već zauzeto.", badLogin: "Pogrešno ime ili lozinka.", noCrypto: "Ovaj preglednik ne podržava sigurno spremanje lozinke.", locked: "Previše pokušaja. Pričekaj nekoliko sekundi." },
        hello: "Zdravo", stats: ["XP", "Nivo", "Niz dana", "Lekcije", "Najbolji rezultat"], logout: "Odjava", reset: "Resetuj napredak", resetAsk: "Sigurno? Ovo briše XP i lekcije.", del: "Obriši račun", delAsk: "Unesi lozinku za trajno brisanje", delGo: "Obriši zauvijek", cancel: "Odustani", yes: "Da, resetuj", account: "Prijava", days: "dana" },
    en: { signup: "Create account", login: "Log in", username: "Username", password: "Password (min. 8 characters)", avatar: "Pick an avatar", keep: "Move my current progress to the account", submitUp: "Create account", submitIn: "Log me in", guest: "Continue as guest", close: "Close",
        localNote: "Your account and progress are stored only in this browser, on this device. A forgotten password cannot be recovered. We don't ask for an email or personal details.",
        storageWarn: "This browser blocks data storage, so progress will not persist after you close the page.",
        errors: { nameInvalid: "Name: 3–20 characters (letters, numbers, _ . -).", passShort: "Password must be at least 8 characters.", nameTaken: "That name is already taken.", badLogin: "Wrong name or password.", noCrypto: "This browser can't store passwords securely.", locked: "Too many attempts. Wait a few seconds." },
        hello: "Hi", stats: ["XP", "Level", "Streak", "Lessons", "Best score"], logout: "Log out", reset: "Reset progress", resetAsk: "Sure? This clears XP and lessons.", del: "Delete account", delAsk: "Enter your password to delete permanently", delGo: "Delete forever", cancel: "Cancel", yes: "Yes, reset", account: "Log in", days: "days" }
};

function h(tag, props, ...kids) {
    const n = document.createElement(tag);
    Object.entries(props || {}).forEach(([k, v]) => { if (k === "class") n.className = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v); });
    kids.flat().forEach((c) => n.append(c));
    return n;
}

function updateAccountBtn() {
    const me = Auth.currentUser(); const a = AT[currentLang];
    document.getElementById("accountAvatar").textContent = me ? me.avatar : "👤";
    document.getElementById("accountLabel").textContent = me ? me.name : a.account;
}

function closeAuth() { const root = document.getElementById("authRoot"); root.textContent = ""; document.body.classList.remove("modal-open"); document.getElementById("accountBtn").focus(); }

function openAuth(mode) {
    const a = AT[currentLang]; const root = document.getElementById("authRoot"); const me = Auth.currentUser();
    root.textContent = ""; document.body.classList.add("modal-open");
    const card = h("div", { class: "auth-card", role: "dialog", "aria-modal": "true", "aria-label": me ? a.hello : a.signup });
    const backdrop = h("div", { class: "auth-backdrop", onclick: (e) => { if (e.target === backdrop) closeAuth(); } }, card);
    const closeBtn = h("button", { class: "close-btn auth-x", type: "button", "aria-label": a.close, onclick: closeAuth }, "×");
    root.appendChild(backdrop);
    const onKey = (e) => { if (e.key === "Escape") { document.removeEventListener("keydown", onKey); closeAuth(); } };
    document.addEventListener("keydown", onKey);

    if (me) {
        const lvl = Math.floor(learner.xp / 100) + 1;
        const vals = [learner.xp, lvl, `${learner.streak} ${a.days}`, `${learner.completed.length}/${systemOrder.length}`, learner.bestScore || 0];
        const grid = h("div", { class: "auth-stats" }, a.stats.map((label, i) => h("div", {}, h("strong", {}, String(vals[i])), h("span", {}, label))));
        const msg = h("p", { class: "auth-msg", "aria-live": "polite" });
        const actions = h("div", { class: "auth-actions" });
        const resetBtn = h("button", { type: "button", class: "ghost-btn" }, a.reset);
        resetBtn.addEventListener("click", () => {
            actions.textContent = ""; msg.textContent = a.resetAsk;
            actions.append(h("button", { type: "button", class: "start-btn", onclick: () => { learner = Auth.resetProgress(); renderPath(); closeAuth(); } }, a.yes), h("button", { type: "button", class: "ghost-btn", onclick: () => openAuth() }, a.cancel));
        });
        const delBtn = h("button", { type: "button", class: "ghost-btn danger" }, a.del);
        delBtn.addEventListener("click", () => {
            actions.textContent = ""; msg.textContent = a.delAsk;
            const pw = h("input", { type: "password", autocomplete: "current-password", "aria-label": a.password });
            const go = h("button", { type: "button", class: "start-btn danger" }, a.delGo);
            go.addEventListener("click", async () => {
                const r = await Auth.deleteAccount(pw.value);
                if (r.error) { msg.textContent = a.errors[r.error] || a.errors.badLogin; return; }
                learner = Auth.loadProgress(); renderPath(); closeAuth();
            });
            actions.append(pw, go, h("button", { type: "button", class: "ghost-btn", onclick: () => openAuth() }, a.cancel)); pw.focus();
        });
        const outBtn = h("button", { type: "button", class: "start-btn" }, a.logout);
        outBtn.addEventListener("click", () => { Auth.logOut(); learner = Auth.loadProgress(); normaliseLearner(); renderPath(); closeAuth(); });
        actions.append(outBtn, resetBtn, delBtn);
        card.append(closeBtn, h("div", { class: "auth-avatar" }, me.avatar), h("h2", {}, `${a.hello}, ${me.name}!`), grid, msg, actions, h("p", { class: "auth-note" }, a.localNote));
        return;
    }

    let tab = mode === "login" ? "login" : "signup"; let avatar = Auth.AVATARS[0];
    const tabs = h("div", { class: "auth-tabs", role: "tablist" });
    const form = h("form", { class: "auth-form", novalidate: "" });
    const msg = h("p", { class: "auth-msg", "aria-live": "polite" });
    const nameIn = h("input", { id: "authName", type: "text", autocomplete: "username", maxlength: "20", required: "" });
    const passIn = h("input", { id: "authPass", type: "password", required: "" });
    const submit = h("button", { type: "submit", class: "start-btn" });
    const keepBox = h("input", { type: "checkbox", id: "authKeep" });
    const keepRow = h("label", { class: "auth-keep", for: "authKeep" }, keepBox, a.keep);
    const picker = h("div", { class: "auth-avatars", role: "radiogroup", "aria-label": a.avatar });
    Auth.AVATARS.forEach((emo) => {
        const b = h("button", { type: "button", role: "radio", "aria-checked": String(emo === avatar), class: emo === avatar ? "on" : "" }, emo);
        b.addEventListener("click", () => { avatar = emo; picker.querySelectorAll("button").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-checked", String(x === b)); }); });
        picker.appendChild(b);
    });
    keepBox.checked = learner.xp > 0;
    function paint() {
        tabs.textContent = "";
        [["signup", a.signup], ["login", a.login]].forEach(([k, label]) => {
            const t = h("button", { type: "button", role: "tab", "aria-selected": String(tab === k), class: tab === k ? "on" : "" }, label);
            t.addEventListener("click", () => { tab = k; msg.textContent = ""; paint(); }); tabs.appendChild(t);
        });
        passIn.setAttribute("autocomplete", tab === "signup" ? "new-password" : "current-password");
        picker.hidden = tab !== "signup"; keepRow.hidden = tab !== "signup" || learner.xp === 0;
        submit.textContent = tab === "signup" ? a.submitUp : a.submitIn;
    }
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); msg.textContent = ""; submit.disabled = true;
        const r = tab === "signup" ? await Auth.signUp({ name: nameIn.value, password: passIn.value, avatar, keepGuestProgress: keepBox.checked }) : await Auth.logIn(nameIn.value, passIn.value);
        submit.disabled = false;
        if (r.error) { msg.textContent = a.errors[r.error] || a.errors.badLogin; return; }
        document.removeEventListener("keydown", onKey);
        learner = Auth.loadProgress(); normaliseLearner(); renderPath(); closeAuth();
    });
    const guest = h("button", { type: "button", class: "auth-guest", onclick: closeAuth }, a.guest);
    form.append(h("label", { for: "authName" }, a.username), nameIn, h("label", { for: "authPass" }, a.password), passIn, h("p", { class: "auth-avatar-label" }, a.avatar), picker, keepRow, msg, submit);
    card.append(closeBtn, h("h2", {}, "AnatomyExplained"), tabs, form, guest, h("p", { class: "auth-note" }, a.localNote));
    if (!Auth.storageOk()) card.append(h("p", { class: "auth-note warn" }, a.storageWarn));
    paint(); nameIn.focus();
}

function normaliseLearner() {
    if (typeof learner.dailyXP !== "number") learner.dailyXP = 0;
    if (learner.dailyDate !== todayKey()) { learner.dailyXP = 0; learner.dailyDate = todayKey(); saveLearner(); }
}

function ui() {
    return uiTranslations[currentLang];
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function highlight(str) {
    return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, "<mark class=\"hl\">$1</mark>");
}

function fillList(id, items) {
    document.getElementById(id).innerHTML = items.map((item) => `<li>${highlight(item)}</li>`).join("");
}

function showTab(tabName) {
    document.querySelectorAll(".view-panel").forEach((el) => el.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach((el) => el.classList.remove("active"));
    document.getElementById(`${tabName}-view`).classList.add("active");
    document.getElementById(`nav-${tabName}`).classList.add("active");
}

function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("ae-theme", theme);
    els.themeBtn.textContent = theme === "dark" ? ui().themeLight : ui().themeDark;
}

function toggleTheme() {
    const next = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
}

function applySvgLang(root) {
    if (!root) return;
    root.querySelectorAll(".lang-bs, .lang-en").forEach((g) => {
        g.style.display = g.classList.contains(`lang-${currentLang}`) ? "block" : "none";
    });
}

async function mountSvg(el, path) {
    if (!path) {
        el.innerHTML = "";
        return;
    }
    if (!svgCache.has(path)) {
        svgCache.set(path, fetch(path).then((r) => r.text()));
    }
    el.innerHTML = await svgCache.get(path);
    applySvgLang(el);
}

function applyLanguage() {
    const t = ui();
    document.documentElement.lang = currentLang;
    els.navQuiz.textContent = t.navQuiz;
    els.navPath.textContent = currentLang === "bs" ? "Put učenja" : "Learning path";
    document.getElementById("path-eyebrow").textContent = currentLang === "bs" ? "TVOJE ANATOMSKO PUTOVANJE" : "YOUR ANATOMY JOURNEY";
    document.getElementById("path-title").textContent = currentLang === "bs" ? "Male lekcije. Veliko znanje." : "Small lessons. Serious brainpower.";
    document.getElementById("path-subtitle").textContent = currentLang === "bs" ? "Gradi znanje o tijelu, jednu misiju po jednu." : "Build your anatomy knowledge one mission at a time.";
    document.getElementById("unitEyebrow").textContent = currentLang === "bs" ? "TVOJ KURS" : "YOUR COURSE";
    document.getElementById("unitTitle").textContent = currentLang === "bs" ? "Sistemi ljudskog tijela" : "The human body systems";
    document.getElementById("questEyebrow").textContent = currentLang === "bs" ? "DNEVNI IZAZOV" : "DAILY QUEST";
    document.getElementById("questTitle").textContent = currentLang === "bs" ? "Osvoji 50 XP danas" : "Earn 50 XP today";
    document.getElementById("questDesc").textContent = currentLang === "bs" ? "Završi lekcije i izazove da popuniš traku napretka." : "Complete lessons and challenges to fill your progress bar.";
    document.getElementById("badgeEyebrow").textContent = currentLang === "bs" ? "KOLEKCIJA" : "COLLECTION";
    document.getElementById("badgeTitle").textContent = currentLang === "bs" ? "Značke za uspjeh" : "Milestone badges";
    document.getElementById("factHeading").textContent = currentLang === "bs" ? "Zapamti ovo" : "Remember this";
    document.getElementById("organsHeading").textContent = currentLang === "bs" ? "Ključne strukture" : "Key structures";
    document.getElementById("pathPractice").textContent = currentLang === "bs" ? "⚡ Brzo vježbanje" : "⚡ Quick practice";
    document.getElementById("lessonReward").textContent = "+20 XP";
    document.getElementById("completeLesson").textContent = currentLang === "bs" ? "Završi lekciju" : "Complete lesson";
    renderPath();
    els.navStudy.textContent = t.navStudy;
    els.scoreLabel.textContent = t.score;
    els.encyclopediaTitle.textContent = t.encyclopediaTitle;
    els.encyclopediaSub.textContent = t.encyclopediaSub;
    els.nextBtn.textContent = t.nextQ;
    els.closeBtn.textContent = t.close;
    els.startTitle.textContent = t.startTitle;
    els.startDesc.textContent = t.startDesc;
    els.startBtn.textContent = t.startBtn;
    els.resultsTitle.textContent = t.resultsTitle;
    els.resultsDesc.textContent = t.resultsDesc;
    els.replayBtn.textContent = t.replay;
    els.txtFinalScore.textContent = t.finalScore;
    els.txtBestStreak.textContent = t.bestStreak;
    els.txtAccuracy.textContent = t.accuracy;
    els.footer.textContent = t.footer;
    els.themeBtn.textContent = document.body.getAttribute("data-theme") === "dark" ? t.themeLight : t.themeDark;
    renderEncyclopedia();
    showQuizScreen("start");
    if (openSystemKey) {
        openDetail(getSystem(currentLang, openSystemKey));
    }
}

function showQuizScreen(name) {
    document.getElementById("quizStartScreen").style.display = name === "start" ? "block" : "none";
    document.getElementById("quizActiveScreen").style.display = name === "active" ? "block" : "none";
    document.getElementById("quizResultsScreen").style.display = name === "results" ? "block" : "none";
    if (name !== "active") {
        clearInterval(timerId);
    }
}

function startQuiz() {
    round = buildRound(currentLang);
    qIndex = 0;
    score = 0;
    streak = 0;
    bestStreak = 0;
    correctCount = 0;
    document.getElementById("scoreVal").textContent = "0";
    document.getElementById("streakVal").textContent = "0";
    showQuizScreen("active");
    loadQuestion();
}

function startTimer() {
    clearInterval(timerId);
    timer = SECONDS_PER_QUESTION;
    const box = document.getElementById("timerBox");
    box.textContent = String(timer);
    box.classList.remove("urgent");
    timerId = setInterval(() => {
        timer -= 1;
        box.textContent = String(timer);
        if (timer <= 5) box.classList.add("urgent");
        if (timer <= 0) {
            clearInterval(timerId);
            timeOut();
        }
    }, 1000);
}

function loadQuestion() {
    isAnswered = false;
    const data = round[qIndex];
    const t = ui();
    document.getElementById("qText").textContent = data.q;
    document.getElementById("feedbackBox").textContent = "";
    els.nextBtn.style.display = "none";
    document.getElementById("qProgress").textContent = `${t.qProgress} ${qIndex + 1}/${QUESTIONS_PER_ROUND}`;
    document.getElementById("progressBar").style.width = `${(qIndex / QUESTIONS_PER_ROUND) * 100}%`;

    const grid = document.getElementById("ansGrid");
    grid.innerHTML = "";
    data.a.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `ans-btn ${answerColors[idx]}`;
        btn.innerHTML = `<img src="assets/svg/${shapeIcons[idx]}" alt=""> <span></span>`;
        btn.querySelector("span").textContent = opt;
        btn.addEventListener("click", () => selectAnswer(idx));
        grid.appendChild(btn);
    });
    startTimer();
}

function lockAnswers() {
    document.querySelectorAll(".ans-btn").forEach((btn) => btn.classList.add("locked"));
}

function selectAnswer(idx) {
    if (isAnswered) return;
    isAnswered = true;
    clearInterval(timerId);
    lockAnswers();

    const data = round[qIndex];
    const t = ui();
    const fb = document.getElementById("feedbackBox");

    if (idx === data.c) {
        streak += 1;
        bestStreak = Math.max(bestStreak, streak);
        correctCount += 1;
        const gained = pointsFor(timer);
        score += gained;
        fb.textContent = `${t.correctMsg}${gained}`;
        fb.style.color = "#22c55e";
    } else {
        streak = 0;
        fb.textContent = `${t.wrongMsg}${data.a[data.c]}`;
        fb.style.color = "#ff4d6d";
    }

    document.getElementById("scoreVal").textContent = String(score);
    document.getElementById("streakVal").textContent = String(streak);
    els.nextBtn.style.display = "inline-block";
}

function timeOut() {
    if (isAnswered) return;
    isAnswered = true;
    lockAnswers();
    streak = 0;
    const data = round[qIndex];
    const t = ui();
    const fb = document.getElementById("feedbackBox");
    fb.textContent = `${t.timeUpMsg}${data.a[data.c]}`;
    fb.style.color = "#ff4d6d";
    document.getElementById("streakVal").textContent = String(streak);
    els.nextBtn.style.display = "inline-block";
}

function nextQuestion() {
    qIndex += 1;
    if (qIndex >= QUESTIONS_PER_ROUND) {
        finishRound();
        return;
    }
    loadQuestion();
}

function finishRound() {
    clearInterval(timerId);
    document.getElementById("progressBar").style.width = "100%";
    document.getElementById("finalScore").textContent = String(score);
    document.getElementById("finalStreak").textContent = String(bestStreak);
    const accuracy = Math.round((correctCount / QUESTIONS_PER_ROUND) * 100);
    document.getElementById("finalAccuracy").textContent = `${accuracy}%`;
    const gain = correctCount * 3;
    learner.xp += gain; learner.dailyXP += gain; learner.bestScore = Math.max(learner.bestScore || 0, score);
    if (gain > 0) updateStreak();
    saveLearner(); renderPath();
    els.resultsDesc.textContent = `${ui().resultsDesc} +${gain} XP`;
    showQuizScreen("results");
}

function renderEncyclopedia() {
    const list = document.getElementById("systemsList");
    list.innerHTML = "";
    systemOrder.forEach((key) => {
        const sys = getSystem(currentLang, key);
        const card = document.createElement("button");
        card.type = "button";
        card.className = "system-card";
        card.style.setProperty("--card-accent", sys.accent);
        card.innerHTML = "<h3></h3><p></p>";
        card.querySelector("h3").textContent = sys.title;
        card.querySelector("p").textContent = sys.hook;
        card.addEventListener("click", () => openDetail(sys));
        list.appendChild(card);
    });
    if (!openSystemKey) closeDetail();
}

async function openDetail(sys) {
    const t = ui();
    openSystemKey = sys.key;
    document.getElementById("detTitle").textContent = sys.title;
    document.getElementById("detTldr").innerHTML = `<strong>${t.tldrLabel}:</strong> ${highlight(sys.tldr)}`;
    document.getElementById("detHook").innerHTML = `<strong>${t.hookLabel}:</strong> ${highlight(sys.hook)}`;
    document.getElementById("detMnemonic").innerHTML = `<strong>${t.mnemonicLabel}:</strong> ${highlight(sys.mnemonic)}`;
    document.getElementById("hOrgans").textContent = t.headings.organs;
    document.getElementById("hFunctions").textContent = t.headings.functions;
    document.getElementById("hCell").textContent = t.headings.cell;
    document.getElementById("hIllnesses").textContent = t.headings.illnesses;
    document.getElementById("capOverview").textContent = t.capOverview;
    document.getElementById("capCell").textContent = t.capCell;
    document.getElementById("detCellType").innerHTML = highlight(sys.cellType);
    fillList("listOrgans", sys.organs);
    fillList("listFunctions", sys.functions);
    fillList("listCell", sys.cellParts);
    fillList("listIllnesses", sys.illnesses);

    const view = document.getElementById("detailView");
    view.hidden = false;
    view.classList.add("open");
    await Promise.all([
        mountSvg(document.getElementById("overviewMount"), sys.overviewSvg),
        mountSvg(document.getElementById("cellMount"), sys.cellSvg)
    ]);
    mountAtlas(sys);
    view.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeDetail() {
    openSystemKey = null;
    const view = document.getElementById("detailView");
    view.hidden = true;
    view.classList.remove("open");
    if (atlasViewer) atlasViewer.pause(true);
}

els.langSelect.value = currentLang;
els.langSelect.addEventListener("change", (e) => {
    currentLang = e.target.value;
    localStorage.setItem("ae-lang", currentLang);
    applyLanguage();
});
els.themeBtn.addEventListener("click", toggleTheme);
els.navPath.addEventListener("click", () => showTab("path"));
els.navQuiz.addEventListener("click", () => showTab("quiz"));
els.navStudy.addEventListener("click", () => showTab("study"));
els.startBtn.addEventListener("click", startQuiz);
els.replayBtn.addEventListener("click", startQuiz);
els.nextBtn.addEventListener("click", nextQuestion);
els.closeBtn.addEventListener("click", closeDetail);
document.getElementById("completeLesson").addEventListener("click", launchLesson);
document.getElementById("accountBtn").addEventListener("click", () => openAuth());
document.getElementById("lessonClose").addEventListener("click", () => { document.getElementById("lessonPanel").hidden = true; });
document.getElementById("pathPractice").addEventListener("click", () => { showTab("quiz"); startQuiz(); });

applyTheme(localStorage.getItem("ae-theme") || "dark");
normaliseLearner();
applyLanguage();
showTab("path");
initHero();
