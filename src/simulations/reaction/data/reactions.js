// ============================================================
// SciLab Reaction Lab
// reactions.js
// Reaction database
// ============================================================


export const reactions = [

    // ========================================================
    // 1. HYDROGEN + OXYGEN
    // ========================================================

    {
        id: "hydrogen-combustion",

        name: "Hydrogen Combustion",

        equation:
            "2H₂ + O₂ → 2H₂O",

        reactants: [
            {
                formula: "H2",
                coefficient: 2
            },
            {
                formula: "O2",
                coefficient: 1
            }
        ],

        products: [
            {
                formula: "H2O",
                coefficient: 2
            }
        ],

        minTemperature: 250,

        optimalTemperature: 600,

        activationEnergy: 286,

        enthalpy: -572,

        exothermic: true
    },


    // ========================================================
    // 2. METHANE COMBUSTION
    // ========================================================

    {
        id: "methane-combustion",

        name: "Methane Combustion",

        equation:
            "CH₄ + 2O₂ → CO₂ + 2H₂O",

        reactants: [
            {
                formula: "CH4",
                coefficient: 1
            },
            {
                formula: "O2",
                coefficient: 2
            }
        ],

        products: [
            {
                formula: "CO2",
                coefficient: 1
            },
            {
                formula: "H2O",
                coefficient: 2
            }
        ],

        minTemperature: 450,

        optimalTemperature: 900,

        activationEnergy: 890,

        enthalpy: -890,

        exothermic: true
    },


    // ========================================================
    // 3. AMMONIA SYNTHESIS
    // ========================================================

    {
        id: "ammonia-synthesis",

        name: "Ammonia Synthesis",

        equation:
            "N₂ + 3H₂ → 2NH₃",

        reactants: [
            {
                formula: "N2",
                coefficient: 1
            },
            {
                formula: "H2",
                coefficient: 3
            }
        ],

        products: [
            {
                formula: "NH3",
                coefficient: 2
            }
        ],

        minTemperature: 350,

        optimalTemperature: 500,

        activationEnergy: 92,

        enthalpy: -92,

        exothermic: true
    },


    // ========================================================
    // 4. SODIUM CHLORIDE
    // ========================================================

    {
        id: "sodium-chloride",

        name: "Sodium Chloride Formation",

        equation:
            "2Na + Cl₂ → 2NaCl",

        reactants: [
            {
                formula: "Na",
                coefficient: 2
            },
            {
                formula: "Cl2",
                coefficient: 1
            }
        ],

        products: [
            {
                formula: "NaCl",
                coefficient: 2
            }
        ],

        minTemperature: 300,

        optimalTemperature: 500,

        activationEnergy: 411,

        enthalpy: -822,

        exothermic: true
    },


    // ========================================================
    // 5. HYDROCHLORIC ACID + SODIUM HYDROXIDE
    // ========================================================

    {
        id: "neutralization",

        name: "Acid–Base Neutralization",

        equation:
            "HCl + NaOH → NaCl + H₂O",

        reactants: [
            {
                formula: "HCl",
                coefficient: 1
            },
            {
                formula: "NaOH",
                coefficient: 1
            }
        ],

        products: [
            {
                formula: "NaCl",
                coefficient: 1
            },
            {
                formula: "H2O",
                coefficient: 1
            }
        ],

        minTemperature: 250,

        optimalTemperature: 350,

        activationEnergy: 57,

        enthalpy: -57,

        exothermic: true
    },


    // ========================================================
    // 6. ZINC + HYDROCHLORIC ACID
    // ========================================================

    {
        id: "zinc-hcl",

        name: "Zinc + Hydrochloric Acid",

        equation:
            "Zn + 2HCl → ZnCl₂ + H₂",

        reactants: [
            {
                formula: "Zn",
                coefficient: 1
            },
            {
                formula: "HCl",
                coefficient: 2
            }
        ],

        products: [
            {
                formula: "ZnCl2",
                coefficient: 1
            },
            {
                formula: "H2",
                coefficient: 1
            }
        ],

        minTemperature: 280,

        optimalTemperature: 400,

        activationEnergy: 80,

        enthalpy: -153,

        exothermic: true
    },


    // ========================================================
    // 7. CALCIUM CARBONATE DECOMPOSITION
    // ========================================================

    {
        id: "calcium-carbonate",

        name: "Calcium Carbonate Decomposition",

        equation:
            "CaCO₃ → CaO + CO₂",

        reactants: [
            {
                formula: "CaCO3",
                coefficient: 1
            }
        ],

        products: [
            {
                formula: "CaO",
                coefficient: 1
            },
            {
                formula: "CO2",
                coefficient: 1
            }
        ],

        minTemperature: 1173,

        optimalTemperature: 1200,

        activationEnergy: 178,

        enthalpy: 178,

        exothermic: false
    },


    // ========================================================
    // 8. POTASSIUM CHLORATE DECOMPOSITION
    // ========================================================

    {
        id: "potassium-chlorate",

        name: "Potassium Chlorate Decomposition",

        equation:
            "2KClO₃ → 2KCl + 3O₂",

        reactants: [
            {
                formula: "KClO3",
                coefficient: 2
            }
        ],

        products: [
            {
                formula: "KCl",
                coefficient: 2
            },
            {
                formula: "O2",
                coefficient: 3
            }
        ],

        minTemperature: 600,

        optimalTemperature: 700,

        activationEnergy: 120,

        enthalpy: 89,

        exothermic: false
    },


    // ========================================================
    // 9. IRON + COPPER SULFATE
    // ========================================================

    {
        id: "iron-copper-sulfate",

        name: "Iron + Copper Sulfate",

        equation:
            "Fe + CuSO₄ → FeSO₄ + Cu",

        reactants: [
            {
                formula: "Fe",
                coefficient: 1
            },
            {
                formula: "CuSO4",
                coefficient: 1
            }
        ],

        products: [
            {
                formula: "FeSO4",
                coefficient: 1
            },
            {
                formula: "Cu",
                coefficient: 1
            }
        ],

        minTemperature: 280,

        optimalTemperature: 350,

        activationEnergy: 50,

        enthalpy: -153,

        exothermic: true
    },


    // ========================================================
    // 10. CARBON DIOXIDE + WATER
    // ========================================================

    {
        id: "carbonic-acid",

        name: "Carbonic Acid Formation",

        equation:
            "CO₂ + H₂O → H₂CO₃",

        reactants: [
            {
                formula: "CO2",
                coefficient: 1
            },
            {
                formula: "H2O",
                coefficient: 1
            }
        ],

        products: [
            {
                formula: "H2CO3",
                coefficient: 1
            }
        ],

        minTemperature: 250,

        optimalTemperature: 300,

        activationEnergy: 25,

        enthalpy: -20,

        exothermic: true
    }

];


// ============================================================
// DEFAULT REACTION
// ============================================================

export const defaultReaction =
    reactions[0];


// ============================================================
// FIND REACTION BY ID
// ============================================================

export function getReaction(id) {

    return reactions.find(
        reaction =>
            reaction.id === id
    );
}


// ============================================================
// GET ALL REACTIONS
// ============================================================

export function getReactions() {

    return [...reactions];
}


// ============================================================
// GET REACTION COUNT
// ============================================================

export function getReactionCount() {

    return reactions.length;
}


// ============================================================
// FIND REACTION BY NAME
// ============================================================

export function findReactionByName(name) {

    if (!name) {
        return undefined;
    }

    const search =
        name
            .toLowerCase()
            .trim();


    return reactions.find(
        reaction =>
            reaction.name
                .toLowerCase()
                .includes(search)
    );
}


// ============================================================
// CHECK REACTION
// ============================================================

export function hasReaction(id) {

    return reactions.some(
        reaction =>
            reaction.id === id
    );
}