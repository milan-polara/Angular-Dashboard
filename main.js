const { app, BrowserWindow } = require("electron");
// const { exec } = require("child_process");
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(
                __dirname,
                "dist/dashboard/assets/server/preload.js"
            ), // add "preload"
        },
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.webContents.session.clearStorageData();
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `dist/dashboard/index.html`),
            protocol: "file:",
            slashes: true,
        })
    );
    // // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.webContents.on("did-fail-load", async (err) => {
        await mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, `dist/dashboard/index.html`),
                protocol: "file:",
                slashes: true,
            })
        );
    });

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) createWindow();
});
