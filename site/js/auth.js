/* ------------------------------------------------------------------
   Accounts (front-end only).
   Accounts and progress live in this browser's localStorage, so they do
   NOT follow the learner to another device and cannot be recovered if
   the password is forgotten. Passwords are never stored in plain text
   (PBKDF2-SHA256 + random salt), but this is NOT server-grade security.

   To move to real cloud accounts later (Supabase / Firebase), replace
   the bodies of the exported functions below; app.js only talks to this
   module, so nothing else needs to change.
------------------------------------------------------------------- */
const USERS_KEY = "ae-users-v1";
const SESSION_KEY = "ae-session-v1";
const GUEST_KEY = "ae-progress-v2";
const ITERATIONS = 150000;

export const AVATARS = ["🫀", "🧠", "🫁", "🦴", "🧬", "🔬", "🩺", "⚡"];

let memoryUsers = {};
let memorySession = null;
let failedLogins = 0;
let lockedUntil = 0;

function lsGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function lsSet(key, value) { try { localStorage.setItem(key, value); return true; } catch (e) { return false; } }
function lsRemove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }

export function storageOk() {
    try { localStorage.setItem("ae-test", "1"); localStorage.removeItem("ae-test"); return true; } catch (e) { return false; }
}

function readUsers() {
    const raw = lsGet(USERS_KEY);
    if (raw === null) return memoryUsers;
    try { return JSON.parse(raw) || {}; } catch (e) { return {}; }
}
function writeUsers(users) {
    memoryUsers = users;
    lsSet(USERS_KEY, JSON.stringify(users));
}

const enc = new TextEncoder();
const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (hex) => new Uint8Array(hex.match(/../g).map((h) => parseInt(h, 16)));

async function hashPassword(password, saltHex) {
    if (!window.crypto || !crypto.subtle) throw new Error("noCrypto");
    const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: fromHex(saltHex), iterations: ITERATIONS, hash: "SHA-256" }, key, 256);
    return toHex(bits);
}

function newSalt() { return toHex(crypto.getRandomValues(new Uint8Array(16))); }

function sameHash(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

function normalise(name) { return String(name || "").trim().toLowerCase(); }

export function validateName(name) {
    const n = String(name || "").trim();
    return /^[\p{L}\p{N}_.-]{3,20}$/u.test(n);
}

function emptyProgress() {
    return { xp: 0, dailyXP: 0, dailyDate: "", completed: [], streak: 0, lastStudy: "", bestScore: 0 };
}

/* ------------------------------ session ---------------------------- */
export function currentUser() {
    const id = lsGet(SESSION_KEY) || memorySession;
    if (!id) return null;
    const u = readUsers()[id];
    return u ? { id: u.id, name: u.name, avatar: u.avatar, created: u.created } : null;
}

export async function signUp({ name, password, avatar, keepGuestProgress }) {
    if (!validateName(name)) return { error: "nameInvalid" };
    if (String(password || "").length < 8) return { error: "passShort" };
    const users = readUsers();
    const id = normalise(name);
    if (users[id]) return { error: "nameTaken" };
    let salt, hash;
    try { salt = newSalt(); hash = await hashPassword(password, salt); } catch (e) { return { error: "noCrypto" }; }
    let progress = emptyProgress();
    if (keepGuestProgress) {
        try { progress = { ...progress, ...(JSON.parse(lsGet(GUEST_KEY) || "null") || {}) }; } catch (e) { /* ignore */ }
    }
    users[id] = { id, name: String(name).trim(), avatar: AVATARS.includes(avatar) ? avatar : AVATARS[0], salt, hash, created: Date.now(), progress };
    writeUsers(users);
    memorySession = id;
    lsSet(SESSION_KEY, id);
    return { user: currentUser() };
}

export async function logIn(name, password) {
    if (Date.now() < lockedUntil) return { error: "locked", wait: Math.ceil((lockedUntil - Date.now()) / 1000) };
    const users = readUsers();
    const u = users[normalise(name)];
    let ok = false;
    try {
        if (u) ok = sameHash(await hashPassword(password, u.salt), u.hash);
        else await hashPassword(password, newSalt()); // keep timing similar for unknown names
    } catch (e) { return { error: "noCrypto" }; }
    if (!ok) {
        failedLogins += 1;
        if (failedLogins >= 5) { lockedUntil = Date.now() + 15000; failedLogins = 0; }
        return { error: "badLogin" };
    }
    failedLogins = 0;
    memorySession = u.id;
    lsSet(SESSION_KEY, u.id);
    return { user: currentUser() };
}

export function logOut() {
    memorySession = null;
    lsRemove(SESSION_KEY);
}

export async function deleteAccount(password) {
    const u = readUsers()[(currentUser() || {}).id];
    if (!u) return { error: "badLogin" };
    try { if (!sameHash(await hashPassword(password, u.salt), u.hash)) return { error: "badLogin" }; } catch (e) { return { error: "noCrypto" }; }
    const users = readUsers();
    delete users[u.id];
    writeUsers(users);
    logOut();
    return { ok: true };
}

/* ------------------------------ progress --------------------------- */
export function loadProgress() {
    const me = currentUser();
    if (me) {
        const u = readUsers()[me.id];
        return { ...emptyProgress(), ...(u.progress || {}) };
    }
    try { return { ...emptyProgress(), ...(JSON.parse(lsGet(GUEST_KEY) || "null") || {}) }; } catch (e) { return emptyProgress(); }
}

export function saveProgress(progress) {
    const me = currentUser();
    if (me) {
        const users = readUsers();
        if (users[me.id]) { users[me.id].progress = progress; writeUsers(users); }
        return;
    }
    lsSet(GUEST_KEY, JSON.stringify(progress));
}

export function resetProgress() {
    const fresh = emptyProgress();
    saveProgress(fresh);
    return fresh;
}

/* Leaderboard of accounts created on this device (handy on shared school computers). */
export function leaderboard(limit = 5) {
    return Object.values(readUsers())
        .map((u) => ({ id: u.id, name: u.name, avatar: u.avatar, xp: (u.progress && u.progress.xp) || 0, lessons: ((u.progress && u.progress.completed) || []).length }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, limit);
}
