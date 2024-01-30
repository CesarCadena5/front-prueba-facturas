import { setAuth, setError, setLoading, setLogout } from "./usuariosSlice";

export const getUsuarioAuth = (data = {}) => {
    return async (dispatch) => {
        dispatch(setLoading());
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const resp = await fetch(`${import.meta.env.VITE_API_URL}usuarios/login`, options);
        const json = await resp.json();

        if (json && json.error) {
            dispatch(setError({ error: json.error }));
            return;
        }

        localStorage.setItem('token', json.token);
        localStorage.setItem('nombre', json.nombre);

        dispatch(setAuth({ nombre: json.nombre, token: json.token }));
    }
}

export const validarToken = (token) => {
    return async (dispatch) => {
        if (token === '') {
            dispatch(setLogout());
            return;
        }
        dispatch(setLoading());

        const options = {
            method: 'POST',
            headers: {
                token
            }
        };

        const resp = await fetch(`${import.meta.env.VITE_API_URL}usuarios/validar-token`, options);
        const json = await resp.json();

        if (json.ok) {
            dispatch(setAuth({ nombre: json.usuario.nombre, token }));
            localStorage.setItem('token', token);
            localStorage.setItem('nombre', json.usuario.nombre);
        } else {
            dispatch(setLogout());
            return;
        }
    };
};