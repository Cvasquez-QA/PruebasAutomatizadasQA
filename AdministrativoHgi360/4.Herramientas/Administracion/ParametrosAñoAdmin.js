import { Selector } from 'testcafe';
import {
    abrirHerramientas360,
    cerrarSesion360,
    ingresarAplicacion,
    cerrarPestana360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360.js';
import { testAdminConfig } from '../../../ParametrosPruebas/TestErpAdmin8902.js';
import { hgiAdminConfig } from '../../../ParametrosPruebas/Hgi360Admin8888.js';

const ANO = '2023';
const VALOR_ADMIN = '01';
const VALOR_ADMIN_EDIT = '12';
const VALOR_CONTABLE = '02';
const VALOR_CONTABLE_EDIT = '13';
const SALARIO_MINIMO = '800000';
const AUX_TRANSPORTE = '1000';
const VALOR_UVT = '50000';
const PENSION = '10';
const SALUD = '7';
const CCF = '1';
const IBCF = '9825';
const SENA = '78';
const ESAP = '99';
const MIN_EDU = '55';
const PENSION_E = '78';
const SALUD_E = '54';
const MENSAJE_CODIGO_EXISTENTE = 'Ya existe un registro con el código ingresado.';

async function ejecutarPruebaValidaciNValoresAOPorDefecto(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Parametros Año');
        await t
            .click('#gridParametrosAno .dx-icon.dx-icon-add')
            .typeText(Selector('#txtParametrosAno_Año').nth(1), ANO)
            .click(Selector('#BtnCargarParametrosAno div').withText('Cargar'))
            .wait(3000)
            if(await Selector('.swal2-content div').exists){
                    let existeMensaje = await Selector('.swal2-content div').innerText
                    if(existeMensaje == MENSAJE_CODIGO_EXISTENTE){
                            await t
            .wait(2000)
                            .click(Selector('button').withText('Aceptar'));
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parametros Año');
        await t
            .typeText('#gridParametrosAno .dx-texteditor-input', ANO)
                            .wait(2000);
        await eliminarRegistroDesdeGrid(t, '#gridParametrosAno');
    
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parametros Año');
        await t
            .click('#gridParametrosAno .dx-icon.dx-icon-add')
                            .typeText(Selector('#txtParametrosAno_Año').nth(1), ANO)
                            .click(Selector('#BtnCargarParametrosAno div').withText('Cargar'))
                            .wait(3000)
                    }
            }
                       const admin = Selector('#txtParametrosAno_Adm .dx-texteditor-input');
            let valorCampo = await admin.value;
            valorCampo = valorCampo.replace(/\./g, ''); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const contable = Selector('#txtParametrosAno_Con .dx-texteditor-input');
            valorCampo = await contable.value;
            valorCampo = valorCampo.replace(/\./g, ''); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const salarioMinimo = Selector('#txtParametrosAno_SalaMini .dx-texteditor-input');
            valorCampo = await salarioMinimo.value;
            valorCampo = valorCampo.replace(/\./g, '').replace(',', '.'); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const auxTrans = Selector('#txtParametrosAno_AuxTransporte .dx-texteditor-input');
            valorCampo = await auxTrans.value;
            valorCampo = valorCampo.replace(/\./g, '').replace(',', '.'); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
           
            const valorUVT = Selector('#txtParametrosAno_ValorUVT .dx-texteditor-input');
            valorCampo = await valorUVT.value;
            valorCampo = valorCampo.replace(/\./g, '').replace(',', '.'); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
         
           //'Tarifas de Seguridad Social'
            const pension = Selector('#txtParametrosAno_Pension .dx-texteditor-input');
            valorCampo = await pension.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const salud = Selector('#txtParametrosAno_Salud .dx-texteditor-input');
             valorCampo = await salud.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const ccf = Selector('#txtParametrosAno_Ccf .dx-texteditor-input');     
             valorCampo = await ccf.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const ibcf = Selector('#txtParametrosAno_Ibcf .dx-texteditor-input');
             valorCampo = await ibcf.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const sena = Selector('#txtParametrosAno_Sena .dx-texteditor-input');
             valorCampo = await sena.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
            //Deben estar en 0
            const esap = Selector('#txtParametrosAno_Esap .dx-texteditor-input');
             valorCampo = await esap.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).eql(0, 'El valor es menor o igual a 0');
            //Deben estar en 0
            const minEdu = Selector('#txtParametrosAno_MinEdu .dx-texteditor-input');
             valorCampo = await minEdu.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).eql(0, 'El valor es menor o igual a 0');
    //Empleados
            const pensionE = Selector('#txtParametrosAno_PensionE .dx-texteditor-input');
             valorCampo = await pensionE.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const saludE = Selector('#txtParametrosAno_SaludE .dx-texteditor-input');
             valorCampo = await saludE.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t
            .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0')
            .wait(3000);
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaCRUDParametrosAO(t, config, ingresar) {
    await ingresar(t, config);
        await abrirHerramientas360(t, 'Parametros Año');
        await t
            .click('#gridParametrosAno .dx-icon.dx-icon-add')    
            .typeText('#txtParametrosAno_Año .dx-texteditor-input', ANO)
            .click(Selector('#BtnCargarParametrosAno div').withText('Cargar'))
            .wait(2000)
            .click('#txtParametrosAno_Adm .dx-texteditor-input')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Adm .dx-texteditor-input', VALOR_ADMIN)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Con .dx-texteditor-input', VALOR_CONTABLE)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_SalaMini .dx-texteditor-input', SALARIO_MINIMO)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_AuxTransporte .dx-texteditor-input', AUX_TRANSPORTE)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_ValorUVT .dx-texteditor-input', VALOR_UVT)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Pension .dx-texteditor-input', PENSION)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Salud .dx-texteditor-input', SALUD)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Ccf .dx-texteditor-input', CCF)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Ibcf .dx-texteditor-input', IBCF)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Sena .dx-texteditor-input', SENA)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Esap .dx-texteditor-input', ESAP)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_MinEdu .dx-texteditor-input', MIN_EDU)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_PensionE .dx-texteditor-input', PENSION_E)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_SaludE .dx-texteditor-input', SALUD_E)
            .pressKey('enter')
            .pressKey('enter')
            .pressKey('enter')
            .wait(2000);
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parametros Año');
        await t
            .typeText('#gridParametrosAno .dx-texteditor-input', ANO)
            .wait(2000)
            .expect((Selector('#gridParametrosAno td').withText(ANO)).exists).ok('No se creó el registro')
            .click(Selector('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))  
            .wait(2000)
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Adm .dx-texteditor-input', VALOR_ADMIN_EDIT)
            .pressKey('enter')
            .pressKey('ctrl+a')
            .pressKey('backspace')
            .typeText('#txtParametrosAno_Con .dx-texteditor-input', VALOR_CONTABLE_EDIT)
            .click(Selector('#BtnGuardarParametrosAno span').withText('Guardar'))
            .pressKey('enter')
            .wait(1000);
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parametros Año');
        await t
            .typeText('#gridParametrosAno .dx-texteditor-input', ANO)
            .wait(2000)
            .expect((Selector('#gridParametrosAno td').withText(ANO)).exists).ok('No se ha creado el registro')
    // Se edita el registro
            .click(Selector('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))  
            .wait(2000)
            .wait(3000)
            const admin = Selector('#txtParametrosAno_Adm .dx-texteditor-input');
            let valorCampo = await admin.value;
            valorCampo = valorCampo.replace(/\./g, ''); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const contable = Selector('#txtParametrosAno_Con .dx-texteditor-input');
            valorCampo = await contable.value;
            valorCampo = valorCampo.replace(/\./g, ''); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const salarioMinimo = Selector('#txtParametrosAno_SalaMini .dx-texteditor-input');
            valorCampo = await salarioMinimo.value;
            valorCampo = valorCampo.replace(/\./g, ''); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const auxTrans = Selector('#txtParametrosAno_AuxTransporte .dx-texteditor-input');
            valorCampo = await auxTrans.value;
            valorCampo = valorCampo.replace(/\./g, ''); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
           
            const valorUVT = Selector('#txtParametrosAno_ValorUVT .dx-texteditor-input');
            valorCampo = await valorUVT.value;
            valorCampo = valorCampo.replace(/\./g, ''); 
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
         
           //'Tarifas de Seguridad Social'
            const pension = Selector('#txtParametrosAno_Pension .dx-texteditor-input');
            valorCampo = await pension.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const salud = Selector('#txtParametrosAno_Salud .dx-texteditor-input');
             valorCampo = await salud.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const ccf = Selector('#txtParametrosAno_Ccf .dx-texteditor-input');     
             valorCampo = await ccf.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const ibcf = Selector('#txtParametrosAno_Ibcf .dx-texteditor-input');
             valorCampo = await ibcf.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const sena = Selector('#txtParametrosAno_Sena .dx-texteditor-input');
             valorCampo = await sena.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
         
            const esap = Selector('#txtParametrosAno_Esap .dx-texteditor-input');
             valorCampo = await esap.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
           
            const minEdu = Selector('#txtParametrosAno_MinEdu .dx-texteditor-input');
             valorCampo = await minEdu.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    //Empleados
            const pensionE = Selector('#txtParametrosAno_PensionE .dx-texteditor-input');
             valorCampo = await pensionE.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
    
            const saludE = Selector('#txtParametrosAno_SaludE .dx-texteditor-input');
             valorCampo = await saludE.value;
            valorCampo = valorCampo.replace('%', '').replace(',', '.');
            valorCampo = parseFloat(valorCampo);
            await t 
            .expect(Number(valorCampo)).gt(0, 'El valor es menor o igual a 0');
        await cerrarPestana360(t);
        await abrirHerramientas360(t, 'Parametros Año');
        await t
            .typeText('#gridParametrosAno .dx-texteditor-input', ANO)
            .wait(2000)
    //Se elimina el registro
            .click('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-delete dx"]')
            .pressKey('enter')
            .click('#gridParametrosAno .dx-icon.dx-icon-refresh')
            .wait(2000)
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `Prueba ParametrosAño - Test Hgi360`
    .page(testAdminConfig.pagina);

test('Prueba validación valores año por defecto - Test Hgi360', async t => {
    await ejecutarPruebaValidaciNValoresAOPorDefecto(t, testAdminConfig, ingresarAplicacion);
});

test('Prueba CRUD ParametrosAño - Test Hgi360', async t => {
    await ejecutarPruebaCRUDParametrosAO(t, testAdminConfig, ingresarAplicacion);
});

fixture `Prueba ParametrosAño - Hgi360 Admin`
    .page(hgiAdminConfig.pagina);

test('Prueba validación valores año por defecto - Hgi360 Admin', async t => {
    await ejecutarPruebaValidaciNValoresAOPorDefecto(t, hgiAdminConfig, ingresarAplicacion);
});

test('Prueba CRUD ParametrosAño - Hgi360 Admin', async t => {
    await ejecutarPruebaCRUDParametrosAO(t, hgiAdminConfig, ingresarAplicacion);
});
