import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    facturas: [],
    iconFacturas: '',
    msgFacturas: '',
    errores: [],
    loadingFacturas: false,
    page: 1,
    nextPage: 0,
    pagingCounter: 0,
    totalDocs: 0,
    totalPages: 0,
    prevPage: 1
};

export const facturasSlice = createSlice({
    name: 'facturas',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loadingFacturas = true;
        },
        setFacturas: (state, { payload }) => {
            state.loadingFacturas = false;
            state.facturas = payload.facturas;
            state.errores = payload.errores;
            state.msgFacturas = payload.msgFacturas;
            state.iconFacturas = payload.iconFacturas;
            state.page = payload.page;
            state.nextPage = payload.nextPage;
            state.pagingCounter = payload.pagingCounter;
            state.totalDocs = payload.totalDocs;
            state.totalPages = payload.totalPages;
            state.prevPage = payload.prevPage;
            state.totalDocs = payload.totalDocs;
        },
        setFacturasMsg: (state, { payload }) => {
            state.loadingFacturas = false;
            state.facturas = payload.facturas;
            state.errores = payload.errores;
            state.msgFacturas = payload.msgFacturas;
            state.iconFacturas = payload.iconFacturas;
        },
        setMessageFacturas: (state) => {
            state.msgFacturas = '';
            state.iconFacturas = '';
            state.loadingFacturas = false;
            state.errores = [];
        }
    }
});

export const { setLoading, setFacturas, setFacturasMsg, setMessageFacturas } = facturasSlice.actions;