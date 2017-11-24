class Player extends Entity{
    constructor(){
        super();
        this.name = "player";
        this.ammo = 5;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 4;
        this.canFire = true;
    }

    draw(ctx){
        let mouseDelta = getEventsManager().getMouseDelta();
        let angle = Math.atan2(mouseDelta.y, mouseDelta.x);

        getSpriteManager().drawSprite(getCurrentContext(), 'player.png', this.pos_x, this.pos_y, angle);

    }
    update(){
        getPhysicManager().update(this);
    }
    onTouchEntity(entity){

    }
    kill(){
        console.log(`KILLED PLAYER`);
        getGameManager().reloadScene();
    }
    fire() {
        if(this.canFire && this.ammo !== 0) {
            let bullet = new Bullet();

            bullet.size_x = 8;
            bullet.size_y = 4;

            bullet.name = 'bullet' + (++getGameManager().fireNum);

            let mouseDelta = getEventsManager().getMouseDelta();
            let angle = Math.atan2(mouseDelta.y, mouseDelta.x);

            bullet.angle = angle;

            bullet.pos_x = this.pos_x + this.size_x / 2 - 4 + Math.cos(angle) * 4;
            bullet.pos_y = this.pos_y + this.size_y / 2 - 4 + Math.sin(angle) * 4;

            console.log("Bullet created!<-------------")
            getGameManager().entities.push(bullet);


            this.canFire = false;
            setTimeout( () => { getGameManager().player.canFire = true; }, bullet.delay);
        }

    }
}