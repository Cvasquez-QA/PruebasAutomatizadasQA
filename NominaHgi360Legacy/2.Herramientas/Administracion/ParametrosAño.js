import { Selector } from 'testcafe';
import { miNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import { testNominaConfig } from '../../../ParametrosPruebas/ParametrosPruebas.js';
import {
    ingresarAplicacion,
    
    cerrarSesion360,
    eliminarRegistroDesdeGrid
} from '../../../Funciones/HelpersHgi360Legacy.js';
import {
    ingresarParametrosAno,
    cerrarSwalSiVisible
} from './HelpersNomina.js';

const ANIO_PRUEBA = '2023';
const VALORES_INICIALES = {
    administrativo: '01',
    contable: '02',
    salarioMinimo: '800000',
    auxilioTransporte: '1000',
    uvt: '50000',
    pension: '10',
    salud: '7',
    cajaCompensacion: '1',
    ibcf: '9825',
    sena: '78',
    esap: '99',
    ministerioEducacion: '55',
    pensionEmpleador: '78',
    saludEmpleador: '54'
};
const VALORES_EDITADOS = {
    administrativo: '12',
    contable: '13'
};

const eliminarAnioSiExiste = async t => {
    await t
        .typeText('#gridParametrosAno .dx-texteditor-input', ANIO_PRUEBA)
        .wait(2000);

    if (await Selector('#gridParametrosAno td').withText(ANIO_PRUEBA).exists) {
        await t
            .click('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-delete dx"]')
            .wait(1000);
        await cerrarSwalSiVisible(t);
        await t.wait(2000);
    }
    await cerrarSwalSiVisible(t);
};

const crearAnio = async t => {
    await cerrarSwalSiVisible(t);
    await t
        .click('#gridParametrosAno .dx-icon.dx-icon-add')
        .typeText(Selector('#txtParametrosAno_Año').nth(1), ANIO_PRUEBA)
        .click(Selector('#BtnCargarParametrosAno div').withText('Cargar'))
        .wait(3000);

    if (await Selector('.swal2-content div').exists) {
        const mensaje = await Selector('.swal2-content div').innerText;
        if (mensaje === 'Ya existe un registro con el código ingresado.') {
            await t
                .click(Selector('.swal2-actions button').withText('Aceptar'))
                .wait(2000);
            await eliminarAnioSiExiste(t);
            await crearAnio(t);
        }
    }
};

const validarMonedaPositiva = async (t, selector) => {
    const valorCampo = (await Selector(selector).value).replace(/\./g, '').replace(',', '.');
    await t.expect(Number(valorCampo)).gt(0, `El valor de ${selector} es menor o igual a 0`);
};

const validarPorcentajePositivo = async (t, selector) => {
    const valorCampo = (await Selector(selector).value).replace('%', '').replace(',', '.');
    await t.expect(parseFloat(valorCampo)).gt(0, `El valor de ${selector} es menor o igual a 0`);
};

const validarPorcentajeCero = async (t, selector) => {
    const valorCampo = (await Selector(selector).value).replace('%', '').replace(',', '.');
    await t.expect(parseFloat(valorCampo)).eql(0, `El valor de ${selector} debería ser 0`);
};

const validarValoresPorDefecto = async t => {
    await validarMonedaPositiva(t, '#txtParametrosAno_Adm .dx-texteditor-input');
    await validarMonedaPositiva(t, '#txtParametrosAno_Con .dx-texteditor-input');
    await validarMonedaPositiva(t, '#txtParametrosAno_SalaMini .dx-texteditor-input');
    await validarMonedaPositiva(t, '#txtParametrosAno_AuxTransporte .dx-texteditor-input');
    await validarMonedaPositiva(t, '#txtParametrosAno_ValorUVT .dx-texteditor-input');

    await validarPorcentajePositivo(t, '#txtParametrosAno_Pension .dx-texteditor-input');
    await validarPorcentajePositivo(t, '#txtParametrosAno_Salud .dx-texteditor-input');
    await validarPorcentajePositivo(t, '#txtParametrosAno_Ccf .dx-texteditor-input');
    await validarPorcentajePositivo(t, '#txtParametrosAno_Ibcf .dx-texteditor-input');
    await validarPorcentajePositivo(t, '#txtParametrosAno_Sena .dx-texteditor-input');
    await validarPorcentajePositivo(t, '#txtParametrosAno_PensionE .dx-texteditor-input');
    await validarPorcentajePositivo(t, '#txtParametrosAno_SaludE .dx-texteditor-input');

    await validarPorcentajeCero(t, '#txtParametrosAno_Esap .dx-texteditor-input');
    await validarPorcentajeCero(t, '#txtParametrosAno_MinEdu .dx-texteditor-input');
};

const ejecutarValoresPorDefecto = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarParametrosAno(t);
    await eliminarAnioSiExiste(t);
    await crearAnio(t);
    await validarValoresPorDefecto(t);
    await eliminarAnioSiExiste(t);
    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

const ejecutarCrudParametrosAno = async (t, config, ingresar) => {
    await ingresarAplicacion(t, config);
    await ingresarParametrosAno(t);
    await eliminarAnioSiExiste(t);
    await crearAnio(t);

    await t
        .click('#txtParametrosAno_Adm .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Adm .dx-texteditor-input', VALORES_INICIALES.administrativo)
        .pressKey('enter')
        .click('#txtParametrosAno_Con .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Con .dx-texteditor-input', VALORES_INICIALES.contable)
        .pressKey('enter')
        .click('#txtParametrosAno_SalaMini .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_SalaMini .dx-texteditor-input', VALORES_INICIALES.salarioMinimo)
        .pressKey('enter')
        .click('#txtParametrosAno_AuxTransporte .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_AuxTransporte .dx-texteditor-input', VALORES_INICIALES.auxilioTransporte)
        .pressKey('enter')
        .click('#txtParametrosAno_ValorUVT .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_ValorUVT .dx-texteditor-input', VALORES_INICIALES.uvt)
        .pressKey('enter')
        .click('#txtParametrosAno_Pension .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Pension .dx-texteditor-input', VALORES_INICIALES.pension)
        .pressKey('enter')
        .click('#txtParametrosAno_Salud .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Salud .dx-texteditor-input', VALORES_INICIALES.salud)
        .pressKey('enter')
        .click('#txtParametrosAno_Ccf .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Ccf .dx-texteditor-input', VALORES_INICIALES.cajaCompensacion)
        .pressKey('enter')
        .click('#txtParametrosAno_Ibcf .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Ibcf .dx-texteditor-input', VALORES_INICIALES.ibcf)
        .pressKey('enter')
        .click('#txtParametrosAno_Sena .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Sena .dx-texteditor-input', VALORES_INICIALES.sena)
        .pressKey('enter')
        .click('#txtParametrosAno_Esap .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Esap .dx-texteditor-input', VALORES_INICIALES.esap)
        .pressKey('enter')
        .click('#txtParametrosAno_MinEdu .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_MinEdu .dx-texteditor-input', VALORES_INICIALES.ministerioEducacion)
        .pressKey('enter')
        .click('#txtParametrosAno_PensionE .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_PensionE .dx-texteditor-input', VALORES_INICIALES.pensionEmpleador)
        .pressKey('enter')
        .click('#txtParametrosAno_SaludE .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_SaludE .dx-texteditor-input', VALORES_INICIALES.saludEmpleador)
        .pressKey('enter')
        .wait(2000)
        .expect(Selector('#gridParametrosAno td').withText(ANIO_PRUEBA).exists).ok('No se creó el registro')
        .click(Selector('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(2000)
        .click('#txtParametrosAno_Adm .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Adm .dx-texteditor-input', VALORES_EDITADOS.administrativo)
        .pressKey('enter')
        .click('#txtParametrosAno_Con .dx-texteditor-input')
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .typeText('#txtParametrosAno_Con .dx-texteditor-input', VALORES_EDITADOS.contable)
        .click(Selector('#BtnGuardarParametrosAno span').withText('Guardar'))
        .wait(2000)
        .click(Selector('#gridParametrosAno [class^="dx-button-mode-contained dx-link dx-link-edit dx-i"]').nth(1))
        .wait(2000);

    let valorCampo = (await Selector('#txtParametrosAno_Adm .dx-texteditor-input').value).replace(/\./g, '');
    await t.expect(Number(valorCampo)).gt(0, 'El valor administrativo no se guardó');

    valorCampo = (await Selector('#txtParametrosAno_Con .dx-texteditor-input').value).replace(/\./g, '');
    await t.expect(Number(valorCampo)).gt(0, 'El valor contable no se guardó');

    await eliminarRegistroDesdeGrid(t, '#gridParametrosAno');
    await t
        .wait(2000);

    await t.switchToMainWindow();
    await cerrarSesion360(t);
};

fixture `Prueba Parametros Año Hgi360 Nomina - MiHgi360 8893`
    .page(miNominaConfig.pagina);

test('[Mi Hgi360 8893] Parametros Año - valores por defecto al crear', async t => {
    await ejecutarValoresPorDefecto(t, miNominaConfig, ingresarAplicacion);
});

test('[Mi Hgi360 8893] Parametros Año - CRUD y persistencia', async t => {
    await ejecutarCrudParametrosAno(t, miNominaConfig, ingresarAplicacion);
});

fixture `Prueba Parametros Año Hgi360 Nomina - Test Hgi360 8902`
    .page(testNominaConfig.pagina);

test('[Test Hgi360 8902] Parametros Año - valores por defecto al crear', async t => {
    await ejecutarValoresPorDefecto(t, testNominaConfig, ingresarAplicacion);
});

test('[Test Hgi360 8902] Parametros Año - CRUD y persistencia', async t => {
    await ejecutarCrudParametrosAno(t, testNominaConfig, ingresarAplicacion);
});
