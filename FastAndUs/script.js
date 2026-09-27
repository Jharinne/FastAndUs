import * as THREE from "https://esm.sh/three@0.160.0";

import { OrbitControls } from
"https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const startButton = document.getElementById("startButton");
const intro = document.getElementById("intro");
const experience = document.getElementById("experience");

startButton.addEventListener("click", () => {
    intro.style.display = "none";
    experience.style.display = "block";

    if (!musicPlaying) {

    music.play();

    musicPlaying = true;
}

    init();
});

/* =====================================================
   HISTORIA
===================================================== */

const chapters = [

    {
        title: "EL COMIENZO",
        short: "THE BEGINNING",
        image: "img/eclipse.jpg",

        text: 'Nuestra historia comenzó en la línea de salida más inesperada de todas: la etapa del colegio. En ese entonces no sabíamos el viaje que nos esperaba, pero justo ahí, antes de que el semáforo se pusiera en verde, se encendieron los motores de algo que cambiaría mi vida para siempre.'
    },

    {
        title: "CONEXIÓN",
        short: "THE CONNECTION",
        image: "img/supra.jpg",

        text: 'Conocerte no fue una casualidad del destino, fue un choque gravitacional. Conectamos de una manera interestelar, rompiendo la física de cualquier órbita conocida. Entre momentos compartidos, nuestras almas sintonizaron en una frecuencia única, un lazo tan fuerte que ni el tiempo ni la distancia lograrían desgastar.'
    },

    {
        title: "CAMBIO DE MARCHA",
        short: "UNIVERSITY",
        image: "img/skyline.jpg",

        text: 'Llegó la universidad y la carrera se volvió más rápida y exigente. Nuevos retos, más responsabilidades y un cambio de marcha obligatorio para adaptarnos al camino. A pesar de todo, saber que estabas en mi misma pista hacía que cualquier obstáculo fuera mucho más fácil de superar.'
    },

    {
        title: "EN PRIMERA FILA",
        short: "GROWING TOGETHER",
        image: "img/rx7.jpg",

        text: 'Una de las partes más hermosas de este viaje ha sido ser testigo en primera fila de tu evolución. Nos vimos crecer paso a paso, tropezar y levantarnos. Ver cómo esos adolescentes del colegio se transformaban en las personas maduras y decididas que somos hoy es el recuerdo más valioso que guardo en mi guantera.'
    },

    {
        title: "EL EQUIPO",
        short: "THE TEAM",
        image: "img/charger.jpg",

        text: 'Madurar no significó perder la chispa; significó aprender a cuidar el motor de lo que construimos. Fuimos puliendo los detalles, aprendiendo a escucharnos y convirtiéndonos en el mejor equipo de mecánicos para nuestra propia historia. Crecimos en direcciones que noshicieron encajar aún mejor.'
    },

    {
        title: "RUTAS SEPARADAS",
        short: "SEPARATE ROADS",
        image: "img/350z.jpg",

        text: 'Si bien hubo un tramo del camino donde el destino nos obligó a tomar curvas separadas y transitar por rutas diferentes, nunca nos perdimos de vista. Aunque el mapa nos alejara físicamente por un tiempo, en el fondo sabíamos que el asfalto nos volvería a unir.'
    },

    {
        title: "A DISTANCIA",
        short: "STILL CONNECTED",
        image: "img/escort.jpg",

        text: 'Porque la verdad es que, incluso en la distancia, siempre estuvimos compartiendo la carrera de la vida. Tu nombre era mi combustible en los días difíciles y mis victorias se sentían vacías si no estabas para celebrarlas. El hilo que nos une nunca se estiró lo suficiente como para romperse.'
    },

    {
        title: "EL REGRESO",
        short: "THE RETURN",
        image: "img/gt86.jpg",

        text: 'Cuando nuestras rutas volvieron a cruzarse, fue como entrar a boxes a recargar energías después de una larga vuelta. Volver a mirarte a los ojos fue confirmar que, sin importar cuántas vueltas dé el mundo, tú sigues siendo mi puerto seguro y mi copiloto favorito.'
    },

    {
        title: "A TODA VELOCIDAD",
        short: "RIGHT NOW",
        image: "img/chevelle.jpg",

        text: 'Hoy estamos aquí, con el motor rugiendo más fuerte que nunca y la mirada fija en el horizonte. Dejamos atrás las curvas difíciles y los baches del camino para consolidar una historia que ya no le teme a ninguna tormenta. Qué privilegio es seguir acelerando a tu lado.'
    },

    {
        title: "SIN LÍMITES",
        short: "TO INFINITY",
        image: "img/lykan.jpg",

        text: 'Ahora nuestra pista ya no tiene límites terrenales; se extiende por toda la galaxia. Estamos listos para continuar esta carrera hasta el infinito y más allá, conquistando constelaciones enteras y demostrando que lo nuestro es eterno. Te amo, mi conductor favorito, gracias por ser mi mejor viaje.'
    },

    {
        title: "NUESTRO AUTO",
        short: "FAST & US",
        image: "img/nuestro-auto.jpg",

        text: 'La saga tiene máquinas increíbles, pero el último auto de la lista es el más legendario de todos: el nuestro. No vino de ninguna fábrica ni salió en ninguna película; lo estamos construyendo nosotros mismos día a día, con cada risa, cada abrazo y cada promesa hecha realidad. Su motor está hecho de nuestra historia y su combustible es este amor que no conoce límites. Con él estamos listos para seguir devorando kilómetros en la carretera de la vida, sin frenos, sin mirar atrás y siempre juntos.'
    }

];


