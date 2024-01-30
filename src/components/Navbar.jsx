import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogout } from '../store/usuarios/usuariosSlice';

const Navbar = ({ nombre = '' }) => {
    const dispatch = useDispatch();
    const handleLogout = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Vas a cerrar sesión",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Salir"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                localStorage.removeItem('nombre');
                dispatch(setLogout());

                Swal.fire({
                    title: "Sesión Cerrada",
                    text: "Vuelve cuando desees.",
                    icon: "success"
                });
            }
        });
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <NavLink
                    className='navbar-brand'
                    to="/facturas">
                    Cesar Prueba
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Facturas
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <NavLink
                                        className='dropdown-item'
                                        to="/facturas">
                                        Lista Facturas
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        className='dropdown-item'
                                        to="/crear-factura">
                                        Crear Factura
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Emisor
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <NavLink
                                        className='dropdown-item'
                                        to="/emisores">
                                        Lista Emisores
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        className='dropdown-item'
                                        to="/crear-emisor">
                                        Crear Emisor
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Receptor
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <NavLink
                                        className='dropdown-item'
                                        to="/receptores">
                                        Lista Receptores
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        className='dropdown-item'
                                        to="/crear-receptor">
                                        Crear Receptor
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {nombre.toUpperCase()}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><a className="dropdown-item" onClick={handleLogout}>Salir</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
