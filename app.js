"use strict";


/* =============================================================
   MOBILE NAVIGATION
============================================================= */

const menuButton =
    document.getElementById("menu-button");

const nav =
    document.getElementById("nav");


if (menuButton && nav) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                nav.classList.toggle("open");

            menuButton.classList.toggle(
                "active",
                isOpen
            );

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    nav.querySelectorAll("a").forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove("open");

                    menuButton.classList.remove(
                        "active"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =============================================================
   LOOP INTELLIGENCE
============================================================= */

const stages =
    document.querySelectorAll(".loop-stage");

const loopNumber =
    document.getElementById("loop-number");

const loopTitle =
    document.getElementById("loop-title");

const loopCopy =
    document.getElementById("loop-copy");


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


function activateStage(stage) {

    if (!stage) return;


    stages.forEach(
        item => {

            item.classList.remove("active");

        }
    );


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

}


/* =============================================================
   LOOP AUTO-CYCLE
============================================================= */

let currentStage = 0;

let loopTimer = null;


function startLoopCycle() {

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        return;

    }


    if (loopTimer) {

        clearInterval(loopTimer);

    }


    loopTimer =
        setInterval(
            () => {

                if (
                    document.hidden ||
                    !stages.length
                ) {

                    return;

                }


                currentStage =
                    (
                        currentStage + 1
                    )
                    %
                    stages.length;


                activateStage(
                    stages[currentStage]
                );

            },
            4200
        );

}


stages.forEach(
    (stage, index) => {

        stage.addEventListener(
            "click",
            () => {

                currentStage =
                    index;

                activateStage(stage);

            }
        );

    }
);


if (stages.length) {

    activateStage(
        stages[0]
    );

    startLoopCycle();

}


