import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
//import { testHappgiConfig } from '../ParametrosPruebas/ParametrosPruebas.js'; 
import { Selector, ClientFunction } from 'testcafe';
import { abrirTransaccion, limpiarCacheChromeTestCafe, abrirMovimiento } from '../Funciones/HelpersHgi360Legacy.js';

const CODIGO_TRANSACCION = '25';


fixture `Prueba Documento Pago Admin en Contable ERPWeb`
    .page (testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Contabilización en linea Pago creado en Administrativo ERPWeb', async t => {
    const forceSameTab = ClientFunction(() => {
    window.open = function (url) {
        if (url) {
        window.location.href = url;   // fuerza navegación en la misma pestaña
        }
        return null;
    };
    });
    await t
  //Se ingresa al aplicativo
        .typeText('#TxtEmpresaIdentificacion .dx-texteditor-input', testAdminConfig.empresa)    
        .typeText('#TxtUsuarioCodigo .dx-texteditor-input', testAdminConfig.usuario)
        .typeText('#TxtUsuarioClave .dx-texteditor-input', testAdminConfig.clave)
        .click(Selector('#buttonAutenticar div').withText('Ingresar'))
        .wait(3000);
    //Se ingresa al maestro de Contratos
        await abrirMovimiento(t, 'Documentos');
    await t
        .click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, CODIGO_TRANSACCION);
    await t
        .click('#txtDocumento')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtDocumento'),'2147483648')
        .pressKey('enter')
        .expect((Selector('div').withText('El número de documento supera el valor permitido').nth(2)).exists).ok('El mensaje es diferente o no se muestra')
        .switchToMainWindow()
        .click('#TabsMenu .dx-icon.dx-icon-close');
    //PRUEBA EN PV
        await abrirMovimiento(t, 'Punto de Venta');
    await t
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('.dx-list-item').withText(testPosConfig.caja))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        if(await Selector('.swal2-content div').withText('Desea cerrar la operación de esta caja?').exists){
            await t
            .click(Selector('button').withText('Aceptar').nth(1))
        }
        //.expect(Selector('.swal2-content div').withText('Desea cerrar la operación de esta caja?').exists).notOk('Está saliendo un mensaje emergente')
        await t
        .wait(3000)
        .click('#PuntoDeVenta_Transaccion .dx-lookup-field')
        .click(Selector('#.dx-list.item').withText('0101 - PRUEBA FACTURA PUNTO DE VENTA'))
        .click('#txtPuntoDeVenta_DocumentoNew .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(Selector('#txtPuntoDeVenta_DocumentoNew'),'2147483648')
        .pressKey('enter')
        .expect((Selector('div').withText('El número de documento supera el valor permitido').nth(2)).exists).ok('El mensaje es diferente o no se muestra')
        .click(Selector('#PuntoDeVenta_BtnSalir span').withText('Salir'))
    //Se cierra sesión
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('#divpanelmaster').nth(1).find('a').withText('Cerrar'))
});

/*
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++
*/






