import { elements } from "../data/elements.js";

export function Atom() {

    const options = elements.map(element => `

        <option value="${element.number}">

            ${element.number}. ${element.name} (${element.symbol})

        </option>

    `).join("");

    return `

<section class="atom-page">

<div class="atom-header">

<h1>⚛️ 3D Atom Simulator</h1>

<p>Build atoms according to the Bohr Model.</p>

</div>

<div class="atom-layout">

<aside class="atom-sidebar">

<h2>Element Selector</h2>

<select id="element-select">

${options}

</select>

<button id="build-atom">⚛️ Build Atom</button>

<button id="reset-atom">🔄 Reset</button>

<button id="play-atom">▶ Play</button>

<button id="pause-atom">⏸ Pause</button>

<div id="atom-info"></div>

</aside>

<main class="atom-view">

<div id="engine-container"></div>

</main>

</div>

<section class="teacher-panel">

<h2>Teacher Explanation</h2>

<div id="teacher-info"></div>

</section>

</section>

`;

}