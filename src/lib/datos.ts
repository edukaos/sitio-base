import sitioJson from '../content/sitio.json';

export type Enlace = { texto?: string; enlace?: string };

export type Sitio = {
  nombre: string;
  eslogan?: string;
  logo?: string;
  tema?: string;
  colorPrincipal?: string;
  menu?: Enlace[];
  contacto?: {
    telefono?: string;
    email?: string;
    direccion?: string;
    horarios?: string;
    whatsapp?: string;
    mensajeWhatsapp?: string;
  };
  redes?: { instagram?: string; facebook?: string; linkedin?: string; tiktok?: string };
  formularioClave?: string;
  seoImagen?: string;
};

export type Seccion = { tipo: string; ancla?: string; [clave: string]: any };

export type Pagina = {
  titulo: string;
  slug: string;
  descripcion?: string;
  secciones: Seccion[];
};

export const sitio = sitioJson as Sitio;

const archivos = import.meta.glob<{ default: Omit<Pagina, 'slug'> & { slug?: string } }>(
  '../content/paginas/*.json',
  { eager: true },
);

export const paginas: Pagina[] = Object.entries(archivos).map(([ruta, modulo]) => {
  const p = modulo.default;
  const archivo = ruta.split('/').pop()!.replace(/\.json$/, '');
  let slug = (p.slug ?? archivo).trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  if (slug === 'inicio' || slug === 'index') slug = '';
  return { ...p, slug, secciones: p.secciones ?? [] };
});

/** Arma un link de WhatsApp a partir de un número con cualquier formato. */
export function enlaceWhatsapp(numero?: string, texto?: string) {
  const n = (numero ?? '').replace(/\D/g, '');
  if (!n) return '';
  return `https://wa.me/${n}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;
}

export function tieneTexto(v?: string) {
  return typeof v === 'string' && v.trim().length > 0;
}
