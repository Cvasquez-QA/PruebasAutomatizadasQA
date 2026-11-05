import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    abrirHerramientas,
    abrirMaestros360,
    cerrarPestana360,
    cerrarSesion360,
    eliminarRegistroDesdeGrid,
    ingresarAplicacion,
    
    seleccionarOpcion,
} from '../../../Funciones/HelpersHgi360Legacy.js';

const MENSAJE_RESULTADO_IMPORTACION = 'El archivo que se descargó contiene el resultado de la importación.';
const TABLA_EMPLEADOS = 'Empleados';
const EMPLEADO_CODIGO = '112233';
const ARCHIVO_EMPLEADOS = '..\\..\\..\\Planos\\_uploads_\\EstructuraEmpleados.xls';
const ARCHIVO_EMPLEADOS_ACTUALIZADO = '..\\..\\..\\Planos\\_uploads_\\EstructuraEmpleadosActualizado.xls';
const TABLA_CONCEPTOS_NOM = 'Conceptos Nom';
const CONCEPTO_CODIGO = '51';
const ARCHIVO_CONCEPTOS = '..\\..\\..\\Planos\\_uploads_\\ConceptosNom.xls';
const ARCHIVO_CONCEPTOS_ACTUALIZADO = '..\\..\\..\\Planos\\_uploads_\\ConceptosNomActualizado.xls';

async function ejecutarPruebaEmpleados(t, config, ingresar) {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'ARCHIVOS');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_EMPLEADOS);
    await t
        .click('#TxtArchivos_Operacion .dx-radiobutton-icon-dot')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_EMPLEADOS])
        .click('#BtnArchivos_Generar .dx-icon.dx-icon-save')
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_RESULTADO_IMPORTACION,'Ocurrió un error en la descarga del reporte')
        .click(Selector('button').withText('Aceptar').nth(1))
    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Empleados');
    await t
        //Validación creación
        .typeText(Selector('#gridEmpleados .dx-texteditor-input'), EMPLEADO_CODIGO)
        .wait(3000)
        .expect(Selector('#gridEmpleados td').withText(EMPLEADO_CODIGO).exists).ok('No se encuentra el registro importado');
    await cerrarPestana360(t);
    await abrirHerramientas(t, 'ARCHIVOS');
    await t
        //Se actualiza
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_EMPLEADOS);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_EMPLEADOS_ACTUALIZADO])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_RESULTADO_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Empleados');
    await t
        //Validación actualización
        .typeText(Selector('#gridEmpleados .dx-texteditor-input'), EMPLEADO_CODIGO)
        .wait(3000)
        .expect(Selector('#gridEmpleados td').withText(EMPLEADO_CODIGO).exists).ok('No se encuentra el registro importado');
    await eliminarRegistroDesdeGrid(t, '#gridEmpleados');
    await t
        .wait(2000);
    await cerrarSesion360(t);
}


const ejecutarPruebaConceptosNom = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await abrirHerramientas(t, 'ARCHIVOS');
    await t
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_CONCEPTOS_NOM);
    await t
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_CONCEPTOS])
        .click('#BtnArchivos_Generar .dx-icon.dx-icon-save')
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_RESULTADO_IMPORTACION,'Ocurrió un error en la descarga del reporte')
        .click(Selector('button').withText('Aceptar').nth(1))
    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Conceptos');
    await t
        //Se valida la inserción
        .typeText('#gridConceptosNom .dx-texteditor-input', CONCEPTO_CODIGO)
        .wait(3000)
        .expect(Selector('#gridConceptosNom td').withText(CONCEPTO_CODIGO).exists).ok('No se encuentra el registro importado');
    await cerrarPestana360(t);
    await abrirHerramientas(t, 'ARCHIVOS');
    await t
        //Se actualiza
        .click('#txtTabla .dx-texteditor-input')
        ;
    await seleccionarOpcion(t, TABLA_CONCEPTOS_NOM);
    await t
        .click('#TxtArchivos_Actualizar .dx-checkbox-icon')
        .click(Selector('#BtnRuta1 span').withText('Elija archivo excel'))
        .setFilesToUpload('#BtnRuta1 .dx-fileuploader-input', [ARCHIVO_CONCEPTOS_ACTUALIZADO])
        .click(Selector('#BtnArchivos_Generar span').withText('Generar'))
        .expect((Selector('[class^="swal2-icon swal2-success swal2-animate-success-ico"]')).exists).ok('Ocurrió un error en el procesamiento del archivo plano para la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
        .expect(Selector('#swal2-content').innerText).eql(MENSAJE_RESULTADO_IMPORTACION,'Ocurrió un error en la descarga del reporte de la actualizacion')
        .click(Selector('button').withText('Aceptar').nth(1))
    await cerrarPestana360(t);
    await abrirMaestros360(t, 'Conceptos');
    await t
        //Se valida la actualización
        .typeText('#gridConceptosNom .dx-texteditor-input', CONCEPTO_CODIGO)
        .wait(3000)
        .expect(Selector('#gridConceptosNom td').withText(CONCEPTO_CODIGO).exists).ok('No se encuentra el registro importado');
    //Se elimina
    await eliminarRegistroDesdeGrid(t, '#gridConceptosNom');
    await t
        .wait(1000);
    await cerrarSesion360(t);
};

fixture('Herramientas Archivos Hgi360 Nomina - MiHgi360')
    .page(miNominaConfig.pagina);

test('Mi Hgi360 - Prueba archivos Empleados', async t => {
    await ejecutarPruebaEmpleados(t, miNominaConfig, ingresarAplicacion);
});

test('Mi Hgi360 - Prueba Archivos ConceptosNom', async t => {
    await ejecutarPruebaConceptosNom(t, miNominaConfig, ingresarAplicacion);
});

fixture('Herramientas Archivos Hgi360 Nomina - Test Hgi360')
    .page(testNominaConfig.pagina);

test('Test Hgi360 - Prueba archivos Empleados', async t => {
    await ejecutarPruebaEmpleados(t, testNominaConfig, ingresarAplicacion);
});

test('Test Hgi360 - Prueba Archivos ConceptosNom', async t => {
    await ejecutarPruebaConceptosNom(t, testNominaConfig, ingresarAplicacion);
});
