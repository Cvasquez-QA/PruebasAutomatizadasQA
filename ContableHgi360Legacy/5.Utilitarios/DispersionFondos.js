import { Selector } from 'testcafe';
import { cerrarSesion360, filtrarPor, filtrarPorInput, ingresarAplicacion, seleccionarOpcion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../ParametrosPruebas/ParametrosPruebas.js'; 

const BANCO = '02 - BANCOLOMBIA';
const ENTIDAD_FINANCIERA = '07 - BANCOLOMBIA';
const FILTRO_EMPLEADO = '1000';
const EMPLEADO = '10000995 - Pruebas QA Camilo';
const SUCURSAL = '0 - GENERAL';
const REGISTRO_EMPLEADO = '10000995';


async function ejecutarPruebaDispersionFondos(t, config, ingresar) {
    await ingresar(t, config);
        await t
            .click(Selector('a').withText('Utilitarios'))
            .click(Selector('span').withText('DISPERSIÓN DE FONDOS'))
            .wait(1500)
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .click('#txt_lista_DispersionFondoAd_Banco .dx-lookup-field')
            
            ;
    await seleccionarOpcion(t, BANCO);
    await t
            .click(Selector('#txt_lista_DispersionFondoAd_Entidad div').withText('Todos').nth(1))
            ;
    await seleccionarOpcion(t, ENTIDAD_FINANCIERA);
    await t
            .click(Selector('#txt_lista_DispersionFondoAd_Empleado div').withText('Todos').nth(1))
            .click(filtrarPorInput);
            
            await filtrarPor(t, FILTRO_EMPLEADO);
            await t
            .wait(2000)
            ;
    await seleccionarOpcion(t, EMPLEADO);
    await t
            .click(Selector('#txt_lista_DispersionFondoAd_Sucursal div').withText('Todos').nth(1))
            ;
    await seleccionarOpcion(t, SUCURSAL);
    await t
            .click(Selector('#txt_lista_DispersionFondoAd_cCosto div').withText('Todos').nth(1))
            ;
    await seleccionarOpcion(t, SUCURSAL);
    await t
            .click(Selector('#txt_lista_DispersionFondoAd_subcCosto div').withText('Todos').nth(1))
            ;
    await seleccionarOpcion(t, SUCURSAL);
    await t
            .click('#dispersionFondo_General .dx-checkbox-icon')
            .click(Selector('#BtnConsultarDispersionFondos span').withText('Consultar'))
            .expect((Selector('#dispersionFondo_GridConsignacionElectronica td').withText(REGISTRO_EMPLEADO)).exists).ok('No se encontró el registro en el grid')
            .click('#dispersionFondo_MatricularCuentas .dx-checkbox-icon')
            .click(Selector('#DispersionFondo_BtnGenerarPlano span').withText('Generar plano'))
            .wait(5000)
           // .click(Selector('#dispersionFondo_GridConsignacionElectronica .centrarTextoVerticalmente').nth(19))
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `DispersionFondos - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba Formatos - Nomina - Mi ERP', async t => {
    await ejecutarPruebaDispersionFondos(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `DispersionFondos - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba Formatos - Nomina - Test Contable', async t => {
    await ejecutarPruebaDispersionFondos(t, testContableConfig, ingresarAplicacion);
});
