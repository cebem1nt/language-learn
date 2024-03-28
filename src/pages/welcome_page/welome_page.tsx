import { useState, useEffect,  } from 'react'
import './welcome_page.scss'
import nextR from '../../assets/images/right-arrow.svg'
import nextD from '../../assets/images/down-arrow.svg'
import { setLocalStorageItem } from '../../modules/storage'
import { useNavigate } from "react-router-dom"
import { isRegistered } from '../../modules/user'


interface SlideProps {
    onClick: () => void
    isVisible: boolean
}

interface SlideSendProps {
    onClick: (val: string) => void
    isVisible: boolean
}

interface LastSlideProps {
    onClick: (val: string) => void
    isVisible: boolean
    prevChoice: string
}

export default function WelcomePage() {
    const [slide, addSlide] = useState(1)
    const [isCurrentVisible, setIsCurrentVisible] = useState(true)
    const [prevSelected, setPrevSelected] = useState('en')
    const nextSlide = (): void => {
        setIsCurrentVisible( false )

        setTimeout(()=> {
            if (slide < 3) {
                addSlide( slide + 1 )
                setIsCurrentVisible( true )
            }
        }, 300)
    }
    const setAndNext = (val : string): void => {
        setPrevSelected(val)
        nextSlide()
    }
    const setValsAndReturn = (val: string): void => {
        setLocalStorageItem('NATIVE', prevSelected)
        setLocalStorageItem('FOREIGN', val)
        window.location.href = '/home'
    }

    let navigate = useNavigate();

    useEffect(() => {
    if (isRegistered()){
        return navigate("/home");
    }
    },[isRegistered]);

    return (
        <>
        {slide === 1 && <FirstSlide onClick={ nextSlide } isVisible={isCurrentVisible} />}
        {slide === 2 && <SecondSlide onClick={ setAndNext } isVisible={isCurrentVisible} />}
        {slide === 3 && <ThirdSlide onClick={ setValsAndReturn } isVisible={isCurrentVisible} prevChoice={prevSelected} />}
        </>
    )
}

function FirstSlide ( { onClick, isVisible }: SlideProps ) {
    return ( 
        <div className={`container animate__animated ${isVisible ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}>
            <div className="intrd">
                <div className="main">
                    <h1 className='heading'><em>Welcome</em> to this project</h1>
                    <h2 className='sub-heading'>Here you can learn foreign langages' words!</h2>
                    <h3 className='info'>Allright, let's get started! For now you have to add
                        a languages pair youd like to learn! Than you will add
                        the words especialy you want to learn.
                    </h3>
                </div>

                <div className="next">
                    <button className='next-button' onClick={ onClick }>
                        <img src={nextR} alt="next page" id='R'/>
                        <img src={nextD} alt="next page" id='D'/>
                    </button>
                </div>
            </div>
        </div> 
        )
}

function SecondSlide ( { onClick, isVisible }: SlideSendProps ) {
    const [nativeLang, setNativeLang] = useState('en')

    const handleLangChange = (event: any) => {
        setNativeLang(event.target.value)
    }

    return (
        <div className={`container animate__animated ${isVisible ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}>
            <div className="intrd">
                <div className="main">
                    <h1 className='heading'>Choose your native language!</h1>
                    <select name="nativelang" id="nativelang" value={nativeLang} onChange={handleLangChange}>
                        <option value="en">English</option>
                        <option value="ru">Rushian</option>
                        <option value="tr">Turkish</option>
                        <option value="es">Spanish</option>
                    </select>
                </div>

                <div className="next">
                    <button className='next-button' onClick={ () => { onClick( nativeLang ) } }>
                        <img src={nextR} alt="next page" id='R'/>
                        <img src={nextD} alt="next page" id='D'/>
                    </button>
                </div>
            </div>
        </div> 
    )
}

function ThirdSlide ( { onClick, isVisible, prevChoice }: LastSlideProps ) {
    const [foreignLang, setForeignLang] = useState('ru')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(()=>{

        if (foreignLang === prevChoice){
            setErrorMessage('Languages can not be same')
        } else {
            setErrorMessage('')
        }
        
    }, [foreignLang, prevChoice]) 

    const handleLangChange = (event: any) => {
        setForeignLang(event.target.value)
    }

    const isError = () => {
        if (errorMessage === 'Languages can not be same') {
            return true
        }
        return false
    }

    return (
        <div className={`container animate__animated ${isVisible ? 'animate__fadeInLeft' : 'animate__fadeOutRight'}`}>
            <div className="intrd">
                <div className="main">
                    <h1 className='heading'>Choose your foreign language!</h1>
                    <select name="nativelang" id="nativelang" value={foreignLang} onChange={handleLangChange}>
                        <option value="ru">Rushian</option>
                        <option value="en">English</option>
                        <option value="tr">Turkish</option>
                        <option value="es">Spanish</option>
                    </select>
                    <br />
                    {isError() && <small>{errorMessage}</small>}
                </div>

                <div className="next" style={{
                    pointerEvents: isError() ? 'none' : 'auto',
                }}>
                    <button className='next-button' onClick={ () => { onClick(foreignLang) } }
                    disabled={isError()}>
                        <img src={nextR} alt="next page" id='R'/>
                        <img src={nextD} alt="next page" id='D'/>
                    </button>
                </div>
            </div>
        </div> 
    )
}