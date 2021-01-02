"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var regexCard = /(\d+) (([\-\',0-9a-zÀ-ÿ]+ ?)+)((\(\w+\)) (\d+))?/ig;
browser.browserAction.onClicked.addListener(replaceClipboard);
// replaceClipboard replaces every card with a corresponding preference stored
// in the browser's local storage.
function replaceClipboard() {
    return __awaiter(this, void 0, void 0, function () {
        var text, clip, cards, names, result, prefs, fullcards_1, clip2_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, navigator.clipboard.readText()];
                case 1:
                    text = _a.sent();
                    clip = text.trim();
                    cards = extractCards(clip);
                    names = cards.map(function (card) { return card.name; });
                    return [4 /*yield*/, browser.storage.local.get(names)];
                case 2:
                    result = _a.sent();
                    prefs = new Map(Object.entries(result));
                    fullcards_1 = cards.reduce(function (map, card) { return card.id ? map.set(card.name, card) : map; }, new Map());
                    clip2_1 = clip;
                    prefs.forEach(function (pref) {
                        if (fullcards_1.has(pref.name)) {
                            var full = fullcards_1.get(pref.name);
                            clip2_1 = clip2_1.replace(cardToString(full), cardToString(pref));
                        }
                        else {
                            clip2_1 = clip2_1.replace(pref.name, cardToString(pref));
                        }
                    });
                    return [4 /*yield*/, navigator.clipboard.writeText(clip2_1)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function cardToString(card) {
    var str = card.name;
    if (card.id) {
        str += " " + card.id;
    }
    return str;
}
// extractCards finds every card in the given text.
function extractCards(text) {
    var cards = [];
    var matches;
    while ((matches = regexCard.exec(text)) !== null) {
        var name_1 = matches[2].trim();
        var id = matches[4];
        if (id) { // card id
            cards.push({
                name: name_1,
                id: id.trim()
            });
        }
        else {
            cards.push({
                name: name_1
            });
        }
    }
    return cards;
}
