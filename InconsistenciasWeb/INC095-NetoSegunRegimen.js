import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    guardarMaestro360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    marcarCheckboxSiNoEsta
} from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    eliminarDocumentoActual360,
    elegirTerceroDocumento,
    guardarDocumento360,
    leerTotalesDocumento,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC095 - El neto del pedido (TX 07) no debe quedar en 0 ni con un tercero responsable de IVA (811021438) ni con
 * uno no responsable (71794230). Deja a cada tercero con su régimen y las responsabilidades 05, 07 y 35 marcadas
 * (misma configuración que dejaba la prueba legacy). Los pedidos se eliminan.
 */

const TERCEROS = [
    { codigo: '811021438', regimen: 'Impuesto sobre las ventas - IVA' },
    { codigo: '71794230', regimen: 'No responsable de IVA' }
];

async function configurarTercero(t, { codigo, regimen }) {
    await abrirMaestros360(t, 'Terceros', 'terceros');
    await buscarEnGrid360(t, 'gridTerceros', codigo);
    await t.wait(3000);
    await accionFilaGrid360(t, 'gridTerceros', codigo, 'Editar');
    await t.click(Selector('#tabs_tercero_Tributaria').with({ timeout: 15000 })).wait(1000);
    await elegirEnLookup360(t, '#txtTercero_Regimen_Ventas', regimen);
    for (const resp of ['Resp05', 'Resp07', 'Resp35']) {
        await t.expect(Selector(`#txtTercero_${resp}`).exists).ok(`No está la responsabilidad ${resp} del tercero`);
        await marcarCheckboxSiNoEsta(t, `#txtTercero_${resp}`);
    }
    await guardarMaestro360(t, 'Tercero');
    await cerrarPestana360(t);
}

async function netoDelPedido(t, tercero) {
    await nuevoDocumento360(t, '07', /^\s*07 -/);
    await elegirTerceroDocumento(t, tercero);
    await guardarDocumento360(t);
    try {
        await agregarLineaDocumento(t, '01', { cantidad: 1 });
        await t.wait(3000);
        return (await leerTotalesDocumento()).neto;
    } finally {
        await eliminarDocumentoActual360(t);
        await cerrarPestana360(t);
    }
}

fixture `INC095 Neto segun regimen Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC095 Neto segun regimen Admin - Test Hgi360', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    const netos = {};
    for (const tercero of TERCEROS) {
        await configurarTercero(t, tercero);
    }
    for (const { codigo } of TERCEROS) {
        netos[codigo] = await netoDelPedido(t, codigo);
    }
    for (const { codigo, regimen } of TERCEROS) {
        await t.expect(netos[codigo]).notEql(0, `El neto del pedido con el tercero ${codigo} (${regimen}) quedó en 0`);
    }
    await cerrarSesion360(t);
});
