import { ClientFunction, Selector } from 'testcafe';
import {
    ingresarAplicacion,
    abrirMovimientos360,
    cerrarSesion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../../Funciones/HelpersMaestros360.js';
import { numeroDesdeTexto } from '../../../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Movimientos > Consulta Productos (test.hgi360.com, AutPos).
// 1) Consulta el producto 010203 (campo Código / Alterno / EAN + botón Consultar).
// 2) Valida nombre y código, que se muestre la imagen del producto (no la imagen por defecto),
//    el Precio, la grid de bodegas con existencias y que la Existencia Total sea la suma de las bodegas.
// 3) Valida que unos 10 segundos después la consulta se limpie sola (nombre, precio, existencia en "---",
//    grid sin datos e imagen por defecto).
// Pasos revisados en el navegador el 21-oct-2026: el resultado se limpió a los 10 s.

const PRODUCTO = '010203';
const SIN_DATO = '---';
const LIMPIEZA_SEGUNDOS = 10;
const TOLERANCIA_SEGUNDOS = 3;

const campoCodigo = Selector('#txtCodigo_ConsultaProductos input.dx-texteditor-input');
const btnConsultar = Selector('#BtnConsultar_ConsultaProductos');
const btnSalir = Selector('#BtnSalirAdmin_ConsultaProductos');
const lblNombre = Selector('#lblNombre_ConsultaProductos');
const lblCodigo = Selector('#lblCodigo_ConsultaProductos');
const lblPrecio = Selector('#lblPrecio_ConsultaProductos');
const lblExistencia = Selector('#lblExistencia_ConsultaProductos');
const imagen = Selector('#ImagenProd_ConsultaProductos');

const leerConsulta = ClientFunction(() => {
    const texto = id => {
        const e = document.getElementById(id);
        return e ? e.innerText.replace(/\s+/g, ' ').trim() : null;
    };
    const img = document.getElementById('ImagenProd_ConsultaProductos');
    const grid = document.getElementById('GridBodegas_ConsultaProductos');
    return {
        nombre: texto('lblNombre_ConsultaProductos'),
        precio: texto('lblPrecio_ConsultaProductos'),
        existencia: texto('lblExistencia_ConsultaProductos'),
        imagen: img ? img.getAttribute('src') : '',
        imagenAncho: img ? img.naturalWidth : 0,
        bodegas: grid ? Array.from(grid.querySelectorAll('tr.dx-data-row')).map(f => Array.from(f.cells).map(c => c.innerText.trim())) : []
    };
});

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    await abrirMovimientos360(t, 'Consulta Productos');
    await t.expect(campoCodigo.with({ timeout: 20000 }).visible).ok('No abrió Consulta Productos');

    // Estado sin consulta (imagen por defecto)
    const inicial = await leerConsulta();
    await t.expect(inicial.nombre).eql(SIN_DATO, 'La consulta ya tenía un producto cargado');

    // 1) Consultar
    await t
        .typeText(campoCodigo, PRODUCTO, { replace: true })
        .click(btnConsultar)
        .expect(lblNombre.innerText).notEql(SIN_DATO, `No se cargó el producto ${PRODUCTO}`, { timeout: 15000 });
    const inicioMuestra = Date.now();

    // 2) Datos del producto
    const consulta = await leerConsulta();
    await t
        .expect(lblCodigo.innerText).contains(PRODUCTO, `El código mostrado no es ${PRODUCTO}`)
        // Imagen
        .expect(imagen.visible).ok('No se ve la imagen del producto')
        .expect(consulta.imagen).match(/^data:image\/|^https?:\/\//, 'La imagen no tiene contenido')
        .expect(consulta.imagen).notEql(inicial.imagen, 'Se muestra la imagen por defecto, no la del producto')
        .expect(consulta.imagenAncho).gt(0, 'La imagen del producto no cargó')
        // Precio
        .expect(lblPrecio.innerText).notEql(SIN_DATO, 'No se muestra el precio')
        .expect(numeroDesdeTexto(consulta.precio)).gt(0, `El precio no es válido (${consulta.precio})`);

    // Bodegas
    await t.expect(consulta.bodegas.length).gt(0, 'La grid de bodegas no tiene datos');
    for (const [bodega, descripcion, cantidad] of consulta.bodegas) {
        await t
            .expect(bodega).ok('Hay una bodega sin código en la grid')
            .expect(descripcion).ok(`La bodega ${bodega} no tiene descripción`)
            .expect(cantidad).ok(`La bodega ${bodega} no tiene cantidad`);
    }
    const sumaBodegas = consulta.bodegas
        .filter(([, , cantidad]) => /\d/.test(cantidad))
        .reduce((total, [, , cantidad]) => total + numeroDesdeTexto(cantidad), 0);
    await t
        .expect(lblExistencia.innerText).notEql(SIN_DATO, 'No se muestra la existencia total')
        .expect(numeroDesdeTexto(consulta.existencia)).eql(sumaBodegas,
            `La Existencia Total (${consulta.existencia}) no es la suma de las bodegas (${sumaBodegas})`);

    // 3) La consulta se limpia sola a los 10 segundos
    const segundosMostrado = (Date.now() - inicioMuestra) / 1000;
    if (segundosMostrado < LIMPIEZA_SEGUNDOS - TOLERANCIA_SEGUNDOS) {
        await t.expect(lblNombre.innerText).notEql(SIN_DATO,
            `La consulta se limpió antes de tiempo (${segundosMostrado.toFixed(1)} s)`);
    }
    const esperaMaxima = Math.max(1000, (LIMPIEZA_SEGUNDOS + TOLERANCIA_SEGUNDOS) * 1000 - (Date.now() - inicioMuestra));
    await t.expect(lblNombre.innerText).eql(SIN_DATO,
        `El producto se sigue mostrando ${LIMPIEZA_SEGUNDOS + TOLERANCIA_SEGUNDOS} s después de consultarlo`, { timeout: esperaMaxima });
    const segundosLimpieza = (Date.now() - inicioMuestra) / 1000;
    const limpia = await leerConsulta();
    await t
        .expect(segundosLimpieza).gte(LIMPIEZA_SEGUNDOS - TOLERANCIA_SEGUNDOS,
            `La consulta se limpió a los ${segundosLimpieza.toFixed(1)} s, antes de los ${LIMPIEZA_SEGUNDOS} s`)
        .expect(limpia.precio).eql(SIN_DATO, 'El precio se sigue mostrando')
        .expect(limpia.existencia).eql(SIN_DATO, 'La existencia se sigue mostrando')
        .expect(limpia.bodegas.length).eql(0, 'La grid de bodegas se sigue mostrando')
        .expect(limpia.imagen).eql(inicial.imagen, 'La imagen del producto se sigue mostrando');

    // Salir
    await t
        .click(btnSalir)
        .expect(Selector('#cont_ppal_consulta_prod').exists).notOk('No salió de Consulta Productos', { timeout: 10000 });
    await cerrarSesion360(t);
}

fixture `Prueba Consulta Productos testERP Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Consulta del producto 010203 y limpieza a los 10 segundos - Test Hgi360', async t => {
    await ejecutarPrueba(t, testPosWebConfig);
});
