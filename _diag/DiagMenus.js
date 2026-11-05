import { ClientFunction, Selector } from 'testcafe';
import {
    testHappgiAdminConfig, testHappgiPosConfig, testAdminConfig, testPosWebConfig
} from '../ParametrosPruebas/ParametrosPruebas.js';

// Diagnóstico temporal (Claude, 03-nov-2026): entra a cada ambiente de test y anota cómo es el menú. Solo lee.
const log = (...a) => console.log('[DIAG]', ...a);

const estado = ClientFunction(() => {
    const vis = e => { try { return !!(e.offsetParent || (e.getClientRects && e.getClientRects().length)); } catch (x) { return false; } };
    const txt = e => (e.textContent || '').replace(/\s+/g, ' ').trim();
    const sidebar = document.querySelector('#ErpSidebarModulos');
    const modulos = sidebar ? [...sidebar.querySelectorAll('span')].map(txt).filter(Boolean).slice(0, 20) : [];
    const navA = [...document.querySelectorAll('nav a, .navbar a, a.dropdown-toggle, a.nav-link')].filter(vis).map(txt).filter(Boolean).slice(0, 25);
    return JSON.stringify({
        url: location.href,
        sidebar: !!sidebar,
        modulos,
        navA,
        lblUsuario: !!document.querySelector('#LblUsuarioNombre'),
        iframes: document.querySelectorAll('iframe[id^="iframe_tab_"]').length,
        loginNuevo: !!document.querySelector('input[placeholder="Identificación Empresa"]'),
        loginViejo: !!document.querySelector('#TxtEmpresaIdentificacion')
    });
});

const menuNuevo = ClientFunction(() => {
    const vis = e => { try { return !!(e.offsetParent || (e.getClientRects && e.getClientRects().length)); } catch (x) { return false; } };
    const txt = e => ((e && e.textContent) || '').replace(/\s+/g, ' ').trim();
    const grupos = {};
    Array.prototype.forEach.call(document.querySelectorAll('#ErpMenuCardGrid .erp-menu-child-text'), h => {
        let art = h; while (art && art.tagName !== 'ARTICLE') art = art.parentElement;
        const tit = art ? (art.getAttribute('aria-label') || txt(art.firstElementChild).slice(0, 25)) : '?';
        (grupos[tit] = grupos[tit] || []).push(txt(h) + (vis(h) ? '' : '*'));
    });
    return Object.keys(grupos).map(k => `[${k}] ${grupos[k].join(', ')}`).join(' || ');
});

const menuViejo = ClientFunction(texto => {
    const vis = e => { try { return !!(e.offsetParent || (e.getClientRects && e.getClientRects().length)); } catch (x) { return false; } };
    const txt = e => ((e && e.textContent) || '').replace(/\s+/g, ' ').trim();
    const todos = Array.prototype.filter.call(document.querySelectorAll('body *'), e => txt(e) === texto && !Array.prototype.some.call(e.children, c => txt(c) === texto));
    if (!todos.length) return '(nada con el texto "' + texto + '")';
    return todos.slice(0, 3).map(e => {
        const cadena = []; for (let p = e, i = 0; p && i < 5; p = p.parentElement, i++) cadena.push(`${p.tagName}${p.id ? '#' + p.id : ''}${p.className && typeof p.className === 'string' ? '.' + p.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}`);
        const cont = e.parentElement && e.parentElement.parentElement;
        const hijos = cont ? Array.prototype.map.call(cont.querySelectorAll('a, span, li'), h => `${h.tagName}:${txt(h).slice(0, 35)}${vis(h) ? '' : '*'}`).filter(x => !/:\*?$/.test(x)).slice(0, 60) : [];
        return `${vis(e) ? 'VISIBLE' : 'oculto'} ${cadena.join(' < ')} || ${e.outerHTML.slice(0, 200)} || hijos: ${hijos.join(' | ')}`;
    }).join(' ### ');
});

const navegacion = ClientFunction(() => {
    const n = document.querySelector('nav, .navbar, #menu, .sidebar, header');
    return n ? n.outerHTML.replace(/\s+/g, ' ').slice(0, 2500) : '(sin nav)';
});

async function entrar(t, config) {
    await t.navigateTo(config.pagina).wait(5000);
    const nuevo = Selector('input[placeholder="Identificación Empresa"]');
    const viejo = Selector('#TxtEmpresaIdentificacion .dx-texteditor-input');
    if (await nuevo.with({ timeout: 15000 }).exists) {
        await t
            .typeText(nuevo, config.empresa, { replace: true, paste: true })
            .typeText('input[placeholder="Usuario"]', config.usuario, { replace: true, paste: true })
            .typeText('input[placeholder="Contraseña"]', config.clave, { replace: true, paste: true })
            .click('#buttonAutenticar');
    } else if (await viejo.with({ timeout: 10000 }).exists) {
        await t
            .typeText(viejo, config.empresa, { replace: true, paste: true })
            .typeText('#TxtUsuarioCodigo .dx-texteditor-input', config.usuario, { replace: true, paste: true })
            .typeText('#TxtUsuarioClave .dx-texteditor-input', config.clave, { replace: true, paste: true })
            .click('#buttonAutenticar');
    } else {
        log(config.pagina, 'NO SE ENCONTRO LOGIN');
    }
    await t.wait(12000);
}

fixture `DIAG Menus`;

const AMBIENTES = [
    ['testHappgiAdmin', testHappgiAdminConfig],
    ['testHappgiPos', testHappgiPosConfig],
    ['testAdmin(test.hgi360)', testAdminConfig],
    ['testPosWeb(test.hgi360)', testPosWebConfig]
];

for (const [nombre, config] of AMBIENTES) {
    test.page(config.pagina)(`DIAG ${nombre}`, async t => {
        log(nombre, 'ANTES', await estado());
        await entrar(t, config);
        log(nombre, 'DESPUES', await estado());
        if (await Selector('#ErpSidebarModulos').exists) {
            // Menú nuevo: cada módulo del lateral y todas sus opciones (las ocultas tras "Ver más" con *)
            for (const m of ['Maestros', 'Movimientos', 'Procesos', 'Herramientas', 'Utilitarios', 'Reportes']) {
                const mod = Selector('#ErpSidebarModulos span').withText(m);
                if (!await mod.exists) { log(nombre, 'MODULO', m, '(no existe)'); continue; }
                await t.click(mod).wait(3000);
                log(nombre, 'MODULO', m, await menuNuevo());
            }
        } else {
            log(nombre, 'NAV', await navegacion());
            for (const m of ['Maestros', 'Movimientos', 'Movimiento', 'Procesos', 'Reportes', 'Herramientas', 'Terceros', 'Parámetros']) {
                log(nombre, 'MENU', m, await menuViejo(m));
            }
        }
    });
}
