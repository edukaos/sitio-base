// Saca capturas de pantalla del sitio compilado (computadora y celular).
// Uso: node scripts/capturas.mjs <carpeta-salida> <ruta1> <ruta2> ...
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [salida, ...rutas] = process.argv.slice(2);
mkdirSync(salida, { recursive: true });
const base = 'http://localhost:4321';
const tamanos = { compu: { width: 1280, height: 800 }, celu: { width: 390, height: 844 } };

const navegador = await chromium.launch();
for (const [nombre, viewport] of Object.entries(tamanos)) {
  const pagina = await navegador.newPage({ viewport, deviceScaleFactor: 1 });
  for (const ruta of rutas) {
    await pagina.goto(base + ruta, { waitUntil: 'networkidle' });
    await pagina.waitForTimeout(500);
    const archivo = `${salida}/${nombre}${ruta.replace(/[^a-z0-9]+/gi, '_') || '_'}.png`;
    await pagina.screenshot({ path: archivo, fullPage: true });
    console.log('ok', archivo);
  }
  await pagina.close();
}
await navegador.close();
