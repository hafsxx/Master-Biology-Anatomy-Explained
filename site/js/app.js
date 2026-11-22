import { uiTranslations } from "./i18n.js";
import { systemOrder, getSystem } from "./anatomy-data.js";
import { QUESTIONS_PER_ROUND, SECONDS_PER_QUESTION, buildRound, pointsFor } from "./quiz.js";

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
const progressKey = "ae-progress-v2";
let learner = JSON.parse(localStorage.getItem(progressKey) || "null") || { xp: 0, dailyXP: 0, dailyDate: todayKey(), completed: [], streak: 0, lastStudy: "" };
if (typeof learner.dailyXP !== "number") learner.dailyXP = 0;
if (learner.dailyDate !== todayKey()) { learner.dailyXP = 0; learner.dailyDate = todayKey(); saveLearner(); }
let activeLessonKey = null;
const dailyGoal = 50;

function saveLearner() { localStorage.setItem(progressKey, JSON.stringify(learner)); }
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
    systemOrder.forEach((key, index) => {
        const sys = getSystem(currentLang, key); const done = completed.includes(key); const locked = index > 0 && !completed.includes(systemOrder[index-1]);
        const card = document.createElement("button"); card.type = "button"; card.className = `path-node ${done ? "done" : ""} ${locked ? "locked" : ""}`; card.style.setProperty("--node-accent", sys.accent); card.disabled = locked;
        card.innerHTML = `<span class="node-number">${done ? "✓" : String(index+1).padStart(2,"0")}</span><span class="node-copy"><small>${bs ? "MISija" : "MISSION"} ${String(index+1).padStart(2,"0")}</small><strong></strong><em></em></span><span class="node-reward">${done ? "✓" : "+20 XP"}</span>`;
        card.querySelector("strong").textContent = sys.title.replace(/^\d+\.\s*/, ""); card.querySelector("em").textContent = sys.desc || sys.hook;
        card.addEventListener("click", () => openLesson(key, index)); path.appendChild(card);
    });
}
function openLesson(key, index) {
    const sys = getSystem(currentLang, key); activeLessonKey = key;
    document.getElementById("lessonTag").textContent = `${currentLang === "bs" ? "LEKCIJA" : "LESSON"} ${String(index+1).padStart(2,"0")}`;
    document.getElementById("lessonTitle").textContent = sys.title.replace(/^\d+\.\s*/, "");
    document.getElementById("lessonIntro").textContent = sys.desc || sys.hook;
    document.getElementById("lessonFact").textContent = sys.tldr;
    document.getElementById("lessonOrgans").innerHTML = sys.organs.slice(0,4).map(x => `<span>${highlight(x.replace(/\*\*/g,""))}</span>`).join("");
    const done = learner.completed.includes(key); const btn = document.getElementById("completeLesson");
    btn.disabled = true; btn.textContent = done ? (currentLang === "bs" ? "Već završeno ✓" : "Completed ✓") : (currentLang === "bs" ? "Prvo tačno odgovori" : "Answer correctly to continue");
    document.getElementById("challengeEyebrow").textContent = currentLang === "bs" ? "BRZA PROVJERA" : "QUICK CHECK";
    document.getElementById("challengeQuestion").textContent = currentLang === "bs" ? "Koji sistem upravo učiš?" : "Which body system are you learning?";
    document.getElementById("challengeFeedback").textContent = done ? (currentLang === "bs" ? "Lekcija završena — možeš je ponoviti kad želiš." : "Lesson complete — you can review it any time.") : "";
    const options = [key, ...systemOrder.filter(k => k !== key).slice(0,3)];
    const optionBox = document.getElementById("challengeOptions"); optionBox.innerHTML = "";
    options.forEach((optionKey) => { const optionSys = getSystem(currentLang, optionKey); const option = document.createElement("button"); option.type = "button"; option.className = "challenge-option"; option.textContent = optionSys.title.replace(/^\d+\.\s*/, ""); option.disabled = done; option.addEventListener("click", () => checkLessonAnswer(optionKey)); optionBox.appendChild(option); });
    document.getElementById("lessonPanel").hidden = false; document.getElementById("lessonPanel").scrollIntoView({behavior:"smooth",block:"center"});
}
function checkLessonAnswer(answerKey) {
    const feedback = document.getElementById("challengeFeedback"); const btn = document.getElementById("completeLesson");
    if (answerKey === activeLessonKey) {
        feedback.textContent = currentLang === "bs" ? "TAČNO! Odlično — lekcija je otključana. ✨" : "CORRECT! Great work — lesson complete is unlocked. ✨";
        feedback.style.color = "#22c55e"; btn.disabled = learner.completed.includes(activeLessonKey); btn.textContent = currentLang === "bs" ? "Završi lekciju +20 XP" : "Complete lesson +20 XP";
    } else {
        feedback.textContent = currentLang === "bs" ? "Nije baš to — pokušaj ponovo!" : "Not quite — give it another try!";
        feedback.style.color = "#ff4d6d";
    }
}
function completeLesson() {
    if (!activeLessonKey || learner.completed.includes(activeLessonKey)) return;
    learner.completed.push(activeLessonKey); learner.xp += 20; learner.dailyXP += 20; updateStreak(); saveLearner(); renderPath();
    const index = systemOrder.indexOf(activeLessonKey); openLesson(activeLessonKey,index);
    document.getElementById("lessonReward").textContent = currentLang === "bs" ? "+20 XP ZARAĐENO! 🎉" : "+20 XP EARNED! 🎉";
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
    view.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeDetail() {
    openSystemKey = null;
    const view = document.getElementById("detailView");
    view.hidden = true;
    view.classList.remove("open");
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
document.getElementById("completeLesson").addEventListener("click", completeLesson);
document.getElementById("lessonClose").addEventListener("click", () => { document.getElementById("lessonPanel").hidden = true; });
document.getElementById("pathPractice").addEventListener("click", () => { showTab("quiz"); startQuiz(); });

applyTheme(localStorage.getItem("ae-theme") || "dark");
applyLanguage();
showTab("path");
