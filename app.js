/* =============================================================
   IXVYN / HOMEPAGE ENGINE
============================================================= */

"use strict";


/* =============================================================
   MOBILE NAVIGATION
============================================================= */

const menuButton = document.getElementById("menu-button");
const nav = document.getElementById("nav");

if (menuButton && nav) {

    menuButton.addEventListener("click", () => {

        const open = nav.classList.toggle("open");

        menuButton.classList.toggle("active", open);

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

    });


    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");
            menuButton.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =============================================================
   LOOP INTELLIGENCE
============================================================= */

const stages = document.querySelectorAll(".loop-stage");

const loopNumber = document.getElementById("loop-number");
const loopTitle = document.getElementById("loop-title");
const loopCopy = document.getElementById("loop-copy");

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

    stages.forEach(item => {
        item.classList.remove("active");
    });

    stage.classList.add("active");

    const key = stage.dataset.stage;
    const data = stageData[key];

    if (!data) return;

    if (loopNumber) {
        loopNumber.textContent = data.number;
    }

    if (loopTitle) {
        loopTitle.textContent = data.title;
    }

    if (loopCopy) {
        loopCopy.textContent = data.copy;
    }

}


stages.forEach(stage => {

    stage.addEventListener("click", () => {
        activateStage(stage);
    });

});


if (stages.length) {

    let currentStage = 0;

    activateStage(stages[0]);

    /*
       Automatic cycling is intentionally slow.
       The user can interrupt it by touching a stage.
    */

    const cycle = setInterval(() => {

        if (
            document.hidden ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        currentStage =
            (currentStage + 1) % stages.length;

        activateStage(stages[currentStage]);

    }, 4200);

}


/* =============================================================
   FIELD CANVAS
============================================================= */

const canvas = document.getElementById("world");

if (canvas) {

    const ctx = canvas.getContext("2d", {
        alpha: true
    });

    if (ctx) {

        let width = 0;
        let height = 0;
        let dpr = 1;

        let particles = [];

        let mouseX = 0.5;
        let mouseY = 0.5;

        let targetX = 0.5;
        let targetY = 0.5;

        let animationFrame = 0;

        const reducedMotion =
            window.matchMedia("(prefers-reduced-motion: reduce)");

        function resize() {

            dpr = Math.min(
                window.devicePixelRatio || 1,
                1.5
            );

            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

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


        function createParticles() {

            /*
               Keep mobile intentionally light.
            */

            const density =
                width < 700 ? 20 : 42;

            particles = [];

            for (let i = 0; i < density; i++) {

                particles.push({

                    x: Math.random() * width,
                    y: Math.random() * height,

                    radius:
                        Math.random() * 1.1 + .25,

                    alpha:
                        Math.random() * .35 + .08,

                    speed:
                        Math.random() * .12 + .025,

                    phase:
                        Math.random() * Math.PI * 2

                });

            }

        }


        function updatePointer(x, y) {

            targetX = x / width;
            targetY = y / height;

        }


        window.addEventListener(
            "pointermove",
            event => {

                updatePointer(
                    event.clientX,
                    event.clientY
                );

            },
            { passive: true }
        );


        window.addEventListener(
            "resize",
            resize,
            { passive: true }
        );


        function drawGrid(time) {

            const spacing =
                width < 700 ? 65 : 90;

            const offsetX =
                (mouseX - .5) * 12;

            const offsetY =
                (mouseY - .5) * 12;

            ctx.save();

            ctx.globalAlpha = .18;

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


        function drawParticles(time) {

            for (const particle of particles) {

                particle.y -= particle.speed;

                if (particle.y < -5) {
                    particle.y = height + 5;
                    particle.x = Math.random() * width;
                }

                const drift =
                    Math.sin(
                        time * .00035 +
                        particle.phase
                    ) * .35;

                const x =
                    particle.x +
                    drift +
                    (mouseX - .5) * 8;

                const y =
                    particle.y +
                    (mouseY - .5) * 8;

                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    particle.radius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    `rgba(184,255,101,${particle.alpha})`;

                ctx.fill();

            }

        }


        function drawSignal(time) {

            const cx =
                width * (.5 + (mouseX - .5) * .035);

            const cy =
                height * (.47 + (mouseY - .5) * .035);

            const radius =
                Math.min(width, height) *
                (width < 700 ? .24 : .27);

            const pulse =
                Math.sin(time * .001) * 5;

            ctx.save();

            /*
               Outer signal field
            */

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                radius + pulse,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                "rgba(184,255,101,.08)";

            ctx.lineWidth = 1;

            ctx.stroke();


            /*
               Inner signal
            */

            ctx.beginPath();

            ctx.arc(
                cx,
                cy,
                radius * .58,
                0,
                Math.PI * 2
            );

            ctx.strokeStyle =
                "rgba(184,255,101,.06)";

            ctx.stroke();


            /*
               Crosshair
            */

            ctx.strokeStyle =
                "rgba(184,255,101,.07)";

            ctx.beginPath();

            ctx.moveTo(cx - radius * 1.3, cy);
            ctx.lineTo(cx + radius * 1.3, cy);

            ctx.moveTo(cx, cy - radius * 1.3);
            ctx.lineTo(cx, cy + radius * 1.3);

            ctx.stroke();


            /*
               Rotating scan arc
            */

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

            ctx.lineWidth = 1.5;

            ctx.stroke();

            ctx.restore();

        }


        function render(time) {

            mouseX +=
                (targetX - mouseX) * .035;

            mouseY +=
                (targetY - mouseY) * .035;

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            drawGrid(time);
            drawParticles(time);
            drawSignal(time);

            if (!document.hidden) {

                animationFrame =
                    requestAnimationFrame(render);

            }

        }


        document.addEventListener(
            "visibilitychange",
            () => {

                if (document.hidden) {

                    cancelAnimationFrame(
                        animationFrame
                    );

                } else {

                    animationFrame =
                        requestAnimationFrame(render);

                }

            }
        );


        resize();

        if (!reducedMotion.matches) {

            animationFrame =
                requestAnimationFrame(render);

        }

    }

}


/* =============================================================
   MODULE HOVER / TOUCH FEEDBACK
============================================================= */

document.querySelectorAll(".module").forEach(module => {

    module.addEventListener(
        "pointerenter",
        () => {

            document.body.dataset.focus =
                module.dataset.module || "";

        }
    );

    module.addEventListener(
        "pointerleave",
        () => {

            delete document.body.dataset.focus;

        }
    );

});


/* =============================================================
   INITIALIZATION
============================================================= */

document.documentElement.classList.add("ixvyn-ready");

console.log(
    "%cIXVYN",
    "color:#b8ff65;font-weight:800;font-size:18px"
);

console.log(
    "Continuous civic intelligence initialized."
);
