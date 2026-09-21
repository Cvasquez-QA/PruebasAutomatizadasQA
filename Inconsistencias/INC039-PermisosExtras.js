import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { testPosConfig } from '../../ParametrosPruebas/TestErpPos8902.js';

const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

const esHgi360 = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360');

let abrirHerramientas = HelpersHappgi.abrirHerramientas;
let abrirMaestros = HelpersHappgi.abrirMaestros;
let cerrarPestana = HelpersHappgi.cerrarPestana;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    abrirHerramientas = esHgi360(config) ? h.abrirHerramientas360 : h.abrirHerramientas;
    abrirMaestros = esHgi360(config) ? h.abrirMaestros360 : h.abrirMaestros;
    cerrarPestana = esHgi360(config) && h.cerrarPestana360 ? h.cerrarPestana360 : h.cerrarPestana;
    cerrarSesion = esHgi360(config)
        ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
        : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    const menuHerramientas = esHgi360(config) ? 'Permisos x Usuario' : 'PERMISOS X USUARIO';
    const menuTerceros = esHgi360(config) ? 'Terceros' : 'TERCEROS';

    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, menuHerramientas);
    await t
        .click('#UsuariosPermisos_Usuario .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'autpos')
        .click(Selector('.dx-list-item').withText('AutPos - Automatizacion Pos 8902'))
        .click('#tabs_UsuariosPermisos_extras')
        .click('#tabs_UsuariosPermisosExtras_tipos_terceros')
        .click('#grid_opc_extras_usuario_tipos_terceros .dx-icon.dx-icon-edit-button-addrow')
        .click(Selector('.dx-button-content').nth(20).find('.dx-dropdowneditor-icon'))
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText('0 - GENERAL').nth(9))
        .click(Selector('.dx-link.dx-link-save.dx-icon-save.dx-link-icon'))
        .switchToMainWindow();
    await cerrarPestana(t);
    await abrirMaestros(t, menuTerceros);
    await t.wait(10000);
    const resgistrosTerceros = await Selector('#gridTerceros .dx-info').innerText;
    await t.switchToMainWindow();
    await cerrarPestana(t);
    await abrirHerramientas(t, menuHerramientas);
    await t
        .click('#UsuariosPermisos_Usuario .dx-lookup-field')
        .typeText(Selector('[data-bind="dxControlsDescendantBindings: true"] .dx-texteditor-input'), 'autpos')
        .click(Selector('.dx-list-item').withText('AutPos - Automatizacion Pos 8902'))
        .click('#tabs_UsuariosPermisos_extras')
        .click('#tabs_UsuariosPermisosExtras_tipos_terceros')
        .wait(1500)
        .click('.dx-link.dx-link-delete.dx-icon-trash.dx-link-icon')
        .click(Selector('div').withText('Sí').nth(9))
        .switchToMainWindow();
    await cerrarPestana(t);
    await abrirMaestros(t, menuTerceros);
    await t.wait(10000);
    const resgistrosTercerosSinPermiso = await Selector('#gridTerceros .dx-info').innerText;
    await t
        .expect(resgistrosTerceros < resgistrosTercerosSinPermiso).ok(
            `El número de registros sin el permiso extra ${resgistrosTerceros} y este ${resgistrosTercerosSinPermiso} no aumentó`
        )
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC039 testERP POS`
    .page(testPosConfig.pagina);

test('Prueba INC039 Prueba Permisos Extras testerp', async t => {
    await ejecutarPrueba(t, testPosConfig);
});
