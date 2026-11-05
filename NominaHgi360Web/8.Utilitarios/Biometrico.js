import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    abrirUtilitarios360,
    elegirEnLookup360
} from '../../Funciones/HelpersHgi360Web.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Utilitarios > Biométrico (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy.
// Conectar y Crear Empleados aún no están implementados en la aplicación: se valida el aviso.
const DISPOSITIVO = '1 - Lector1';
const PERFILES = ['UsuarioAdministrador', 'UsuarioEnrolador', 'UsuarioNormal', 'UsuarioSupervisor'];
const NO_IMPLEMENTADO = /no est[aá] implementado/i;

const aviso = texto => Selector('.erp-toast, .swal2-popup').filterVisible().withText(texto);
const filasGrid = Selector('#GridNomBiometrico_Empleados tr.dx-data-row');

fixture `Prueba Biometrico Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Biometrico - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirUtilitarios360(t, 'Biométrico');
    await t.expect(Selector('#TxtNomBiometrico_Dispositivo').filterVisible().with({ timeout: 20000 }).exists)
        .ok('No se abrió Utilitarios > Biométrico');

    await elegirEnLookup360(t, '#TxtNomBiometrico_Dispositivo', DISPOSITIVO);
    await t.click(Selector('#TxtNomBiometrico_Perfil').find('.dx-dropdowneditor-icon, .dx-lookup-field').nth(0)).wait(1500);
    for (const perfil of PERFILES) {
        await t.expect(Selector('.dx-overlay-content').filterVisible().find('.dx-list-item').withText(perfil).exists)
            .ok(`No está el perfil ${perfil}`);
    }
    await t
        .pressKey('esc')
        .click(Selector('#BtnNomBiometrico_CargarEmpleados').filterVisible())
        .expect(filasGrid.with({ timeout: 20000 }).exists).ok('La grilla no trae información de empleados');

    await t
        .click(Selector('#BtnNomBiometrico_Conectar').filterVisible())
        .expect(aviso(NO_IMPLEMENTADO).with({ timeout: 10000 }).exists)
        .ok('No se mostró el mensaje de Conectar no implementado');
    await t
        .expect(aviso(NO_IMPLEMENTADO).exists).notOk('El aviso de Conectar no se cerró', { timeout: 20000 })
        .click(Selector('#BtnNomBiometrico_CrearEmpleados').filterVisible())
        .expect(aviso(NO_IMPLEMENTADO).with({ timeout: 10000 }).exists)
        .ok('No se mostró el mensaje de Crear Empleados no implementado');

    await cerrarPestana360(t);
    await cerrarSesion360(t);
});
