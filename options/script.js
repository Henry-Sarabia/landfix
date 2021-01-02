"use strict";
var _a;
var textareaDOMID = "preferences";
var regexFullCard = /(\d+) (([\-\',0-9a-zÀ-ÿ]+ ?)+) ((\(\w+\)) (\d+))/ig;
(_a = document.querySelector("form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", savePreferences);
// savePreferences extracts and saves MTG cards from the preference textarea.
function savePreferences(e) {
    e.preventDefault();
    var textarea = document.getElementById(textareaDOMID);
    if (!textarea) {
        return;
    }
    var cards = extractFullCards(textarea.value.trim());
    textarea.value = "";
    if (Object.entries(cards).length <= 0) {
        return;
    }
    var prefs = {};
    cards.forEach(function (card) {
        prefs[card.name] = card;
    });
    browser.storage.local.set(prefs)["catch"](function (err) { console.error(err); });
    return;
}
// extractFullCards finds every card (including set ID) in the given text. 
function extractFullCards(text) {
    var cards = [];
    var matches;
    while ((matches = regexFullCard.exec(text)) !== null) {
        cards.push({
            name: matches[2],
            id: matches[4]
        });
    }
    return cards;
}
