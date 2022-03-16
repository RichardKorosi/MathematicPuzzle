// premenna ktora uklada v sebe sucet.
var sucet = 0;
// -------------------------------------INTERACTJS-----------------------------------------------------------------
// Link na kniznicu, ktora bola pouzita: https://interactjs.io/
// (Drag and Drop a Dragging technologia pouzita, ale upravena podla mna a mojej logiky hry)

/* Drag */

import interact from "https://cdn.interactjs.io/v1.9.20/interactjs/index.js";
// pre elementy classy cisla nastav moznost tahania
interact(".cisla").draggable({
  listeners: {
    move: dragMoveListener,
  },
});

function dragMoveListener(event) {
  /* Funckia, ktora ma za ulohu aby spravne fungovalo dragovanie elementov */
  var posuvnik = event.target;
  // nastavovacky podla kniznice, berie info o x a y suradniciach
  var width = (parseFloat(posuvnik.getAttribute("data-x")) || 0) + event.dx;
  var height = (parseFloat(posuvnik.getAttribute("data-y")) || 0) + event.dy;
  // tranlatuje element s ktorym chcem hybat
  posuvnik.style.transform = "translate(" + width + "px, " + height + "px)";
  // meni poziciu elementu (setuje suradnice podla kurzoru)
  posuvnik.setAttribute("data-x", width);
  posuvnik.setAttribute("data-y", height);
}
/* DROP */

function dropListener(event) {
  // Ked dropnem cisla, tak stratia classu cisla a dostanu cisla_undraggable...
  // A zavola funkciu finished_level()
  event.relatedTarget.classList.remove("cisla");
  finished_level();
  console.log("Sucet po drope", sucet);
  event.relatedTarget.classList.add("cisla_undraggable");
}

function dragEnterListener(event) {
  // Funckia co prirata value karticky suctu, podla toho aky je level,
  // po tom ako vlozim karticku nad vysledkovy stvorcek
  if (
    JSON.parse(localStorage.getItem("Current_Level")) == "3" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "4" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "5"
  ) {
    // Priklady 3,4,5
    sucet += parseInt(event.relatedTarget.getAttribute("value")) + 1;
  } else if (
    JSON.parse(localStorage.getItem("Current_Level")) == "0" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "1" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "2"
  ) {
    // Priklady cislo 0,1,2
    sucet += parseInt(event.relatedTarget.getAttribute("value"));
  } else if (
    JSON.parse(localStorage.getItem("Current_Level")) == "6" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "7" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "8"
  ) {
    // Priklady cislo 6,7,8
    sucet += parseInt(event.relatedTarget.getAttribute("value")) - 1;
  } else if (JSON.parse(localStorage.getItem("Current_Level")) == "9") {
    // Priklad cislo 9
    sucet +=
      parseInt(event.relatedTarget.getAttribute("value")) *
      parseInt(event.relatedTarget.getAttribute("value"));
  }
  console.log("Sucet po prisunuti", sucet);
}

function dragLeaveListener(event) {
  // Pre pripad ze sa rozhodneme este pred dropnutim karticku s cislom
  // dat prec z vysledkoveho stvorca, tak nech odcita hodnotu, ktora bola pripocitana
  // po tom ako bola karticka vlozena nad stvorcek
  if (
    JSON.parse(localStorage.getItem("Current_Level")) == "3" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "4" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "5"
  ) {
    // Priklady 3,4,5
    sucet -= parseInt(event.relatedTarget.getAttribute("value")) + 1;
  } else if (
    JSON.parse(localStorage.getItem("Current_Level")) == "0" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "1" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "2"
  ) {
    // Priklady cislo 0,1,2
    sucet -= parseInt(event.relatedTarget.getAttribute("value"));
  } else if (
    JSON.parse(localStorage.getItem("Current_Level")) == "6" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "7" ||
    JSON.parse(localStorage.getItem("Current_Level")) == "8"
  ) {
    // Priklady cislo 6,7,8
    sucet -= parseInt(event.relatedTarget.getAttribute("value")) - 1;
  } else if (JSON.parse(localStorage.getItem("Current_Level")) == "9") {
    // Priklad cislo 9
    sucet -=
      parseInt(event.relatedTarget.getAttribute("value")) *
      parseInt(event.relatedTarget.getAttribute("value"));
  }
  console.log("Sucet po odstraneni", sucet);
}

interact(".kalkulacka").dropzone({
  listeners: {
    drop: dropListener,
    dragleave: dragLeaveListener,
    dragenter: dragEnterListener,
  },
  overlap: 0.9,
  accept: ".cisla",
});

