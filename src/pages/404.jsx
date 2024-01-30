import { NavLink } from 'react-router-dom';

const Error404 = () => {
    return (
        <div className='row margin-top altura-90'>
            <div className="col-sm-12 col-md-6 d-flex align-items-center">
                <div className='mx-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler text-primary-emphasis icon-tabler-error-404" width="100" height="100" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M3 7v4a1 1 0 0 0 1 1h3"></path>
                        <path d="M7 7v10"></path>
                        <path d="M10 8v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1z"></path>
                        <path d="M17 7v4a1 1 0 0 0 1 1h3"></path>
                        <path d="M21 7v10"></path>
                    </svg>
                    <h2 className='fw-bold text-primary-emphasis'>¡Oooooops! Esto no lo deberías haber visto.</h2>
                    <p className='lead text-primary'>La pagina que buscas, no existe. <br /> Vuelve a la pagina de <NavLink to="/">Inicio </NavLink>
                        y recuerda que no has visto nada.</p>
                    <p className='lead'>
                    </p>
                </div>
            </div>
            <div className="col-sm-12 col-md-6 cont-imagen d-flex align-items-center">
                <img src="/img/404.jpg" alt="Imagen 404" />
            </div>
        </div>
    )
}

export default Error404
