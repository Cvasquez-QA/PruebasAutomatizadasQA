import { Selector } from 'testcafe';
import { abrirHerramientas, cerrarPestana360 } from '../../../Funciones/HelpersHgi360Legacy.js';

const iframesTab = Selector('iframe').withAttribute('id', /^iframe_tab_/);

export const cerrarSwalSiVisible = async t => {
    const swal = Selector('.swal2-container.swal2-shown');
    if (await swal.exists) {
        const btnAceptar = Selector('.swal2-actions button').withText('Aceptar');
        if (await btnAceptar.exists) {
            await t.click(btnAceptar).wait(1500);
        }
    }
};

const selectorVisible = async selector => {
    const el = Selector(selector);
    return (await el.exists) && (await el.visible);
};

export const switchToContextoConSelector = async (t, selector) => {
    await t.switchToMainWindow();
    if (await selectorVisible(selector)) {
        return;
    }

    const count = await iframesTab.count;
    for (let i = 0; i < count; i++) {
        const frame = iframesTab.nth(i);
        if (!(await frame.visible)) {
            continue;
        }
        await t.switchToIframe(frame);
        if (await selectorVisible(selector)) {
            return;
        }
        await t.switchToMainWindow();
    }
};

export const switchToIframeParametros = async (t, tabSelector = null) => {
    const candidatos = [
        tabSelector,
        '#tabs_parametros_Nomina',
        '#tabs_parametros_Mensajes',
        '#tabs_parametros_Plantilla',
        '#tabs_parametros_Admin',
        '#PanelParametrosGenerales',
        '#BtnEditar'
    ].filter(Boolean);

    for (const selector of candidatos) {
        await switchToContextoConSelector(t, selector);
        if (await selectorVisible(selector)) {
            return;
        }
    }
};

export const ingresarFormatos = async t => {
    await abrirHerramientas(t, 'FORMATOS');
    await switchToContextoConSelector(t, '#gridFormatos');
};

export const ingresarParametros = async (t, tabSelector = null) => {
    await abrirHerramientas(t, 'PARÁMETROS');
    await switchToIframeParametros(t, tabSelector);
    if (tabSelector && (await selectorVisible(tabSelector))) {
        await t.click(tabSelector).wait(1500);
    }
};

export const ingresarParametrosAno = async t => {
    await abrirHerramientas(t, 'PARAMETROS AÑO');
    await switchToContextoConSelector(t, '#gridParametrosAno');
};

export const editarParametros = async t => {
    const btnIcono = Selector('#BtnEditar .dx-icon.dx-icon-edit').filterVisible();
    if (await btnIcono.exists) {
        await t.click(btnIcono).wait(1500);
    } else {
        await t.click(Selector('#BtnEditar div').withText('Editar').filterVisible()).wait(1500);
    }
};

export const guardarParametros = async t => {
    await t
        .click(Selector('#BtnGuardar span').withText('Guardar'))
        .wait(2000)
        .click(Selector('.swal2-actions button').withText('Aceptar'))
        .wait(2000);
};

export const reabrirParametros = async (t, tabSelector = null) => {
    await cerrarPestana360(t);
    await t.wait(1000);
    await ingresarParametros(t, tabSelector);
    await editarParametros(t);
};
