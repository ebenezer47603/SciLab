// ============================================================
// SciLab - pH Laboratory
// PHCalculator.js
// ============================================================

export class PHCalculator {

    // ========================================================
    // CLAMP pH
    // ========================================================

    static clampPH(pH) {

        const value =
            Number(pH);

        if (!Number.isFinite(value)) {
            return 7;
        }

        return Math.max(
            0,
            Math.min(
                14,
                value
            )
        );
    }


    // ========================================================
    // CALCULATE pH INFORMATION
    // ========================================================

    static calculate(pH) {

        const value =
            this.clampPH(pH);


        // ----------------------------------------------------
        // Hydrogen ion concentration
        // [H+] = 10^-pH
        // ----------------------------------------------------

        const hydrogenIon =
            Math.pow(
                10,
                -value
            );


        // ----------------------------------------------------
        // Hydroxide ion concentration
        // pOH = 14 - pH
        // [OH-] = 10^-pOH
        // ----------------------------------------------------

        const pOH =
            14 - value;

        const hydroxideIon =
            Math.pow(
                10,
                -pOH
            );


        // ----------------------------------------------------
        // Type
        // ----------------------------------------------------

        let type;
        let typeLabel;

        if (value < 7) {

            type =
                "acid";

            typeLabel =
                "Acidic";

        } else if (value > 7) {

            type =
                "base";

            typeLabel =
                "Basic";

        } else {

            type =
                "neutral";

            typeLabel =
                "Neutral";
        }


        // ----------------------------------------------------
        // Strength
        // ----------------------------------------------------

        let strength;

        if (value < 2) {

            strength =
                "Very Strong Acid";

        } else if (value < 4) {

            strength =
                "Strong Acid";

        } else if (value < 6) {

            strength =
                "Weak Acid";

        } else if (value < 7) {

            strength =
                "Very Weak Acid";

        } else if (value === 7) {

            strength =
                "Neutral";

        } else if (value <= 8) {

            strength =
                "Very Weak Base";

        } else if (value <= 10) {

            strength =
                "Weak Base";

        } else if (value <= 12) {

            strength =
                "Strong Base";

        } else if (value <= 13) {

            strength =
                "Very Strong Base";

        } else {

            strength =
                "Extremely Strong Base";
        }


        // ----------------------------------------------------
        // Solution visual color
        //
        // This is NOT the liquid color from PHData.
        // It is the pH-scale / information color.
        // ----------------------------------------------------

        let color;

        if (value < 3) {

            color =
                "#e53935";

        } else if (value < 5) {

            color =
                "#f4511e";

        } else if (value < 7) {

            color =
                "#f9a825";

        } else if (value === 7) {

            color =
                "#43a047";

        } else if (value < 9) {

            color =
                "#7cb342";

        } else if (value < 11) {

            color =
                "#00897b";

        } else if (value < 13) {

            color =
                "#1e88e5";

        } else {

            color =
                "#3949ab";
        }


        return {

            pH:
                value,

            pOH:
                pOH,

            hydrogenIon:
                hydrogenIon,

            hydroxideIon:
                hydroxideIon,

            type:
                type,

            typeLabel:
                typeLabel,

            strength:
                strength,

            color:
                color
        };
    }


    // ========================================================
    // LITMUS RESULT
    // ========================================================

    static getLitmusResult(
        pH,
        paperType
    ) {

        const value =
            this.clampPH(pH);


        // ----------------------------------------------------
        // BLUE LITMUS
        //
        // Acid -> red
        // Neutral/Base -> blue
        // ----------------------------------------------------

        if (
            paperType ===
            "blue"
        ) {

            if (value < 7) {

                return {

                    changed:
                        true,

                    color:
                        "red",

                    label:
                        "Blue litmus turns red — the solution is acidic.",

                    type:
                        "acid"
                };

            }

            return {

                changed:
                    false,

                color:
                    "blue",

                label:
                    "Blue litmus remains blue — the solution is neutral or basic.",

                type:
                    value === 7
                        ? "neutral"
                        : "base"
            };
        }


        // ----------------------------------------------------
        // RED LITMUS
        //
        // Base -> blue
        // Neutral/Acid -> red
        // ----------------------------------------------------

        if (
            paperType ===
            "red"
        ) {

            if (value > 7) {

                return {

                    changed:
                        true,

                    color:
                        "blue",

                    label:
                        "Red litmus turns blue — the solution is basic.",

                    type:
                        "base"
                };

            }

            return {

                changed:
                    false,

                color:
                    "red",

                label:
                    "Red litmus remains red — the solution is neutral or acidic.",

                type:
                    value === 7
                        ? "neutral"
                        : "acid"
            };
        }


        // ----------------------------------------------------
        // Invalid paper
        // ----------------------------------------------------

        return {

            changed:
                false,

            color:
                null,

            label:
                "Unknown litmus paper.",

            type:
                null
        };
    }


    // ========================================================
    // pH SCALE POSITION
    // ========================================================

    static getScalePercentage(pH) {

        const value =
            this.clampPH(pH);

        return (
            value / 14
        ) * 100;
    }


    // ========================================================
    // SCIENTIFIC FORMAT
    // ========================================================

    static formatScientific(value) {

        if (
            !Number.isFinite(
                value
            )
        ) {

            return "—";
        }

        return value
            .toExponential(2)
            .replace(
                "e+",
                " × 10^"
            )
            .replace(
                "e-",
                " × 10^-"
            );
    }
}