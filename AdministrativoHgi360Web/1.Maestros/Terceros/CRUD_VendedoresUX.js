import { Selector } from 'testcafe';
import {
    ejecutarCrudMaestro,
    prepararNavegador360,
    limpiarCache360,
    llenarCampos,
    elegirOpcion
} from '../../../Funciones/HelpersMaestros360.js';
import {
    accionFilaGrid360,
    buscarEnGrid360,
    eliminarFilaGrid360,
    escribirCampoPopup360,
    filaGrid360,
    guardarPopup360,
    popupEdicion360
} from '../../../Funciones/HelpersHgi360Web.js';
import { testAdminConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';

// Vendedores - test.hgi360.com (Maestros > terceros).
// Selectores validados en el navegador el 16-oct-2026. El flujo (crear, buscar, editar, eliminar)
// está en Funciones/HelpersMaestros360.js.
const MAESTRO = {
    maestro: 'Vendedores',
    grupo: 'terceros',
    grid: 'gridVendedores',
    guardar: 'BtnGuardarVendedor_btn',
    campoCodigo: 'txtVendedor_Codigo',
    codigo: 'QAVEN1',
    crear: [
        { id: 'txtVendedores_Nombre', valor: 'VENDEDORCITO' },
        { id: 'txtVendedores_ReporteA', tipo: 'lookup', filtro: 'General', opcion: '0 - GENERAL' },
        { id: 'txtVendedores_Sucursal', tipo: 'lookup', filtro: 'General', opcion: '0 - GENERAL' },
        { id: 'txtVendedores_Activo', tipo: 'check' },
        { id: 'txtVendedores_Cargo', tipo: 'lookup', opcion: '0 - GENERAL' },
        { id: 'txtVendedores_ListaPr', valor: '1' },
        { id: 'txtVendedores_Referencia', tipo: 'lookup', opcion: '1 - HGI Administrativo' },
        { id: 'txtVendedores_Dato', valor: 'DatoQA' }
    ],
    editar: [
        { id: 'txtVendedores_Nombre', valor: 'Vendedor Pérez' }
    ],
    validarEditado: 'Vendedor Pérez',
    antesDeEliminar: crudComisionesVendedor
};

// Pestañas Comisión General y Comisión F.Pago (popup "Edit form"). Validado en el navegador el 17-nov-2026.
// Los porcentajes usan coma decimal: se usan valores enteros para no depender del separador.
const COMISION_GENERAL = {
    pestana: 'tabs_vendedores_ComisionGeneral',
    grid: 'gridVendedoresComisionGeneral',
    tipo: '0 - GENERAL',
    valorVenta: '1000',
    valorVentaEnGrid: '1000,00',
    comision: '2',
    // El grid separa el % con un espacio no separable (U+00A0): se busca con \s
    comisionEnGrid: /2,000\s%/,
    comisionEdit: '3',
    comisionEditEnGrid: /3,000\s%/
};
const COMISION_FPAGO = {
    pestana: 'tabs_vendedores_ComisionFPago',
    grid: 'gridVendedoresComisionFPago',
    formaPago: '2 - Transferencia',
    formaPagoEnGrid: 'Transferencia',
    comision: '2',
    comisionEnGrid: /2,000\s%/,
    comisionEdit: '3',
    comisionEditEnGrid: /3,000\s%/
};

const lookupPopup = campo => popupEdicion360.find(`.dx-lookup-field[id$="_${campo}"]`);
const toastVisible = Selector('.erp-toast').filterVisible();
/*
// El aviso de "Registro ... con éxito" puede tapar el botón Guardar del popup: se espera a que se vaya.
const esperarSinAvisos = async t => {
    await t.expect(toastVisible.exists).notOk('El aviso de la aplicación no desapareció', { timeout: 15000 });
};
*/
const abrirPopupNuevo = async (t, grid) => {
    await t
        .click(Selector(`[data-testid="${grid}"] [aria-label="Agregar una fila"]`).filterVisible())
        .expect(popupEdicion360.with({ timeout: 10000 }).exists).ok(`No se abrió el popup de ${grid}`);
};

/** Borra los registros de prueba que hayan quedado de una corrida anterior que falló. */
const limpiarFilasPrevias = async (t, grid, texto) => {
    for (let i = 0; i < 10 && await filaGrid360(grid, texto).with({ timeout: 3000 }).exists; i++) {
        await accionFilaGrid360(t, grid, texto, 'Eliminar');
        await t.click(Selector('button.swal2-confirm').filterVisible().with({ timeout: 10000 })).wait(2000);
    }
};

/** Crea, edita y elimina un registro en Comisión General y otro en Comisión F.Pago del vendedor de prueba. */
async function crudComisionesVendedor(t, m) {
    await buscarEnGrid360(t, m.grid, m.codigo);
    await accionFilaGrid360(t, m.grid, m.codigo, 'Editar');

    // Comisión General
    const cg = COMISION_GENERAL;
    await llenarCampos(t, [{ id: cg.pestana, tipo: 'pestana' }]);
    await limpiarFilasPrevias(t, cg.grid, cg.valorVentaEnGrid);
    await abrirPopupNuevo(t, cg.grid);
    await t.click(lookupPopup('StrTipo'));
    await elegirOpcion(t, cg.tipo);
    await escribirCampoPopup360(t, 'IntValorVenta', cg.valorVenta);
    await escribirCampoPopup360(t, 'IntComVenta', cg.comision);
    //await esperarSinAvisos(t);
    await guardarPopup360(t);
    await t.expect(filaGrid360(cg.grid, cg.valorVentaEnGrid).withText(cg.comisionEnGrid).with({ timeout: 15000 }).exists)
        .ok('No apareció el registro en Comisión General');

    await accionFilaGrid360(t, cg.grid, cg.valorVentaEnGrid, 'Editar');
    await t.expect(popupEdicion360.with({ timeout: 10000 }).exists).ok('No se abrió el popup para editar Comisión General');
    await escribirCampoPopup360(t, 'IntComVenta', cg.comisionEdit);
   // await esperarSinAvisos(t);
    await guardarPopup360(t);
    await t.expect(filaGrid360(cg.grid, cg.valorVentaEnGrid).withText(cg.comisionEditEnGrid).with({ timeout: 15000 }).exists)
        .ok('No se ve la comisión editada en Comisión General');

    //await esperarSinAvisos(t);
    await eliminarFilaGrid360(t, cg.grid, cg.valorVentaEnGrid);

    // Comisión F.Pago (Tipo queda en "Factura" por defecto)
    const cf = COMISION_FPAGO;
    await llenarCampos(t, [{ id: cf.pestana, tipo: 'pestana' }]);
    await limpiarFilasPrevias(t, cf.grid, cf.formaPagoEnGrid);
    await abrirPopupNuevo(t, cf.grid);
    await t.click(lookupPopup('IntFormaPago'));
    await elegirOpcion(t, cf.formaPago);
    await escribirCampoPopup360(t, 'IntComision', cf.comision);
    //await esperarSinAvisos(t);
    await guardarPopup360(t);
    await t.expect(filaGrid360(cf.grid, cf.formaPagoEnGrid).withText(cf.comisionEnGrid).with({ timeout: 15000 }).exists)
        .ok('No apareció el registro en Comisión F.Pago');

    await accionFilaGrid360(t, cf.grid, cf.formaPagoEnGrid, 'Editar');
    await t.expect(popupEdicion360.with({ timeout: 10000 }).exists).ok('No se abrió el popup para editar Comisión F.Pago');
    await escribirCampoPopup360(t, 'IntComision', cf.comisionEdit);
    //await esperarSinAvisos(t);
    await guardarPopup360(t);
    await t.expect(filaGrid360(cf.grid, cf.formaPagoEnGrid).withText(cf.comisionEditEnGrid).with({ timeout: 15000 }).exists)
        .ok('No se ve la comisión editada en Comisión F.Pago');

    //await esperarSinAvisos(t);
    await eliminarFilaGrid360(t, cf.grid, cf.formaPagoEnGrid);

    // Se cierra el vendedor sin guardar para seguir con su eliminación
    await t
        .click(Selector('#BtnCancelarVendedor_btn').filterVisible())
        .expect(Selector('#BtnGuardarVendedor_btn').filterVisible().with({ timeout: 10000 }).exists)
        .notOk('No se cerró el formulario del vendedor');
}

fixture `Prueba Vendedores - Test Hgi360`
    .page(testAdminConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testAdminConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba CRUD Vendedor Test Hgi360 - Test Hgi360', async t => {
    await ejecutarCrudMaestro(t, testAdminConfig, MAESTRO);
});
