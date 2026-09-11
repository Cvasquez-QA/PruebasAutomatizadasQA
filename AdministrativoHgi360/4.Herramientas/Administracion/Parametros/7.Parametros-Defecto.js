import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    filtrarPor,
    ingresarAplicacion,
    seleccionarOpcion,
    cerrarPestana360
} from '../../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../../ParametrosPruebas/Hgi360Admin8888.js';

const TIPO_TERCERO = '0 - GENERAL';
const FILTRO_TIPO_TERCERO = 'GENERAL';
const TIPO_ID = 'CC - Cedula de Ciudadania';
const TELEFONO = '123456';
const DIRECCION = 'cra5123565';
const COD_POSTAL = '050005 - 050005';
const COD_POSTAL_ESPERADO = '050005';
const EMAIL = 'miemail';
const VENDEDOR = '45 - HGI SAS';
const VENDEDOR_ESPERADO = 'HGI SAS';
const FILTRO_VENDEDOR = '45';
const CIUDAD = '01 - MEDELLIN';
const CIUDAD_ESPERADA = 'MEDELLIN';
const FILTRO_CIUDAD = 'MEDELL';
const SECTOR = '01 - INDUSTRIAL';
const SECTOR_ESPERADO = 'INDUSTRIAL';
const FILTRO_SECTOR = 'INDUSTR';
const BARRIO = '0 - GENERAL';
const BARRIO_ESPERADO = 'GENERAL';
const ENTIDAD = '02 - BANCOLOMBIA';
const ENTIDAD_ESPERADA = 'BANCOLOMBIA';
const FILTRO_ENTIDAD = '02';
const SUCURSAL = '01 - MEDELLIN';
const CCOSTO = '01 - ADMINISTRACION';
const CCOSTO_ESPERADO = 'ADMINISTRACION';
const SUB_CCOSTO = '01 - MEDELLIN';
const LINEA = '01 - ON PREMISE';
const LINEA_ESPERADA = 'ON PREMISE';
const FILTRO_LINEA = '01';
const GRUPO = '01 - ADMINISTRATIVO';
const GRUPO_ESPERADO = 'ADMINISTRATIVO';
const UNIDAD = 'Und - Unidad';
const UNIDAD_ESPERADA = 'Unidad';
const TARIFA_IVA = '16 - 19 %';
const TARIFA_IVA_ESPERADA = '19 %';
const FORMA_PAGO = '2 - Transferencia';
const FORMA_PAGO_ESPERADA = 'Transferencia';
const FILTRO_SUCURSAL = 'MEDELLIN';
const TIPO_TERCERO_ESPERADO = 'GENERAL';
const TIPO_ID_ESPERADO = 'CC - Cedula de Ciudadania';

