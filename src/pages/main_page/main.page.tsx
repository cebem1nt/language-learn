import {Route, Routes, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Word, isWords, addWord, lastWordId, shuffleWords } from '../../modules/words'
import './main_page.scss'
import { requestTranslateInNative } from '../../modules/requests'

import chR from '../../assets/images/chevron-right.svg'
import chL from '../../assets/images/chevron-left.svg'
import sadFace from '../../assets/images/not-happy-face.svg'
import notebook from '../../assets/images/notebook.svg'
import star from '../../assets/images/star.svg'
import sadMask from '../../assets/images/sad-mask.svg'
import happyMask from '../../assets/images/happy-mask.svg'


import { getAllUserData, getAttemptsQuantity, getForgottenQuantity, getRememberedQuantity, getWordsCuantity, isRegistered, setUserData, User } from '../../modules/user'


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
                            <div className="value">
                                <img src={notebook} alt="words" title='your words' />
                                <h2>{userData.wordsQuantity}</h2>
                            </div>
                            <div className="value">
                                <img src={star} alt="attempts" title='your attempts' />
                                <h2>{userData.attemptsQuantity}</h2>
                            </div>
                            <div className="value">
                                <img src={sadMask} alt="attempts" title='your frogotten words' />
                                <h2>{userData.forgottenQuantity}</h2>
                            </div>
                            <div className="value">
                                <img src={happyMask} alt="attempts" title='your remembered words' />
                                <h2>{userData.rememberedQuantity}</h2>
                            </div>
                        </div>
                    </div>

                    <ul>
                        <Link to='/home'> <li> <h2>home</h2> </li></Link>
                        <Link to='/home/words'><li> <h2>words</h2> </li></Link>
                    </ul>
            </nav>
            <div className="info-grid">
                <Routes>
                    <Route path='/' element={<MainInfo userData={userData} />}/>
                    <Route path='/words' element={<Words userData={userData} />}/>
                </Routes>
            </div>
        </div>
    )
}

function Words({ userData } : {userData: User}) {
    const [nativeWord, setNativeWord] = useState('')
    const [foreignWord, setForeignWord] = useState('')
    const [nativeToTranslate, setNativeToTranslate] = useState ('')
    const [translationResponse, setTranslationResponse] = useState ('')

    const userWords = userData.words.map(
        (word) => {
            const even = word.id % 2 == 0
            return <div key={word.id} className={`words-page-word ${even ? 'even' : 'odd'}`}> 
                <h5>{word.foreign}</h5>
                <h5>{word.native}</h5>
             </div>
        }
    )

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
        <div className="main-info">
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
            <div className="words-area-wrap">
                <div className="words-area">
                    {userWords}
                </div>
            </div>
        </div>
    )
}

function MainInfo( { userData } : {userData: User} ) {
    let pointer = useRef(0)

    const [isNativeHidden, setIsNativeHidden] = useState(true)
    
    const [shuffledWords, setShuffledWords] = useState(shuffleWords(userData.words))
    const [word, setWord] = useState(shuffledWords[0])
    const [isProcessing, setIsProcessing] = useState(false)

    const showTranslation = () => { 
        setIsNativeHidden(!isNativeHidden)
    } 

    const forgottenWord = () => {
        setUserData('forgottenQuantity', getForgottenQuantity() + 1)
        showTranslation()
        nextWord(true)
    }

    const hideRandomTranslation = () => {
        const randInt = Math.floor(Math.random() * (6 - 0 + 1)) + 0
        if (randInt > 4) {
            setIsNativeHidden(false)
        } else {
            setIsNativeHidden(true)
        }
    }

    const nextWord = (isForgotten=false) => {
        setUserData('attemptsQuantity', getAttemptsQuantity() + 1)
        setIsProcessing(true)
        showTranslation()
        
        if (!isForgotten) {
            setUserData('rememberedQuantity', getRememberedQuantity() + 1)
        }

        if (pointer.current < userData.words.length-1) {
            pointer.current = pointer.current + 1
        } else {
            pointer.current = 0
            setShuffledWords(shuffleWords(userData.words))
        }

        setTimeout(() => {
            setWord(shuffledWords[pointer.current])
            hideRandomTranslation()
            setIsProcessing(false)
        }, 2000)
      
        
    }

    const previousWord = () => {
        showTranslation()
        if (pointer.current > 0) {
            pointer.current = pointer.current - 1 
        } else {
            pointer.current = pointer.current
        }
        setWord(shuffledWords[pointer.current])
    }

    if (isWords()) {
        return (
            <div className="main-info">
                <div className="start-learning">

                    <div className="learning-container">
                        <button className='prev-word' onClick={previousWord} disabled={pointer.current === 0 || isProcessing}>
                            <img src={chL} alt="next" />
                        </button>
                            <div className={ `card animate__animated ${isProcessing ? 'animate__flipInY' : 'animate__fadeIn'}`}>
                                {   !isNativeHidden &&
                                    <>
                                        <div className='word-div'>
                                            <h3 className='card-text'> {word.native} </h3>
                                        </div>
                                        <h3 className='lang-info'> {userData.native} </h3>
                                    </>
                                }
                                {
                                    isNativeHidden && 
                                    <>
                                        <div className='word-div'>
                                            <h3 className='card-text'> {word.foreign}</h3>
                                        </div>
                                        <h3 className='lang-info'> {userData.foreign} </h3>
                                    </>
                                }
                            </div>
                        <button className='next-word' onClick={()=> {nextWord()}} disabled={isProcessing}>
                            <img src={chR} alt="next" />
                        </button>
                    </div>
                    <div className="card-controls">
                        <button className='show-trns' onClick={ forgottenWord }>i forgot</button>
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
