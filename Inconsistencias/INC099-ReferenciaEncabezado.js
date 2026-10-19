import { Selector } from 'testcafe';
import {
    abrirMovimientos360 as abrirMovimiento,
    abrirTransaccion,
    cerrarPestana360 as cerrarPestana,
    cerrarSesion360 as cerrarSesion,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO_TRANSACCION = '25';
const REFERENCIA_1 = 'a102';
const REFERENCIA_2 = 'b123';
const REFERENCIA_3 = 'c123';

const campoReferencia1 = Selector('#txtDocumento_Referencia1_Index');
const campoReferencia2 = Selector('#txtDocumento_Referencia2_Index');
const campoReferencia3 = Selector('#txtDocumento_Referencia3_Index');
const modalValidacion = Selector('#modal_Documento_validacion');
const mensajeReferencia1Requerida = Selector('#summary_documento div')
    .withText('El campo Ref1 es requerido');
const mensajeReferencia3Invalida = Selector('.dx-overlay-wrapper.dx-invalid-message')
    .find('div')
    .withText(/El campo Ref3 no debe contener letras ni caractere/);

fixture `INC099 Referencia Encabezado testAdmin HGI360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC099 Referencia Encabezado', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMovimiento(t, 'Documentos');

    await t.click('#ListagridDocumentos .dx-icon.dx-icon-add');
    await abrirTransaccion(t, CODIGO_TRANSACCION);
    await t
        .click('#tabs_documento_Ubicacion')
        .expect(campoReferencia1.visible).ok('No se muestra el campo Ref1')
        .expect(campoReferencia2.visible).ok('No se muestra el campo Ref2')
        .expect(campoReferencia3.visible).ok('No se muestra el campo Ref3')
        .click(Selector('#BtnGuardarDocumento span').withText('Guardar'))
        //.expect(mensajeReferencia1Requerida.visible)
        //.notOk('El campo Ref1 se está validando como obligatorio');

    if (await modalValidacion.visible) {
        await t.click(modalValidacion.find('button').withText('×'));
    }

    await t
        .typeText(campoReferencia1, REFERENCIA_1)
        .typeText(campoReferencia2, REFERENCIA_2)
        .typeText(campoReferencia3, REFERENCIA_3)
        .pressKey('enter')
        .doubleClick(Selector('#tabs_documento_content_Ubicacion div').withText('Ref1').nth(1))
        .expect(mensajeReferencia3Invalida.visible)
        .notOk('El campo Ref3 no debe rechazar valores alfanuméricos');

    await cerrarPestana(t);
    await cerrarSesion(t);
});
