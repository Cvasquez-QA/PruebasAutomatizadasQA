import { ingresarAplicacion, cerrarSesion360 } from '../../Funciones/HelpersHgi360Web.js';
import { prepararNavegador360, limpiarCache360 } from '../../Funciones/HelpersMaestros360.js';
import { validarMenus360 } from '../../Funciones/ValidacionMenus360.js';
import { testContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

// Validación del menú estándar de Contable (AutContable) en test.hgi360.com. Mismas opciones que
// ContableHgi360Legacy con los textos del menú web (revisado el 03-nov-2026).
// No se valida "Cambio Clave" (en la versión web no está en Herramientas) ni Ayuda (no abre menú de tarjetas).
const MENUS = [
    {
        modulo: 'Maestros',
        opciones: ['Plan de Cuentas', 'Sucursales', 'Centro de Costo', 'SubCentro de Costo', 'Ciudades', 'Terceros',
            'Grupos Contables', 'Empresas', 'Calendario', 'Comprobantes']
    },
    { modulo: 'Movimientos', opciones: ['Documentos'] },
    {
        modulo: 'Procesos',
        opciones: ['Actualiza Movimiento', 'Indirectos', 'Diferidos', 'Cierre Anual', 'Ajuste Saldos Adm', 'Apertura NIIF']
    },
    {
        modulo: 'Herramientas',
        opciones: ['Usuarios', 'Permisos x Usuario', 'Perfiles', 'Permisos x Perfil', 'Usuarios x Perfil', 'Parámetros',
            'Parámetros Año', 'Formatos', 'Importar/Exportar', 'Archivos', 'Interfaz Cloud', 'Parámetros Nómina']
    },
    { modulo: 'Utilitarios', opciones: ['Generales', 'Cambio Movimiento', 'Activar', 'Definición', 'Generación'] },
    { modulo: 'Reportes', opciones: ['Maestros', 'Contables', 'Administrativos', 'Tributarios', 'Seguridad'] }
];

fixture `Prueba validación campos Contable - Test Hgi360`
    .page(testContableConfig.pagina)
    .beforeEach(async t => {
        await prepararNavegador360(t, testContableConfig.pagina);
    })
    .afterEach(async t => {
        await limpiarCache360(t);
    });

test('Prueba validación campos Contable - Test Hgi360', async t => {
    await ingresarAplicacion(t, testContableConfig);
    await validarMenus360(t, MENUS);
    await cerrarSesion360(t);
});
