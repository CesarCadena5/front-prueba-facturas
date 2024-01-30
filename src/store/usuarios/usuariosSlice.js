import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    nombre: localStorage.getItem('token') ? localStorage.getItem('nombre') : 'Usuario',
    auth: localStorage.getItem('token') ? true : false,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    loading: false,
    error: ''
};

// const initialState = {
//     nombre: '',
//     auth: false,
//     token: '',
//     loading: false,
//     error: ''
// };

export const usuariosSlice = createSlice({
    name: 'usuarios',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
        },
        setAuth: (state, { payload }) => {
            state.loading = false;
            state.auth = true;
            state.nombre = payload.nombre;
            state.error = '';
            state.token = payload.token;
        },
        setLogout: (state) => {
            state.loading = false;
            state.auth = false;
            state.nombre = '';
            state.error = '';
            state.token = '';
        },
        setError: (state, { payload }) => {
            state.error = payload.error;
            state.loading = false;
            state.nombre = '';
        },
        setInitialState: (state) => {
            state.error = '';
            state.loading = false;
            state.nombre = '';
            state.auth = false;
            state.token = '';
        }
    }
});

export const { setLoading, setAuth, setError, setLogout, setInitialState } = usuariosSlice.actions;