import React, { useState, useEffect } from 'react';

function Refund() {
	const [visible, setVisible] = useState(false);
	
	async function loadInitialData() {
		setVisible(true);
	}

	useEffect(() => {
		loadInitialData();
	}, []);



	return (
		<div className={`vh-content-wrap ${visible && 'active'}`}>
			<div className="common-page">
				<div className="vw-inner">

					<img src="/images/banner/apply/faq-003.jpg" alt="" className="visual" />

				</div>
			</div>
		</div>

	);
}



export default Refund;
