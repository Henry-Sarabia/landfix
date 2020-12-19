"use strict";
var _a;
var textareaID = "preferences";
var regexCard = /(\d+) (([\-\',0-9a-zÀ-ÿ]+ ?)+) (\(\w+\)) (\d+)/ig;
(_a = document.querySelector("form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", savePreferences);
// savePreferences extracts and saves MTG cards from the preference textarea.
function savePreferences(e) {
    e.preventDefault();
    var textarea = document.getElementById(textareaID);
    if (!textarea) {
        return;
    }
    var cards = extractCards(textarea.value.trim());
    textarea.value = "";
    if (Object.entries(cards).length <= 0) {
        return;
    }
    var prefs = {};
    cards.forEach(function (card) {
        prefs[card[0]] = card[1];
    });
    browser.storage.local.set(prefs)["catch"](function (err) { console.error(err); });
    return;
}
// extractCards finds every card in the given text. The cards are returned as
// tuples of strings corresponding to a card's name and full entry respectively. 
function extractCards(text) {
    var cards = [];
    var matches;
    while ((matches = regexCard.exec(text)) !== null) {
        var name_1 = matches[2];
        var id = matches[4] + " " + matches[5];
        cards.push([name_1, name_1 + " " + id]);
    }
    return cards;
}
