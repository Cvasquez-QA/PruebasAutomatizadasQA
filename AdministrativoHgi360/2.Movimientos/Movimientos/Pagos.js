import { Selector } from 'testcafe';
import {
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    crearDocumento360,
    eliminarDocumento360,
    filtrarPor,
    ingresarAplicacion,
    parseValorNumerico,
    seleccionarOpcion,
    TERCERO,
    TERCERO_TEXTO
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';
const FILTRO_FECHA = Selector('#gridCartera [role="columnheader"]').withText('Fecha');
const TX_PAGO = 'RECIBO DE CAJA';
const FORMA_PAGO = '01';
const BANCO = '01';
const NATURALEZA = '1';

async function ejecutarPruebaPagoscopy(t, config) {
    await ingresarAplicacion(t, config);
        const { valorDocumento, numeroDocumento } = await crearDocumento360(t);
        await abrirMovimientos360(t, 'Pagos');
        await t
            .click('#ListagridDocumentosPago .dx-icon.dx-icon-add')
            .wait(2000)
            .click('#TxtDocumentosPago_Transaccion .dx-lookup-field')
            ;
    await seleccionarOpcion(t, TX_PAGO);
    await t
            .click('#TxtDocumentosPago_Tercero .dx-lookup-field');
        await filtrarPor(t, TERCERO);
        await seleccionarOpcion(t, TERCERO_TEXTO);
        await t
            .click('#BtnGrabarDocumentosPago .dx-icon.dx-icon-save')
            .wait(3000)
            .click(FILTRO_FECHA)
            .wait(2000)
            .click(FILTRO_FECHA);

        const filaDocumento = Selector('#gridCartera tr').withText(numeroDocumento);

        await t
            .expect(filaDocumento.exists).ok(`No se encontró el documento ${numeroDocumento}`)
            .click(filaDocumento.find('[class^="dx-button-mode-contained dx-link dx-link-download"], a, i, button').nth(0))
            .wait(2000)
            .expect(Selector('#txtdocumento_documento_pago_cursor_1').value).eql(numeroDocumento)
            .typeText('#txtDocPago_Banco_FormaPago_cursor_1', FORMA_PAGO)
            .pressKey('enter')
            .typeText('#txtDocPago_Banco_Banco_cursor_1', BANCO)
            .pressKey('enter')
            .typeText('#txtdocumento_DocRef_pago_DocRef_cursor_1', numeroDocumento)
            .pressKey('enter')
            .typeText('#txtDocPago_Banco_Naturaleza_cursor_1', NATURALEZA)
            .pressKey('enter')
            .typeText('#txtdocumento_banco_pago_Valor_cursor_1', String(valorDocumento))
            .pressKey('enter')
            .pressKey('enter')
            .wait(2000)
            .wait(10000);
        const diferencia = await parseValorNumerico('#TxtDocumentosPago_Diferencia .dx-texteditor-input');

        await t.expect(diferencia).eql(0, 'La diferencia del pago debe ser 0');

        await t
            .click(Selector('#BtnGrabarDocumentosPago div').withText('Guardar'))
            .wait(2000)
            .click(Selector('#BtnAnularDocumentosPago').find('div, span').withText('Eliminar'))
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
        await cerrarPestana360(t);
        await eliminarDocumento360(t, numeroDocumento);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `CRUD_Pagos_copy - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD Pago - Recibo de Caja - Test Hgi360', async t => {
    await ejecutarPruebaPagoscopy(t, testAdminConfig);
});

fixture `CRUD_Pagos_copy - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD Pago - Recibo de Caja - Hgi360 Admin', async t => {
    await ejecutarPruebaPagoscopy(t, hgiAdminConfig);
});
