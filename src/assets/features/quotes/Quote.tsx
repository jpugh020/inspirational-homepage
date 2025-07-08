import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {selectQuote, getQuotes} from './quotesSlice';
import Spinner from 'react-bootstrap/Spinner'
export default function Quote() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getQuotes());
    }, [dispatch])
    const quote = useSelector(selectQuote);
    return (<>{ quote.author && quote.content ? 
    <><p><em className="quote">&nbsp;&nbsp;{quote.content}&nbsp;&nbsp;</em></p>
    <p className="quote" >- <strong>{quote.author}</strong></p></> : <Spinner />}
    </>)
}