/* =====================================================
   VARIABLES
===================================================== */

let scene;
let camera;
let renderer;
let controls;

let galaxy;
let road;

let cars = [];
let particles = [];
let nebulaParticles = [];

let currentIndex = 0;

let hoveredCar = null;
let selectedCar = null;

let cameraMoving = false;

let cameraStart = new THREE.Vector3();
let cameraDestination = new THREE.Vector3();

let targetStart = new THREE.Vector3();
let targetDestination = new THREE.Vector3();

let cameraProgress = 0;
let returningCamera = false;

let clock = new THREE.Clock();

const container = document.getElementById("scene-container");


/* =====================================================
   AUDIO
===================================================== */

const music = new Audio("music.mp3");

music.loop = true;
music.volume = 0.45;

let musicPlaying = false;


/* =====================================================
   INIT
===================================================== */

function init() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x020204);

    scene.fog = new THREE.FogExp2(
        0x020204,
        0.012
    );


    /* CAMERA */

    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(
        0,
        8,
        34
    );


    /* RENDERER */

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);


    /* CONTROLS */

    controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;

    controls.dampingFactor = .05;

    controls.minDistance = 15;

    controls.maxDistance = 65;

    controls.maxPolarAngle = Math.PI * .85;

    controls.target.set(
        0,
        0,
        0
    );


    createLights();

    createGalaxy();

    createRoad();

    createStars();

    createNebula();

    createCars();

    createShootingHeart();


    window.addEventListener(
        "resize",
        onResize
    );

    if (window.shootingHeart) {

    const heart =
        window.shootingHeart;

    heart.position.x +=
        heart.userData.speed;

    heart.position.y -=
        heart.userData.speed * .08;

    /* vuelve a aparecer */

    if (heart.position.x > 18) {

        heart.position.x = -18;

        heart.position.y = 13;
    }
}

    renderer.domElement.addEventListener(
        "pointermove",
        onPointerMove
    );

    renderer.domElement.addEventListener(
        "click",
        onSceneClick
    );


    animate();
}


/* =====================================================
   LIGHTS
===================================================== */

function createLights() {

    const ambient = new THREE.AmbientLight(
        0xffffff,
        0.4
    );

    scene.add(ambient);


    const redLight = new THREE.PointLight(
        0xff2020,
        18,
        50
    );

    redLight.position.set(
        0,
        3,
        0
    );

    scene.add(redLight);


    const blueLight = new THREE.PointLight(
        0x334cff,
        8,
        60
    );

    blueLight.position.set(
        -20,
        10,
        -20
    );

    scene.add(blueLight);
}


