import { Selector } from 'testcafe';
import { abrirMaestros360, cerrarSesion360, ingresarAplicacion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../../../ParametrosPruebas/ParametrosPruebas.js'; 

const CODIGO = '0';
const DESCRIPCION = 'miplandecuenta';


async function ejecutarPruebaOtrasAplicaciones(t, config, ingresar) {
    await ingresar(t, config);
            ///PRUEBA PLAN DE CUENTA
        //Se ingresa al maestro de Plan de Cuenta
            
            await abrirMaestros360(t, 'Plan De Cuentas');
        await t
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#gridPlanContable .dx-icon.dx-icon-add')
            .typeText('#TxtPlanContable_Codigo_Cursor', CODIGO)
            .wait(100)
            .typeText('#TxtPlanContable_Descripcion .dx-texteditor-input', DESCRIPCION)
            .click(Selector('#BtnGuardarPlanContable div').withText('Guardar'))
            let mensaje= Selector('#swal2-content').innerText;
            await t
            .expect(mensaje).contains('Ya existe un registro','El sistema no está mostrando el mensaje prestablecido para cuando se inserta un duplicado')//Código '2025-72' Error inesperado al agregar la entidad.
            .click(Selector('button').withText('Aceptar').nth(1));
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `OtrasAplicaciones - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Inserción Duplicados - OTRAS APLICACIONES - Mi ERP', async t => {
    await ejecutarPruebaOtrasAplicaciones(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `OtrasAplicaciones - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Inserción Duplicados - OTRAS APLICACIONES - Test Contable', async t => {
    await ejecutarPruebaOtrasAplicaciones(t, testContableConfig, ingresarAplicacion);
});
