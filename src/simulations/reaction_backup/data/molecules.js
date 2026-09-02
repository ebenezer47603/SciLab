export const molecules = {
    H2: {
        formula: "H₂",
        name: "Hydrogen",
        atoms: ["H", "H"],
        color: 0xffffff,
        radius: 0.45
    },

    O2: {
        formula: "O₂",
        name: "Oxygen",
        atoms: ["O", "O"],
        color: 0xff3333,
        radius: 0.5
    },

    H2O: {
        formula: "H₂O",
        name: "Water",
        atoms: ["H", "O", "H"],
        color: 0x3399ff,
        radius: 0.55
    }
};

export function getMolecule(formula) {
    return molecules[formula] || null;
}