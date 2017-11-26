class Enemy extends Entity {
    constructor() {
        super();

        this.ammo = 0;
        this.alive = true;

        this.move_x = 0;
        this.move_y = 0;
        this.speed = 1;
        this.angle = 0;

        this.difficulty = 0.65;

        this.canFire = true;
        this.canTestFire = true;
        this.noObstacles = false;
        this.wasroar = false;
        this.spotRadius = 200;
        this.minSpotRadius = 200;
    }

    draw(ctx) {
            getSpriteManager().drawSprite(ctx, 'enemy.png', this.pos_x, this.pos_y, this.angle);
    }

    update() {
        let distanceToPlayer = Math.sqrt( Math.pow(this.pos_x - getGameManager().player.pos_x, 2) + Math.pow(this.pos_y - getGameManager().player.pos_y, 2) );

        if( distanceToPlayer < this.minSpotRadius + this.spotRadius * this.difficulty && distanceToPlayer > 0 ) {

            if(!this.wasroar){

                this.wasroar = true;
            }

            let playerDelta = {
                x: getGameManager().player.pos_x - this.pos_x,
                y: getGameManager().player.pos_y - this.pos_y
            };
            this.angle = Math.atan2(playerDelta.y, playerDelta.x);
            if(this.angle < 0)
                this.angle += Math.PI * 2;

            this.speed = 3 * this.difficulty;

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
            }
        }
    }
    kill() {
        this.alive = false;


        getScoreManager().difficulty = this.difficulty;
        getScoreManager().enemyDead();

        let deathS = [
            'sounds/roar1.mp3',
            'sounds/roar2.mp3',
            'sounds/roar3.mp3',

        ];

        getAudioManager().play(deathS[Math.floor(Math.random() * 2)]);

        let body = new EnemyBody();
        body.name = 'ebody' + (++getGameManager().fireNum);
        body.angle = this.angle - Math.PI;
        body.size_x = 43;
        body.size_x = 19;
        body.pos_x = this.pos_x;
        body.pos_y = this.pos_y;


        getGameManager().entities.unshift(body);



        getGameManager().kill(this);
    }
}