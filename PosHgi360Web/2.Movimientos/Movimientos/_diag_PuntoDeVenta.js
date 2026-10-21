import { ClientFunction } from 'testcafe';
import { ingresarAplicacion } from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { abrirPuntoDeVenta360, elegirTransaccionPV, salirPuntoDeVenta360 } from '../../../Funciones/HelpersPos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Diagnóstico temporal: no es una prueba. Escribe en consola los ids de la pantalla del Punto de Venta.
const ids = ClientFunction(() => {
    const vis = e => e && e.getClientRects().length > 0;
    const todos = [...document.querySelectorAll('[id*="PuntoDeVenta"]')].filter(vis);
    const detalle = todos.filter(e => /Detalle/i.test(e.id)).map(e => `${e.id}<${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' && e.className.includes('dx-texteditor-input') ? ' input-dx' : ''}>`);
    const inputs = [...document.querySelectorAll('input')].filter(vis).map(e => `${e.id || '(sin id)'}|${e.closest('[id]') ? e.closest('[id]').id : ''}|ph=${e.placeholder || ''}`);
    const act = document.activeElement;
    return {
        detalle,
        inputs,
        activo: act ? `${act.tagName} id=${act.id} padre=${act.closest('[id]') ? act.closest('[id]').id : ''}` : '',
        botones: todos.filter(e => /^PuntoDeVenta_Btn|^BtnPuntoDeVenta/.test(e.id)).map(e => e.id),
        total: (document.querySelector('#PuntoDeVenta_Total') || {}).outerHTML ? document.querySelector('#PuntoDeVenta_Total').outerHTML.slice(0, 400) : 'sin #PuntoDeVenta_Total'
    };
});

fixture `Diagnostico Punto de Venta`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => { await prepararNavegador360(t, testPosWebConfig.pagina); })
    .afterEach(async t => { await limpiarCache360(t); });

test('Diagnostico ids Punto de Venta', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirPuntoDeVenta360(t);
    console.log('ANTES DE TRANSACCION', JSON.stringify(await ids(), null, 1));
    await elegirTransaccionPV(t);
    await t.wait(4000);
    console.log('DESPUES DE TRANSACCION', JSON.stringify(await ids(), null, 1));
    await salirPuntoDeVenta360(t);
});