/* =====================================================
   GALAXIA
===================================================== */
function createRoad() {

    const roadGeometry =
        new THREE.RingGeometry(
            7,
            11,
            128
        );

    const roadMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x050509,

            side: THREE.DoubleSide,

            transparent: true,

            opacity: .9
        });

    road =
        new THREE.Mesh(
            roadGeometry,
            roadMaterial
        );

    road.rotation.x =
        -Math.PI / 2;

    scene.add(road);


    /* ROAD LIGHTS */

    const lightGeometry =
        new THREE.BufferGeometry();

    const lightPositions = [];

    for (let i = 0; i < 120; i++) {

        const angle =
            Math.random() *
            Math.PI * 2;

        const radius =
            7.2 +
            Math.random() * 3.5;

        lightPositions.push(
            Math.cos(angle) * radius,
            .05,
            Math.sin(angle) * radius
        );
    }

    lightGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            lightPositions,
            3
        )
    );

    const lightMaterial =
        new THREE.PointsMaterial({

            color: 0x20eaff,

            size: .12,

            transparent: true,

            opacity: .8,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });

    const roadLights =
        new THREE.Points(
            lightGeometry,
            lightMaterial
        );

    scene.add(roadLights);
}

function createGalaxy() {

    galaxy = new THREE.Group();

    scene.add(galaxy);


    const geometry =
        new THREE.BufferGeometry();

    const positions = [];

    const colors = [];

    const count = 30000;


    for (let i = 0; i < count; i++) {

        const radius =
            Math.pow(
                Math.random(),
                .55
            ) * 38;

        const angle =
            radius * .32 +
            Math.random() * Math.PI * 2;

        const spiral =
            Math.sin(angle * 2.2) *
            radius *
            .12;

        const x =
            Math.cos(angle) *
            radius +
            spiral;

        const z =
            Math.sin(angle) *
            radius;

        const y =
            (Math.random() - .5) *
            Math.max(
                .4,
                radius * .35
            );

        positions.push(x, y, z);


const color =
    new THREE.Color();

const mix =
    Math.random();

if (mix < .40) {

    /* BLANCO */

    const brightness =
        .82 + Math.random() * .18;

    color.setRGB(
        brightness,
        brightness,
        brightness
    );

} else if (mix < .58) {

    /* TURQUESA BRILLANTE */

    color.setRGB(
        .15,
        1 + Math.random() * .1,
        1 + Math.random() * .05
    );

} else if (mix < .78) {

    /* AZUL TURQUESA */

    color.setRGB(
        .15,
        .75 + Math.random() * .2,
        1
    );

} else if (mix < .92) {

    /* AZUL HIELO */

    color.setRGB(
        .55,
        .8 + Math.random() * .2,
        1
    );

} else {

    /* BLANCO AZULADO */

    color.setRGB(
        .35,
        .9,
        1
    );

}

        colors.push(
            color.r,
            color.g,
            color.b
        );
    }


    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );

    geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(
            colors,
            3
        )
    );


 const starCanvas =
    document.createElement("canvas");

starCanvas.width = 64;
starCanvas.height = 64;

const starContext =
    starCanvas.getContext("2d");

const starGradient =
    starContext.createRadialGradient(
        32,
        32,
        0,
        32,
        32,
        32
    );

starGradient.addColorStop(
    0,
    "rgba(255,255,255,1)"
);

starGradient.addColorStop(
    .18,
    "rgba(255,255,255,.9)"
);

starGradient.addColorStop(
    .6,
    "rgba(255,255,255,.55)"
);

starGradient.addColorStop(
    1,
    "rgba(255,255,255,0)"
);

starContext.fillStyle =
    starGradient;

starContext.fillRect(
    0,
    0,
    64,
    64
);


const starTexture =
    new THREE.CanvasTexture(
        starCanvas
    );


const material =
    new THREE.PointsMaterial({

        size: .18,

        map: starTexture,

        vertexColors: true,

        transparent: true,

        opacity: .9,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false,

        alphaTest: .01
    });

    const points =
        new THREE.Points(
            geometry,
            material
        );

    galaxy.add(points);

    const brightMaterial =
    new THREE.PointsMaterial({

        map: starTexture,

        size: .1,

        color: 0x7fffff,

        transparent: true,

        opacity: 1,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false
    });

const brightStars =
    new THREE.Points(
        geometry,
        brightMaterial
    );

galaxy.add(brightStars);

/* GALACTIC CORE */

/* WHITE HOT CENTER */

