window.addEventListener("DuoligoRefresh", function (e) {

    if (e.detail.current_path !== "/learn") {
        return false;
    }

    alert("lateral scrip")




    let parr = Array.from(document.querySelectorAll("button[data-test*='skill-path-level-skill']"));
    let buttons = Array.from(document.querySelectorAll("button[data-test*='skill-path-level-skill']"));


    Array.from(document.querySelectorAll("div._31n11._3DQs0")).forEach((e) => {

        let info = window.getReactElement(e).return.pendingProps.level
        // console.logger(info);
        e.setAttribute("duolingo_id", info.id);

        let butt = e.querySelector("button");

        if (info.state === "active") {
            butt.addEventListener("click", (a) => {
                alert("Active button");
                console.logger(a);

                // let ary = document.querySelectorAll("div._31n11._3DQs0");
                // ary.find((e) => e.getAttribute("duolingo_id")

                let div_parent = a.target.parentElement.parentElement.parentElement.parentElement;
                console.logger(div_parent);
                

                // window.setTimeout(() => {
                //     let anode = window.createNodeFromText(/*html*/`
                //         <a class="_30qMV _2N_A5 _36Vd3 _16r-S KSXIb _2CJe1 _12StQ"
                //         data-test="skill-path-state-active skill-path-unit-test-57"
                //         href="/lesson">Autosolve</a>
                //     `)
                    
                //     let dd = div_parent.querySelector("div._1xmsI._3lZ4K")
                //     console.logger(dd);
                    
                //     dd.appendChild(anode);

                // }, 0)

            })
        }

        // info.state
        // active
        // passed
        // locked
        // unit_test


    })
});