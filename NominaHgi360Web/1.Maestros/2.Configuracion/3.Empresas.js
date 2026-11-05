import { Selector } from 'testcafe';
import {
    ingresarAplicacion,
    cerrarSesion360,
    cerrarPestana360,
    buscarEnGrid360,
    filaGrid360,
    accionFilaGrid360,
    elegirEnLookup360
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360, guardarYConfirmar } from '../../../Funciones/HelpersMaestros360.js';
import { abrirMaestroConfig360 } from '../../../Funciones/MenuMaestros360.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Empresas - test.hgi360.com (Nómina > Maestros > Configuración). Igual que en NominaHgi360Legacy:
// no crea empresas; cambia la ciudad de la empresa 1, valida el cambio y deja la ciudad que tenía.
// Ids del formulario tomados en el navegador el 03-nov-2026.
const GRID = 'gridEmpresas';
const GUARDAR = 'BtnGuardarEmpresa_btn';
const CODIGO_EMPRESA = '1';
const campoCiudad = Selector('#txtEmpresa_Ciudad .dx-lookup-field');

async function abrirEmpresa(t) {
    await buscarEnGrid360(t, GRID, CODIGO_EMPRESA);
    await accionFilaGrid360(t, GRID, CODIGO_EMPRESA, 'Editar');
    await t.expect(campoCiudad.filterVisible().with({ timeout: 15000 }).exists)
        .ok(`No se abrió el formulario de la empresa ${CODIGO_EMPRESA}`);
}

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMaestroConfig360(t, config, 'Empresas');
    await buscarEnGrid360(t, GRID, CODIGO_EMPRESA);
    await t
        .expect(filaGrid360(GRID, CODIGO_EMPRESA).with({ timeout: 15000 }).exists)
        .ok(`No se encuentra registrada la empresa ${CODIGO_EMPRESA}`);

    await abrirEmpresa(t);
    const ciudadOriginal = (await campoCiudad.innerText).replace(/\s+/g, ' ').trim();
    await t.expect(ciudadOriginal).notEql('', 'La empresa no tiene ciudad para restaurar al final');
    const codigoOriginal = ciudadOriginal.split(' - ')[0].trim();

    try {
        // La legacy usaba AGUADAS, que no existe en la empresa 8902: se elige la primera ciudad distinta a la actual
        await t.click(campoCiudad);
        const otraCiudad = Selector('.dx-overlay-content').filterVisible().find('.dx-list-item')
            .filter(nodo => nodo.textContent.replace(/\s+/g, ' ').trim() !== actual, { actual: ciudadOriginal });
        await t.expect(otraCiudad.with({ timeout: 10000 }).exists).ok('No hay otra ciudad para asignar a la empresa');
        const ciudadEditada = (await otraCiudad.nth(0).innerText).replace(/\s+/g, ' ').trim();
        await t.click(otraCiudad.nth(0));
        await guardarYConfirmar(t, GUARDAR, /actualizad|almacenad|guardad/i, `Editar ciudad de la empresa ${CODIGO_EMPRESA}`);

        await abrirEmpresa(t);
        await t.expect(campoCiudad.innerText).contains(ciudadEditada, 'La ciudad editada no quedó guardada');
    } finally {
        if (!(await campoCiudad.filterVisible().exists)) {
            await abrirEmpresa(t);
        }
        await elegirEnLookup360(t, '#txtEmpresa_Ciudad', ciudadOriginal, codigoOriginal);
        await guardarYConfirmar(t, GUARDAR, /actualizad|almacenad|guardad/i, `Restaurar ciudad de la empresa ${CODIGO_EMPRESA}`);
    }

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba 3.Empresas Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNominaConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba Empresas (editar ciudad y restaurar)', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