/* =============================================================
   POINTER / TOUCH FIELD
============================================================= */

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

        let particles = [];

        let pointerX = .5;

        let pointerY = .5;

        let targetX = .5;

        let targetY = .5;

        let animationFrame = 0;


        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );


        /* =====================================================
           RESIZE
        ====================================================== */

        function resize() {

            dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    1.5
                );


            width =
                window.innerWidth;


            height =
                window.innerHeight;


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

        }


        /* =====================================================
           PARTICLES
        ====================================================== */

        function createParticles() {

            const amount =
                width < 700
                    ? 18
                    : 42;


            particles = [];


            for (
                let i = 0;
                i < amount;
                i++
            ) {

                particles.push({

                    x:
                        Math.random()
                        * width,

                    y:
                        Math.random()
                        * height,

                    radius:
                        Math.random()
                        * 1.1
                        + .25,

                    alpha:
                        Math.random()
                        * .28
                        + .06,

                    speed:
                        Math.random()
                        * .12
                        + .025,

                    phase:
                        Math.random()
                        * Math.PI
                        * 2

                });

            }

        }


        /* =====================================================
           POINTER
        ====================================================== */

        function updatePointer(
            x,
            y
        ) {

            targetX =
                Math.max(
                    0,
                    Math.min(
                        1,
                        x / width
                    )
                );


            targetY =
                Math.max(
                    0,
                    Math.min(
                        1,
                        y / height
                    )
                );


            document.documentElement
                .style
                .setProperty(
                    "--pointer-x",
                    targetX
                );


            document.documentElement
                .style
                .setProperty(
                    "--pointer-y",
                    targetY
                );

        }


        window.addEventListener(
            "pointermove",
            event => {

                updatePointer(
                    event.clientX,
                    event.clientY
                );

            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "touchmove",
            event => {

                const touch =
                    event.touches?.[0];


                if (!touch) return;


                updatePointer(
                    touch.clientX,
                    touch.clientY
                );

            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            resize,
            {
                passive: true
            }
        );


        /* =====================================================
           GRID
        ====================================================== */

        function drawGrid() {

            const spacing =
                width < 700
                    ? 65
                    : 90;


            const offsetX =
                (pointerX - .5)
                * 12;


            const offsetY =
                (pointerY - .5)
                * 12;


            ctx.save();


            ctx.globalAlpha =
                .18;


            ctx.strokeStyle =
                "rgba(184,255,101,.09)";


            ctx.lineWidth = 1;


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


        /* =====================================================
           PARTICLE FIELD
        ====================================================== */

        function drawParticles(time) {

            for (
                const particle
                of particles
            ) {

                particle.y -=
                    particle.speed;


                if (
                    particle.y < -5
                ) {

                    particle.y =
                        height + 5;

                    particle.x =
                        Math.random()
                        * width;

                }


                const drift =
                    Math.sin(
                        time * .00035
                        + particle.phase
                    )
                    * .35;


                const x =
                    particle.x
                    + drift
                    + (
                        pointerX
                        - .5
                    )
                    * 8;


                const y =
                    particle.y
                    + (
                        pointerY
                        - .5
                    )
                    * 8;


                ctx.beginPath();


                ctx.arc(
                    x,
                    y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    `rgba(
                        184,
                        255,
                        101,
                        ${particle.alpha}
                    )`;


                ctx.fill();

            }

        }


        /* =====================================================
           INTELLIGENT SIGNAL FIELD
        ====================================================== */

        function drawSignal(time) {

            const maxScroll =
                Math.max(
                    document.documentElement
                        .scrollHeight
                    - window.innerHeight,
                    1
                );


            const scroll =
                window.scrollY
                / maxScroll;


            /*
               0 → scattered observation

               0.3 → convergence

               0.6 → connected system

               1 → recurring loop
            */

            const progress =
                Math.min(
                    Math.max(
                        scroll * 2.4,
                        0
                    ),
                    1
                );


            const cx =
                width *
                (
                    .5
                    +
                    (
                        pointerX
                        - .5
                    )
                    * .035
                );


            const cy =
                height *
                (
                    .47
                    +
                    (
                        pointerY
                        - .5
                    )
                    * .035
                );


            const baseRadius =
                Math.min(
                    width,
                    height
                )
                *
                (
                    width < 700
                        ? .24
                        : .27
                );


            const radius =
                baseRadius
                *
                (
                    1
                    + progress * .28
                );


            const pulse =
                Math.sin(
                    time * .001
                )
                * 5;


            ctx.save();


            /* =================================================
               FIELD
            ================================================== */

            ctx.beginPath();


            ctx.arc(
                cx,
                cy,
                radius + pulse,
                0,
                Math.PI * 2
            );


            ctx.strokeStyle =
                `rgba(
                    184,
                    255,
                    101,
                    ${.08 + progress * .1}
                )`;


            ctx.lineWidth = 1;

            ctx.stroke();


            /* =================================================
               SECONDARY FIELD
            ================================================== */

            ctx.beginPath();


            ctx.arc(
                cx,
                cy,
                radius *
                (
                    .58
                    + progress * .18
                ),
                0,
                Math.PI * 2
            );


            ctx.strokeStyle =
                "rgba(184,255,101,.06)";


            ctx.stroke();


            /* =================================================
               CROSS AXIS
            ================================================== */

            ctx.strokeStyle =
                "rgba(184,255,101,.065)";


            ctx.beginPath();


            ctx.moveTo(
                cx - radius * 1.35,
                cy
            );


            ctx.lineTo(
                cx + radius * 1.35,
                cy
            );


            ctx.moveTo(
                cx,
                cy - radius * 1.35
            );


            ctx.lineTo(
                cx,
                cy + radius * 1.35
            );


            ctx.stroke();


            /* =================================================
               SIGNAL TRACES
            ================================================== */

            const signalCount =
                width < 700
                    ? 6
                    : 10;


            for (
                let i = 0;
                i < signalCount;
                i++
            ) {

                const angle =
                    (
                        i
                        / signalCount
                    )
                    * Math.PI
                    * 2;


                const distance =
                    radius
                    *
                    (
                        1.15
                        +
                        Math.sin(
                            time * .00045
                            + i * 1.7
                        )
                        * .12
                    );


                const startX =
                    cx
                    +
                    Math.cos(angle)
                    * distance;


                const startY =
                    cy
                    +
                    Math.sin(angle)
                    * distance;


                const convergence =
                    progress * .76;


                const endX =
                    startX
                    +
                    (
                        cx
                        - startX
                    )
                    * convergence;


                const endY =
                    startY
                    +
                    (
                        cy
                        - startY
                    )
                    * convergence;


                ctx.beginPath();


                ctx.moveTo(
                    startX,
                    startY
                );


                const controlX =
                    (
                        startX
                        + endX
                    ) / 2
                    +
                    Math.sin(
                        time * .0005
                        + i
                    )
                    * 30;


                const controlY =
                    (
                        startY
                        + endY
                    ) / 2
                    +
                    Math.cos(
                        time * .0004
                        + i
                    )
                    * 30;


                ctx.quadraticCurveTo(
                    controlX,
                    controlY,
                    endX,
                    endY
                );


                ctx.strokeStyle =
                    `rgba(
                        184,
                        255,
                        101,
                        ${.06 + progress * .2}
                    )`;


                ctx.lineWidth =
                    progress > .5
                        ? 1.2
                        : .7;


                ctx.stroke();

            }


            /* =================================================
               CONVERGENCE NODE
            ================================================== */

            const nodeRadius =
                3
                +
                progress * 7;


            ctx.beginPath();


            ctx.arc(
                cx,
                cy,
                nodeRadius,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(
                    184,
                    255,
                    101,
                    ${.5 + progress * .4}
                )`;


            ctx.shadowBlur =
                12
                +
                progress * 22;


            ctx.shadowColor =
                "rgba(184,255,101,.8)";


            ctx.fill();


            /* =================================================
               INTERPRETATION RING
            ================================================== */

            if (
                progress > .25
            ) {

                const interpretationRadius =
                    radius
                    *
                    (
                        .72
                        +
                        progress * .18
                    );


                const rotation =
                    time * .00015;


                ctx.beginPath();


                ctx.arc(
                    cx,
                    cy,
                    interpretationRadius,
                    rotation,
                    rotation
                    + Math.PI * .7
                );


                ctx.strokeStyle =
                    `rgba(
                        184,
                        255,
                        101,
                        ${progress * .35}
                    )`;


                ctx.lineWidth =
                    1.5;


                ctx.stroke();

            }


            /* =================================================
               SCAN ARC
            ================================================== */

            const angle =
                time * .00018;


            ctx.beginPath();


            ctx.arc(
                cx,
                cy,
                radius * 1.12,
                angle,
                angle + .55
            );


            ctx.strokeStyle =
                "rgba(184,255,101,.28)";


            ctx.lineWidth =
                1.5;


            ctx.stroke();


            ctx.restore();

        }


        /* =====================================================
           RENDER LOOP
        ====================================================== */

        function render(time) {

            pointerX +=
                (
                    targetX
                    - pointerX
                )
                * .035;


            pointerY +=
                (
                    targetY
                    - pointerY
                )
                * .035;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            drawGrid();

            drawParticles(time);

            drawSignal(time);


            if (
                !document.hidden
            ) {

                animationFrame =
                    requestAnimationFrame(
                        render
                    );

            }

        }


        /* =====================================================
           VISIBILITY
        ====================================================== */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {

                    cancelAnimationFrame(
                        animationFrame
                    );

                } else if (
                    !reducedMotion.matches
                ) {

                    animationFrame =
                        requestAnimationFrame(
                            render
                        );

                }

            }
        );


        /* =====================================================
           START
        ====================================================== */

        resize();


        if (
            !reducedMotion.matches
        ) {

            animationFrame =
                requestAnimationFrame(
                    render
                );

        }

    }

}


/* =============================================================
   EVIDENCE FIELD — SIGNAL CONVERGENCE
============================================================= */

const evidenceField =
    document.querySelector(
        ".evidence-field"
    );


if (evidenceField) {

    const evidenceItems =
        evidenceField.querySelectorAll(
            ":scope > span"
        );


    function resetEvidence() {

        evidenceItems.forEach(
            item => {

                item.style.transform = "";

                item.style.color = "";

            }
        );

    }


    evidenceField.addEventListener(
        "pointermove",
        event => {

            const rect =
                evidenceField
                    .getBoundingClientRect();


            const x =
                event.clientX
                - rect.left;


            const y =
                event.clientY
                - rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            evidenceItems.forEach(
                (
                    item,
                    index
                ) => {

                    const itemRect =
                        item.getBoundingClientRect();


                    const itemX =
                        itemRect.left
                        - rect.left;


                    const itemY =
                        itemRect.top
                        - rect.top;


                    const dx =
                        (
                            centerX
                            - itemX
                        )
                        * .06;


                    const dy =
                        (
                            centerY
                            - itemY
                        )
                        * .06;


                    const pointerInfluence =
                        (
                            index % 2 === 0
                                ? 1
                                : .65
                        );


                    item.style.transform =
                        `translate(
                            ${dx * pointerInfluence}px,
                            ${dy * pointerInfluence}px
                        )`;


                    item.style.color =
                        "rgba(184,255,101,.42)";

                }
            );

        },
        {
            passive: true
        }
    );


    evidenceField.addEventListener(
        "pointerleave",
        resetEvidence
    );

}


/* =============================================================
   MODULE INTERACTION
============================================================= */

const modules =
    document.querySelectorAll(
        ".module"
    );


modules.forEach(
    module => {

        module.addEventListener(
            "pointerenter",
            () => {

                document.body.dataset.focus =
                    module.dataset.module
                    || "";

            }
        );


        module.addEventListener(
            "pointerleave",
            () => {

                delete
                    document.body
                        .dataset
                        .focus;

            }
        );

    }
);


/* =============================================================
   PAGE INITIALIZATION
============================================================= */

document.documentElement
    .classList
    .add("ixvyn-ready");


console.log(
    "%cIXVYN",
    "color:#b8ff65;font-weight:800;font-size:18px"
);

console.log(
    "Continuous civic intelligence initialized."
);
