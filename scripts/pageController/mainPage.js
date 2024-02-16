// This code get executed when main page is loaded.
// It creates several buttons to allow user start using the extension.

window.addEventListener("DuolingoRefresh", function (e) {
    if (e.detail.path !== "/learn") return;

    Array.from(document.querySelectorAll("div._31n11._3DQs0")).forEach(async (pathLevel) => {
        await sleep(0);

        pathLevel.querySelector("button").addEventListener("click", async (event) => {
            await sleep(0);
            let info = window.getReactElement(pathLevel).return.pendingProps.level;
            let div = pathLevel.querySelector("div._1xmsI._3lZ4K");

            if (div.getAttribute("autolingo_extra_buttons")) return true;
            div.setAttribute("autolingo_extra_buttons", "true");

            if (info.state === "passed" && info.type === "skill" || info.type === "practice") {
                // Get the same url for practice link.
                let practiceURL = div.querySelector("[data-test*='skill-path-state-passed']").getAttribute("href");
                div.appendChild(window.createNodeFromText(/*html*/`<a class="_30qMV _2N_A5 _36Vd3 _16r-S KSXIb _2CJe1 _12StQ" href="${practiceURL}?autosolve=true">Autosolve practice</a>`))

                // For lengendary level, creates the new button and set its event listener.
                let legendaryCurrentButton = div.querySelector("[data-test='legendary-node-button']");
                legendaryCurrentButton.addEventListener("click", async () => {
                    await sleep(0);
                    if(!div.getAttribute("autolingo_legendary_solve")) return true;
                    div.removeAttribute("autolingo_legendary_solve");
                    let executeLegendaryButton = document.querySelector("a[data-test='legendary-start-button']");
                    let newUrl = executeLegendaryButton.getAttribute("href") + "?autosolve=true";
                    executeLegendaryButton.setAttribute("href", newUrl);
                });

                let newLegendaryButton = window.createNodeFromText(/*html*/`<button class="_30qMV _2N_A5 _36Vd3 _16r-S _36IgH _2CJe1 _3_d62">Autosolve legendary</button>`);
                newLegendaryButton.addEventListener("click", () => {
                    div.setAttribute("autolingo_legendary_solve", "true");
                    legendaryCurrentButton.click();
                });

                div.appendChild(newLegendaryButton);
                return true;
            }

            if (info.state === "active") {
                div.appendChild(window.createNodeFromText(/*html*/`<a class="_30qMV _2N_A5 _36Vd3 _16r-S KSXIb _2CJe1 _12StQ" href="/lesson?autosolve=true  ">Autosolve the skill</a>`));
                return true;
            }

        });
    });
});