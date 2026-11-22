import * as THREE from "three";

/* ------------------------------------------------------------------
   Procedural 3D anatomy models (no external model files needed).
   Every pickable part carries userData.part = <key>; PARTS holds the
   bilingual label for each key: [bs, en].
------------------------------------------------------------------- */
import { PARTS, partLabel } from "./parts.js";
export { PARTS, partLabel };

/* ------------------------------ helpers ---------------------------- */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: o.ei ?? 0.2,
    roughness: o.r ?? 0.38,
    metalness: o.m ?? 0.1,
    transparent: o.op != null,
    opacity: o.op ?? 1,
    depthWrite: o.op == null || o.op > 0.6
});

function ell(rx, ry, rz, m, seg = 36) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, seg, Math.round(seg * 0.75)), m);
    mesh.scale.set(rx, ry, rz);
    return mesh;
}

function tube(points, r, m, seg = 64, rad = 12) {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.Mesh(new THREE.TubeGeometry(curve, seg, r, rad, false), m);
}

function cyl(r, h, m, seg = 24) {
    return new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m);
}

function bumpy(radius, amp, freq, seed, m) {
    const geo = new THREE.SphereGeometry(radius, 56, 42);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const n = v.clone().normalize();
        const w = Math.sin(n.x * freq + seed) * Math.cos(n.y * freq * 1.3 + seed * 2) + Math.sin(n.z * freq * 1.7 + seed * 3) * 0.5;
        v.copy(n).multiplyScalar(radius + amp * w);
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, m);
}

function tag(obj, key) {
    obj.traverse((o) => { o.userData.part = key; });
    return obj;
}

function mirrorX(obj) {
    const c = obj.clone();
    c.position.x *= -1;
    c.rotation.z *= -1;
    return c;
}

/* ------------------------------ builders --------------------------- */
// each builder returns { group, tick(t) }

function buildCirculatory() {
    const g = new THREE.Group();
    const heart = new THREE.Group();
    const mh = mat(0xff4d6d, { ei: 0.32 });
    const lv = ell(0.9, 1.15, 0.8, mh); lv.position.set(0.15, -0.1, 0); lv.rotation.z = -0.35;
    const rv = ell(0.75, 0.95, 0.7, mh); rv.position.set(-0.55, -0.05, 0.25); rv.rotation.z = 0.25;
    const la = ell(0.5, 0.45, 0.45, mh); la.position.set(0.55, 0.95, -0.25);
    const ra = ell(0.5, 0.5, 0.45, mh); ra.position.set(-0.8, 0.85, 0.1);
    heart.add(lv, rv, la, ra);
    g.add(tag(heart, "heart"));
    g.add(tag(tube([[0.25, 0.9, 0], [0.25, 1.7, 0], [-0.1, 2.2, -0.1], [-0.6, 1.9, -0.1], [-0.7, 1.2, -0.2], [-0.7, 0, -0.35], [-0.7, -1.5, -0.35]], 0.16, mat(0xff8a8a)), "aorta"));
    const mv = mat(0x4d7cff);
    g.add(tag(tube([[-1.05, 2.1, 0], [-1.0, 1.3, 0.05], [-0.85, 0.9, 0.1]], 0.14, mv), "venaCava"));
    g.add(tag(tube([[-0.85, -0.6, 0.1], [-0.95, -1.3, 0.05], [-1.0, -2.1, 0]], 0.14, mv), "venaCava"));
    const mp = mat(0xb06bff);
    g.add(tag(tube([[-0.45, 0.9, 0.4], [-0.3, 1.5, 0.45], [0.5, 1.95, 0.25]], 0.12, mp), "pulmonaryArtery"));
    g.add(tag(tube([[-0.3, 1.5, 0.45], [-0.9, 1.9, 0.35]], 0.11, mp), "pulmonaryArtery"));
    return { group: g, tick: (t) => { const s = 1 + 0.07 * Math.pow(Math.max(0, Math.sin(t * 5)), 3); heart.scale.setScalar(s); } };
}

