import { Selector } from 'testcafe';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirProcesos,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../Funciones/HelpersHgi360Legacy.js';

const BANCO = 'BANCOLOMBIA';
const FORMA_PAGO = 'Transferencia';
const MENSAJE_PROCESO_FINALIZADO = 'Proceso Finalizado';
const ID_EMPLEADO = '1000099598';


async function seleccionarLookup(t, hostSelector, texto) {
    await t.click(`${hostSelector} .dx-lookup-field`);
    await seleccionarOpcion(t, texto);
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirProcesos(t, 'LIQUIDACIÓN DE PERIODO');

    await seleccionarLookup(t, '#txtMaestroLiquidarPeriodo_Banco', BANCO);
    await seleccionarLookup(t, '#txtMaestroLiquidarPeriodo_FormaDePago', FORMA_PAGO);

    await t.click(Selector('#txtMaestroLiquidarPeriodo_Empleado div'));
    await filtrarPor(t, ID_EMPLEADO);
    await t
        .wait(2000)
        ;
    await seleccionarOpcion(t, ID_EMPLEADO);
    await t
        .click(Selector('span').withText('Aceptar'))
        .click(Selector('#BtnLiquidarPeriodo span').withText('Liquidar'))
        .wait(5000);

    const mensaje = await Selector('#swal2-content').innerText;
    await t
        .expect(mensaje).eql(MENSAJE_PROCESO_FINALIZADO, 'no se realizó la liquidación corretamente')
        .click(Selector('button').withText('Aceptar').nth(1));

    await t.switchToMainWindow();
    await cerrarSesion360(t);
}

fixture `Prueba Proceso Liquidacion Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba Proceso liquidacion', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba Proceso Liquidacion Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba Proceso liquidacion', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
