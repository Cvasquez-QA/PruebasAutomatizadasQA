import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirHerramientas,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion
} from '../../../Funciones/HelpersHgi360Legacy.js';

const HERRAMIENTA_CESANTIAS = 'CESANTÍAS';
const COLUMNAS_GRID = [
    'Empleado',
    'Nombre',
    'Documento',
    'Tipo ID',
    'Días',
    'Salario',
    'Cesantías',
    'Pago'
];

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, HERRAMIENTA_CESANTIAS);
    
        await t.click('#txtNomHCesantias_Fondo .dx-lookup-field');
    
        await t
            .expect(Selector('#rgNomHCesantias_Formato div').withText('Aportes En Línea').visible)
            .ok('No se visualiza la opción Aportes En Línea')
            .expect(Selector('#rgNomHCesantias_Formato div').withText('ARUS').visible)
            .ok('No se visualiza la opción ARUS');
    
        for (const columna of COLUMNAS_GRID) {
            await t
                .expect(Selector('.dx-datagrid-headers').withText(columna).exists)
                .ok(`No se visualiza la columna ${columna}`);
        }
    
        await t
            .expect(Selector('.dx-datagrid-summary-item.dx-datagrid-text-content').exists)
            .ok('No se visualiza el totalizador de la grilla')
            .expect(Selector('.dx-datagrid-summary-item.dx-datagrid-text-content').nth(1).exists)
            .ok('No se visualiza el segundo totalizador de la grilla')
            .expect(Selector('.dx-item.dx-radiobutton div').withText('ARUS').visible)
            .ok('No se visualiza el radio ARUS')
            .expect(Selector('.dx-item.dx-radiobutton div').withText('Aportes En Línea').visible)
            .ok('No se visualiza el radio Aportes En Línea')
            .click(Selector('#btnNomHCesantias_Generar span').withText('Generar'))
            .wait(2000);
    
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Cesantias Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba Cesantias testerp', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Cesantias Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Cesantias testerp', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
