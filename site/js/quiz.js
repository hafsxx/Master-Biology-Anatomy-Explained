export const QUESTIONS_PER_ROUND = 10;
export const SECONDS_PER_QUESTION = 15;

const baseQuestions = {
    bs: [
        { q: "Koja je glavna uloga eritrocita u cirkulatornom sistemu?", a: ["Transport kisika", "Odbrana od virusa", "Grušanje krvi", "Sinteza hormona"], c: 0 },
        { q: "Koji organ štiti mozak od fizičkih povreda?", a: ["Lobanja (skeletni sistem)", "Kičmena moždina", "Rebra", "Grkljan"], c: 0 },
        { q: "Gdje se odvija razmjena plinova u respiratornom sistemu?", a: ["Alveole", "Traheja", "Bronhije", "Nosna šupljina"], c: 0 },
        { q: "Koji je osnovni gradivni element nervnog sistema?", a: ["Neuron", "Osteocit", "Enterocit", "Podocit"], c: 0 },
        { q: "Koja je funkcija osteocita?", a: ["Održavanje koštanog tkiva", "Pumpanje krvi", "Filtracija urina", "Probava hrane"], c: 0 },
        { q: "Koji hormon proizvode beta-ćelije gušterače?", a: ["Insulin", "Adrenalin", "Tiroksin", "Testosteron"], c: 0 },
        { q: "Koji je najveći organ u ljudskom tijelu?", a: ["Koža", "Jetra", "Mozak", "Pluća"], c: 0 },
        { q: "Koliko kostiju ima odrasli čovjek?", a: ["206", "300", "150", "208"], c: 0 },
        { q: "Šta je glavni zadatak bubrega?", a: ["Filtracija krvi i stvaranje urina", "Sinteza eritrocita", "Razgradnja masti", "Pumpanje krvi"], c: 0 },
        { q: "Koji dio neurona prima signale od drugih ćelija?", a: ["Dendrit", "Akson", "Mijelinski omotač", "Sinapsa"], c: 0 }
    ],
    en: [
        { q: "What is the primary role of red blood cells in the circulatory system?", a: ["Oxygen transport", "Immune defense", "Blood clotting", "Hormone synthesis"], c: 0 },
        { q: "Which organ protects the brain from physical injury?", a: ["Skull (skeletal system)", "Spinal cord", "Ribs", "Larynx"], c: 0 },
        { q: "Where does gas exchange take place in the respiratory system?", a: ["Alveoli", "Trachea", "Bronchi", "Nasal cavity"], c: 0 },
        { q: "What is the primary structural unit of the nervous system?", a: ["Neuron", "Osteocyte", "Enterocyte", "Podocyte"], c: 0 },
        { q: "What is the main function of an osteocyte?", a: ["Maintaining bone tissue", "Pumping blood", "Urine filtration", "Food digestion"], c: 0 },
        { q: "Which hormone is produced by pancreatic beta cells?", a: ["Insulin", "Adrenaline", "Thyroxine", "Testosterone"], c: 0 },
        { q: "What is the largest organ in the human body?", a: ["Skin", "Liver", "Brain", "Lungs"], c: 0 },
        { q: "How many bones are in the adult human skeleton?", a: ["206", "300", "150", "208"], c: 0 },
        { q: "What is the main function of the kidneys?", a: ["Filtering blood and producing urine", "Erythrocyte synthesis", "Fat digestion", "Pumping blood"], c: 0 },
        { q: "Which part of a neuron receives incoming signals?", a: ["Dendrite", "Axon", "Myelin sheath", "Synapse"], c: 0 }
    ]
};

function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[k]] = [copy[k], copy[i]];
    }
    return copy;
}

function shuffleQuestion(item) {
    const answers = [...item.a];
    const correct = answers[item.c];
    const shuffled = shuffle(answers);
    return { q: item.q, a: shuffled, c: shuffled.indexOf(correct) };
}

export function buildRound(lang) {
    return shuffle(baseQuestions[lang]).map(shuffleQuestion);
}

export function pointsFor(secondsLeft) {
    return 500 + secondsLeft * 35;
}
