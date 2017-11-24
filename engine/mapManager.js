class mapManager{
    constructor(){
        this.mapData = null;
        this.tLayer = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = {x: 8, y:8};
        this.mapSize = {x: 80, y:60};
        this.tilesets = new Array();
        this.scale = 1;
        this.view = {x: 0, y: 0, w: 800, h: 600};

        this.imgLoadCounter = 0;
        this.imagesLoaded = false;
        this.jsonLoaded = false
    }
    loadMap(path){
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if(request.readyState === 4 && request.status === 200){
                this.parseMap(request.responseText)
            }
        };
        request.open("GET", path, true);
        request.send();
        // this.view.w = getCurrentCanvas().width;
        // this.view.h = getCurrentCanvas().height;
    }
    parseMap(tilesJSON){
        this.mapData = JSON.parse(tilesJSON);

        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;

        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;

        this.mapSize.x = this.xCount*this.tSize.x;
        this.mapSize.y = this.yCount*this.tSize.y;

        for(let tile of this.mapData.tilesets){
            let img = new Image();
            img.onload = () =>{
                this.imgLoadCounter++;
                if(this.imgLoadCounter === this.mapData.tilesets.length){
                    this.imagesLoaded = true;
                    console.log("Tilesets loaded!")
                }
            };
            img.src= tile.image;
            let ts = {
                firstgid: tile.firstgid,
                image: img,
                name: tile.name,
                xCount: Math.floor(tile.imagewidth / this.tSize.x),
                yCount: Math.floor(tile.imageheigth / this.tSize.y)
            };
            this.tilesets.push(ts);
        }
        for(let layer of this.mapData.layers) {
            if(layer.type === "tilelayer") {
                this.tLayer = layer;
                break;
            }
        }
        this.jsonLoaded = true;
        console.log("JSON loaded!")
    }

    draw(ctx){
        if(!this.imagesLoaded || !this.jsonLoaded){
            setTimeout(() => this.draw(ctx) , 100);
        } else {
            if(this.tLayer === null) {
                for (let layer of this.mapData.layers) {
                    if (layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            }
                for(let i = 0; i < this.tLayer.data.length; i++) {
                    let tileData = this.tLayer.data[i];

                    if(tileData !== 0) {
                        let tile = this.getTile(tileData);

                        let pX = (i % this.xCount) * this.tSize.x;
                        let pY = Math.floor(i / this.xCount) * this.tSize.y;

                        pX *= this.scale;
                        pY *= this.scale;

                        let tileSizeX = this.tSize.x * this.scale;
                        let tileSizeY = this.tSize.y * this.scale;


                        if( !this.isVisible(pX, pY, tileSizeX, tileSizeY) )
                            continue;

                        pX -= this.view.x;
                        pY -= this.view.y;


                        ctx.drawImage(tile.img,
                            tile.px,
                            tile.py,
                            this.tSize.x,
                            this.tSize.y,
                            pX,
                            pY,
                            tileSizeX,
                            tileSizeY);


                }
            }

        }

    }

    drawShadow(x,y){
        getCurrentContext().rect(x,y,getCurrentCanvas().width,getCurrentCanvas().height);
        getCurrentContext().fillStyle = "rgba(0,0,0,0.8)";
        getCurrentContext().fill();
        getCurrentContext().stroke();

        //getCurrentContext().fillStyle = "black";
    }

    drawCircle(x,y){

// Рисуем круг
        getCurrentContext().fillStyle = "rgba(255,255,255,0.5)";
        getCurrentContext().rect(x, y, 100, 100);
        getCurrentContext().fill();
        //getCurrentContext().fillStyle = "black";


    }

    getTile(tileIndex) {
        let tile = {
            img: null,
            px: 0,
            py: 0
        };

        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);

        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;

        return tile;
    }


    getTilesetIdx(x, y) {
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        return this.tLayer.data[idx];
    }

    getTileset(tileIndex) {
        for(let i = this.tilesets.length-1; i >= 0; i--) {
            if(this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        }

        return null;
    }

    isVisible(x, y, width, height) {
        if(x + width < this.view.x
            || y + height < this.view.y
            || x > this.view.x + this.view.w
            || y > this.view.y + this.view.h)
            return false;

        return true;
    }

    parseEntities() {

        if(!this.imagesLoaded || !this.jsonLoaded) {
            setTimeout(() => this.parseEntities(), 100)
        } else {
            console.log('parsing entities');
            for(let layer of this.mapData.layers) {
                if(layer.type === 'objectgroup') {
                    for(let entity of layer.objects) {
                        try {
                            let obj = null;

                            switch(entity.type) {
                                case 'player':
                                    obj = new Player();
                                    break;
                                case 'enemy':
                                    obj = new Enemy();
                                    break;
                            }

                            if(obj === null) continue;

                            //let obj = Object.create(getGameManager().factory[entity.type]);
                            obj.name = entity.name;
                            obj.pos_x = entity.x;
                            obj.pos_y = entity.y - entity.height; // КОСТЫЛЬ!!!
                            obj.sizeX = entity.width;
                            obj.sizeY = entity.height;

                            getGameManager().entities.push(obj);

                            if(obj.name === 'player') {
                                getGameManager().initPlayer(obj);
                            }

                            console.log(`Entity loaded: ${entity.type}, ${entity.name}`);
                        } catch(ex) {
                            console.log(`Error while creating [${entity.gid}] ${entity.type}, ${ex}`);
                        }
                    }
                }
            }
        }
    }

    centerAt(x, y) {
        if(x < this.view.w / 2) {
            this.view.x = 0;
        } else if(x > this.mapSize.x - this.view.w / 2) {
            this.view.x = this.mapSize.x - this.view.w;
        } else {
            this.view.x = x - (this.view.w / 2);
        }

        if(y < this.view.h / 2) {
            this.view.y = 0;
        } else if(y > this.mapSize.y - this.view.h / 2) {
            this.view.y = this.mapSize.y - this.view.h;
        } else {
            this.view.y = y - (this.view.h / 2);
        }
        //console.log(`Center at (${x}, ${y})`);
    }
}