class gameManager {
    constructor() {
        this.factory = {};
        this.entities = [];
        this.fireNum = 0;
        this.player = null;
        this.laterKill = [];
        this.pause = false;

        this.worldUpdateTimer = null;
    }

    initPlayer(obj) {
        this.player = obj;
    }

    kill(obj) {
        this.laterKill.push(obj);
    }

    update() {
        if (this.player === null) {
            return;
        }

        // if (getEventsManager().action['pause']) {
        //
        //     this.togglePause();
        //     getEventsManager().action['pause'] = false;
        // }

            //console.log(`Update world`);

            this.player.move_x = 0;
            this.player.move_y = 0;



            if (getEventsManager().action['up']) this.player.move_y = -1;
            if (getEventsManager().action['down']) this.player.move_y = 1;
            if (getEventsManager().action['left']) this.player.move_x = -1;
            if (getEventsManager().action['right']) this.player.move_x = 1;

            if (getEventsManager().action['fire']) this.player.fire();

            // if (getEventsManager().action['restart']) {
            //     this.reloadScene();
            //     getEventsManager().action['restart'] = false;
            // }

            for (let entity of this.entities) {
                try {
                    entity.update();
                } catch (ex) {
                    console.log(`Error updating entity ${entity.name}`);
                }
            }

            for (let i = 0; i < this.laterKill.length; i++) {
                let idx = this.entities.indexOf(this.laterKill[i]);
                if (idx > -1)
                    this.entities.splice(idx, 1);
            }

            if (this.laterKill.length > 0) {
                this.laterKill.length = 0;
            }

            this.draw(getCurrentContext());


    }

    loadAll() {
        getMapManager().loadMap("map_1.json");
        getSpriteManager().loadAtlas("data.png", "data.json");
        this.factory['Player'] = Player;
        this.factory['Enemy'] = Enemy;
        this.factory['Bullet'] = Bullet;
        getMapManager().parseEntities();
        getMapManager().draw(getCurrentContext());
        getEventsManager().setup(getCurrentCanvas());

    }

    // togglePause() {
    //     if (this.pause) {
    //         console.log(`UNPAUSE`);
    //         getScoreManager().timerUnpause();
    //         getAudioManager().frequencyRamp(getAudioManager().defaultFrequency, 1);
    //         this.pause = false;
    //     } else {
    //         console.log(`PAUSE`);
    //         getScoreManager().timerPause();
    //         getAudioManager().frequencyRamp(getAudioManager().lowFrequency, 1);
    //         //getGameManager().clearScreen();
    //         getHudManager().drawTitleText('Pause');
    //         getHudManager().drawSubtitleText('Press  \`P\`  to  continue');
    //         this.pause = true;
    //     }
    // }

    entity(name) {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].name === name) {
                return this.entities[i];
            }
        }
        return null;
    }

    draw() {
        if (this.player !== null) {

            getMapManager().draw(getCurrentContext());


            for (let entity of this.entities) {
                entity.draw(getCurrentContext());
            }

            getMapManager().centerAt(this.player.pos_x, this.player.pos_y);
            getSpriteManager().drawSprite(getCurrentContext(), 'black.png', this.player.pos_x-(390*2), this.player.pos_y-(297*2));
            //getMapManager().drawShadow(0,0);
            //getMapManager().drawCircle(this.player.pos_x, this.player.pos_y)
        }


    }

    clearScreen() {
        getCurrentContext().fillStyle = "black";
        getCurrentContext().fillRect(0, 0, getCurrentCanvas().width, getCurrentCanvas().height);
    }

    stopScene() {
        clearInterval(this.worldUpdateTimer);


        this.entities = [];
        this.player = null;

        this.clearScreen();
    }

    reloadScene() {
        this.stopScene();

        getMapManager().parseMap(JSON.stringify(getMapManager().mapData));
        getMapManager().parseEntities();
        getGameManager().play();
    }

    playerPosOnScreen() {
        var scaleX = getCurrentCanvas().getBoundingClientRect().width / getCurrentCanvas().offsetWidth;
        var scaleY = getCurrentCanvas().getBoundingClientRect().height / getCurrentCanvas().offsetHeight;

        let x = getCurrentCanvas().getBoundingClientRect().left +
            (getGameManager().player.pos_x + Math.floor(getGameManager().player.size_x / 2.0) - getMapManager().view.x) * scaleX;
        let y = getCurrentCanvas().getBoundingClientRect().top +
            (getGameManager().player.pos_y + Math.floor(getGameManager().player.size_y / 2.0) - getMapManager().view.y) * scaleY;

        return {x, y};
    }

    play() {
        this.worldUpdateTimer = setInterval(updateWorld, 30);
    }
}

function updateWorld() {
    getGameManager().update();
}