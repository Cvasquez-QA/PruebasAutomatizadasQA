import { Selector } from 'testcafe';
import {
    abrirMaestros360 as abrirMaestros,
    cerrarPestana360 as cerrarPestana,
    cerrarSesion360 as cerrarSesion,
    ingresarAplicacion,
    selectorOpcion,
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';

const DEPARTAMENTO = '05 - ANTIOQUIA';

fixture `INC102 DROPDOWN testAdmin HGI360`
    .page(testAdminConfig.pagina);

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
