import React, { useState, useEffect } from 'react';

function Agreement() {
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

					<img src="/images/banner/apply/agree01.jpg" alt="" className="visual" />

				</div>
			</div>
		</div>

	);
}



export default Agreement;
