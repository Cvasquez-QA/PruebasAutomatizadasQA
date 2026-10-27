import { ClientFunction, Selector } from 'testcafe';
import {
    abrirMovimientos360,
    accionFilaGrid360,
    buscarEnGrid360,
    cerrarPestana360,
    cerrarSesion360,
    ingresarAplicacion
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { abrirMaestroPos360 } from '../../../Funciones/MenuMaestros360.js';
import {
    nuevoDocumento360,
    guardarDocumento360,
    numeroDesdeTexto,
    confirmarDialogo
} from '../../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Inventario - Toma Física en PosWeb (test.hgi360.com, AutPos). Mismo flujo que
// AdministrativoHgi360Web/2.Movimientos/Herramientas/Prueba_Inventario-TomaFisica.js:
// 1) Maestros > Productos > 010202 > pestaña Saldos: lee el saldo de la bodega 0.
// 2) Movimientos > Inventario - Toma Física, bodega 0 - GENERAL: borra la toma física anterior (si hay),
//    captura 010202 con físico 10 y observación, guarda la línea y Finaliza
//    ("Se ha ejecutado el proceso de toma física correctamente").
// 3) Movimientos > Documentos: documento de ajuste en la bodega 0 (53 AJUSTE ENTRADA si el físico es mayor
//    que el saldo, 52 AJUSTE SALIDA si es menor), Guardar y botón Ajuste: la app agrega la línea del producto
//    por la diferencia y muestra "Documento guardado con éxito".
// 4) El saldo del producto en la bodega 0 queda en 10.
// Pasos revisados en el navegador el 21-oct-2026: saldo inicial -440 -> ajuste 53-55 de entrada por 450 -> saldo 10;
// segunda vuelta: Eliminar de la toma física anterior, nueva toma con físico 10 y sin ajuste (saldo ya en 10).
// Nota: en la prueba de Admin la transacción está invertida (usa ENTRADA cuando el físico es menor que el saldo).

const PRODUCTO = '010202';
const BODEGA = '0 - GENERAL';
const CODIGO_BODEGA = '0';
const VALOR_TOMA_FISICA = 10;
const OBSERVACION = 'PruebaObs';
const TX_AJUSTE_ENTRADA = { filtro: 'ajuste', texto: '53 - AJUSTE ENTRADA' };
const TX_AJUSTE_SALIDA = { filtro: 'ajuste', texto: '52 - AJUSTE SALIDA' };

const opcionLista = texto => Selector('.dx-overlay-content .dx-list-item').filterVisible().withExactText(texto);
const toastExito = texto => Selector('.erp-toast[data-type="success"]').filterVisible().withText(texto);
const aviso = texto => Selector('.swal2-popup').filterVisible().withText(texto);

// ------------------------------------------------------------------ Saldo del producto

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

const filasProductos = Selector('[data-testid="gridProductos"]').filterVisible().find('tr.dx-data-row');
const pestanaSaldos = Selector('[role="tab"]').filterVisible().withExactText('Saldos');

/**
 * Busca el producto y pulsa Editar. El buscador del grid filtra con retraso y vuelve a dibujar las filas,
 * así que se espera a que solo quede la fila del producto y se reintenta el clic si la fila se reemplazó.
 */
async function editarProducto(t) {
    await buscarEnGrid360(t, 'gridProductos', PRODUCTO);
    for (const inicio = Date.now(); Date.now() - inicio < 15000;) {
        const filas = await filasProductos.count;
        if (filas === 1 && await filasProductos.nth(0).find('td').withExactText(PRODUCTO).exists) {
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

/** Maestros > Productos > Editar producto > pestaña Saldos: saldo de la bodega indicada. */
async function leerSaldoProducto(t) {
    await abrirMaestroPos360(t, 'Productos', 'productos');
    await editarProducto(t);
    await t
        .click(pestanaSaldos)
        .expect(Selector('#gridProductosSaldos').with({ timeout: 15000 }).visible).ok('No se ve la grid de saldos del producto')
        .wait(2000);
    const texto = await leerSaldoBodegaCliente(CODIGO_BODEGA);
    await t.expect(texto).notEql(null, `No se pudo leer el saldo del producto ${PRODUCTO}`);
    await cerrarPestana360(t);
    return numeroDesdeTexto(texto);
}

// ------------------------------------------------------------------ Toma física

// Las líneas grabadas de la toma física están en [data-testid="gridTomaFisicaConsulta"] (no en #gridTomaFisica,
// que solo tiene la línea de captura). Columnas: ID, Producto, Físico (input), Observaciones, Imprimir, Guardar, Eliminar.
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

async function confirmarSiHay(t, espera = 4000) {
    if (await confirmarDialogo.with({ timeout: espera }).exists) {
        await t.click(confirmarDialogo);
    }
}

async function hacerTomaFisica(t) {
    await abrirMovimientos360(t, 'Inventario - Toma Física');
    await t
        .expect(Selector('#TomaFisica_Bodega .dx-lookup-field').with({ timeout: 20000 }).visible).ok('No abrió Inventario - Toma Física')
        .click('#TomaFisica_Bodega .dx-lookup-field')
        .click(opcionLista(BODEGA).with({ timeout: 10000 }))
        .expect(Selector('#TomaFisica_Bodega').withText('GENERAL').exists).ok(`No quedó seleccionada la bodega ${BODEGA}`)
        .wait(2500);

    // Toma física anterior de la bodega (de otra ejecución): se elimina
    if ((await leerLineasTomaFisica()).length > 0) {
        await t
            .click(Selector('#BtnEliminarTF').filterVisible())
            .expect(aviso('Deseas eliminar toda la información').with({ timeout: 10000 }).exists)
            .ok('No apareció la confirmación para eliminar la toma física')
            .click(confirmarDialogo)
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
        .typeText(fisico, String(VALOR_TOMA_FISICA), { replace: true })
        .pressKey('enter')
        .typeText('#txtTomaFisica_Detalle_Observaciones_cursor_1', OBSERVACION, { replace: true })
        .click('#txtTomaFisica_Detalle_Boton_1');
    // El aviso "Producto agregado exitosamente a la toma física" dura poco: se valida la línea grabada
    let grabada = null;
    for (const inicio = Date.now(); !grabada && Date.now() - inicio < 15000;) {
        grabada = (await leerLineasTomaFisica()).find(l => l.producto === PRODUCTO);
        if (!grabada) {
            await t.wait(1000);
        }
    }
    await t.expect(grabada).ok(`No se guardó la línea del producto ${PRODUCTO} en la toma física`);

    await t.click(Selector('#BtnFinalizarTF').filterVisible());
    await t
        .expect(aviso('Se ha ejecutado el proceso de toma física correctamente').with({ timeout: 30000 }).exists)
        .ok('No apareció el mensaje de toma física finalizada')
        .click(confirmarDialogo)
        .wait(1500);

    const lineas = await leerLineasTomaFisica();
    const linea = lineas.find(l => l.producto === PRODUCTO);
    await t
        .expect(linea).ok(`La toma física no muestra la línea del producto ${PRODUCTO}`)
        .expect(numeroDesdeTexto(linea && linea.fisico)).eql(VALOR_TOMA_FISICA, 'El físico de la línea no es el capturado');
    await cerrarPestana360(t);
}

// ------------------------------------------------------------------ Ajuste de inventario

// Detalle del documento: [data-testid="gridDocumentosConsulta"]. El encabezado de columnas (Producto, Cantidad...)
// puede quedar fuera de ese elemento, por eso se busca en los contenedores superiores.
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


async function ajustarInventario(t, saldoInicial) {
    const tx = VALOR_TOMA_FISICA > saldoInicial ? TX_AJUSTE_ENTRADA : TX_AJUSTE_SALIDA;
    const diferencia = Math.abs(VALOR_TOMA_FISICA - saldoInicial);

    await nuevoDocumento360(t, tx.filtro, tx.texto);
    await t
        .click('#Documento_Bodega .dx-lookup-field')
        .click(opcionLista(BODEGA).with({ timeout: 10000 }))
        .expect(Selector('#Documento_Bodega').withText(BODEGA).exists).ok(`No quedó la bodega ${BODEGA} en el documento`);
    await guardarDocumento360(t);

    await t
        .click(Selector('#BtnAjuste_btn').filterVisible())
        .expect(aviso('Deseas Realizar el Ajuste de Inventario').with({ timeout: 10000 }).exists)
        .ok('No apareció la confirmación del ajuste de inventario')
        .click(confirmarDialogo)
        .wait(1500);

    let linea = null;
    for (const inicio = Date.now(); !linea && Date.now() - inicio < 15000;) {
        linea = (await leerLineasDocumento()).find(l => l.producto === PRODUCTO);
        if (!linea) {
            await t.wait(1000);
        }
    }
    await t
        .expect(linea).ok(`El ajuste no agregó la línea del producto ${PRODUCTO}`)
        .expect(numeroDesdeTexto(linea && linea.cantidad)).eql(diferencia,
            `La cantidad del ajuste debería ser ${diferencia} (físico ${VALOR_TOMA_FISICA}, saldo ${saldoInicial})`);
    await cerrarPestana360(t);
}

// ------------------------------------------------------------------ Prueba

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    const saldoInicial = await leerSaldoProducto(t);
    await hacerTomaFisica(t);
    if (saldoInicial !== VALOR_TOMA_FISICA) {
        await ajustarInventario(t, saldoInicial);
    }
    const saldoFinal = await leerSaldoProducto(t);
    await t.expect(saldoFinal).eql(VALOR_TOMA_FISICA,
        `El saldo de ${PRODUCTO} en la bodega ${CODIGO_BODEGA} debería quedar en ${VALOR_TOMA_FISICA} (inicial ${saldoInicial}, final ${saldoFinal})`);
    await cerrarSesion360(t);
}

fixture `Prueba Inventario - Toma Fisica testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Toma fisica y ajuste de inventario Pos - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
