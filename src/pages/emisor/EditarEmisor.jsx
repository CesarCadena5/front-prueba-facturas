import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { setMessageEmisor } from '../../store/emisor/emisorSlice';
import { emisorFetch } from '../../store/emisor/thunks';
import Loading from '../../components/Loading';

const EditarEmisor = ({ soloLectura = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { emisor, msgEmisor, iconEmisor, loadingEmisor } = useSelector(state => state.emisor);

    const {
        register,
        reset,
        handleSubmit,
    } = useForm();

    useEffect(() => {
        if (msgEmisor !== '') {

            Swal.fire({
                title: iconEmisor === "success" ? "Acción Exitosa" : "Ocurrió un error",
                text: msgEmisor,
                icon: iconEmisor
            }).then(() => {
                dispatch(setMessageEmisor());
            });
        };
    }, [msgEmisor]);

    useEffect(() => {
        if (emisor) {
            reset({
                nombre_emisor: emisor.nombre_emisor,
                nit_emisor: emisor.nit_emisor
            });
        }
    }, [emisor]);


    useEffect(() => {
        if (id !== '') {
            dispatch(emisorFetch(`${import.meta.env.VITE_API_URL}emisor/ver/${id}`, {}, 'GET', 'individual'));
        }
    }, [id]);

    const onSubmit = (data) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Actualizar el emisor " + data.nombre_emisor,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(emisorFetch(`${import.meta.env.VITE_API_URL}emisor/editar/${id}`, JSON.stringify(data), 'PUT'));
            }
        });
    };

    const regresar = () => {
        navigate('/emisores');
    }

    if (loadingEmisor) {
        return <Loading />
    }

    return (
        <div className="container-fluid">
            <div className="row d-flex altura-90 justify-content-around align-items-center">
                <div className="col-12 col-sm-8 col-md-8 shadow p-4 rounded">
                    <form className="row g-3" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-md-12">
                            <label htmlFor="nombre_emisor" className="form-label">Nombre Emisor</label>
                            <input type="text" {...register('nombre_emisor')} className="form-control" id="nombre_emisor" placeholder="Ej: Carlos" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="nit_emisor" className="form-label">Nit Emisor</label>
                            <input type="number" {...register('nit_emisor')} className="form-control" id="nit_emisor" placeholder="Ej: 76677788" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} />
                        </div>
                        <div className="col-12 text-center">
                            {
                                !soloLectura && (
                                    <button type="submit" className="btn btn-primary mx-1">Actualizar</button>
                                )
                            }
                            <button type='button' className="btn btn-warning" onClick={regresar}>Regresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditarEmisor
