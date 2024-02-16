// Define console.logger() functions to allow send messages.
// Append an iframe so we can re-enable console.log using its console.logger
const DEBUG = true;
const FRAME_ELEMENT = document.createElement("iframe");
FRAME_ELEMENT.style.display = "none";
document.body.appendChild(FRAME_ELEMENT);
console.logger = (DEBUG) ?
    (...content) => { FRAME_ELEMENT.contentWindow.console.log(...content) } :
    () => { };

// Define getReactElement() function so we can get internal info.
window.getReactElement = (element) => {
    const POSIBLE_PREFIXES = {
        "ReactFiber": "__reactFiber$",
        "ReactInternal": "__reactInternalInstance$",
        "ReactEvents": "__reactEventHandlers$",
        "ReactProps": "__reactProps$"
    }

    if (element === null || element === undefined) {
        return;
    }

    // find it's react internal instance key
    let key = Object.keys(element).find((key) => key.startsWith("__reactFiber$"));

    // get the react internal instance
    return element[key];
}

// Sleep method
window.sleep = (delay = 50) => {
    return new Promise((res, rej) => setTimeout(res, delay));
}

// Parse html
window.createNodeFromText = (text) => {
    let parent = document.createElement("section");
    parent.innerHTML = text;
    return parent.children[0];
}