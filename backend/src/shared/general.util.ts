export function generateSlug(text: string, unique: boolean = false) {
  let slug = normalizeSlug(text);
  if (unique) {
    let uniqueNumber = Math.floor(Math.random() * 1000);
    slug = slug + "-" + uniqueNumber;
  }
  return slug;
}

export function normalizeSlug(slug: string) {
  let normalizedSlug: string = slug.toLowerCase().replace(/ /g, "-");

  const regex: RegExp = /[áàãâéèêíóôõúç]/g;
  normalizedSlug = normalizedSlug.replace(regex, (match: string): string => {
    const replacementMap: { [key: string]: string } = {
      á: "a",
      à: "a",
      ã: "a",
      â: "a",
      é: "e",
      è: "e",
      ê: "e",
      í: "i",
      ó: "o",
      ô: "o",
      õ: "o",
      ú: "u",
      ç: "c",
    };
    return replacementMap[match] || match;
  });
  normalizedSlug = normalizedSlug.replace(/[^a-zA-Z0-9-]/g, "");
  return normalizedSlug;
}
