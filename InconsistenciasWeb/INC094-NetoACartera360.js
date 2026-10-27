import { Selector } from 'testcafe';
import {
    cerrarPestana360,
    cerrarSesion360,
    desmarcarCheckboxSiEsta,
    editarTransaccion360,
    filasReporte360,
    guardarFormaCartera360,
    guardarMaestro360,
    ingresarAplicacion,
    leerFormaCartera360,
    limpiarCacheChromeTestCafe,
    marcarCheckboxSiNoEsta,
    parseTextoNumerico
} from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    asegurarDependenciaDocumento360,
    eliminarDocumentoSiExiste360,
    elegirTerceroDocumento,
    guardarDocumento360,
    leerTotalesDocumento,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { hgiAdminConfig, testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC094 - La TX INC094 (CxC o CxP, General o Cuotas, "Neto" o "Total" a cartera) lleva a Cartera X Edades el valor
 * configurado del documento. La forma de cartera de Parámetros se restaura al final de cada caso; la configuración de
 * la TX queda con el último caso (igual que la prueba legacy). El documento se elimina.
 */

const TX = ['INC094', /^\s*INC094 -/i];
const ESCENARIOS = [];
for (const tipo of ['CxC', 'CxP']) {
    for (const valor of ['Neto', 'Total']) {
        for (const forma of ['General', 'Cuotas']) {
            ESCENARIOS.push({ tipo, forma, valor });
        }
    }
}

async function configurarTransaccion(t, { tipo, forma, valor }) {
    await editarTransaccion360(t, TX[0], 'Cartera');
    if (tipo === 'CxC') {
        await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_CuentaCobrar');
        await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_CuentaPagar');
    } else {
        await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_CuentaCobrar');
        await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_CuentaPagar');
    }
    if (forma === 'Cuotas') {
        await marcarCheckboxSiNoEsta(t, '#TxtTransaccion_Cartera_IntManCuotas');
    } else {
        await desmarcarCheckboxSiEsta(t, '#TxtTransaccion_Cartera_IntManCuotas');
    }
    await t.click(Selector('#TxtTransaccion_Cartera_TotalNeto .dx-radiobutton').withText(valor).with({ timeout: 10000 }));
    await guardarMaestro360(t, 'Transaccion');
    await cerrarPestana360(t);
}

async function ejecutarEscenario(t, config, escenario) {
    await ingresarAplicacion(t, config);
    const formaOriginal = await leerFormaCartera360(t);
    await t.expect(formaOriginal.includes(-1)).notOk(`No se pudo leer la forma de cartera de Parámetros (${formaOriginal})`);
    const indice = escenario.forma === 'Cuotas' ? 1 : 0;
    let numero = null;
    let totales = null;
    let filas = [];
    try {
        await guardarFormaCartera360(t, [indice, indice]);
        await configurarTransaccion(t, escenario);

        await nuevoDocumento360(t, TX[0], TX[1]);
        await elegirTerceroDocumento(t, '811021438');
        await asegurarDependenciaDocumento360(t);
        numero = await guardarDocumento360(t);
        await agregarLineaDocumento(t, '01', { cantidad: 1 });
        await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
        totales = await leerTotalesDocumento();
        await cerrarPestana360(t);
        filas = await filasReporte360(t, 'Cartera', 'Cartera X Edades', numero);
        await cerrarPestana360(t);
    } finally {
        if (numero) {
            await nuevoDocumento360(t, TX[0], TX[1]);
            await eliminarDocumentoSiExiste360(t, TX[0], TX[1], numero);
        }
        await guardarFormaCartera360(t, formaOriginal);
    }

    const esperado = Math.trunc(escenario.valor === 'Neto' ? totales.neto : totales.total);
    const otro = Math.trunc(escenario.valor === 'Neto' ? totales.total : totales.neto);
    await t.expect(filas.length).gt(0, `El documento ${numero} no aparece en Cartera X Edades`);
    const valores = filas[0].map(parseTextoNumerico);
    const detalle = `fila: ${filas[0].join(' | ')}; neto ${totales.neto}, total ${totales.total}`;
    await t.expect(valores.includes(esperado)).ok(valores.includes(otro)
        ? `El reporte muestra el ${escenario.valor === 'Neto' ? 'total' : 'neto'} y se esperaba el ${escenario.valor.toLowerCase()} (${detalle})`
        : `El reporte no muestra el ${escenario.valor.toLowerCase()} del documento (${detalle})`);
    await cerrarSesion360(t);
}

fixture `INC094 Reporte cartera vs documento - Test Hgi360 Admin`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

for (const e of ESCENARIOS) {
    test(`INC094 Reporte cartera ${e.tipo} ${e.forma} vs documento ${e.valor} - Test Hgi360 Admin`, async t => {
        await ejecutarEscenario(t, testAdminConfig, e);
    });
}

fixture `INC094 Reporte cartera vs documento - Hgi360 Admin`
    .page(hgiAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

for (const e of ESCENARIOS) {
    test(`INC094 Reporte cartera ${e.tipo} ${e.forma} vs documento ${e.valor} - Hgi360 Admin`, async t => {
        await ejecutarEscenario(t, hgiAdminConfig, e);
    });
}
