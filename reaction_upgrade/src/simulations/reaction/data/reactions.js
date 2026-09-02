// ============================================================
// SciLab Reaction Lab - Reaction Database
// ============================================================

export const reactions = [
    {
        id: "hydrogen-combustion",
        name: "Hydrogen Combustion",
        category: "Combustion",
        equation: "2H₂ + O₂ → 2H₂O",
        reactants: [
            { formula: "H2", coefficient: 2 },
            { formula: "O2", coefficient: 1 }
        ],
        products: [
            { formula: "H2O", coefficient: 2 }
        ],
        minTemperature: 280,
        optimalTemperature: 500,
        activationEnergy: 286,
        enthalpy: -572,
        exothermic: true
    },

    {
        id: "carbon-combustion",
        name: "Carbon Combustion",
        category: "Combustion",
        equation: "C + O₂ → CO₂",
        reactants: [
            { formula: "C", coefficient: 1 },
            { formula: "O2", coefficient: 1 }
        ],
        products: [
            { formula: "CO2", coefficient: 1 }
        ],
        minTemperature: 450,
        optimalTemperature: 800,
        activationEnergy: 394,
        enthalpy: -394,
        exothermic: true
    },

    {
        id: "methane-combustion",
        name: "Methane Combustion",
        category: "Combustion",
        equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
        reactants: [
            { formula: "CH4", coefficient: 1 },
            { formula: "O2", coefficient: 2 }
        ],
        products: [
            { formula: "CO2", coefficient: 1 },
            { formula: "H2O", coefficient: 2 }
        ],
        minTemperature: 400,
        optimalTemperature: 900,
        activationEnergy: 890,
        enthalpy: -890,
        exothermic: true
    },

    {
        id: "ammonia-synthesis",
        name: "Ammonia Synthesis",
        category: "Synthesis",
        equation: "N₂ + 3H₂ → 2NH₃",
        reactants: [
            { formula: "N2", coefficient: 1 },
            { formula: "H2", coefficient: 3 }
        ],
        products: [
            { formula: "NH3", coefficient: 2 }
        ],
        minTemperature: 350,
        optimalTemperature: 650,
        activationEnergy: 92,
        enthalpy: -92,
        exothermic: true
    },

    {
        id: "sodium-chloride",
        name: "Sodium Chloride Formation",
        category: "Synthesis",
        equation: "2Na + Cl₂ → 2NaCl",
        reactants: [
            { formula: "Na", coefficient: 2 },
            { formula: "Cl2", coefficient: 1 }
        ],
        products: [
            { formula: "NaCl", coefficient: 2 }
        ],
        minTemperature: 300,
        optimalTemperature: 650,
        activationEnergy: 411,
        enthalpy: -822,
        exothermic: true
    },

    {
        id: "acid-base",
        name: "Acid + Base Neutralization",
        category: "Acid–Base",
        equation: "HCl + NaOH → NaCl + H₂O",
        reactants: [
            { formula: "HCl", coefficient: 1 },
            { formula: "NaOH", coefficient: 1 }
        ],
        products: [
            { formula: "NaCl", coefficient: 1 },
            { formula: "H2O", coefficient: 1 }
        ],
        minTemperature: 250,
        optimalTemperature: 400,
        activationEnergy: 57,
        enthalpy: -57,
        exothermic: true
    },

    {
        id: "zinc-acid",
        name: "Zinc + Hydrochloric Acid",
        category: "Single Displacement",
        equation: "Zn + 2HCl → ZnCl₂ + H₂",
        reactants: [
            { formula: "Zn", coefficient: 1 },
            { formula: "HCl", coefficient: 2 }
        ],
        products: [
            { formula: "ZnCl2", coefficient: 1 },
            { formula: "H2", coefficient: 1 }
        ],
        minTemperature: 280,
        optimalTemperature: 550,
        activationEnergy: 153,
        enthalpy: -153,
        exothermic: true
    },

    {
        id: "calcium-carbonate",
        name: "Calcium Carbonate Decomposition",
        category: "Decomposition",
        equation: "CaCO₃ → CaO + CO₂",
        reactants: [
            { formula: "CaCO3", coefficient: 1 }
        ],
        products: [
            { formula: "CaO", coefficient: 1 },
            { formula: "CO2", coefficient: 1 }
        ],
        minTemperature: 850,
        optimalTemperature: 1000,
        activationEnergy: 178,
        enthalpy: 178,
        exothermic: false
    },

    {
        id: "potassium-chlorate",
        name: "Potassium Chlorate Decomposition",
        category: "Decomposition",
        equation: "2KClO₃ → 2KCl + 3O₂",
        reactants: [
            { formula: "KClO3", coefficient: 2 }
        ],
        products: [
            { formula: "KCl", coefficient: 2 },
            { formula: "O2", coefficient: 3 }
        ],
        minTemperature: 450,
        optimalTemperature: 750,
        activationEnergy: 49,
        enthalpy: 49,
        exothermic: false
    },

    {
        id: "iron-copper-sulfate",
        name: "Iron + Copper Sulfate",
        category: "Single Displacement",
        equation: "Fe + CuSO₄ → FeSO₄ + Cu",
        reactants: [
            { formula: "Fe", coefficient: 1 },
            { formula: "CuSO4", coefficient: 1 }
        ],
        products: [
            { formula: "FeSO4", coefficient: 1 },
            { formula: "Cu", coefficient: 1 }
        ],
        minTemperature: 280,
        optimalTemperature: 600,
        activationEnergy: 153,
        enthalpy: -153,
        exothermic: true
    }
];

export const defaultReaction = reactions[0];

export function getReaction(id) {
    return reactions.find(reaction => reaction.id === id) || defaultReaction;
}

export function getReactionsByCategory(category) {
    return reactions.filter(
        reaction => reaction.category === category
    );
}

export function getCategories() {
    return [...new Set(reactions.map(reaction => reaction.category))];
}
