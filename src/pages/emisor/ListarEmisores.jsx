import Swal from 'sweetalert2';
import { useEffect } from "react";
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { emisorFetch } from '../../store/emisor/thunks';
import { setMessageEmisor } from '../../store/emisor/emisorSlice';

const ListarEmisores = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        emisor,
        msgEmisor,
        iconEmisor,
        loadingEmisor,
        page,
        nextPage,
        pagingCounter,
        totalDocs,
        totalPages,
        prevPage
    } = useSelector(state => state.emisor);

    useEffect(() => {
        dispatch(emisorFetch(`${import.meta.env.VITE_API_URL}emisor/listar`));
    }, []);

    useEffect(() => {
        if (msgEmisor !== '') {
            Swal.fire({
                title: "Acción Ejecutada",
                text: msgEmisor,
                icon: iconEmisor
            }).then(() => {
                dispatch(setMessageEmisor());
            })
        }
    }, [msgEmisor]);

    const obtenerEmisores = (index) => {
        let pagina = 0;
        if (index <= 0) {
            pagina = 1;
        }
        pagina = index;

        dispatch(emisorFetch(`${import.meta.env.VITE_API_URL}emisor/listar?pagina=${pagina}`));
    }

    const eliminarEmisor = (id = '', nombre = '') => {
        console.log(nombre, id)
        Swal.fire({
            title: "Eliminar Emisor",
            text: `¿Estás seguro de eliminar el emisor ${nombre.toUpperCase()}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(emisorFetch(`${import.meta.env.VITE_API_URL}emisor/eliminar/${id}?pagina=${page}`, {}, 'DELETE'));
            }
        });
    };

    const editarEmisor = (id = '') => {
        navigate(`/editar-emisor/${id}`);
    };

    const verEmisor = (id = '') => {
        navigate(`/ver-emisor/${id}`);
    }

    if (loadingEmisor) {
        return <Loading />
    }

    return (
        <div className="container-fluid">
            <div className="row altura-90 d-flex justify-content-center align-items-center">
                <div className="col-12 col-sm-11 col-md-8">
                    <div className='m-3'>
                        <table className="table table-striped table-hover shadow">
                            <thead>
                                <tr className="text-center">
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Nit</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    emisor && emisor.length > 0 && emisor.map((item, index) => (
                                        <tr key={item._id}>
                                            <th>{++index}</th>
                                            <td>{item.nombre_emisor}</td>
                                            <td>{item.nit_emisor}</td>
                                            <td>
                                                <button className="btn btn-sm btn-success" onClick={() => editarEmisor(item._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                                                </button>
                                                <button className="btn btn-sm btn-primary mx-1" onClick={() => verEmisor(item._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => eliminarEmisor(item._id, item.nombre_emisor)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-x-filled" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5zm-1.489 9.14a1 1 0 0 0 -1.301 1.473l.083 .094l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.403 1.403l.094 -.083l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.403 -1.403l-.094 .083l-1.293 1.292l-1.293 -1.292l-.094 -.083l-.102 -.07z" strokeWidth="0" fill="currentColor" /><path d="M19 7h-4l-.001 -4.001z" strokeWidth="0" fill="currentColor" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    emisor && emisor.length <= 0 && (
                                        <tr>
                                            <th colSpan='4'>
                                                <p className="lead">No hay emisores para mostrar</p>
                                            </th>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        {
                            emisor && emisor.length > 1 && (
                                <div className='d-flex justify-content-center justify-content-sm-between'>
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className={`page-item ${prevPage === null ? 'disabled' : ''}`}><a className="page-link" onClick={() => obtenerEmisores(page - 1)}>Anterior</a></li>
                                            {
                                                Array.from({ length: totalPages }, (_, index) => (
                                                    <li className={`page-item ${page === index + 1 ? 'active' : ''}`} key={index + 1}>
                                                        <a className="page-link" href="#" onClick={() => obtenerEmisores(index + 1)}>{index + 1}</a>
                                                    </li>
                                                ))
                                            }
                                            <li className={`page-item ${nextPage === null ? 'disabled' : ''}`}><a className="page-link" onClick={() => obtenerEmisores(page + 1)}>Siguiente</a></li>
                                        </ul>
                                    </nav>
                                    <p className='d-none d-sm-block mx-1'>
                                        Mostrando {totalDocs} registros, de un total de {totalDocs} emisores
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListarEmisores
