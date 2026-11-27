# sitio-base

Plantilla para crear sitios de clientes rápido: **Astro + Tailwind + Pages CMS + Cloudflare**.

- **Diseño:** 5 temas (Profesional, Sabor, Startup, Bienestar, Barrio) que se cambian desde el panel.
- **Contenido:** páginas armadas con bloques (portada, servicios, nosotros, números, testimonios, preguntas, llamado, contacto).
- **Edición:** el cliente entra a [app.pagescms.org](https://app.pagescms.org) con su email y edita textos y fotos.
- **Publicación:** Cloudflare compila y publica solo cada vez que hay un cambio.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Datos del negocio (nombre, tema, contacto, redes) | `src/content/sitio.json` |
| Páginas y sus secciones | `src/content/paginas/*.json` |
| Colores y fuentes de cada tema | `src/temas/temas.css` |
| Bloques (diseño de cada sección) | `src/components/bloques/` |
| Qué puede editar el cliente | `.pages.yml` |
| Crédito de tu agencia en el pie | `src/config/agencia.json` |
| Plan del proyecto | `docs/PLAN.md` |

## Publicar en Cloudflare

1. Cloudflare → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**
2. Elegí este repositorio
3. Configuración de build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. **Save and Deploy**

## Cliente nuevo

1. En GitHub, en este repo: **Use this template → Create a new repository** (ej. `sitio-panaderia-la-espiga`)
2. Editá `src/content/sitio.json` y las páginas, o hacelo directo desde Pages CMS
3. Conectá el repo nuevo a Cloudflare (pasos de arriba) y agregá el dominio del cliente
4. En Pages CMS, invitá al cliente por email (**Settings → Collaborators**)

## Trabajar en tu computadora (opcional)

```bash
npm install
npm run dev     # abre http://localhost:4321
```
