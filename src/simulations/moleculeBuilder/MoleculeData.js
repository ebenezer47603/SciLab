// ============================================================
// SciLab Molecule Builder
// MoleculeData.js - PART 1
// ============================================================

export const molecules = [

    // ========================================================
    // 1. HYDROGEN
    // ========================================================

    {
        id: "H2",
        name: "Hydrogen",
        formula: "H₂",

        atoms: [
            { element: "H", x: -0.6, y: 0, z: 0 },
            { element: "H", x: 0.6, y: 0, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 }
        ],

        molecularGeometry: "Linear",

        bondAngles: [
            {
                atoms: [0, 1, 0],
                angle: 180
            }
        ],

        lonePairs: [],

        description:
            "Hydrogen contains two hydrogen atoms connected by a single covalent bond."
    },


    // ========================================================
    // 2. OXYGEN
    // ========================================================

    {
        id: "O2",
        name: "Oxygen",
        formula: "O₂",

        atoms: [
            { element: "O", x: -0.8, y: 0, z: 0 },
            { element: "O", x: 0.8, y: 0, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 2 }
        ],

        molecularGeometry: "Linear",

        bondAngles: [
            {
                atoms: [0, 1, 0],
                angle: 180
            }
        ],

        lonePairs: [
            { atom: 0, pairs: 2 },
            { atom: 1, pairs: 2 }
        ],

        description:
            "Oxygen contains a double covalent bond."
    },


    // ========================================================
    // 3. NITROGEN
    // ========================================================

    {
        id: "N2",
        name: "Nitrogen",
        formula: "N₂",

        atoms: [
            { element: "N", x: -0.8, y: 0, z: 0 },
            { element: "N", x: 0.8, y: 0, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 3 }
        ],

        molecularGeometry: "Linear",

         bondAngles: [
            {
                atoms: [0, 1, 0],
                angle: 180
            }
        ],

        lonePairs: [
            { atom: 0, pairs: 1 },
            { atom: 1, pairs: 1 }
        ],

        description:
            "Nitrogen contains a triple covalent bond."
    },


    // ========================================================
    // 4. WATER
    // ========================================================

    {
        id: "H2O",
        name: "Water",
        formula: "H₂O",

        atoms: [
            { element: "O", x: 0, y: 0, z: 0 },
            { element: "H", x: -1.0, y: 0.7, z: 0 },
            { element: "H", x: 1.0, y: 0.7, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 },
            { from: 0, to: 2, type: 1 }
        ],

        molecularGeometry: "Bent",

        bondAngles: [
            {
                atoms: [1, 0, 2],
                angle: 104.5
            }
        ],

        lonePairs: [
            { atom: 0, pairs: 2 }
        ],

        description:
            "Water has a bent molecular geometry because oxygen has two bonding pairs and two lone pairs."
    },


    // ========================================================
    // 5. CARBON DIOXIDE
    // ========================================================

    {
        id: "CO2",
        name: "Carbon Dioxide",
        formula: "CO₂",

        atoms: [
            { element: "O", x: -1.5, y: 0, z: 0 },
            { element: "C", x: 0, y: 0, z: 0 },
            { element: "O", x: 1.5, y: 0, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 2 },
            { from: 1, to: 2, type: 2 }
        ],

        molecularGeometry: "Linear",

        bondAngles: [
            {
                atoms: [0, 1, 2],
                angle: 180
            }
        ],

        lonePairs: [
            { atom: 0, pairs: 2 },
            { atom: 2, pairs: 2 }
        ],

        description:
            "Carbon dioxide is linear with two carbon-oxygen double bonds."
    },


    // ========================================================
    // 6. METHANE
    // ========================================================

    {
        id: "CH4",
        name: "Methane",
        formula: "CH₄",

        atoms: [
            { element: "C", x: 0, y: 0, z: 0 },

            { element: "H", x: 1.15, y: 1.15, z: 1.15 },
            { element: "H", x: -1.15, y: -1.15, z: 1.15 },
            { element: "H", x: -1.15, y: 1.15, z: -1.15 },
            { element: "H", x: 1.15, y: -1.15, z: -1.15 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 },
            { from: 0, to: 2, type: 1 },
            { from: 0, to: 3, type: 1 },
            { from: 0, to: 4, type: 1 }
        ],

        molecularGeometry: "Tetrahedral",

        bondAngles: [
            {
                atoms: [1, 0, 2],
                angle: 109.5
            }
        ],

        lonePairs: [],

        description:
            "Methane has a tetrahedral geometry with bond angles of approximately 109.5 degrees."
    },


    // ========================================================
    // 7. AMMONIA
    // ========================================================

    {
        id: "NH3",
        name: "Ammonia",
        formula: "NH₃",

        atoms: [
            { element: "N", x: 0, y: 0.2, z: 0 },
            { element: "H", x: -1.0, y: -0.5, z: 0.6 },
            { element: "H", x: 1.0, y: -0.5, z: 0.6 },
            { element: "H", x: 0, y: -0.5, z: -1.0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 },
            { from: 0, to: 2, type: 1 },
            { from: 0, to: 3, type: 1 }
        ],

        molecularGeometry: "Trigonal Pyramidal",

        bondAngles: [
            {
                atoms: [1, 0, 2],
                angle: 107
            }
        ],

        lonePairs: [
            { atom: 0, pairs: 1 }
        ],

        description:
            "Ammonia has trigonal pyramidal molecular geometry with one lone pair on nitrogen."
    },


    // ========================================================
    // 8. SULFUR DIOXIDE
    // ========================================================

    {
        id: "SO2",
        name: "Sulfur Dioxide",
        formula: "SO₂",

        atoms: [
            { element: "S", x: 0, y: 0, z: 0 },
            { element: "O", x: -1.2, y: 0.7, z: 0 },
            { element: "O", x: 1.2, y: 0.7, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 2 },
            { from: 0, to: 2, type: 2 }
        ],

        molecularGeometry: "Bent",

        bondAngles: [
            {
                atoms: [1, 0, 2],
                angle: 119
            }
        ],

        lonePairs: [
            { atom: 0, pairs: 1 },
            { atom: 1, pairs: 2 },
            { atom: 2, pairs: 2 }
        ],

        description:
            "Sulfur dioxide has a bent geometry and one lone pair on sulfur."
    },


    // ========================================================
    // 9. ETHENE
    // ========================================================

    {
        id: "C2H4",
        name: "Ethene",
        formula: "C₂H₄",

        atoms: [
            { element: "C", x: -0.7, y: 0, z: 0 },
            { element: "C", x: 0.7, y: 0, z: 0 },

            { element: "H", x: -1.35, y: 0.9, z: 0 },
            { element: "H", x: -1.35, y: -0.9, z: 0 },

            { element: "H", x: 1.35, y: 0.9, z: 0 },
            { element: "H", x: 1.35, y: -0.9, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 2 },

            { from: 0, to: 2, type: 1 },
            { from: 0, to: 3, type: 1 },

            { from: 1, to: 4, type: 1 },
            { from: 1, to: 5, type: 1 }
        ],

        molecularGeometry: "Trigonal Planar",

        bondAngles: [
            {
                atoms: [2, 0, 3],
                angle: 120
            }
        ],

        lonePairs: [],

        description:
            "Ethene contains a carbon-carbon double bond and planar trigonal geometry around each carbon."
    },


    // ========================================================
    // 10. ETHYNE
    // ========================================================

    {
        id: "C2H2",
        name: "Ethyne",
        formula: "C₂H₂",

        atoms: [
            { element: "H", x: -2.0, y: 0, z: 0 },
            { element: "C", x: -0.8, y: 0, z: 0 },
            { element: "C", x: 0.8, y: 0, z: 0 },
            { element: "H", x: 2.0, y: 0, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 },
            { from: 1, to: 2, type: 3 },
            { from: 2, to: 3, type: 1 }
        ],

        molecularGeometry: "Linear",

        bondAngles: [
            {
                atoms: [0, 1, 2],
                angle: 180
            }
        ],

        lonePairs: [],

        description:
            "Ethyne contains a carbon-carbon triple bond and has linear geometry."
    },

    // ========================================================
    // END OF PART 1
    // ========================================================

    {
        id: "CH4",
        name: "Methane",
        formula: "CH₄",

        atoms: [
            { element: "C", x: 0, y: 0, z: 0 },

            { element: "H", x: 1.15, y: 1.15, z: 1.15 },
            { element: "H", x: -1.15, y: -1.15, z: 1.15 },
            { element: "H", x: -1.15, y: 1.15, z: -1.15 },
            { element: "H", x: 1.15, y: -1.15, z: -1.15 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 },
            { from: 0, to: 2, type: 1 },
            { from: 0, to: 3, type: 1 },
            { from: 0, to: 4, type: 1 }
        ],

        molecularGeometry: "Tetrahedral",

        bondAngles: [
            {
                atoms: [1, 0, 2],
                angle: 109.5
            }
        ],

        lonePairs: [],

        description:
            "Methane has a tetrahedral molecular geometry."
    },


    {
        id: "NH3",
        name: "Ammonia",
        formula: "NH₃",

        atoms: [
            { element: "N", x: 0, y: 0.2, z: 0 },
            { element: "H", x: -1.0, y: -0.5, z: 0.6 },
            { element: "H", x: 1.0, y: -0.5, z: 0.6 },
            { element: "H", x: 0, y: -0.5, z: -1.0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 },
            { from: 0, to: 2, type: 1 },
            { from: 0, to: 3, type: 1 }
        ],

        molecularGeometry: "Trigonal Pyramidal",

        bondAngles: [
            {
                atoms: [1, 0, 2],
                angle: 107
            }
        ],

        lonePairs: [
            { atom: 0, pairs: 1 }
        ],

        description:
            "Ammonia has trigonal pyramidal geometry with one lone pair on nitrogen."
    },


    {
        id: "SO2",
        name: "Sulfur Dioxide",
        formula: "SO₂",

        atoms: [
            { element: "S", x: 0, y: 0, z: 0 },
            { element: "O", x: -1.2, y: 0.7, z: 0 },
            { element: "O", x: 1.2, y: 0.7, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 2 },
            { from: 0, to: 2, type: 2 }
        ],

        molecularGeometry: "Bent",

        bondAngles: [
            {
                atoms: [1, 0, 2],
                angle: 119
            }
        ],

        lonePairs: [
            { atom: 0, pairs: 1 },
            { atom: 1, pairs: 2 },
            { atom: 2, pairs: 2 }
        ],

        description:
            "Sulfur dioxide has bent molecular geometry."
    },


    {
        id: "C2H4",
        name: "Ethene",
        formula: "C₂H₄",

        atoms: [
            { element: "C", x: -0.7, y: 0, z: 0 },
            { element: "C", x: 0.7, y: 0, z: 0 },

            { element: "H", x: -1.35, y: 0.9, z: 0 },
            { element: "H", x: -1.35, y: -0.9, z: 0 },

            { element: "H", x: 1.35, y: 0.9, z: 0 },
            { element: "H", x: 1.35, y: -0.9, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 2 },
            { from: 0, to: 2, type: 1 },
            { from: 0, to: 3, type: 1 },
            { from: 1, to: 4, type: 1 },
            { from: 1, to: 5, type: 1 }
        ],

        molecularGeometry: "Trigonal Planar",

        bondAngles: [
            {
                atoms: [2, 0, 3],
                angle: 120
            }
        ],

        lonePairs: [],

        description:
            "Ethene has trigonal planar geometry around each carbon."
    },


    {
        id: "C2H2",
        name: "Ethyne",
        formula: "C₂H₂",

        atoms: [
            { element: "H", x: -2.0, y: 0, z: 0 },
            { element: "C", x: -0.8, y: 0, z: 0 },
            { element: "C", x: 0.8, y: 0, z: 0 },
            { element: "H", x: 2.0, y: 0, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 },
            { from: 1, to: 2, type: 3 },
            { from: 2, to: 3, type: 1 }
        ],

        molecularGeometry: "Linear",

        bondAngles: [
            {
                atoms: [0, 1, 2],
                angle: 180
            }
        ],

        lonePairs: [],

        description:
            "Ethyne has linear molecular geometry."
    },


    {
        id: "HCl",
        name: "Hydrogen Chloride",
        formula: "HCl",

        atoms: [
            { element: "H", x: -0.7, y: 0, z: 0 },
            { element: "Cl", x: 0.7, y: 0, z: 0 }
        ],

        bonds: [
            { from: 0, to: 1, type: 1 }
        ],

        molecularGeometry: "Linear",

        bondAngles: [],

        lonePairs: [
            { atom: 1, pairs: 3 }
        ],

        description:
            "Hydrogen chloride is a linear diatomic molecule."
    }


];