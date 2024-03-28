// This code get executed when a lesson like page is loaded.
// It execute all the solver related code.

window.addEventListener("DuolingoRefresh", function (e) {
    const possiblePageLikeTerms = ["lesson", "practice", "alphabets", "placement"];
    if (window.activeInterval) { window.clearInterval(window.activeInterval); delete window.activeInterval }
    if (!possiblePageLikeTerms.some((t) => e.detail.path.includes(t))) return true;

    // Watch the change in the status of the challenge.
    let prevLessonStatus = undefined;
    window.activeInterval = window.setInterval(function () {
        let currentStatus = window.getReactElement(document.querySelector("._3x0ok"))?.return?.stateNode?.props?.player?.status;
        if (prevLessonStatus === currentStatus) return;

        prevLessonStatus = currentStatus;
        let eventInfo = new CustomEvent("LessonStatusChanged", { detail: { currentStatus } });
        return window.dispatchEvent(eventInfo);
    }, 10);
});

window.addEventListener("LessonStatusChanged", async function (e) {
    console.logger(e.detail.currentStatus);
    switch (e.detail.currentStatus) {
        case "GUESSING":
            async function handleSolve() {
                let challengeInternalInfo = window.getReactElement(document.querySelector(".mQ0GW")).return.return.stateNode.props.currentChallenge;
                let currentChallange = new DuolingoChallenge(challengeInternalInfo);
                currentChallange.printDebugInfo();

                await currentChallange.solve();
                await sleep();
                DuolingoChallenge.clickButtonCheck();
            }

            function handleAutosolveRequest() {
                confirm("Relaod page for start the autosolving?") ? location.assign(location.pathname + "?autosolve=true") : null;
            }

            // Insert button for autosolve lesson.
            const progressBarContainer = document.querySelector("div._2nDUm");
            if (!progressBarContainer["autolingo_solve_button_inserted"]) {
                console.logger("Button inserted");
                let button = window.createNodeFromText(/*html*/`<button class="_2l-C- _2kfEr _1nlVc _2fOC9 UCrz7 t5wFJ autolingo-autosolve" title="Start autosolving" />`);
                button.addEventListener("click", handleAutosolveRequest);
                progressBarContainer.insertBefore(button, progressBarContainer.querySelector("div[role='progressbar']"));
                progressBarContainer["autolingo_solve_button_inserted"] = true;
            };

            // Insert button for solve this problem.
            const footer = document.querySelector("div._3FAc4._2T5D2");
            const buttonContainer = document.querySelector("div._2XF-t") ?? footer.insertBefore(window.createNodeFromText(`<div class="_2XF-t hiddeable"></div>`), footer.firstElementChild);
            let solveButton = window.createNodeFromText(`<button class="_1N-oo _36Vd3 _16r-S J51YJ U1P3s autolingo-solve"><span class="_1fHYG">Solve</span></button>`);
            solveButton.addEventListener("click", handleSolve);
            if (!document.location.pathname.includes("legendary") || !progressBarContainer["solve_button_inserted"]) {
                buttonContainer.appendChild(solveButton);
                progressBarContainer["solve_button_inserted"] = true;
            }

            if (document.location.search.includes("autosolve")) { await sleep(); handleSolve() };
            break;

        case "BLAMING":
        case "COACH_DUO":
        case "HARD_MODE_DUO":
        case "LEGENDARY_DUO":
        case "PARTIAL_XP_DUO":
        case "CAPSTONE_REVIEW_SPLASH":
        case "COACH_DUO_SPLASH":
        case "VISIBLE_PERSONALIZATION_SPLASH":
        case "PLACEMENT_SPLASH":
        case "UNIT_TEST_SPLASH":
            if (document.location.search.includes("autosolve")) { await sleep(); DuolingoChallenge.clickButtonContinue() };
            break;

        case "COACH_DUO_SLIDING":
        case "SLIDING":
        case "HARD_MODE_DUO_SLIDING":
        case "SUBMITTING":
        case "PARTIAL_XP_DUO_SLIDING":
        case "GRADING":
            console.logger("Waiting...");
            break;

        case "END_CAROUSEL":
            const urlObject = new URL(document.location);
            if (urlObject.search.includes("repeat")) { 
                const value = urlObject.searchParams.get("repeat");
                if(!value || isNaN(Number(value))){ await sleep(); location.reload() };
                if(Number(value) > 0){ await sleep(); location.assign(location.pathname + "?autosolve&repeat=" + (Number(value) - 1)) };
            };
            break;

        default:
            console.logger("Unknown lesson status: " + e.detail.currentStatus);
    }
})