import { buildExercises, shuffle } from "./exercises.js";
import { partLabel } from "./parts.js";

const T = {
    bs: {
        check: "Provjeri", cont: "Nastavi", finish: "Završi", skip: "Preskoči",
        good: ["Odlično!", "Tačno!", "Sjajno!", "Bravo!", "Tako se to radi!"],
        bad: "Netačno", correctIs: "Tačan odgovor: ", tapModel: "Dodirni na modelu:", matchTitle: "Spoji parove",
        tfTrue: "Tačno", tfFalse: "Netačno", tfTitle: "Tačno ili netačno?",
        quitTitle: "Izlaziš iz lekcije?", quitText: "Napredak u ovoj lekciji će biti izgubljen.", stay: "Ostani", leave: "Izađi",
        failTitle: "Ostao si bez srca", failText: "Nema problema — greške su dio učenja. Pokušaj ponovo!", retry: "Pokušaj ponovo", exit: "Izađi",
        doneTitle: "Lekcija završena!", xp: "XP", accuracy: "Tačnost", hearts: "Srca", perfect: "Savršeno! +5 bonus XP",
        practice: "Vježba (bez bonusa)", webglNote: "3D model nije dostupan na ovom uređaju.", sound: "Zvuk",
        lessonOf: "Lekcija"
    },
    en: {
        check: "Check", cont: "Continue", finish: "Finish", skip: "Skip",
        good: ["Great job!", "Correct!", "Nice!", "Well done!", "That's it!"],
        bad: "Not quite", correctIs: "Correct answer: ", tapModel: "Tap on the model:", matchTitle: "Match the pairs",
        tfTrue: "True", tfFalse: "False", tfTitle: "True or false?",
        quitTitle: "Leave this lesson?", quitText: "You will lose your progress in this lesson.", stay: "Stay", leave: "Leave",
        failTitle: "You're out of hearts", failText: "No worries — mistakes are part of learning. Try again!", retry: "Try again", exit: "Exit",
        doneTitle: "Lesson complete!", xp: "XP", accuracy: "Accuracy", hearts: "Hearts", perfect: "Perfect! +5 bonus XP",
        practice: "Practice (no bonus)", webglNote: "3D model is not available on this device.", sound: "Sound",
        lessonOf: "Lesson"
    }
};

/* ------------------------------ sound ------------------------------ */
let audioCtx = null;
let soundOn = (() => { try { return localStorage.getItem("ae-sound") !== "0"; } catch (e) { return true; } })();
function tone(freq, start, dur, type = "sine", gain = 0.07) {
    if (!soundOn) return;
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, audioCtx.currentTime + start);
        g.gain.exponentialRampToValueAtTime(gain, audioCtx.currentTime + start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + start + dur);
        o.connect(g).connect(audioCtx.destination);
        o.start(audioCtx.currentTime + start); o.stop(audioCtx.currentTime + start + dur + 0.05);
    } catch (e) { /* audio blocked */ }
}
const sfx = {
    ok: () => { tone(660, 0, 0.12); tone(880, 0.1, 0.18); },
    bad: () => { tone(220, 0, 0.18, "sawtooth", 0.05); tone(165, 0.14, 0.22, "sawtooth", 0.05); },
    win: () => { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.25)); },
    lose: () => { [330, 262, 196].forEach((f, i) => tone(f, i * 0.16, 0.3, "triangle")); }
};

/* ------------------------------ helpers ---------------------------- */
function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
}

function confetti(canvas) {
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = canvas.clientWidth), h = (canvas.height = canvas.clientHeight);
    const colors = ["#3ee0c5", "#ff4d9a", "#c6ff4d", "#4d7cff", "#ffb020", "#ff4d6d"];
    const bits = Array.from({ length: 140 }, () => ({ x: Math.random() * w, y: -20 - Math.random() * h * 0.5, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4, s: 5 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: colors[Math.floor(Math.random() * colors.length)] }));
    let frames = 0;
    (function loop() {
        if (!canvas.isConnected) return;
        ctx.clearRect(0, 0, w, h);
        bits.forEach((b) => { b.x += b.vx; b.y += b.vy; b.r += b.vr; ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c; ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); ctx.restore(); });
        if (++frames < 220) requestAnimationFrame(loop); else ctx.clearRect(0, 0, w, h);
    })();
}

