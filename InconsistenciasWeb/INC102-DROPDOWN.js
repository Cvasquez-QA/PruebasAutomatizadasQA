import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    nuevoRegistroGrid360
} from '../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/** INC102 - Maestro Ciudades, registro nuevo: el desplegable de Departamento muestra "05 - ANTIOQUIA". No se guarda nada. */

const DEPARTAMENTO = '05 - ANTIOQUIA';

fixture `INC102 DROPDOWN Admin - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC102 DROPDOWN', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMaestros360(t, 'Ciudades', 'localizacion');
    await nuevoRegistroGrid360(t, 'gridCiudades');
    const departamento = Selector('[id*="Departamento"] .dx-lookup-field, [id*="Departamento"] .dx-dropdowneditor-input-wrapper').filterVisible();
    await t
        .expect(departamento.with({ timeout: 15000 }).exists).ok('No se encontró el campo Departamento de la ciudad')
        .click(departamento.nth(0))
        .expect(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText(DEPARTAMENTO).with({ timeout: 10000 }).exists)
        .ok(`No se muestra la opción "${DEPARTAMENTO}" en el dropdown`)
        .pressKey('esc');
    const cancelar = Selector('[id^="BtnCancelar"]').filterVisible();
    if (await cancelar.exists) {
        await t.click(cancelar.nth(0));
    }
    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
