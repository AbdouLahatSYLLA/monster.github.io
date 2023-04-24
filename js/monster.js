/* Daniel THARMARAJAH 12000230 (TP1)
 * Abdou lahat sylla 12011836 (TP3)
 **/
let name, life, money, awake, dead, score, bestScore = 0;
let i = 0;
let run, fight, work, sleep, eat, show, newLife, kill;
let actions, boite, status, monstre;
let son_active;
let active = false;
const max_Life = 20;
let rando, changecol,pts;
let imageSrc = 'images/monstre_court.png';
let monImg; // variable pour que le changement d'image soit instantanné
let lock = false; // pour l'utiliser comme avec les semaphores
let id;
let boutons;
let colors = ["#43cea2", "#136a8a", "#185a9d"]
let caneva = document.getElementById('canva');
actions = [seBattre, travailler, courir]; //pour que ça soit plus fun :) c'est à nous de le maintenir en vie
function init_monstre(nom, vie, argent) {
    name = nom;
    life = vie;
    money = argent;
    score = 0;
    awake = true;
    dead = false;

};

function initVariables() {
    run = document.getElementById("run");
    fight = document.getElementById("fight");
    work = document.getElementById("work");
    sleep = document.getElementById("sleep");
    eat = document.getElementById("eat");
    show = document.getElementById("show");
    newLife = document.getElementById("new");
    kill = document.getElementById("kill");
    boite = document.getElementById("actionbox");
    status = document.getElementById("statut");

}

function courir() {
    if (life < 3) {
        logBoite("Le monstre risque d'y laisser la vie ");
    }
    if (score > 0 && score < 10) {
        life -= 1;
    } else if (score > 10 && score < 50) {
        life -= 2;
    } else {
        life -= 3;
    }
    if(active){
        document.getElementById("court").play()
    }
    logBoite("Le monstre court");
    imageSrc = 'images/monstre_court.png';
    animer_monstre(10);
    if (life <= 0) {
        mort();
        updateStatus();
        return;
    }
    updateStatus();
    rando = setInterval(actionauhasard, 2500);

}



function seBattre() {
    if (life < 5) {
        logBoite("Le monstre risque d'y laisser la vie");
        rando = setInterval(actionauhasard, 2500);
    }
    if(active){
        document.getElementById("bat").play()
    }
    if (score > 10 && score < 30) {
        life -= 4;
    } else if (score > 30 && score < 50) {
        life -= 5;
    } else if (score > 50) {
        life -= 6;
    } else {
        life -= 3;
    }

    logBoite("Le monstre se bat");
    imageSrc = 'images/monstre_bat.png';
    animer_monstre(10);
    if (life <= 0) {
        mort();
        updateStatus();
        clearInterval(rando);
        return;
    }
    updateStatus()
    rando = setInterval(actionauhasard, 2500);

}

function manger() {
    if (money > 3) {
        if(active){
            document.getElementById("mange").play()
        }
        life += 2;
        if (life > max_Life) {
            life = max_Life;
        }
        money -= 3;
        logBoite("Le monstre mange");
        imageSrc = 'images/monstre_mange.png';
        animer_monstre(10);

        updateStatus();
        rando = setInterval(actionauhasard, 2500);
    } else {
        logBoite("Le monstre n'a pas assez d'argent");
        rando = setInterval(actionauhasard, 2500);

    }
}

function travailler() {
    if (life < 3) {
        logBoite("Le monstre risque d'y laisser la vie");
    }
    if (score > 0 && score < 10) {
        life -= 1;
    } else if (score > 10 && score < 20) {
        life -= 2;
    } else {
        life -= 3;
    }
    if(active){
        document.getElementById("taff").play()
    }
    money += 2;
    logBoite("Le monstre bosse");
    imageSrc = 'images/monstre_work.png';
    animer_monstre(10);
    if (life <= 0) {
        mort();
        updateStatus();
        return;
    }
    updateStatus()
    rando = setInterval(actionauhasard, 2500);


}

function dormir() {
    if(active){
        document.getElementById("dort").play()
    }
    desactiver_bouton();
    awake = false;
    clearInterval(changecol);
    document.querySelector("body").style.backgroundColor = '#6441A5';
    logBoite("Le monstre dort profondément");
    imageSrc = 'images/monstre_dodo.png';
    animer_monstre(10);
    clearInterval(rando);
    updateStatus();
    setTimeout(() => {
        awake = true;
        life++;
        if (life > max_Life) {
            life = max_Life;
        }
        updateStatus();
        reactiver_bouton();
        rando = setInterval(actionauhasard, 2500);
        changecol = setInterval(bgColor, 2000);
    }, 1000)
}

function afficheMonstre() {
    let msg = "nom : " + name + ', ' + 'Vie: ' + life + ', ' + "Argent: " + money + ',' + (dead ? "Mort" : (awake ? "Éveillé" : "Endormi"));
    console.log(msg);
    logBoite(msg);
    imageSrc = 'images/monstre_normal.png';
    animer_monstre(10);
    rando = setInterval(actionauhasard, 2500);

}

