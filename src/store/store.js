import { configureStore } from '@reduxjs/toolkit';
import { emisorSlice } from './emisor/emisorSlice';
import { receptorSlice } from './receptor/receptorSlice';
import { facturasSlice } from './facturas/facturasSlice';
import { usuariosSlice } from './usuarios/usuariosSlice';

export const store = configureStore({
    reducer: {
        usuario: usuariosSlice.reducer,
        facturas: facturasSlice.reducer,
        receptor: receptorSlice.reducer,
        emisor: emisorSlice.reducer
    }
});