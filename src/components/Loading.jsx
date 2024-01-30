import React from 'react'

const Loading = () => {
    return (
        <div className="container-fluid">
            <div className="row d-flex altura-90 justify-content-center align-items-center">
                <div className="col-12 col-sm-8 col-md-8 p-4 rounded">
                    <p className='lead text-center'>Espera...</p>
                    <span className="loader"></span>
                </div>
            </div>
        </div>
    )
}

export default Loading
