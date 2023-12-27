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

// Parse html
window.createNodeFromText = (text) => {
    let parent = document.createElement("section");
    parent.innerHTML = text;
    return parent.children[0];
}

// Watch changes in pages
let PREVIOUS_LANGUAGE = null;
let PREVIOUS_URL = null;

setInterval(() => {
    // get the current language from the page
    const MAIN_PAGE_ELEMENT = document.querySelector("._3BJQ_");
    const page_data = window.getReactElement(MAIN_PAGE_ELEMENT)?.return?.return?.return?.memoizedProps;

    const current_language = page_data?.courses?.find((e) => e.isCurrent)?.learningLanguageId;
    const current_url = document.location.href;
    const current_path = document.location.pathname;

    if (PREVIOUS_LANGUAGE !== current_language || PREVIOUS_URL !== current_url) {
        let eventH = new CustomEvent("DuoligoRefresh", { detail: { current_language, current_url, current_path } });
        window.dispatchEvent(eventH);
    }

    PREVIOUS_LANGUAGE = current_language;
    PREVIOUS_URL = current_url;
}, 1000);