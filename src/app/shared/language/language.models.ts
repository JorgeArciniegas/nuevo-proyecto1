export enum LANGUAGES {
  en = 'en-GB',
  it = 'it-IT',
  es = 'es-ES',
  de = 'de-DE',
  sq = 'sq-AL',
  pt = 'pt-BR',
  fr = 'fr-FR',
  ht = 'fr-HT'
}

// [, 'es', 'fr', 'pt', 'sq', 'de'],

export function getLanguages(lang: LANGUAGES, fromKey: boolean = false): LANGUAGES | string {
  if (!fromKey) {
    return Object.values(LANGUAGES).find(l => l === lang);
  } else {
    let index = -1;
    Object.values(LANGUAGES).find((l, idx) => { if (l === lang) { index = idx; } });
    return Object.keys(LANGUAGES)[index];
  }
}
