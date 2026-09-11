import { Selector } from 'testcafe';
import {
    abrirMaestros360,
    abrirMovimientos360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const iframeTab = Selector('iframe').withAttribute('id', /^iframe_tab_/);
const celdaSaldoBodega = Selector('#gridProductosSaldos .dx-data-row td[aria-colindex="2"]');

const PRODUCTO = '010202';
const BODEGA = '0 - GENERAL';
const BODEGA_FILTRO = '0';
const valorTomaFisica = 10;
const TX_AJUSTE_ENTRADA = 'AJUSTE ENTRADA';
const TX_AJUSTE_SALIDA = 'AJUSTE SALIDA';
const FILTRO_AJUSTE = 'ajuste';
const FILTRO_SALIDA = 'salida';
const OBSERVACION_TOMA_FISICA = 'PruebaObs';

const parseNumeroTexto = texto => parseFloat(String(texto).replace(/\./g, '').replace(/,/g, '.')) || 0;

const abrirTomaFisica = async t => {
    await t
        .click(Selector('a').withText('Movimiento'))
        .click(Selector('span').withText('INVENTARIO - TOMA FÍSICA'))
        .wait(1500)
        .switchToIframe(iframeTab)
        .wait(1500);
};

const filtrarYEditarProducto = async t => {
    await t
        .typeText('#gridProductos .dx-texteditor-input', PRODUCTO)
        .wait(2000)
        .click(Selector('#gridProductos [class^="dx-button-mode-contained dx-link dx-link-edit"]').nth(1));
};

const filtrarSaldoBodega = async t => {
    await t
        .click('#gridProductosSaldos .dx-button-content')
        .typeText('#gridProductosSaldos .dx-texteditor-input', BODEGA_FILTRO)
        .wait(2000);
};

const obtenerSaldoProducto = async () => {
    const texto = await celdaSaldoBodega.innerText;
    return parseNumeroTexto(texto);
};

const seleccionarTransaccionAjuste = async (t, valorSaldoProducto) => {
    if (valorTomaFisica < valorSaldoProducto) {
        await filtrarPor(t, FILTRO_AJUSTE);
        await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TX_AJUSTE_ENTRADA);

    } else {
        await filtrarPor(t, FILTRO_SALIDA);
        await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, TX_AJUSTE_SALIDA);

    }
};

const ingresarValorFisicoTomaFisica = async (t, indice, valor) => {
    const campo = `#txtTomaFisica_Detalle_Fisico_cursor_${indice}`;

    await t
        .click(campo)
        .pressKey('enter')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText(campo, String(valor))
        .pressKey('enter');
};

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirMaestros360(t, 'Productos');
        await filtrarYEditarProducto(t);
        await filtrarSaldoBodega(t);

        const valorSaldoProducto = await obtenerSaldoProducto();

        await t
            .click('#BtnGuardarProducto')
            .wait(2000);

        await cerrarPestana360(t);
        await abrirTomaFisica(t);

        await t
            .click('#TomaFisica_Bodega .dx-lookup-field')
            .click(Selector('.dx-item.dx-list-item').withText(BODEGA))
            .click(Selector('#BtnEliminarTF div').withText('Eliminar'))
            .click(Selector('button').withText('Aceptar'))
            .click('#txtTomaFisica_Detalle_Producto_1 .dx-button-content')
            .typeText('#txtFiltroCodigo_', PRODUCTO)
            .click(Selector('td').withText(PRODUCTO))
            .pressKey('enter');

        await ingresarValorFisicoTomaFisica(t, 1, valorTomaFisica);

        await t
            .typeText('#txtTomaFisica_Detalle_Observaciones_1 .dx-texteditor-input', OBSERVACION_TOMA_FISICA)
            .click('#txtTomaFisica_Detalle_Boton_1 .dx-button-content')
            .click(Selector('#BtnFinalizarTF span').withText('Finalizar'))
            .expect(Selector('.swal2-content div').withText('Se ha ejecutado el proceso de toma física correcta').exists).ok()
            .click(Selector('button').withText('Aceptar'));

        await cerrarPestana360(t);
        await abrirMovimientos360(t, 'Documentos');

        await t
            .click('#ListagridDocumentos .dx-icon.dx-icon-add')
            .click('#Documento_Transaccion .dx-lookup-field');

        await seleccionarTransaccionAjuste(t, valorSaldoProducto);

        await t
            .click(Selector('#Documento_Bodega .dx-lookup-field'))
            .click(Selector('.dx-item.dx-list-item').withText(BODEGA))
            .click(Selector('#BtnGuardarDocumento div').withText('Guardar'))
            .click(Selector('#BtnAjuste span').withText('AJUSTE'))
            .click(Selector('button').withText('Aceptar'))
            .expect(Selector('[class^="dx-overlay-content dx-toast-success dx-toast-conte"] div').withText('Documento guardado con exito').exists).ok();

        await cerrarPestana360(t);
        await abrirMaestros360(t, 'Productos');
        await filtrarYEditarProducto(t);
        await filtrarSaldoBodega(t);

        const saldoFinal = await obtenerSaldoProducto();

        await t.expect(saldoFinal).eql(valorTomaFisica);

        await t
            .click('#BtnGuardarProducto')
            .wait(2000);

        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Inventario - Toma Fisica - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Toma fisica y ajuste de inventario Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Inventario - Toma Fisica - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Toma fisica y ajuste de inventario Admin - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
