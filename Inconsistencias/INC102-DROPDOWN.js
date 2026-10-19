import { Selector } from 'testcafe';
import {
    abrirMaestros360 as abrirMaestros,
    cerrarPestana360 as cerrarPestana,
    cerrarSesion360 as cerrarSesion,
    ingresarAplicacion,
    selectorOpcion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const DEPARTAMENTO = '05 - ANTIOQUIA';

fixture `INC102 DROPDOWN testAdmin HGI360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC102 DROPDOWN', async t => {
    await ingresarAplicacion(t, testAdminConfig);
    await abrirMaestros(t, 'Ciudades');

    await t
        .click('#gridCiudades .dx-icon.dx-icon-add')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('enter')
        .pressKey('0')
        .expect(selectorOpcion(DEPARTAMENTO).visible)
        .ok(`No se muestra la opción "${DEPARTAMENTO}" en el dropdown`);

    await cerrarPestana(t);
    await cerrarSesion(t);
});
