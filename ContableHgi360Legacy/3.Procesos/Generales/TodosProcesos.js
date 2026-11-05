import { Selector } from 'testcafe';
import { cerrarSesion360, ingresarAplicacion, cerrarPestana360, ingresarAplicacionMiHappgi } from '../../../Funciones/HelpersHgi360Legacy.js';
import { miContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
import { testContableConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js'; 
/*
***************
****************
******************
********************
********************
************
*/


async function ejecutarPruebaTodosProcesos1(t, config, ingresar) {
    await ingresar(t, config);
        await t
            .click(Selector('a').withText('Procesos'))
            .click(Selector('span').withText('CARTERA'))
            .wait(8000)
            await t.click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
            await t
            .wait(4000)
              .click(Selector('a').withText('Procesos'))
              .click(Selector('span').withText('PEDIDOS'))
                .click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
            .wait(4000)
            .click(Selector('a').withText('Procesos'))
            .wait(2000)
            .click(Selector('span').withText('INVENTARIO'))
            .wait(1500)
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
         //Validación
         const botonMensaje = await Selector('#ModalValidaciones button').withText('Aceptar');
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
            await t
            .click(Selector('.swal2-confirm.btn.btn-success'))
            .wait(1500)
            .click(Selector('a').withText('Procesos'))
            .wait(1500)
            .click(Selector('a').withText('INVENTARIO CON SALDO INICIAL'))
            .wait(10000)
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
            if(await botonMensaje.exists){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
                await t
            .wait(5000)
                //.click(botonMensaje)
                .click(botonMensaje)
                .click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
        //Se cierra sesión
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaTodosProcesos2(t, config, ingresar) {
    await ingresar(t, config);
        await t
            .click(Selector('a').withText('Procesos'))
            .click(Selector('span').withText('CARTERA'))
            .wait(10000)
            await t.click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
            await t
            .wait(4000)
              .click(Selector('a').withText('Procesos'))
              .click(Selector('span').withText('PEDIDOS'))
                .click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
            .wait(4000)
            .click(Selector('a').withText('Procesos'))
            .wait(2000)
            .click(Selector('span').withText('INVENTARIO'))
            .wait(1500)
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
            .wait(6000)
         //Validación
         const botonMensaje = await Selector('#ModalValidaciones button').withText('Aceptar');
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
            await t
            .click(Selector('.swal2-confirm.btn.btn-success'))
            .wait(1500)
            .click(Selector('a').withText('Procesos'))
            .wait(1500)
            .click(Selector('a').withText('INVENTARIO CON SALDO INICIAL'))
            .wait(10000)
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
            if(await botonMensaje.exists){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
                await t
            .wait(5000)
                //.click(botonMensaje)
                .click(botonMensaje)
                .click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
        //Se cierra sesión
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

async function ejecutarPruebaTodosProcesos3(t, config, ingresar) {
    await ingresar(t, config);
        await t
            .click(Selector('a').withText('Procesos'))
            .click(Selector('span').withText('CARTERA'))
            .wait(8000)
            await t.click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
            await t
            .wait(4000)
              .click(Selector('a').withText('Procesos'))
              .click(Selector('span').withText('PEDIDOS'))
                .click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
            .wait(4000)
            .click(Selector('a').withText('Procesos'))
            .wait(2000)
            .click(Selector('span').withText('INVENTARIO'))
            .wait(1500)
            .switchToIframe(Selector('iframe').withAttribute('id', /^iframe_tab_/))
            .wait(1500)
         //Validación
         const botonMensaje = await Selector('#ModalValidaciones button').withText('Aceptar');
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
            await t
            .click(Selector('.swal2-confirm.btn.btn-success'))
            .wait(1500)
            .click(Selector('a').withText('Procesos'))
            .wait(1500)
            .click(Selector('a').withText('INVENTARIO CON SALDO INICIAL'))
            .wait(10000)
             if(await botonMensaje.visible){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
            if(await botonMensaje.exists){
                await t
            .click(botonMensaje)
                .wait(1500)
            }
                await t
            .wait(5000)
                //.click(botonMensaje)
                //.click(botonMensaje)
                .click(Selector('.swal2-confirm.btn.btn-success'))
                .wait(1500)
        //Se cierra sesión
        await cerrarPestana360(t);
        await cerrarSesion360(t);
}

fixture `TodosProcesos - Mi ERP`
    .page(miContableConfig.pagina);

test('Prueba ejecucion todos los procesos Test Contable - Mi ERP', async t => {
    await ejecutarPruebaTodosProcesos1(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba ejecucion todos los procesos Mi Contable - Mi ERP', async t => {
    await ejecutarPruebaTodosProcesos2(t, miContableConfig, ingresarAplicacionMiHappgi);
});

test('Prueba ejecucion todos los procesos testHappgi - Mi ERP', async t => {
    await ejecutarPruebaTodosProcesos3(t, miContableConfig, ingresarAplicacionMiHappgi);
});

fixture `TodosProcesos - Test Contable`
    .page(testContableConfig.pagina);

test('Prueba ejecucion todos los procesos Test Contable - Test Contable', async t => {
    await ejecutarPruebaTodosProcesos1(t, testContableConfig, ingresarAplicacion);
});

test('Prueba ejecucion todos los procesos Mi Contable - Test Contable', async t => {
    await ejecutarPruebaTodosProcesos2(t, testContableConfig, ingresarAplicacion);
});

test('Prueba ejecucion todos los procesos testHappgi - Test Contable', async t => {
    await ejecutarPruebaTodosProcesos3(t, testContableConfig, ingresarAplicacion);
});
