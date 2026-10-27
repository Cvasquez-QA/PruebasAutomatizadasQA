import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, limpiarCacheChromeTestCafe } from '../Funciones/HelpersHgi360Web.js';
import {
    agregarLineaDocumento,
    cargarDocumento360,
    editarCantidadLineaDocumento,
    eliminarDocumentoActual360,
    esperarLineasDocumento,
    guardarDocumento360,
    nuevoDocumento360
} from '../Funciones/HelpersDocumentos360.js';
import { testPosWebConfig } from '../ParametrosPruebas/ParametrosPruebas.js';

/**
 * INC035 - Documento POS de la TX 9598 con fecha de vencimiento hoy, descuento 10 y cuatro líneas.
 * Se editan las cantidades de las dos primeras líneas (2 y 3) y, al volver a cargar el documento,
 * deben conservarse. El documento se elimina al final.
 */

const LINEAS = [
    { producto: '01QA', cantidad: '1', valor: '1000' },
    { producto: '02', cantidad: '2', valor: '2000' },
    { producto: '03', cantidad: '3', valor: '3000' },
    { producto: '04', cantidad: '4', valor: '4000' }
];

const guardarEncabezado = async t => {
    await t.click(Selector('#BtnGuardarDocumento_btn').filterVisible()).wait(2500);
};

fixture `Prueba Documentos Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .afterEach(async t => {
        await limpiarCacheChromeTestCafe(t);
    });

test('Prueba CRUD Documentos Pos - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    await nuevoDocumento360(t, '9598', '9598');
    const numero = await guardarDocumento360(t);

    try {
        const hoy = new Date().toISOString().split('T')[0];
        await t
            .typeText('#txtDocumento_Fecha_Vence .dx-texteditor-input', hoy, { replace: true })
            .pressKey('enter')
            .typeText('#txtDocumento_Descuento .dx-texteditor-input', '10', { replace: true })
            .pressKey('tab');
        await guardarEncabezado(t);

        for (const linea of LINEAS) {
            await agregarLineaDocumento(t, linea.producto, { cantidad: linea.cantidad, valor: linea.valor });
        }
        await guardarEncabezado(t);

        await cargarDocumento360(t, numero);
        await esperarLineasDocumento(t, LINEAS.length, 'El documento recargado no tiene las cuatro líneas');
        const editadas = (await esperarLineasDocumento(t, LINEAS.length)).slice(0, 2).map(linea => linea.producto);
        await editarCantidadLineaDocumento(t, 0, '2');
        await editarCantidadLineaDocumento(t, 1, '3');
        await guardarEncabezado(t);

        await cargarDocumento360(t, numero);
        const lineas = await esperarLineasDocumento(t, LINEAS.length, 'El documento recargado no tiene las cuatro líneas');
        const cantidadDe = producto => (lineas.find(linea => linea.producto === producto) || { num: {} }).num.cantidad;
        await t
            .expect(cantidadDe(editadas[0])).eql(2, `No se conservó la cantidad editada del producto ${editadas[0]}`)
            .expect(cantidadDe(editadas[1])).eql(3, `No se conservó la cantidad editada del producto ${editadas[1]}`);
    } finally {
        await eliminarDocumentoActual360(t);
    }
    await cerrarSesion360(t);
});
