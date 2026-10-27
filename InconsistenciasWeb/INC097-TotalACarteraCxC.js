import { Selector } from 'testcafe';
import {
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    editarTransaccion360,
    filasReporte360,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    marcarCheckboxSiNoEsta,
    parseTextoNumerico
} from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    asegurarDependenciaDocumento360,
    eliminarDocumentoSiExiste360,
    elegirTerceroDocumento,
    guardarDocumento360,
    leerTotalesDocumento,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC097 - Con la TX 0101Doc como cuenta por cobrar con manejo de cuotas, el reporte Cartera X Edades debe mostrar
 * el TOTAL del documento (no el neto). Deja la TX como CxC con cuotas (igual que la prueba legacy). El documento se elimina.
 */

const TX = ['0101Doc', /^\s*0101Doc -/i];

fixture `INC097 Total a cartera CxC Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC097 Total a cartera CxC Admin - Test Hgi360', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await editarTransaccion360(t, TX[0], 'Cartera');
    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_CuentaCobrar');
    await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_IntManCuotas');
    await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_CuentaPagar');
    await guardarMaestro360(t, 'Transaccion');
    await cerrarPestana360(t);

    await nuevoDocumento360(t, TX[0], TX[1]);
    await elegirTerceroDocumento(t, '811021438');
    await asegurarDependenciaDocumento360(t);
    const numero = await guardarDocumento360(t);
    let filas = [];
    let totales = null;
    try {
        await agregarLineaDocumento(t, '01', { cantidad: 1 });
        await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
        totales = await leerTotalesDocumento();
        await cerrarPestana360(t);
        filas = await filasReporte360(t, 'Cartera', 'Cartera X Edades', numero);
        await cerrarPestana360(t);
    } finally {
        await nuevoDocumento360(t, TX[0], TX[1]);
        await eliminarDocumentoSiExiste360(t, TX[0], TX[1], numero);
    }
    await t.expect(filas.length).gt(0, `El documento ${numero} no aparece en Cartera X Edades`);
    const valores = filas[0].map(parseTextoNumerico);
    const descripcion = `fila del reporte: ${filas[0].join(' | ')}; total ${totales.total}, neto ${totales.neto}`;
    await t
        .expect(valores.includes(Math.trunc(totales.total))).ok(`El reporte no muestra el total del documento (${descripcion})`);
    await cerrarSesion360(t);
});
