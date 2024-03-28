import {Route, Routes, Link, useNavigate } from 'react-router-dom'
import { getLocalStorageItem } from '../../modules/storage'
import { useEffect, useState } from 'react'
import { Word, isWords, addWord, lastWordId, getWords, yieldWord } from '../../modules/words'
import sadFace from '../../assets/images/not-happy-face.svg'
import './main_page.scss'
import { requestTranslateInNative } from '../../modules/requests'
import chR from '../../assets/images/chevron-right.svg'
import notebook from '../../assets/images/notebook.svg'
import { getAllUserData, getAttemptsCuantity, getForgottenCuantity, getRememberedCuantity, getWordsCuantity, isRegistered, setUserData } from '../../modules/user'


export default function HomePage () {
    const [userData, userDataSetter] = useState(getAllUserData())
    let navigate = useNavigate();

    useEffect(() => {
    if (isRegistered()){
        return navigate("/home");
    }
    },[isRegistered]);

    return (
        <div className="container-welcome-page">
            <nav className="nav">
                    <div className="position">
                        <div className="values"> 
                            <img src={notebook} alt="attempts" title='number of times you learned a word' />
                            <h2>{userData.attempts}</h2>
                        </div>
                    </div>

                    <ul>
                        <Link to='/home'> <li> <h2>home</h2> </li></Link>
                        <Link to='/home/words'><li> <h2>words</h2> </li></Link>
                    </ul>
            </nav>
            <div className="info-grid">
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/words' element={<Words />}/>
                </Routes>
            </div>
        </div>
    )
}

function Home () {
    const user = getAllUserData()
    return (
        <>
            <div className="add-info">
                <div className="stats">
                    <h5>words: {user.words}</h5>
                    <h5>attempts: {user.attempts}</h5>
                    <h5>forgotten: {user.forgotten}</h5>
                    <h5>correct: {user.remembered}</h5>
                </div>
            </div>
            <MainInfo />
        </>
    )
}

function Words() {
    const [nativeWord, setNativeWord] = useState('')
    const [foreignWord, setForeignWord] = useState('')
    const [nativeToTranslate, setNativeToTranslate] = useState ('')
    const [translationResponse, setTranslationResponse] = useState ('')

    const handleNativeChange = (event: any) => {
        setNativeWord(event.target.value)
    }

    const handleForeignChange = (event: any) => {
        setForeignWord(event.target.value)
    }

    const handleNativeTranslateChange = (event: any) => {
        setNativeToTranslate(event.target.value)
    }

    const formWordAndAddIt = (n: string, f: string): void => {
        const word : Word = {
            native: n,
            foreign: f,
            id: lastWordId() + 1
        }
        addWord(word)
        setUserData('words', getWordsCuantity())
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

function MainInfo() {
        const [word, setWord]: any = useState(null)
        const [generator, setGenerator]: any = useState(null)
        const [isRunning, setIsRunning] = useState(false)
        const [isProcessing, setIsProcessing] = useState(false)
        const [isForgotten, setIsForgotten] = useState(false)
        const [currentHidden, setCurrentHiden] = useState('f')  // f - foreign , n - native, e - no one

        const hideWord = () => {
            const x = Math.floor(Math.random() * 5);
            if (x < 3) {
                setCurrentHiden('n')
                return
            }
            setCurrentHiden('f')
            return
        }

        const show = () => {
            setCurrentHiden('e')
            setUserData('forgotten', getForgottenCuantity() + 1)
            setUserData('attempts',  getAttemptsCuantity() + 1)
            setIsForgotten(true)
        }

        const start = () => {
            const words = getLocalStorageItem('WORDS')
            const newGenerator = yieldWord(words)
            setGenerator(newGenerator)
            setWord(newGenerator.next().value)
            hideWord()
            setIsRunning(true)
        }
        
        const next = () => {
            if (!generator) return

            if (!isForgotten) {
                setUserData('remembered',  getRememberedCuantity() + 1)
                setUserData('attempts', getAttemptsCuantity() + 1)
                setCurrentHiden('e')
            }
            setIsProcessing(true)

            setTimeout(() => {
                hideWord()
                const nextWord = generator.next()
                setWord(nextWord.value)
                setIsProcessing(false)
                if (nextWord.done) {
                    setIsRunning(false)
                    setIsForgotten(false)
                    return
                }
            }, 1000)
        }
        

    if (isWords()) {
        return (
            <div className="main-info">
                <div className="start-learning">
                    <div className="header">
                        <h2>Lets learn</h2>
                    </div>
                    <hr />
                    {
                        isRunning && <div className="learning-container">
                        <div className="card">
                            <div style={{background: '#5483B3'}} className='word-div'>
                                <h3 className='native-card' style={{
                                    opacity: currentHidden === 'n' ? '0' : '100',
                                }}>{word.native}</h3></div>
                            <div style={{background: '#5483B3'}} className='word-div'>
                                <h3 className='foreign-card' style={{
                                    opacity: currentHidden === 'f' ? '0' : '100',
                                }}>{word.foreign}</h3>
                            </div>
                            <button className='show-trns' onClick={show}>i forgot</button>
                        </div>
                        <button className='next-word' style={{ marginLeft: '2vh' }} onClick={next}
                            disabled={isProcessing}>
                            <img src={chR} alt="next" />
                        </button>
                        </div>
                    }
                        
                    {!isRunning && <div className="button-holder">
                        <button className='start-learning-button' onClick={start}>start learning</button>
                    </div>}
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
