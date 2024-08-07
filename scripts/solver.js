class DuolingoChallenge {
    constructor(internalInfo) {
        this.challengeInfo = internalInfo;
        this.challengeType = internalInfo.type;
    }

    static get isKeyboardEnabled() {
        // Parent object contains several information about current duolingo status;
        const parentNode = document.querySelector("#root > div > div");
        let parentObject = window.getReactElement(parentNode).return.pendingProps.challengeToggleState;	
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
            case "dialogue":
            case "readComprehension":
            case "characterIntro":
            case "characterSelect":
            case "selectPronunciation":
            case "select":
            case "assist":
            case "gapFill":
            case "reverseAssist":
            case "transliterationAssist":
                this.solveSelectCorrectIndexTypeProblems();
                break;

            case "characterMatch":
            case "match":
                await this.solveCharacterMatch();
                break;
            
            case "tapComplete":
            case "read_comprehension":
            case "translate":
            case "listenTap":
                this.constructor.isKeyboardEnabled ? this.solveWriteTextInSomeTextFieldTypeProblems() : await this.solveTapTextTypeProblems();
                break;

            case "transliterate":
                this.solveWriteTextInSomeTextFieldTypeProblems();
                break;

            case "speak":
                await sleep();
                this.constructor.clickButtonSkip();
                break;

            case "characterTrace":
            case "characterWrite":
                alert("The extension can't solve this problem. Please do it manually and we'll be able to continue.");
                console.logger("Waiting for user interaction");
                break;

            case "listenComprehension":
            case "listenIsolation":
                await this.solveListenIsolation();
                break;

            case "listen":
                this.writeTextInSpace();
                break;

            case "listenComplete":
            case "completeReverseTranslation":
                this.solveFromNearbyElements();
                break;
            case "partialReverseTranslate":
                this.solveFromNearbyElementsButForPartialReverseTranslate();
                break;

            //TODO: This is only commented because I don't have any problem to test it with
            // case "typeCloze":
            //     this.solveFromNearbyElementsButForTypeCloze();
            //     break;

            default:
                alert("Unknown problem type: " + this.challengeType);
                throw new Error(this.challengeType)
        }
    }
    solveFromNearbyElementsButForPartialReverseTranslate() {
        let correctAnswer = parent.document.querySelector("._31xxw._2eX9t._1vqO5").textContent
        let inputElement = parent.document.querySelector("._1N3bb._2kuqe._2eX9t._1eYfv._29omP");
        inputElement.textContent = correctAnswer;
    
        // Create a new 'input' event
        let event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
    
        // Dispatch the event
        inputElement.dispatchEvent(event);
    }

    solveFromNearbyElementsButForTypeCloze() {
        let correctAnswer = parent.document.querySelector(".caPDQ").textContent
        //remove first character
        correctAnswer = correctAnswer.substring(1, correctAnswer.length);
        let inputElement = parent.document.querySelector(".Y5JxA._17nEt");
        inputElement.textContent = correctAnswer;

        // Create a new 'input' event
        let event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        // Dispatch the event
        inputElement.dispatchEvent(event);
    } 

    solveFromNearbyElements() {
        let correctAnswer = parent.document.querySelector(".caPDQ").textContent

        //remove first and last character
        correctAnswer = correctAnswer.substring(1, correctAnswer.length - 1);

        let textField = this.constructor.getElementsByDataTest("challenge-text-input")[0];
        window.getReactElement(textField)?.pendingProps?.onChange({ target: { value: correctAnswer } });
    }

    async solveListenIsolation() {
        let correctIndex = this.challengeInfo.correctIndex;
        let correctButton = parent.document.querySelectorAll("._3C_oC")[correctIndex];
        correctButton.click();
        await sleep();
    }

    writeTextInSpace() {
        let bestSolution = this.challengeInfo.challengeResponseTrackingProperties.best_solution;
        let textField = this.constructor.getElementsByDataTest("challenge-translate-input")[0];
        window.getReactElement(textField)?.pendingProps?.onChange({ target: { value: bestSolution } });
    }

    async solveSelectCorrectIndexTypeProblems() {
        // This method clicks the correct button from an array of possible buttons.
        // It uses the "data-test" attribute to identify possible buttons.
        const dataTestByChallengeType = {
            "characterIntro": "challenge-judge-text",
            "characterSelect": "challenge-choice",
            "selectPronunciation": "challenge-choice",
            "select": "challenge-choice",
            "assist": "challenge-choice",
            "gapFill": "challenge-choice",
            "dialogue": "challenge-choice",
            "readComprehension": "challenge-choice",
            "reverseAssist": "challenge-choice",
            "transliterationAssist": "challenge-choice"
        }

        let correctIndex = this.challengeInfo.correctIndex;
        let dataTest = dataTestByChallengeType[this.challengeType];
        this.constructor.getElementsByDataTest(dataTest)[correctIndex].click();
        await sleep();
    }
    
    async solveCorrectIndicesTypeProblems(){
        let solutions = this.challengeInfo.correctIndices;
        let wordBank = this.constructor.getElementsByDataTest("word-bank")[0];
        let options = this.constructor.getElementsByDataTest("challenge-tap-token-text", wordBank);
        for (let i = 0; i < solutions.length; i++){
            options[solutions[i]].click();
            await sleep();
        }
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
                case "reverse_translate":
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

    async solveTapTextTypeProblems() {
        // This method clicks the correct button from an array of possible buttons in the order required.
        // It uses the "._3CBig" class to identify possible buttons.

        let correctTokens = this.challengeInfo.correctTokens ?? this.challengeInfo.prompt.split("") ?? this.challengeInfo.correctIndices;
        let wordBank = this.constructor.getElementsByDataTest("word-bank")[0];
        let buttonUnpressedClasses = wordBank.querySelector("button").classList.toString();
        for (let token of correctTokens) {
            let allPossibleButtons = Array.from(wordBank.querySelectorAll("button"));
            let avaibleButtons = allPossibleButtons.filter((e) => e.classList.toString() === buttonUnpressedClasses);
            let tokensText = this.extractTextFromNodes(avaibleButtons);

            tokensText[token].click();
            await sleep();
        }
    }

    async solveCharacterMatch() {
        // This method clicks the correct button from two arrays of possible buttons in the order required.
        // It uses the "._33Jbm" class to identify possible buttons.x
        let optionsContainer = document.querySelector("div[data-test*='challenge'] > div > div > div");
        let buttonUnpressedClasses = optionsContainer.querySelector("button").classList.toString();

        let solutionPairs = this.challengeInfo.pairs;
        for (let pair of solutionPairs) {
            let allOptionsNodes = Array.from(optionsContainer.querySelectorAll("span"));
            let optionNodes = allOptionsNodes.filter((e) => e.classList.toString() === buttonUnpressedClasses);
            let pairsNodeText = this.extractTextFromNodes(optionNodes);

            pairsNodeText[pair.fromToken ?? pair.transliteration].click();
            await sleep();
            pairsNodeText[pair.learningToken ?? pair.character].click();
            await sleep();
        }
    }
}