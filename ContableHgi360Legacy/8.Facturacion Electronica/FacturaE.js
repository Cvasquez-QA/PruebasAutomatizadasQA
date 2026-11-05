import { Selector } from 'testcafe';
import { cerrarSesion360, filtrarPor, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 

const FILTRO_TX = '01';
const TX_DOCUMENTO = '01H - FACTURA DE VENTA ELECTRÓNICA';
const FILTRO_TERCERO = 'hgi';
const TERCERO = '811021438 - HGI S.A.S - HGI S.A.S';
const PRODUCTO = '02';


async function ejecutarPruebaFacturaE(t, config) {
    //Se ingresa al aplicativo
        await ingresarAplicacion(t, testContableConfig);
    //Se crea el documento sin detalle
        await t
            .click(Selector('a').withText('Movimiento'))
            .click(Selector('a').withText('DOCUMENTOS'))
            .wait(1500)
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
        //Se adiciona un documento
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
            .typeText('#txtDocumento', testContableConfig.docFacturaE)
    
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
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input',testContableConfig.fecha)
            
            .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
            .wait(3000)
    
        //    .click('#BtnDian .dx-icon.dx-icon-spindown')
        //    .click(Selector('.dx-item.dx-list-item div').withText('Enviar'))
        //    .click(Selector('button').withText('Aceptar').nth(1))
            .wait(3000)
    
        //Se ingresa a FacturaE para validar que si esté
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
            .typeText('#ListagridDocumentosElectronicos .dx-texteditor-input', testContableConfig.docFacturaE)
            .wait(2000)
            .expect((Selector('#ListagridDocumentosElectronicos td').withText(testContableConfig.docFacturaE)).exists).ok('no existe el documento');
            await cerrarPestana360(t);
        //Se edita el documento agregandole el detalle
    
            await t
            .click(Selector('a').withText('Movimiento'))
            .click(Selector('span').withText('DOCUMENTOS'))
            .click(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1))
            .typeText(Selector('#ListagridDocumentos .dx-texteditor-input').nth(1), testContableConfig.docFacturaE)
            .wait(3000)
            .click('#ListagridDocumentos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]')
            .wait(2000)
            .typeText('#txtDocumento_Detalle_Producto_cursor_1', PRODUCTO)
            .pressKey('enter')
            .wait(3000)
            .click(Selector('#BtnGuardarDocumento div').withText('Guardar'));
        await cerrarPestana360(t);
        //Se vuelve a enviar desde factura E
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
            .typeText('#ListagridDocumentosElectronicos .dx-texteditor-input', testContableConfig.docFacturaE)
            .wait(2000)
            .click(Selector('#ListagridDocumentosElectronicos td').withText(testContableConfig.docFacturaE))
            .click(Selector('#BtnEnvioDian span').withText('ENVIAR'))
        //Se valida que se haya enviado correctamente
            .wait(5000)
            .click('#tabs_documento_Consulta')
            .click(Selector('#tabs_documento_electronico_content_Consulta span').withText('Consultar'))
            .wait(5000)
            //.typeText('#ListagridDocumentosElectronicosEnviados .dx-texteditor-input', testContableConfig.docFacturaE)
            .wait(2000)
            .expect((Selector('#ListagridDocumentosElectronicosEnviados td').withText(testContableConfig.docFacturaE)).exists).ok('No se encontró el documento enviado');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `FacturaE - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Factura E POS ERP - Mi ERP', async t => {
    await ejecutarPruebaFacturaE(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `FacturaE - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Factura E POS ERP - Test Contable', async t => {
    await ejecutarPruebaFacturaE(t, testContableConfig, ingresarAplicacion);
});
