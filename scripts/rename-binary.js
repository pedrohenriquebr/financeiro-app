const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obter o target triple da plataforma atual
const rustInfo = execSync('rustc -Vv').toString();
const targetTriple = /host: (\S+)/g.exec(rustInfo)[1];

if (!targetTriple) {
    console.error('Failed to determine platform target triple');
    process.exit(1);
}

// Caminhos dos arquivos
const sourceFile = path.join(__dirname, '..', 'Financeiro.API', 'bin', 'Release', 'net8.0', 'publish', 'Financeiro.API.exe');
const targetFile = path.join(__dirname, '..', 'Financeiro.API', 'bin', 'Release', 'net8.0', 'publish', `Financeiro.API-${targetTriple}.exe`);

// Verificar se o arquivo fonte existe
if (!fs.existsSync(sourceFile)) {
    console.error(`Source file not found: ${sourceFile}`);
    process.exit(1);
}

// Copiar o arquivo com o novo nome
try {
    fs.renameSync(sourceFile, targetFile);
    console.log(`Successfully copied binary from: ${path.basename(sourceFile)}`);
    console.log(`Successfully copied binary to: ${path.basename(targetFile)}`);
    console.log(`Successfully renamed binary to: ${path.basename(targetFile)}`);
} catch (error) {
    console.error('Error renaming binary:', error);
    process.exit(1);
}
