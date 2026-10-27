import { Selector } from 'testcafe';
import { cerrarPestana360, cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import { nuevoDocumento360 } from '../Funciones/HelpersDocumentos360.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC099 - TX 25: en Ubicación se ven Ref1, Ref2 y Ref3 y Ref3 acepta valores alfanuméricos (sin el aviso
 * "El campo Ref3 no debe contener letras ni caracteres"). No se guarda nada.
 */

const REFERENCIAS = [['Referencia1', 'a102'], ['Referencia2', 'b123'], ['Referencia3', 'c123']];
const campo = nombre => Selector(`#txtDocumento_${nombre} input.dx-texteditor-input, input#txtDocumento_${nombre}_Index, #txtDocumento_${nombre}_Index input.dx-texteditor-input`).nth(0);
const avisoRef3 = Selector('.dx-invalid-message, .erp-form-error__text').filterVisible()
    .withText(/El campo Ref3 no debe contener letras ni caractere/);

fixture `INC099 Referencia Encabezado Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC099 Referencia Encabezado', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await nuevoDocumento360(t, '25', '25 - VALIDACION CAMPOS');
    await t.click('#tabs_documento_Ubicacion');
    for (const [nombre, valor] of REFERENCIAS) {
        await t
            .expect(campo(nombre).with({ timeout: 10000 }).visible).ok(`No se muestra el campo ${nombre}`)
            .typeText(campo(nombre), valor, { replace: true })
            .pressKey('tab');
    }
    await t
        .wait(1000)
        .expect(avisoRef3.exists).notOk('El campo Ref3 no debe rechazar valores alfanuméricos');
    await cerrarPestana360(t);
    const confirmar = Selector('button.swal2-confirm').filterVisible();
    if (await confirmar.with({ timeout: 3000 }).exists) {
        await t.click(confirmar);
    }
    await cerrarSesion360(t);
});
