import { Selector } from 'testcafe';
import {
    seleccionarOpcion,
    ingresarAplicacion,
    abrirMaestros360,
    eliminarRegistroSiExiste,
    cerrarSesion360,
    cerrarPestana360,
    eliminarRegistroDesdeGrid,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'MICIUDAD';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';
const ZONA = '05 - ANTIOQUIA';
const DANE_CIUDAD = '13006 - ACHÍ';
const PAIS = 'MIPAIS';
const PAIS_ISO = 'AF - Afganistán';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Ciudades', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridCiudades', CODIGO);
        await t
            .click('#gridCiudades .dx-icon.dx-icon-add')
            .typeText('#txtCiudad_Idfocus', CODIGO)
            .typeText('#txtCiudad_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#txtCiudad_Zonas .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, ZONA);
    await t
            .click(Selector('#txtCiudad_Dane_Ciudad .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, DANE_CIUDAD);
    await t
            .typeText('#txtCiudad_Dane_Pais .dx-texteditor-input', PAIS)
            .click(Selector('#txtCiudad_Dane_PaisIso .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, PAIS_ISO);
    await t
            .click(Selector('#BtnGuardarCiudad span').withText('Guardar'))
            .wait(3000)
            .expect(Selector('#gridCiudades td').withText(CODIGO).exists).ok()
            .click(Selector('#gridCiudades [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click('#txtCiudad_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCiudad_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarCiudad div').withText('Guardar'))
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridCiudades');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Ciudades - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Ciudades Test Hgi360 CRUD - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Ciudades - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Ciudades CRUD - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
