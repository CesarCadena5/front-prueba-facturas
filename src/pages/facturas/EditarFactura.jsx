import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import Loading from '../../components/Loading';
import { useDispatch, useSelector } from "react-redux";
import { emisorFetch } from '../../store/emisor/thunks';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from "react-router-dom";
import { receptorFetch } from '../../store/receptor/thunks';
import { facturasFetch } from '../../store/facturas/thunks';
import { setMessageFacturas } from '../../store/facturas/facturasSlice';

const EditarFactura = ({ soloLectura = false }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [facturaActualizada, setFacturaActualizada] = useState(false);

    const { emisor, loadingEmisor } = useSelector(state => state.emisor);
    const { receptor, loadingReceptor } = useSelector(state => state.receptor);
    const { msgFacturas, iconFacturas, loadingFacturas, facturas } = useSelector(state => state.facturas);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        getValues,
        setValue
    } = useForm({
        values: {
            numero_factura: facturas.numero_factura,
            fecha_hora: facturas.fecha_hora,
            nombre_emisor: facturas.emisor?.nombre_emisor,
            nombre_receptor: facturas.receptor?.nombre_receptor,
            valor_antes_iva: facturas.valor_antes_iva,
            iva: facturas.iva,
            valor_pagar: facturas.valor_pagar,
            items_facturados: facturas?.items_facturados
        }
    });

    useEffect(() => {
        if (facturas && facturas?.fecha_hora) {
            const fecha = new Date(facturas?.fecha_hora);

            const año = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            const horas = String(fecha.getHours()).padStart(2, '0');
            const minutos = String(fecha.getMinutes()).padStart(2, '0');

            const fechaFormateada = `${año}-${mes}-${dia}T${horas}:${minutos}`;
            setValue('fecha_hora', fechaFormateada);
        }
    }, [facturas]);

    useEffect(() => {
        if (msgFacturas !== '' && iconFacturas !== '') {
            Swal.fire({
                title: iconFacturas === "success" ? "Acción Exitosa" : "Ocurrió un error",
                text: msgFacturas,
                icon: iconFacturas,
                allowOutsideClick: facturaActualizada ? false : true,
                showCancelButton: facturaActualizada ? false : true,
                cancelButtonText: soloLectura ? 'ver' : 'Editar',
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Regresar",
            }).then((result) => {
                dispatch(setMessageFacturas());
                if (iconFacturas === "success" && result.isConfirmed) {
                    navigate('/facturas');
                }
            });
        }
    }, [msgFacturas]);


    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items_facturados'
    });

    useEffect(() => {
        if (id !== '') {
            dispatch(facturasFetch(`${import.meta.env.VITE_API_URL}facturas/ver/${id}`, '', 'GET', 'individual'));
        }
    }, []);

    useEffect(() => {
        dispatch(emisorFetch(`${import.meta.env.VITE_API_URL}emisor/lista`, {}, 'GET', 'individual'));
        dispatch(receptorFetch(`${import.meta.env.VITE_API_URL}receptor/lista`, {}, 'GET', 'individual'));
    }, []);

    const onSubmit = (data) => {
        if (data.items_facturados.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Validación.',
                text: 'Debe enviar al menos un ítem.'
            });
            return;
        }

        const fecha = new Date(data.fecha_hora);

        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');

        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        const segundos = String(fecha.getSeconds()).padStart(2, '0');

        const fechaFormateada = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

        data.fecha_hora = fechaFormateada;

        const nit_emisor = document.querySelector(`#emisor option[value=${data.nombre_emisor}]`);
        const nit_receptor = document.querySelector(`#receptor option[value=${data.nombre_receptor}]`);

        data.nit_emisor = nit_emisor.dataset.nitemisor;
        data.nit_receptor = nit_receptor.dataset.nitreceptor;

        setFacturaActualizada(true);
        dispatch(facturasFetch(`${import.meta.env.VITE_API_URL}facturas/editar/${id}`, JSON.stringify(data), 'PUT', 'individual'));
    }

    const removerInput = (index) => {
        const items_facturados = getValues('items_facturados');
        if (items_facturados.length === 1) {
            Swal.fire({
                icon: 'error',
                title: 'Opcíon Inválida.',
                text: 'Debe enviar al menos un item.'
            });
            return;
        };

        let total = getValues('valor_pagar');

        const totalPrecio = getValues(`items_facturados.${index}.valor_total`);
        setValue('valor_pagar', total - totalPrecio);

        remove(index);
    };

    const changeCantidad = ({ target }, index) => {
        setValue(`items_facturados.${index}.valor_total`, 0);
        const { value } = target;

        let precioUnitario = 0;
        let precio = 0;

        precioUnitario = getValues(`items_facturados.${index}.valor_unitario`) > 0 ? getValues(`items_facturados.${index}.valor_unitario`) : 0;

        precio = precioUnitario * value || 0;

        setValue(`items_facturados.${index}.valor_total`, precio);

        const items_facturados = getValues('items_facturados');

        const total = items_facturados.reduce((acum, actual) => acum + actual.valor_total, 0);
        setValue('valor_pagar', total);
    };

    const changeValorUnitario = ({ target }, index) => {
        setValue(`items_facturados.${index}.valor_total`, 0);
        const { value } = target;

        let cantidad = 0;
        let precio = 0;

        cantidad = getValues(`items_facturados.${index}.cantidad`) > 0 ? getValues(`items_facturados.${index}.cantidad`) : 0;
        precio = cantidad * value || 0;

        setValue(`items_facturados.${index}.valor_total`, precio);

        const items_facturados = getValues('items_facturados');

        const total = items_facturados.reduce((acum, actual) => acum + actual.valor_total, 0);
        setValue('valor_pagar', total);
    };

    const regresar = () => {
        navigate('/facturas');
    }

    if (loadingEmisor || loadingReceptor || loadingFacturas) {
        return (
            <Loading />
        );
    };

    return (
        <div className="container-fluid">
            <div className="row d-flex altura-90 justify-content-center align-items-center">
                <div className="col-12 col-sm-8 col-md-8 shadow p-4 rounded">
                    <form className="row g-3" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-md-6">
                            <label htmlFor="numero_factura" className="form-label">Nro Factura</label>
                            <input type="number" {...register('numero_factura', {
                                required: {
                                    value: true,
                                    message: 'El nro de factura, es requerido.'
                                },
                                minLength: {
                                    value: 5,
                                    message: 'Mínimo 5 carácteres para el número de factura.'
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Máximo 50 carácteres para el nro de factura.'
                                }
                            })} className="form-control" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} id="numero_factura" name='numero_factura' placeholder="12345678" />
                            {
                                errors.numero_factura && (
                                    <div className="form-text">{errors.numero_factura?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="emisor" className="form-label">Emisor</label>
                            <select id="emisor" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} {...register('nombre_emisor', { required: { value: true, message: 'El emisor, es requerido.' } })} className="form-select" defaultValue=''>
                                <option value=''>Elige uno</option>
                                {
                                    emisor && emisor.length > 0 && emisor.map(item => (
                                        <option key={item._id} data-nitemisor={item.nit_emisor} value={item.nombre_emisor}>{item.nombre_emisor} {item.nit_emisor}</option>
                                    ))
                                }
                            </select>
                            {
                                errors.nombre_emisor && (
                                    <div className="form-text">{errors.nombre_emisor?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="receptor" className="form-label">Receptor</label>
                            <select id="receptor" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} {...register('nombre_receptor', { required: { value: true, message: 'El receptor, es requerido.' } })} className="form-select" defaultValue=''>
                                <option value=''>Elige uno</option>
                                {
                                    receptor && receptor.length > 0 && receptor.map(item => (
                                        <option key={item._id} data-nitreceptor={item.nit_receptor} value={item.nombre_receptor}>{item.nombre_receptor} {item.nit_receptor}</option>
                                    ))
                                }
                            </select>
                            {
                                errors.nombre_receptor && (
                                    <div className="form-text">{errors.nombre_receptor?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="fecha_hora" className="form-label">Fecha</label>
                            <input type="datetime-local" {...register('fecha_hora', {
                                required: {
                                    value: true,
                                    message: 'La fecha es requerida'
                                }
                            })} className="form-control" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} id="fecha_hora" />
                            {
                                errors.fecha_hora && (
                                    <div className="form-text">{errors.fecha_hora?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="valor_antes_iva" className="form-label">Valor Antes Iva</label>
                            <input type="number" {...register('valor_antes_iva', {
                                required: {
                                    value: true,
                                    message: 'El valor antes de iva, es requerido.'
                                },
                                minLength: {
                                    value: 1,
                                    message: 'Mínimo 1 carácter para el valor antes de iva (1).'
                                },
                                pattern: {
                                    value: /^\d{1,20}$/,
                                    message: 'El valor antes de iva, son solo números.'
                                }
                            })} className="form-control" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} id="valor_antes_iva" placeholder='1200' />
                            {
                                errors.valor_antes_iva && (
                                    <div className="form-text">{errors.valor_antes_iva?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="iva" className="form-label">Iva</label>
                            <input type="number" {...register('iva', {
                                required: {
                                    value: true,
                                    message: 'El iva, es requerido.'
                                },
                                minLength: {
                                    value: 1,
                                    message: 'Mínimo 1 carácter para el iva.'
                                },
                                pattern: {
                                    value: /^\d{1,20}$/,
                                    message: 'El iva, son solo números'
                                }
                            })} className="form-control" id="iva" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} placeholder='10' />
                            {
                                errors.iva && (
                                    <div className="form-text">{errors.iva?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="valor_pagar" className="form-label">Valor Pagar</label>
                            <input type="number" {...register('valor_pagar')} className="form-control" id="valor_pagar" placeholder='0' readOnly disabled />
                        </div>
                        <div className="col-12">
                            {
                                !soloLectura && (
                                    <>
                                        <label htmlFor="items" className="form-label d-block">Items</label>
                                        <button
                                            type="button"
                                            className='btn btn-primary m-1'
                                            onClick={() => append({ descripcion: '', cantidad: '', valor_unitario: '', valor_total: '' })}
                                        >
                                            Agregar
                                        </button>
                                    </>
                                )
                            }
                            {
                                fields.map((item, index) => (
                                    <div key={item.id} className='d-flex flex-column'>
                                        <div className="row">
                                            <div className="col-6">
                                                <label htmlFor="desscripcion" className="form-label d-block">Descripción</label>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        {...register(`items_facturados.${index}.descripcion`, {
                                                            required: {
                                                                value: true,
                                                                message: 'La descripción, es requerida.'
                                                            }
                                                        })}
                                                        aria-label="descripcion"
                                                        aria-describedby="button-addon2"
                                                        placeholder='Descripción'
                                                        disabled={soloLectura ? true : false}
                                                        readOnly={soloLectura ? true : false}
                                                    />
                                                </div>
                                                {
                                                    errors.items_facturados && errors.items_facturados[index].descripcion && (
                                                        <div className="form-text mb-2">{errors.items_facturados[index].descripcion.message}</div>
                                                    )
                                                }
                                            </div>
                                            <div className="col-5">
                                                <label htmlFor="cantidad" className="form-label d-block">Cantidad</label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        {...register(`items_facturados.${index}.cantidad`, {
                                                            required: {
                                                                value: true,
                                                                message: 'La cantidad, es requerida.'
                                                            },
                                                            minLength: {
                                                                value: 1,
                                                                message: 'Mínimo 1 carácter para la cantidad.'
                                                            },
                                                            pattern: {
                                                                value: /^\d{1,20}$/,
                                                                message: 'La cantidad, son solo números.'
                                                            }
                                                        })}
                                                        placeholder="Ej: 2"
                                                        aria-label="cantidad"
                                                        aria-describedby="button-addon2"
                                                        onInput={(e) => changeCantidad(e, index)}
                                                        disabled={soloLectura ? true : false}
                                                        readOnly={soloLectura ? true : false}
                                                    />
                                                </div>
                                                {
                                                    errors.items_facturados && errors.items_facturados[index].cantidad && (
                                                        <div className="form-text mb-2">{errors.items_facturados[index].cantidad.message}</div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <label htmlFor="valor_unitario" className="form-label d-block">Valor Unitario</label>
                                                <div className="input-group">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        {...register(`items_facturados.${index}.valor_unitario`, {
                                                            required: {
                                                                value: true,
                                                                message: 'Valor unitario, es requerido.'
                                                            },
                                                            minLength: {
                                                                value: 1,
                                                                message: 'Mínimo 1 carácter para valor unitario.'
                                                            },
                                                            pattern: {
                                                                value: /^\d{1,20}$/,
                                                                message: 'Valor unitario, son solo números.'
                                                            }
                                                        })}
                                                        aria-label="valor_unitario"
                                                        aria-describedby="button-addon2"
                                                        placeholder='1'
                                                        onInput={(e) => changeValorUnitario(e, index)}
                                                        disabled={soloLectura ? true : false}
                                                        readOnly={soloLectura ? true : false}
                                                    />
                                                </div>
                                                {
                                                    errors.items_facturados && errors.items_facturados[index].valor_unitario && (
                                                        <div className="form-text mb-2">{errors.items_facturados[index].valor_unitario.message}</div>
                                                    )
                                                }
                                            </div>
                                            <div className="col-5 mx-1">
                                                <label htmlFor="valor_total" className="form-label d-block">Valor Total</label>
                                                <div className="input-group mb-3">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        {...register(`items_facturados.${index}.valor_total`)}
                                                        aria-label="valor_total"
                                                        aria-describedby="button-addon2"
                                                        disabled readOnly
                                                        placeholder='1'
                                                    />
                                                    {
                                                        !soloLectura && (
                                                            <button className="btn btn-danger" type="button" id="button-addon2" onClick={() => removerInput(index)}>Eliminar</button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="col-12 text-center">
                            {
                                !soloLectura && (
                                    <button type="submit" className="btn btn-success">Guardar</button>
                                )
                            }
                            <button type='button' className="btn btn-primary mx-2" onClick={regresar}>Regresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditarFactura
