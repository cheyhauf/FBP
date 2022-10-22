const { ipcRenderer } = require('electron')
var fs = require('fs');

const resetWindowSizeButton = document.getElementById('reset-windowSize-button')
resetWindowSizeButton.addEventListener('click', function () {
    ipcRenderer.send('windowSize-reset')
})
const consoleClearButton = document.getElementById("clear-console-button");
consoleClearButton.addEventListener('click', function(){
    ipcRenderer.send('appDataPathRequest')
    ipcRenderer.on('appDataPath', function (event, arg) {
        const appDataPath = arg;
        const consoleElement = document.getElementById("console");
        var consoleElementLogs = Array.from(consoleElement.childNodes);
        for (var i = 0; i < consoleElementLogs.length; i++) {
            // console.log(consoleElementLogs[i].innerHTML);
            store.delete(i + "-consoleLog");
            fs.appendFile(appDataPath + "/consoleLog.txt", consoleElementLogs[i].textContent + "\r\n", function (err) {
                if (err) throw err;
                console.log("Appending Save File...");
            })
            consoleElementLogs[i].remove()
        }
        console.log("Console Saved Successfully");
        store.set("numberOfLogs", 0);
    });
})



function restoreValues () {
    var BPconsole = document.getElementById("console");
    numLogs = store.get("numberOfLogs");
    //grab the 7 tracked values as well as console log from theme store and restore them 
    document.getElementById("total-total-value").innerHTML = store.get("totalTotalValue");
    document.getElementById("total-expense-value").innerHTML = store.get("expenseTotalValue");
    document.getElementById("total-income-value").innerHTML = store.get("incomeTotalValue");
    
    document.getElementById("groceriesTrackingValue").innerHTML = store.get("groceriesTrackingValue");
    document.getElementById("rentTrackingValue").innerHTML = store.get("rentTrackingValue");
    document.getElementById("gasTrackingValue").innerHTML = store.get("gasTrackingValue");
    document.getElementById("entertainmentTrackingValue").innerHTML = store.get("entertainmentTrackingValue");
    document.getElementById("miscTrackingValue").innerHTML = store.get("miscTrackingValue");

    for (var i = numLogs - 1; i >= 0; i--) {
        var span = document.createElement('span');
        span.innerHTML = store.get(i + "-consoleLog");
        BPconsole.prepend(span);
    }

    
}
restoreValues();

const consoleElement = document.getElementById("console");
const consoleObserver = new MutationObserver(function () {
    var consoleElement = document.getElementById('console');
    var consoleElementLogs = Array.from(consoleElement.childNodes);
    var numLogs = 0;
    for (var i=0; i < consoleElementLogs.length; i++){
        //console.log(consoleElementLogs[i].innerHTML);
        store.set(i + "-consoleLog", consoleElementLogs[i].innerHTML)
        numLogs += 1;
    }
    store.set("numberOfLogs", numLogs);
});
consoleObserver.observe(consoleElement, { subtree: true, childList: true });

//Console log function - accepts argument 1 as what to log
function BPconsoleLog( message, color ) { 
    var today = new Date().toLocaleDateString();
    var span = document.createElement('span');
    span.innerHTML = "<span style='color: " + color + ";'>" + today + " > " + message + "</span><br>";
    var elm = document.getElementById("console");
    elm.prepend( span );
}
//log colors
var expenseColor = "#5c1823";
var incomeColor = "#1b5e32";

function BPconsoleMessageChooser ( key ) {
    //init full message arrays for replacement
    loveNoteArrayFull = ["It's your cute developer bf...love you <3", "You are so cute baby b :))", "My queen of queens you are looking so fine", "You're so ripped your bf looks like a twig by you ;D", "I love your ass more than you know", "Houston we have a problem, Frank's heart is warmer than the sun...", "I appreciate you more than you'll ever know", "I wonder if a language will be created that will allow me to begin yo show you how much I love yo dick...", "You got the biggest cutest butt on the whole block (( /", "In a world of chaos the developer feels lucky to find stability with you"];
    defaultNoteArrayFull = [];
    surfNoteArrayFull = ["A pool just isnt the same as the ocean. It has no energy. No life. -Linda Gerber", "The largest wave ever recorded was 1720ft in 1958", "There is no one right way to ride a wave. -Jamie O'Brien", "If in doubt, paddle out. -Nat Young", "Sand on, stress off.", "After a visit to the beach, its hard to believe that we live in a material world. —Pam Shaw", "Estimated # of sand grains on earth: 7.5 Sextillion :o", "Even castles made from sand fall to the ocean. -Jimi Hendrix ", "So lovely was the loneliness of a wild lake. -Edgar Allan Poe", "Cymophobia is the fear of waves"];

    //get stored string name
    storedPrefTheme = store.get("prefTheme");
    storedPrefThemeName = Object.keys(storedPrefTheme)[0];
    //grab arrays from storage
    loveNoteArray = store.get("loveNoteArray");
    defaultNoteArray = store.get("defaultNoteArray");

    //lovenote key handler
    if (loveNoteArray.length == 0) {
        store.set("loveNoteArray", loveNoteArrayFull);
        return;
    }
    if (key == "loveNote") {
        var loveNoteMessage = loveNoteArray[Math.floor(Math.random() * loveNoteArray.length)];
        BPconsoleLog(loveNoteMessage, "#f5429e");
        loveNoteArray.indexOf(loveNoteMessage) > -1 ? loveNoteArray.splice(loveNoteArray.indexOf(loveNoteMessage), 1) : false
        store.set("loveNoteArray", loveNoteArray);
        return;
    }

    //Dependant on which theme is active, select message
    if ( key == "themeInfo") {
        if (storedPrefThemeName == "defaultTheme") {
            console.log("Testings")

        } else if (storedPrefThemeName == "surfTheme") {

        } else if (storedPrefThemeName == "espressoTheme") {

        } else if (storedPrefThemeName == "marinaTheme") {

        } else if (storedPrefThemeName == "lunaTheme") {

        }
    }
}
// BPconsoleMessageChooser("loveNote");

