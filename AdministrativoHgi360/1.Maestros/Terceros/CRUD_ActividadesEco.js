import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const CODIGO = 'pruebaCodigoActividadEco';
const DESCRIPCION = 'descActividadEco';
const DESCRIPCION_EDIT = 'nuevaDescActividadEco';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Actividades Eco', 'terceros');
        await eliminarRegistroSiExiste(t, '#gridActividadesEconomicas', CODIGO);
        await t
            .click(Selector('#gridActividadesEconomicas .dx-icon.dx-icon-add'))
            .typeText('#txtStrIdActividadEco', CODIGO)
            .typeText('#txtActividadEconomica_Descripcion', DESCRIPCION)
            .click(Selector('#BtnGuardarActividadEconomica span').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridActividadesEconomicas td').withText(CODIGO).exists).ok()
            .click(Selector('#gridActividadesEconomicas [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtActividadEconomica_Descripcion')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtActividadEconomica_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarActividadEconomica span').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridActividadesEconomicas');;
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba ActividadesEco - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba CRUD ActividadesEco Test Hgi360 - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba ActividadesEco - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba CRUD ActividadesEco - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