function buildRespiratory() {
    const g = new THREE.Group();
    const mt = mat(0x3ee0c5);
    const tr = cyl(0.17, 1.5, mt); tr.position.y = 1.55;
    const trachea = new THREE.Group(); trachea.add(tr);
    for (let i = 0; i < 7; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.035, 8, 24), mt);
        ring.rotation.x = Math.PI / 2; ring.position.y = 0.95 + i * 0.2; trachea.add(ring);
    }
    g.add(tag(trachea, "trachea"));
    const mb = mat(0x5cf0ff);
    g.add(tag(tube([[0, 0.85, 0], [-0.4, 0.4, 0], [-0.8, -0.1, 0]], 0.11, mb), "bronchi"));
    g.add(tag(tube([[0, 0.85, 0], [0.4, 0.4, 0], [0.8, -0.1, 0]], 0.11, mb), "bronchi"));
    g.add(tag(tube([[-0.5, 0.25, 0], [-0.8, 0.6, 0.15]], 0.07, mb), "bronchi"));
    g.add(tag(tube([[0.5, 0.25, 0], [0.8, 0.6, 0.15]], 0.07, mb), "bronchi"));
    g.add(tag(tube([[-0.8, -0.1, 0], [-1.0, -0.7, 0.1]], 0.07, mb), "bronchi"));
    g.add(tag(tube([[0.8, -0.1, 0], [1.0, -0.7, 0.1]], 0.07, mb), "bronchi"));
    const ml = mat(0xff9ab0, { op: 0.62, ei: 0.15 });
    const lungs = new THREE.Group();
    const lr = ell(0.95, 1.35, 0.7, ml); lr.position.set(-1.1, -0.1, 0);
    const ll = ell(0.85, 1.3, 0.65, ml); ll.position.set(1.1, -0.1, 0);
    lungs.add(lr, ll);
    g.add(tag(lungs, "lung"));
    const dia = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.12, 48), mat(0xffb020));
    dia.scale.z = 0.55; dia.position.y = -1.7;
    g.add(tag(dia, "diaphragm"));
    return { group: g, tick: (t) => { const s = 1 + 0.06 * Math.sin(t * 1.6); lungs.scale.set(s, s, s); dia.position.y = -1.7 + 0.12 * Math.sin(t * 1.6 - 0.4); } };
}

function buildDigestive() {
    const g = new THREE.Group();
    g.add(tag(tube([[0, 2.5, 0], [0, 1.6, 0], [0.15, 0.95, 0]], 0.13, mat(0xffb08a)), "esophagus"));
    const st = ell(0.72, 0.5, 0.5, mat(0xff7a59)); st.position.set(0.4, 0.55, 0.1); st.rotation.z = 0.5;
    g.add(tag(st, "stomach"));
    const lv = ell(1.05, 0.55, 0.6, mat(0x8b3a2a, { ei: 0.3 })); lv.position.set(-0.8, 0.8, 0); lv.rotation.z = 0.12;
    g.add(tag(lv, "liver"));
    const pts = [];
    for (let i = 0; i < 9; i++) {
        const y = 0.1 - i * 0.17;
        pts.push([i % 2 ? 0.62 : -0.62, y, 0.1], [i % 2 ? -0.62 : 0.62, y - 0.085, 0.1]);
    }
    const small = tube(pts, 0.12, mat(0xffcf5a), 220, 10);
    g.add(tag(small, "smallIntestine"));
    g.add(tag(tube([[0.95, -1.6, 0], [1.0, -0.1, 0], [0.9, 0.3, 0], [0, 0.3, 0], [-0.9, 0.3, 0], [-1.0, -0.1, 0], [-0.95, -1.6, 0]], 0.2, mat(0xc77d3a), 100), "largeIntestine"));
    return { group: g, tick: (t) => { small.scale.y = 1 + 0.03 * Math.sin(t * 3); } };
}

