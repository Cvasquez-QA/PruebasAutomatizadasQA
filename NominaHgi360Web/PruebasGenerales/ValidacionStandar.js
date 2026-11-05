import { ingresarAplicacion, cerrarSesion360 } from '../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import { validarMenus360 } from '../../Funciones/ValidacionMenus360.js';
import { testNomina8901Config } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Validación del menú estándar de Nómina (AutNomina, empresa 8901 como en NominaHgi360Legacy) en test.hgi360.com.
// Mismas opciones que la prueba legacy con los textos del menú web (revisado el 03-nov-2026).
// No se valida Ayuda (no abre menú de tarjetas).
const MENUS = [
    {
        modulo: 'Maestros',
        opciones: ['Sucursales', 'Centro de Costo', 'SubCentro de Costo', 'Cargos', 'Turnos', 'Empleados', 'Fondos',
            'Tarifas ARL', 'Regímenes', 'ReteFte', 'Ciudades', 'Bancos', 'Empresas', 'Calendario', 'Conceptos',
            'FormasPago', 'EntidadesFin']
    },
    {
        modulo: 'Movimientos',
        opciones: ['Novedades por Empleado', 'Novedades por Concepto', 'Prestamos', 'Saldos', 'Liquidacion',
            'Evaluación Desempeño', 'Prima de Servicios']
    },
    { modulo: 'NominaE', opciones: ['Envio'] },
    {
        modulo: 'Procesos',
        opciones: ['Liquidación de Periodo', 'Prima de Servicios', 'Vacaciones', 'Cesantías', 'Liquidación Definitiva',
            'Liquidación Definitiva Masiva', 'Cesantías Anticipadas']
    },
    {
        modulo: 'Herramientas',
        opciones: ['Usuarios', 'Permisos x Usuario', 'Perfiles', 'Permisos x Perfil', 'Usuarios x Perfil', 'Parámetros',
            'Parametros Año', 'Formatos', 'Archivos']
    },
    { modulo: 'Utilitarios', opciones: ['Dispersión de Fondos'] },
    {
        modulo: 'Reportes',
        opciones: ['Maestros', 'Liquidación', 'Planilla Pago', 'Prestaciones', 'Saldo Contable', 'Seguridad Social',
            'Certificados', 'Otros', 'Seguridad']
    }
];

fixture `Prueba ValidacionStandar Hgi360 Nomina - Test Hgi360`
    .page(testNomina8901Config.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testNomina8901Config.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Test Hgi360 - Prueba validación campos Nomina HGI360 Standar', async t => {
    await ingresarAplicacion(t, testNomina8901Config);
    await validarMenus360(t, MENUS);
    await cerrarSesion360(t);
});
