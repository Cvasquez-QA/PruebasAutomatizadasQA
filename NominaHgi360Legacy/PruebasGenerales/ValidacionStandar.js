import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion } from '../../Funciones/HelpersHgi360Legacy.js';
import { miNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { testNomina8901Config as testNominaConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

const MENUS_ESPERADOS = [
    {
        nombre: 'Maestros',
        opciones: [
            'SUCURSALES',
            'CENTRO DE COSTO',
            'SUBCENTRO DE COSTO',
            'CARGOS',
            'TURNOS',
            'EMPLEADOS',
            'FONDOS',
            'TARIFAS ARL',
            'REGÍMENES',
            'RETEFTE',
            'CIUDADES',
            'BANCOS',
            'EMPRESAS',
            'CALENDARIO',
            'CONCEPTOS',
            'FORMASPAGO',
            'ENTIDADESFIN'
        ]
    },
    {
        nombre: 'Movimientos',
        opciones: [
            'NOVEDADES POR EMPLEADO',
            'NOVEDADES POR CONCEPTO',
            'PRESTAMOS',
            'SALDOS',
            'LIQUIDACION',
            'EVALUACIÓN DESEMPEÑO',
            'PRIMA DE SERVICIOS'
        ]
    },
    {
        nombre: 'NominaE',
        opciones: ['ENVIO']
    },
    {
        nombre: 'Procesos',
        opciones: [
            'LIQUIDACIÓN DE PERIODO',
            'PRIMA DE SERVICIOS',
            'VACACIONES',
            'CESANTÍAS',
            'LIQUIDACIÓN DEFINITIVA',
            'LIQUIDACIÓN DEFINITIVA MASIVA',
            'CESANTÍAS ANTICIPADAS'
        ]
    },
    {
        nombre: 'Herramientas',
        opciones: [
            'USUARIOS',
            'PERMISOS X USUARIO',
            'PERFILES',
            'PERMISOS X PERFIL',
            'USUARIOS X PERFIL',
            'PARÁMETROS',
            'PARAMETROS AÑO',
            'FORMATOS',
            'ARCHIVOS'
        ]
    },
    {
        nombre: 'Utilitarios',
        opciones: ['DISPERSIÓN DE FONDOS']
    },
    {
        nombre: 'Reportes',
        opciones: [
            'MAESTROS',
            'LIQUIDACIÓN',
            'PLANILLA PAGO',
            'PRESTACIONES',
            'SALDO CONTABLE',
            'SEGURIDAD SOCIAL',
            'CERTIFICADOS',
            'OTROS',
            'SEGURIDAD'
        ]
    },
    {
        nombre: 'Ayuda',
        opciones: ['SOPORTE REMOTO', 'DOCUMENTACIÓN']
    }
];

const validarOpcionesMenu = async (t, opciones) => {
    for (const opcion of opciones) {
        await t
            .expect(Selector('a').withText(opcion).exists)
            .ok(`No se visualiza la opción "${opcion}"`);
    }
};

const validarMenu = async (t, menu) => {
    await t.click(Selector('a').withText(menu.nombre));
    await validarOpcionesMenu(t, menu.opciones);
};

async function ejecutarPrueba(t, config) {
    await ingresarAplicacion(t, config);
    for (const menu of MENUS_ESPERADOS) {
            await validarMenu(t, menu);
        }
    
        await cerrarSesion360(t);
}

fixture `Prueba ValidacionStandar Hgi360 Nomina - MiHgi360`
    .page(miNominaConfig.pagina);

test('MiHgi360 - Prueba validación campos Nomina HGI360 Standar', async t => {
    await ejecutarPrueba(t, miNominaConfig);
});

fixture `Prueba ValidacionStandar Hgi360 Nomina - Test Hgi360`
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba validación campos Nomina HGI360 Standar', async t => {
    await ejecutarPrueba(t, testNominaConfig);
});
