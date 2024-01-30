import Swal from 'sweetalert2';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { receptorFetch } from '../../store/receptor/thunks';
import { setMessageReceptor } from '../../store/receptor/receptorSlice';

const ListarReceptores = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        receptor,
        msgReceptor,
        iconReceptor,
        page,
        nextPage,
        pagingCounter,
        totalDocs,
        totalPages,
        prevPage
    } = useSelector(state => state.receptor);

    useEffect(() => {
        dispatch(receptorFetch(`${import.meta.env.VITE_API_URL}receptor/listar`));
    }, []);

    useEffect(() => {
        if (msgReceptor !== '') {
            Swal.fire({
                title: "Acción Ejecutada",
                text: msgReceptor,
                icon: iconReceptor
            }).then(() => {
                dispatch(setMessageReceptor());
            })
        }
    }, [msgReceptor]);

    const obtenerReceptores = (index) => {
        let pagina = 0;
        if (index <= 0) {
            pagina = 1;
        }
        pagina = index;

        dispatch(receptorFetch(`${import.meta.env.VITE_API_URL}receptor/listar?pagina=${pagina}`));
    }

    const eliminarReceptor = (id = '', nombre = '') => {
        Swal.fire({
            title: "Eliminar Receptor",
            text: `¿Estás seguro de eliminar el receptor ${nombre.toUpperCase()}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(receptorFetch(`${import.meta.env.VITE_API_URL}receptor/eliminar/${id}?pagina=${page}`, {}, 'DELETE'));
            }
        });
    };

    const editarReceptor = (id = '') => {
        navigate(`/editar-receptor/${id}`);
    };

    const verReceptor = (id = '') => {
        navigate(`/ver-receptor/${id}`);
    }

    return (
        <div className="container-fluid">
            <div className="row d-flex altura-90 justify-content-center align-items-center">
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
                                    receptor && receptor.length > 0 && receptor.map((item, index) => (
                                        <tr key={item._id}>
                                            <th>{++index}</th>
                                            <td>{item.nombre_receptor}</td>
                                            <td>{item.nit_receptor}</td>
                                            <td>
                                                <button className="btn btn-sm btn-success" onClick={() => editarReceptor(item._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                                                </button>
                                                <button className="btn btn-sm btn-primary mx-1" onClick={() => verReceptor(item._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => eliminarReceptor(item._id, item.nombre_receptor)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-x-filled" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5zm-1.489 9.14a1 1 0 0 0 -1.301 1.473l.083 .094l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.403 1.403l.094 -.083l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.403 -1.403l-.094 .083l-1.293 1.292l-1.293 -1.292l-.094 -.083l-.102 -.07z" strokeWidth="0" fill="currentColor" /><path d="M19 7h-4l-.001 -4.001z" strokeWidth="0" fill="currentColor" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    receptor && receptor.length <= 0 && (
                                        <tr>
                                            <th colSpan='4'>
                                                <p className="lead">No hay receptores para mostrar</p>
                                            </th>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        {
                            receptor && receptor.length > 1 && (
                                <div className='d-flex justify-content-center justify-content-sm-between'>
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className={`page-item ${prevPage === null ? 'disabled' : ''}`}><a className="page-link" onClick={() => obtenerReceptores(page - 1)}>Anterior</a></li>
                                            {
                                                Array.from({ length: totalPages }, (_, index) => (
                                                    <li className={`page-item ${page === index + 1 ? 'active' : ''}`} key={index + 1}>
                                                        <a className="page-link" href="#" onClick={() => obtenerReceptores(index + 1)}>{index + 1}</a>
                                                    </li>
                                                ))
                                            }
                                            <li className={`page-item ${nextPage === null ? 'disabled' : ''}`}><a className="page-link" onClick={() => obtenerReceptores(page + 1)}>Siguiente</a></li>
                                        </ul>
                                    </nav>
                                    <p className='d-none d-sm-block mx-1'>
                                        Mostrando {totalDocs} registros, de un total de {totalDocs} receptores
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

export default ListarReceptores
