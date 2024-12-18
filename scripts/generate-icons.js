const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Instalar dependências necessárias
console.log('Installing dependencies...');
execSync('pnpm add -D sharp png-to-ico', { stdio: 'inherit' });

const sharp = require('sharp');
const pngToIco = require('png-to-ico');

// Criar diretório de ícones se não existir
const iconsDir = path.join(__dirname, '..', 'src-tauri', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// URL do ícone base (um ícone de finanças do Material Design)
const iconUrl = 'https://raw.githubusercontent.com/google/material-design-icons/master/png/editor/attach_money/materialicons/48dp/2x/baseline_attach_money_black_48dp.png';

// Baixar o ícone base
console.log('Downloading base icon...');
execSync(`curl -o "${path.join(iconsDir, 'base_icon.png')}" ${iconUrl}`);

async function generateIcons() {
    const sizes = {
        '32x32.png': 32,
        '128x128.png': 128,
        '128x128@2x.png': 256,
        'icon.png': 512
    };

    // Gerar PNGs em diferentes tamanhos
    for (const [filename, size] of Object.entries(sizes)) {
        await sharp(path.join(iconsDir, 'base_icon.png'))
            .resize(size, size)
            .toFile(path.join(iconsDir, filename));
        console.log(`Generated ${filename}`);
    }

    // Gerar ICO file
    const pngBuffer = await sharp(path.join(iconsDir, 'base_icon.png'))
        .resize(256, 256)
        .png()
        .toBuffer();

    const icoBuffer = await pngToIco([pngBuffer]);
    fs.writeFileSync(path.join(iconsDir, 'icon.ico'), icoBuffer);
    console.log('Generated icon.ico');

    // Gerar ICNS para macOS (opcional)
    if (process.platform === 'darwin') {
        await sharp(path.join(iconsDir, 'base_icon.png'))
            .resize(512, 512)
            .toFile(path.join(iconsDir, 'icon.icns'));
        console.log('Generated icon.icns');
    }

    // Limpar arquivo base
    fs.unlinkSync(path.join(iconsDir, 'base_icon.png'));
    console.log('Cleaned up temporary files');
}

generateIcons().catch(console.error);
