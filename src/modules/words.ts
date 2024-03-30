import { getLocalStorageItem, setLocalStorageItem } from './storage'

export type Word = {
    native: string
    foreign: string
    id: number;
}

export function getLanguages(): string[] | null[] {
    const native = getLocalStorageItem('NATIVE')
    const foreign = getLocalStorageItem('FOREIGN')
    if (native && foreign) {
        return [native, foreign]
    }
    return [null, null]
}

export function getWords(): Word[] {
    let words = getLocalStorageItem('WORDS')
    if (words === null) {
        return []
    } return words
}

export function setWords( words: Word[] ): void {
    setLocalStorageItem('WORDS', words)
}

export function isWords (): boolean {
    if (getWords().length === 0) {
        return false
    } return true
}

export function addWord(word: Word): void {
    let words = getWords()
    words.push(word)
    setWords(words)
}

export function lastWordId(): number {
    const words = getWords()
    if (words.length === 0) {
        return 0
    } else {
        return words[words.length-1].id
    }
}

export function shuffleWords (words: Word[]): Word[]{
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled
}