//form update on expense submit
const expenseForm = document.forms[0];

expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    for (const formElement of formData) {
        var trackingValue = parseFloat(document.getElementById(formElement[0] + "TrackingValue").innerHTML);
        var totalValue = parseInt(document.getElementById("total-total-value").innerHTML);
        var totalExpenseValue = parseInt(document.getElementById("total-expense-value").innerHTML);
        var expenseValue = parseFloat(formElement[1]);

        if (isNaN(expenseValue)) {
            continue
        }
        store.set(formElement[0] + "TrackingValue", trackingValue - expenseValue);
        store.set("totalTotalValue", totalValue - expenseValue);
        store.set("expenseTotalValue", totalExpenseValue + expenseValue);
        document.getElementById(formElement[0] + "TrackingValue").innerHTML = trackingValue - expenseValue;
        document.getElementById("total-total-value").innerHTML = totalValue - expenseValue;
        document.getElementById("total-expense-value").innerHTML = totalExpenseValue + expenseValue;
        if (expenseValue < 0) {
            BPconsoleLog("Added " + expenseValue + " to " + formElement[0], incomeColor);
        } else {
            BPconsoleLog("Spent " + expenseValue + " on " + formElement[0], expenseColor);
        }
    }
    expenseForm.reset();
});

//budget settings forms

const budgetForm = document.forms[1];

budgetForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const budgetFormData = new FormData(this);

    for (const budgetFormElement of budgetFormData) {
        var budgetTrackingValue = parseFloat(document.getElementById(budgetFormElement[0] + "TrackingValue").innerHTML);
        var totalValue = parseInt(document.getElementById("total-total-value").innerHTML);
        var totalIncomeValue = parseInt(document.getElementById("total-income-value").innerHTML);
        budgetValue = parseFloat(budgetFormElement[1]);
        if (isNaN(budgetValue)) {
            continue
        }
        store.set(budgetFormElement[0] + "TrackingValue", budgetTrackingValue + budgetValue);
        store.set("totalTotalValue", totalValue + budgetValue);
        store.set("incomeTotalValue", totalIncomeValue + budgetValue);
        document.getElementById(budgetFormElement[0] + "TrackingValue").innerHTML = budgetTrackingValue + budgetValue;
        document.getElementById("total-total-value").innerHTML = totalValue + budgetValue;
        document.getElementById("total-income-value").innerHTML = totalIncomeValue + budgetValue;
        if (budgetValue < 0) {
            BPconsoleLog("Spent " + budgetValue + " on " + budgetFormElement[0], expenseColor);
        } else {
            BPconsoleLog("Added " + budgetValue + " to " + budgetFormElement[0], incomeColor); 
        }
    }
    budgetForm.reset();
});

// total settings form

const totalForm = document.forms[2];

totalForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const totalFormData = new FormData(this);

    for (const totalFormElement of totalFormData) {
        // var totalValue = parseInt(document.getElementById("total-" + totalFormElement[0] + "-value").innerHTML);
        newValue = parseFloat(totalFormElement[1]);
        if (isNaN(newValue)) {
            continue
        } else{
            store.set(totalFormElement[0] + "TotalValue", newValue);
            document.getElementById("total-" + totalFormElement[0] + "-value").innerHTML = newValue;
            BPconsoleLog(totalFormElement[0] + " changed to " + newValue, "--var(--text-color)");
        }
    }
    totalForm.reset();
});


//show and hide budget input settings button press 
const budgetSettingsBox = document.getElementById('budget-settings-panel');
const budgetSettingsButton = document.getElementById('budget-settings-button');

