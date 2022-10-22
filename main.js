// "Revolution is not something fixed in ideology, nor is it something fashioned to 
// a particular decade. It is a perpetual process embedded in the human spirit."

// evan 725 me and frank 385 - 770  385

const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store');
let mainWindow; //do this so that the window object doesn't get GC'd



// First instantiate the class
const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults: {
        // 800x600 is the default size of our window
        windowBounds: { width: 800, height: 600 },
        webPref: { webPreferences: { nodeIntegration: true } },
        prefTheme: {defaultTheme: ["#E6BA95", "#A2B38B", "#E4E9BE", "#FAFDD6"]},
        totalTotalValue: 0,
        expenseTotalValue: 0,
        incomeTotalValue: 0,

        groceriesTrackingValue: 0,
        rentTrackingValue: 0,
        gasTrackingValue: 0,
        entertainmentTrackingValue: 0,
        miscTrackingValue: 0,

        loveNoteArray: ["It's your cute developer bf...love you <3",
                        "I just think you are so cute baby b",
                        "My queen of queens you are looking so fine",
                        "You're so ripped your bf looks like a twig by you ;D",
                        "I love your ass more than you know",
                        "Houston we have a problem, Frank's heart is warmer than the sun...",
                        "I appreciate you more than you'll ever know",
                        "I wonder if a language will be created that will allow me to begin yo show you how much I love yo dick...",
                        "You got the biggest cutest butt on the whole block (( /",
                        "In a world of chaos the developer feels lucky to find stability with you"],
        defaultNoteArray: ["",
                           "",
                           "",
                           "",
                           "",
                           "",
                           "",
                           "",
                           "",
                           "",],
        surfNoteArray: ["A pool just isnt the same as the ocean. It has no energy. No life. -Linda Gerber",
                            "The largest wave ever recorded was 1720ft in 1958",
                            "There is no one right way to ride a wave. -Jamie O'Brien",
                            "If in doubt, paddle out. -Nat Young", "Sand on, stress off.",
                            "After a visit to the beach, its hard to believe that we live in a material world. —Pam Shaw",
                            "Estimated # of sand grains on earth: 7.5 Sextillion :o", "Even castles made from sand fall to the ocean. -Jimi Hendrix ",
                            "So lovely was the loneliness of a wild lake. -Edgar Allan Poe", "Cymophobia is the fear of waves"],
    }
});

app.on('ready', createWindow = function () {
    let { width, height } = store.get("windowBounds");
    let { webPreferences } = store.get("webPref");

    mainWindow = new BrowserWindow({ width, height, autoHideMenuBar: true, webPreferences, show: false })
    mainWindow.loadFile('src/index.html')

    mainWindow.on('resize', () => {
        // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
        // the height, width, and x and y coordinates.
        let { width, height } = mainWindow.getBounds();
        // Now that we have them, save them using the `set` method.
        store.set('windowBounds', { width, height });
    });

    var splash = new BrowserWindow({
        width,
        height,
        transparent: true,
        frame: false,
        alwaysOnTop: true
    });
    splash.loadFile('src/splash.html');
    splash.center();
    
    setTimeout(function () {
        splash.close();
        mainWindow.show();
    }, 2000);

    ipcMain.on('windowSize-reset', (event, arg) => {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        }
        mainWindow.setSize(800, 600);
    })
    ipcMain.on('appDataPathRequest', (event, arg) => {
        const appDataPath = app.getPath('userData');
        mainWindow.webContents.send("appDataPath", appDataPath);
    })
    

    // Open the DevTools.
   mainWindow.webContents.openDevTools()
});
console.log(app.getPath("userData"))
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the
    // app when the dock icon is clicked and there are no
    // other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// In this file, you can include the rest of your
// app's specific main process code. You can also
// put them in separate files and require them here.