function buildNervous() {
    const g = new THREE.Group();
    const mc = mat(0xc9a7ff, { ei: 0.25, r: 0.5 });
    const cerebrum = new THREE.Group();
    const h1 = bumpy(0.85, 0.07, 9, 1.3, mc); h1.scale.set(0.9, 0.8, 1.15); h1.position.set(-0.46, 0.25, 0);
    const h2 = bumpy(0.85, 0.07, 9, 2.1, mc); h2.scale.set(0.9, 0.8, 1.15); h2.position.set(0.46, 0.25, 0);
    cerebrum.add(h1, h2);
    g.add(tag(cerebrum, "cerebrum"));
    const cb = bumpy(0.45, 0.04, 14, 4, mat(0x7c5cff)); cb.scale.set(1.3, 0.7, 0.9); cb.position.set(0, -0.45, -0.75);
    g.add(tag(cb, "cerebellum"));
    const cord = tube([[0, -0.45, -0.2], [0, -1.0, -0.35], [0, -2.0, -0.45], [0, -3.1, -0.4]], 0.1, mat(0xffe08a), 60);
    g.add(tag(cord, "spinalCord"));
    const mn = mat(0x5cf0ff, { ei: 0.4 });
    [-1.0, -1.6, -2.2, -2.8].forEach((y, i) => {
        [-1, 1].forEach((s) => {
            g.add(tag(tube([[0, y, -0.4], [s * 0.5, y - 0.1, -0.35], [s * 1.0, y - 0.45 - i * 0.05, -0.2], [s * 1.35, y - 0.9, 0]], 0.035, mn, 24, 6), "nerves"));
        });
    });
    return { group: g, tick: (t) => { cerebrum.scale.setScalar(1 + 0.015 * Math.sin(t * 2)); mn.emissiveIntensity = 0.4 + 0.25 * Math.sin(t * 4); } };
}

function buildSkeletal() {
    const g = new THREE.Group();
    const skull = new THREE.Group();
    const s1 = ell(0.78, 0.86, 0.85, mat(0xf1ede0, { ei: 0.18 })); s1.position.y = 2.3;
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.22, 0.5), mat(0xf1ede0, { ei: 0.18 })); jaw.position.set(0, 1.62, 0.3);
    const eyeM = mat(0x1a1a24, { ei: 0.02 });
    const e1 = ell(0.16, 0.16, 0.1, eyeM); e1.position.set(-0.28, 2.25, 0.78);
    const e2 = ell(0.16, 0.16, 0.1, eyeM); e2.position.set(0.28, 2.25, 0.78);
    skull.add(s1, jaw, e1, e2);
    g.add(tag(skull, "skull"));
    const ms = mat(0xd8d2bf, { ei: 0.15 });
    const spine = new THREE.Group();
    for (let i = 0; i < 13; i++) {
        const v = cyl(0.19 - i * 0.004, 0.17, ms, 16);
        const y = 1.35 - i * 0.2;
        v.position.set(0, y, -0.2 + 0.18 * Math.sin(i * 0.55));
        spine.add(v);
    }
    g.add(tag(spine, "spine"));
    const mr = mat(0xe8e0cc, { ei: 0.15 });
    const ribs = new THREE.Group();
    for (let i = 0; i < 7; i++) {
        const r = 0.62 + Math.sin((i + 0.6) / 7 * Math.PI) * 0.42;
        const rib = new THREE.Mesh(new THREE.TorusGeometry(r, 0.045, 8, 40, Math.PI * 1.6), mr);
        rib.rotation.set(Math.PI / 2, 0, Math.PI * 0.2 + Math.PI * 0.5);
        rib.scale.set(1, 0.8, 1);
        rib.position.set(0, 1.1 - i * 0.2, 0.05);
        ribs.add(rib);
    }
    const stern = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.07), mr); stern.position.set(0, 0.6, 0.85);
    ribs.add(stern);
    g.add(tag(ribs, "ribs"));
    const mp = mat(0xcfc7b0, { ei: 0.15 });
    const pelvis = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.16, 12, 32), mp); ring.rotation.x = Math.PI / 2; ring.scale.set(1, 0.8, 1); ring.position.y = -1.45;
    const w1 = ell(0.5, 0.45, 0.14, mp); w1.position.set(-0.75, -1.25, 0); w1.rotation.z = 0.5;
    const w2 = ell(0.5, 0.45, 0.14, mp); w2.position.set(0.75, -1.25, 0); w2.rotation.z = -0.5;
    pelvis.add(ring, w1, w2);
    g.add(tag(pelvis, "pelvis"));
    const mf = mat(0xf3f0e6, { ei: 0.2 });
    [-0.62, 0.62].forEach((x) => {
        const f = new THREE.Group();
        const shaft = cyl(0.12, 2.2, mf, 16); shaft.position.y = -2.7;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 16), mf); head.position.set(x > 0 ? -0.15 : 0.15, -1.7, 0);
        const knee = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), mf); knee.position.y = -3.8;
        f.add(shaft, head, knee); f.position.x = x * 0.9; g.add(tag(f, "femur"));
    });
    return { group: g, tick: () => {} };
}

