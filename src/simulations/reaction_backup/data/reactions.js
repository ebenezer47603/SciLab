export const reactions = {
    hydrogenCombustion: {
        id: "hydrogenCombustion",

        name: "Hydrogen Combustion",

        equation: "2H₂ + O₂ → 2H₂O",

        reactants: [
            {
                formula: "H2",
                displayFormula: "H₂",
                name: "Hydrogen",
                coefficient: 2
            },
            {
                formula: "O2",
                displayFormula: "O₂",
                name: "Oxygen",
                coefficient: 1
            }
        ],

        products: [
            {
                formula: "H2O",
                displayFormula: "H₂O",
                name: "Water",
                coefficient: 2
            }
        ],

        type: "combustion",

        exothermic: true,

        activationEnergy: 50,

        enthalpy: -484,

        minTemperature: 400,

        optimalTemperature: 700
    }
};

export const defaultReaction =
    reactions.hydrogenCombustion;