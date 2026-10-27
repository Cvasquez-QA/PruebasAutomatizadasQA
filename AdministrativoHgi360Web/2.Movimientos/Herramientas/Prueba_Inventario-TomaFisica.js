import { ClientFunction, Selector } from 'testcafe';
import {
    abrirMaestros360,
    abrirMovimientos360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    limpiarCacheChromeTestCafe,
    parseTextoNumerico,
    seleccionarOpcion
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig, hgiAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Inventario - Toma Física en Administrativo web (React). Solo usa los helpers de Admin (HelpersHgi360Web.js).
// 1) Maestros > Productos > 010202 > pestaña Saldos: lee el saldo de la bodega 0.
// 2) Movimientos > Inventario - Toma Física, bodega 0 - GENERAL: elimina la toma física anterior (si hay),
//    captura 010202 con el físico y la observación, guarda la línea y Finaliza
//    ("Se ha ejecutado el proceso de toma física correctamente").
// 3) Movimientos > Documentos: ajuste en la bodega 0 (53 AJUSTE ENTRADA si el físico es mayor que el saldo,
//    52 AJUSTE SALIDA si es menor), Guardar y botón Ajuste: la app agrega la línea del producto por la diferencia.
// 4) El saldo del producto en la bodega 0 queda igual al físico.
// El físico alterna entre 10 y 20 (si el saldo ya es 10 se usa 20) para que siempre haya ajuste.
// Pasos revisados en el navegador el 22-oct-2026 con AutAdmin: saldo 10, físico 20, ajuste 53-57 por 10, saldo 20.

const PRODUCTO = '010202';
const BODEGA = '0 - GENERAL';
const CODIGO_BODEGA = '0';
const VALORES_FISICO = [10, 20];
const OBSERVACION = 'PruebaObs';
const TX_AJUSTE_ENTRADA = /^\s*53 - AJUSTE ENTRADA\s*$/;
const TX_AJUSTE_SALIDA = /^\s*52 - AJUSTE SALIDA\s*$/;
const FILTRO_AJUSTE = 'ajuste';

const confirmar = Selector('button.swal2-confirm').filterVisible();
const aviso = texto => Selector('.swal2-popup').filterVisible().withText(texto);
const toastExito = texto => Selector('.erp-toast[data-type="success"]').filterVisible().withText(texto);
const opcionLista = texto => Selector('.dx-overlay-content .dx-list-item').filterVisible().withExactText(texto);

// ------------------------------------------------------------------ Saldo del producto

const filasProductos = Selector('[data-testid="gridProductos"]').filterVisible().find('tr.dx-data-row');
const pestanaSaldos = Selector('[role="tab"]').filterVisible().withExactText('Saldos');

const leerSaldoBodegaCliente = ClientFunction(bodega => {
    const grid = document.getElementById('gridProductosSaldos');
    if (!grid || !grid.querySelector('.dx-header-row')) {
        return null;
    }
    const encabezados = Array.from(grid.querySelectorAll('.dx-header-row td')).map(td => td.innerText.trim().toLowerCase());
    const iSaldo = encabezados.indexOf('saldo');
    const iBodega = encabezados.indexOf('bodega');
    if (iSaldo < 0 || iBodega < 0) {
        return null;
    }
    const fila = Array.from(grid.querySelectorAll('tr.dx-data-row')).find(f => f.cells[iBodega] && f.cells[iBodega].innerText.trim() === bodega);
    // Sin fila de la bodega el producto no tiene movimientos allí: saldo 0
    return fila ? fila.cells[iSaldo].innerText.trim() : '0';
});

/**
 * Busca el producto y pulsa Editar. El buscador del grid filtra con retraso y vuelve a dibujar las filas,
 * así que se espera a que solo quede la fila del producto y se reintenta el clic si la fila se reemplazó.
 */
async function editarProducto(t) {
    await buscarEnGrid360(t, 'gridProductos', PRODUCTO);
    for (const inicio = Date.now(); Date.now() - inicio < 15000;) {
        if (await filasProductos.count === 1 && await filasProductos.nth(0).find('td').withExactText(PRODUCTO).exists) {
            break;
        }
        await t.wait(500);
    }
    await t.wait(1000);
    for (let intento = 1; intento <= 3; intento++) {
        try {
            await accionFilaGrid360(t, 'gridProductos', PRODUCTO, 'Editar');
        } catch (e) {
            if (intento === 3) {
                throw e;
            }
        }
        if (await pestanaSaldos.with({ timeout: 10000 }).exists) {
            return;
        }
        await t.wait(1500);
    }
    await t.expect(pestanaSaldos.exists).ok(`No se abrió la edición del producto ${PRODUCTO}`);
}

/** Maestros > Productos > Editar producto > pestaña Saldos: saldo de la bodega 0. */
async function leerSaldoProducto(t) {
    await abrirMaestros360(t, 'Productos', 'productos');
    await editarProducto(t);
    await t
        .click(pestanaSaldos)
        .expect(Selector('#gridProductosSaldos').with({ timeout: 15000 }).visible).ok('No se ve la grid de saldos del producto')
        .wait(2000);
    const texto = await leerSaldoBodegaCliente(CODIGO_BODEGA);
    await t.expect(texto).notEql(null, `No se pudo leer el saldo del producto ${PRODUCTO}`);
    await cerrarPestana360(t);
    return parseTextoNumerico(texto);
}

// ------------------------------------------------------------------ Toma física

// Líneas grabadas: [data-testid="gridTomaFisicaConsulta"] (la grid #gridTomaFisica solo tiene la línea de captura).
// Columnas: ID, Producto, Físico (input), Observaciones, Imprimir, Guardar, Eliminar.
const leerLineasTomaFisica = ClientFunction(() => {
    const grid = document.querySelector('[data-testid="gridTomaFisicaConsulta"]');
    if (!grid) {
        return [];
    }
    return Array.from(grid.querySelectorAll('tr.dx-data-row')).map(f => {
        const celda = n => f.querySelector(`td[aria-colindex="${n}"]`);
        const fisico = celda(3) && celda(3).querySelector('input.dx-texteditor-input');
        return {
            producto: celda(2) ? celda(2).innerText.trim() : '',
            fisico: fisico ? fisico.value : (celda(3) ? celda(3).innerText.trim() : '')
        };
    }).filter(l => l.producto);
});

async function esperarLineaTomaFisica(t, mensaje) {
    let linea = null;
    for (const inicio = Date.now(); !linea && Date.now() - inicio < 15000;) {
        linea = (await leerLineasTomaFisica()).find(l => l.producto === PRODUCTO);
        if (!linea) {
            await t.wait(1000);
        }
    }
    await t.expect(linea).ok(mensaje);
    return linea;
}

async function hacerTomaFisica(t, valorFisico) {
    await abrirMovimientos360(t, 'Inventario - Toma Física');
    await t
        .expect(Selector('#TomaFisica_Bodega .dx-lookup-field').with({ timeout: 20000 }).visible).ok('No abrió Inventario - Toma Física')
        .click('#TomaFisica_Bodega .dx-lookup-field')
        .click(opcionLista(BODEGA).with({ timeout: 10000 }))
        .expect(Selector('#TomaFisica_Bodega').withText('GENERAL').exists).ok(`No quedó seleccionada la bodega ${BODEGA}`)
        .wait(3000);

    // Toma física anterior de la bodega: se elimina ("¿Deseas eliminar toda la información?")
    if ((await leerLineasTomaFisica()).length > 0) {
        await t
            .click(Selector('#BtnEliminarTF').filterVisible())
            .expect(aviso('Deseas eliminar toda la información').with({ timeout: 10000 }).exists)
            .ok('No apareció la confirmación para eliminar la toma física')
            .click(confirmar)
            .expect(toastExito('Se eliminó la información de la toma física').with({ timeout: 15000 }).exists)
            .ok('No se eliminó la toma física anterior de la bodega')
            .wait(1500);
        await t.expect((await leerLineasTomaFisica()).length).eql(0, 'La toma física anterior sigue con líneas');
    }

    // Línea: producto + Enter (carga el producto y pasa a Físico), físico + Enter (pasa a Observaciones)
    const producto = Selector('#txtTomaFisica_Detalle_Producto_cursor_1');
    const fisico = Selector('#txtTomaFisica_Detalle_Fisico_cursor_1');
    await t
        .typeText(producto, PRODUCTO, { replace: true })
        .pressKey('enter')
        .expect(fisico.focused).ok(`No cargó el producto ${PRODUCTO} en la toma física`, { timeout: 10000 })
        .typeText(fisico, String(valorFisico), { replace: true })
        .pressKey('enter')
        .typeText('#txtTomaFisica_Detalle_Observaciones_cursor_1', OBSERVACION, { replace: true })
        .click(Selector('#txtTomaFisica_Detalle_Boton_1').filterVisible());
    await esperarLineaTomaFisica(t, `No se guardó la línea del producto ${PRODUCTO} en la toma física`);

    await t
        .click(Selector('#BtnFinalizarTF').filterVisible())
        .expect(aviso('Se ha ejecutado el proceso de toma física correctamente').with({ timeout: 30000 }).exists)
        .ok('No apareció el mensaje de toma física finalizada')
        .click(confirmar)
        .wait(1500);
    const linea = await esperarLineaTomaFisica(t, `La toma física no muestra la línea del producto ${PRODUCTO}`);
    await t.expect(parseTextoNumerico(linea.fisico)).eql(valorFisico, 'El físico de la línea no es el capturado');
    await cerrarPestana360(t);
}

// ------------------------------------------------------------------ Ajuste de inventario

// Detalle del documento: [data-testid="gridDocumentosConsulta"]; el encabezado de columnas queda fuera de ese
// elemento, por eso se busca en los contenedores superiores.
const leerLineasDocumento = ClientFunction(() => {
    const grid = document.querySelector('[data-testid="gridDocumentosConsulta"]');
    if (!grid) {
        return [];
    }
    let contenedor = grid;
    while (contenedor && !contenedor.querySelector('.dx-header-row')) {
        contenedor = contenedor.parentElement;
    }
    const encabezado = contenedor ? contenedor.querySelector('.dx-header-row') : null;
    const columnas = encabezado ? Array.from(encabezado.cells).map(td => td.innerText.replace(/\s+/g, ' ').trim().toLowerCase()) : [];
    const iProducto = columnas.indexOf('producto');
    const iCantidad = columnas.indexOf('cantidad');
    return Array.from(grid.querySelectorAll('tr.dx-data-row')).map(f => ({
        producto: iProducto >= 0 && f.cells[iProducto] ? f.cells[iProducto].innerText.trim() : '',
        cantidad: iCantidad >= 0 && f.cells[iCantidad] ? f.cells[iCantidad].innerText.trim() : ''
    }));
});

async function ajustarInventario(t, saldoInicial, valorFisico) {
    const transaccion = valorFisico > saldoInicial ? TX_AJUSTE_ENTRADA : TX_AJUSTE_SALIDA;
    const diferencia = Math.abs(valorFisico - saldoInicial);

    // En la lista de documentos el botón Nuevo es el "+" #BtnNuevoDocumento
    await abrirMovimientos360(t, 'Documentos');
    await t
        .expect(Selector('.erp-page-skeleton-toolbar').filterVisible().exists).notOk({ timeout: 20000 })
        .click(Selector('#BtnNuevoDocumento_btn, #BtnNuevoDocumento').filterVisible().with({ timeout: 15000 }).nth(0))
        .expect(Selector('#Documento_Transaccion .dx-lookup-field').with({ timeout: 15000 }).visible)
        .ok('No se abrió el formulario de documentos')
        .click('#Documento_Transaccion .dx-lookup-field');
    await filtrarPor(t, FILTRO_AJUSTE);
    await seleccionarOpcion(t, transaccion);
    await t
        .wait(1500)
        .click('#Documento_Bodega .dx-lookup-field')
        .click(opcionLista(BODEGA).with({ timeout: 10000 }))
        .expect(Selector('#Documento_Bodega').withText(BODEGA).exists).ok(`No quedó la bodega ${BODEGA} en el documento`);

    // Guardar el encabezado
    const numero = Selector('#txtDocumento .dx-texteditor-input');
    await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
    if (!await numero.value) {
        await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(3000);
    }
    await t.expect(numero.value).ok('El documento de ajuste no quedó guardado (sin número)');

    // Ajuste: la app agrega la línea del producto por la diferencia entre el físico y el saldo
    await t
        .click(Selector('#BtnAjuste_btn').filterVisible())
        .expect(aviso('Deseas Realizar el Ajuste de Inventario').with({ timeout: 10000 }).exists)
        .ok('No apareció la confirmación del ajuste de inventario')
        .click(confirmar);

    let linea = null;
    for (const inicio = Date.now(); !linea && Date.now() - inicio < 20000;) {
        linea = (await leerLineasDocumento()).find(l => l.producto === PRODUCTO);
        if (!linea) {
            await t.wait(1000);
        }
    }
    await t
        .expect(linea).ok(`El ajuste no agregó la línea del producto ${PRODUCTO}`)
        .expect(parseTextoNumerico(linea && linea.cantidad)).eql(diferencia,
            `La cantidad del ajuste debería ser ${diferencia} (físico ${valorFisico}, saldo ${saldoInicial})`);
    await cerrarPestana360(t);
}

// ------------------------------------------------------------------ Prueba

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    const saldoInicial = await leerSaldoProducto(t);
    const valorFisico = saldoInicial === VALORES_FISICO[0] ? VALORES_FISICO[1] : VALORES_FISICO[0];

    await hacerTomaFisica(t, valorFisico);
    await ajustarInventario(t, saldoInicial, valorFisico);

    const saldoFinal = await leerSaldoProducto(t);
    await t.expect(saldoFinal).eql(valorFisico,
        `El saldo de ${PRODUCTO} en la bodega ${CODIGO_BODEGA} debería quedar en ${valorFisico} (inicial ${saldoInicial}, final ${saldoFinal})`);
    await cerrarSesion360(t);
}

fixture `Prueba Inventario - Toma Fisica - Test Hgi360`
    .page(testAdminConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Toma fisica y ajuste de inventario Admin - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig);
});