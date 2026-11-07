import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
export async function checkPlaceholders(){const html=await readFile('dist/index.html','utf8'); if(/\[CONFIRMAR[^\]]*\]/i.test(html))throw Error('Há marcadores de confirmação no HTML publicado.'); if((html.match(/<h1[ >]/g)||[]).length!==1)throw Error('A página deve conter exatamente um H1.');console.log('HTML sem placeholders; H1 único.');}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await checkPlaceholders();
