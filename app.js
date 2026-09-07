"use strict";

/* ============================================================
   IXVYN — CIVIC INSTRUMENT ENGINE

   Architecture:

   pointer
       ↓
   field
       ↓
   scroll
       ↓
   convergence
       ↓
   interpretation
       ↓
   recurrence

   Lightweight Canvas.
   No libraries.
   Mobile-aware.
============================================================ */


/* ============================================================
   MOBILE NAVIGATION
============================================================ */

const menuButton =
    document.getElementById("menu-button");

const nav =
    document.getElementById("nav");

if (menuButton && nav) {

    menuButton.addEventListener("click", () => {

        const open =
            nav.classList.toggle("open");

        menuButton.classList.toggle(
            "active",
            open
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

    });


    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            menuButton.classList.remove(
                "active"
            );

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* ============================================================
   LOOP INTELLIGENCE
============================================================ */

const stages =
    document.querySelectorAll(".loop-stage");

const loopNumber =
    document.getElementById("loop-number");

const loopTitle =
    document.getElementById("loop-title");

const loopCopy =
    document.getElementById("loop-copy");

const loopCore =
    document.getElementById("loop-core");


const stageData = {

    OBSERVE: {
        number: "01",
        title: "OBSERVE",
        copy:
            "Capture what is actually visible without prematurely deciding what it means."
    },

    ASSESS: {
        number: "02",
        title: "ASSESS",
        copy:
            "Synthesize observable evidence into safety signals while preserving uncertainty."
    },

    DECIDE: {
        number: "03",
        title: "DECIDE",
        copy:
            "Explore intervention possibilities while keeping the human decision-maker in control."
    },

    ACT: {
        number: "04",
        title: "ACT",
        copy:
            "Turn an approved decision into structured civic action that can move beyond the interface."
    },

    LEARN: {
        number: "05",
        title: "LEARN",
        copy:
            "Preserve location history, re-observe the street and measure whether conditions changed."
    }

};


let currentStage = 0;


function activateStage(stage) {

    if (!stage) return;

    stages.forEach(item => {

        item.classList.remove("active");

    });


    stage.classList.add("active");


    const key =
        stage.dataset.stage;

    const data =
        stageData[key];

    if (!data) return;


    if (loopNumber) {
        loopNumber.textContent =
            data.number;
    }

    if (loopTitle) {
        loopTitle.textContent =
            data.title;
    }

    if (loopCopy) {
        loopCopy.textContent =
            data.copy;
    }


    /*
       Make the core react to the active
       instrument.
    */

    if (loopCore) {

        const intensity =
            currentStage === 0
                ? 1
                : 1.08;

        loopCore.style.transform =
            `translate(-50%, -50%) scale(${intensity})`;

    }

}


stages.forEach((stage, index) => {

    stage.addEventListener(
        "click",
        () => {

            currentStage = index;

            activateStage(stage);

        }
    );

});


/* ============================================================
   AUTO LOOP
============================================================ */

let loopTimer = null;

const reduceMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


function startLoopCycle() {

    if (reduceMotion.matches) {
        return;
    }

    if (loopTimer) {
        clearInterval(loopTimer);
    }

    loopTimer =
        setInterval(() => {

            if (
                document.hidden ||
                !stages.length
            ) {
                return;
            }

            currentStage =
                (
                    currentStage + 1
                ) % stages.length;

            activateStage(
                stages[currentStage]
            );

        }, 4200);

}


if (stages.length) {

    activateStage(stages[0]);

    startLoopCycle();

}


/* ============================================================
   GLOBAL POINTER STATE
============================================================ */

let pointerTargetX = .5;
let pointerTargetY = .5;

let pointerX = .5;
let pointerY = .5;


function setPointer(x, y) {

    pointerTargetX =
        Math.max(
            0,
            Math.min(
                1,
                x / Math.max(window.innerWidth, 1)
            )
        );

    pointerTargetY =
        Math.max(
            0,
            Math.min(
                1,
                y / Math.max(window.innerHeight, 1)
            )
        );


    document.documentElement.style
        .setProperty(
            "--pointer-x",
            pointerTargetX
        );

    document.documentElement.style
        .setProperty(
            "--pointer-y",
            pointerTargetY
        );

}


window.addEventListener(
    "pointermove",
    event => {

        setPointer(
            event.clientX,
            event.clientY
        );

    },
    {
        passive: true
    }
);


/*
   Touch movement deliberately uses a light
   response. We do NOT hijack scrolling.
*/

window.addEventListener(
    "touchmove",
    event => {

        const touch =
            event.touches?.[0];

        if (!touch) return;

        setPointer(
            touch.clientX,
            touch.clientY
        );

    },
    {
        passive: true
    }
);


/* ============================================================
   SCROLL INTELLIGENCE
============================================================ */

let scrollProgress = 0;

let scrollVelocity = 0;

let lastScrollY =
    window.scrollY;

let lastScrollTime =
    performance.now();


function updateScrollState() {

    const maxScroll =
        Math.max(
            document.documentElement.scrollHeight
                - window.innerHeight,
            1
        );

    const now =
        performance.now();

    const current =
        window.scrollY;

    const delta =
        current - lastScrollY;

    const dt =
        Math.max(
            now - lastScrollTime,
            1
        );

    scrollVelocity =
        Math.max(
            -1,
            Math.min(
                1,
                (delta / dt) * 16
            )
        );

    scrollProgress =
        Math.max(
            0,
            Math.min(
                1,
                current / maxScroll
            )
        );

    lastScrollY = current;
    lastScrollTime = now;

}


window.addEventListener(
    "scroll",
    updateScrollState,
    {
        passive: true
    }
);

updateScrollState();


/* ============================================================
   EVIDENCE FIELD
   Fragmented → converged.
============================================================ */

const evidenceField =
    document.querySelector(
        ".evidence-field"
    );

if (evidenceField) {

    const evidenceItems =
        evidenceField.querySelectorAll(
            ":scope > span"
        );


    function updateEvidenceField() {

        const rect =
            evidenceField.getBoundingClientRect();

        const viewport =
            window.innerHeight;

        /*
           0 = field is below viewport
           1 = field is central in viewport
           2 = field has passed
        */

        const center =
            rect.top + rect.height / 2;

        const distance =
            Math.abs(
                viewport / 2 - center
            );

        const visibility =
            Math.max(
                0,
                1 -
                distance /
                (viewport * .85)
            );


        /*
           The closer the field gets
           to the observer, the more
           signals converge.
        */

        const convergence =
            Math.max(
                0,
                Math.min(
                    1,
                    visibility
                )
            );


        evidenceItems.forEach(
            (item, index) => {

                const rectItem =
                    item.getBoundingClientRect();

                const itemX =
                    rectItem.left
                    - rect.left
                    + rectItem.width / 2;

                const itemY =
                    rectItem.top
                    - rect.top
                    + rectItem.height / 2;


                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;


                const dx =
                    centerX - itemX;

                const dy =
                    centerY - itemY;


                /*
                   Scattered state:
                   labels remain where they are.

                   Converged state:
                   labels are gently pulled
                   toward the intelligence node.
                */

                const pull =
                    convergence * .82;


                const offsetX =
                    dx * pull;

                const offsetY =
                    dy * pull;


                const depth =
                    (
                        index % 3
                    ) * .45;


                item.style.transform =
                    `translate3d(
                        ${offsetX}px,
                        ${offsetY}px,
                        0
                    ) scale(
                        ${1 + convergence * .08}
                    )`;


                item.style.color =
                    convergence > .55
                        ? "rgba(184,255,101,.42)"
                        : "";


                item.style.opacity =
                    .55 +
                    convergence * .45;

            });


        const centerNode =
            evidenceField.querySelector(
                ".evidence-center"
            );

        if (centerNode) {

            const scale =
                .92 +
                convergence * .25;

            centerNode.style.transform =
                `translate(-50%, -50%) scale(${scale})`;

        }

    }


    window.addEventListener(
        "scroll",
        updateEvidenceField,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        updateEvidenceField,
        {
            passive: true
        }
    );

    updateEvidenceField();

}


/* ============================================================
   MODULE HOVER / TOUCH STATE
============================================================ */

const modules =
    document.querySelectorAll(".module");

modules.forEach(module => {

    module.addEventListener(
        "pointerenter",
        () => {

            document.body.classList.add(
                "instrument-active"
            );

        }
    );

    module.addEventListener(
        "pointerleave",
        () => {

            document.body.classList.remove(
                "instrument-active"
            );

        }
    );

});


/* ============================================================
   WORLD CANVAS
============================================================ */

const canvas =
    document.getElementById("world");


if (canvas) {

    const ctx =
        canvas.getContext(
            "2d",
            {
                alpha: true
            }
        );


    if (ctx) {

        let width = 0;
        let height = 0;
        let dpr = 1;

        let animationFrame = 0;

        let particles = [];
        let signalNodes = [];


        /*
           Adaptive quality.
           Phones get fewer objects.
        */

        const isMobile =
            window.matchMedia(
                "(max-width: 700px)"
            );


        function qualityAmount() {

            if (isMobile.matches) {
                return 24;
            }

            if (window.innerWidth < 1200) {
                return 38;
            }

            return 58;

        }


        /* ====================================================
           RESIZE
        ==================================================== */

        function resize() {

            width =
                window.innerWidth;

            height =
                window.innerHeight;


            dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    isMobile.matches ? 1.15 : 1.5
                );


            canvas.width =
                Math.floor(
                    width * dpr
                );

            canvas.height =
                Math.floor(
                    height * dpr
                );

            canvas.style.width =
                `${width}px`;

            canvas.style.height =
                `${height}px`;


            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );


            createParticles();
            createSignalNodes();

        }


        /* ====================================================
           PARTICLES
        ==================================================== */

        function createParticles() {

            const amount =
                qualityAmount();

            particles = [];

            for (
                let i = 0;
                i < amount;
                i++
            ) {

                particles.push({

                    x:
                        Math.random() * width,

                    y:
                        Math.random() * height,

                    z:
                        Math.random(),

                    radius:
                        .25 +
                        Math.random() * 1.05,

                    alpha:
                        .035 +
                        Math.random() * .25,

                    drift:
                        .025 +
                        Math.random() * .12,

                    phase:
                        Math.random()
                        * Math.PI
                        * 2

                });

            }

        }


        /* ====================================================
           SIGNAL NODES
        ==================================================== */

        function createSignalNodes() {

            const amount =
                isMobile.matches
                    ? 7
                    : 11;

            signalNodes = [];

            for (
                let i = 0;
                i < amount;
                i++
            ) {

                signalNodes.push({

                    angle:
                        (
                            i / amount
                        ) *
                        Math.PI *
                        2,

                    distance:
                        .38 +
                        Math.random() * .28,

                    wobble:
                        Math.random()
                        * Math.PI
                        * 2,

                    speed:
                        .00012 +
                        Math.random()
                        * .00012

                });

            }

        }


        /* ====================================================
           BACKGROUND GRID
        ==================================================== */

        function drawGrid() {

            const spacing =
                isMobile.matches
                    ? 72
                    : 92;


            const offsetX =
                (
                    pointerX - .5
                ) * 13;

            const offsetY =
                (
                    pointerY - .5
                ) * 13;


            ctx.save();

            ctx.strokeStyle =
                "rgba(184,255,101,.055)";

            ctx.lineWidth = 1;

            ctx.globalAlpha = .45;


            for (
                let x = -spacing;
                x < width + spacing;
                x += spacing
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    x + offsetX,
                    0
                );

                ctx.lineTo(
                    x + offsetX,
                    height
                );

                ctx.stroke();

            }


            for (
                let y = -spacing;
                y < height + spacing;
                y += spacing
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    0,
                    y + offsetY
                );

                ctx.lineTo(
                    width,
                    y + offsetY
                );

                ctx.stroke();

            }


            ctx.restore();

        }


        /* ====================================================
           DEPTH PARTICLES
        ==================================================== */

        function drawParticles(time) {

            particles.forEach(
                particle => {

                    particle.y -=
                        particle.drift;

                    if (
                        particle.y < -8
                    ) {

                        particle.y =
                            height + 8;

                        particle.x =
                            Math.random()
                            * width;

                    }


                    const depth =
                        .35 +
                        particle.z * .65;


                    const x =
                        particle.x
                        +
                        (
                            pointerX - .5
                        )
                        * 10
                        * depth;


                    const y =
                        particle.y
                        +
                        (
                            pointerY - .5
                        )
                        * 10
                        * depth;


                    const pulse =
                        1 +
                        Math.sin(
                            time * .001
                            + particle.phase
                        ) * .18;


                    ctx.beginPath();

                    ctx.arc(
                        x,
                        y,
                        particle.radius
                        * pulse
                        * depth,
                        0,
                        Math.PI * 2
                    );


                    ctx.fillStyle =
                        `rgba(
                            184,
                            255,
                            101,
                            ${particle.alpha * depth}
                        )`;

                    ctx.fill();

                }
            );

        }


        /* ====================================================
           INTELLIGENT FIELD
        ==================================================== */

        function drawIntelligenceField(time) {

            /*
               Instead of a decorative circle,
               this is a field with states.

               top of page:
               scattered

               middle:
               convergence

               lower:
               connected

               final:
               recurrence
            */

            const progress =
                Math.min(
                    1,
                    Math.max(
                        0,
                        scrollProgress * 1.8
                    )
                );


            const centerX =
                width *
                (
                    .5
                    +
                    (
                        pointerX - .5
                    ) * .045
                );


            const centerY =
                height *
                (
                    .49
                    +
                    (
                        pointerY - .5
                    ) * .045
                );


            const base =
                Math.min(
                    width,
                    height
                );


            const radius =
                base *
                (
                    isMobile.matches
                        ? .24
                        : .28
                )
                *
                (
                    .9 +
                    progress * .32
                );


            ctx.save();


            /*
               ---------------------------------------------
               DEPTH RINGS
            ---------------------------------------------
            */

            for (
                let layer = 0;
                layer < 3;
                layer++
            ) {

                const layerRadius =
                    radius *
                    (
                        .62 +
                        layer * .24
                    );


                ctx.beginPath();

                ctx.arc(
                    centerX,
                    centerY,
                    layerRadius,
                    0,
                    Math.PI * 2
                );


                ctx.strokeStyle =
                    `rgba(
                        184,
                        255,
                        101,
                        ${.035 + progress * .055}
                    )`;

                ctx.lineWidth =
                    layer === 1
                        ? 1.1
                        : .7;

                ctx.stroke();

            }


            /*
               ---------------------------------------------
               AXIS
            ---------------------------------------------
            */

            ctx.strokeStyle =
                "rgba(184,255,101,.065)";

            ctx.lineWidth = 1;

            ctx.beginPath();

            ctx.moveTo(
                centerX - radius * 1.45,
                centerY
            );

            ctx.lineTo(
                centerX + radius * 1.45,
                centerY
            );

            ctx.moveTo(
                centerX,
                centerY - radius * 1.45
            );

            ctx.lineTo(
                centerX,
                centerY + radius * 1.45
            );

            ctx.stroke();


            /*
               ---------------------------------------------
               SIGNAL TRAJECTORIES
            ---------------------------------------------
            */

            signalNodes.forEach(
                (node, index) => {

                    const animatedAngle =
                        node.angle
                        +
                        time
                        * node.speed;


                    const wobble =
                        Math.sin(
                            time * .00045
                            + node.wobble
                        )
                        * .045;


                    const outerDistance =
                        radius *
                        (
                            node.distance
                            + wobble
                        );


                    const startX =
                        centerX
                        +
                        Math.cos(
                            animatedAngle
                        )
                        * outerDistance;


                    const startY =
                        centerY
                        +
                        Math.sin(
                            animatedAngle
                        )
                        * outerDistance;


                    /*
                       This is the important bit.

                       Progressively pull the endpoint
                       toward the interpretation node.
                    */

                    const convergence =
                        progress
                        * .82;


                    const endX =
                        startX
                        +
                        (
                            centerX -
                            startX
                        )
                        * convergence;


                    const endY =
                        startY
                        +
                        (
                            centerY -
                            startY
                        )
                        * convergence;


                    const curve =
                        Math.sin(
                            time * .00035
                            + index
                        )
                        * (
                            18 +
                            progress * 25
                        );


                    const midX =
                        (
                            startX +
                            endX
                        ) / 2
                        +
                        Math.cos(
                            animatedAngle
                        )
                        * curve;


                    const midY =
                        (
                            startY +
                            endY
                        ) / 2
                        +
                        Math.sin(
                            animatedAngle
                        )
                        * curve;


                    ctx.beginPath();

                    ctx.moveTo(
                        startX,
                        startY
                    );

                    ctx.quadraticCurveTo(
                        midX,
                        midY,
                        endX,
                        endY
                    );


                    ctx.strokeStyle =
                        `rgba(
                            184,
                            255,
                            101,
                            ${.035 + progress * .17}
                        )`;

                    ctx.lineWidth =
                        .6 +
                        progress * .7;

                    ctx.stroke();


                    /*
                       Signal origin node.
                    */

                    ctx.beginPath();

                    ctx.arc(
                        startX,
                        startY,
                        1.4 +
                        progress * .9,
                        0,
                        Math.PI * 2
                    );

                    ctx.fillStyle =
                        `rgba(
                            184,
                            255,
                            101,
                            ${.18 + progress * .32}
                        )`;

                    ctx.fill();

                }
            );


            /*
               ---------------------------------------------
               INTERPRETATION FIELD
            ---------------------------------------------
            */

            if (progress > .18) {

                const interpretation =
                    radius *
                    (
                        .7 +
                        progress * .2
                    );


                const rotation =
                    time * .00016;


                ctx.beginPath();

                ctx.arc(
                    centerX,
                    centerY,
                    interpretation,
                    rotation,
                    rotation +
                    Math.PI * .82
                );


                ctx.strokeStyle =
                    `rgba(
                        184,
                        255,
                        101,
                        ${progress * .32}
                    )`;

                ctx.lineWidth = 1.5;

                ctx.stroke();


                ctx.beginPath();

                ctx.arc(
                    centerX,
                    centerY,
                    interpretation * .82,
                    rotation + Math.PI,
                    rotation +
                    Math.PI * 1.62
                );

                ctx.strokeStyle =
                    `rgba(
                        184,
                        255,
                        101,
                        ${progress * .16}
                    )`;

                ctx.stroke();

            }


            /*
               ---------------------------------------------
               CENTRAL INTELLIGENCE NODE
            ---------------------------------------------
            */

            const nodeRadius =
                3 +
                progress * 6;


            const pulse =
                Math.sin(
                    time * .0013
                ) * 1.8;


            ctx.beginPath();

            ctx.arc(
                centerX,
                centerY,
                nodeRadius + pulse,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "rgba(184,255,101,.9)";

            ctx.shadowBlur =
                12 +
                progress * 25;

            ctx.shadowColor =
                "rgba(184,255,101,.75)";

            ctx.fill();


            /*
               ---------------------------------------------
               SCAN ARC
            ---------------------------------------------
            */

            const scanAngle =
                time * .0002;


            ctx.beginPath();

            ctx.arc(
                centerX,
                centerY,
                radius * 1.12,
                scanAngle,
                scanAngle + .48
            );

            ctx.strokeStyle =
                "rgba(184,255,101,.28)";

            ctx.lineWidth = 1.4;

            ctx.stroke();


            ctx.restore();

        }


        /* ====================================================
           RECURRENCE FIELD
        ==================================================== */

        function drawRecurrence(time) {

            /*
               Becomes more visible toward the bottom
               of the page.

               This makes the final section feel like
               the system is returning to the street.
            */

            const recurrence =
                Math.max(
                    0,
                    (scrollProgress - .58)
                    / .42
                );


            if (recurrence <= 0) {
                return;
            }


            const cx =
                width / 2;

            const cy =
                height * .53;


            const radius =
                Math.min(
                    width,
                    height
                )
                * (
                    .24 +
                    recurrence * .16
                );


            ctx.save();

            ctx.globalAlpha =
                recurrence * .42;


            for (
                let i = 0;
                i < 2;
                i++
            ) {

                ctx.beginPath();

                ctx.arc(
                    cx,
                    cy,
                    radius *
                    (
                        1 +
                        i * .45
                    ),
                    time * .00015
                    + i,
                    time * .00015
                    + i
                    + Math.PI * 1.35
                );

                ctx.strokeStyle =
                    "rgba(184,255,101,.2)";

                ctx.lineWidth =
                    i === 0
                        ? 1.2
                        : .7;

                ctx.stroke();

            }


            ctx.restore();

        }


        /* ====================================================
           RENDER
        ==================================================== */

        function render(time) {

            /*
               Smooth pointer.
            */

            pointerX +=
                (
                    pointerTargetX -
                    pointerX
                ) * .045;


            pointerY +=
                (
                    pointerTargetY -
                    pointerY
                ) * .045;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            drawGrid();

            drawParticles(time);

            drawIntelligenceField(time);

            drawRecurrence(time);


            if (!document.hidden) {

                animationFrame =
                    requestAnimationFrame(
                        render
                    );

            }

        }


        /* ====================================================
           VISIBILITY
        ==================================================== */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (document.hidden) {

                    cancelAnimationFrame(
                        animationFrame
                    );

                } else if (
                    !reduceMotion.matches
                ) {

                    animationFrame =
                        requestAnimationFrame(
                            render
                        );

                }

            }
        );


        /* ====================================================
           START
        ==================================================== */

        resize();


        window.addEventListener(
            "resize",
            resize,
            {
                passive: true
            }
        );


        if (!reduceMotion.matches) {

            animationFrame =
                requestAnimationFrame(
                    render
                );

        }

    }

}


/* ============================================================
   FINAL SEQUENCE — MOBILE FLOW
============================================================ */

const finalSequence =
    document.querySelector(
        ".final-sequence"
    );


if (finalSequence) {

    /*
       The HTML remains untouched.

       On small screens we use CSS wrapping,
       but we also expose the current loop
       position through a subtle class.
    */

    const sequenceItems =
        finalSequence.querySelectorAll(
            "span"
        );


    function updateFinalSequence() {

        const maxScroll =
            Math.max(
                document.documentElement.scrollHeight
                    - window.innerHeight,
                1
            );

        const progress =
            window.scrollY / maxScroll;


        const active =
            Math.min(
                sequenceItems.length - 1,
                Math.floor(
                    progress *
                    sequenceItems.length
                )
            );


        sequenceItems.forEach(
            (item, index) => {

                item.style.opacity =
                    index <= active
                        ? "1"
                        : ".55";

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateFinalSequence,
        {
            passive: true
        }
    );

    updateFinalSequence();

}


/* ============================================================
   INITIAL POINTER
============================================================ */

document.documentElement.style
    .setProperty(
        "--pointer-x",
        ".5"
    );

document.documentElement.style
    .setProperty(
        "--pointer-y",
        ".5"
    );
