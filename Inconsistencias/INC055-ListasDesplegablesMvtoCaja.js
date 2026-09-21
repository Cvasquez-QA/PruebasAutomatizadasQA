import { Selector } from 'testcafe';
import * as HelpersHgi360 from '../../Funciones/HelpersHgi360.js';
import * as HelpersHappgi from '../../Funciones/HelpersHappgi.js';
import { hgi360PosConfig } from '../../ParametrosPruebas/Hgi360Pos8888.js';

/** Hgi360 (test/mi) → HelpersHgi360; Happgi y demás → HelpersHappgi */
const helpersDe = (config) =>
    String(config?.pagina || '').toLowerCase().includes('hgi360')
        ? HelpersHgi360
        : HelpersHappgi;

let abrirMovimientoPos = HelpersHappgi.abrirMovimientoPos;
let cerrarSesion = HelpersHappgi.cerrarSesion;
let ingresarAplicacion = HelpersHappgi.ingresarAplicacion;

const usarHelpersDe = (config) => {
    const h = helpersDe(config);
    const es360 = String(config?.pagina || '').toLowerCase().includes('hgi360');
    abrirMovimientoPos = es360 ? h.abrirMovimientos360 : h.abrirMovimientoPos;
    cerrarSesion = es360 ? (h.cerrarSesion360 || HelpersHgi360.cerrarSesion360) : h.cerrarSesion;
    ingresarAplicacion = h.ingresarAplicacion;
};

async function ejecutarPrueba(t, config) {
    usarHelpersDe(config);
    await ingresarAplicacion(t, config);
    await abrirMovimientoPos(t, 'Punto de Venta');
    await t
        .wait(2000)
        .click('#modalPuntoDeVenta_Caja .dx-lookup-field')
        .click(Selector('[data-bind="dxControlsDescendantBindings: true"] div').withText(config.caja).nth(8))
        .click(Selector('#PuntoDeVenta_ModalSeleccionarCaja_BtnIngresar span').withText('Ingresar'))
        .wait(6000)
        .click(Selector('#BtnPuntoDeVenta_RetiroParcial div').withText('Retiro parcial'))
        .wait(2000)
        .pressKey('enter')
        .expect(Selector('[class^="dx-row dx-data-row dx-row-lines dx-column-lines dx"] td').nth(1).focused).ok('No se desplazó al segundo campo, por lo que se desplegó o hubo un error con la lista')
        .wait(4000)
        .click(Selector('#BtnCancelarRetiroCajaMov_puntoVenta span').withText('Cancelar'))
        .wait(1500)
        .click(Selector('#PuntoDeVenta_BtnSalirFullPantalla div i'))
        .wait(2000)
        .switchToMainWindow()
        .click(Selector('#PuntoDeVenta_BtnSalir div').withText('Salir'))
        .wait(3000)
        .switchToMainWindow();
    await cerrarSesion(t);
}

fixture `Prueba INC055 mipos POS`
    .page(hgi360PosConfig.pagina);

test('Prueba INC055 validar desplegable en PV con Enter mipos', async t => {
    await ejecutarPrueba(t, hgi360PosConfig);
});
