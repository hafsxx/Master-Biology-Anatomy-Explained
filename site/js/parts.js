/* Bilingual labels for every pickable 3D part: [bs, en]. Pure data, no three.js. */
export const PARTS = {
    circulatory: {
        heart: ["Srce", "Heart"],
        aorta: ["Aorta", "Aorta"],
        venaCava: ["Šuplja vena", "Vena cava"],
        pulmonaryArtery: ["Plućna arterija", "Pulmonary artery"]
    },
    respiratory: {
        trachea: ["Dušnik", "Trachea"],
        bronchi: ["Bronhije", "Bronchi"],
        lung: ["Pluća", "Lungs"],
        diaphragm: ["Dijafragma", "Diaphragm"]
    },
    digestive: {
        esophagus: ["Jednjak", "Esophagus"],
        stomach: ["Želudac", "Stomach"],
        liver: ["Jetra", "Liver"],
        smallIntestine: ["Tanko crijevo", "Small intestine"],
        largeIntestine: ["Debelo crijevo", "Large intestine"]
    },
    nervous: {
        cerebrum: ["Veliki mozak", "Cerebrum"],
        cerebellum: ["Mali mozak", "Cerebellum"],
        spinalCord: ["Kičmena moždina", "Spinal cord"],
        nerves: ["Periferni živci", "Peripheral nerves"]
    },
    skeletal: {
        skull: ["Lobanja", "Skull"],
        spine: ["Kičma", "Spine"],
        ribs: ["Rebra", "Ribs"],
        pelvis: ["Karlica", "Pelvis"],
        femur: ["Bedrena kost", "Femur"]
    },
    muscular: {
        biceps: ["Biceps", "Biceps"],
        triceps: ["Triceps", "Triceps"],
        tendon: ["Tetiva", "Tendon"],
        bone: ["Kost", "Bone"]
    },
    integumentary: {
        epidermis: ["Epiderm", "Epidermis"],
        dermis: ["Derm", "Dermis"],
        hypodermis: ["Potkožno tkivo", "Hypodermis"],
        hair: ["Dlaka", "Hair follicle"],
        sweatGland: ["Znojna žlijezda", "Sweat gland"]
    },
    immune: {
        lymphNode: ["Limfni čvor", "Lymph node"],
        leukocyte: ["Bijelo krvno zrnce", "White blood cell"],
        antibody: ["Antitijelo", "Antibody"],
        pathogen: ["Patogen", "Pathogen"]
    },
    endocrine: {
        pituitary: ["Hipofiza", "Pituitary gland"],
        thyroid: ["Štitnjača", "Thyroid gland"],
        adrenals: ["Nadbubrežne žlijezde", "Adrenal glands"],
        pancreas: ["Gušterača", "Pancreas"]
    },
    urinary: {
        kidney: ["Bubreg", "Kidney"],
        ureter: ["Mokraćovod", "Ureter"],
        bladder: ["Mokraćna bešika", "Urinary bladder"],
        urethra: ["Mokraćna cijev", "Urethra"]
    },
    reproductive: {
        ovum: ["Jajna ćelija", "Egg cell (ovum)"],
        sperm: ["Spermatozoid", "Sperm cell"],
        zygote: ["Zigota", "Zygote"],
        embryo: ["Rani embrion", "Early embryo"]
    }
};

export function partLabel(system, part, lang) {
    const entry = PARTS[system] && PARTS[system][part];
    return entry ? entry[lang === "bs" ? 0 : 1] : part;
}
