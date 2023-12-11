import DuolingoChallenge from "./DuolingoChallenge.js";
import ReactUtils from "./ReactUtils.js";

export default class DuolingoSkill extends ReactUtils {
  constructor(skill_node) {
    super();

    this.skill_node = skill_node;
  }

  start = (start_button_selector, is_final_level) => {
    this.is_final_level = is_final_level;

    this.skill_node.children[0]?.click();
    document.querySelector(start_button_selector)?.click();

    // for legendary lessons
    if (this.is_final_level) {
      document
        .querySelector('[class="_3HhhB _2NolF _275sd _1ZefG _1M1mb _26QYy"]')
        ?.click(); // TODO find something more reliable
      document.querySelector('[class="WOZnx _275sd _1ZefG KJuUV"]')?.click();
    }

    setTimeout(() => {
      this.state_machine = setInterval(this.complete_challenge, 10);
    }, 1000);
  };

  startf() {
    setTimeout(() => {
      this.state_machine = setInterval(this.complete_challenge, 10);
    }, 1000);
  }

  startp() {
    document
      .querySelector('[class="WOZnx _275sd _1ZefG _2X5BQ _2TXAc"]')
      ?.click();
    this.startf();
  }

  end() {
    clearInterval(this.state_machine);
    this.current_challenge.end();
    console.logger("Lesson complete, stopping the autocompleter!");
  }

  complete_challenge = () => {
    // if you're on the home page, stop trying to complete the skill
    if (window.location.href.includes("duolingo.com/learn")) {
      this.end();
      return;
    }

    // else try to find the status and act accordingly
    const status_node = document.getElementsByClassName("mQ0GW")[0];
    if (!status_node) {
      console.logger("can't find status node!");
      return;
    }

    const status =
      this.ReactFiber(status_node).return.return.stateNode.props.player.status;

    console.logger(status);
 
  };
}
