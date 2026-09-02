export function atomInfo(element) {

    if (!element) return "";

    return `

<h2>${element.name}</h2>

<p><strong>Symbol:</strong> ${element.symbol}</p>

<p><strong>Atomic Number:</strong> ${element.number}</p>

<p><strong>Protons:</strong> ${element.protons}</p>

<p><strong>Neutrons:</strong> ${element.neutrons}</p>

<p><strong>Electrons:</strong> ${element.electrons}</p>

<p><strong>Shells:</strong> ${element.shells.join(" , ")}</p>

`;

}