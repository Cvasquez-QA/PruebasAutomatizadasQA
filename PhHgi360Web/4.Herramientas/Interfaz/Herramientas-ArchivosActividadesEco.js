import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion,
    seleccionarOpcion,
    limpiarCacheChromeTestCafe
} from '../../../Funciones/HelpersHgi360Web.js';
import { abrirMaestroPh360 as abrirMaestros360 } from '../../../Funciones/MenuMaestros360.js';
import { testPhConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

const TABLA = 'Actividad Eco';
const ARCHIVO_IMPORTAR = '..\\..\\..\\Planos\\_uploads_\\TblActividadEco_ArchivoInterfaz_PRUEBA.xlsx';
const ARCHIVO_ACTUALIZAR = '..\\..\\..\\Planos\\_uploads_\\TblActividadEco_ArchivoInterfaz_UPDATE_PRUEBA.xlsx';
const GRID = '#PnlGridActividadesEconomicas';
const CODIGO_1 = '102030';
const CODIGO_2 = '112233';
const CODIGO_3 = '112033';
const DESC_1 = 'Prueba0Nuevo';
const DESC_2 = 'Prueba1Nuevo';
const DESC_3 = 'Prueba2Nuevo';
const MENSAJE_DESCARGA = 'El archivo que se descargó contiene el resultado d';

const buscador = Selector(`${GRID} .dx-texteditor-input`);
const btnEliminarFila = Selector('[data-tooltip="Eliminar"] .erp-grid-action-glyph');
const btnConfirmarEliminar = Selector('button').withText('Eliminar');
const tabActividadesEco = Selector('.erp-tab-title span').withText('Actividades Eco');

async function seleccionarTablaActividadEco(t) {
    await t.click('#txtTabla .dx-lookup-field');
    await seleccionarOpcion(t, TABLA);
}

async function importarActividadEco(t, archivo, actualizar = false) {
    await abrirHerramientas360(t, 'Archivos');
    await seleccionarTablaActividadEco(t);

    if (actualizar) {
        await t.click('#TxtArchivos_Actualizar .dx-checkbox-icon');
    } else {
        await t
            .click('#BtnDescargar_Estructura .dx-icon.dx-icon-download')
    }

    await t
        .click('#LinkExaminarArchivos')
        .setFilesToUpload('#InputImportarRuta', [archivo])
        .click(Selector('#BtnArchivos_Generar span, #BtnArchivos_Generar div').withText('Generar'));

    if (!actualizar) {
        await t
            .expect(Selector('span').withText('Resultado de la importación').visible).ok()
            .click(Selector('#BtnDescargarLogArchivos span').withText('Descargar archivo'))
            .expect(
                Selector('[class^="swal2-popup swal2-modal erp-swal-hgi360 erp-swal-h"] div')
                    .withText(MENSAJE_DESCARGA).visible
            ).ok()
            .click(Selector('button').withText('Confirmar'));
    }

    await t.click(Selector('#BtnAceptarPopupArchivos span, #BtnAceptarPopupArchivos div').withText('Aceptar'));
}

async function buscarYValidar(t, texto) {
    const limpiar = Selector(`${GRID} .dx-icon.dx-icon-clear`);
    if (await limpiar.visible) {
        await t.click(limpiar);
    }
    await t
        .typeText(buscador, texto, { replace: true })
        .expect(Selector('td').withText(texto).visible).ok(`No se encontró ${texto} en Actividades Eco`);
}

async function eliminarRegistroVisible(t) {
    await t
        .click(btnEliminarFila)
        .click(btnConfirmarEliminar)
        .wait(3000);
}

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);

    await importarActividadEco(t, ARCHIVO_IMPORTAR);
    await cerrarPestana360(t);

    await abrirMaestros360(t, 'Actividades Eco', 'terceros');
    await buscarYValidar(t, CODIGO_1);
    await buscarYValidar(t, CODIGO_2);
    await buscarYValidar(t, CODIGO_3);

    await importarActividadEco(t, ARCHIVO_ACTUALIZAR, true);
    await t
        .click(tabActividadesEco)
        .click('#BtnRefreshActividadesEconomicas .dx-icon.dx-icon-refresh');

    await buscarYValidar(t, CODIGO_1);
    await t.expect(Selector('td').withText(DESC_1).visible).ok(`No se actualizó ${CODIGO_1} a ${DESC_1}`);
    await eliminarRegistroVisible(t);

    await buscarYValidar(t, CODIGO_2);
    await t.expect(Selector('td').withText(DESC_2).visible).ok(`No se actualizó ${CODIGO_2} a ${DESC_2}`);
    await eliminarRegistroVisible(t);

    await buscarYValidar(t, CODIGO_3);
    await t.expect(Selector('td').withText(DESC_3).visible).ok(`No se actualizó ${CODIGO_3} a ${DESC_3}`);
    await eliminarRegistroVisible(t);

    await cerrarPestana360(t);
    await cerrarSesion360(t);
}

fixture `Prueba Archivos Actividades Eco - Test Hgi360`
    .page(testPhConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba Archivos Actividades Eco - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPhConfig, ingresarAplicacion);
});
