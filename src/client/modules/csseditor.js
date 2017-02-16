/**
 * BetterDiscord CSS Editor Module
 * Copyright (c) 2015-present Jiiks - https://jiiks.net
 * All rights reserved.
 * https://github.com/Jiiks/BetterDiscordApp - https://betterdiscord.net
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree. 
*/

'use strict';

const { remote } = require('electron');
const ISingleton = require('../interfaces/isingleton');
const { Events } = require('./events');
const { $ } = require('../vendor');

class CssEditor extends ISingleton {

    constructor() {
        super("css-editor");
        let self = this;
        if(self.editor) return;
        self.editor = {
            open: false,
            options: {
                'frame': false, 
                'minWidth': 780, 
                'minHeight': 400
            }
        };
        $("head").append('<style id="customcss"></style>');
    }

    updateCss(data) {
        $("#customcss").text(data);
    }

    setExEditorCss(data) {
        let self = this;
        if(self.editor.window) {
            self.editor.window.webContents.send('set-css', data);
        }
    }

    open() {
        let self = this;
        if(self.editor.open || self.editor.window) {
            self.editor.window.focus();
            self.editor.window.flashFrame(true);
            return;
        }

        self.editor.window = new remote.BrowserWindow(self.editor.options);
        self.editor.open = true;
        self.loadURL("file://g:/bd/data/csseditor.html"); //Static path for testing
        self.editor.window.on('close', self.onClose.bind(self));
        self.editor.window.on('resize', self.onResize.bind(self));
        self.editor.window.on('move', self.onMove.bind(self));
    }

    loadURL(url) {
        let self = this;
        if(!self.editor.window) return;
        self.editor.window.loadURL(url);
    }

    onClose() {
        let self = this;
        self.editor.open = false;
        self.editor.window = null;
    }

    onResize() {
        let self = this;
        let {width, height} = self.editor.window.getBounds();
        self.editor.options.width = width;
        self.editor.options.height = height;
    }

    onMove() {
        let self = this;
        let {x, y} = self.editor.window.getBounds();
        self.editor.options.x = x;
        self.editor.options.y = y;
    }

}

module.exports = new CssEditor();