import { Selector } from 'testcafe';
import {
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360,
    abrirMovimientos360,
    limpiarCacheChromeTestCafe
} from '../../Funciones/HelpersHgi360Legacy.js';
import { testPosConfig, hgiPosConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const FILTRO_TX = '01';
const TX_DOCUMENTO = '01H - FACTURA DE VENTA ELECTRÓNICA';
const FILTRO_TERCERO = 'hgi';
const TERCERO = '811021438 - HGI S.A.S - HGI S.A.S';
const PRODUCTO = '02';

fixture `Prueba FacturaE ERP POS - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Factura E POS ERP - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosConfig);

    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000);

    await filtrarPor(t, FILTRO_TX);
    await t.wait(2000);
    await seleccionarOpcion(t, TX_DOCUMENTO);

    await t
        .click('#txtDocumento')
        .typeText('#txtDocumento', testPosConfig.docFacturaE)
        .click(Selector('#Documento_Tercero .dx-lookup-field'));

    await filtrarPor(t, FILTRO_TERCERO);
    await t.wait(2000);
    await seleccionarOpcion(t, TERCERO);

    await t
        .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', testPosConfig.fecha)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000)
        .wait(3000)
        .click(Selector('a').withText('Facturación Electrónica'))
        .click(Selector('span').withText('FACTURA E'))
        .click('#Documentos_Electronicos_Transaccion .dx-lookup-field');

    await filtrarPor(t, FILTRO_TX);
    await t.wait(2000);
    await seleccionarOpcion(t, TX_DOCUMENTO);

    await t
        .click(Selector('#DocumentosElectronicosConsultaController span').withText('Cargar'))
        .wait(2000)
        .typeText('#ListagridDocumentosElectronicos .dx-texteditor-input', testPosConfig.docFacturaE)
        .wait(2000)
        .expect(Selector('#ListagridDocumentosElectronicos td').withText(testPosConfig.docFacturaE).exists)
        .ok('no existe el documento');

    await cerrarPestana360(t);

    await abrirMovimientos360(t, 'Documentos');
    await t
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1), testPosConfig.docFacturaE)
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .wait(3000)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'));

    await cerrarPestana360(t);

    await t
        .click(Selector('a').withText('Facturación Electrónica'))
        .click(Selector('span').withText('FACTURA E'))
        .click('#Documentos_Electronicos_Transaccion .dx-lookup-field');

    await filtrarPor(t, FILTRO_TX);
    await t.wait(2000);
    await seleccionarOpcion(t, TX_DOCUMENTO);

    await t
        .click(Selector('#DocumentosElectronicosConsultaController span').withText('Cargar'))
        .wait(2000)
        .typeText('#ListagridDocumentosElectronicos .dx-texteditor-input', testPosConfig.docFacturaE)
        .wait(2000)
        .click(Selector('#ListagridDocumentosElectronicos td').withText(testPosConfig.docFacturaE))
        .click(Selector('#BtnEnvioDian span').withText('ENVIAR'))
        .wait(5000)
        .click('#tabs_documento_Consulta')
        .click(Selector('#tabs_documento_electronico_content_Consulta span').withText('Consultar'))
        .wait(5000)
        .wait(2000)
        .expect(Selector('#ListagridDocumentosElectronicosEnviados td').withText(testPosConfig.docFacturaE).exists)
        .ok('No se encontró el documento enviado');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});

fixture `Prueba FacturaE ERP POS - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Factura E POS ERP - Hgi360 Pos', async t => {
    await ingresarAplicacion(t, hgiPosConfig);

    await abrirMovimientos360(t, 'Documentos');
    await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add')
        .click('#Documento_Transaccion .dx-lookup-field')
        .wait(3000);

    await filtrarPor(t, FILTRO_TX);
    await t.wait(2000);
    await seleccionarOpcion(t, TX_DOCUMENTO);

    await t
        .click('#txtDocumento')
        .typeText('#txtDocumento', hgiPosConfig.docFacturaE)
        .click(Selector('#Documento_Tercero .dx-lookup-field'));

    await filtrarPor(t, FILTRO_TERCERO);
    await t.wait(2000);
    await seleccionarOpcion(t, TERCERO);

    await t
        .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', hgiPosConfig.fecha)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .wait(3000)
        .wait(3000)
        .click(Selector('a').withText('Facturación Electrónica'))
        .click(Selector('span').withText('FACTURA E'))
        .click('#Documentos_Electronicos_Transaccion .dx-lookup-field');

    await filtrarPor(t, FILTRO_TX);
    await t.wait(2000);
    await seleccionarOpcion(t, TX_DOCUMENTO);

    await t
        .click(Selector('#DocumentosElectronicosConsultaController span').withText('Cargar'))
        .wait(2000)
        .typeText('#ListagridDocumentosElectronicos .dx-texteditor-input', hgiPosConfig.docFacturaE)
        .wait(2000)
        .expect(Selector('#ListagridDocumentosElectronicos td').withText(hgiPosConfig.docFacturaE).exists)
        .ok('no existe el documento');

    await cerrarPestana360(t);

    await abrirMovimientos360(t, 'Documentos');
    await t
        .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
        .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1), hgiPosConfig.docFacturaE)
        .wait(3000)
        .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
        .wait(2000)
        .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
        .pressKey('enter')
        .wait(3000)
        .click(Selector('#BtnGuardarDocumento div').withText('Guardar'));

    await cerrarPestana360(t);

    await t
        .click(Selector('a').withText('Facturación Electrónica'))
        .click(Selector('span').withText('FACTURA E'))
        .click('#Documentos_Electronicos_Transaccion .dx-lookup-field');

    await filtrarPor(t, FILTRO_TX);
    await t.wait(2000);
    await seleccionarOpcion(t, TX_DOCUMENTO);

    await t
        .click(Selector('#DocumentosElectronicosConsultaController span').withText('Cargar'))
        .wait(2000)
        .typeText('#ListagridDocumentosElectronicos .dx-texteditor-input', hgiPosConfig.docFacturaE)
        .wait(2000)
        .click(Selector('#ListagridDocumentosElectronicos td').withText(hgiPosConfig.docFacturaE))
        .click(Selector('#BtnEnvioDian span').withText('ENVIAR'))
        .wait(5000)
        .click('#tabs_documento_Consulta')
        .click(Selector('#tabs_documento_electronico_content_Consulta span').withText('Consultar'))
        .wait(5000)
        .wait(2000)
        .expect(Selector('#ListagridDocumentosElectronicosEnviados td').withText(hgiPosConfig.docFacturaE).exists)
        .ok('No se encontró el documento enviado');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
