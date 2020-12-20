const textareaDOMID = "preferences";
const regexCard = /(\d+) (([\-\',0-9a-zÀ-ÿ]+ ?)+) (\(\w+\)) (\d+)/ig;

document.querySelector("form")?.addEventListener("submit", savePreferences);

// savePreferences extracts and saves MTG cards from the preference textarea.
function savePreferences(e: { preventDefault: () => void; }): void {
    e.preventDefault();
    let textarea: HTMLElement | null = document.getElementById(textareaDOMID);
    if (!textarea) {
        return
    }

    let cards: [string, string][] = extractCards(textarea.value.trim());
    textarea.value = "";
    if (Object.entries(cards).length <= 0) {
        return
    } 
 
    let prefs: { [key: string]: string } = {};
    cards.forEach(card => {
        prefs[card[0]] = card[1];
    });

    browser.storage.local.set(prefs)
        .catch((err: any) => { console.error(err) });
    return;
}

// extractCards finds every card in the given text. The cards are returned as
// tuples of strings corresponding to a card's name and full entry respectively. 
function extractCards(text: string): [string, string][] {
    let cards: [string, string][] = [];
    let matches: RegExpExecArray | null;

    while ((matches = regexCard.exec(text)) !== null) {
        let name: string = matches[2];
        let id: string = `${matches[4]} ${matches[5]}`;
        cards.push([name, `${name} ${id}`]);
    }

    return cards;
}