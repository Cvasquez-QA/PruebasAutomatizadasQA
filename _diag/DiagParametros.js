import { ClientFunction, Selector } from 'testcafe';
import { CONFIG_PARAMETROS, antesDeCadaParametros } from '../Funciones/FlujoParametros360.js';
import { ingresarAplicacion } from '../Funciones/HelpersHgi360Web.js';
import { abrirParametros360, abrirPestanaParametros360 } from '../Funciones/HelpersParametros360.js';

// Diagnóstico temporal (Claude, 02-nov-2026): solo lee la pantalla, no guarda nada.
const log = (...a) => console.log('[DIAG]', ...a);

const visible = e => { try { return !!(e.offsetParent || (e.getClientRects && e.getClientRects().length)); } catch (x) { return false; } };

const tabInfo = ClientFunction(clave => {
    const t = document.getElementById(`tabs_parametros_${clave}`);
    if (!t) return '(no existe)';
    const sube = [];
    for (let e = t, i = 0; e && i < 4; e = e.parentElement, i++) sube.push(`${e.tagName}.${(e.className || '').toString().slice(0, 80)}[sel=${e.getAttribute('aria-selected')}]`);
    return `${t.outerHTML.slice(0, 400)} || padres: ${sube.join(' > ')}`;
});
const tabSeleccionada = ClientFunction(() => [...document.querySelectorAll('.dx-tab-selected, [role="tab"][aria-selected="true"]')]
    .map(e => (e.id || '') + ':' + e.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)).join(' | '));
const contenidoVisible = ClientFunction(() => {
    const vis = e => { try { return !!(e.offsetParent || (e.getClientRects && e.getClientRects().length)); } catch (x) { return false; } };
    return [...document.querySelectorAll('[id^="tabs_parametros_content_"], [data-testid]')].filter(vis)
        .map(e => e.id || `dt:${e.getAttribute('data-testid')}`).slice(0, 40).join(', ');
});
const decimales = ClientFunction(() => {
    const e = document.getElementById('TxtPrm_Contable_IntDecimalesCon');
    if (!e) return '(no existe)';
    const r = [];
    for (let p = e, i = 0; p && i < 6; p = p.parentElement, i++) r.push(`${(p.className || '').toString().slice(0, 60)} vis=${getComputedStyle(p).visibility} disp=${getComputedStyle(p).display}`);
    return r.join(' > ');
});
const gridPos = ClientFunction(() => {
    const g = document.querySelector('[data-testid="Grid_ParametrosGenerales_Pos_Pendientes"], #Grid_ParametrosGenerales_Pos_Pendientes');
    if (!g) return '(sin grid)';
    const filas = [...g.querySelectorAll('tr.dx-data-row')].map(r => r.innerText.replace(/\s+/g, ' ').trim());
    const p = g.querySelector('.dx-pager');
    const orden = [...g.querySelectorAll('.dx-header-row td')].map(td => td.innerText.trim() + (td.querySelector('.dx-sort-up') ? '↑' : td.querySelector('.dx-sort-down') ? '↓' : '')).join('|');
    return `filas=${filas.length} cols=${orden} primeras=${JSON.stringify(filas.slice(0, 6))} ultimas=${JSON.stringify(filas.slice(-3))} buscador=${!!g.querySelector('.dx-datagrid-search-panel')} pager=${p ? p.innerText.replace(/\s+/g, ' ').slice(0, 200) : '-'}`;
});

const valoresDefecto = ClientFunction(() => ['PG_DireccionDef', 'PG_TelefonoDef'].map(id => {
    const e = document.querySelector(`[data-testid="${id}"], #${id}, [data-testid="txt${id}"], #txt${id}`);
    const i = e && e.querySelector('input.dx-texteditor-input');
    return `${id}=${e ? JSON.stringify(i ? i.value : e.textContent) : '(no existe)'}`;
}).join(' | '));

fixture `DIAG Parámetros`
    .page(CONFIG_PARAMETROS.pagina)
    .beforeEach(antesDeCadaParametros);

test('DIAG Parámetros', async t => {
    await ingresarAplicacion(t, CONFIG_PARAMETROS);
    await abrirParametros360(t);

    for (const clave of ['Plantilla', 'Defecto', 'Mensajes']) {
        log('TAB', clave, await tabInfo(clave));
        const tab = Selector(`#tabs_parametros_${clave}`);
        if (await tab.exists) {
            await t.click(tab).wait(3000);
            log('TAB', clave, 'seleccionadas:', await tabSeleccionada());
            log('TAB', clave, 'visibles:', await contenidoVisible());
            if (clave === 'Defecto') log('VALORES Defecto', await valoresDefecto());
        }
    }

    await t.click(Selector('#tabs_parametros_Contable')).wait(2000);
    log('DECIMALES consulta', await decimales());
    await t.click('#BtnEditar_btn').wait(3000);
    await t.click(Selector('#tabs_parametros_Contable')).wait(2000);
    log('DECIMALES edicion', await decimales());

    await t.click(Selector('#tabs_parametros_Pos')).wait(4000);
    log('GRID POS edicion', await gridPos());
    const cerrar = Selector('#BtnCancelarParametrosGenerales_btn').filterVisible();
    if (await cerrar.exists) await t.click(cerrar).wait(2000);
});