function buildMuscular() {
    const g = new THREE.Group();
    const mb = mat(0xf1ede0, { ei: 0.15 });
    const bone = new THREE.Group();
    const hum = cyl(0.13, 3.4, mb, 16); hum.position.y = 0;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 16), mb); head.position.y = 1.7;
    const r1 = cyl(0.08, 1.7, mb, 12); r1.position.set(-0.08, -2.5, 0.05); r1.rotation.z = 0.04;
    const r2 = cyl(0.07, 1.7, mb, 12); r2.position.set(0.1, -2.5, -0.05);
    bone.add(hum, head, r1, r2);
    g.add(tag(bone, "bone"));
    const belly = (len, r) => {
        const pts = [];
        for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new THREE.Vector2(Math.max(0.001, r * Math.pow(Math.sin(Math.PI * t), 0.75)), (t - 0.5) * len)); }
        return new THREE.LatheGeometry(pts, 28);
    };
    const biceps = new THREE.Mesh(belly(1.9, 0.4), mat(0xd1495b, { ei: 0.3, r: 0.45 })); biceps.position.set(0, 0.35, 0.34);
    const triceps = new THREE.Mesh(belly(1.9, 0.38), mat(0x9b2f48, { ei: 0.25, r: 0.45 })); triceps.position.set(0, 0.35, -0.34);
    g.add(tag(biceps, "biceps"), tag(triceps, "triceps"));
    const mt = mat(0xf7f7f7, { ei: 0.3 });
    const tendons = new THREE.Group();
    const t1 = cyl(0.07, 0.75, mt, 12); t1.position.set(0, 1.62, 0.3);
    const t2 = cyl(0.07, 0.65, mt, 12); t2.position.set(0, -1.0, 0.25);
    const t3 = cyl(0.07, 0.65, mt, 12); t3.position.set(0, -1.0, -0.28);
    tendons.add(t1, t2, t3);
    g.add(tag(tendons, "tendon"));
    return { group: g, tick: (t) => { const s = 0.5 + 0.5 * Math.sin(t * 1.6); biceps.scale.set(1 + 0.28 * s, 1 - 0.1 * s, 1 + 0.28 * s); triceps.scale.set(1 - 0.12 * s, 1 + 0.04 * s, 1 - 0.12 * s); } };
}

function buildIntegumentary() {
    const g = new THREE.Group();
    const epi = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 2.2), mat(0xf2c9a0)); epi.position.y = 1.1;
    const derm = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.85, 2.2), mat(0xe08e6d)); derm.position.y = 0.58;
    const hypo = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.95, 2.2), mat(0xffd36b)); hypo.position.y = -0.38;
    g.add(tag(epi, "epidermis"), tag(derm, "dermis"), tag(hypo, "hypodermis"));
    const mh = mat(0x3b2a20, { ei: 0.1 });
    const hair = new THREE.Group();
    const shaft = cyl(0.04, 1.5, mh, 10); shaft.position.set(-0.7, 1.75, 0.3);
    const inFol = cyl(0.04, 0.9, mh, 10); inFol.position.set(-0.7, 0.75, 0.3);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), mh); bulb.position.set(-0.7, 0.28, 0.3);
    hair.add(shaft, inFol, bulb);
    g.add(tag(hair, "hair"));
    const ms = mat(0x4dd0e1, { ei: 0.35 });
    const pts = [];
    for (let i = 0; i <= 28; i++) { const a = i / 28 * Math.PI * 7; pts.push([0.8 + Math.cos(a) * 0.15, -0.05 + i * 0.012 + Math.sin(a) * 0.12, 0.2 + Math.sin(a) * 0.15]); }
    const gland = new THREE.Group();
    gland.add(tube(pts, 0.04, ms, 120, 8));
    gland.add(tube([[0.8, 0.3, 0.2], [0.85, 0.8, 0.2], [0.8, 1.2, 0.2]], 0.035, ms, 20, 8));
    g.add(tag(gland, "sweatGland"));
    g.rotation.x = 0.1;
    return { group: g, tick: () => {} };
}

