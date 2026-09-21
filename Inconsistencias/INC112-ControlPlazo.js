import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    abrirMovimientos360,
    abrirTransaccion,
    cerrarPestana360,
    cerrarSesion360,
    mostrarMenu360,
    ingresarAplicacion,
    TERCERO,
    TX_DOCUMENTO,
} from '../../Funciones/HelpersHgi360.js';
import { hgi360AdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const PLAZO_MAXIMO = '32767';
const PLAZO_EXCEDENTE = '32768';
const PLAZO_EXCESIVO = '99999999999';
const PLAZO_VALIDO = '2';
const MSG_PLAZO_DOCUMENTO = 'El plazo no puede ser mayor a 32767 dÃ­as';

const inputPlazoDocumento = Selector('#txtDocumento_Plazo .dx-texteditor-input');
const inputPlazoTercero = Selector('#txtTercero_Plazo .dx-texteditor-input');
const inputFiltroTerceros = Selector('#gridTerceros .dx-texteditor-input').nth(1);
const btnEditarTercero = Selector('#gridTerceros [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1);

const ingresarPlazoTercero = async (t, valor) => {
    await t
        .click(inputPlazoTercero)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(inputPlazoTercero, valor)
        .pressKey('enter');
};

const validarPlazoDocumento = async t => {
    await abrirMovimientos360(t, 'Documentos');

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, TX_DOCUMENTO);


    await t
        .click(inputPlazoDocumento, { caretPos: 0 })
        .click(inputPlazoDocumento, { caretPos: 0 })
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(inputPlazoDocumento, PLAZO_EXCEDENTE)
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        .expect(
            Selector('.dx-overlay-content.dx-toast-error.dx-toast-content div')
                .withText(MSG_PLAZO_DOCUMENTO)
                .visible
        ).ok(`Se esperaba: ${MSG_PLAZO_DOCUMENTO}`);

    await cerrarPestana360(t);
};

const validarPlazoTercero = async t => {
    await mostrarMenu360(t);
    await abrirMaestros360(t, 'Terceros', 'terceros');

    await t
        .typeText(inputFiltroTerceros, TERCERO)
        .wait(2000)
        .expect(Selector('#gridTerceros td').withText(TERCERO).exists).ok(
            `No se encontrÃ³ el tercero ${TERCERO}`
        )
        .click(btnEditarTercero);

    await ingresarPlazoTercero(t, PLAZO_EXCEDENTE);
    await t.expect(inputPlazoTercero.value).eql(PLAZO_MAXIMO);

    await ingresarPlazoTercero(t, PLAZO_EXCESIVO);
    await t.expect(inputPlazoTercero.value).eql(PLAZO_MAXIMO);

    await ingresarPlazoTercero(t, PLAZO_VALIDO);
    await t.click(Selector('#BtnGuardarTercero div').withText('Guardar'));
};

const ejecutarPrueba = async (t, config) => {
    await ingresarAplicacion(t, config);
    await validarPlazoDocumento(t);
    await t.wait(2000);
    await validarPlazoTercero(t);
    await cerrarSesion360(t);
};

fixture `INC112 Control plazo - Test Hgi360 Admin`
    .page(testAdminConfig.pagina);

test('INC112 Control plazo - Test Hgi360 Admin', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});

fixture `INC112 Control plazo - Hgi360 Admin`
    .page(hgi360AdminConfig.pagina);

test('INC112 Control plazo - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgi360AdminConfig);
});
