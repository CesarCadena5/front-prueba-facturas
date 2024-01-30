import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { receptorFetch } from '../../store/receptor/thunks';
import { setMessageReceptor } from '../../store/receptor/receptorSlice';
import Loading from '../../components/Loading';

const EditarReceptor = ({ soloLectura = false }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { receptor, msgReceptor, iconReceptor, loadingReceptor } = useSelector(state => state.receptor);

    const {
        register,
        reset,
        handleSubmit,
    } = useForm();

    useEffect(() => {
        if (msgReceptor !== '') {
            Swal.fire({
                title: iconReceptor === "success" ? "Acción Exitosa" : "Ocurrió un error",
                text: msgReceptor,
                icon: iconReceptor
            }).then(() => {
                dispatch(setMessageReceptor());
            })
        }
    }, [msgReceptor]);

    useEffect(() => {
        if (receptor) {
            reset({
                nombre_receptor: receptor.nombre_receptor,
                nit_receptor: receptor.nit_receptor
            });
        }
    }, [receptor]);


    useEffect(() => {
        if (id !== '') {
            dispatch(receptorFetch(`${import.meta.env.VITE_API_URL}receptor/ver/${id}`, {}, 'GET', 'individual'));
        }
    }, [id]);

    const onSubmit = (data) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Actualizar el receptor " + data.nombre_receptor,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí",
            cancelButtonText: "No"
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(receptorFetch(`${import.meta.env.VITE_API_URL}receptor/editar/${id}`, JSON.stringify(data), 'PUT'));
            }
        });
    };

    const regresar = () => {
        navigate('/receptores');
    }

    if (loadingReceptor) {
        return <Loading />
    }

    return (
        <div className="container-fluid">
            <div className="row d-flex altura-90 justify-content-around align-items-center">
                <div className="col-12 col-sm-8 col-md-8 shadow p-4 rounded">
                    <form className="row g-3" encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-md-12">
                            <label htmlFor="nombre_receptor" className="form-label">Nombre Receptor</label>
                            <input type="text" {...register('nombre_receptor')} className="form-control" id="nombre_receptor" placeholder="Ej: Carlos" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="nit_receptor" className="form-label">Nit Receptor</label>
                            <input type="number" {...register('nit_receptor')} className="form-control" id="nit_receptor" placeholder="Ej: 76677788" disabled={soloLectura ? true : false} readOnly={soloLectura ? true : false} />
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

export default EditarReceptor