function buildImmune() {
    const g = new THREE.Group();
    const node = new THREE.Group();
    const mn = mat(0x7bd88f, { ei: 0.28 });
    const body = ell(0.95, 0.62, 0.62, mn); body.rotation.z = 0.2;
    node.add(body);
    const mv = mat(0x9be7ff, { ei: 0.3 });
    node.add(tube([[-2.0, 0.9, 0], [-1.3, 0.55, 0], [-0.8, 0.25, 0]], 0.08, mv, 20, 8));
    node.add(tube([[-2.0, -0.6, 0.2], [-1.3, -0.4, 0.1], [-0.85, -0.15, 0.1]], 0.08, mv, 20, 8));
    node.add(tube([[0.85, 0.05, 0], [1.4, 0.2, 0], [2.0, 0.6, 0]], 0.1, mv, 20, 8));
    g.add(tag(node, "lymphNode"));
    const wbcs = new THREE.Group();
    const mw = mat(0xeef2ff, { ei: 0.25, r: 0.5 });
    for (let i = 0; i < 4; i++) {
        const c = bumpy(0.3, 0.05, 8, i * 1.7, mw); c.userData.a = i / 4 * Math.PI * 2;
        const nuc = ell(0.14, 0.14, 0.14, mat(0x6d5cff)); c.add(nuc);
        wbcs.add(c);
    }
    g.add(tag(wbcs, "leukocyte"));
    const abs = new THREE.Group();
    const ma = mat(0xffb020, { ei: 0.4 });
    for (let i = 0; i < 7; i++) {
        const y = new THREE.Group();
        const stem = cyl(0.025, 0.2, ma, 8); stem.position.y = -0.1;
        const a1 = cyl(0.025, 0.2, ma, 8); a1.position.set(-0.07, 0.07, 0); a1.rotation.z = 0.6;
        const a2 = cyl(0.025, 0.2, ma, 8); a2.position.set(0.07, 0.07, 0); a2.rotation.z = -0.6;
        y.add(stem, a1, a2); y.scale.setScalar(1.3); y.userData.a = i / 7 * Math.PI * 2; abs.add(y);
    }
    g.add(tag(abs, "antibody"));
    const path = new THREE.Group();
    const mp = mat(0xff4d6d, { ei: 0.4 });
    for (let i = 0; i < 4; i++) {
        const v = ell(0.2, 0.2, 0.2, mp);
        for (let k = 0; k < 10; k++) {
            const sp = cyl(0.018, 0.2, mp, 6);
            const d = new THREE.Vector3(Math.sin(k * 2.4) * Math.cos(k), Math.cos(k * 1.9), Math.sin(k * 1.3)).normalize();
            sp.position.copy(d.clone().multiplyScalar(0.25)); sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d); v.add(sp);
        }
        v.scale.setScalar(1); v.userData.a = i; v.position.set(2.0 + i * 0.25, -1.4 + i * 0.5, i % 2 ? 0.4 : -0.4);
        path.add(v);
    }
    g.add(tag(path, "pathogen"));
    return {
        group: g,
        tick: (t) => {
            wbcs.children.forEach((c) => { const a = c.userData.a + t * 0.6; c.position.set(Math.cos(a) * 1.7, Math.sin(a * 1.3) * 0.7 - 0.5, Math.sin(a) * 1.2); });
            abs.children.forEach((c) => { const a = c.userData.a + t * 0.9; c.position.set(Math.cos(a) * 1.15, 1.2 + Math.sin(a * 2) * 0.25, Math.sin(a) * 1.1); c.rotation.z = a; });
            path.children.forEach((c, i) => { c.position.y += Math.sin(t * 1.5 + i) * 0.002; c.rotation.y = t * 0.5; });
        }
    };
}

function buildEndocrine() {
    const g = new THREE.Group();
    const ghost = mat(0x7aa7ff, { op: 0.1, ei: 0.5 });
    const head = ell(0.6, 0.7, 0.6, ghost); head.position.y = 2.35;
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.85, 2.0, 12, 24), ghost); torso.position.y = 0.4; torso.scale.z = 0.65;
    g.add(head, torso);
    const pit = ell(0.14, 0.14, 0.14, mat(0xff4d9a, { ei: 0.6 })); pit.position.set(0, 2.3, 0.25);
    g.add(tag(pit, "pituitary"));
    const mt = mat(0xffb020, { ei: 0.5 });
    const thy = new THREE.Group();
    const l1 = ell(0.12, 0.2, 0.1, mt); l1.position.set(-0.14, 1.5, 0.4);
    const l2 = ell(0.12, 0.2, 0.1, mt); l2.position.set(0.14, 1.5, 0.4);
    const is = ell(0.12, 0.05, 0.08, mt); is.position.set(0, 1.45, 0.4);
    thy.add(l1, l2, is);
    g.add(tag(thy, "thyroid"));
    const kidM = mat(0xe35d5b, { op: 0.28, ei: 0.3 });
    const ad = new THREE.Group();
    [-1, 1].forEach((s) => {
        const k = ell(0.2, 0.34, 0.16, kidM); k.position.set(s * 0.45, 0.2, -0.1); g.add(k);
        const a = ell(0.17, 0.1, 0.12, mat(0xc6ff4d, { ei: 0.6 })); a.position.set(s * 0.42, 0.62, -0.1); a.rotation.z = s * 0.4; ad.add(a);
    });
    g.add(tag(ad, "adrenals"));
    const pan = ell(0.62, 0.11, 0.14, mat(0x3ee0c5, { ei: 0.5 })); pan.position.set(0, 0.35, 0.15); pan.rotation.z = 0.15;
    g.add(tag(pan, "pancreas"));
    return { group: g, tick: (t) => { [pit, thy, ad, pan].forEach((o, i) => o.scale.setScalar(1 + 0.12 * Math.sin(t * 2.5 + i))); } };
}

function buildUrinary() {
    const g = new THREE.Group();
    const mk = mat(0xe35d5b, { ei: 0.3 });
    const kids = new THREE.Group();
    [-1, 1].forEach((s) => {
        const k = ell(0.48, 0.8, 0.36, mk); k.position.set(s * 1.05, 1.0, 0); k.rotation.z = s * -0.15;
        const hilum = ell(0.18, 0.28, 0.2, mat(0x7a1f2b)); hilum.position.set(s * 0.7, 1.0, 0);
        kids.add(k, hilum);
    });
    g.add(tag(kids, "kidney"));
    const mu = mat(0xffe08a, { ei: 0.4 });
    const ur = new THREE.Group();
    ur.add(tube([[-0.75, 0.9, 0], [-0.55, 0.2, 0], [-0.4, -0.7, 0], [-0.25, -1.4, 0]], 0.07, mu, 40, 8));
    ur.add(tube([[0.75, 0.9, 0], [0.55, 0.2, 0], [0.4, -0.7, 0], [0.25, -1.4, 0]], 0.07, mu, 40, 8));
    g.add(tag(ur, "ureter"));
    const bl = ell(0.62, 0.55, 0.55, mat(0xffd166, { op: 0.8, ei: 0.3 })); bl.position.y = -1.8;
    g.add(tag(bl, "bladder"));
    g.add(tag(tube([[0, -2.3, 0], [0, -2.8, 0.05], [0, -3.3, 0.1]], 0.1, mat(0xff9f6b)), "urethra"));
    return { group: g, tick: (t) => { bl.scale.set(0.62 + 0.04 * Math.sin(t), 0.55 + 0.05 * Math.sin(t), 0.55 + 0.04 * Math.sin(t)); } };
}

