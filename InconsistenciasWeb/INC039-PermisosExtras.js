import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    elegirEnLookup360,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC039 - Permisos x usuario > Extras > Tipos de terceros (usuario AutPos).
 * Con el permiso extra del tipo 0 - GENERAL el maestro Terceros muestra menos registros que sin él.
 * Se agrega el permiso, se cuentan los terceros, se quita el permiso y se vuelven a contar.
 */

const USUARIO = 'AutPos';
const gridExtras = Selector('[data-testid="grid_opc_extras_usuario_tipos_terceros"], #grid_opc_extras_usuario_tipos_terceros').filterVisible();
const confirmar = Selector('button.swal2-confirm').filterVisible();

const abrirExtrasTiposTerceros = async t => {
    await abrirHerramientas360(t, 'Permisos x usuario');
    await elegirEnLookup360(t, '#UsuariosPermisos_Usuario', USUARIO, 'autpos');
    await t
        .click('#tabs_UsuariosPermisos_extras')
        .click('#tabs_UsuariosPermisosExtras_tipos_terceros')
        .expect(gridExtras.with({ timeout: 15000 }).exists).ok('No cargó la grid de tipos de terceros extras');
};

/** Total de registros del maestro Terceros (pie del grid). */
const contarTerceros = async t => {
    await abrirMaestros360(t, 'Terceros', 'terceros');
    const grid = Selector('[data-testid="gridTerceros"]').filterVisible();
    await t
        .expect(grid.find('tr.dx-data-row, .dx-datagrid-nodata').filterVisible().with({ timeout: 30000 }).exists)
        .ok('No cargó el maestro Terceros');
    const info = grid.find('.dx-info');
    const texto = await info.exists ? await info.innerText : '';
    await cerrarPestana360(t);
    const numeros = texto.replace(/\./g, '').match(/\d+/g) || [];
    return numeros.length ? Number(numeros[numeros.length - 1]) : 0;
};

fixture `Prueba INC039 POS - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba INC039 Prueba Permisos Extras POS - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await abrirExtrasTiposTerceros(t);

    let agregado = false;
    try {
        // El "+" de la grid abre el popup "Tipos de terceros" con el lookup "Tipo de tercero" y Guardar (26-oct-2026)
        await t.click(Selector('.dx-icon-add, .dx-icon-plus, [aria-label="Agregar"]').filterVisible().nth(-1));
        const popup = Selector('.dx-overlay-content').filterVisible().withText('Tipos de terceros');
        await t
            .click(popup.with({ timeout: 10000 }).find('.dx-lookup-field').nth(0))
            .click(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText('0 - GENERAL').with({ timeout: 10000 }).nth(0))
            .click(popup.find('.dx-button').withText('Guardar').nth(0))
            .wait(2000);
        if (await confirmar.with({ timeout: 3000 }).exists) {
            await t.click(confirmar);
        }
        await t.expect(gridExtras.find('tr.dx-data-row').withText('GENERAL').with({ timeout: 10000 }).exists)
            .ok('No quedó agregado el tipo de tercero 0 - GENERAL en los permisos extras');
        agregado = true;
        await cerrarPestana360(t);

        const conPermiso = await contarTerceros(t);

        await abrirExtrasTiposTerceros(t);
        await t
            .click(gridExtras.find('tr.dx-data-row').withText('GENERAL').find('[aria-label="Eliminar"], .dx-link-delete').nth(0))
            .click(confirmar.with({ timeout: 10000 }))
            .wait(2000);
        agregado = false;
        await cerrarPestana360(t);

        const sinPermiso = await contarTerceros(t);
        await t.expect(conPermiso).lt(sinPermiso,
            `El número de registros sin el permiso extra (${sinPermiso}) no aumentó frente al de con permiso (${conPermiso})`);
    } finally {
        if (agregado) {
            await abrirExtrasTiposTerceros(t);
            const fila = gridExtras.find('tr.dx-data-row').withText('GENERAL');
            if (await fila.exists) {
                await t.click(fila.find('[aria-label="Eliminar"], .dx-link-delete').nth(0)).click(confirmar.with({ timeout: 10000 }));
            }
        }
    }
    await cerrarSesion360(t);
});
