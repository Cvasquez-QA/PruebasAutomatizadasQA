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

const FILTRO_TX = '01';
const TX_DOCUMENTO = '01H - FACTURA DE VENTA ELECTRÓNICA';
const FILTRO_TERCERO = 'hgi';
const TERCERO = '811021438 - HGI S.A.S - HGI S.A.S';
const PRODUCTO = '02';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMovimientos360(t, 'Documentos');
        await t
            .click('#ListagridDocumentos .dx-icon.dx-icon-add')
            .click('#Documento_Transaccion .dx-lookup-field')
            .wait(3000);
    
        await filtrarPor(t, FILTRO_TX);
        await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t
            .click('#txtDocumento')
            .typeText('#txtDocumento', config.docFacturaE)
            .click(Selector('#Documento_Tercero .dx-lookup-field'));
    
        await filtrarPor(t, FILTRO_TERCERO);
        await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TERCERO);
    await t
            .click('#txtDocumento_Fecha_Vence .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', config.fecha)
            .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
            .wait(3000);
    
        await cerrarPestana360(t);
        await t
            .click(Selector('a').withText('Facturación Electrónica'))
            .click(Selector('span').withText('FACTURA E'))
            .click('#Documentos_Electronicos_Transaccion .dx-lookup-field');
    
        await filtrarPor(t, FILTRO_TX);
        await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t
            .click(Selector('#DocumentosElectronicosConsultaController span').withText('Cargar'))
            .wait(2000)
            .typeText('#ListagridDocumentosElectronicos .dx-texteditor-input', config.docFacturaE)
            .wait(2000)
            .expect((Selector('#ListagridDocumentosElectronicos td').withText(config.docFacturaE)).exists).ok('no existe el documento');
    
        await cerrarPestana360(t);
        await abrirMovimientos360(t, 'Documentos');
        await t
            .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
            .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1), config.docFacturaE)
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
        await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TX_DOCUMENTO);
    await t
            .click(Selector('#DocumentosElectronicosConsultaController span').withText('Cargar'))
            .wait(2000)
            .typeText('#ListagridDocumentosElectronicos .dx-texteditor-input', config.docFacturaE)
            .wait(2000)
            .click(Selector('#ListagridDocumentosElectronicos td').withText(config.docFacturaE))
            .click(Selector('#BtnEnvioDian span').withText('ENVIAR'))
            .wait(5000)
            .click('#tabs_documento_Consulta')
            .click(Selector('#tabs_documento_electronico_content_Consulta span').withText('Consultar'))
            .wait(5000)
            .expect((Selector('#ListagridDocumentosElectronicosEnviados td').withText(config.docFacturaE)).exists).ok('No se encontró el documento enviado');
    
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba FacturaE - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Factura E Admin Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba FacturaE - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Factura E Admin Hgi360 - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
