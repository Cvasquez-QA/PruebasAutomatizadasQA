import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroSiExiste,
    ingresarAplicacion,
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
 

const CODIGO_TURNO = '886';
const DESCRIPCION_TURNO = 'Prueba Turno';
const GRID_TURNOS = '#gridTurnos';

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestros360(t, 'Turnos');
        await eliminarRegistroSiExiste(t, GRID_TURNOS, CODIGO_TURNO);
    
        await t
            .click('#gridTurnos .dx-icon.dx-icon-add')
            .typeText('#txtTurno_Idfoco', CODIGO_TURNO)
            .pressKey('enter')
            .typeText('#txtTurno_Descripcion .dx-texteditor-input', DESCRIPCION_TURNO)
            .click('#txtTurno_HoraInicial .dx-lookup-field')
            .typeText('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input','07')
            .wait(2000)
            ;
    await seleccionarOpcion(t, '07:30');
    await t
            .click('#txtTurno_HoraFinal .dx-lookup-field')
            .typeText('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input','17')
            .wait(2000)
            ;
    await seleccionarOpcion(t, '17:00');
    await t
            .typeText('#txtTurno_HorasBase .dx-texteditor-input', '45')
             .click(Selector('#txtTurno_TrabajaFestivos .dx-checkbox-icon'))
            .click(Selector('#txtTurno_CompensaFestivos .dx-checkbox-icon'))
            .click(Selector('#txtTurno_BaseFactura .dx-checkbox-icon'))
            .click(Selector('#txtTurno_Descanso .dx-checkbox-icon'))
            .click(Selector('#BtnGuardarTurnos span').withText('Guardar'))
            //Se valida la creación
            .wait(2000)
            .expect(Selector('#gridTurnos td').withText(CODIGO_TURNO).exists).ok()
        //Se edita el turno
            .click(Selector('#gridTurnos [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
            .click(Selector('#txtTurno_HoraFinal .dx-lookup-field'))
            .typeText('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input','16')
            ;
    await seleccionarOpcion(t, '16:00');
    await t
            .click(Selector('#BtnGuardarTurnos span').withText('Guardar'));
    
        await eliminarRegistroSiExiste(t, GRID_TURNOS, CODIGO_TURNO);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba 1.Turnos Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Turnos hgi360', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba 1.Turnos Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Turnos hgi360', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