function buildReproductive() {
    const g = new THREE.Group();
    // egg cell with protective layer and nucleus
    const egg = new THREE.Group();
    egg.add(ell(0.8, 0.8, 0.8, mat(0xff9ad5, { ei: 0.3 })));
    egg.add(ell(0.28, 0.28, 0.28, mat(0xb03a7e, { ei: 0.4 })));
    egg.add(ell(1.0, 1.0, 1.0, mat(0xffd3ee, { op: 0.22, ei: 0.4 })));
    egg.position.set(-2.4, 0, 0);
    g.add(tag(egg, "ovum"));
    // sperm cells
    const sperm = new THREE.Group();
    const ms = mat(0x3ee0c5, { ei: 0.5 });
    const heads = [];
    for (let i = 0; i < 5; i++) {
        const s = new THREE.Group();
        const h = ell(0.13, 0.09, 0.09, ms); s.add(h);
        const pts = []; for (let k = 0; k <= 12; k++) pts.push([0.1 + k * 0.11, Math.sin(k * 0.8) * 0.06, 0]);
        s.add(tube(pts, 0.018, ms, 30, 6));
        s.position.set(-0.9 + (i % 2) * 0.2, (i - 2) * 0.42, ((i * 37) % 5 - 2) * 0.12); s.rotation.z = Math.PI + (i - 2) * 0.1;
        s.userData.base = s.position.clone();
        heads.push(s); sperm.add(s);
    }
    g.add(tag(sperm, "sperm"));
    // zygote: one cell with fused nucleus
    const zy = new THREE.Group();
    zy.add(ell(0.55, 0.55, 0.55, mat(0xe0b3ff, { ei: 0.3 })));
    zy.add(ell(0.2, 0.2, 0.2, mat(0x7c3aed, { ei: 0.5 })));
    zy.position.set(1.0, 0, 0);
    g.add(tag(zy, "zygote"));
    // early embryo: ball of cells
    const emb = new THREE.Group();
    const me = mat(0xffd27a, { ei: 0.35 });
    const dirs = [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [-1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1], [0, 0, 1.4], [0, 0, -1.4]];
    dirs.forEach((d) => { const c = ell(0.22, 0.22, 0.22, me); c.position.set(d[0] * 0.2, d[1] * 0.2, d[2] * 0.2); emb.add(c); });
    emb.position.set(2.9, 0, 0);
    g.add(tag(emb, "embryo"));
    return {
        group: g,
        tick: (t) => {
            heads.forEach((s, i) => { s.position.x = s.userData.base.x + 0.12 * Math.sin(t * 2 + i); s.rotation.z = Math.PI + (i - 2) * 0.1 + 0.08 * Math.sin(t * 4 + i); });
            egg.rotation.y = t * 0.3; emb.rotation.y = t * 0.5; emb.rotation.x = t * 0.3; zy.rotation.y = -t * 0.4;
        }
    };
}

const BUILDERS = {
    circulatory: buildCirculatory, respiratory: buildRespiratory, digestive: buildDigestive,
    nervous: buildNervous, skeletal: buildSkeletal, muscular: buildMuscular,
    integumentary: buildIntegumentary, immune: buildImmune, endocrine: buildEndocrine,
    urinary: buildUrinary, reproductive: buildReproductive
};

