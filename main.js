/* jshint node: true */
'use strict';

const electron = require('electron'),
    fs = require('fs'),
    path = require('path');

const app = electron.app,
  BrowserWindow = electron.BrowserWindow,
  Menu = electron.Menu/*,
  MenuItem = electron.MenuItem*/;

let mainWindow,
  menu;

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'GoodieBag Alpha',
    resizable: true,
    nodeIntegration: false,
    'auto-hide-menu-bar': true
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

function createMenu (devTools) {
  if (process.platform !== 'darwin') {
    let template = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: function() { mainWindow.close(); }
          },
        ]
      },
      {
        label: '&View',
        submenu: [
          {
            label: '&Reload',
            accelerator: 'F5',
            click: function() { mainWindow.webContents.reloadIgnoringCache(); }
          }
        ]
      },
    ];

    if (devTools) {
      template[1].submenu.push({
        label: '&Toggle DevTools',
        accelerator: 'Alt+Ctrl+I',
        click: function() { mainWindow.toggleDevTools(); }
      });
    }

    menu = Menu.buildFromTemplate(template);
    mainWindow.setMenu(menu);
  }
  else {
    var template = [
      {
        label: 'GoodieBag',
        submenu: [
          {
            label: 'About GoodieBag',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Services',
            submenu: []
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide GoodieBag',
            accelerator: 'Command+H',
            selector: 'hide:'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:'
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() { app.quit(); }
          },
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Undo',
            accelerator: 'Command+Z',
            selector: 'undo:'
          },
          {
            label: 'Redo',
            accelerator: 'Shift+Command+Z',
            selector: 'redo:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:'
          },
          {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:'
          },
          {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:'
          },
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'Command+R',
            click: function() { mainWindow.webContents.reloadIgnoringCache(); }
          }
        ]
      }
    ];

    if (devTools) {
      template[2].submenu.push({
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: function() { mainWindow.toggleDevTools(); }
      });
    }

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}

app.on('window-all-closed', function() {
  if (app.listeners('window-all-closed').length === 1) {
    app.quit();
  }
});

app.on('ready', function() {
  createMainWindow(true);
  createMenu(true);

  try {
    fs.accessSync(path.join(__dirname, 'dist'));
    mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
  }
  catch (e) {
    mainWindow.loadURL('file://' + __dirname + '/index.html');
  }
  mainWindow.focus();
});
