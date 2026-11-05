import { Selector, ClientFunction } from 'testcafe';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import {
    ingresarAplicacion,
    cerrarSesion360,
    abrirHerramientas360,
    buscarEnGrid360,
    filaGrid360,
    eliminarFilaGrid360,
    eliminarFilaSiExiste360,
    elegirEnLookup360
} from '../../../Funciones/HelpersHgi360Web.js';
import { abrirMaestroConfig360 } from '../../../Funciones/MenuMaestros360.js';
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Herramientas > Archivos (test.hgi360.com, AutContable): carga y actualización de Terceros y Plan de Cuentas
// con los mismos archivos de ContableHgi360Legacy. La tabla Productos no existe en el módulo Contable.
const RUTA_UPLOADS = '..\\..\\..\\Planos\\_uploads_\\';

const TERCEROS = {
    tabla: 'Terceros',
    archivo: `${RUTA_UPLOADS}PruebaEstructuraTerceros.xls`,
    archivoActualizado: `${RUTA_UPLOADS}PruebaEstructuraTercerosActualizado.xls`,
    grid: 'gridTerceros',
    codigos: ['112233', '123123']
};

const PLAN = {
    tabla: 'PlanContable',
    grid: 'gridPlanContable',
    cuenta: '1106',
    PCGA: {
        archivo: `${RUTA_UPLOADS}PruebaEstructuraPlandeCuentasPCGA.xls`,
        archivoActualizado: `${RUTA_UPLOADS}PruebaEstructuraPlandeCuentasPCGAActualizado.xls`,
        descripcion: 'PruebaPlanCuentasPCGANuevo'
    },
    NIIF: {
        archivo: `${RUTA_UPLOADS}PruebaEstructuraPlandeCuentasNIIF.xls`,
        archivoActualizado: `${RUTA_UPLOADS}PruebaEstructuraPlandeCuentasNIIFActualizado.xls`,
        descripcion: 'PruebaPlanCuentaNIIFActualizado'
    }
};

const popupResultado = Selector('.popup-Archivos-Resumen .adm-movimiento-resumen').filterVisible();
const btnAceptarResultado = Selector('#BtnAceptarPopupArchivos').filterVisible();
const btnCerrarPestanas = Selector('#TabsMenu .dx-icon.dx-icon-close.erp-tab-close').filterVisible();
const recargarPagina = ClientFunction(() => window.location.reload());

async function cerrarPestanas(t) {
    for (let i = 0; i < 5 && await btnCerrarPestanas.with({ timeout: 1500 }).exists; i++) {
        await t.click(btnCerrarPestanas.nth(0)).wait(1000);
    }
}

async function leerContador(titulo) {
    const tarjeta = popupResultado.find('.adm-movimiento-resumen__card').withText(new RegExp(titulo, 'i'));
    if (!await tarjeta.exists) {
        return 0;
    }
    return parseInt(await tarjeta.find('.adm-movimiento-resumen__card-valor').innerText, 10) || 0;
}

async function importarArchivo(t, tabla, archivo, actualizar = false) {
    await abrirHerramientas360(t, 'Archivos');
    await elegirEnLookup360(t, '#txtTabla', tabla);
    if (actualizar) {
        await t.click('#TxtArchivos_Actualizar .dx-checkbox-icon');
    }
    await t
        .click('#LinkExaminarArchivos')
        .setFilesToUpload('#InputImportarRuta', [archivo])
        .click(Selector('#BtnArchivos_Generar').filterVisible());

    const etapa = actualizar ? 'actualización' : 'carga';
    await t.expect(popupResultado.with({ timeout: 60000 }).exists)
        .ok(`[${tabla}] No apareció el resultado de la ${etapa} de ${archivo}`);
    const resumen = (await popupResultado.innerText).replace(/\s+/g, ' ').trim();
    const procesados = actualizar ? await leerContador('Actualizados') : await leerContador('Ingresados');
    await t
        .expect(procesados > 0).ok(`[${tabla}] La ${etapa} no ${actualizar ? 'actualizó' : 'ingresó'} registros. Resultado: ${resumen}`)
        .click(btnAceptarResultado);
    await cerrarPestanas(t);
}

