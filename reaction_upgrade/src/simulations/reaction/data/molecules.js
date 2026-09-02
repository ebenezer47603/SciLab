// ============================================================
// SciLab Reaction Lab - Molecule Database
// ============================================================

export const molecules = {
    H2: {
        formula: "H₂",
        name: "Hydrogen",
        atoms: ["H", "H"]
    },

    O2: {
        formula: "O₂",
        name: "Oxygen",
        atoms: ["O", "O"]
    },

    H2O: {
        formula: "H₂O",
        name: "Water",
        atoms: ["H", "O", "H"]
    },

    C: {
        formula: "C",
        name: "Carbon",
        atoms: ["C"]
    },

    CO2: {
        formula: "CO₂",
        name: "Carbon dioxide",
        atoms: ["O", "C", "O"]
    },

    CH4: {
        formula: "CH₄",
        name: "Methane",
        atoms: ["H", "C", "H", "H", "H"]
    },

    N2: {
        formula: "N₂",
        name: "Nitrogen",
        atoms: ["N", "N"]
    },

    NH3: {
        formula: "NH₃",
        name: "Ammonia",
        atoms: ["N", "H", "H", "H"]
    },

    Na: {
        formula: "Na",
        name: "Sodium",
        atoms: ["Na"]
    },

    Cl2: {
        formula: "Cl₂",
        name: "Chlorine",
        atoms: ["Cl", "Cl"]
    },

    NaCl: {
        formula: "NaCl",
        name: "Sodium chloride",
        atoms: ["Na", "Cl"]
    },

    HCl: {
        formula: "HCl",
        name: "Hydrochloric acid",
        atoms: ["H", "Cl"]
    },

    NaOH: {
        formula: "NaOH",
        name: "Sodium hydroxide",
        atoms: ["Na", "O", "H"]
    },

    Zn: {
        formula: "Zn",
        name: "Zinc",
        atoms: ["Zn"]
    },

    ZnCl2: {
        formula: "ZnCl₂",
        name: "Zinc chloride",
        atoms: ["Cl", "Zn", "Cl"]
    },

    CaCO3: {
        formula: "CaCO₃",
        name: "Calcium carbonate",
        atoms: ["Ca", "C", "O", "O", "O"]
    },

    CaO: {
        formula: "CaO",
        name: "Calcium oxide",
        atoms: ["Ca", "O"]
    },

    KClO3: {
        formula: "KClO₃",
        name: "Potassium chlorate",
        atoms: ["K", "Cl", "O", "O", "O"]
    },

    KCl: {
        formula: "KCl",
        name: "Potassium chloride",
        atoms: ["K", "Cl"]
    },

    Fe: {
        formula: "Fe",
        name: "Iron",
        atoms: ["Fe"]
    },

    CuSO4: {
        formula: "CuSO₄",
        name: "Copper sulfate",
        atoms: ["Cu", "S", "O", "O", "O", "O"]
    },

    FeSO4: {
        formula: "FeSO₄",
        name: "Iron sulfate",
        atoms: ["Fe", "S", "O", "O", "O", "O"]
    },

    Cu: {
        formula: "Cu",
        name: "Copper",
        atoms: ["Cu"]
    }
};

export function getMolecule(formula) {
    return molecules[formula] || null;
}
