import { systemOrder, getSystem } from "./anatomy-data.js";
import { baseQuestions } from "./quiz.js";
import { PARTS, partLabel } from "./parts.js";

/* Pure exercise generator: turns the existing anatomy data into
   Duolingo-style exercises, so lessons always match the encyclopedia. */

// quiz.js questions, by index, belong to these systems
const QUIZ_SYSTEM = ["circulatory", "skeletal", "respiratory", "nervous", "skeletal", "endocrine", "integumentary", "skeletal", "urinary", "nervous"];

export const clean = (s) => String(s).replace(/\*\*/g, "").replace(/\s+/g, " ").trim();

export function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
}

export function shorten(text, max) {
    const s = clean(text);
    if (s.length <= max) return s;
    const cut = s.slice(0, max).replace(/[\s,;:(—-]+\S*$/, "");
    return cut + "…";
}

const titleOf = (lang, key) => getSystem(lang, key).title.replace(/^\d+\.\s*/, "");

export function parseOrgans(lang, key) {
    return getSystem(lang, key).organs.map((line) => {
        const i = line.indexOf(":");
        if (i < 1 || i > 70) return null;
        return { name: clean(line.slice(0, i)), desc: clean(line.slice(i + 1)) };
    }).filter(Boolean);
}

function withOptions(correct, wrongPool, n = 4) {
    const wrong = shuffle(wrongPool.filter((x) => x !== correct)).slice(0, n - 1);
    const options = shuffle([correct, ...wrong]);
    return { options, answer: options.indexOf(correct) };
}

export function buildExercises(lang, key, { webgl = true } = {}) {
    const bs = lang === "bs";
    const sys = getSystem(lang, key);
    const others = systemOrder.filter((k) => k !== key);
    const title = titleOf(lang, key);
    const allTitles = systemOrder.map((k) => titleOf(lang, k));
    const organs = parseOrgans(lang, key);
    const list = [];

    // --- 3D / structure identification --------------------------------
    const partKeys = shuffle(Object.keys(PARTS[key] || {}));
    const identify = (pk) => webgl
        ? { type: "identify", system: key, part: pk, label: partLabel(key, pk, lang) }
        : (() => {
            const foreign = others.flatMap((k) => Object.keys(PARTS[k]).map((p) => partLabel(k, p, lang)));
            const right = partLabel(key, pk, lang);
            const o = withOptions(right, foreign);
            return { type: "mcq", q: bs ? `Koja struktura pripada sistemu: ${title}?` : `Which structure belongs to the ${title}?`, ...o, explain: "" };
        })();

    // --- "which system is this?" questions ----------------------------
    const sysQ = (text) => {
        const o = withOptions(title, allTitles);
        return { type: "mcq", q: (bs ? "Koji sistem opisuje ova tvrdnja?\n" : "Which system does this describe?\n") + shorten(text, 150), ...o, explain: title };
    };
    const fns = sys.functions || [];

    // --- cell question -------------------------------------------------
    const cellPool = systemOrder.map((k) => getSystem(lang, k).cellType);
    const cell = withOptions(sys.cellType, cellPool);
    const cellEx = { type: "mcq", q: bs ? `Koja je ključna ćelija za sistem: ${title}?` : `Which is the key cell type of the ${title}?`, ...cell, explain: sys.cellType };

    // --- true / false --------------------------------------------------
    const mine = organs.length ? organs[Math.floor(Math.random() * organs.length)] : null;
    const otherKey = shuffle(others)[0];
    const foreignOrgans = parseOrgans(lang, otherKey);
    const foreign = foreignOrgans.length ? foreignOrgans[Math.floor(Math.random() * foreignOrgans.length)] : null;
    const tfText = (name, sysTitle) => bs ? `„${name}“ pripada sistemu: ${sysTitle}.` : `“${name}” belongs to the ${sysTitle}.`;
    const tfTrue = mine && { type: "tf", q: tfText(mine.name, title), answer: true, explain: tfText(mine.name, title) };
    const tfFalse = foreign && { type: "tf", q: tfText(foreign.name, title), answer: false, explain: tfText(foreign.name, titleOf(lang, otherKey)) };

    // --- extra question from the quiz bank -----------------------------
    const bank = baseQuestions[lang].filter((_, i) => QUIZ_SYSTEM[i] === key);
    const bankEx = bank.length ? (() => {
        const b = bank[Math.floor(Math.random() * bank.length)];
        const right = b.a[b.c];
        const opts = shuffle(b.a);
        return { type: "mcq", q: b.q, options: opts, answer: opts.indexOf(right), explain: right };
    })() : null;

    // --- matching ------------------------------------------------------
    const pairs = shuffle(organs).slice(0, 4).map((o) => [o.name, shorten(o.desc, 72)]);
    const matchEx = pairs.length >= 3 ? { type: "match", pairs } : null;

    // assemble in an interesting order
    const seq = [
        identify(partKeys[0]),
        fns[0] && sysQ(fns[0]),
        matchEx,
        identify(partKeys[1]),
        tfTrue,
        cellEx,
        identify(partKeys[2] || partKeys[0]),
        tfFalse,
        bankEx || (fns[1] && sysQ(fns[1]))
    ].filter(Boolean);
    if (seq.length < 9 && fns[1]) seq.splice(6, 0, sysQ(fns[1]));
    return seq.slice(0, 10);
}
