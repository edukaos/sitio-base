// Fuentes de Google que carga cada tema.
export const temas: Record<string, { nombre: string; fuentes: string }> = {
  profesional: {
    nombre: 'Profesional',
    fuentes: 'family=Lora:wght@500;600;700&family=Inter:wght@400;500;600',
  },
  sabor: {
    nombre: 'Sabor',
    fuentes: 'family=Fraunces:opsz,wght@9..144,500;9..144,700&family=DM+Sans:wght@400;500;700',
  },
  startup: {
    nombre: 'Startup',
    fuentes: 'family=Plus+Jakarta+Sans:wght@500;700;800&family=Inter:wght@400;500;600',
  },
  bienestar: {
    nombre: 'Bienestar',
    fuentes: 'family=Cormorant+Garamond:wght@500;600;700&family=Nunito+Sans:wght@400;600;700',
  },
  barrio: {
    nombre: 'Barrio',
    fuentes: 'family=Archivo+Black&family=Archivo:wght@400;500;700',
  },
};

export function temaValido(t?: string) {
  return t && temas[t] ? t : 'profesional';
}
