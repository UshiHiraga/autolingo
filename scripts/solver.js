class DuolingoChallenge {
    constructor(internalInfo) {
        this.challengeInfo = internalInfo;
        this.challengeType = internalInfo.type;
    }

    static get isKeyboardEnabled() {
        // Parent object contains several information about current duolingo status;
        let parentObject = window.getReactElement(document.querySelector(".mQ0GW")).return.return.pendingProps.challengeToggleState;
        return (parentObject.canToggleTyping && parentObject.isToggledToTyping)
    }

    static getElementsByDataTest(dataTest, parent = window.document) {
        return Array.from(parent.querySelectorAll(`[data-test="${dataTest}"]`));
    }

    printDebugInfo() {
        window.console.logger("challengeType: " + this.challengeType);
        window.console.logger(this.challengeInfo);
    }

    extractTextFromNodes(nodes) {
        // From an array with nodes, it tries to get extract the user displayed in screen text.
        // Then, it returns an object with the text as the key and the node as the value.

        return Object.fromEntries(nodes.map((node) => {
            let rubyNode = node.querySelector("ruby");
            let nodeText = "";

            if (rubyNode) {
                nodeText = Array.from(rubyNode.querySelectorAll("span")).map((e) => e.textContent).join("");
            } else {
                let textOptionOne = this.constructor.getElementsByDataTest("challenge-tap-token-text", node)[0]?.textContent;
                let textOptionTwo = node.querySelector("[lang]")?.textContent;
                nodeText = textOptionOne ?? textOptionTwo;
            }

            return [nodeText, node];
        }));
    }

    // Methods for simulating user interaction.
    static clickButtonCheck() {
        this.getElementsByDataTest("player-next")[0].click();
    }

    static clickButtonContinue() {
        this.getElementsByDataTest("player-next")[0].click();
    }

    static clickButtonSkip() {
        this.getElementsByDataTest("player-skip")[0].click();
    }

    static insertText(textFieldDataTest, value) {
        let fieldText = this.getElementsByDataTest(textFieldDataTest)[0];
        window.getReactElement(fieldText)?.pendingProps?.onChange({ target: { value } });
    }

    // Methods for solving the problems.
    async solve() {
        switch (this.challengeType) {
            case "characterIntro":
            case "characterSelect":
            case "selectPronunciation":
            case "select":
            case "assist":
                this.solveSelectCorrectIndexTypeProblems();
                break;

            case "characterMatch":
            case "match":
                this.solveCharacterMatch();
                break;

            case "translate":
            case "listenTap":
                this.constructor.isKeyboardEnabled ? this.solveWriteTextInSomeTextFieldTypeProblems() : this.solveTapTextTypeProblems();
                break;

            case "transliterate":
                this.solveWriteTextInSomeTextFieldTypeProblems()
                break;

            case "speak":
            case "characterTrace":
                this.constructor.clickButtonSkip();
                break;

            default:
                alert("Unknown problem type: " + this.challengeType);
                throw new Error(this.challengeType)
        }
    }

    solveSelectCorrectIndexTypeProblems() {
        // This method clicks the correct button from an array of possible buttons.
        // It uses the "data-test" attribute to identify possible buttons.

        const dataTestByChallengeType = {
            "characterIntro": "challenge-judge-text",
            "characterSelect": "challenge-choice",
            "selectPronunciation": "challenge-choice",
            "select": "challenge-choice",
            "assist": "challenge-choice"
        }

        let correctIndex = this.challengeInfo.correctIndex;
        let dataTest = dataTestByChallengeType[this.challengeType];
        this.constructor.getElementsByDataTest(dataTest)[correctIndex].click();
    }

    solveWriteTextInSomeTextFieldTypeProblems() {
        // This method inserts a text inside some valid text field.
        // It uses "data-test" attribute to identify the text field.

        let specificTypeProblem = this.challengeInfo.challengeGeneratorIdentifier.specificType;
        let solution = (() => {
            switch (specificTypeProblem) {
                case "tap":
                case "listen_tap":
                    return this.challengeInfo.prompt;

                case "reverse_tap":
                case "transliterate":
                    return this.challengeInfo.correctSolutions[0];

                default:
                    alert("Unknown translate problem type: " + this.specificTranslateType);
                    throw new Error(this.specificTranslateType);
            }
        })();

        const dataTextByChallengeType = {
            "translate": "challenge-translate-input",
            "listenTap": "challenge-translate-input",
            "transliterate": "challenge-text-input"
        }

        let dataTest = dataTextByChallengeType[this.challengeType];
        this.constructor.insertText(dataTest, solution);
    }

    solveTapTextTypeProblems() {
        let correctTokens = this.challengeInfo.correctTokens ?? this.challengeInfo.prompt.split("");
        let tapTokens = Array.from(document.querySelectorAll("._1deIS"));
        let tokensText = this.extractTextFromNodes(tapTokens);
        correctTokens.forEach(async (token) => {
            await sleep();
            tokensText[token].click();
        });
    }

    solveCharacterMatch() {
        let optionNodes = Array.from(document.querySelectorAll("._1deIS"));

        let pairsNodeText = this.extractTextFromNodes(optionNodes);

        let solutionPairs = this.challengeInfo.pairs;

        solutionPairs.forEach(async (pair) => {
            pairsNodeText[pair.character]?.click();
            await sleep();
            pairsNodeText[pair.transliteration]?.click();
        });

    }

}