import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    abrirMovimientos360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig, miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';


const COMPROBANTE = 'INGRESOS';
const NUMERO_DOCUMENTO = '8';
const ARCHIVO_IMPORTAR = '..\\..\\..\\..\\_uploads_\\ExportacionContable.csv';
const campoComprobante = Selector('#filtros_ConDocumento_Comprobante');
const filtroComprobante = Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input');
const opcionIngresos = Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-checkbox-icon');
const avisoImportacion = Selector('#swal2-html-container, .swal2-html-container.erp-swal-message');

async function consultarDocumentoIngresos(t) {
    await abrirMovimientos360(t, 'Documentos');
    await t
        .expect(campoComprobante.with({ timeout: 15000 }).exists).ok(
            'No apareció el filtro de comprobante (¿se abrió Documentos de Contable?)'
        )
        .click(campoComprobante.find('.dx-dropdowneditor-icon'))
        .typeText(filtroComprobante, 'ingresos', { replace: true })
        .wait(1000)
        .click(opcionIngresos)
        .click(Selector('span').withText('Aceptar'))
        .typeText('#filtros_ConDocumento_NumeroConDocumento .dx-texteditor-input', NUMERO_DOCUMENTO, { replace: true })
        .click(Selector('#BtnConsultarConDocumento span').withText('Consultar'));
}

async function ejecutarPruebaImportarExportar(t, config) {
    await ingresarAplicacion(t, config);

    // Eliminar el documento 8 de INGRESOS
    await consultarDocumentoIngresos(t);
    await t
    if (await Selector('[data-tooltip="Ver"] .erp-grid-action-glyph').exists) {
        await t.click(Selector('[data-tooltip="Ver"] .erp-grid-action-glyph'))
        .click(Selector('#PnlGestionConDocumentos span').withText('Eliminar'))
        .click(Selector('button').withText('Eliminar'));
    }
    await cerrarPestana360(t);

    // Exportar INGRESOS y volver a importar el archivo
    await abrirHerramientas360(t, 'Importar/Exportar');
    await t
        .click(Selector('#RgrTipoOperacion .dx-radiobutton-icon-dot').nth(1))
        .click('#CmbComprobante .dx-lookup-field');
    await seleccionarOpcion(t, COMPROBANTE);
    await t
        .click('#BtnGenerar .dx-icon.dx-icon-preferences')
        //.expect(Selector('.erp-busy-overlay div').withText('Exportando…').visible).ok('No inició la exportación')
        .click(Selector('#RgrTipoOperacion .dx-radiobutton-icon-dot').nth(0))
        .click('#LinkExaminarImportarExportarCon')
        .setFilesToUpload('#InputArchivoImportar', [ARCHIVO_IMPORTAR])
        .click('#BtnGenerar .dx-icon.dx-icon-preferences')
        .click(Selector('button').withText('Aceptar'))
        .expect(avisoImportacion.with({ timeout: 30000 }).visible).ok('No apareció el resultado de la importación')
        .click(Selector('button').withText('Aceptar'));
    await cerrarPestana360(t);

    // Validar que el documento 8 volvió a quedar
    await consultarDocumentoIngresos(t);
    await t
        .expect(Selector('td').withText(NUMERO_DOCUMENTO).visible)
        .ok(`No se encontró el documento ${NUMERO_DOCUMENTO} después de importar`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}
/*
async function ejecutarPruebaHerramientasContabilidad(t, config) {
    await ingresarAplicacion(t, config);
        await abrirHerramientas360(t, 'Contabilidad');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            //
            .click(Selector('#TxtContabilidad_Transaccion .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, TRANSACCION);
    await t
            //.click('#txtContabilidad_Grupo .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtContabilidad_Grupo .dx-texteditor-input', GRUPO)
            .click(Selector('#BtnContabilidad_Generar span').withText('Generar'))
            .expect(Selector('#swal2-content').innerText).eql(MENSAJE_PROCESO_FINALIZADO,'Ocurrió algun error')
            .click(Selector('button').withText('Aceptar').nth(1))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}
*/
fixture `Herramientas-Importar/Exportar - Test Hgi360 Contable`
    .page(miContableConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Importar/Exportar Contable - Test Hgi360', async t => {
    await ejecutarPruebaImportarExportar(t, miContableConfig);
});