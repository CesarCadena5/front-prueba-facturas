import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from "react-redux";
import { facturasFetch } from '../../store/facturas/thunks';
import { setMessageFacturas } from '../../store/facturas/facturasSlice';

const ListaFacturas = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [facturasCopia, setFacturasCopia] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    const {
        register,
        handleSubmit,
        reset
    } = useForm();

    const {
        facturas,
        msgFacturas,
        iconFacturas,
        page,
        nextPage,
        pagingCounter,
        totalDocs,
        totalPages,
        prevPage,
        loadingFacturas
    } = useSelector(state => state.facturas);

    useEffect(() => {
        setBusqueda('');
        dispatch(facturasFetch(`${import.meta.env.VITE_API_URL}facturas/lista`));
    }, []);

    useEffect(() => {
        if (facturas && facturas.length > 0) {
            setFacturasCopia([...facturas]);
        }
    }, [facturas]);

    useEffect(() => {
        if (msgFacturas !== '' && iconFacturas !== '') {
            Swal.fire({
                title: "Acción Ejecutada",
                text: msgFacturas,
                icon: iconFacturas
            }).then(() => {
                dispatch(setMessageFacturas());
            });
        }
    }, [msgFacturas]);

    const editarFactura = (id = '') => {
        navigate(`/editar-factura/${id}`);
    };

    const obtenerFacturas = (index) => {
        setBusqueda('');
        let pagina = 0;
        if (index <= 0) {
            pagina = 1;
        }
        pagina = index;

        dispatch(facturasFetch(`${import.meta.env.VITE_API_URL}facturas/lista?pagina=${pagina}`));
    }

    const ejecutarFiltros = ({ target }) => {
        const campoOrden = target.value;

        const facturasFiltradas = facturasCopia.sort((facturaA, facturaB) => {
            const numeroFacturaA = facturaA[campoOrden];
            const numeroFacturaB = facturaB[campoOrden];

            return numeroFacturaA - numeroFacturaB;
        });

        setFacturasCopia([...facturasFiltradas]);
    };

    const onSubmit = ({ busqueda }) => {
        if (busqueda === '') {
            return;
        }
        setBusqueda(busqueda);
        dispatch(facturasFetch(`${import.meta.env.VITE_API_URL}facturas/lista?busqueda=${busqueda}`));
        reset();
    };

    const eliminarBusqueda = () => {
        setBusqueda('');
        dispatch(facturasFetch(`${import.meta.env.VITE_API_URL}facturas/lista`));
    };

    const verFactura = (id) => {
        navigate(`/ver-factura/${id}`);
    };

    const eliminarFactura = (id = '', numero = '') => {
        Swal.fire({
            title: "Eliminar Factura",
            text: `¿Estás seguro de eliminar la factura ${numero.toUpperCase()}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(facturasFetch(`${import.meta.env.VITE_API_URL}facturas/eliminar/${id}?pagina=${page}`, {}, 'DELETE'));
            }
        });
    };

    if (loadingFacturas && msgFacturas === '') {
        return <Loading />
    }


    return (
        <div className="container-fluid">
            <div className="row d-flex justify-content-center mb-4">
                <div className="col-12 col-sm-7 col-md-6">
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label htmlFor="busqueda" className="form-label mx-2">Buscar Factura</label>
                            <div className="mb-3 d-flex">
                                <input type="text" {...register('busqueda')} className="form-control mx-2" id="busqueda" placeholder='Ej: 123456' />
                                <button type="submit" className="btn btn-outline-primary">Buscar</button>
                            </div>
                            {
                                busqueda !== '' && (
                                    <>
                                        <p className='text-center lead'>
                                            Buscando: {busqueda}
                                            <button type='button' className='btn btn-sm btn-danger mx-2' onClick={eliminarBusqueda}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square-rounded-x" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10l4 4m0 -4l-4 4" /><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" /></svg>
                                            </button>
                                        </p>
                                    </>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-center">
                <div className="col-12 col-sm-7 col-md-6 d-flex justify-content-center">
                    <div className="form-check-inline">
                        <input className="form-check-input mx-1" onClick={ejecutarFiltros} type="radio" name="campo" id="factura" value="numero_factura" />
                        <label className="form-check-label" htmlFor="factura">
                            Factura
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <input className="form-check-input mx-1" onClick={ejecutarFiltros} type="radio" name="campo" id="iva" value="iva" />
                        <label className="form-check-label" htmlFor="iva">
                            Iva
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <input className="form-check-input mx-1" onClick={ejecutarFiltros} type="radio" name="campo" id="ant_iva" value="valor_antes_iva" />
                        <label className="form-check-label" htmlFor="ant_iva">
                            Valor Antes Iva
                        </label>
                    </div>
                    <div className="form-check-inline">
                        <input className="form-check-input mx-1" onClick={ejecutarFiltros} type="radio" name="campo" id="val_pagar" value="valor_pagar" />
                        <label className="form-check-label" htmlFor="val_pagar">
                            Valor Pagar
                        </label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 shadow">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr className="text-center">
                                <th scope="col">Nro Factura</th>
                                <th scope="col">Emisor</th>
                                <th scope="col">Receptor</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Iva</th>
                                <th scope="col">Val Antes Iva</th>
                                <th scope="col">Val Pagar</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {
                                facturasCopia && facturasCopia.length > 0 && facturasCopia.map((factura) => (
                                    <tr key={factura._id}>
                                        <th>{factura.numero_factura}</th>
                                        <th>{factura.emisor.nombre_emisor}</th>
                                        <th>{factura.receptor.nombre_receptor}</th>
                                        <th>
                                            {
                                                (() => {
                                                    const fechaHora = new Date(factura.fecha_hora);

                                                    const año = fechaHora.getFullYear();
                                                    const mes = String(fechaHora.getMonth() + 1).padStart(2, '0'); // Se suma 1 al mes, ya que en JavaScript los meses van de 0 a 11
                                                    const dia = String(fechaHora.getDate()).padStart(2, '0');

                                                    return `${año}-${mes}-${dia}`;
                                                })()
                                            }
                                        </th>
                                        <td>{factura.iva}</td>
                                        <td>{factura.valor_antes_iva}</td>
                                        <td>{factura.valor_pagar}</td>
                                        <td>
                                            <button className="btn btn-sm btn-success" onClick={() => editarFactura(factura._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                                            </button>
                                            <button className="btn btn-sm btn-primary mx-1" onClick={() => verFactura(factura._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => eliminarFactura(factura._id, factura.numero_factura)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-x-filled" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5zm-1.489 9.14a1 1 0 0 0 -1.301 1.473l.083 .094l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.403 1.403l.094 -.083l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.403 -1.403l-.094 .083l-1.293 1.292l-1.293 -1.292l-.094 -.083l-.102 -.07z" strokeWidth="0" fill="currentColor" /><path d="M19 7h-4l-.001 -4.001z" strokeWidth="0" fill="currentColor" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                            {
                                facturasCopia.length <= 0 && (
                                    <tr>
                                        <th colSpan='8'>
                                            <p className="lead">No hay facturas para mostrar</p>
                                        </th>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {
                        facturasCopia.length >= 1 && (
                            <div className='d-flex justify-content-between'>
                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        <li className={`page-item ${prevPage === null ? 'disabled' : ''}`}><a className="page-link" onClick={() => obtenerFacturas(page - 1)}>Anterior</a></li>
                                        {
                                            Array.from({ length: totalPages }, (_, index) => (
                                                <li className={`page-item ${page === index + 1 ? 'active' : ''}`} key={index + 1}>
                                                    <a className="page-link" href="#" onClick={() => obtenerFacturas(index + 1)}>{index + 1}</a>
                                                </li>
                                            ))
                                        }
                                        <li className={`page-item ${nextPage === null ? 'disabled' : ''}`}><a className="page-link" onClick={() => obtenerFacturas(page + 1)}>Siguiente</a></li>
                                    </ul>
                                </nav>
                                <p>
                                    Mostrando {totalDocs} registros, de un total de {totalDocs} facturas
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div >
    )
}

export default ListaFacturas
