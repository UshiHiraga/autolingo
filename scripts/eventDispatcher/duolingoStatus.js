// As Duolingo page doesn't refresh and only update its content, this code watchs all the posibles changes.
// When a change is detected, it dispatch an event.

let prevCourse = null;
let prevTab = null;

setInterval(() => {
    // Get general info from user.
    const pageData = window.getReactElement(document.querySelector("._3BJQ_"))?.return?.return?.return?.memoizedProps;
    const tab = pageData?.activeTab ?? "unknown";
    const course = pageData?.courses?.find((e) => e.isCurrent)?.courseId;

    if (prevTab !== tab || prevCourse !== course) {
        console.logger(tab)
        window.dispatchEvent(new CustomEvent("DuolingoRefresh", { detail: { tab, path: document.location.pathname } }));
    }

    prevCourse = course;
    prevTab = tab;
}, 50);