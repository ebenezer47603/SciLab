// ============================================================
// SciLab - Navigation Bar
// Navbar.js
// ============================================================

export function Navbar() {
    return `
        <header class="navbar">

            <div class="logo">
                🔬 SciLab
            </div>

            <nav>

                <button
                    type="button"
                    data-page="home"
                >
                    Home
                </button>

                <button
                    type="button"
                    data-page="physics"
                >
                    ⚛️ Physics
                </button>

                <button
                    type="button"
                    data-page="chemistry"
                >
                    🧪 Chemistry
                </button>

                <button
                    type="button"
                    data-page="biology"
                >
                    🧬 Biology
                </button>

            </nav>

        </header>
    `;
}