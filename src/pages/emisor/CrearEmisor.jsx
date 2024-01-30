import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { emisorFetch } from '../../store/emisor/thunks';
import { setMessageEmisor } from '../../store/emisor/emisorSlice';
import Loading from '../../components/Loading';

const CrearEmisor = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { msgEmisor, iconEmisor, loadingEmisor } = useSelector(state => state.emisor);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const regresar = () => {
        navigate('/emisores');
    };

    useEffect(() => {
        if (msgEmisor !== '') {

            Swal.fire({
                title: iconEmisor === "success" ? "Acción Exitosa" : "Ocurrió un error",
                text: msgEmisor,
                icon: iconEmisor
            }).then(() => {
                dispatch(setMessageEmisor());
            })

            if (iconEmisor === 'success') {
                reset();
            }
        }
    }, [msgEmisor]);

    const onSubmit = (data) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Guardar el emisor " + data.nombre_emisor,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(emisorFetch(`${import.meta.env.VITE_API_URL}emisor/crear`, JSON.stringify(data), 'POST'));
            }
        });
    };

    if (loadingEmisor) {
        return <Loading />
    }

    return (
        <div className="container-fluid">
            <div className="row d-flex altura-90 justify-content-center align-items-center">
                <div className="col-12 col-sm-8 col-md-8 shadow p-4 rounded">
                    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-md-12">
                            <label htmlFor="nombre_emisor" className="form-label">Nombre Emisor</label>
                            <input type="text" {...register('nombre_emisor', {
                                required: {
                                    value: true,
                                    message: 'El nombre del emisor, es requerido.'
                                },
                                minLength: {
                                    value: 5,
                                    message: 'Mínimo 4 carácteres para el nombre.'
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Máximo 50 carácteres para el nombre.'
                                }
                            })} className="form-control" id="nombre_emisor" name='nombre_emisor' placeholder="Ej: Carlos Josefo" />
                            {
                                errors.nombre_emisor && (
                                    <div className="form-text">{errors.nombre_emisor?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="nit" className='form-label'>Nit</label>
                            <input type="number" {...register('nit_emisor', {
                                required: {
                                    value: true,
                                    message: 'El nit es requerido'
                                }
                            })} className='form-control' id='nit_emisor' placeholder='Ej: 123456789' />
                            {
                                errors.nit_emisor && (
                                    <div className="form-text">{errors.nit_emisor?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-success">Guardar</button>
                            <button type='button' className="btn btn-primary mx-2" onClick={regresar}>Regresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CrearEmisor
