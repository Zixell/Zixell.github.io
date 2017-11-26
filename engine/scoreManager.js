class scoreManager{
    constructor(){
        this.scoreStorage = [];
        this.currentLevel = 0;
        this.difficulty = 0;
    }

    clearCurrentRecording() {
        this.scoreStorage[this.currentLevel].score = 0;
        this.scoreStorage[this.currentLevel].killed = 0;
    }

    enemyDead(){
        console.log("SCORED!");
        this.scoreStorage[this.currentLevel].score += 10;
        this.scoreStorage[this.currentLevel].killed += 1;
    }
    currentScore() {
        return this.scoreStorage[this.currentLevel].score;
    }

    currentKills() {
        return this.scoreStorage[this.currentLevel].killed;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    clearAll() {
        this.scoreStorage = [];
        this.difficulty = 0;
        for(let i = 0; i < gameScenes.length; i++) {
            this.scoreStorage[i] = {};
            this.scoreStorage[i].score = 0;
            this.scoreStorage[i].killed = 0;
        }

        this.currentLevel = 0;
    }

    save() {
        if(storageAvailable('localStorage')) {
            console.log(`Saving!`);
            localStorage.setItem('score_data', JSON.stringify(this.scoreStorage));
            localStorage.setItem('current_level', this.currentLevel);
        } else {
            console.log(`Local storage is unsupported!`);
        }
    }

    load() {
        if(storageAvailable('localStorage')) {
            console.log(`Loading!`);
            let scoreData = localStorage.getItem('score_data');
            let currentLevel = localStorage.getItem('current_level');

            if(scoreData !== null && currentLevel !== null) {
                console.log(`Found saves!`);
                this.scoreStorage = JSON.parse(scoreData);
                this.currentLevel = 0;
            } else {
                console.log(`Saves not found!`);
            }
        } else {
            console.log(`Local storage is unsupported!`);
        }
    }

    clearSaves() {
        if(storageAvailable('localStorage')) {
            localStorage.removeItem('score_data');
            localStorage.removeItem('current_level');
        } else {
            console.log(`Local storage is unsupported!`);
        }
    }
}