import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    filtrarPor,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan

const CODIGO_CIUDAD = 'MICIUDAD';
const DESCRIPCION_CIUDAD = 'MIDESCRIPCION';
const DESCRIPCION_CIUDAD_EDITADA = 'MINUEVADESCRIPCION';
const ZONA_INICIAL = 'GENERAL';
const ZONA_EDITADA = 'ZONA';
const CIUDAD_DANE = 'AGUADAS';
const PAIS = 'MIPAIS';
const PAIS_ISO = 'Alemania';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Ciudades');

    await t
        .click('#gridCiudades .dx-icon.dx-icon-add')
    //Se comienza con la inserción de datos para la creación de la ciudad
        .typeText('#txtCiudad_Idfocus', CODIGO_CIUDAD)
        .typeText('#txtCiudad_Descripcion .dx-texteditor-input', DESCRIPCION_CIUDAD)
        .click(Selector('#txtCiudad_Zonas .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, ZONA_INICIAL);
    await t
        .click(Selector('#txtCiudad_Dane_Ciudad .dx-lookup-field'))
        .typeText(filtrarPor, CIUDAD_DANE)
        .wait(2000)
        ;
    await seleccionarOpcion(t, CIUDAD_DANE);
    await t
        .typeText('#txtCiudad_Dane_Pais .dx-texteditor-input', PAIS)
        .click(Selector('#txtCiudad_Dane_PaisIso .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, PAIS_ISO);
    await t
        .click(Selector('#BtnGuardarCiudad span').withText('Guardar'))
        //El sistema NO permite guardar una Ciudad sin zona
//Se valida la creación
        .typeText('#gridCiudades .dx-texteditor-input', CODIGO_CIUDAD)
        .wait(4000)
        .expect(Selector('#gridCiudades td').withText(CODIGO_CIUDAD).exists).ok()
//Se edita la ciudad
        .click(Selector('#gridCiudades [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
    //Se comienza con la inserción de datos para la actualización de la ciudad
        .click('#txtCiudad_Descripcion .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtCiudad_Descripcion .dx-texteditor-input', DESCRIPCION_CIUDAD_EDITADA)
        .click(Selector('#txtCiudad_Zonas .dx-lookup-field'))
        ;
    await seleccionarOpcion(t, ZONA_EDITADA);
    await t
        .click(Selector('#BtnGuardarCiudad div').withText('Guardar'))
//Se elimina la ciudad
        .wait(4000);
    await eliminarRegistroDesdeGrid(t, '#gridCiudades');
    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Ciudades Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Prueba Ciudades - MiHgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Ciudades Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Ciudades - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});