const coreGeometry =
    new THREE.SphereGeometry(
        1.7,
        64,
        64
    );

const coreMaterial =
    new THREE.MeshBasicMaterial({

        color: 0xffffff
    });

const core =
    new THREE.Mesh(
        coreGeometry,
        coreMaterial
    );

galaxy.add(core);


/* TURQUOISE INNER GLOW */

const innerGlowGeometry =
    new THREE.SphereGeometry(
        3.5,
        64,
        64
    );

const innerGlowMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x38fff2,

        transparent: true,

        opacity: .16,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false
    });

const innerGlow =
    new THREE.Mesh(
        innerGlowGeometry,
        innerGlowMaterial
    );

galaxy.add(innerGlow);


/* BLUE GALACTIC GLOW */

const glowGeometry =
    new THREE.SphereGeometry(
        5.5,
        64,
        64
    );

const glowMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x168cff,

        transparent: true,

        opacity: .09,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false
    });

const glow =
    new THREE.Mesh(
        glowGeometry,
        glowMaterial
    );

galaxy.add(glow);


/* OUTER TURQUOISE HALO */

const haloGeometry =
    new THREE.SphereGeometry(
        8,
        64,
        64
    );

const haloMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x00e5ff,

        transparent: true,

        opacity: .055,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false
    });

const halo =
    new THREE.Mesh(
        haloGeometry,
        haloMaterial
    );

galaxy.add(halo);
}

/* =====================================================
   ESTRELLAS
===================================================== */

function createStars() {

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];

    for (let i = 0; i < 3500; i++) {

        const radius =
            70 + Math.random() * 100;

        const theta =
            Math.random() *
            Math.PI * 2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );

        positions.push(

            radius *
            Math.sin(phi) *
            Math.cos(theta),

            radius *
            Math.sin(phi) *
            Math.sin(theta),

            radius *
            Math.cos(phi)
        );
    }


    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0xffffff,

            size: .12,

            transparent: true,

            opacity: .9
        });


    const starField =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(starField);

    particles.push(starField);
}


/* =====================================================
   NEBULOSA
===================================================== */

function createNebula() {

    const geometry =
        new THREE.BufferGeometry();

    const positions = [];

    const colors = [];


    for (let i = 0; i < 1800; i++) {

        const radius =
            25 + Math.random() * 40;

        const angle =
            Math.random() *
            Math.PI * 2;

        const x =
            Math.cos(angle) *
            radius;

        const z =
            Math.sin(angle) *
            radius;

        const y =
            (Math.random() - .5) *
            18;


        positions.push(
            x,
            y,
            z
        );


        const color =
            new THREE.Color();

        if (Math.random() > .5) {

            color.set(
                0x462060
            );

        } else {

            color.set(
                0x161f68
            );
        }

        colors.push(
            color.r,
            color.g,
            color.b
        );
    }


    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );

    geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(
            colors,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            size: .7,

            vertexColors: true,

            transparent: true,

            opacity: .1,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const nebula =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(nebula);

    nebulaParticles.push(nebula);
}


/* =====================================================
   AUTOS
===================================================== */

function createCars() {

    const textureLoader =
        new THREE.TextureLoader();


    const radius = 13;


    chapters.forEach(
        (chapter, index) => {

            const texture =
                textureLoader.load(
                    chapter.image
                );

            texture.colorSpace =
                THREE.SRGBColorSpace;


            const material =
                new THREE.MeshBasicMaterial({

                    map: texture,

                    transparent: true,

                    side: THREE.DoubleSide,

                   depthTest: false
                });


            const geometry =
                new THREE.PlaneGeometry(
                    index === 10 ? 5.5 : 4.3,
                    index === 10 ? 3.1 : 2.6
                );


            const car =
                new THREE.Mesh(
                    geometry,
                    material
                );


            const angle =
                (index / chapters.length) *
                Math.PI * 2;


            car.userData.index =
                index;

            car.userData.baseAngle =
                angle;

            car.userData.baseY =
                index === 10
                    ? 2
                    : Math.sin(index) * .5;


            car.position.set(

                Math.cos(angle) *
                    radius,

                car.userData.baseY,

                Math.sin(angle) *
                    radius
            );


            car.lookAt(
                0,
                0,
                0
            );


            if (index === 10) {

                createFinalAura(car);

            }

            car.renderOrder = 10;
            scene.add(car);

            cars.push(car);
        }
    );
}