async function validarEnMaestro(t, maestro, grid, texto, esperado = texto) {
    await abrirMaestroConfig360(t, testContableConfig, maestro);
    // El grid conserva los datos de la apertura anterior hasta que se actualiza
    const actualizar = Selector(`#${grid}`).find('[aria-label="Actualizar"]').filterVisible();
    if (await actualizar.with({ timeout: 10000 }).exists) {
        await t.click(actualizar.nth(0)).wait(2500);
    }
    await buscarEnGrid360(t, grid, texto);
    if (!await esperarFila(t, grid, esperado, 10000)) {
        // El grid puede seguir mostrando los datos guardados en el navegador; al recargar la página se consultan de nuevo
        await cerrarPestanas(t);
        await recargarPagina();
        await t.expect(Selector('#ErpSidebarModulos').filterVisible().with({ timeout: 30000 }).exists)
            .ok('La aplicación no volvió a cargar después de recargar la página');
        await abrirMaestroConfig360(t, testContableConfig, maestro);
        await buscarEnGrid360(t, grid, texto);
    }
    await t.expect(filaGrid360(grid, esperado).with({ timeout: 15000 }).exists)
        .ok(`No se encontró "${esperado}" en ${maestro} después de importar el archivo`);
}

async function esperarFila(t, grid, texto, ms) {
    const inicio = Date.now();
    while (!await filaGrid360(grid, texto).exists && Date.now() - inicio < ms) {
        await t.wait(500);
    }
    return filaGrid360(grid, texto).exists;
}

async function limpiarTerceros(t) {
    await abrirMaestroConfig360(t, testContableConfig, 'Terceros');
    for (const codigo of TERCEROS.codigos) {
        await eliminarFilaSiExiste360(t, TERCEROS.grid, codigo);
    }
    await cerrarPestanas(t);
}

async function leerModoContable(t) {
    const encabezado = Selector('span, div').filterVisible().withText(/^\s*Modo:\s*\w+/);
    await t.expect(encabezado.with({ timeout: 20000 }).exists).ok('No se ve el modo contable en el encabezado');
    return /Modo:\s*(\w+)/.exec(await encabezado.nth(-1).innerText)[1].toUpperCase();
}

fixture `Herramientas-Archivos Contable - Test Hgi360`
    .page(testContableConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testContableConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Archivos - Terceros - Test Hgi360', async t => {
    await ingresarAplicacion(t, testContableConfig);
    await limpiarTerceros(t);

    await importarArchivo(t, TERCEROS.tabla, TERCEROS.archivo);
    for (const codigo of TERCEROS.codigos) {
        await validarEnMaestro(t, 'Terceros', TERCEROS.grid, codigo);
        await cerrarPestanas(t);
    }

    await importarArchivo(t, TERCEROS.tabla, TERCEROS.archivoActualizado, true);
    await abrirMaestroConfig360(t, testContableConfig, 'Terceros');
    for (const codigo of TERCEROS.codigos) {
        await buscarEnGrid360(t, TERCEROS.grid, codigo);
        await eliminarFilaGrid360(t, TERCEROS.grid, codigo);
    }
    await cerrarPestanas(t);
    await cerrarSesion360(t);
});

test('Prueba Archivos - PlanContable - Test Hgi360', async t => {
    await ingresarAplicacion(t, testContableConfig);
    const modo = await leerModoContable(t);
    const datos = modo === 'NIIF' ? PLAN.NIIF : PLAN.PCGA;

    // La cuenta solo se borra si es la de una ejecución anterior; si es una cuenta real la prueba no la toca
    await abrirMaestroConfig360(t, testContableConfig, 'Plan de Cuentas');
    await buscarEnGrid360(t, PLAN.grid, PLAN.cuenta);
    if (await filaGrid360(PLAN.grid, PLAN.cuenta).with({ timeout: 8000 }).exists) {
        await t.expect(filaGrid360(PLAN.grid, PLAN.cuenta).withText(/PruebaPlanCuenta/).exists)
            .ok(`La cuenta ${PLAN.cuenta} ya existe en el plan de cuentas y no es de una ejecución anterior`);
        await eliminarFilaGrid360(t, PLAN.grid, PLAN.cuenta);
    }
    await cerrarPestanas(t);

    await importarArchivo(t, PLAN.tabla, datos.archivo);
    await validarEnMaestro(t, 'Plan de Cuentas', PLAN.grid, PLAN.cuenta);
    await cerrarPestanas(t);

    await importarArchivo(t, PLAN.tabla, datos.archivoActualizado, true);
    await validarEnMaestro(t, 'Plan de Cuentas', PLAN.grid, PLAN.cuenta, datos.descripcion);
    await eliminarFilaGrid360(t, PLAN.grid, PLAN.cuenta);
    await cerrarPestanas(t);
    await cerrarSesion360(t);
});
