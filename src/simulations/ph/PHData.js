// ============================================================
// SciLab - pH Laboratory
// PHData.js
// ============================================================

export const PH_SOLUTIONS = [
    {
        id: "battery-acid",
        name: "Battery Acid",
        formula: "H₂SO₄",
        pH: 0.8,
        type: "acid",
        strength: "Strong Acid",
        description:
            "A very strong acidic solution. Handle with care.",
        color: 0xd94b4b
    },

    {
        id: "stomach-acid",
        name: "Stomach Acid",
        formula: "HCl",
        pH: 1.5,
        type: "acid",
        strength: "Strong Acid",
        description:
            "Hydrochloric acid is naturally present in the stomach.",
        color: 0xe85d5d
    },

    {
        id: "lemon-juice",
        name: "Lemon Juice",
        formula: "Citric Acid",
        pH: 2.2,
        type: "acid",
        strength: "Strong Acid",
        description:
            "Lemon juice contains citric acid and is acidic.",
        color: 0xf2e36b
    },

    {
        id: "vinegar",
        name: "Vinegar",
        formula: "CH₃COOH",
        pH: 2.8,
        type: "acid",
        strength: "Weak Acid",
        description:
            "Vinegar contains acetic acid.",
        color: 0xe8d99b
    },

    {
        id: "orange-juice",
        name: "Orange Juice",
        formula: "Citric Acid",
        pH: 3.5,
        type: "acid",
        strength: "Weak Acid",
        description:
            "Orange juice contains organic acids.",
        color: 0xf5a623
    },

    {
        id: "soda",
        name: "Carbonated Soda",
        formula: "H₂CO₃",
        pH: 3.8,
        type: "acid",
        strength: "Weak Acid",
        description:
            "Dissolved carbon dioxide forms carbonic acid.",
        color: 0xb86b35
    },

    {
        id: "coffee",
        name: "Coffee",
        formula: "Various acids",
        pH: 5.0,
        type: "acid",
        strength: "Weak Acid",
        description:
            "Coffee is mildly acidic.",
        color: 0x5a3825
    },

    {
        id: "milk",
        name: "Milk",
        formula: "Lactic Acid",
        pH: 6.5,
        type: "acid",
        strength: "Very Weak Acid",
        description:
            "Milk is slightly acidic.",
        color: 0xf4f0dc
    },

    {
        id: "distilled-water",
        name: "Distilled Water",
        formula: "H₂O",
        pH: 7.0,
        type: "neutral",
        strength: "Neutral",
        description:
            "Pure water is approximately neutral at pH 7.",
        color: 0x8ed8ff
    },

    {
        id: "salt-water",
        name: "Salt Water",
        formula: "NaCl + H₂O",
        pH: 7.0,
        type: "neutral",
        strength: "Neutral",
        description:
            "A typical sodium chloride solution is approximately neutral.",
        color: 0x7bc8e8
    },

    {
        id: "baking-soda",
        name: "Baking Soda Solution",
        formula: "NaHCO₃",
        pH: 8.3,
        type: "base",
        strength: "Weak Base",
        description:
            "Baking soda produces a mildly basic solution.",
        color: 0x9ddcff
    },

    {
        id: "seawater",
        name: "Seawater",
        formula: "Various salts",
        pH: 8.1,
        type: "base",
        strength: "Very Weak Base",
        description:
            "Natural seawater is slightly basic.",
        color: 0x4fb7d8
    },

    {
        id: "soap-water",
        name: "Soap Solution",
        formula: "Soap salts",
        pH: 9.5,
        type: "base",
        strength: "Weak Base",
        description:
            "Many soap solutions are basic.",
        color: 0x91d9c5
    },

    {
        id: "toothpaste",
        name: "Toothpaste Solution",
        formula: "Fluoride compounds",
        pH: 9.8,
        type: "base",
        strength: "Weak Base",
        description:
            "Many toothpastes are mildly basic.",
        color: 0xb7e3c3
    },

    {
        id: "ammonia",
        name: "Ammonia Solution",
        formula: "NH₃",
        pH: 11.0,
        type: "base",
        strength: "Weak Base",
        description:
            "Ammonia reacts with water to produce hydroxide ions.",
        color: 0xc6e8d5
    },

    {
        id: "washing-soda",
        name: "Washing Soda",
        formula: "Na₂CO₃",
        pH: 11.5,
        type: "base",
        strength: "Strong Base",
        description:
            "Sodium carbonate produces an alkaline solution.",
        color: 0x82d7e8
    },

    {
        id: "bleach",
        name: "Household Bleach",
        formula: "NaClO",
        pH: 12.5,
        type: "base",
        strength: "Strong Base",
        description:
            "Household bleach is strongly alkaline.",
        color: 0xe5f7b8
    },

    {
        id: "lime-water",
        name: "Lime Water",
        formula: "Ca(OH)₂",
        pH: 12.4,
        type: "base",
        strength: "Strong Base",
        description:
            "Calcium hydroxide forms an alkaline solution.",
        color: 0xbde8e8
    },

    {
        id: "oven-cleaner",
        name: "Oven Cleaner",
        formula: "NaOH",
        pH: 13.0,
        type: "base",
        strength: "Strong Base",
        description:
            "Many oven cleaners contain strongly alkaline substances.",
        color: 0xc9e7b4
    },

    {
        id: "sodium-hydroxide",
        name: "Sodium Hydroxide",
        formula: "NaOH",
        pH: 14.0,
        type: "base",
        strength: "Very Strong Base",
        description:
            "A highly alkaline solution.",
        color: 0xd6f3a4
    }
];

export const DEFAULT_SOLUTION =
    PH_SOLUTIONS.find(
        solution => solution.id === "distilled-water"
    ) || PH_SOLUTIONS[0];

export function getSolution(id) {
    return PH_SOLUTIONS.find(
        solution => solution.id === id
    ) || null;
}

export function getSolutionsByType(type) {
    return PH_SOLUTIONS.filter(
        solution => solution.type === type
    );
}