budgetSettingsButton.addEventListener('click', function handleClick() {
    if (budgetSettingsBox.style.display === 'inline-block') {
        budgetSettingsBox.style.display = 'none';

        //initial
        budgetSettingsButton.style.backgroundColor = "var(--text-color)";
        budgetSettingsButton.style.color = "var(--title-bg)";
    } else {
        //after click
        budgetSettingsBox.style.display = 'inline-block';

        budgetSettingsButton.style.backgroundColor = "var(--title-bg)";
        budgetSettingsButton.style.color = "var(--text-color)";
    }
});

//Get all dom id's to change color, can refactor with css inherit but its fine for now
const totalSettingsBox = document.getElementById('total-settings-panel');
const totalSettingsIconBoxLeft = document.getElementById('total-icon-box');
// const totalSettingsIconBoxRight = document.getElementById('total-icon-box');
const totalSettingsButton = document.getElementById('total-settings-button');
const totalValuesBox = document.getElementById('totals-bg');
const expenseTotalBox = document.getElementById('total-expense-box');
const expenseTotalValue = document.getElementById('total-expense-value');
const expenseTotalLabel = document.getElementById('total-expense-label');
const totalValueBox = document.getElementById('total-value-box');
const totalValue = document.getElementById('total-total-value');
const totalValueLabel = document.getElementById('total-label');
const incomeTotalBox = document.getElementById('total-income-box');
const incomeTotalValue = document.getElementById('total-income-value');
const incomeTotalLabel = document.getElementById('total-income-label');

//on button click, show html and change colors
totalSettingsButton.addEventListener('click', function handleClick() {
    //
    if (totalSettingsBox.style.display === 'flex') {
        totalSettingsBox.style.display = 'none';

        //Cosmetic Color Change
        totalSettingsButton.style.backgroundColor = "var(--text-color)";
        totalSettingsButton.style.color = "var(--title-bg)";
        totalSettingsIconBoxLeft.style.backgroundColor = "var(--title-bg)";
        expenseTotalBox.style.backgroundColor = "var(--title-bg)";
        expenseTotalLabel.style.color = "var(--text-color)";
        expenseTotalValue.style.color = "var(--text-color)";
        totalValueBox.style.backgroundColor = "var(--title-bg)";
        totalValue.style.color = "var(--text-color)";
        totalValueLabel.style.color = "var(--text-color)";
        incomeTotalBox.style.backgroundColor = "var(--title-bg)";
        incomeTotalValue.style.color = "var(--text-color)";
        incomeTotalLabel.style.color = "var(--text-color)";
        totalValuesBox.style.backgroundColor = "var(--title-bg)";
    } else {
        //
        totalSettingsBox.style.display = 'flex';


        //cosmetic color change 
        totalSettingsButton.style.backgroundColor = "var(--title-bg)";
        totalSettingsButton.style.color = "var(--text-color)";
        totalSettingsIconBoxLeft.style.backgroundColor = "var(--text-color)";
        expenseTotalBox.style.backgroundColor = "var(--text-color)";
        expenseTotalLabel.style.color = "var(--title-bg)";
        expenseTotalValue.style.color = "var(--title-bg)";
        totalValueBox.style.backgroundColor = "var(--text-color)";
        totalValue.style.color = "var(--title-bg)";
        totalValueLabel.style.color = "var(--title-bg)";
        incomeTotalBox.style.backgroundColor = "var(--text-color)";
        incomeTotalValue.style.color = "var(--title-bg)";
        incomeTotalLabel.style.color = "var(--title-bg)";
        totalValuesBox.style.backgroundColor = "var(--text-color)";
    }

});

function startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    ap = (hr < 12) ? "<span>AM</span>" : "<span>PM</span>";
    hr = (hr == 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = hr + ":" + min + ":" + sec + " " + ap;

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var curWeekDay = days[today.getDay()];
    var curDay = today.getDate();
    var curMonth = months[today.getMonth()];
    var curYear = today.getFullYear();
    var date = curWeekDay + " " + curMonth + " " + curDay + ", " + curYear;
    document.getElementById("date").innerHTML = date;

    var time = setTimeout(function () { startTime() }, 500);
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
startTime();

//show and hide budget input settings button press 
const utilitySettingsBox = document.getElementById('utility-panel');
const utilitySettingsButton = document.getElementById('utility-panel-button');

utilitySettingsButton.addEventListener('click', function handleClick() {
    if (utilitySettingsBox.style.display === 'flex') {
        utilitySettingsBox.style.display = 'none';

        //initial
        utilitySettingsButton.style.backgroundColor = "var(--text-color)";
        utilitySettingsButton.style.color = "var(--title-bg)";
        consoleElement.style.maxHeight = "17.75rem";
        consoleElement.style.bottom = "1.25rem"
    } else {
        //after click
        utilitySettingsBox.style.display = 'flex';

        utilitySettingsButton.style.backgroundColor = "var(--title-bg)";
        utilitySettingsButton.style.color = "var(--text-color)";
        consoleElement.style.maxHeight = "16rem";
        consoleElement.style.bottom = "3rem"
    }
});