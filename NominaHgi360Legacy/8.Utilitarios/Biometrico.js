import { Selector } from 'testcafe';
import { abrirUtilitarios, cerrarSesion360, ingresarAplicacion } from '../../Funciones/HelpersHgi360Legacy.js';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const DISPOSITIVO = '1 - Lector1';
const PERFILES = [
    'UsuarioAdministrador',
    'UsuarioEnrolador',
    'UsuarioNormal',
    'UsuarioSupervisor'
];

const toastNoImplementado = Selector('[class^="dx-overlay-content dx-toast-warning"] div')
    .withText('El proceso aún no está implementado.');

const filasGridBiometrico = Selector('.dx-row.dx-data-row.dx-row-lines.dx-column-lines td');

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirUtilitarios(t, 'BIOMÉTRICO');
    
        await t
            .click('#TxtNomBiometrico_Dispositivo .dx-lookup-field')
            .click(Selector('.dx-item.dx-list-item div').withText(DISPOSITIVO))
            .click('#TxtNomBiometrico_Perfil .dx-dropdowneditor-icon')
            .wait(1500);
    
        for (const perfil of PERFILES) {
            await t
                .expect(Selector('.dx-item.dx-list-item').withText(perfil).visible)
                .ok(`No está el perfil ${perfil}`);
        }
    
        await t
            .click('#TxtNomBiometrico_Perfil .dx-dropdowneditor-icon')
            .click(Selector('#BtnNomBiometrico_CargarEmpleados span').withText('Cargar Empleados'))
            .wait(3000)
            .expect(filasGridBiometrico.count).gt(0, 'La grilla no trae información de empleados');
    
        await t
            .click(Selector('#BtnNomBiometrico_Conectar span').withText('Conectar'))
            .wait(2000)
            .expect(toastNoImplementado.visible).ok('No se mostró el mensaje de Conectar no implementado');
    
        await t
            .click(Selector('#BtnNomBiometrico_CrearEmpleados span').withText('Crear Empleados'))
            .wait(2000)
            .expect(toastNoImplementado.visible).ok('No se mostró el mensaje de Crear Empleados no implementado');
    
        await t.switchToMainWindow();
        await cerrarSesion360(t);
}

fixture `Prueba Biometrico Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Biometrico testerp', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Biometrico Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Biometrico testerp', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
