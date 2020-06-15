import React, { useState, useContext, useReducer } from 'react'
import ImageContext from "../utilities/imageContext"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./Lightbox.css"

function Lightbox(props) {
	const appContext = useContext(ImageContext)
	console.log(appContext)

	const specificImage = appContext.imageData.images[appContext.clickedImageIndex]

	console.log(specificImage)
	const [currImg, setIndex] = useState(0)


	return (
		<div>
			<Modal isOpen={appContext.isOpen} toggle={props.toggle} >
				<ModalHeader toggle={props.toggle}>{specificImage ? specificImage.description : null}</ModalHeader>
				<ModalBody className="d-flex flex-row">
					<div
						className='float-left left-image-flip'
						onClick={() => setIndex(currImg - 1)}
					>{"<"}</div>
					{specificImage ?
						<img className="img-fluid" src={specificImage.urls.regular} alt={specificImage.alt_description} /> :
						<img src="placeholder.png" />
					}
					<div
						className='float-right right-image-flip'
						onClick={() => setIndex(currImg + 1)}
					>{">"}</div>
				</ModalBody>
				<ModalFooter>
					<Button color="secondary" onClick={props.toggle}>Close</Button>
				</ModalFooter>
			</Modal>
		</div >
	);
}




export default Lightbox;