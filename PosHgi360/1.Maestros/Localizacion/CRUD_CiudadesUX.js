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
import { testPosConfig, hgiPosConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO = 'MICIUDAD';
const DESCRIPCION = 'MIDESCRIPCION';
const DESCRIPCION_EDIT = 'MINUEVADESCRIPCION';
const ZONA = '05 - ANTIOQUIA';
const DANE_CIUDAD = '13006 - ACHÍ';
const PAIS = 'MIPAIS';
const PAIS_ISO = 'AF - Afganistán';
async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Ciudades', 'localizacion');
        await eliminarRegistroSiExiste(t, '#gridCiudades', CODIGO);
        await t
            .click('#gridCiudades .dx-icon.dx-icon-add')
        //Se comienza con la inserción de datos para la creación de la ciudad
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
            //El sistema NO permite guardar una Ciudad sin zona
    //Se valida la creación
            .wait(3000)
            .expect(Selector('#gridCiudades td').withText(CODIGO).exists).ok()
    //Se edita la ciudad
            .click(Selector('#gridCiudades [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        //Se comienza con la inserción de datos para la actualización de la ciudad
            .click('#txtCiudad_Descripcion .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtCiudad_Descripcion .dx-texteditor-input', DESCRIPCION_EDIT)
            .click(Selector('#BtnGuardarCiudad div').withText('Guardar'))
    //Se elimina la ciudad
            .wait(4000);
        await eliminarRegistroDesdeGrid(t, '#gridCiudades');
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Ciudades testErp Pos - Test Hgi360`
    .page(testPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Ciudades miErp CRUD ', async t => {
    await ejecutarPrueba(t, testPosConfig);
});

fixture `Prueba Ciudades testErp Pos - Hgi360 Pos`
    .page(hgiPosConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Test Hgi360 - Prueba Ciudades miErp CRUD ', async t => {
    await ejecutarPrueba(t, hgiPosConfig);
});
