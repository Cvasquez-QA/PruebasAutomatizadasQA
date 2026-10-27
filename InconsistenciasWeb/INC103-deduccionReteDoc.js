import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { Selector } from 'testcafe';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    eliminarDocumentoActual360,
    elegirTerceroDocumento,
    guardarDocumento360,
    leerTotalesDocumento,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testHappgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC103 - Documento 01QA con tercero 811021438 y producto 01 por 252.000: la diferencia entre el neto y el total
 * debe ser igual a la Ret Ica. El documento se elimina.
 */

const redondear2 = valor => Math.round(valor * 100) / 100;

async function ejecutarPrueba360(t, config) {
    await ingresarAplicacion(t, config);
    await nuevoDocumento360(t, '01QA', /^\s*01QA -/i);
    await elegirTerceroDocumento(t, '811021438');
    await guardarDocumento360(t);
    let totales;
    try {
        await agregarLineaDocumento(t, '01', { cantidad: 1, valor: 252000 });
        await t
            .click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000)
            .expect(Selector('#txtDocumento_RetIca').exists).ok('No se encontró el campo Ret Ica en los totales del documento');
        totales = await leerTotalesDocumento();
    } finally {
        await eliminarDocumentoActual360(t);
        await cerrarPestana360(t);
    }
    const diferencia = redondear2(Math.abs(totales.neto - totales.total));
    await t
        .expect(diferencia).eql(redondear2(totales.retica),
            `|Neto (${totales.neto}) - Total (${totales.total})| = ${diferencia}, pero Ret Ica es ${totales.retica}`);
    await cerrarSesion360(t);
}

async function ejecutarPruebaHappgi(t, config) {
    await HelpersHappgi.ingresarAplicacion(t, config);
    await HelpersHappgi.abrirMovimiento(t, 'Documentos');
    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await HelpersHappgi.abrirTransaccion(t, '01QA');
    await t.click('#Documento_Tercero .dx-lookup-field');
    await HelpersHappgi.filtrarPor(t, 'hgi');
    await t
        .wait(2000)
        .click(HelpersHappgi.selectorOpcion('811021438'))
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', '01')
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '252000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(2000);
    const monto = async id => HelpersHappgi.parseValorNumerico(`#txtDocumento_${id} .dx-texteditor-input`);
    const diferencia = Math.abs(await monto('Neto') - await monto('Total'));
    const retIca = await monto('RetIca');
    await t.expect(diferencia).eql(retIca, `|Neto - Total| = ${diferencia}, pero Ret Ica es ${retIca}`);
    await HelpersHappgi.eliminarDocumento(t);
    await HelpersHappgi.cerrarPestana(t);
    await HelpersHappgi.cerrarSesion(t);
}

fixture `INC103 Deduccion Rete Doc - Test Happgi`
    .page(testHappgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC103 Deduccion Rete Doc - Test Happgi', async t => {
    await ejecutarPruebaHappgi(t, testHappgiAdminConfig);
});

fixture `INC103 Deduccion Rete Doc - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC103 Deduccion Rete Doc - Test Hgi360', async t => {
    await ejecutarPrueba360(t, testAdminConfig);
});
