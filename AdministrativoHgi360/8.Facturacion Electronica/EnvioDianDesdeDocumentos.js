import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';

const TX_DOCUMENTO = '01FE';
const TERCERO = '811021438';
const PRODUCTO = '010203';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientos360(t, 'Documentos');

    // Se crea el documento electrónico
    await t
        .wait(2000)
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field');
    await filtrarPor(t, TX_DOCUMENTO);
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t.click('#Documento_Tercero .dx-lookup-field');
    await filtrarPor(t, TERCERO);
    await t.wait(2000);
    await seleccionarOpcion(t, TERCERO);

    await t
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(3000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .click('#txtDocumento_Detalle_Cantidad_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_Cantidad_cursor_1', '1')
        .click('#txtDocumento_Detalle_ValorUnitario_cursor_1')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Detalle_ValorUnitario_cursor_1', '1000')
        .click('#txtDocumento_Detalle_Boton_1 .dx-icon.dx-icon-check')
        .wait(4000)
        .click('#BtnGuardarDocumento .dx-icon.dx-icon-save')
        .wait(7000);

    const numeroDocumento = await Selector('#txtDocumento .dx-texteditor-input').value;

    // Se envía el documento a la DIAN directamente desde el formulario de Documentos
    // (botón desplegable #BtnDian → opción "Enviar"), sin pasar por Facturación Electrónica > FACTURA E
    const opcionEnviar = Selector('.dx-overlay-content').filterVisible().find('div').withText('Enviar');

    await t
        .click('#BtnDian .dx-icon.dx-icon-spindown')
        .wait(1000)
        .click(opcionEnviar)
        .wait(8000);

    // No debe quedar un mensaje de error tras el envío
    await t
        .expect(Selector('.dx-toast-error').exists).notOk('El envío a la DIAN mostró un mensaje de error');

    // El botón de imprimir se habilita una vez el documento fue enviado/aceptado por la DIAN
    const botonImprimir = Selector('#BtnImprimirDocumento');
    const imprimirDeshabilitado = await botonImprimir.getAttribute('aria-disabled');
    await t.expect(imprimirDeshabilitado).notEql('true', `El documento ${numeroDocumento} no quedó habilitado para imprimir tras el envío a la DIAN`);

    // Verificación cruzada: el documento debe figurar como enviado en Facturación Electrónica > FACTURA E > Consultar
    await cerrarPestana360(t);
    await t
        .click(Selector('a').withText('Facturación Electrónica'))
        .click(Selector('span').withText('FACTURA E'))
        .click('#Documentos_Electronicos_Transaccion .dx-lookup-field');
    await filtrarPor(t, TX_DOCUMENTO);
    await t.wait(2000);
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t
        .click('#tabs_documento_Consulta')
        .click(Selector('#tabs_documento_electronico_content_Consulta span').withText('Consultar'))
        .wait(5000)
        .expect(Selector('#ListagridDocumentosElectronicosEnviados td').withText(numeroDocumento).exists)
        .ok(`No se encontró el documento ${numeroDocumento} en los documentos enviados a la DIAN`);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Envío a la DIAN desde Documentos - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Envío de documento a la DIAN desde Movimientos-Documentos - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `Prueba Envío a la DIAN desde Documentos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Envío de documento a la DIAN desde Movimientos-Documentos - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig);
});
