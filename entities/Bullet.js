class Bullet extends Entity{
    constructor(){
        super();
        this.name = 'bullet';
        this.move_x = 0;
        this.move_y = 0;

        this.delay = 150;

        this.angle = 0;

        this.speed = 14;
    }

    draw(ctx){
        getSpriteManager().drawSprite(ctx, 'bull.png', this.pos_x, this.pos_y, this.angle);

    }
    update(){
        //console.log("UPDATE BULLET <==============");
        getPhysicManager().update(this);
    }
    onTouchEntity(obj){
        if(obj.name.includes('enemy')) {
            let e = getGameManager().entity(obj.name);
            if(e !== null) {
                if(e.alive) {
                    //getScoreManager().enemyKilled(entity.difficulty);

                    e.kill();
                }
            }
            this.kill();
        }
    }
    onTouchMap(idx){
        this.kill();
    }
    kill(){
        getGameManager().kill(this);
    }
}