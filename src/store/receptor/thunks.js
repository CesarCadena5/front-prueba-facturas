import { validarToken } from "../usuarios/thunks";
import { setLoading, setReceptor, setReceptorMsg } from "./receptorSlice";



export const receptorFetch = (url, data = {}, method = 'GET', tipoVista = 'lista') => {
    return async (dispatch) => {
        dispatch(setLoading());
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : '';

        dispatch(validarToken(token));

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                token
            },
            body: method !== 'GET' && method !== 'DELETE' ? data : null
        };

        const resp = await fetch(url, options);
        const json = await resp.json();

        if (method === 'POST' || method === 'PUT') {
            let mensaje = null;
            if (json.icon === 'error' && Array.isArray(json.msg)) {
                mensaje = formatMensaje(json);
            } else {
                mensaje = json.msg;
            }

            dispatch(setReceptorMsg({ msgReceptor: mensaje, iconReceptor: json.icon, errores: json.errores }));
            return;
        }

        if (tipoVista === 'lista') {
            dispatch(setReceptor({
                receptor: json.data.docs,
                msgReceptor: json.msg,
                iconReceptor: json.icon,
                page: json.data.page,
                nextPage: json.data.nextPage,
                pagingCounter: json.data.pagingCounter,
                totalDocs: json.data.totalDocs,
                totalPages: json.data.totalPages,
                prevPage: json.data.prevPage
            }));
        } else {
            dispatch(setReceptor({
                receptor: json.data,
                iconReceptor: json.icon,
                msgReceptor: json.msg,
                errores: json.errores
            }));
        }
    };
};

const formatMensaje = ({ msg }) => {
    let mensaje = '';
    msg.forEach(item => {
        mensaje += ` ${item.value} - ${item.msg} \n`;
    });

    return mensaje;
}