async function ejecutarPrueba(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .wait(3000)
            .click('#tabs_parametros_Defecto')
            .click(Selector('#BtnEditar span').withText('Editar'))
            .wait(2000)
            .click(Selector('#txt_lista_PG_TipoTercero .dx-lookup-field'));
    
            await filtrarPor(t, FILTRO_TIPO_TERCERO);
            await t
            .wait(3000)
            ;
    await seleccionarOpcion(t, TIPO_TERCERO);
    await t
            .click(Selector('#txt_lista_PG_TipoIdDefecto .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, TIPO_ID);
    await t
            .click('#PG_TelefonoDef .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#PG_TelefonoDef .dx-texteditor-input', TELEFONO)
            .click('#TxtParametrosGenerales_IntTerTelefonoDef .dx-checkbox-icon')
            .click('#PG_DireccionDef .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#PG_DireccionDef .dx-texteditor-input', DIRECCION)
            .click('#TxtParametrosGenerales_IntTerDireccionDef .dx-checkbox-icon')
            .click(Selector('#txt_lista_PG_CodPostalDIANDef .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, COD_POSTAL);
    await t
            .click('#TxtParametrosGenerales_IntTerCodPostalDef .dx-checkbox-icon')
            .doubleClick('#txtPG_EmailFE .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtPG_EmailFE .dx-texteditor-input', EMAIL)
            .click('#TxtParametrosGenerales_IntTerMailDef .dx-checkbox-icon')
            .click(Selector('#txt_lista_PG_Vendedor .dx-lookup-field'));
    
            await filtrarPor(t, FILTRO_VENDEDOR);
            await t
            .wait(3000)
            ;
    await seleccionarOpcion(t, VENDEDOR);
    await t
            .click(Selector('#txt_lista_PG_Ciudad .dx-lookup-field'));
    
            await filtrarPor(t, FILTRO_CIUDAD);
            await t
            .wait(3000)
            ;
    await seleccionarOpcion(t, CIUDAD);
    await t
            .click(Selector('#txt_lista_PG_Sector .dx-lookup-field'));
    
            await filtrarPor(t, FILTRO_SECTOR);
            await t
            .wait(3000)
            ;
    await seleccionarOpcion(t, SECTOR);
    await t
            .click(Selector('#txt_lista_PG_Barrio .dx-lookup-field'));
    
            await filtrarPor(t, FILTRO_TIPO_TERCERO);
            await t
            .wait(3000)
            ;
    await seleccionarOpcion(t, BARRIO);
    await t
            .click(Selector('#txt_lista_PG_Entidad .dx-lookup-field'));
    
            await filtrarPor(t, FILTRO_ENTIDAD);
            await t
            .wait(3000)
            ;
    await seleccionarOpcion(t, ENTIDAD);
    await t
            .click(Selector('#txt_lista_PG_Sucursal .dx-lookup-field'));
    
            await filtrarPor(t, FILTRO_SUCURSAL);
            await t
            .wait(3000)
            ;
    await seleccionarOpcion(t, SUCURSAL);
    await t
            .click(Selector('#txt_lista_PG_CCosto .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, CCOSTO);
    await t
            .click(Selector('#txt_lista_PG_SubCCosto .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, SUB_CCOSTO);
    await t
            .click(Selector('#txt_lista_PG_Linea .dx-lookup-field'));
    
            await filtrarPor(t, FILTRO_LINEA);
            await t
            .wait(3000)
            ;
    await seleccionarOpcion(t, LINEA);
    await t
            .click(Selector('#txt_lista_PG_Grupo .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, GRUPO);
    await t
            .click(Selector('#txt_lista_PG_Unidad .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, UNIDAD);
    await t
            .click(Selector('#txtPG_TarifaIva .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, TARIFA_IVA);
    await t
            .click(Selector('#txtPG_FormasDePagoDef .dx-lookup-field'))
            ;
    await seleccionarOpcion(t, FORMA_PAGO);
    await t
            .click(Selector('#BtnGuardar div').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parámetros');
        await t
            .click('#tabs_parametros_Defecto')
            .click(Selector('#BtnEditar span').withText('Editar'))
            .wait(2000)
            .expect(Selector('#txt_lista_PG_TipoTercero .dx-lookup-field').innerText).eql(TIPO_TERCERO_ESPERADO,'El sistema no guardó los cambios')
            .expect(Selector('#txt_lista_PG_TipoIdDefecto .dx-lookup-field').innerText).eql(TIPO_ID_ESPERADO,'El sistema no guardó los cambios')
            .expect(Selector('#PG_TelefonoDef .dx-texteditor-input').value).eql(TELEFONO,'El sistema no guardó los cambios')
            .expect(Selector('#PG_DireccionDef .dx-texteditor-input').value).eql(DIRECCION,'El sistema no guardó los cambios')
            .expect(Selector('#txt_lista_PG_CodPostalDIANDef .dx-lookup-field').innerText).eql(COD_POSTAL_ESPERADO,'El sistema no guardó los cambios')
            .expect(Selector('#txtPG_EmailFE .dx-texteditor-input').value).eql(EMAIL,'El sistema no guardó los cambios')
            .expect(Selector('#txt_lista_PG_Vendedor .dx-lookup-field').innerText).eql(VENDEDOR_ESPERADO,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_Ciudad .dx-lookup-field')).innerText).eql(CIUDAD_ESPERADA,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_Sector .dx-lookup-field')).innerText).eql(SECTOR_ESPERADO,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_Barrio .dx-lookup-field')).innerText).eql(BARRIO_ESPERADO,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_Entidad .dx-lookup-field')).innerText).eql(ENTIDAD_ESPERADA,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_Sucursal .dx-lookup-field')).innerText).eql(CIUDAD_ESPERADA,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_CCosto .dx-lookup-field')).innerText).eql(CCOSTO_ESPERADO,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_SubCCosto .dx-lookup-field')).innerText).eql(CIUDAD_ESPERADA,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_Linea .dx-lookup-field')).innerText).eql(LINEA_ESPERADA,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_Grupo .dx-lookup-field')).innerText).eql(GRUPO_ESPERADO,'El sistema no guardó los cambios')
            .expect((Selector('#txt_lista_PG_Unidad .dx-lookup-field')).innerText).eql(UNIDAD_ESPERADA,'El sistema no guardó los cambios')
            .expect((Selector('#txtPG_TarifaIva .dx-lookup-field')).innerText).eql(TARIFA_IVA_ESPERADA,'El sistema no guardó los cambios')
            .expect((Selector('#txtPG_FormasDePagoDef .dx-lookup-field')).innerText).eql(FORMA_PAGO_ESPERADA,'El sistema no guardó los cambios')
            .click(Selector('#BtnGuardar div').withText('Guardar'))
            .click(Selector('button').withText('Aceptar'))
            .wait(2000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba Parametros - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba Parametros - Defecto - Test Hgi360', async t => {
    await ejecutarPrueba(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba Parametros - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba Parametros - Defecto - Hgi360 Admin', async t => {
    await ejecutarPrueba(t, hgiAdminConfig, ingresarAplicacion);
});
