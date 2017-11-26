class physicManager {
    constructor() {

    }

    update(obj) {
        if(obj.move_x === 0 && obj.move_y === 0 && obj.angle === null)
            return 'stop';

        //console.log("UPDATE PM = "+obj.name);
        let newX, newY;

        if(obj.angle === null) {
            newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
            newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        } else {
            newX = obj.pos_x + Math.cos(obj.angle) * obj.speed;
            newY = obj.pos_y + Math.sin(obj.angle) * obj.speed;
        }

        let newCenterX = Math.floor(newX + obj.size_x / 2.0);
        let newCenterY = Math.floor(newY + obj.size_y / 2.0);

        let ts = getMapManager().getTilesetIdx(newCenterX, newCenterY);
        let tsX = getMapManager().getTilesetIdx(newCenterX, Math.floor(obj.pos_y + obj.size_y / 2.0));
        let tsY = getMapManager().getTilesetIdx(Math.floor(obj.pos_x + obj.size_x / 2.0), newCenterY);

        let e = this.entityAtXY(obj, newX, newY);

        if(e !== null && obj.onTouchEntity) {
            obj.onTouchEntity(e);
        }

        if(e !== null && obj.name.includes('enemy') && (e.name.includes('enemy') || e.name.includes('player')))
            return 'break';
        if(!this.walkable(ts) && obj.onTouchMap) //
            obj.onTouchMap(ts);
        if(this.walkable(ts)/* && e === null*/) { //this.walkable(ts)
            obj.pos_x = newX;
            obj.pos_y = newY;
            //console.log("Go to {"+newX+";"+newY+"}");
        } else if(this.walkable(tsX)) {
            obj.pos_x = newX;
        } else if(this.walkable(tsY)) {
            obj.pos_y = newY;
        } else {
            return 'break';
        }



        return 'move';
    }

    distance(from, to) {
        return Math.sqrt( Math.pow(from.x - to.x, 2) + Math.pow(from.x - to.y, 2) );
    }

    walkable(idx) {
        let blocks = gameScenes[0].walkable;
        for(let block of blocks) {
            if( idx === block )
                return true;
        }

        return false;
    }

    entityAtXY(obj, x, y) {
        for(let entity of getGameManager().entities) {
            if(entity.name !== obj.name) {
                if(x + obj.size_x < entity.pos_x ||
                    y + obj.size_y < entity.pos_y ||
                    x > entity.pos_x + entity.size_x ||
                    y > entity.pos_y + entity.size_y
                ) continue;

                return entity;
            }
        }
        return null;
    }
}