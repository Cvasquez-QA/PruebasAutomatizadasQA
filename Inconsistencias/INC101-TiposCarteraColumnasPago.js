import { Selector } from 'testcafe';
import {
    abrirHerramientas360 as abrirHerramientas,
    abrirMovimientos360 as abrirMovimiento,
    cerrarPestana360 as cerrarPestana,
    cerrarSesion360 as cerrarSesion,
    filtrarPor,
    ingresarAplicacion,
    selectorOpcion,
    limpiarCacheChromeTestCafe
} from '../Funciones/HelpersHgi360Legacy.js';
import { testAdminConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

const CODIGO_TRANSACCION = '01';
const TRANSACCION_PAGO = '01 - RECIBO DE CAJA';

const COLUMNAS_COMUNES = [
    'Seleccionar',
    'Transacción',
    'Des',
    'Doc',
    'DocRef',
    'Fecha',
    'Edad',
    'Valor',
    'Descargar',
];

const TIPOS_CARTERA = [
    {
        nombre: 'General',
        indice: 0,
        columnasAdicionales: [],
    },
    {
        nombre: 'Cuotas',
        indice: 1,
        columnasAdicionales: ['Cuota'],
    },
    {
        nombre: 'Grupos',
        indice: 2,
        columnasAdicionales: ['Tipo', 'Grupo'],
    },
    {
        nombre: 'Tipo',
        indice: 3,
        columnasAdicionales: ['Tipo'],
    },
];

const encabezadoCartera = texto => Selector('#gridCartera [role="columnheader"]')
    .find('.dx-datagrid-text-content')
    .withExactText(texto);

async function configurarTipoCartera(t, tipo) {
    await abrirHerramientas(t, 'Parámetros');

    await t
        .click('#tabs_parametrosAdmin_Cartera')
        .click('#BtnEditar .dx-icon.dx-icon-edit')
        .click(Selector('#TxtParametrosGenerales_CarteraFormaCxC .dx-radiobutton-icon').nth(tipo.indice))
        .click(Selector('#TxtParametrosGenerales_CarteraFormaCxP .dx-radiobutton-icon').nth(tipo.indice))
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .click(Selector('button').withText('Aceptar'));

    await cerrarPestana(t);
}

async function abrirPago(t) {
    await abrirMovimiento(t, 'Pagos');

    await t
        .click('#ListagridDocumentosPago .dx-icon.dx-icon-add')
        .click('#TxtDocumentosPago_Transaccion .dx-lookup-field');

    await filtrarPor(t, CODIGO_TRANSACCION);
    await t
        .click(selectorOpcion(TRANSACCION_PAGO))
        .wait(2000);
}

async function validarColumnas(t, tipo) {
    const columnasVisibles = [...COLUMNAS_COMUNES, ...tipo.columnasAdicionales];

    for (const columna of columnasVisibles) {
        await t
            .expect(encabezadoCartera(columna).visible)
            .ok(`No se muestra la columna "${columna}" para cartera ${tipo.nombre}`);
    }
}

fixture `INC101 Tipos Cartera Columnas Pago testAdmin HGI360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('INC101 Tipos Cartera Columnas Pago', async t => {
    await ingresarAplicacion(t, testAdminConfig);

    for (const tipo of TIPOS_CARTERA) {
        await configurarTipoCartera(t, tipo);
        await abrirPago(t);
        await validarColumnas(t, tipo);
        await cerrarPestana(t);
    }

    await cerrarSesion(t);
});
