import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUsuarioAuth } from '../store/usuarios/thunks';
import { setInitialState } from '../store/usuarios/usuariosSlice';

export const Login = () => {
    const dispatch = useDispatch();
    const { error, auth } = useSelector(state => state.usuario);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            correo: '',
            password: ''
        }
    });

    const onSubmit = (data) => {
        dispatch(getUsuarioAuth(data));
    };

    useEffect(() => {
        if (error !== '') {
            Swal.fire({
                title: 'Error',
                text: error,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            dispatch(setInitialState());
        }
    }, [error]);

    useEffect(() => {
        if (auth) {
            navigate('/facturas', { replace: true })
        }
    }, [auth]);

    return (
        <div className="container-fluid fondo-login">
            <div className="row d-flex justify-content-center align-items-center vh-100 ">
                <div className="col-12 col-sm-8 col-md-5 shadow p-4 bg-light rounded">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Correo</label>
                            <input
                                type="email"
                                {...register("correo",
                                    {
                                        required: 'El correo es requerido',
                                        pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'El correo no cumple con el formato requerido' }
                                    }
                                )}
                                placeholder='correo@correo.com'
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                            />
                            {
                                errors.correo && (
                                    <div id="emailHelp" className="form-text">{errors.correo?.message}</div>
                                )
                            }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                placeholder='123456'
                                {...register("password",
                                    {
                                        required: 'La contraseña es requerida',
                                        minLength: {
                                            value: 6,
                                            message: 'Mínimo 6 carácteres'
                                        }
                                    }
                                )}
                                className="form-control"
                                id="exampleInputPassword1"
                            />
                            {
                                errors.password && (
                                    <div id="exampleInputPassword1" className="form-text">{errors.password?.message}</div>
                                )
                            }
                        </div>
                        <button type="submit" className="btn btn-outline-primary">Ingresar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};