export function webglAvailable() {
    try {
        const c = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
}

/* ------------------------------ viewer ----------------------------- */
export function createViewer(container, opts = {}) {
    const o = { lang: "bs", labels: false, autoRotate: true, onPick: null, onHover: null, ...opts };
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.className = "viewer3d-canvas";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.2, 8.2);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    scene.add(new THREE.HemisphereLight(0xaaccff, 0x331133, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x3ee0c5, 1.6); rim.position.set(-5, 2, -4); scene.add(rim);
    const rim2 = new THREE.DirectionalLight(0xff4d9a, 1.0); rim2.position.set(4, -3, -3); scene.add(rim2);

    // floating particles for depth
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(160 * 3);
    for (let i = 0; i < 160; i++) { pPos[i * 3] = (Math.random() - 0.5) * 14; pPos[i * 3 + 1] = (Math.random() - 0.5) * 9; pPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2; }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x5eead4, size: 0.045, transparent: true, opacity: 0.55, depthWrite: false }));
    scene.add(particles);

    const pivot = new THREE.Group();
    scene.add(pivot);
    let current = null, tick = null, partMats = {}, pickables = [], systemKey = null;
    let hover = null, glow = null, flashes = {};
    let rotY = 0.4, rotX = 0.12, velY = 0, idleSince = 0;
    let visible = true, running = true, disposed = false;
    const clock = new THREE.Clock();
    const ray = new THREE.Raycaster();
    const tip = document.createElement("div");
    tip.className = "viewer3d-tip"; tip.hidden = true;
    container.appendChild(tip);

    function clearModel() {
        if (!current) return;
        pivot.remove(current);
        current.traverse((n) => {
            if (n.geometry) n.geometry.dispose();
            if (n.material) (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => m.dispose());
        });
        current = null; tick = null; partMats = {}; pickables = [];
    }

    function setSystem(sys) {
        clearModel();
        systemKey = sys;
        const build = BUILDERS[sys];
        if (!build) return;
        const built = build();
        const holder = new THREE.Group();
        holder.add(built.group);
        const box = new THREE.Box3().setFromObject(built.group);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        built.group.position.sub(center);
        holder.scale.setScalar(4.1 / Math.max(size.x, size.y * 1.15, size.z));
        pivot.add(holder);
        current = holder; tick = built.tick;
        built.group.traverse((n) => {
            if (n.isMesh && n.userData.part) {
                pickables.push(n);
                const k = n.userData.part;
                (partMats[k] = partMats[k] || new Set()).add(n.material);
                if (n.material.userData.base == null) n.material.userData.base = n.material.emissiveIntensity;
            }
        });
        hover = null; glow = null; flashes = {};
    }

    function applyEmissive() {
        const now = performance.now();
        Object.keys(partMats).forEach((k) => {
            partMats[k].forEach((m) => {
                let target = m.userData.base;
                if (glow === k) target += 0.55;
                if (hover === k) target += 0.35;
                const f = flashes[k];
                if (f && f.until > now) { m.emissive.setHex(f.color); target = 0.95; }
                else if (m.emissive.getHex() !== m.color.getHex()) m.emissive.copy(m.color);
                m.emissiveIntensity += (target - m.emissiveIntensity) * 0.2;
            });
        });
    }

    function resize() {
        const w = container.clientWidth || 300, h = container.clientHeight || 300;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize); ro.observe(container); resize();
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; }); io.observe(container);

    function pick(ev) {
        const r = renderer.domElement.getBoundingClientRect();
        ray.setFromCamera(new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1), camera);
        const hit = ray.intersectObjects(pickables, false)[0];
        return hit ? hit.object.userData.part : null;
    }

    let down = null, moved = 0;
    const el = renderer.domElement;
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", (e) => { down = { x: e.clientX, y: e.clientY, t: e.pointerType }; moved = 0; velY = 0; idleSince = performance.now(); el.setPointerCapture(e.pointerId); });
    el.addEventListener("pointermove", (e) => {
        if (down) {
            const dx = e.clientX - down.x, dy = e.clientY - down.y;
            moved += Math.abs(dx) + Math.abs(dy);
            rotY += dx * 0.011; velY = dx * 0.011;
            if (down.t !== "touch") rotX = Math.max(-0.9, Math.min(0.9, rotX + dy * 0.008));
            down.x = e.clientX; down.y = e.clientY; idleSince = performance.now();
        } else if (e.pointerType === "mouse") {
            const k = pick(e);
            if (k !== hover) { hover = k; if (o.onHover) o.onHover(k); }
            if (o.labels && k) { const r = container.getBoundingClientRect(); tip.textContent = partLabel(systemKey, k, o.lang); tip.style.left = e.clientX - r.left + 14 + "px"; tip.style.top = e.clientY - r.top + 14 + "px"; tip.hidden = false; }
            else tip.hidden = true;
            el.style.cursor = k ? "pointer" : "grab";
        }
    });
    el.addEventListener("pointerup", (e) => {
        if (down && moved < 6 && o.onPick) { const k = pick(e); if (k) o.onPick(k); }
        down = null;
    });
    el.addEventListener("pointerleave", () => { if (!down) { hover = null; tip.hidden = true; } });

    function frame() {
        if (disposed) return;
        requestAnimationFrame(frame);
        if (!visible || !running || !current) return;
        const t = clock.getElapsedTime();
        if (!down) {
            if (o.autoRotate && performance.now() - idleSince > 1500) rotY += 0.006;
            else { rotY += velY; velY *= 0.92; }
        }
        pivot.rotation.set(rotX, rotY, 0);
        current.position.y = Math.sin(t * 1.2) * 0.06;
        particles.rotation.y = t * 0.02;
        if (tick) tick(t);
        applyEmissive();
        renderer.render(scene, camera);
    }
    frame();

    return {
        setSystem,
        setLang(l) { o.lang = l; },
        setLabels(v) { o.labels = v; if (!v) tip.hidden = true; },
        parts: () => Object.keys(partMats),
        highlight(k) { glow = k; },
        flash(k, color = 0x22c55e, ms = 900) { flashes[k] = { color, until: performance.now() + ms }; },
        pause(v) { running = !v; },
        dispose() { disposed = true; ro.disconnect(); io.disconnect(); clearModel(); renderer.dispose(); renderer.domElement.remove(); tip.remove(); }
    };
}
