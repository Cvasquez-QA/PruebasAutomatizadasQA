import { Selector } from 'testcafe';

/**
 * Valida el menú estándar de test.hgi360.com (React): por cada módulo del menú lateral, que existan sus
 * opciones en el menú de tarjetas (estén visibles o dentro de un "Ver más").
 *
 * menus = [{ modulo: 'Maestros', opciones: ['Sucursales', 'Centro de Costo', ...] }, ...]
 * Los textos se comparan exactos, como los muestra el menú (p. ej. 'Liquidación de Periodo').
 */
export async function validarMenus360(t, menus) {
    const faltantes = [];
    for (const { modulo, opciones } of menus) {
        const boton = Selector('#ErpSidebarModulos span').withExactText(modulo);
        await t
            .switchToMainWindow()
            .expect(boton.with({ timeout: 30000 }).exists).ok(`No apareció el módulo ${modulo} en el menú lateral`)
            .click(boton.nth(0));
        // La primera opción confirma que el menú de tarjetas ya es el del módulo pulsado
        await t.expect(Selector('#ErpMenuCardGrid .erp-menu-child-text').withExactText(opciones[0]).with({ timeout: 15000 }).exists)
            .ok(`No cargó el menú de ${modulo} (no aparece "${opciones[0]}")`);
        for (const opcion of opciones) {
            if (!await Selector('#ErpMenuCardGrid .erp-menu-child-text').withExactText(opcion).exists) {
                faltantes.push(`${modulo} > ${opcion}`);
            }
        }
    }
    await t.expect(faltantes).eql([], `No se visualizan estas opciones del menú: ${faltantes.join(', ')}`);
}