/* =====================================================
   AURA AUTO FINAL
===================================================== */

function createFinalAura(car) {

    /* AURA CIRCULAR TURQUESA */

    const auraGeometry =
        new THREE.CircleGeometry(
            3.5,
            64
        );

    const auraMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x00fff0,

            transparent: true,

            opacity: .18,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false,

            side: THREE.DoubleSide
        });

    const aura =
        new THREE.Mesh(
            auraGeometry,
            auraMaterial
        );

    aura.position.copy(
        car.position
    );

   aura.rotation.copy(
    car.rotation
);

    aura.renderOrder = 8;

    scene.add(aura);


    /* HALO EXTERIOR */

    const haloGeometry =
        new THREE.CircleGeometry(
            5,
            64
        );

    const haloMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x20aaff,

            transparent: true,

            opacity: .07,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false,

            side: THREE.DoubleSide
        });

    const halo =
        new THREE.Mesh(
            haloGeometry,
            haloMaterial
        );

    halo.position.copy(
        car.position
    );

    halo.rotation.copy(
    car.rotation
);

    halo.renderOrder = 7;

    scene.add(halo);
}
function createShootingHeart() {

    const heartGroup =
        new THREE.Group();

    scene.add(heartGroup);


    /* ❤️ FORMA DEL CORAZÓN */

    const heartShape =
        new THREE.Shape();

    heartShape.moveTo(0, 0);

    heartShape.bezierCurveTo(
        -0.45, 0.45,
        -1.0, 0.05,
        0, -0.75
    );

    heartShape.bezierCurveTo(
        1.0, 0.05,
        0.45, 0.45,
        0, 0
    );

    const heartGeometry =
        new THREE.ShapeGeometry(
            heartShape
        );

    const heartMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x8ffff8,

            transparent: true,

            opacity: 1,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false,

            side: THREE.DoubleSide
        });

    const heart =
        new THREE.Mesh(
            heartGeometry,
            heartMaterial
        );

    heart.scale.set(
        1.25,
        1.25,
        1.25
    );

    heartGroup.add(heart);


    /* ✨ HALO DEL CORAZÓN */

   const glowCanvas =
    document.createElement("canvas");

glowCanvas.width = 128;
glowCanvas.height = 128;

const glowContext =
    glowCanvas.getContext("2d");

const gradient =
    glowContext.createRadialGradient(
        64,
        64,
        0,
        64,
        64,
        64
    );

gradient.addColorStop(
    0,
    "rgba(255,255,255,1)"
);

gradient.addColorStop(
    .12,
    "rgba(100,255,245,.9)"
);

gradient.addColorStop(
    .35,
    "rgba(0,255,240,.35)"
);

gradient.addColorStop(
    .7,
    "rgba(0,220,255,.10)"
);

gradient.addColorStop(
    1,
    "rgba(0,255,240,0)"
);

glowContext.fillStyle =
    gradient;

glowContext.fillRect(
    0,
    0,
    128,
    128
);

const glowTexture =
    new THREE.CanvasTexture(
        glowCanvas
    );

const glowGeometry =
    new THREE.PlaneGeometry(
        5,
        5
    );

const glowMaterial =
    new THREE.MeshBasicMaterial({

        map: glowTexture,

        transparent: true,

        opacity: .65,

        blending:
            THREE.AdditiveBlending,

        depthWrite: false,

        side: THREE.DoubleSide
    });

const glow =
    new THREE.Mesh(
        glowGeometry,
        glowMaterial
    );

