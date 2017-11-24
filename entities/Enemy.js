class Enemy extends Entity {
    constructor() {
        super();

        this.ammo = 0;
        this.alive = true;

        this.move_x = 0;
        this.move_y = 0;
        this.speed = 1;
        this.angle = 0;

        this.difficulty = 0.6;

        this.canFire = true;
        this.canTestFire = true;
        this.noObstacles = false;

        this.spotRadius = 200;
        this.minSpotRadius = 200;
    }

    draw() {
            getSpriteManager().drawSprite(getCurrentContext(), 'enemy.png', this.pos_x, this.pos_y, this.angle);
    }

    update() {
        let distanceToPlayer = Math.sqrt( Math.pow(this.pos_x - getGameManager().player.pos_x, 2) + Math.pow(this.pos_y - getGameManager().player.pos_y, 2) );

        if( distanceToPlayer < this.minSpotRadius + this.spotRadius * this.difficulty && distanceToPlayer > 0 ) {

            let playerDelta = {
                x: getGameManager().player.pos_x - this.pos_x,
                y: getGameManager().player.pos_y - this.pos_y
            };
            this.angle = Math.atan2(playerDelta.y, playerDelta.x);
            if(this.angle < 0)
                this.angle += Math.PI * 2;

            this.speed = 3 * this.difficulty;


            if(this.noObstacles) {
                this.fire();
            }

        } else {
            this.speed = 0;
        }

        getPhysicManager().update(this);
    }

    onTouchEntity(obj) {
        if(obj.name.includes('player')) {
            let e = getGameManager().entity(obj.name);
            if(e !== null) {
                    //getScoreManager().enemyKilled(entity.difficulty);
                    e.kill();
                    console.log("Player destroyed!");
            }
        }
    }

    fire() {


    }

    kill() {
        this.alive = false;


        // let body = new EnemyBody();
        // body.name = 'ebody' + (++getGameManager().fireNum);
        // body.angle = this.angle - Math.PI;
        // body.sizeX = 43;
        // body.sizeY = 19;
        // body.posX = this.pos_x;
        // body.posY = this.pos_y;
        // body.difficulty = this.difficulty;
        // body.ammo = (Math.random() < body.difficulty ) ? 2 : 1;

        // getGameManager().entities.unshift(body);

        getGameManager().kill(this);
    }
}