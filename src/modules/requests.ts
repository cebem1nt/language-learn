import { getLanguages } from "./words"

export async function requestTranslateInNative(native: string ): Promise<string> {
    const langs = getLanguages()
    if (langs){
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${native}&langpair=${langs[0]}|${langs[1]}`)
        if (!response.ok) {
            return 'Failed to fetch translation'
        }
    
        const data = await response.json();
        return data.responseData.translatedText
    }
    throw new Error('no saved languages')
  }