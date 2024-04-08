import {Route, Routes, Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect,  useRef, useState } from 'react'
import { Word, isWords, addWord, lastWordId, shuffleWords, wordById, deleteWordById, editWord } from '../../modules/words'
import './main_page.scss'
import { requestTranslateInNative } from '../../modules/requests'

import chR from '../../assets/images/chevron-right.svg'
import chL from '../../assets/images/chevron-left.svg'
import sadFace from '../../assets/images/not-happy-face.svg'
import notebook from '../../assets/images/notebook.svg'
import star from '../../assets/images/star.svg'
import sadMask from '../../assets/images/sad-mask.svg'
import happyMask from '../../assets/images/happy-mask.svg'
import deleteImg from '../../assets/images/delete.svg'
import editImg from '../../assets/images/edit.svg'
import readyImg from '../../assets/images/ready.svg'



import { getAllUserData, getAttemptsQuantity, getForgottenQuantity, getRememberedQuantity, getWordsCuantity, isRegistered, setUserData, User } from '../../modules/user'
import { removeLocalStorageItem } from '../../modules/storage'


export default function HomePage () {
    const [userData] = useState(getAllUserData())
    const redirect = useNavigate()
    useEffect(
        () => {
            if (!isRegistered()){
                return redirect('/')
            }
        }
    )

    return (
        <div className="container-welcome-page">
            <nav className="nav">
                    <div className="position">
                        <div className="values"> 
                            <div className="value">
                                <img src={notebook} alt="words" title='your words' />
                                <h4>{userData.wordsQuantity}</h4>
                            </div>
                            <div className="value">
                                <img src={star} alt="attempts" title='your attempts' />
                                <h4>{userData.attemptsQuantity}</h4>
                            </div>
                            <div className="value">
                                <img src={sadMask} alt="attempts" title='your frogotten words' />
                                <h4>{userData.forgottenQuantity}</h4>
                            </div>
                            <div className="value">
                                <img src={happyMask} alt="attempts" title='your remembered words' />
                                <h4>{userData.rememberedQuantity}</h4>
                            </div>
                        </div>
                    </div>

                    <ul>
                        <Link to='/home'> <li> <h4>home</h4> </li></Link>
                        <Link to='/home/words'><li> <h4>words</h4> </li></Link>
                    </ul>
            </nav>
            <div className="info-grid">
                <Routes>
                    <Route path='/' element={<MainInfo userData={userData} />}/>
                    <Route path='/words' element={<Words userData={userData} />}/>
                    <Route path='/words/word/:id' element={<WordPage userData={userData}/>} />
                </Routes>
            </div>
        </div>
    )
}

function WordPage({ userData } : {userData: User}) {
    const [isEdit, changeIsEdit] = useState(false)

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const wordId = id ? parseInt(id, 10) : -999
    const word = wordById(wordId)

    const [newNative, setNewNative] = useState(word.native)
    const [newForeign, setNewForeign] = useState(word.foreign)
    const handleNativeChange = (event: any) => {setNewNative( event.target.value )}
    const handleForeignChange = (event: any) => {setNewForeign( event.target.value )}
  
    if (wordId === undefined || !word || word?.id === -999) {
      navigate('/home/words')
      return null
    }

    
    const deleteAllData = () => {
        removeLocalStorageItem('USER')
        removeLocalStorageItem('WORDS')
        removeLocalStorageItem('NATIVE')
        removeLocalStorageItem('FOREIGN')
    }

    const deleteWord = (id: number) => {
        deleteWordById(id)
        navigate('/home/words')
        window.location.reload()
    }

    const editInput = () => {
        changeIsEdit(!isEdit)
        const tmpIsEdit = !isEdit
        if (tmpIsEdit === false) {
            editWord(word.id, newNative, newForeign)
            window.location.reload()
        }
    }

    return (
        <div className='main-info'>
            <div className="word-info-container">
                <div className="word-foreign-native">
                    <input className='word-info-foreign' value={newForeign} 
                    disabled={!isEdit} onChange={ handleForeignChange }/>
                    <input className='word-info-native' value={newNative} 
                    disabled={!isEdit} onChange={ handleNativeChange }/>
                </div>
                <div className="word-action">
                    <button id='remove-word'
                    onClick={ () => { deleteWord(word.id) } } 
                    ><img src={deleteImg} alt="delete word"/></button>
                    <button id='edit-word'
                    onClick={editInput}
                    ><img src={isEdit ? readyImg : editImg} alt="edit word"/></button>
                </div>
            </div>
            <WordsList userData={userData}/>
            <div className="add-settings">
                <button onClick={deleteAllData}>Delete all data</button>
            </div>
        </div>
        
    )
}

function WordsList ({ userData } : {userData: User}) {
    let userWords
    if (userData.words.length) {
        userWords = userData.words.map(
            (word, index) => {
                const even = index % 2 === 0
                return (<div key={word.id} className={`words-page-word ${even ? 'even' : 'odd'} animate__animated animate__fadeIn`}>
                        <a href={`/home/words/word/${word.id}`}>
                            <h5>{word.foreign}</h5>
                            <h5>{word.native}</h5>
                        </a>
                    </div>)
            }
        )
    } else {
        userWords = (
            <div className='words-list-no-words'> <h3>here is no words :(</h3> </div>
        ) 
    }
    
    return (
        <div className="words-area-wrap">
                <div className="words-area">
                    {userWords}
                </div>
        </div>
    )
}

function Words({ userData } : {userData: User}) {

    
    const [nativeWord, setNativeWord] = useState('')
    const [foreignWord, setForeignWord] = useState('')

    const [nativeToTranslate, setNativeToTranslate] = useState ('')
    const [translationResponse, setTranslationResponse] = useState ('')

    function handleForeignChange (event: any) { setForeignWord(event.target.value) }
    function handleNativeTranslateChange (event: any) { setNativeToTranslate(event.target.value) }

    function handleNativeChange (event: any) { 
        setNativeWord(event.target.value) 
        setNativeToTranslate(event.target.value) 
    }


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

    function changeTranslateVis() {

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
                    <input type="text" placeholder='native word' value={nativeToTranslate} onChange={handleNativeTranslateChange}/>
                    <output>{translationResponse}</output>
                    <button className='add-text-btn'
                        onClick={ getTranslation }> get translation</button>
                </div>
                <button className="show-trns-menu-btn" onClick={changeTranslateVis}><img src={chL}/></button>

            </div>
            <WordsList userData={userData}/>
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
            pointer.current = 0
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
