const fields=['name','company','role','email','demand','phase','type','size','message'];
const options={demand:['Estimativa de custos / CAPEX','Orçamento executivo','Disputas, aditivos e pleitos','Controle de custos','Outro apoio técnico'],phase:['Estudo de viabilidade','Projeto / planejamento','Contratação','Execução','Encerramento / discussão contratual'],type:['Infraestrutura','Industrial / nuclear','Edificações','Outro']};
const reply=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function onRequestPost({request,env}){
 if(request.headers.get('Origin')!==new URL(request.url).origin)return reply({error:'Origem inválida.'},403);
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply({error:'Formato inválido.'},415);
 const reader=request.body?.getReader();if(!reader)return reply({error:'Dados ausentes.'},400);
 let bytes=0,chunks=[];while(true){const{done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>16000){await reader.cancel();return reply({error:'Dados excessivos.'},413);}chunks.push(value);}
 let data;try{const body=new Uint8Array(bytes);let pos=0;for(const chunk of chunks){body.set(chunk,pos);pos+=chunk.length;}data=JSON.parse(new TextDecoder().decode(body));}catch{return reply({error:'Dados inválidos.'},400);}
 if(!data||typeof data!=='object'||Array.isArray(data)||data.website)return reply({error:'Solicitação inválida.'},400);
 for(const key of fields)if(typeof data[key]!=='string'||!data[key].trim()||data[key].length>(key==='message'?5000:key==='email'?254:180))return reply({error:'Revise os campos.'},400);
 if(data.message.trim().length<20||data.privacy!==true||!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)||/[\r\n]/.test(data.email))return reply({error:'Revise e-mail e privacidade.'},400);
 for(const[key,values]of Object.entries(options))if(!values.includes(data[key]))return reply({error:'Seleção inválida.'},400);
 if(env.CONTACT_ENABLED!=='true'||!env.RESEND_API_KEY||!env.MAIL_FROM||!env.CONTACT_RATE_LIMITER)return reply({error:'Envio indisponível. Utilize o e-mail institucional.'},503);
 if(!(await env.CONTACT_RATE_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'})).success)return reply({error:'Aguarde antes de tentar novamente.'},429);
 const utms=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].filter(k=>typeof data[k]==='string').map(k=>`${k}: ${data[k].slice(0,300)}`).join('\n');
 const messages=[{from:env.MAIL_FROM,to:[env.MAIL_TO||'contato@engeprice.com.br'],reply_to:data.email,subject:'Novo contexto de projeto — Engeprice',text:fields.map(k=>`${k}: ${data[k].trim()}`).join('\n\n')+'\n\n'+utms},{from:env.MAIL_FROM,to:[data.email],subject:'Sua mensagem para a Engeprice',text:'Recebemos sua mensagem. A equipe Engeprice retornará em breve.\n\nEngeprice\ncontato@engeprice.com.br'}];
 try{const result=await fetch('https://api.resend.com/emails/batch',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(messages)});if(!result.ok)return reply({error:'Falha no envio.'},502);return reply({success:true});}catch{return reply({error:'Serviço indisponível.'},502);}
}
export function onRequestGet(){return reply({error:'Método não permitido.'},405);}
