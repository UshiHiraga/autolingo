// Define console.logger() functions to allow send messages.
// Append an iframe so we can re-enable console.log using its console.logger
const isDebugMode = true;
const frameElement = document.createElement("iframe");
frameElement.style.display = "none";
document.body.appendChild(frameElement);
console.logger = (isDebugMode) ?
    (...content) => { frameElement.contentWindow.console.log(...content) } :
    () => { };

// Define getReactElement() function so we can get internal react instance info.
window.getReactElement = (element) => {
    if (element === null || element === undefined) return;
    return element[Object.keys(element).find((key) => key.startsWith("__reactFiber$"))];
}

// Sleep method
window.sleep = (delay = 50) => { return new Promise((res, rej) => setTimeout(res, delay)) }

// Parse html
window.createNodeFromText = (text) => {
    const parent = document.createElement("section");
    parent.innerHTML = text;
    return parent.children[0];
}