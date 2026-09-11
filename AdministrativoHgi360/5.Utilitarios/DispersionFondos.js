import { Selector } from 'testcafe';
import {
    abrirUtilitarios360,
    cerrarSesion360,
    filtrarPor,
    filtrarPorInput,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../ParametrosPruebas/Hgi360Admin8888.js';

const BANCO = 'BANCOLOMBIA';
const ENTIDAD_FINANCIERA = 'BANCOLOMBIA';
const FILTRO_EMPLEADO = '1000099598';
const EMPLEADO = '1000099598';
const SUCURSAL = 'GENERAL';
const REGISTRO_EMPLEADO = '1000099598';

async function ejecutarPruebaDispersionFondos(t, config) {
    await ingresarAplicacion(t, config);
    await abrirUtilitarios360(t, 'Dispersión De Fondos');
    await t
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

fixture `DispersionFondos - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Formatos - Nomina - Test Hgi360', async t => {
    await ejecutarPruebaDispersionFondos(t, testAdminConfig);
});

fixture `DispersionFondos - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Formatos - Nomina - Hgi360 Admin', async t => {
    await ejecutarPruebaDispersionFondos(t, hgiAdminConfig);
});
