window.addEventListener("DuoligoRefresh", function (e) {
    // Choose in which page we are located.
    switch (e.detail.current_path) {
        case "/learn":
            alert("Main page");
            break;

        case "/lesson":
        case "/practice":
        case "/alphabets/ja/katakana":
        case "/alphabets/ja/hiragana":
            console.logger("Lesson-like Page");
            window.setInterval(LessonPage, 5000);
            break;

        default:
            console.logger("Page not controlled.")
            break;
    }
});

function LessonPage() {
    const LESSON_PAGE_STATUS = window.getReactElement(document.querySelector("._3x0ok")).return.stateNode.props.player.status;
    console.logger(LESSON_PAGE_STATUS);

    switch (LESSON_PAGE_STATUS) {
        // Loading this lesson
        case "LOADING":
            break;

        // Little pop-up at the beginning of practice lessons
        case "SKILL_PRACTICE_SPLASH":
        case "CHECKPOINT_TEST_SPLASH":
        case "FINAL_LEVEL_DUO":
            // click START PRACTICE
            // this.current_challenge = new DuolingoChallenge();
            // this.current_challenge.click_next();
            break;

        // Little pop-up at the beginning of the practice that you start by clicking the weight icon in the bottom left
        case "SKILL_TEST_SPLASH":
        case "GLOBAL_PRACTICE_SPLASH":
            // this.current_challenge = new DuolingoChallenge();
            // this.current_challenge.click_next();
            break;

        // Waiting for answer for this challenge
        case "GUESSING":
            console.logger("Guessing");

            function handleSolve() {
                let current_challenge = new DuolingoChallenge();
                try {
                    current_challenge.solve();
                    current_challenge.click_next();
                    current_challenge.click_next();
                } catch (error) 
                    console.logger(error);
            }
    }

    const status_bar_container = document.querySelector("div._2LO8p._2nDUm");

    if (!status_bar_container["autolingo_solve_button_inserted"]) {

        // Insert button for solve this exercise.
        let button = window.createNodeFromText(/*html*/`
                <button class="_1eJKW _16r-S _2hiHn">
                    <img
                        class="_2hiHn _1fHYG"
                        src="https://w7.pngwing.com/pngs/201/17/png-transparent-metal-shield-graphy-illustration-icon-silver-shield-silver-shield-angle-photography-shields-thumbnail.png"
                    >
                </button>`);

        button.addEventListener("click", handleSolve);
        status_bar_container.insertBefore(button, status_bar_container.querySelector("div[role='progressbar']"));
        status_bar_container["autolingo_solve_button_inserted"] = true;
    };

    if (localStorage["autolingo_autosolve"]) {
        handleSolve();
    } else {
        console.logger("Not autosolving.");
    }

        // Showing the question before you can actually answer it
        case "SHOWING":
    break;

        // Grading this challenge
        case "GRADING":
        case "BLAMING":
    break;

        // Loading next challenge
        case "SLIDING":
        case "PARTIAL_XP_DUO_SLIDING":
    break;

        // Loading coach duo to give advice
        case "COACH_DUO_SLIDING":
        case "HARD_MODE_DUO_SLIDING":
    break;

        // Waiting to hit CONTINUE for coach duo's advice
        case "DOACH_DUO":
        case "COACH_DUO":
        case "HARD_MODE_DUO":
        case "PARTIAL_XP_DUO":
    // this.current_challenge = new DuolingoChallenge();
    // this.current_challenge.click_next();
    break;

        // Just finished the lesson, loading results
        case "COACH_DUO_SUBMITTING":
        case "SUBMITTING":
    break;

        // Results are here!
        case "END_CAROUSEL":
    //     if (this.is_final_level) {
    //         (
    //             document.querySelector('[data-test="cta-button"]') ||
    //             document.querySelector('[data-test="continue-final-level"]')
    //         )?.click();
    //     } else {
    //         this.current_challenge = new DuolingoChallenge();
    //         this.current_challenge.click_next();
    //         this.current_challenge.click_next();
    //         this.current_challenge.click_next();
    //     }
    break;

        // Little ad that pops up
        case "PLUS_AD":
    // this.current_challenge = new DuolingoChallenge();
    // this.current_challenge.click_next();
    break;

        // When they give you a little info before the lesson
        case "PRE_LESSON_TIP_SPLASH":
        case "GRAMMAR_SKILL_SPLASH":
    // document.querySelector("[data-test=player-next]")?.click();
    // Array.from(document.querySelectorAll("span")).forEach((e) => {
    // if (e.innerText.toLowerCase().includes("start lesson")) {
    // e?.click();
    // }
    // });
    break;
        default:
    console.logger("UNKNOWN STATUS: " + LESSON_PAGE_STATUS);
    // this.end();
    break;
}

function MainPage() {
    
}