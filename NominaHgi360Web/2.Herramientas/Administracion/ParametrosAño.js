import { Selector } from 'testcafe';
import { prepararNavegador360, limpiarCache360, llenarCampos, guardarYConfirmar } from '../../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    abrirHerramientas360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    eliminarFilaGrid360
} from '../../../Funciones/HelpersHgi360Web.js';
import { eliminarSiExiste360 } from '../../../Funciones/HelpersNomina360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Herramientas > Parametros Año (test.hgi360.com, AutNomina), igual que en NominaHgi360Legacy:
// crea el año de prueba con "Cargar", valida los valores por defecto y hace el CRUD. El año se borra al final.
const GRID = 'gridParametrosAno';
const ANIO_PRUEBA = '2023';
const GUARDADO = /almacenad|guardad|cread|actualizad/i;

const VALORES_INICIALES = [
    { id: 'txtParametrosAno_Adm', valor: '01' },
    { id: 'txtParametrosAno_Con', valor: '02' },
    { id: 'txtParametrosAno_SalaMini', valor: '800000' },
    { id: 'txtParametrosAno_AuxTransporte', valor: '1000' },
    { id: 'txtParametrosAno_ValorUVT', valor: '50000' },
    { id: 'txtParametrosAno_Pension', valor: '10' },
    { id: 'txtParametrosAno_Salud', valor: '7' },
    { id: 'txtParametrosAno_Ccf', valor: '1' },
    { id: 'txtParametrosAno_Ibcf', valor: '9825' },
    { id: 'txtParametrosAno_Sena', valor: '78' },
    { id: 'txtParametrosAno_Esap', valor: '99' },
    { id: 'txtParametrosAno_MinEdu', valor: '55' },
    { id: 'txtParametrosAno_PensionE', valor: '78' },
    { id: 'txtParametrosAno_SaludE', valor: '54' }
];
const VALORES_EDITADOS = [
    { id: 'txtParametrosAno_Adm', valor: '12' },
    { id: 'txtParametrosAno_Con', valor: '13' }
];

const MAYORES_A_CERO = [
    'txtParametrosAno_Adm', 'txtParametrosAno_Con', 'txtParametrosAno_SalaMini', 'txtParametrosAno_AuxTransporte',
    'txtParametrosAno_ValorUVT', 'txtParametrosAno_Pension', 'txtParametrosAno_Salud', 'txtParametrosAno_Ccf',
    'txtParametrosAno_Ibcf', 'txtParametrosAno_Sena', 'txtParametrosAno_PensionE', 'txtParametrosAno_SaludE'
];
const EN_CERO = ['txtParametrosAno_Esap', 'txtParametrosAno_MinEdu'];

const btnCerrar = Selector('#BtnCancelarParametrosAno_btn').filterVisible();

/** "1.000.000", "10,00 %", "$ 800.000" -> número. */
async function leerNumero(id) {
    const texto = await Selector(`#${id} .dx-texteditor-input`).value;
    const limpio = String(texto || '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(limpio);
}

async function abrirParametrosAno(t) {
    await abrirHerramientas360(t, 'Parametros Año');
    await eliminarSiExiste360(t, GRID, ANIO_PRUEBA);
}

async function cargarAnio(t) {
    await t
        .click(Selector('#BtnNuevoParametrosAno').filterVisible().with({ timeout: 15000 }))
        .expect(Selector('#txtParametrosAno_Ano').filterVisible().with({ timeout: 15000 }).exists)
        .ok('No se abrió el formulario de Parametros Año');
    await llenarCampos(t, [{ id: 'txtParametrosAno_Ano', valor: ANIO_PRUEBA }]);
    await t.click(Selector('#BtnCargarParametrosAno_btn').filterVisible()).wait(3000);
}

fixture `Prueba Parametros Año Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Parametros Año - valores por defecto al crear - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirParametrosAno(t);
    await cargarAnio(t);

    for (const id of MAYORES_A_CERO) {
        await t.expect(await leerNumero(id)).gt(0, `El valor por defecto de ${id} es menor o igual a 0`);
    }
    for (const id of EN_CERO) {
        await t.expect(await leerNumero(id)).eql(0, `El valor por defecto de ${id} debería ser 0`);
    }

    await t.click(btnCerrar).wait(1500);
    if (await Selector('button.swal2-confirm').filterVisible().exists) {
        await t.click(Selector('button.swal2-confirm').filterVisible());
    }
    await eliminarSiExiste360(t, GRID, ANIO_PRUEBA);
    await cerrarSesion360(t);
});

test('Parametros Año - CRUD y persistencia - Test Hgi360', async t => {
    await ingresarAplicacion(t, testNominaConfig);
    await abrirParametrosAno(t);
    await cargarAnio(t);

    await llenarCampos(t, VALORES_INICIALES);
    await guardarYConfirmar(t, 'BtnGuardarParametrosAno_btn', GUARDADO, `Crear Parametros Año ${ANIO_PRUEBA}`);
    await buscarEnGrid360(t, GRID, ANIO_PRUEBA);
    await t.expect(filaGrid360(GRID, ANIO_PRUEBA).with({ timeout: 15000 }).exists).ok('No se creó el registro del año');

    await accionFilaGrid360(t, GRID, ANIO_PRUEBA, 'Editar');
    await llenarCampos(t, VALORES_EDITADOS);
    await guardarYConfirmar(t, 'BtnGuardarParametrosAno_btn', GUARDADO, `Editar Parametros Año ${ANIO_PRUEBA}`);

    await buscarEnGrid360(t, GRID, ANIO_PRUEBA);
    await accionFilaGrid360(t, GRID, ANIO_PRUEBA, 'Editar');
    await t.expect(Selector('#txtParametrosAno_Adm').filterVisible().with({ timeout: 15000 }).exists).ok('No se abrió la edición del año');
    await t.wait(1500);
    await t.expect(await leerNumero('txtParametrosAno_Adm')).eql(12, 'El valor administrativo no se guardó');
    await t.expect(await leerNumero('txtParametrosAno_Con')).eql(13, 'El valor contable no se guardó');
    await t.click(btnCerrar).wait(1500);

    await buscarEnGrid360(t, GRID, ANIO_PRUEBA);
    await eliminarFilaGrid360(t, GRID, ANIO_PRUEBA);
    await cerrarSesion360(t);
});