function go() {
    initVariables();
    majScore();
    window.requestAnimationFrame(afficheMonstre);
    /** premier degres de difficulté */
    changecol = setInterval(bgColor, 2000);
    son_active = document.getElementById("son");
    monImg = document.createElement('img');
    init_monstre("Le Rat", max_Life, 20);
    boutons = [eat, sleep, fight, run, work, show];
    show.addEventListener("click", () => actionCliquee(afficheMonstre));
    updateStatus();
    run.addEventListener('click', () => actionCliquee(courir));
    fight.addEventListener('click', () => actionCliquee(seBattre));
    work.addEventListener('click', () => actionCliquee(travailler));
    eat.addEventListener('click', () => actionCliquee(manger));
    sleep.addEventListener('click', () => actionCliquee(dormir));
    kill.addEventListener('click', () => actionCliquee(mort));
    newLife.addEventListener('click', () => actionCliquee(comeBack));
    son_active.addEventListener('click',(e) =>{
        active = (active === true) ? false : true ;
        e.target.style.backgroundColor = active ? 'green' : 'red';
    })

}

function logBoite(message) {
    let p = document.createElement("p");
    p.innerText = message;
    boite.insertBefore(p, boite.firstChild);
}

function updateStatus() {
    let color;
    let vie = status.firstElementChild;
    let argent = vie.nextElementSibling;
    let eveil = argent.nextElementSibling;
    let duree = eveil.nextElementSibling;
    let record = status.lastElementChild;

    vie = document.querySelector("progress");
    vie.setAttribute("value", life);
    vie.classList.add("bonneSante");
    vie.classList.toggle("enDanger", life <= 5);


    argent.textContent = "Argent: " + money + ' $';
    eveil.textContent = dead ? "Mort" : (awake ? "Éveillé" : "Endormi");
    duree.textContent = "Score: " + score;
    record.textContent = "Meilleur score: " + bestScore;

}

function actionauhasard() {

    clearInterval(rando);
    clearInterval(id);

    let index = Math.floor(Math.random() * actions.length);
    actions[index]();


}

function mort() {
    if(active){
        document.getElementById("mort").play()
    }
    dead = true;
    clearInterval(pts);
    clearInterval(rando);
    clearInterval(changecol);
    clearInterval(id);
    desactiver_bouton();
    imageSrc = 'images/monstre_mort.png';
    animer_monstre(10);
    if (score <= 30) {
        window.alert("Mon petit frére de 3 ans fait mieux :) \nScore:" + score);
    }
    if (score > 30 && score < 50) {
        window.alert("Pas mal mais peut mieux faire ;) \nScore:" + score);
    }
    if (score > 50 && score < 100) {
        window.alert("T'as failli aller chercher le record  \nScore:" + score);
    }

    if (score >= 100) {
        window.alert("Le Monstre est mort (^_^)  \nScore:" + score);
    }

    if (score >= bestScore) {
        bestScore = score;
    }
    updateStatus();
}

function comeBack() {
    dead = false;
    reactiver_bouton();
    init_monstre("Le Rat", 20, 20);
    score = 0;
    updateStatus();
    reactiver_bouton();
    rando = setInterval(actionauhasard, 2500);
    changecol = setInterval(bgColor, 2000);
    boite.innerHTML = '<p>Monster life log</p>'
    majScore();
}

/** avancé  */
/** creation de l'animation avec les canva en var globale */

function majScore() {
    pts = setInterval(() => {
        score += 1;
        if (score >= bestScore) {
            bestScore = score;
        }        
    }, 1500)
}


function animer_monstre(vitesse) {
    let ctx = caneva.getContext('2d');
    ctx.linewidth = '5';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, caneva.width, caneva.height);
    /** ajout de l'image et des mouvement de l'image */

    monImg.setAttribute('src', imageSrc);
    //let monMonstre = document.querySelector("img");
    ctx.drawImage(monImg, 10, 100, 50, 50);
    const size = 100;
    let x = 10,
        y = 75;
    /** mouvements du monstre avec un interval de temps  */


    id = setInterval(() => {
        x += 10;
        if (x >= caneva.width) {
            clearInterval(id);
        }
        ctx.clearRect(0, 0, caneva.width, caneva.height);
        ctx.fillRect(0, 0, caneva.width, caneva.height);
        ctx.drawImage(monImg, x, y, size, size);
    }, vitesse)

}

function desactiver_bouton() {
    boutons.forEach(e => { e.disabled = true });
}

function reactiver_bouton() {
    boutons.forEach(e => { e.disabled = false });
}


window.addEventListener('load', go);

function bonnus() {
    life += 3;
    logBoite("OHHHH ! BONNUS de 5");
    imageSrc = 'images/monstre_normal.png';
    animer_monstre(10);
    rando = setInterval(actionauhasard, 2500);
}

function actionCliquee(action) {
    clearInterval(rando);
    clearInterval(id);
    let ctx = caneva.getContext('2d');
    ctx.clearRect(0, 0, caneva.width, caneva.height);
    ctx.strokeRect(0, 0, caneva.width, caneva.height);
    action();
}

function bgColor() {
    document.querySelector("body").style.backgroundColor = colors[(i++) % colors.length]
}