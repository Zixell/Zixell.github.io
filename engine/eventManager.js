class eventsManager {
    constructor() {
        this.bind = [];
        this.action = [];
        this.mouse = { x: 0, y: 0 };
    }

    setup(canvas) {
        this.bind[87] = 'up';
        this.bind[65] = 'left';
        this.bind[83] = 'down';
        this.bind[68] = 'right';
        this.bind[32] = 'fire';
        this.bind[82] = 'restart';
        this.bind[80] = 'pause';

        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);

        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    }

    getMouseDelta() {
        //let mouseDeltaX = this.mouse.x - (getCurrentCanvas().getBoundingClientRect().left) - (getGameManager().player.pos_x + Math.floor(getGameManager().player.sizeX / 2.0) - getMapManager().camera.x);
        //let mouseDeltaY = this.mouse.y - (getCurrentCanvas().getBoundingClientRect().top) - (getGameManager().player.pos_y + Math.floor(getGameManager().player.sizeY / 2.0) - getMapManager().camera.y);
        let mouseDeltaX = this.mouse.x - getGameManager().playerPosOnScreen().x;
        let mouseDeltaY = this.mouse.y - getGameManager().playerPosOnScreen().y;
        return { x: mouseDeltaX, y: mouseDeltaY };
    }

    onMouseDown(event) {
        getEventsManager().action['fire'] = true;
        console.log(`Mousedown!`);
    }

    onMouseUp(event) {
        getEventsManager().action['fire'] = false;
        console.log(`Mouseup!`);
    }

    onMouseMove(event) {
        getEventsManager().mouse = { x: event.clientX, y: event.clientY };
        //console.log(`Mousemove ${event.clientX}, ${event.clientY}`);
    }


    onKeyDown(event) {
        let action = getEventsManager().bind[event.keyCode];
        //console.log(`Key ${event.keyCode} pressed!`);

        if(action) {
            getEventsManager().action[action] = true;
            //console.log(`Key ${event.keyCode} pressed with action ${action}!`);
        }
    }

    onKeyUp(event) {
        let action = getEventsManager().bind[event.keyCode];

        if(action) {
            getEventsManager().action[action] = false;
            //console.log(`Key ${event.keyCode} released with action ${action}!`);
        }
    }
}