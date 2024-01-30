import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    emisor: [],
    iconEmisor: '',
    msgEmisor: '',
    errores: [],
    loadingEmisor: false,
    page: 1,
    nextPage: 0,
    pagingCounter: 0,
    totalDocs: 0,
    totalPages: 0,
    prevPage: 1
};

export const emisorSlice = createSlice({
    name: 'emisor',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loadingEmisor = true;
        },
        setEmisor: (state, { payload }) => {
            state.loadingEmisor = false;
            state.emisor = payload.emisor;
            state.errores = payload.errores;
            state.msgEmisor = payload.msgEmisor;
            state.iconEmisor = payload.iconEmisor;
            state.page = payload.page;
            state.nextPage = payload.nextPage;
            state.pagingCounter = payload.pagingCounter;
            state.totalDocs = payload.totalDocs;
            state.totalPages = payload.totalPages;
            state.prevPage = payload.prevPage;
            state.totalDocs = payload.totalDocs;
        },
        setEmisorMsg: (state, { payload }) => {
            state.loadingEmisor = false;
            state.emisor = payload.emisor;
            state.errores = payload.errores;
            state.msgEmisor = payload.msgEmisor;
            state.iconEmisor = payload.iconEmisor;
        },
        setMessageEmisor: (state) => {
            state.msgEmisor = '';
            state.iconEmisor = '';
            state.loadingEmisor = false;
            state.errores = [];
        }
    }
});

export const { setLoading, setEmisor, setEmisorMsg, setMessageEmisor } = emisorSlice.actions;