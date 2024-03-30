import {Route, Routes, Link, useNavigate } from 'react-router-dom'
import { getLocalStorageItem, removeLocalStorageItem } from '../../modules/storage'
import { useEffect, useState } from 'react'
import { Word, isWords, addWord, lastWordId, getWords, shuffleWords } from '../../modules/words'
import sadFace from '../../assets/images/not-happy-face.svg'
import './main_page.scss'
import { requestTranslateInNative } from '../../modules/requests'
import chR from '../../assets/images/chevron-right.svg'
import chL from '../../assets/images/chevron-left.svg'

import notebook from '../../assets/images/notebook.svg'
import { getAllUserData, getAttemptsCuantity, getForgottenCuantity, getRememberedCuantity, getWordsCuantity, isRegistered, setUserData, User } from '../../modules/user'


export default function HomePage () {
    const navigate = useNavigate()
    useEffect(() => {
        if (isRegistered()){
            return navigate("/home")
        }
    }, [isRegistered])

    const [userData] = useState(getAllUserData())

    return (
        <div className="container-welcome-page">
            <nav className="nav">
                    <div className="position">
                        <div className="values"> 
                            <img src={notebook} alt="attempts" title='number of times you learned a word' />
                            <h2>{userData.attemptsQuantity}</h2>
                        </div>
                    </div>

                    <ul>
                        <Link to='/home'> <li> <h2>home</h2> </li></Link>
                        <Link to='/home/words'><li> <h2>words</h2> </li></Link>
                    </ul>
            </nav>
            <div className="info-grid">
                <Routes>
                    <Route path='/' element={<Home userData={userData}/>}/>
                    <Route path='/words' element={<Words />}/>
                </Routes>
            </div>
        </div>
    )
}

function Home ({ userData } : {userData: User}) {
    return (
        <>
            <div className="add-info">
                <div className="stats">
                    <h5>words: {userData.wordsQuantity}</h5>
                    <h5>attempts: {userData.attemptsQuantity}</h5>
                    <h5>forgotten: {userData.forgottenQuantity}</h5>
                    <h5>correct: {userData.rememberedQuantity}</h5>
                </div>
            </div>
            <MainInfo userData={userData}/>
        </>
    )
}

function Words() {
    const [nativeWord, setNativeWord] = useState('')
    const [foreignWord, setForeignWord] = useState('')
    const [nativeToTranslate, setNativeToTranslate] = useState ('')
    const [translationResponse, setTranslationResponse] = useState ('')

    const handleNativeChange = (event: any) => { setNativeWord(event.target.value) }
    const handleForeignChange = (event: any) => { setForeignWord(event.target.value) }
    const handleNativeTranslateChange = (event: any) => { setNativeToTranslate(event.target.value) }

    const formWordAndAddIt = (n: string, f: string): void => {
        const word : Word = {
            native: n,
            foreign: f,
            id: lastWordId() + 1
        }
        addWord(word)
        setUserData('wordsQuantity', getWordsCuantity())
        window.location.reload()
    }

    const getTranslation = async () => {
        if (nativeToTranslate.length > 0) {
            setTranslationResponse('translating...')
            const response = await requestTranslateInNative(nativeToTranslate)
            setTranslationResponse(response)
        } return
    }

    return (
        <>
            <WordsList />
            <div className="main-info">
                <div className="header"> <h2>Your words</h2> </div>
                <hr />
                <div className="set-words-wrap">
                    <div className="set-words">
                        <h3 className='in-h3'>Add word</h3>
                        <input type="text" placeholder='in native language' onChange={handleNativeChange}/>
                        <input type="text" placeholder='in foreign language' onChange={handleForeignChange}/>
                        <button className='add-text-btn'
                            onClick={ () => { formWordAndAddIt(nativeWord, foreignWord) } }>add word</button>
                    </div>

                    <div className="get-translation">
                        <h3 className='in-h3'>Get translation</h3>
                        <input type="text" placeholder='native word' onChange={handleNativeTranslateChange}/>
                        <output>{translationResponse}</output>
                        <button className='add-text-btn'
                            onClick={ getTranslation }>get translation</button>
                    </div>
                </div>
            </div>
        </>
    )
}


function WordsList() {
    if (!isWords()) {
        return (
            <div className="add-info">
                <div>You dont have any words yet</div>
            </div>
        )
    } else {
        const w = getWords()
        const words = w.map( (word) => {
            return (
             <div key={word.id} className='word'>
                 <h5 className='word-foreign'>{word.foreign}</h5>
                 <h5 className='word-native'>{word.native}</h5>
             </div>
            )
         })

        return (
            <div className="add-info">
                <div className="words-list">
                    <div className='words'>
                        {words}
                    </div>
                </div>
            </div>
        )
    }
}

function MainInfo( { userData } : {userData: User} ) {
    const [nativeHidden, setNativeHidden] = useState(true)
    const [pointer, updatePointer] = useState(0)
    const [shuffledWords, setShuffledWords] = useState(shuffleWords(userData.words))
    const [word, setWord] = useState(shuffledWords[0])
    const [isProcessing, setIsProcessing] = useState(false)

    const showTranslation = () => { 
        setNativeHidden(!nativeHidden)
    } 

    const hideRandomTranslation = () => {
        const randInt = Math.floor(Math.random() * (6 - 0 + 1)) + 0
        if (randInt > 4) {
            setNativeHidden(false)
        } else {
            setNativeHidden(true)
        }
    }

    const nextWord = () => {
        
        setIsProcessing(true)
        let i: number
        if (pointer < userData.words.length-1) {
            updatePointer(pointer + 1)
            i = pointer + 1
        } else {
            updatePointer(0)
            setShuffledWords(shuffleWords(userData.words))
            i = 0
        }

        showTranslation()
        setTimeout(() => {
            setWord(shuffledWords[i])
            hideRandomTranslation()
            setIsProcessing(false)
        }, 1000)
      
        
    }

    const previousWord = () => {
        let i: number
        showTranslation()
        if (pointer > 0) {
            updatePointer(pointer - 1)
            i = pointer - 1
        } else {
            i = pointer
        }
        setWord(shuffledWords[i])
    }

    if (isWords()) {
        return (
            <div className="main-info">
                <div className="start-learning">
                    <div className="header">
                        <h2>Lets learn</h2>
                    </div>
                    <hr />
                    <div className="learning-container">
                        <button className='prev-word' onClick={previousWord} disabled={pointer === 0 || isProcessing}>
                            <img src={chL} alt="next" />
                        </button>
                            <div className="card">
                                {   !nativeHidden &&
                                    <div className='word-div'>
                                        <h3 className='native-card'> {word.native} </h3>
                                    </div>
                                }
                                {
                                    nativeHidden && 
                                    <div className='word-div'>
                                        <h3 className='foreign-card'> {word.foreign}</h3>
                                    </div>
                                }
                            </div>
                        <button className='next-word' onClick={nextWord} disabled={isProcessing}>
                            <img src={chR} alt="next" />
                        </button>
                    </div>
                    <div className="card-controls">
                        <button className='show-trns' onClick={ showTranslation }>i forgot</button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="main-info">
                <div className="no-words-wrap">
                    <div className="no-words">
                        <div className="no-words-img">
                            <img src={sadFace} alt="Add some words" />
                        </div>
                        <div className="text">
                            <h3>You don't have any words</h3>
                            <Link to="words">
                                <button className='text-btn'>add words</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
