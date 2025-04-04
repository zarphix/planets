document.addEventListener("DOMContentLoaded", function() {
    let planetCount = 0;
    let activePlanet = null;
    let speed = 3;

    function createPlanet(x, y) {
        const planetElement = document.createElement('div');
        planetElement.className = 'planet';
        planetElement.style.width = '200px';
        planetElement.draggable = 'false';
        planetElement.ondragstart = function() {return false}
        planetElement.style.top = `${y}px`;
        planetElement.style.left = `${x}px`;
        planetElement.id = `movable-planet-${planetCount}`;

        const planetBody = document.createElement('div');
        planetBody.className = 'planet-body';
        planetBody.innerHTML = `<img src="../images/planet.png" width="200">`;

        planetElement.appendChild(planetBody);
        document.body.appendChild(planetElement);

        addDragFunctionality(planetElement);
        planetCount++;
        activePlanet = planetElement;
    }
    
    function addDragFunctionality(planetElement) {
        let isDragging = false;
        let offsetX, offsetY;

        planetElement.addEventListener("mousedown", function(e) {
            isDragging = true;
            offsetX = e.clientX - planetElement.offsetLeft;
            offsetY = e.clientY - planetElement.offsetTop;
            planetElement.style.cursor = 'grabbing';
            activePlanet = planetElement;
        });

        document.addEventListener("mousemove", function(e) {
            if (isDragging) {
                planetElement.style.left = `${e.clientX - offsetX}px`;
                planetElement.style.top = `${e.clientY - offsetY}px`;
            }
        });
        
        document.addEventListener("mouseup", function() {
            if (isDragging) {
                isDragging = false;
                planetElement.style.cursor = 'grab';
                bounce(planetElement);
            }
        });
    }

    function bounce(planetElement) {
        const rect = planetElement.getBoundingClientRect();
        const velocity = { x: speed, y: speed};
        const damping = 0.8;

        function updatePosition() {
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            rect.x += velocity.x;
            rect.y += velocity.y;

            if (rect.x < 0) {
                rect.x = 0;
                velocity.x *= -damping;
            } else if (rect.x > maxX) {
                rect.x = maxX;
                velocity.x *= -damping;
            }

            if (rect.y < 0) {
                rect.y = 0;
                velocity.y *= -damping;
            } else if (rect.y > maxY) {
                rect.y = maxY;
                velocity.y *= -damping;
            }

            planetElement.style.left = `${rect.x}px`;
            planetElement.style.top = `${rect.y}px`;

            if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
                requestAnimationFrame(updatePosition);
            }
        }

        updatePosition();
    }

    function planetRemove(planetElement) {
        const rect = planetElement.getBoundingClientRect();
        const blackhole = document.createElement('div');
        blackhole.className = 'blackhole';
        blackhole.style.left = `${rect.left + rect.width / 2 - 50}px`;
        blackhole.style.top = `${rect.top + rect.height / 2 - 50}px`;

        document.body.appendChild(blackhole);

        setTimeout(() => {
            blackhole.remove();
        }, 1000);

        planetElement.remove();
    }

    createPlanet(100, 100);

    document.addEventListener("keydown", function(e) {
        if (e.key === 'q' || e.key === 'Q') {
            createPlanet(100 + planetCount * 10, 100 + planetCount * 10);
        }
        
        if (e.key === 'e' || e.key === 'E') {
            if (activePlanet) {
                planetRemove(activePlanet);
                activePlanet = null;
            }
        }
    });
});