const textareaDOMID = "preferences";
const regexFullCard = /(\d+) (([\-\',0-9a-zÀ-ÿ]+ ?)+) ((\(\w+\)) (\d+))/ig;

document.querySelector("form")?.addEventListener("submit", savePreferences);

// Card contains identifying information on a Magic: The Gathering Arena playing card.
interface Card {
    name: string;
    id?: string;
}

// savePreferences extracts and saves MTG cards from the preference textarea.
function savePreferences(e: { preventDefault: () => void; }): void {
    e.preventDefault();
    let textarea = document.getElementById(textareaDOMID) as HTMLTextAreaElement;
    if (!textarea) {
        return
    }
 
    const cards = extractFullCards(textarea.value.trim());
    textarea.value = "";
    if (Object.entries(cards).length <= 0) {
        return
    }

    let prefs: { [key: string]: Card } = {};
    cards.forEach(card => {
        prefs[card.name] = card;
    });

    browser.storage.local.set(prefs as unknown as browser.storage.StorageObject)
        .catch((err: any) => { console.error(err) });
    return;
}

// extractFullCards finds every card (including set ID) in the given text. 
function extractFullCards(text: string): Card[] {
    let cards: Card[] = [];
    let matches: RegExpExecArray | null;

    while ((matches = regexFullCard.exec(text)) !== null) {
        cards.push({
            name: matches[2],
            id: matches[4],
        });
    }

    return cards; 
}