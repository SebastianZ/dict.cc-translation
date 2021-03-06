/* ***** BEGIN LICENSE BLOCK *****
 
 * Author: Santo Pfingsten (Lusito)
 
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

var XMLHttpRequest = require("sdk/net/xhr").XMLHttpRequest;
var browserWindows = require("sdk/windows").browserWindows;
var privateBrowsing = require("sdk/private-browsing");

exports.requestHTML = function (url, onSuccess, onError) {
    var cfg = {};
    if(privateBrowsing.isPrivate(browserWindows.activeWindow))
        cfg.mozAnon = true;
    var xhr = new XMLHttpRequest(cfg);
    xhr.onload = function () {
        onSuccess(this.responseXML);
    };
    xhr.onerror = onError;
    xhr.open("GET", url);
    xhr.responseType = "document";
    xhr.send();
};
