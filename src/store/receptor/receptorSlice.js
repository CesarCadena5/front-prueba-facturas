import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    receptor: [],
    iconReceptor: '',
    msgReceptor: '',
    errores: [],
    loadingReceptor: false,
    page: 1,
    nextPage: 0,
    pagingCounter: 0,
    totalDocs: 0,
    totalPages: 0,
    prevPage: 1
};

export const receptorSlice = createSlice({
    name: 'receptor',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loadingReceptor = true;
        },
        setReceptor: (state, { payload }) => {
            state.loadingReceptor = false;
            state.receptor = payload.receptor;
            state.errores = payload.errores;
            state.msgReceptor = payload.msgReceptor;
            state.iconReceptor = payload.iconReceptor;
            state.page = payload.page;
            state.nextPage = payload.nextPage;
            state.pagingCounter = payload.pagingCounter;
            state.totalDocs = payload.totalDocs;
            state.totalPages = payload.totalPages;
            state.prevPage = payload.prevPage;
            state.totalDocs = payload.totalDocs;
        },
        setReceptorMsg: (state, { payload }) => {
            state.loadingReceptor = false;
            state.receptor = payload.receptor;
            state.errores = payload.errores;
            state.msgReceptor = payload.msgReceptor;
            state.iconReceptor = payload.iconReceptor;
        },
        setMessageReceptor: (state) => {
            state.msgReceptor = '';
            state.iconReceptor = '';
            state.loadingReceptor = false;
            state.errores = [];
        }
    }
});

export const { setLoading, setReceptor, setReceptorMsg, setMessageReceptor } = receptorSlice.actions;