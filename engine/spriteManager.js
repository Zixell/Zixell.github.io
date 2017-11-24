class spriteManager{
    constructor(){
        this.image = new Image();
        this.sprites = new Array();
        this.imageLoaded = false;
        this.jsonLoaded = false;
    }
    loadAtlas(atlasImage, atlasJson) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if(request.readyState === 4 && request.status === 200) {
                console.log(`Loaded atlas ${atlasJson}`);
                this.parseAtlas(request.responseText);
            }
        };

        request.open('GET', atlasJson, true);
        request.send();

        console.log(`Loading atlas ${atlasJson}`);

        this.loadImg(atlasImage);
    }

    loadImg(atlasImage) {
        this.image.onload = () => {
            this.imageLoaded = true;
            console.log(`Loaded ${atlasImage}`);
        };
        this.image.src = atlasImage;

        console.log(`Loading image ${atlasImage}`);
    }

    parseAtlas(atlasJson) {
        let atlas = JSON.parse(atlasJson);

        for(let fr of atlas.frames) {
            this.sprites.push({
                name: fr.filename,
                x: fr.frame.x,
                y: fr.frame.y,
                w: fr.frame.w,
                h: fr.frame.h
            });
        }

        this.jsonLoaded = true;
    }

    drawSprite(ctx, name, x, y, angle = 0) {
        if(!this.imageLoaded || !this.jsonLoaded) {
            setInterval(() => this.drawSprite(ctx, name, x, y, angle), 100);
        } else {
            let sprite = this.getSprite(name);

            if(!getMapManager().isVisible(x, y, sprite.w, sprite.h))
                return;

            x -= getMapManager().view.x;
            y -= getMapManager().view.y;

            if(angle !== 0) {
                ctx.translate( x + sprite.w / 2, y + sprite.h / 2 );
                ctx.rotate( angle );
                // ctx.moveTo(0, 0);
                // ctx.lineTo(sprite.w, sprite.h);
                // ctx.stroke();
                ctx.drawImage(this.image,
                    sprite.x,
                    sprite.y,
                    sprite.w,
                    sprite.h,
                    -sprite.w / 2,
                    -sprite.h / 2,
                    sprite.w,
                    sprite.h
                );
                ctx.rotate( -angle );
                ctx.translate( -x - sprite.w / 2, -y - sprite.h / 2 );
            } else {
                ctx.drawImage(this.image,
                    sprite.x,
                    sprite.y,
                    sprite.w,
                    sprite.h,
                    x,
                    y,
                    sprite.w,
                    sprite.h
                );
            }

        }
    }

    getSprite(name) {
        for(let sprite of this.sprites) {
            if(sprite.name === name) {
                return sprite;
            }
        }

        return null;
    }
}