// Copyright 2022 Awesomium team LLC. All Rights Reserved.

{
  function safeTimeout(func, duration) {
    setTimeout(func, duration);
  }

  function addClass(el, addClass) {
    if (typeof el == "number") {
      let elem = document.getElementById(el);
      elem.classList.add(addClass);
    } else {
      el.classList.add(addClass);
    }
  }

  function removeClass(el, remClass) {
    if (typeof el == "number") {
      let elem = document.getElementByID(el);
      elem.classList.remove(remClass);
    } else {
      el.classList.remove(remClass);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.remove("hidePage");
    let loadables = document.getElementsByClassName("loadable");
    for (let i = 0; i < loadables.length; i++) {
      let elem = loadables[i];
      let loadingClass = elem.getAttribute("anim-class");

      if (typeof loadingClass != "string") {
        return false;
      }

      let classes = loadingClass.split(" ");
      let animChildren = elem.getAttribute("anim-children");
      
      if (animChildren == "true") {
        animChildren = true;
      }

      if (animChildren) {
        let children = elem.children;

        for (let j = 0; j < children.length; j++) {
          let subElem = children[j];

          for (let subClass in classes) {
            addClass(subElem, classes[subClass]);
          }

          let transitionSettings = subElem.style.transition;
          subElem.style.transition = "all 0s";
          let startTime = subElem.getAttribute("loading-time");
          
          if (typeof startTime == "string") {
            startTime = Number(startTime) + 300;
          }

          safeTimeout(function () {
            subElem.style.transition = transitionSettings;
            for (let subClass in classes) {
              removeClass(subElem, classes[subClass]);
            }
          }, startTime || 300);
        }
      } else {

        for (let subClass in classes) {
          addClass(elem, classes[subClass]);
        }

        let transitionSettings = elem.style.transition;
        elem.style.transition = "all 0s";
        let startTime = elem.getAttribute("loading-time");

        if (typeof startTime == "string") {
          startTime = Number(startTime) + 300;
        }

        safeTimeout(function () {
          elem.style.transition = transitionSettings;
          
          for (let subClass in classes) {
            removeClass(elem, classes[subClass]);
          }
        }, startTime || 300);
      }
    }
  });
}
