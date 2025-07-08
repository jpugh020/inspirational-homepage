import { getImages } from "./imagesSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectImageUrl, selectImages, selectPhotographer, nextImage, prevImage } from "./imagesSlice";
import { BsSearch } from "react-icons/bs";
import Modal from 'react-bootstrap/Modal';


export default function ImageControls() {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const [isModalOpen, setIsOpen] = useState(false);
    useEffect(()=> {
        dispatch(getImages("sunrise"));
        
    }, [dispatch]);
    const image = useSelector(selectImageUrl);
    const backup = "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NzI5MTd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlfGVufDB8MHx8fDE3NTE4OTg1OTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
    const body = document.getElementById("body");
    if (!image) {
        body.style.backgroundImage = `url(${backup})`;
        
    }else {
        body.style.backgroundImage = `url(${image})`;

    }
    const images = useSelector(selectImages);
    const photographer = useSelector(selectPhotographer);
    

    
    return (<>{image ?
    <div id="imageControls">
        <div className="imageInfo">
            <Modal show={isModalOpen}>
                <Modal.Header><h2>About this background image</h2></Modal.Header>
                <Modal.Body>
                    <p>Photographer: {photographer}</p>
                    <p>Description: {images?.find((photo) => photo.urls.regular === image)?.description ? images?.find((photo) => photo.urls.regular === image)?.description : "No description provided"}</p>
                    <p>Other works: <a href={`https://unsplash.com/@${photographer}`} target="_blank">{photographer?.charAt(0).toUpperCase().concat(photographer.slice(1))}'s Unsplash account</a></p>
        

                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => {setIsOpen(false); }}>Close</button>
                </Modal.Footer>
            </Modal>
            
        
            <button onClick={() => {
                setIsOpen(true);
            }}
            id="imageInfo"
            className="opacity"
              >Info about this background</button>
        </div>
        <div className="imageSearch">
            <form action=""  onSubmit={e => {e.preventDefault(); dispatch(getImages(query));}}>
            <input type="text" placeholder="Search for new images" name="imageSearch" id="imageSearchInput" onChange={e => setQuery(e.target.value)} value={query} className="opacity"/>
            <button type="submit" className="opacity"><BsSearch /></button>
            </form>
        </div>
         <div className="wallpaper-control">
        <button onClick={(e) => {e.preventDefault(); dispatch(prevImage())}} className="" id="prevButton">
            {"<"}
        </button>
        <button onClick={(e) => {e.preventDefault(); dispatch(nextImage())}} className="" id="nextButton">
            {">"}
        </button>
        </div> 
    </div> : null}
    </>);
}
