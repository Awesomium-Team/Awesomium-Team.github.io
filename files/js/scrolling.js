// Copyright 2022 Awesomium team LLC. All Rights Reserved.

{
    function safeTimeout(func, duration) {
        setTimeout(func, duration);
    }

    function addClass(el, addClass) {
         if (typeof(el) == "number") {
            let elem = document.getElementById(el);
            elem.classList.add(addClass);
        } else {
            el.classList.add(addClass);
        }
    }

    function removeClass(el, remClass) {
        if (typeof(el) == "number") {
            let elem = document.getElementById(el);
            elem.classList.remove(remClass);
        } else {
            el.classList.remove(remClass);
        }
    }

    let scrollables = document.getElementsByClassName("scrollable") || [];
    let viewpoint = window.innerHeight*0.8;

    let lastScroll = window.pageYOffset || document.documentElement.scrollTop

    window.addEventListener('load', (event) => {
        
        for (let i=0; i<scrollables.length; i++) {
            let elem = scrollables[i];

            let scrollingClass = elem.getAttribute("anim-class");

            let classes = scrollingClass.split(" ");

            if (typeof(scrollingClass) != 'string') {
                continue;
            }  

            let animChildren = elem.getAttribute("anim-children");

            if (animChildren == 'true') {
                animChildren = true;
            }

           if (animChildren) {
                let children = elem.children;

                for (let j=0; j<children.length; j++) {
                    let subElem = children[j];

                    let transitionSettings = subElem.style.transition;

                    subElem.style.transition = "all 0.01s";

                    safeTimeout(function () {
                        subElem.style.transition = transitionSettings;
                    }, 100);
                    

                    for (let subClass in classes) {
                        addClass(subElem, classes[subClass]);
                    }
                }
            } else {

                let transitionSettings = elem.style.transition;

                elem.style.transition = "all 0s";

                safeTimeout(function () {
                    elem.style.transition = transitionSettings;
                }, 100);
                
                for (let subClass in classes) {
                    addClass(elem, classes[subClass]);
                }
            }
        }

        safeTimeout(function() {
            window.dispatchEvent(new CustomEvent('scroll'));
        }, 300);
    })
    
    window.addEventListener('scroll', (event) => {

        let scrolled = document.body.scrollTop || document.documentElement.scrollTop;
        
        let dir = 0;

        if (scrolled > lastScroll) {
            dir = -1;
        } else {
            dir = 1;
        }

        lastScroll = 10;

        for (let i=0; i<scrollables.length; i++) {
            let elem = scrollables[i];

            let scrollingClass = elem.getAttribute("anim-class");

            let classes = scrollingClass.split(" ");

            if (typeof(scrollingClass) != 'string') {
                continue;
            }  

            let scrollOffset = elem.getAttribute("scroll-offset");

            if (typeof(scrollOffset) == 'string') {
                scrollOffset = window.innerHeight/100*Number(scrollOffset);
            } else {
                scrollOffset = 0;
            }

            let animChildren = elem.getAttribute("anim-children");

            if (animChildren == 'true') {
                animChildren = true;
            }

        	let bounding = elem.getBoundingClientRect()

        	if (bounding.top+scrollOffset < viewpoint && dir == -1) {

                if (animChildren) {
                    let children = elem.children;
                    for (let j=0; j<children.length; j++) {
                        let subElem = children[j];

                        let startTime = subElem.getAttribute("loading-time");

                        if (typeof(startTime) == 'string') {
                            startTime = Number(startTime);
                        }

                        setTimeout(function() {


                            for (let subClass in classes) {
                                if (!subElem.classList.contains(classes[subClass])) {
                                    continue;
                                }

                                removeClass(subElem, classes[subClass]);
                            }
    
                        }, startTime || 50);
                        

                    }
                } else {
                        let startTime = elem.getAttribute("loading-time");

                        if (typeof(startTime) == 'string') {
                            startTime = Number(startTime);
                        }

                        if (dir == -1) {
                            setTimeout(function() {
                                for (let subClass in classes) {

                                    if (!elem.classList.contains(classes[subClass])) {
                                        continue;
                                    }

                                    removeClass(elem, classes[subClass]);
                                }
        
                            }, startTime || 50);
                        }
                }
                
            } else {
                if (dir == 1) {
                    if (animChildren) {
                        let children = elem.children;
                        for (let j=0; j<children.length; j++) {
                            let subElem = children[j];

                            for (let subClass in classes) {
                                if (subElem.classList.contains(classes[subClass])) {
                                    continue;
                                }

                                addClass(subElem, classes[subClass]);
                            }
                        }
                    } else {
                        let children = elem.children;
                        for (let subClass in classes) {
                            if (elem.classList.contains(classes[subClass])) {
                                continue;
                            }

                            addClass(elem, classes[subClass]);
                        }
                    }
                }
        	}
        }
    })


    
    
}