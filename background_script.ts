const regexCard = /(\d+) (([\-\',0-9a-zÀ-ÿ]+ ?)+)((\(\w+\)) (\d+))?/ig;

browser.browserAction.onClicked.addListener(replaceClipboard);

// Card contains identifying information on a Magic: The Gathering playing card.
interface Card {
    name: string;
    id?: string;
}

// replaceClipboard replaces every card with a corresponding preference stored
// in the browser's local storage.
async function replaceClipboard(): Promise<void> {
    try {
        const text = await navigator.clipboard.readText();
        const clip = text.trim();

        let cards = extractCards(clip);
        const names = cards.map(card => card.name);
 
        const result = await browser.storage.local.get(names) as unknown as { [key: string]: Card };
        const prefs = new Map(Object.entries(result));

        const fullcards = cards.reduce((map, card) => card.id ? map.set(card.name, card) : map, new Map() as Map<string, Card>);
        let clip2 = clip;

        prefs.forEach(pref => {
            if (fullcards.has(pref.name)) {
                const full = fullcards.get(pref.name)!;
                clip2 = clip2.replace(cardToString(full), cardToString(pref));
            } else {
                clip2 = clip2.replace(pref.name, cardToString(pref));
            }
        })
        await navigator.clipboard.writeText(clip2);
    } catch (err) {
        console.error(err); 
    }
    return;
}

function cardToString(card: Card): string {
    let str = card.name;
    if (card.id) {
        str += " " + card.id;
    }
    return str;
}

// extractCards finds every card in the given text.
function extractCards(text: string): Card[] {
    let cards: Card[] = [];
    let matches: RegExpExecArray | null;

    while ((matches = regexCard.exec(text)) !== null) {
        const name = matches[2].trim();
        const id = matches[4];
        if (id) { // card id
            cards.push({
                name: name,
                id: id.trim(),
            })
        } else {
            cards.push({
                name: name,
            })
        }
    }

    return cards;
}