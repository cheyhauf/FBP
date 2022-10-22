const Store = require('electron-store');
const store = new Store();

// bg, text, fade, titlebg
let defaultTheme = ["#E6BA95", "#A2B38B", "#E4E9BE", "#FAFDD6"];
var surfTheme = ["#F9EBC8", "#A0BCC2", "#DAE5D0", "#FEFBE7"];
let espressoTheme = ["#E4CDA7", "#8E806A", "#8E806A", "#FFE6BC"];
let marinaTheme = ["#F0EBE3", "#7D9D9C", "#576F72", "#E4DCCF"];
let lunaTheme = ["#F39189", "#6E7582", "#046582", "#BB8082"];

function changeCSS() {
    var root = document.querySelector(':root');
    root.style.setProperty('--background-color', arguments[0]);
    root.style.setProperty('--text-color', arguments[1]);
    root.style.setProperty('--title-fade', arguments[2]);
    root.style.setProperty('--title-bg', arguments[3]);
}

var storeTheme = store.get('prefTheme');
// console.log("chetwoodTheme" in storeTheme);

let prop1 = "surfTheme";
let prop2 = "espressoTheme";
let prop3 = "marinaTheme";
let prop4 = "lunaTheme";

if (prop1 in storeTheme) {
    changeCSS(...surfTheme);
} else if (prop2 in storeTheme) {
    changeCSS(...espressoTheme);
} else if (prop3 in storeTheme) {
    changeCSS(...marinaTheme);
} else if (prop4 in storeTheme) {
    changeCSS(...lunaTheme);
} else  {
    changeCSS(...defaultTheme);
}


var surfThemeButton = document.getElementById("surf");
surfThemeButton.addEventListener("click", () => {
    changeCSS(...surfTheme);
    store.set('prefTheme', { surfTheme });
});

var espressoThemeButton = document.getElementById("espresso");
espressoThemeButton.addEventListener("click", () => {
    changeCSS(...espressoTheme);
    store.set('prefTheme', { espressoTheme });
});

var defaultThemeButton = document.getElementById("defaultTheme");
defaultThemeButton.addEventListener("click", () => {
    changeCSS(...defaultTheme);
    store.set('prefTheme', { defaultTheme });
});

var marinaThemeButton = document.getElementById("marina");
marinaThemeButton.addEventListener("click", () => {
    changeCSS(...marinaTheme);
    store.set('prefTheme', { marinaTheme });
});

var lunaThemeButton = document.getElementById("luna");
lunaThemeButton.addEventListener("click", () => {
    changeCSS(...lunaTheme);
    store.set('prefTheme', { lunaTheme });
});

// function loadCSS(load) {
//     var head = document.getElementsByTagName("head")[0];
//     var link = document.createElement("link");
//     link.rel = "stylesheet";
//     link.type = "text/css";
//     link.href = path.join(__dirname, "../assets/"
//         + load + ".css");
//     head.appendChild(link);
// }