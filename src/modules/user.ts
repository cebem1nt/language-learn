import { getLocalStorageItem, setLocalStorageItem } from "./storage";
import { getLanguages, getWords, Word } from "./words";
 
export interface User{
    wordsQuantity: number
    attemptsQuantity: number
    forgottenQuantity: number
    rememberedQuantity: number
    words: Word[]
    native: string | null
    foreign: string | null
}

export function isRegistered(): boolean{
    const languages = getLanguages()
    if (languages){
        return true
    }
    return false
}

export function getAllUserData(): User {
    const user = getLocalStorageItem('USER')
    if (!user) {
        const languagePair = getLanguages()
        return {
            wordsQuantity: getWordsCuantity(),
            attemptsQuantity: 0,
            forgottenQuantity: 0,
            rememberedQuantity: 0,
            words: getWords(),
            native: languagePair[0],
            foreign: languagePair[1]
        }
    }
    return user
}

export function setUserData <K extends keyof User> (key: K, val: User[K]): void {
    const userData = getAllUserData()
    userData[key] = val
    setLocalStorageItem('USER', userData)
}

export function getWordsCuantity(): number {
    const words = getWords()
    return words.length
}

export function getAttemptsQuantity(): number {
    return getAllUserData().attemptsQuantity
}

export function getForgottenQuantity(): number {
    return getAllUserData().forgottenQuantity
}

export function getRememberedQuantity(): number {
    return getAllUserData().rememberedQuantity
}