import { Selector } from 'testcafe';
import { abrirProcesos360, cerrarPestana360 } from './HelpersHgi360Web.js';

// Pantallas de Procesos (React): abrir la tarjeta del menú ya NO ejecuta el proceso, hay que pulsar
// "Ejecutar proceso". Mientras corre el botón queda deshabilitado y al terminar cambia a "Ejecutar de nuevo".
// Ids validados en test.hgi360.com el 05-nov-2026.
export const BOTON_EJECUTAR_PROCESO = {
    'Cartera': 'ProcesosCarteraContainer_BtnEjecutar',
    'Pedidos': 'ProcesosPedidosContainer_BtnEjecutar',
    'Inventario': 'ProcesosGeneralesContainer_BtnEjecutar',
    'Inventario con saldo inicial': 'ProcesosGeneralesContainer_BtnEjecutar'
};

// "Proceso finalizado con novedades" también es un fin correcto: las novedades son de los datos (saldos negativos).
const FIN_DEL_PROCESO = /Proceso (completado|finalizado)/;

/** Abre el proceso, lo ejecuta, espera a que termine, valida el mensaje final y cierra la pestaña. */
export const ejecutarProceso360 = async (t, nombreProceso, espera = 180000) => {
    const idBoton = BOTON_EJECUTAR_PROCESO[nombreProceso];
    if (!idBoton) {
        throw new Error(`No hay id de botón Ejecutar para el proceso "${nombreProceso}"`);
    }
    const boton = Selector(`#${idBoton}`).filterVisible();
    const contenedor = Selector(`#${idBoton.replace(/_BtnEjecutar$/, '')}`).filterVisible();

    await abrirProcesos360(t, nombreProceso);
    await t
        .expect(boton.withText('Ejecutar proceso').exists).ok(
            `No apareció el botón "Ejecutar proceso" (#${idBoton}) de ${nombreProceso}`, { timeout: 15000 }
        )
        .click(boton)
        .expect(boton.withText('Ejecutar de nuevo').exists).ok(
            `El proceso ${nombreProceso} no terminó en ${espera / 1000} s`, { timeout: espera }
        )
        .expect(contenedor.innerText).match(FIN_DEL_PROCESO, `El proceso ${nombreProceso} no terminó correctamente`);
    await cerrarPestana360(t);
};
