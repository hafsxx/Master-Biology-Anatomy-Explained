import { uiTranslations } from "./i18n.js";
import { systemOrder, getSystem } from "./anatomy-data.js";
import { QUESTIONS_PER_ROUND, SECONDS_PER_QUESTION, buildRound, pointsFor } from "./quiz.js";

const shapeIcons = ["shape-tri.svg", "shape-dia.svg", "shape-dot.svg", "shape-sq.svg"];
const answerColors = ["btn-red", "btn-blue", "btn-yellow", "btn-green"];
const svgCache = new Map();

const els = {
    langSelect: document.getElementById("langSelect"),
    themeBtn: document.getElementById("themeBtn"),
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
els.navQuiz.addEventListener("click", () => showTab("quiz"));
els.navStudy.addEventListener("click", () => showTab("study"));
els.startBtn.addEventListener("click", startQuiz);
els.replayBtn.addEventListener("click", startQuiz);
els.nextBtn.addEventListener("click", nextQuestion);
els.closeBtn.addEventListener("click", closeDetail);

applyTheme(localStorage.getItem("ae-theme") || "dark");
applyLanguage();
