import { prepararNavegador360, limpiarCache360, probarDuplicadoMaestro360 } from '../../../../../Funciones/HelpersMaestros360.js';
import { ingresarAplicacion, cerrarSesion360 } from '../../../../../Funciones/HelpersHgi360Web.js';
import { testPosWebConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js';

// Inserción de duplicados - CONFIGURACIÓN (test.hgi360.com, AutPos).
// Por cada maestro: crea el registro de prueba, intenta crearlo de nuevo con el mismo código,
// valida el rechazo ("Ya existe un registro...") y borra el registro.
// Las definiciones son las mismas de las pruebas CRUD de 1.Maestros (selectores validados).
// Calendario no se incluye: su formulario tiene flujo propio (ver 1.Maestros/Configuracion/CRUD_CalendarioUX.js).

const TRANSACCIONESUX = {
    maestro: 'Transacciones',
    grupo: 'configuracion',
    grid: 'gridTransacciones',
    guardar: 'BtnGuardarTransaccion',
    campoCodigo: 'TxtTransaccion_Codigo',
    codigo: 'QAT01',
    crear: [
        { id: 'TxtTransaccion_Descripcion', valor: 'midesctransaccion' }
    ],
    editar: [
        { id: 'TxtTransaccion_Descripcion', valor: 'minuevadesc' }
    ],
    validarEditado: 'minuevadesc'
};

const MAESTROS = [TRANSACCIONESUX];

fixture `Prueba Duplicados Happgi Pos - Test Hgi360`
    .page(testPosWebConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testPosWebConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba Inserción Duplicados - CONFIGURACIÓN - Test Hgi360', async t => {
    await ingresarAplicacion(t, testPosWebConfig);
    for (const maestro of MAESTROS) {
        await probarDuplicadoMaestro360(t, maestro, testPosWebConfig);
    }
    await cerrarSesion360(t);
});
