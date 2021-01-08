const regexCard = /(\d+) (([\-\',0-9a-zÀ-ÿ]+ ?)+)((\(\w+\)) (\d+))?/ig;

browser.browserAction.onClicked.addListener(replaceClipboard);

// Card contains identifying information on a Magic: The Gathering Arena playing card.
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

        const populated = cards.reduce((map, card) => card.id ? map.set(card.name, card) : map, new Map() as Map<string, Card>);
        let newclip = clip;

        prefs.forEach(pref => {
            if (populated.has(pref.name)) {
                const pop = populated.get(pref.name)!;
                newclip = newclip.replace(cardToString(pop), cardToString(pref));
            } else {
                newclip = newclip.replace(pref.name, cardToString(pref));
            }
        })
        await navigator.clipboard.writeText(newclip);
    } catch (err) {
        console.error(err); 
    }
    return;
}

// cardToString returns the provided Card as a string in MTGA format.
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

        if (id) {
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