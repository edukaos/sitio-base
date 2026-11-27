// Colección de propiedades (kit Inmobiliaria).
// Cada propiedad es un archivo JSON en src/content/propiedades/, cargado desde el panel.

export type Propiedad = {
  titulo: string;
  slug: string;
  operacion: 'venta' | 'alquiler' | 'temporal';
  tipo: string;
  estado?: 'disponible' | 'reservada' | 'vendida';
  destacada?: boolean;
  precio?: number;
  moneda?: 'USD' | 'ARS';
  expensas?: number;
  barrio?: string;
  direccion?: string;
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  superficieTotal?: number;
  superficieCubierta?: number;
  cochera?: boolean;
  descripcion?: string;
  caracteristicas?: string[];
  fotos?: string[];
};

const archivos = import.meta.glob<{ default: Partial<Propiedad> }>('../content/propiedades/*.json', { eager: true });

export function aSlug(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const propiedades: Propiedad[] = Object.entries(archivos)
  .map(([ruta, modulo]) => {
    const p = modulo.default;
    const archivo = ruta.split('/').pop()!.replace(/\.json$/, '');
    return {
      ...p,
      titulo: p.titulo ?? archivo,
      slug: aSlug(p.slug || archivo),
      operacion: p.operacion ?? 'venta',
      tipo: p.tipo ?? 'casa',
      estado: p.estado ?? 'disponible',
      fotos: (p.fotos ?? []).filter(Boolean),
      caracteristicas: (p.caracteristicas ?? []).filter(Boolean),
    } as Propiedad;
  })
  // Destacadas primero; las vendidas al final
  .sort((a, b) => Number(b.destacada ?? false) - Number(a.destacada ?? false))
  .sort((a, b) => Number(a.estado === 'vendida') - Number(b.estado === 'vendida'));

export const nombresOperacion: Record<string, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
  temporal: 'Alquiler temporal',
};

export const nombresTipo: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  ph: 'PH',
  terreno: 'Terreno',
  local: 'Local',
  oficina: 'Oficina',
  cochera: 'Cochera',
  campo: 'Campo',
};

export function formatoPrecio(p: Pick<Propiedad, 'precio' | 'moneda' | 'operacion'>) {
  if (!p.precio) return 'Consultar precio';
  const numero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(p.precio);
  const simbolo = p.moneda === 'ARS' ? '$' : 'USD';
  const sufijo = p.operacion === 'venta' ? '' : ' / mes';
  return `${simbolo} ${numero}${sufijo}`;
}

export function valoresUnicos(campo: 'barrio' | 'tipo' | 'operacion') {
  return [...new Set(propiedades.map((p) => p[campo]).filter(Boolean) as string[])].sort();
}
