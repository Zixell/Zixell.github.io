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
        getSpriteManager().loadAtlas("data.png", "data.json");
        getAudioManager().init();
        getAudioManager().loadArray(['sounds/zombie.mp3',
            'sounds/fire.mp3',
            'sounds/roar1.mp3',
            'sounds/roar2.mp3',
            'sounds/roar3.mp3'
        ]);
        this.factory['Player'] = Player;
        this.factory['Enemy'] = Enemy;
        this.factory['Bullet'] = Bullet;
        this.factory['EnemyBody'] = EnemyBody;

        getMapManager().draw(getCurrentContext());
        getEventsManager().setup(getCurrentCanvas());

        setTimeout(this.loadResourcesFinish, 10);

    }

    loadResourcesFinish() {
        //console.log(`Loading resources:`);
        let jobs = 3;

        if( getSpriteManager().jsonLoaded ) {
            jobs--;
            //console.log(`[R]: Atlas JSON loaded`);
        }

        if( getSpriteManager().imageLoaded ) {
            jobs--;
            //console.log(`[R]: Atlas image loaded`);
        }

        if( getAudioManager().loaded ) {
            jobs--;
            //console.log(`[R]: Sounds loaded`);
        }

        if( jobs === 0 ) {
            console.log(`[R]: COMPLETE`);
            resourcesLoaded();
        } else {
            setTimeout(getGameManager().loadResourcesFinish, 10);
        }

    }

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
        }


    }

    levelCompleted() {

        if( getEventsManager().action['fire'] ) {

            completedLevel(getScoreManager().currentLevel);

        } else {
            getGameManager().stopScene();
            setTimeout( getGameManager().levelCompleted, 20 );
        }

    }


    clearScreen() {
        getCurrentContext().fillStyle = "black";
        getCurrentContext().fillRect(0, 0, getCurrentCanvas().width, getCurrentCanvas().height);
    }

    loadSceneFinish(sc) {
        //console.log(`Loading scene:`);
        let jobs = 2;

        if( getMapManager().jsonLoaded ) {
            jobs--;
            console.log(`[S]: Map JSON loaded`);
        }

        if( getMapManager().imagesLoaded ) {
            jobs--;
            console.log(`[S]: Map images loaded`);
        }

        if( jobs === 0 ) {
            console.log(`[S]: COMPLETE`);

            // Launching
            getGameManager().reloadScene();
        } else {
            setTimeout(getGameManager().loadSceneFinish, 50);
        }

    }


    loadScene(sc) {
        this.clearScreen();

        getMapManager().jsonLoaded = false;
        getMapManager().imagesLoaded = false;
        getMapManager().imgLoadCounter = 0;
        getMapManager().view = {x: 0, y: 0, w: 800, h: 600};

        getMapManager().loadMap(sc.map);

        console.log(`Loading scene "${sc.sceneName}"`);
        setTimeout(this.loadSceneFinish, 10);
    }

    stopScene() {
        clearInterval(this.worldUpdateTimer);


        this.entities = [];
        this.player = null;

        this.clearScreen();
    }

    reloadScene() {
        this.stopScene();
        //getScoreManager().clearCurrentRecording();
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