//-----------------------JSON, Localstorage a prvé načítanie stránky----------------------------------------------------------------
// Tato cast kodu bola pouzita aj pri mojej Fotogalerii (Zadanie7), kod je inspirovany kodom z cviceni, na ktorom sme si ukazovali ako
// nacitavat data z .JSONu a zapisovat/ziskavat dáta do/z localStoragu.
function Load() {
  //Tato funkcia zoberie informacie z JSONu ulozi a ulozi ich do localStoragu
  // presne tak ako v zadani7 s fotogaleriou
  //
  // Pole kde si ulozim vsetky informacie z JSONu
  var ulohy = [];
  // Cisla uloh, ktore mozu byt hrane
  var cisla_moznych_uloh = [];
  var cislo_ulohy = 0;
  // Fetch tak ako aj v minulom zadani z jsonu
  fetch("ulohy.json")
    .then((res) => res.json())
    .then((data) => {
      data.questy.forEach((uloha_s_full_infom) => {
        ulohy.push(uloha_s_full_infom);
        cisla_moznych_uloh.push(cislo_ulohy);
        cislo_ulohy++;
      });
      localStorage.setItem("Ulohy", JSON.stringify(ulohy));
      localStorage.setItem("Mozne_Ulohy", JSON.stringify(cisla_moznych_uloh));
    });
}

if (JSON.parse(localStorage.getItem("Ulohy")) == null) {
  // Tu osetrujem pripad ktory nastal, ze pri prvom loade nemala stranka v localstorage vsetko co potrebovala,
  // ale na druhy load uz ano, takze bez toho aby si to niekto vsimol ju po prvom loade refreshnem.
  // (V localstorage nebolo vsetko ulozene, ale script uz chcel pracovat s datami co tam maju byt, takze nastal error).
  Load();
  setTimeout(function () {
    // Delay cez setTimout je cisto len preto, lebo Firefox zrejme nestihol skontrolovat podmienky a stale sa refreshoval,
    // po pridani kratkeho delay-u vsetko funguje tak ako ma...
    document.location.reload(true);
  }, 100);
} else {
  // Po druhom refreshy zistujem ci mam ulozeny current level (uz sa hralo)
  if (JSON.parse(localStorage.getItem("Current_Level")) == null) {
    // Ak nemam ulozeny ziaden level tak vygenerujem prvy
    var level = generate_next_level();
    addCisielkaToSection(level);
  } else {
    // Ak mam ulozeny level tak vykreslim ten
    level = JSON.parse(localStorage.getItem("Current_Level"));
    addCisielkaToSection(level);
  }
}

//-----------------------Vykreslovanie a funkcnost hry-------------------------------------------------------------------

/*
ID 1-9 -Cisielka [0..8]
ID 10 - Zadanie  [9]
ID 11 - Napoveda [10]
ID 12 - Riesenie [11]
ID 13 - Vysledok [12]
*/

function addCisielkaToSection(level) {
  //Tato funkcia prida "Cisielkove" divy do laveho stlpca
  // A taktiez aj zadanie ulohy do praveho
  var ulohy = JSON.parse(localStorage.getItem("Ulohy"));
  var i = 0;
  while (i < ulohy[level].length) {
    if (ulohy[level][i].id < 10) {
      //ID 1-9, i 0-8:
      const div = document.createElement("div");
      const h3 = document.createElement("h3");
      div.id = ulohy[level][i].id;
      div.setAttribute("value", ulohy[level][i].value);
      div.classList.add("cisla");
      h3.innerText = ulohy[level][i].value;
      h3.style.fontSize = "200%";
      document.getElementById("left").appendChild(div);
      document.getElementById(div.id).appendChild(h3);
    } else if (ulohy[level][i].id == 10) {
      // Na indexe 9 a ID 10 je zadanie úlohy
      const uloha = document.createElement("h2");
      uloha.innerHTML = ulohy[level][i].value;
      document.getElementById("right").appendChild(uloha);
    }
    i++;
  }
}

function generate_next_level() {
  //Funkcia vygeneruje *NAHODNE* novy level a odstrani ho z pola, kde su ulozene
  // povolene levely, aby sa potom neobjavil ked sa nema
  var cisla_moznych_uloh = JSON.parse(localStorage.getItem("Mozne_Ulohy"));
  // Ak je length 10, tak max cislo z tohto randomu je 9, takze to sedi...
  var next_level_index = Math.floor(
    Math.random() * JSON.parse(localStorage.getItem("Mozne_Ulohy")).length
  );
  // next_level si berie hodnotu z indexu
  var next_level = cisla_moznych_uloh[next_level_index];
  // Vymaze hodnotu na danom indexe
  cisla_moznych_uloh.splice(next_level_index, 1);
  //console.log("Po zmene", cisla_moznych_uloh);
  localStorage.setItem("Mozne_Ulohy", JSON.stringify(cisla_moznych_uloh));
  localStorage.setItem("Current_Level", JSON.stringify(next_level));
  return next_level;
}

