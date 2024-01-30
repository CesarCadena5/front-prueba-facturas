import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useSelector, useDispatch } from 'react-redux';
import { setMessageReceptor } from '../../store/receptor/receptorSlice';
import { receptorFetch } from '../../store/receptor/thunks';

const CrearReceptor = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        msgReceptor,
        iconReceptor,
        loadingReceptor
    } = useSelector(state => state.receptor);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const regresar = () => {
        navigate('/receptores');
    };

    useEffect(() => {
        if (msgReceptor !== '') {

            Swal.fire({
                title: iconReceptor === "success" ? "Acción Exitosa" : "Ocurrió un error",
                text: msgReceptor,
                icon: iconReceptor
            }).then(() => {
                dispatch(setMessageReceptor());
            });

            if (iconReceptor === 'success') {
                reset();
            }
        }
    }, [msgReceptor]);

    const onSubmit = (data) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Guardar el receptor " + data.nombre_receptor,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(receptorFetch(`${import.meta.env.VITE_API_URL}receptor/crear`, JSON.stringify(data), 'POST'));
            }
        });
    };

    if (loadingReceptor) {
        return <Loading />
    }

    return (
        <div className="container-fluid">
            <div className="row d-flex altura-90 justify-content-center align-items-center">
                <div className="col-12 col-sm-8 col-md-8 shadow p-4 rounded">
                    <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-md-12">
                            <label htmlFor="nombre_receptor" className="form-label">Nombre Receptor</label>
                            <input type="text" {...register('nombre_receptor', {
                                required: {
                                    value: true,
                                    message: 'El nombre del receptor, es requerido.'
                                },
                                minLength: {
                                    value: 5,
                                    message: 'Mínimo 4 carácteres para el nombre.'
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Máximo 50 carácteres para el nombre.'
                                }
                            })} className="form-control" id="nombre_receptor" name='nombre_receptor' placeholder="Ej: Carlos Josefo" />
                            {
                                errors.nombre_receptor && (
                                    <div className="form-text">{errors.nombre_receptor?.message}</div>
                                )
                            }
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="nit_receptor" className='form-label'>Nit</label>
                            <input type="number" {...register('nit_receptor', {
                                required: {
                                    value: true,
                                    message: 'El nit es requerido'
                                }
                            })} className='form-control' id='nit_receptor' placeholder='Ej: 123456789' />
                            {
                                errors.nit_receptor && (
                                    <div className="form-text">{errors.nit_receptor?.message}</div>
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

export default CrearReceptor
