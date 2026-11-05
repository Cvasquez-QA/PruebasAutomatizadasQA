import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, ingresarAplicacionMiHappgi } from '../../Funciones/HelpersHgi360Legacy.js';
import { testContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';
import { miContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js';

async function ejecutarPruebaValidacionStandar(t, config, ingresar) {
    await ingresar(t, config);
    await t
        .click(Selector('a').withText('Maestros'))
            .expect(Selector('a').withText('PLAN DE CUENTAS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('SUCURSALES').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('CENTRO DE COSTO').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('SUBCENTRO DE COSTO').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('CIUDADES').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('TERCEROS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('GRUPOS CONTABLES').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('EMPRESAS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('CALENDARIO').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('COMPROBANTES').exists).ok('El texto no es visible')
            .click(Selector('a').withText('Movimientos'))
            .expect(Selector('a').withText('DOCUMENTOS').exists).ok('El texto no es visible')
            .click(Selector('a').withText('Procesos'))
            .expect(Selector('a').withText('ACTUALIZA MOVIMIENTO').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('INDIRECTOS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('DIFERIDOS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('CIERRE ANUAL').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('AJUSTE SALDOS ADM').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('APERTURA NIIF').exists).ok('El texto no es visible')
            .click(Selector('a').withText('Herramientas'))
            .expect(Selector('a').withText('USUARIOS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('PERMISOS X USUARIO').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('CAMBIO CLAVE').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('PERFILES').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('PERMISOS X PERFIL').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('USUARIOS X PERFIL').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('PARÁMETROS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('PARÁMETROS AÑO').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('FORMATOS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('IMPORTAR/EXPORTAR').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('ARCHIVOS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('INTERFAZ CLOUD').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('PARÁMETROS NÓMINA').exists).ok('El texto no es visible')
            .click(Selector('a').withText('Utilitarios'))
            .expect(Selector('a').withText('GENERALES').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('CAMBIO MOVIMIENTO').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('ACTIVAR').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('DEFINICIÓN').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('GENERACIÓN').exists).ok('El texto no es visible')
            .click(Selector('a').withText('Reportes'))
            .expect(Selector('a').withText('MAESTROS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('CONTABLES').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('ADMINISTRATIVOS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('TRIBUTARIOS').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('SEGURIDAD').exists).ok('El texto no es visible')
            .click(Selector('a').withText('Ayuda'))
            .expect(Selector('a').withText('SOPORTE REMOTO').exists).ok('El texto no es visible')
            .expect(Selector('a').withText('DOCUMENTACIÓN').exists).ok('El texto no es visible');
    await cerrarSesion360(t);
}

fixture `Prueba validación campos Contable - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba validación campos Contable - Test Contable', async t => {
    await ejecutarPruebaValidacionStandar(t, testContableConfig, ingresarAplicacion);
});

fixture `Prueba validación campos Contable - Mi Contable`
    .page(miContableConfig.pagina);

test('Prueba validación campos Contable - Mi Contable', async t => {
    await ejecutarPruebaValidacionStandar(t, miContableConfig, ingresarAplicacionMiHappgi);
});