document.getElementById("reset").onclick = function () {
  // Tlacitko co resetne level
  sucet = 0;
  document.getElementById("odpovednik").style.backgroundColor = "red";
  document.getElementById("next").style.display = "none";
  document.getElementById("next_disabled").style.display = "inline";
  document.getElementById("left").innerHTML = "";
  document.getElementById("right").innerHTML = "";
  addCisielkaToSection(level);
};

document.getElementById("next").onclick = function () {
  // Tlacitko co posuva na dalsi level
  document.getElementById("odpovednik").style.backgroundColor = "red";
  sucet = 0;
  level = generate_next_level();
  document.getElementById("left").innerHTML = "";
  document.getElementById("right").innerHTML = "";
  addCisielkaToSection(level);
  check_if_finished();
  document.getElementById("next").style.display = "none";
  document.getElementById("next_disabled").style.display = "inline";
};

document.getElementById("skip").onclick = function () {
  // Tlacitko co preskakuje level (kebyze niekto nechce dokoncit level normalne)
  document.getElementById("odpovednik").style.backgroundColor = "red";
  sucet = 0;
  level = generate_next_level();
  document.getElementById("left").innerHTML = "";
  document.getElementById("right").innerHTML = "";
  addCisielkaToSection(level);
  check_if_finished();
  document.getElementById("next").style.display = "none";
  document.getElementById("next_disabled").style.display = "inline";
};

document.getElementById("hint").onclick = function () {
  // Tlacitko co vypise hint
  var ulohy = JSON.parse(localStorage.getItem("Ulohy"));
  if (document.getElementById(ulohy[level][10].id) !== null) {
    // Ak sa uz nachadza na ploche, tak nech vymaze to co tam bolo, nech sa to tam nestackuje
    document.getElementById(ulohy[level][10].id).remove();
  }
  const hint = document.createElement("h2");
  hint.innerHTML = ulohy[level][10].value;
  hint.id = ulohy[level][10].id;
  document.getElementById("right").appendChild(hint);
};

document.getElementById("result").onclick = function () {
  // Tlacitko co napise riesenie
  var ulohy = JSON.parse(localStorage.getItem("Ulohy"));
  if (document.getElementById(ulohy[level][11].id) !== null) {
    document.getElementById(ulohy[level][11].id).remove();
  }
  const result = document.createElement("h2");
  result.innerHTML = ulohy[level][11].value;
  result.id = ulohy[level][11].id;
  document.getElementById("right").appendChild(result);
};

function finished_level() {
  // Skontroluje, ci je level splneny a ak ano povoli kliknutie na dalsi level
  var ulohy = JSON.parse(localStorage.getItem("Ulohy"));
  var level = JSON.parse(localStorage.getItem("Current_Level"));
  var pozadovany_vysledok = parseInt(ulohy[level][12].value);
  if (sucet === pozadovany_vysledok) {
    document.getElementById("next").style.display = "inline";
    document.getElementById("next_disabled").style.display = "none";
    document.getElementById("odpovednik").style.backgroundColor = "lightgreen";
  }
}

function check_if_finished() {
  // Funkcia skontroluje, ci su vycerpane vsetky levely, ak ano nastavi ich vsetky od zaciatku
  var cisla_moznych_uloh = JSON.parse(localStorage.getItem("Mozne_Ulohy"));
  if (cisla_moznych_uloh.length == 0) {
    var i = 0;
    while (i < JSON.parse(localStorage.getItem("Ulohy")).length) {
      cisla_moznych_uloh.push(i);
      i++;
    }
    localStorage.setItem("Mozne_Ulohy", JSON.stringify(cisla_moznych_uloh));
  }
}

//Zavolaj serviceWorker:
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("serviceWorker.js")
    .then((reg) => {
      console.log("Service worker sa registroval", reg);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Modal a backdrop a hudba
document.getElementById("close-modal").onclick = function () {
  document.getElementById("backdrop").style.display = "none";
};

document.getElementById("printer").onclick = function () {
  window.print();
};

document.getElementById("uvod").onclick = function () {
  document.getElementById("backdrop").style.display = "flex";
};

var playing = false;
document.getElementById("hudba").onclick = function () {
  if (playing == false) {
    document.getElementById("znelka").play();
    playing = true;
  } else {
    document.getElementById("znelka").pause();
    playing = false;
  }
};