/* ------------------------------ player ----------------------------- */
/**
 * cfg: { key, lang, systemTitle, index, first (bool: first completion), webgl, createViewer,
 *        onFinish({xp, accuracy, perfect}), onClose(), onOpen() }
 */
export function startLesson(cfg) {
    const L = T[cfg.lang] || T.bs;
    let exercises, queue, total, done, hearts, mistakes, firstTry, answered, current, viewer, selected, matchState;

    const overlay = el("div", "lp");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", `${L.lessonOf}: ${cfg.systemTitle}`);
    overlay.style.setProperty("--lp-accent", cfg.accent || "#3ee0c5");

    const top = el("div", "lp-top");
    const xBtn = el("button", "lp-x", "×"); xBtn.type = "button"; xBtn.setAttribute("aria-label", L.exit);
    const bar = el("div", "lp-bar"); const barFill = el("i"); bar.appendChild(barFill);
    const heartsBox = el("div", "lp-hearts"); heartsBox.setAttribute("aria-label", L.hearts);
    const soundBtn = el("button", "lp-sound"); soundBtn.type = "button"; soundBtn.setAttribute("aria-label", L.sound);
    top.append(xBtn, bar, heartsBox, soundBtn);

    const body = el("div", "lp-body");
    const foot = el("div", "lp-foot");
    const fbBox = el("div", "lp-feedback"); fbBox.setAttribute("aria-live", "polite");
    const primary = el("button", "lp-btn", L.check); primary.type = "button";
    foot.append(fbBox, primary);
    overlay.append(top, body, foot);
    document.body.appendChild(overlay);
    document.body.classList.add("lp-open");
    if (cfg.onOpen) cfg.onOpen();
    xBtn.focus();

    function drawHearts() {
        heartsBox.textContent = "";
        for (let i = 0; i < 3; i++) heartsBox.appendChild(el("span", i < hearts ? "" : "lost", i < hearts ? "❤️" : "🖤"));
    }
    function drawSound() { soundBtn.textContent = soundOn ? "🔊" : "🔇"; }
    soundBtn.addEventListener("click", () => { soundOn = !soundOn; try { localStorage.setItem("ae-sound", soundOn ? "1" : "0"); } catch (e) { /* ignore */ } drawSound(); });
    function setBar() { barFill.style.width = `${Math.min(100, (done / total) * 100)}%`; }

    function disposeViewer() { if (viewer) { viewer.dispose(); viewer = null; } }

    function begin() {
        exercises = buildExercises(cfg.lang, cfg.key, { webgl: cfg.webgl });
        queue = exercises.slice(); total = exercises.length; done = 0; hearts = 3; mistakes = 0; firstTry = 0;
        drawHearts(); drawSound(); setBar(); next();
    }

    function setFooter(state, html) {
        foot.className = `lp-foot ${state || ""}`;
        fbBox.textContent = "";
        if (html) {
            fbBox.appendChild(el("strong", "", html.title));
            if (html.detail) fbBox.appendChild(el("span", "", html.detail));
        }
    }

    function next() {
        disposeViewer();
        if (!queue.length) return finish();
        current = queue.shift(); answered = false; selected = null; matchState = null;
        setFooter("", null);
        primary.disabled = true; primary.textContent = L.check; primary.onclick = null; primary.hidden = false;
        body.textContent = "";
        const wrap = el("div", "lp-card");
        body.appendChild(wrap);
        ({ mcq: renderMcq, tf: renderTf, match: renderMatch, identify: renderIdentify })[current.type](wrap);
        setBar();
    }

    function afterAnswer(correct, detailText) {
        answered = true;
        if (correct) {
            sfx.ok();
            if (!current.requeued) firstTry += 1;
            done += 1;
            setFooter("good", { title: L.good[Math.floor(Math.random() * L.good.length)], detail: detailText || "" });
        } else {
            sfx.bad();
            hearts -= 1; mistakes += 1; drawHearts();
            if (current.requeued) done += 1;
            else if (current.type !== "match") queue.push({ ...current, requeued: true });
            setFooter("bad", { title: L.bad, detail: detailText || "" });
        }
        setBar();
        primary.disabled = false; primary.hidden = false;
        primary.textContent = hearts <= 0 ? L.finish : L.cont;
        primary.onclick = () => (hearts <= 0 ? fail() : next());
        primary.focus();
    }

    /* --- multiple choice --- */
    function renderMcq(wrap) {
        const q = el("h2", "lp-q"); q.style.whiteSpace = "pre-line"; q.textContent = current.q;
        const list = el("div", "lp-options");
        current.options.forEach((text, i) => {
            const b = el("button", "lp-opt"); b.type = "button";
            b.append(el("kbd", "", String(i + 1)), el("span", "", text));
            b.addEventListener("click", () => { if (answered) return; selected = i; list.querySelectorAll(".lp-opt").forEach((x, k) => x.classList.toggle("sel", k === i)); primary.disabled = false; });
            list.appendChild(b);
        });
        wrap.append(q, list);
        primary.onclick = () => {
            if (answered || selected == null) return;
            const ok = selected === current.answer;
            list.querySelectorAll(".lp-opt").forEach((x, k) => { x.disabled = true; if (k === current.answer) x.classList.add("right"); else if (k === selected) x.classList.add("wrong"); });
            afterAnswer(ok, ok ? "" : L.correctIs + current.options[current.answer]);
        };
    }

    /* --- true / false --- */
    function renderTf(wrap) {
        wrap.append(el("p", "lp-kicker", L.tfTitle));
        const q = el("h2", "lp-q", current.q);
        const row = el("div", "lp-tf");
        [[true, L.tfTrue], [false, L.tfFalse]].forEach(([val, label]) => {
            const b = el("button", "lp-opt big", label); b.type = "button"; b.dataset.val = String(val);
            b.addEventListener("click", () => { if (answered) return; selected = val; row.querySelectorAll(".lp-opt").forEach((x) => x.classList.toggle("sel", x.dataset.val === String(val))); primary.disabled = false; });
            row.appendChild(b);
        });
        wrap.append(q, row);
        primary.onclick = () => {
            if (answered || selected == null) return;
            const ok = selected === current.answer;
            row.querySelectorAll(".lp-opt").forEach((x) => { x.disabled = true; if (x.dataset.val === String(current.answer)) x.classList.add("right"); else if (x.dataset.val === String(selected)) x.classList.add("wrong"); });
            afterAnswer(ok, ok ? "" : current.explain);
        };
    }

    /* --- matching pairs --- */
    function renderMatch(wrap) {
        wrap.append(el("h2", "lp-q", L.matchTitle));
        const grid = el("div", "lp-match");
        const left = el("div", "lp-col"), right = el("div", "lp-col");
        const pairs = current.pairs;
        matchState = { sel: null, matched: 0, errors: 0 };
        const mk = (side, i, text) => {
            const b = el("button", "lp-opt", text); b.type = "button"; b.dataset.i = String(i); b.dataset.side = side;
            b.addEventListener("click", () => {
                if (answered || b.classList.contains("right")) return;
                const s = matchState.sel;
                if (!s || s.dataset.side === side) { if (s) s.classList.remove("sel"); matchState.sel = b; b.classList.add("sel"); return; }
                s.classList.remove("sel"); matchState.sel = null;
                if (s.dataset.i === b.dataset.i) {
                    [s, b].forEach((x) => { x.classList.add("right"); x.disabled = true; });
                    sfx.ok(); matchState.matched += 1;
                    if (matchState.matched === pairs.length) afterAnswer(matchState.errors === 0, "");
                } else {
                    [s, b].forEach((x) => { x.classList.add("wrong"); setTimeout(() => x.classList.remove("wrong"), 500); });
                    sfx.bad(); hearts -= 1; mistakes += 1; matchState.errors += 1; drawHearts();
                    if (hearts <= 0) { answered = true; setFooter("bad", { title: L.bad }); primary.disabled = false; primary.textContent = L.finish; primary.onclick = fail; }
                }
            });
            return b;
        };
        shuffle(pairs.map((p, i) => [i, p[0]])).forEach(([i, t]) => left.appendChild(mk("l", i, t)));
        shuffle(pairs.map((p, i) => [i, p[1]])).forEach(([i, t]) => right.appendChild(mk("r", i, t)));
        grid.append(left, right);
        wrap.appendChild(grid);
        primary.hidden = true;
    }

    /* --- identify a part on the 3D model --- */
    function renderIdentify(wrap) {
        wrap.append(el("p", "lp-kicker", L.tapModel), el("h2", "lp-q lp-target", current.label));
        const stage = el("div", "viewer3d lp-viewer");
        wrap.appendChild(stage);
        primary.hidden = true;
        viewer = cfg.createViewer(stage, {
            lang: cfg.lang, labels: false, autoRotate: true,
            onPick: (k) => {
                if (answered) return;
                const ok = k === current.part;
                if (ok) viewer.flash(k, 0x22c55e, 1500);
                else { viewer.flash(k, 0xff4d6d, 900); viewer.flash(current.part, 0x22c55e, 1800); }
                afterAnswer(ok, ok ? "" : `${partLabel(current.system, k, cfg.lang)} ≠ ${current.label}`);
            }
        });
        viewer.setSystem(current.system);
    }

    function finish() {
        disposeViewer();
        sfx.win();
        const accuracy = Math.round((firstTry / total) * 100);
        const perfect = mistakes === 0;
        const base = cfg.first ? 20 : 5;
        const xp = base + (perfect && cfg.first ? 5 : 0);
        body.textContent = "";
        foot.className = "lp-foot"; fbBox.textContent = "";
        barFill.style.width = "100%";
        const box = el("div", "lp-end");
        const cv = el("canvas", "lp-confetti");
        box.append(el("div", "lp-trophy", perfect ? "🏆" : "🎉"), el("h2", "", L.doneTitle));
        const stats = el("div", "lp-stats");
        [[`+${xp}`, L.xp, "xp"], [`${accuracy}%`, L.accuracy, "acc"], [String(Math.max(hearts, 0)), L.hearts, "hrt"]].forEach(([v, l, c]) => {
            const s = el("div", `lp-stat ${c}`); s.append(el("strong", "", v), el("span", "", l)); stats.appendChild(s);
        });
        box.appendChild(stats);
        if (perfect && cfg.first) box.appendChild(el("p", "lp-perfect", L.perfect));
        if (!cfg.first) box.appendChild(el("p", "lp-muted", L.practice));
        body.append(box, cv);
        primary.hidden = false; primary.disabled = false; primary.textContent = L.cont;
        primary.onclick = () => { close(); if (cfg.onFinish) cfg.onFinish({ xp, accuracy, perfect }); };
        requestAnimationFrame(() => confetti(cv));
    }

    function fail() {
        disposeViewer(); sfx.lose();
        body.textContent = ""; setFooter("", null); primary.hidden = false;
        const box = el("div", "lp-end");
        box.append(el("div", "lp-trophy", "💔"), el("h2", "", L.failTitle), el("p", "lp-muted", L.failText));
        body.appendChild(box);
        primary.disabled = false; primary.textContent = L.retry; primary.onclick = begin;
        const quit = el("button", "lp-btn ghost", L.exit); quit.type = "button"; quit.onclick = close; quit.className = "lp-btn ghost";
        foot.insertBefore(quit, primary);
        const cleanup = () => quit.remove();
        primary.addEventListener("click", cleanup, { once: true });
    }

    function confirmQuit() {
        if (overlay.querySelector(".lp-modal")) return;
        const m = el("div", "lp-modal");
        const card = el("div", "lp-modal-card");
        const stay = el("button", "lp-btn", L.stay); stay.type = "button";
        const leave = el("button", "lp-btn ghost danger", L.leave); leave.type = "button";
        card.append(el("h3", "", L.quitTitle), el("p", "", L.quitText), stay, leave);
        m.appendChild(card); overlay.appendChild(m);
        stay.focus();
        stay.onclick = () => m.remove();
        leave.onclick = close;
    }

    function onKey(e) {
        if (!overlay.isConnected) return;
        if (e.key === "Escape") { e.preventDefault(); confirmQuit(); return; }
        if (overlay.querySelector(".lp-modal")) return;
        if (e.key === "Enter" && !primary.disabled && !primary.hidden && document.activeElement !== xBtn && document.activeElement !== soundBtn) { e.preventDefault(); primary.click(); return; }
        if (/^[1-4]$/.test(e.key) && current && current.type === "mcq" && !answered) {
            const b = overlay.querySelectorAll(".lp-opt")[Number(e.key) - 1];
            if (b) b.click();
        }
    }
    document.addEventListener("keydown", onKey);

    function close() {
        disposeViewer();
        document.removeEventListener("keydown", onKey);
        overlay.remove();
        document.body.classList.remove("lp-open");
        if (cfg.onClose) cfg.onClose();
    }
    xBtn.addEventListener("click", confirmQuit);

    begin();
}
