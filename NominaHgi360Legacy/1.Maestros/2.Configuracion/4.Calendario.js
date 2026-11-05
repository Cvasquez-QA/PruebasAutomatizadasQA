import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
    //En mi happgi no se han publicado unos cambios, por lo que la pruebas fallan
import {
    abrirMaestros360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    
} from '../../../Funciones/HelpersHgi360Legacy.js';

const CODIGO_CALENDARIO = '72';
const ANIO = '2025';
const FECHA_INICIAL = '2025-01-01';
const FECHA_FINAL = '2025-01-31';
const FESTIVOS = '2';
const FESTIVOS_EDITADOS = '4';
const DIAS = '30';
const HORAS = '24';
const HORAS_EDITADAS = '36';
const MES = '01';
const NUMERO_PERIODO = '01';
const DESCRIPCION = 'enero';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Calendario');

    await eliminarRegistroSiExiste(t, '#gridCalendarioNom', CODIGO_CALENDARIO);

    await t
        .click('#gridCalendarioNom .dx-icon.dx-icon-add')
        .typeText('#txtIdCalendarioNom', CODIGO_CALENDARIO)
        .click('#txtCalendarioNom_A�os .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtCalendarioNom_Anyo .dx-texteditor-input', ANIO)
        .click('#txtCalendarioNom_FechaInicial .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtCalendarioNom_FechaInicial .dx-texteditor-input', FECHA_INICIAL)
        .typeText('#txtCalendarioNom_Festivos .dx-texteditor-input', FESTIVOS)
        .typeText('#txtCalendarioNom_FechaFinal .dx-texteditor-input', FECHA_FINAL)
        .typeText('#txtCalendarioNom_Dias .dx-texteditor-input', DIAS)
        .typeText('#txtCalendarioNom_Horas .dx-texteditor-input', HORAS)
        .typeText('#txtCalendarioNom_Mes .dx-texteditor-input', MES)
        .typeText('#txtCalendarioNom_Numero .dx-texteditor-input', NUMERO_PERIODO)
        .typeText('#txtCalendarioNom_Descipcion .dx-texteditor-input', DESCRIPCION)
        .click('#txtCalendarioNom_NovedadesPeriodo .dx-checkbox-icon')
        .click('#BtnGuardarCalendarioNom .dx-icon.dx-icon-save')
        .click(Selector('#BtnGuardarCalendarioNom span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar').nth(1))
    //Se edita el registro
        .typeText('#gridCalendarioNom .dx-texteditor-input', CODIGO_CALENDARIO)
        .click(Selector('#gridCalendarioNom [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .click('#txtCalendarioNom_Festivos .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtCalendarioNom_Festivos .dx-texteditor-input', FESTIVOS_EDITADOS)
        .click('#txtCalendarioNom_Horas .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtCalendarioNom_Horas .dx-texteditor-input', HORAS_EDITADAS)
        .click(Selector('#BtnGuardarCalendarioNom div').withText('Guardar'))
        .click(Selector('button').withText('Aceptar').nth(1));
    //Se elimina el CalendarioNom
    await eliminarRegistroDesdeGrid(t, '#gridCalendarioNom');
    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Calendario Nom Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Prueba Calendario Nom - MiHgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Calendario Nom Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Prueba Calendario Nom - Test Hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
