import { getLocalStorageItem, setLocalStorageItem } from "./storage";
import { getLanguages, getWords } from "./words";
 
export interface User{
    words: number
    attempts: number
    forgotten: number
    remembered: number
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
        return {
            words: getWordsCuantity(),
            attempts: 0,
            forgotten: 0,
            remembered: 0
        }
    }
    return user
}

export function setUserData(par: keyof User, val: number): void {
    const userData = getAllUserData()
    userData[par] = val
    setLocalStorageItem('USER', userData)
}

export function getWordsCuantity(): number {
    const words = getWords()
    return words.length
}

export function getAttemptsCuantity(): number {
    return getAllUserData().attempts
}

export function getForgottenCuantity(): number {
    return getAllUserData().forgotten
}

export function getRememberedCuantity(): number {
    return getAllUserData().remembered
}