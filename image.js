
var mm  = new mapManager();
var sm  = new spriteManager();
var em  = new eventsManager();
var pm  = new physicManager();
var gm  = new gameManager();



function getCurrentContext() { return ctx; }
function getCurrentCanvas() { return canvas; }
function getEventsManager() { return em; }
function getSpriteManager() { return sm; }
function getGameManager() { return gm; }
function getPhysicManager() { return pm; }
function getMapManager() { return mm; }





var gameScenes = [
    {
        sceneName: 'the-running-man',
        title: 'PART  I:  THE  RUNNING  MAN',
        subtitle: 'Almost  ten  years  after  my \nretirement  they  found  me.',
        map: 'trm.json',
        hero: 'hero-1',
        hint: 'ESCAPE THE CLUB',
        walkable: [3, 4, 49, 50]
    },
    {
        sceneName: '123',
        title: 'PART  I:  THE  RUNNING  MAN',
        subtitle: 'Almost  ten  years  after  my \nretirement  they  found  me.',
        map: 'trm.json',
        hero: 'hero-1',
        hint: 'ESCAPE THE CLUB',
        walkable: [3, 4, 53, 54]
    }
    ];

console.log("BEGIN")
getGameManager().loadAll();

getGameManager().play();