import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../Funciones/HelpersHgi360Legacy.js';
import * as HelpersHappgi from '../Funciones/HelpersHappgi.js';
import { hgiAdminConfig, miContableConfig, miNominaConfig, hgiPosConfig, miHappgiAdminConfig, miHappgiContableConfig, miHappgiNominaConfig, miHappgiPosConfig, testAdminConfig, testContableConfig, testGourmetConfig, testNominaConfig, testPosConfig, testHappgiAdminConfig, testHappgiContableConfig, testHappgiNominaConfig, testHappgiPosConfig } from '../ParametrosPruebas/ParametrosPruebas.js';
import { limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Legacy.js';

/** Hgi360 (test/mi) â†’ HelpersHgi360; Happgi y demÃ¡s â†’ HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let filtrarPor = HelpersHappgi.filtrarPor;
let iframeTab = HelpersHappgi.iframeTab;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;
let ingresarAplicacionMiHappgi = HelpersHappgi.ingresarAplicacionMiHappgi;
let cerrarSesion = HelpersHappgi.cerrarSesion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    filtrarPor = h.filtrarPor;
    iframeTab = h.iframeTab;
    ingresarAplicacion = h.ingresarAplicacion;
    ingresarAplicacionMiHappgi = h.ingresarAplicacionMiHappgi;
    cerrarSesion = String(config?.pagina || '').toLowerCase().includes('hgi360')
            ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360)
            : h.cerrarSesion;
};

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
const PERIODO =  '8';
const PERIODO_NOM =  '15';
const ANIO =  '2026';

const LOOKUP_ANIO = '#TxtCambioPeriodo_Anyo .dx-lookup-field';
const LOOKUP_PERIODO = '#TxtCambioPeriodo_Periodo .dx-lookup-field';
const BTN_GUARDAR = Selector('#BtnGuardarCambioPeriodo div').withText('Guardar');
const BTN_ACEPTAR = Selector('.swal2-actions button').withText('Aceptar');

/** El listado de periodo muestra: "7 - 7", "13 - 13", etc. */
const textoPeriodoLista = periodo => {
    const p = String(periodo).trim();
    return `${p} - ${p}`;
};

const opcionExacta = valor => {
    const texto = String(valor).trim();
    const escapado = texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return Selector('.dx-overlay-content')
        .filterVisible()
        .find('.dx-item-content.dx-list-item-content')
        .withText(new RegExp(`^${escapado}$`));
};

async function seleccionarLookup(t, lookupSelector, valorLista, valorFiltro = valorLista) {
    const textoLista = String(valorLista).trim();
    const textoFiltro = String(valorFiltro).trim();

    await t
        .click(Selector(lookupSelector))
        .wait(1000);

    await filtrarPor(t, textoFiltro);

    await t
        .wait(1000)
        .expect(opcionExacta(textoLista).exists)
        .ok(`No aparece la opciÃ³n exacta "${textoLista}" en el listado`)
        .click(opcionExacta(textoLista))
        .wait(500);
}

export async function cambiarPeriodoA(t, periodo = PERIODO, anio = ANIO) {
    await t
        .switchToMainWindow()
        .click(Selector('#LblUsuarioNombre'))
        .click(Selector('a').withText('Cambiar Periodo'))
        .wait(2000)
        .switchToIframe(iframeTab)
        .wait(1500);

    if (anio !== undefined && anio !== null && String(anio).trim() !== '') {
        await seleccionarLookup(t, LOOKUP_ANIO, anio);
    }

    // Listado: "PERIODO - PERIODO" (ej. "7 - 7"); filtro con el nÃºmero solo
    await seleccionarLookup(t, LOOKUP_PERIODO, textoPeriodoLista(periodo), String(periodo).trim());

    await t
        .click(BTN_GUARDAR)
        .click(BTN_ACEPTAR)
        .wait(5000)
        .switchToMainWindow();
}

async function ejecutarPrueba(t, config, periodo = PERIODO, ingresar = ingresarAplicacion) {
    usarHelpersDe(config);
    await ingresar(t, config);
    await cambiarPeriodoA(t, periodo, ANIO);
    await cerrarSesion(t);
}

const casos = [
    // Admin
    { id: 'Test Hgi360 Admin', config: testAdminConfig },
    { id: 'Hgi360 Admin', config: hgiAdminConfig },
    { id: 'Test Happgi Admin', config: testHappgiAdminConfig },
    { id: 'Mi Happgi Admin', config: miHappgiAdminConfig, ingresar: ingresarAplicacionMiHappgi },

    // Pos
    { id: 'Test Hgi360 Pos', config: testPosConfig },
    { id: 'Hgi360 Pos', config: hgiPosConfig },
    { id: 'Test Happgi Pos', config: testHappgiPosConfig },
    { id: 'Mi Happgi Pos', config: miHappgiPosConfig, ingresar: ingresarAplicacionMiHappgi },

    // Nomina (usa PERIODO_NOM)
    { id: 'Test Hgi360 Nomina', config: testNominaConfig, periodo: PERIODO_NOM },
    { id: 'Mi Erp Hgi360 Nomina', config: miNominaConfig, periodo: PERIODO_NOM },
    { id: 'Test Happgi Nomina', config: testHappgiNominaConfig, periodo: PERIODO_NOM },
    { id: 'Mi Happgi Nomina', config: miHappgiNominaConfig, periodo: PERIODO_NOM, ingresar: ingresarAplicacionMiHappgi },

    // Contable
    { id: 'Test Hgi360 Contable', config: testContableConfig },
    { id: 'Mi Erp Hgi360 Contable', config: miContableConfig },
    { id: 'Test Happgi Contable', config: testHappgiContableConfig },
    { id: 'Mi Happgi Contable', config: miHappgiContableConfig, ingresar: ingresarAplicacionMiHappgi },

    // Gourmet
    { id: 'Test Hgi360 Gourmet', config: testGourmetConfig },
];

casos.forEach(({ id, config, periodo = PERIODO, ingresar = ingresarAplicacion }) => {
    const etiqueta = `${periodo}${ANIO ? ` / ${ANIO}` : ''}`;

    fixture `INC050 Cambio Periodo - ${id}`
        .page(config.pagina)
        .afterEach(async t => {
            await limpiarCacheChromeTestCafe(t);
        });

    test(`INC050 Cambio Periodo a ${etiqueta} - ${id}`, async t => {
        await ejecutarPrueba(t, config, periodo, ingresar);
    });
});
