class EnemyBody extends Entity {
    constructor() {
        super();

        this.move_x = 0;
        this.move_y = 0;
        this.speed = 0;
        this.angle = 0;
        this.difficulty = 0.1;
    }

    draw(context) {
            getSpriteManager().drawSprite(context, "enemydead.png", this.pos_x, this.pos_y, this.angle);

        }

    update() {
        //getPhysicManager().update(this);
    }

    onTouchEntity(entity) {

    }

    kill() {
        getGameManager().kill(this);
    }
}