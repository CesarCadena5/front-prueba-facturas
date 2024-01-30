import { validarToken } from "../usuarios/thunks";
import { setFacturas, setFacturasMsg, setLoading } from "./facturasSlice";


export const facturasFetch = (url, data = {}, method = 'GET', tipoVista = 'lista') => {
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

            dispatch(setFacturasMsg({ msgFacturas: mensaje, iconFacturas: json.icon, errores: json.errores, facturas: json.data }));
            return;
        }

        if (tipoVista === 'lista') {
            dispatch(setFacturas({
                facturas: json.data.docs,
                msgFacturas: json.msg,
                iconFacturas: json.icon,
                page: json.data.page,
                nextPage: json.data.nextPage,
                pagingCounter: json.data.pagingCounter,
                totalDocs: json.data.totalDocs,
                totalPages: json.data.totalPages,
                prevPage: json.data.prevPage
            }));
        } else {
            dispatch(setFacturas({
                facturas: json.data,
                iconFacturas: json.icon,
                msgFacturas: json.msg,
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