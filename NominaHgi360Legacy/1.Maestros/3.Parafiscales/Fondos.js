import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    seleccionarOpcion
} from '../../../Funciones/HelpersHgi360Legacy.js';

const MAESTRO = 'Fondos';
const GRID = '#gridFondos';
const CODIGO = 'MiFondo';
const NOMBRE = 'NombreFondo';
const NOMBRE_EDITADO = 'MINUEVANOMBREFONDO';
const NIT = '85465469496496';
// Match parcial: el texto exacto del combo suele variar (acentos/paréntesis)
const TIPO_FONDO = /AFP/;
const BOTON_GUARDAR = Selector('#BtnGuardarFondos').find('span, div').withText('Guardar');

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, MAESTRO);
    await eliminarRegistroSiExiste(t, GRID, CODIGO);

    await t
        .click('#gridFondos .dx-icon.dx-icon-add')
        .typeText('#txtFondo_Codigo .dx-texteditor-input', CODIGO, { paste: true, replace: true })
        .typeText('#txtFondo_Nombre .dx-texteditor-input', NOMBRE, { paste: true, replace: true })
        .typeText('#txtFondo_Nit .dx-texteditor-input', NIT, { paste: true, replace: true })
        .click('#selFondo_Tipo .dx-dropdowneditor-icon')
        ;
    await seleccionarOpcion(t, TIPO_FONDO);
    await t
        .click(BOTON_GUARDAR)
        .wait(3000)
        .expect(Selector(`${GRID} td`).withText(CODIGO).exists).ok()
        .click(Selector('#gridFondos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#txtFondo_Nombre .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtFondo_Nombre .dx-texteditor-input', NOMBRE_EDITADO, { paste: true, replace: true })
        .click(BOTON_GUARDAR)
        .wait(4000);

    await eliminarRegistroDesdeGrid(t, GRID);
    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

// Test primero: Mi a veces se queda en login por el widget de chatbot
fixture `Prueba Fondos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Fondos testerp CRUD ', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});

fixture `Prueba Fondos Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Fondos testerp CRUD ', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});
