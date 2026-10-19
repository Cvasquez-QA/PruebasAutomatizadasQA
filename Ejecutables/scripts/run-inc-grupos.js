const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..', '..');
const incDir = path.join(projectRoot, 'Inconsistencias');
const gruposPath = path.join(incDir, 'grupos.json');
const GROUP_SIZE = 10;

function isCopia(name) {
    return /copia|\scopy\b/i.test(name);
}

function listJs() {
    return fs.readdirSync(incDir)
        .filter(name => name.endsWith('.js') && !isCopia(name))
        .sort((a, b) => {
            const na = Number((a.match(/^INC(\d+)/i) || [])[1] || 99999);
            const nb = Number((b.match(/^INC(\d+)/i) || [])[1] || 99999);
            if (na !== nb) return na - nb;
            return a.localeCompare(b, 'es');
        });
}

function splitGroups(files) {
    const groups = [];
    for (let i = 0; i < files.length; i += GROUP_SIZE) {
        const chunk = files.slice(i, i + GROUP_SIZE);
        groups.push({ id: groups.length + 1, count: chunk.length, files: chunk });
    }
    return { groupSize: GROUP_SIZE, total: files.length, groups };
}

function sync() {
    const inc = listJs().filter(name => /^INC/i.test(name));
    const data = splitGroups(inc);
    fs.writeFileSync(gruposPath, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`grupos.json actualizado: ${data.total} archivos INC en ${data.groups.length} grupos de ${GROUP_SIZE}.`);
    return data;
}

function loadGrupos() {
    if (!fs.existsSync(gruposPath)) return sync();
    return JSON.parse(fs.readFileSync(gruposPath, 'utf8'));
}

function fechaHoy() {
    const now = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function quote(value) {
    const text = String(value);
    if (!/[\s"^&|<>]/.test(text)) return text;
    return `"${text.replace(/"/g, '\\"')}"`;
}

function limpiarChrome() {
    const cleaner = path.join(projectRoot, 'Ejecutables', '_Limpiar-Chrome-TestCafe.bat');
    spawnSync('cmd.exe', ['/c', cleaner], { cwd: projectRoot, stdio: 'inherit' });
}

function runTestcafe(files, reportRel, tcArgs) {
    const testcafe = path.join(projectRoot, 'node_modules', '.bin', 'testcafe.cmd');
    if (!fs.existsSync(testcafe)) {
        console.error('No se encontro node_modules\\.bin\\testcafe.cmd. Ejecuta npm install en PruebasAutomatizadasQA.');
        return 1;
    }

    const reportAbs = path.join(projectRoot, reportRel);
    fs.mkdirSync(path.dirname(reportAbs), { recursive: true });

    const args = [
        'chrome',
        ...files.map(file => path.join('Inconsistencias', file).replace(/\\/g, '/')),
        ...tcArgs,
        '--reporter',
        `html:${reportRel.replace(/\\/g, '/')}`,
    ];
    const command = `${quote(testcafe)} ${args.map(quote).join(' ')}`;
    const result = spawnSync(command, { cwd: projectRoot, stdio: 'inherit', shell: true });
    return result.status == null ? 1 : result.status;
}

function list() {
    const data = loadGrupos();
    console.log(`${data.total} archivos en ${data.groups.length} grupos de ${data.groupSize}.`);
    for (const group of data.groups) {
        console.log(`Grupo ${group.id} (${group.count}): ${group.files.join(', ')}`);
    }
}

function runGroups(ids, tcArgs) {
    const data = loadGrupos();
    const fecha = fechaHoy();
    const selected = data.groups.filter(group => ids.includes(group.id));
    if (!selected.length) {
        console.error(`No hay grupos con id: ${ids.join(', ')}`);
        return 1;
    }

    let failed = 0;
    for (const group of selected) {
        const report = path.join('Reportes', 'InconsistenciasHgi', 'INC', fecha, `Grupo${group.id}_${fecha}.html`);
        console.log(`\n======== Grupo ${group.id}/${data.groups.length} (${group.count} archivos) ========`);
        const status = runTestcafe(group.files, report, tcArgs);
        if (status !== 0) {
            failed = 1;
            console.error(`Grupo ${group.id} termino con errores (codigo ${status}). Se continua con el siguiente.`);
        }
        limpiarChrome();
    }
    return failed;
}

function runFn(tcArgs) {
    const grouped = new Set(loadGrupos().groups.flatMap(group => group.files));
    const extras = listJs().filter(name => !grouped.has(name));
    if (!extras.length) {
        console.log('No hay archivos FN fuera de los grupos INC.');
        return 0;
    }

    const fecha = fechaHoy();
    const report = path.join('Reportes', 'InconsistenciasHgi', 'FN', fecha, `FN_${fecha}.html`);
    console.log(`\n======== FN (${extras.length} archivos) ========`);
    const status = runTestcafe(extras, report, tcArgs);
    limpiarChrome();
    return status === 0 ? 0 : 1;
}

function main() {
    const [command = 'list', ...rest] = process.argv.slice(2);
    if (!fs.existsSync(incDir)) {
        console.error(`No se encontro la carpeta Inconsistencias en ${projectRoot}`);
        process.exit(1);
    }

    if (command === 'sync') {
        sync();
        return;
    }
    if (command === 'list') {
        list();
        return;
    }
    if (command === 'all') {
        sync();
        const groupIds = loadGrupos().groups.map(group => group.id);
        const failedGroups = runGroups(groupIds, rest);
        const failedFn = runFn(rest);
        process.exit(failedGroups || failedFn ? 1 : 0);
    }
    if (/^\d+$/.test(command)) {
        process.exit(runGroups([Number(command)], rest));
    }

    console.error('Uso: node Ejecutables/scripts/run-inc-grupos.js <sync|list|all|numero-de-grupo> [opciones testcafe]');
    process.exit(1);
}

main();
