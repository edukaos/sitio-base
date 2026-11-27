// Colección de productos (kit Panadería / gastronomía / comercios).
// Cada producto es un archivo JSON en src/content/productos/, cargado desde el panel.
import { aSlug } from './propiedades';

export type Producto = {
  nombre: string;
  slug: string;
  categoria: string;
  precio?: number;
  unidad?: string;
  descripcion?: string;
  foto?: string;
  disponible?: boolean;
  destacado?: boolean;
  orden?: number;
};

const archivos = import.meta.glob<{ default: Partial<Producto> }>('../content/productos/*.json', { eager: true });

export const productos: Producto[] = Object.entries(archivos)
  .map(([ruta, modulo]) => {
    const p = modulo.default;
    const archivo = ruta.split('/').pop()!.replace(/\.json$/, '');
    return {
      ...p,
      nombre: p.nombre ?? archivo,
      slug: aSlug(p.slug || archivo),
      categoria: (p.categoria ?? 'Otros').trim(),
      disponible: p.disponible ?? true,
    } as Producto;
  })
  .sort((a, b) => (a.orden ?? 999) - (b.orden ?? 999) || a.nombre.localeCompare(b.nombre));

/** Categorías en el orden en que aparecen sus productos. */
export function categorias(lista: Producto[] = productos) {
  return [...new Set(lista.map((p) => p.categoria))];
}

export function formatoPesos(n?: number) {
  if (!n && n !== 0) return '';
  return `$ ${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n)}`;
}
