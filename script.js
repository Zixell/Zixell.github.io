
var mm  = new mapManager();
var sm  = new spriteManager();
var em  = new eventsManager();
var pm  = new physicManager();
var gm  = new gameManager();
var am = new AudioManager();
var scm = new scoreManager();

function getCurrentContext() { return ctx; }
function getCurrentCanvas() { return canvas; }
function getEventsManager() { return em; }
function getSpriteManager() { return sm; }
function getGameManager() { return gm; }
function getPhysicManager() { return pm; }
function getMapManager() { return mm; }
function getAudioManager() { return am; }
function getScoreManager() { return scm; }

var levelBriefDuration = 8000;

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
                // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}



var gameScenes = [
    {
        sceneName: 'the-running-man',
        title: 'PART  I:  ESCAPE',
        map: 'maps/map_1.json',
        music: "sounds/zombie.mp3",
        walkable: [3, 4, 49, 50]
    },
    {
        sceneName: '123',
        title: 'PART  II:  HELL',
        map: 'maps/map_2.json',
        music: "sounds/lava.mp3",
        walkable: [3, 4, 49, 50]
    }
    ];

function completedLevel(l) {
    getScoreManager().currentLevel = l + 1;
    startLevel(getScoreManager().currentLevel);
}

function startLevel(l) {
    if(l < gameScenes.length) {
        getAudioManager().stopAll();

        getScoreManager().save();
        //
        getGameManager().clearScreen();

        console.log("LEVEL = "+l);

        setTimeout( () => {
            getAudioManager().play(gameScenes[l].music, { looping: true });
            getGameManager().loadScene(gameScenes[l]);
        }, levelBriefDuration);

    } else {

        let totalScore = 0;
        for(let s of getScoreManager().scoreStorage) {
            totalScore += s.score;
        }

        console.log(totalScore);

        getScoreManager().save();

        getGameManager().clearScreen();



        finish();
    }
}

function resourcesLoaded() {

    // Loading start level
    setTimeout( () => { startLevel(getScoreManager().getCurrentLevel()) }, 100 );

    console.log('loaded all');
    //getHudManager().drawHero('endlevel');
}

function launch() {
        document.getElementById("canvasId").style.display = 'block';

        getScoreManager().load();
        getGameManager().loadAll();
        getScoreManager().clearAll();
        document.getElementById('startmenu').style.display = 'none';
}

function scoreboard(en) {
    //document.getElementById('startmenu').style.display = 'none';
    let scoreboardElement = document.getElementById('scoreboard');
    let scoreboardTextElement = document.getElementById('scoreboard-text');
    if(en) {
        getScoreManager().load();
        scoreboardTextElement.innerHTML = '';
        scoreboardElement.style.display = 'block';

        for(let i = 0; i < gameScenes.length; i++) {
            scoreboardTextElement.innerHTML += (`<b>${gameScenes[i].title}</b><br />`);
            scoreboardTextElement.innerHTML += (`Enemies killed: ${getScoreManager().scoreStorage[i].killed}<br />`);
            scoreboardTextElement.innerHTML += (`Score: ${getScoreManager().scoreStorage[i].score}<br /><br />`);
        }

    } else {
        scoreboardElement.style.display = 'none';
        //document.getElementById('startmenu').style.display = 'block';

    }
}
console.log("BEGIN")

function finish() {
    document.getElementById("canvasId").style.display = 'none';
    document.getElementById("finish").innerHTML = "Congatulations! You won!";

    getAudioManager().stopAll();

    setTimeout( () => {
        getAudioManager().play("sounds/VIKA.mp3", { looping: true });
    }, levelBriefDuration);
}