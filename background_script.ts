const regexBaseCard = /(\d+) (([\-\',0-9a-zÀ-ÿ]+ ?)+)/ig;

browser.browserAction.onClicked.addListener(replaceClipboard);

// Card contains identifying information on a Magic: The Gathering playing card.
interface Card {
    quantity: number;
    name: string;
    set?: string;
    id?: number;
}

// replaceClipboard replaces every card with a corresponding preference stored
// in the browser's local storage.
async function replaceClipboard(): Promise<void> {
    try {
        let clipboard: string = await navigator.clipboard.readText();
        let cards: string[] = extractBaseCards(clipboard.trim());

        let cardObj: { [key: string]: string } = {};
        cards.forEach(card => {
            cardObj[card] = card;
        });

        let prefs: { [key: string]: string } = await browser.storage.local.get(cardObj);
 
        let keys = Object.keys(prefs);
        let vals = Object.values(prefs);

        for (let i = 0; i < vals.length; i++) {
            clipboard = clipboard.replace(keys[i], vals[i]);
        }

        navigator.clipboard.writeText(clipboard);
    } catch (err) {
        console.error(err);
    }
    return;
}


// extractBaseCards finds every card in the given text. The cards are returned as
// an array of strings. 
function extractBaseCards(text: string): string[] {
    let cards: string[] = [];
    let matches: RegExpExecArray | null;

    while ((matches = regexBaseCard.exec(text)) !== null) {
        cards.push(matches[2]);
    }

    return cards;
}