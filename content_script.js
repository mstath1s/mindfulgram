(function () {
  'use strict';
  const throttle = (func, timeFrame) => {
    let lastTime = 0;
    let timeoutId;
    const throttledFunc = () => {
      const timeSinceLastCall = Date.now() - lastTime;
      const runFunc = () => {
        func();
        lastTime = Date.now();
        timeoutId = undefined;
      };
      if (timeSinceLastCall >= timeFrame) {
        clearTimeout(timeoutId);
        runFunc();
      } else if (!timeoutId) timeoutId = window.setTimeout(runFunc, timeFrame - timeSinceLastCall);
    };
    return throttledFunc;
  };

  const nukeExploreAndReelsPage = () => {
    const _URL = new URL(window.location.href);
    const pathname = _URL.pathname;
    const main = document.querySelector("main");
    const exploreRootPath = "/explore/";
    const reelsRootPath = "/reels/";
    if (pathname === exploreRootPath || pathname.startsWith(reelsRootPath)) {
      if (main) {
        main.style.display = "none";
        return;
      }
    }
    if (main) main.style.display = "flex";
  };

  const nukeStories = () => {
    const stories = Array.from(document.querySelectorAll('button[aria-label^="Story by"]'));
    stories.forEach((elem) => elem.style.visibility = "hidden");
  };

  const nukePostsFromPeopleYouDontFollow = () => {
    const posts = Array.from(document.querySelectorAll('article[role="presentation"]'));
    const _URL2 = new URL(window.location.href);
    const pathname = _URL2.pathname;
    const unwantedPosts = posts.filter((post) => {
      if (pathname !== "/") return false; // if you're not on the root page, don't hide
      const followButton = post.querySelector('button') && post.querySelector('button').textContent.toLowerCase() === "follow";
      const header = post.querySelector("header");
      const suggestedText = post.querySelector('span') && post.querySelector('span').textContent.includes("Suggested for you");
      if (followButton) {
        console.log("Hiding post because of follow button", post);
        return true; // if you don't follow the person, hide
      }
      if (header && header.textContent && header.textContent.toLowerCase().includes("paid partnership")) {
        console.log("Hiding post because of paid partnership", post);
        return true; // if it is an ad, obviously, hide
      }
      if (suggestedText) {
        console.log("Hiding post because of Suggested for you", post);
        return true; // if it is a suggested post, hide
      }
      return false; // default to not hiding
    });
    unwantedPosts.forEach((elem) => elem.style.display = "none");
  };

  const nukeCommentsOnFeed = () => {
    const comments = Array.from(document.querySelectorAll('article[role="presentation"] button svg[aria-label="Like"], article[role="presentation"] button svg[aria-label="Unlike"]'));
    comments.forEach((post) => {
      const btn = post.closest("button");
      const elmToHide = btn && btn.parentElement && btn.parentElement.parentElement && btn.parentElement.parentElement.parentElement && btn.parentElement.parentElement.parentElement.parentElement;
      if (elmToHide) {
        const roleAttribute = elmToHide.getAttribute("role");
        if (roleAttribute !== "presentation") elmToHide.style.visibility = "hidden";
      }
    });
  };

  const nukeCommentsOnPostPage = () => {
    const comments = Array.from(document.querySelectorAll('article[role="presentation"] ul ul'));
    comments.forEach((elem) => elem.style.visibility = "hidden");
  };

  const nukeCommentsOnCommentsPage = () => {
    const _URL3 = new URL(window.location.href);
    const pathname = _URL3.pathname;
    if (pathname.endsWith("/comments/")) {
      const moreComments = Array.from(document.querySelectorAll("h3"));
      moreComments.forEach((elem) => {
        const grandParent = elem.parentElement && elem.parentElement.parentElement && elem.parentElement.parentElement.parentElement;
        if (grandParent) grandParent.style.visibility = "hidden";
      });
    }
  };

  const main = () => {
    nukeExploreAndReelsPage();
    nukeStories();
    nukePostsFromPeopleYouDontFollow();
    nukeCommentsOnFeed();
    nukeCommentsOnPostPage();
    nukeCommentsOnCommentsPage();
  };

  const exportMain = () => {
    const throttledMain = throttle(main, 250);
    const observer = new MutationObserver(() => throttledMain());
    observer.observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
    });
  };

  exportMain();
})();
