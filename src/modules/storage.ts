// Code style : set keys in uppercase

export const setLocalStorageItem = (key :string, value :any): void => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorageItem = (key: string): any => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
}

export const removeLocalStorageItem = (key: string): void => {
    localStorage.removeItem(key)
}