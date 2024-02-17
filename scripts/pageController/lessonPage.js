// This code get executed when a lesson like page is loaded.
// It execute all the solver related code.

window.addEventListener("DuolingoRefresh", function (e) {
    const possiblePageLikeTerms = ["lesson", "practice", "alphabets"];
    if (window.activeInterval) { window.clearInterval(window.activeInterval); delete window.activeInterval }
    if (!possiblePageLikeTerms.some((t) => e.detail.path.includes(t))) return true;

    // Watch the change in the status of the challenge.
    let prevLessonStatus = undefined;
    window.activeInterval = window.setInterval(function () {
        console.logger("aa");
        let currentStatus = window.getReactElement(document.querySelector("._3x0ok"))?.return?.stateNode?.props?.player?.status;
        if (prevLessonStatus === currentStatus) return;

        prevLessonStatus = currentStatus;
        let eventInfo = new CustomEvent("LessonStatusChanged", { detail: { currentStatus } });
        return window.dispatchEvent(eventInfo);
    }, 50);
});

window.addEventListener("LessonStatusChanged", async function (e) {
    switch (e.detail.currentStatus) {
        case "GUESSING":
            async function handleSolve() {
                let challengeInternalInfo = window.getReactElement(document.querySelector(".mQ0GW")).return.return.stateNode.props.currentChallenge;
                let currentChallange = new DuolingoChallenge(challengeInternalInfo);
                currentChallange.printDebugInfo();
                await sleep();
                currentChallange.solve();

                await sleep(2100);
                DuolingoChallenge.clickButtonCheck();
            }

            // Insert solve this problem button.
            const progressBarContainer = document.querySelector("div._2nDUm");
            if (!progressBarContainer["autolingo_solve_button_inserted"]) {
                let button = window.createNodeFromText(/*html*/`<button class="_2l-C- _2kfEr _1nlVc _2fOC9 UCrz7 t5wFJ" title="Solve this problem" />`);
                button.addEventListener("click", handleSolve);
                progressBarContainer.insertBefore(button, progressBarContainer.querySelector("div[role='progressbar']"));
                progressBarContainer["autolingo_solve_button_inserted"] = true;
            };

            if (document.location.search.includes("autosolve") && !window.solvingInProcess) { handleSolve(); window.solvingInProcess = true; };

            break;

        case "BLAMING":
        case "COACH_DUO":
            if (document.location.search.includes("autosolve")) {
                await sleep(2000);
                DuolingoChallenge.clickButtonContinue();
                return handleSolve();
            }
            break;

        case "COACH_DUO_SLIDING":
        case "SLIDING":
            await sleep(1000);
            break;

        default:
            console.logger("Unknown lesson status: " + e.detail.currentStatus);
            throw new Error();
    }
})