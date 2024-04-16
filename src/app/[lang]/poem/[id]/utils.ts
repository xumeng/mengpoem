import { type Author, type Poem } from "@prisma/client";

export const getPoemTitle = (poem: Poem & { author: Author }) => {
  return `《${poem.title}》· ${poem.author.name} #${poem.title} #Meng诗 #amonxu #mengxu #xumeng`;
};