heartGroup.add(glow);

   


    /* 🌌 COLA DE LA ESTRELLA */

        /* ✨ COLA DE PARTÍCULAS */

    const particleCount = 45;

    const particleGeometry =
        new THREE.BufferGeometry();

    const particlePositions = [];
    const particleSizes = [];

    for (let i = 0; i < particleCount; i++) {

        const t =
            i / particleCount;

        /* más dispersión cuanto más lejos */

        const spread =
            t * 1.8;

        particlePositions.push(
            -t * 5,
            t * .9 +
                (Math.random() - .5) * spread,
            (Math.random() - .5) * spread
        );

        particleSizes.push(
            .35 * (1 - t) +
            .04
        );
    }

    particleGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            particlePositions,
            3
        )
    );

    particleGeometry.setAttribute(
        "size",
        new THREE.Float32BufferAttribute(
            particleSizes,
            1
        )
    );


    const particleMaterial =
        new THREE.PointsMaterial({

            color: 0x5ffff5,

            size: .18,

            transparent: true,

            opacity: .7,

            blending:
                THREE.AdditiveBlending,

            depthWrite: false
        });


    const particleTrail =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );

    heartGroup.add(
        particleTrail
    );

    /* POSICIÓN INICIAL */

    heartGroup.position.set(
        -18,
        13,
        -5
    );


    heartGroup.rotation.z =
        -.18;


    /* GUARDAMOS PARA ANIMAR */

    heartGroup.userData.startX = -18;
    heartGroup.userData.endX = 18;
    heartGroup.userData.speed = .12;

    window.shootingHeart =
        heartGroup;
}

/* =====================================================
   MOUSE
===================================================== */

const mouse =
    new THREE.Vector2();

const raycaster =
    new THREE.Raycaster();


function onPointerMove(event) {

    mouse.x =
        (event.clientX /
            window.innerWidth) *
            2 - 1;

    mouse.y =
        -(event.clientY /
            window.innerHeight) *
            2 + 1;


    raycaster.setFromCamera(
        mouse,
        camera
    );


    const intersects =
        raycaster.intersectObjects(
            cars
        );


cars.forEach(
    car => {

        if (car !== selectedCar) {

            car.scale.lerp(
                new THREE.Vector3(
                    1,
                    1,
                    1
                ),
                .1
            );
        }
    }
);

if (intersects.length > 0) {

    const car = intersects[0].object;

    if (car !== selectedCar) {

        car.scale.lerp(
            new THREE.Vector3(
                1.25,
                1.25,
                1.25
            ),
            .2
        );

        hoveredCar = car;
    }

} else {

    hoveredCar = null;
}
}

function onSceneClick(event) {

    mouse.x =
        (event.clientX /
            window.innerWidth) *
            2 - 1;

    mouse.y =
        -(event.clientY /
            window.innerHeight) *
            2 + 1;

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const intersects =
        raycaster.intersectObjects(
            cars
        );

    if (intersects.length === 0) {
        return;
    }

    selectedCar =
        intersects[0].object;

    currentIndex =
        cars.indexOf(selectedCar);

    console.log(
        "Auto seleccionado:",
        currentIndex
    );
    showChapter(currentIndex);
}

function onResize() {
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}
function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        clock.getDelta();

    if (controls) {
        controls.update();
    }

    if (galaxy) {
        galaxy.rotation.y +=
            delta * 0.02;
    }

    particles.forEach(
        particle => {

            particle.rotation.y +=
                delta * 0.01;

        }
    );

    nebulaParticles.forEach(
        particle => {

            particle.rotation.y +=
                delta * 0.005;

        }
    );

    if (renderer && scene && camera) {

        renderer.render(
            scene,
            camera
        );
    }
}
function showChapter(index) {

    const chapter =
        chapters[index];

    if (!chapter) return;


    const modal =
        document.getElementById(
            "chapterModal"
        );

    const number =
        document.getElementById(
            "chapterNumber"
        );

    const title =
        document.getElementById(
            "chapterTitle"
        );

    const image =
        document.getElementById(
            "chapterImage"
        );

    const text =
        document.getElementById(
            "chapterText"
        );


    number.textContent =
        `CAPÍTULO ${String(index + 1).padStart(2, "0")}`;

    title.textContent =
        chapter.title ||
        chapter.name ||
        "FAST & US";

    image.src =
        chapter.image;

    image.alt =
        title.textContent;

    text.textContent =
        chapter.text ||
        chapter.description ||
        "";


    modal.style.display =
        "flex";
}
function closeChapter() {

    const modal =
        document.getElementById(
            "chapterModal"
        );

    modal.style.display =
        "none";

    selectedCar =
        null;
}


document
    .getElementById("closeChapter")
    .addEventListener(
        "click",
        closeChapter
    );


document
    .getElementById("backChapter")
    .addEventListener(
        "click",
        closeChapter
    );