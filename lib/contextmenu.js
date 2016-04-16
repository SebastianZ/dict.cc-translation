/* ***** BEGIN LICENSE BLOCK *****
 
 * Author: Santo Pfingsten (Roughael)
 
 * This file is part of The Firefox Dict.cc Addon.
 
 * The Firefox Dict.cc Addon is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 
 * The Firefox Dict.cc Addon is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 
 * You should have received a copy of the GNU General Public License
 * along with The Firefox Dict.cc Addon.  If not, see http://www.gnu.org/licenses/.
 
 * ***** END LICENSE BLOCK ***** */

//todo:
// - rebuild menu on translations list change
// - rebuild menu on "show first on root level" change

var self = require("sdk/self");
var cm = require("sdk/context-menu");
var preferences = require("./preferences");
var translator = require("./translator");
var _i18n = require("./i18n").get;

var ellipsis = "\u2026";

var wordUnderCursor;
var rootMenu;
var firstEntry;

function destroy() {
    if (rootMenu)
        rootMenu.destroy();
    if (firstEntry)
        firstEntry.destroy();
}

function createTranslationEntry(translation) {
    return cm.Item({
        label: translation.label,
        image: self.data.url('dictcc.png'),
        data: translation.subdomain,
        contentScript: 'self.on("click", function(){self.postMessage();});',
        onMessage: function () {
            translator.run(wordUnderCursor, translation.subdomain, false);
        }
    });
}

function create() {
    destroy();
    if (!preferences.get('context.enabled'))
        return;

    var children = [];
    var translations = preferences.getTranslations();
    var firstItem = preferences.get('context.showFirst');
    var start = firstItem ? 1 : 0;
    for (var i = start; i < translations.length; i++)
        children.push(createTranslationEntry(translations[i]));

    children.push(cm.Separator());
    var optionsEntry = cm.Item({
        label: _i18n("menuOptions"),
        image: self.data.url('dictcc.png')
    });
    children.push(optionsEntry);
    rootMenu = cm.Menu({
        label: _i18n("menuNone"),
        image: self.data.url('dictcc.png'),
        items: children
    });

    if (firstItem && translations.length > 0)
        firstEntry = createTranslationEntry(translations[0]);
}
create();

exports.setWordUnderCursor = function (word) {
    if (!rootMenu)
        return;

    wordUnderCursor = word;
    // Update labels
    if (word.length > 15)
        word = word.substring(0, 15) + ellipsis;

    var translations = preferences.getTranslations();
    if (word !== "") {
        rootMenu.label = _i18n("menuSelection").replace('{TEXT}', word);

        if (firstEntry) {
            var label = _i18n("menuFirstSelection");
            label = label.replace('{TEXT}', word);
            label = label.replace('{LABEL}', translations[0].label);
            firstEntry.label = label;
        }
    } else {
        rootMenu.label = _i18n("menuNone");

        if (firstEntry) {
            var label = _i18n("menuFirstNone");
            label = label.replace('{LABEL}', translations[0].label);
            firstEntry.label = label;
        }
    }
};