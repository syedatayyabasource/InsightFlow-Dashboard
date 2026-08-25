const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 5000;
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'data','orders.json'),'utf8'));
const publicDir = path.join(__dirname,'public');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json'};
function dashboard(url){
 const p=url.searchParams, from=p.get('from'), to=p.get('to'), category=p.get('category')||'All';
 const rows=data.filter(r=>(!from||r.date>=from)&&(!to||r.date<=to)&&(category==='All'||r.category===category));
 const revenue=rows.reduce((s,r)=>s+r.revenue,0), orders=rows.reduce((s,r)=>s+r.orders,0);
 const cats={}, months={}; rows.forEach(r=>{cats[r.category]??={revenue:0,orders:0};cats[r.category].revenue+=r.revenue;cats[r.category].orders+=r.orders;const m=r.date.slice(0,7);months[m]??={revenue:0,orders:0};months[m].revenue+=r.revenue;months[m].orders+=r.orders});
 const categories=Object.entries(cats).map(([name,v])=>({name,...v})).sort((a,b)=>b.revenue-a.revenue);
 const trend=Object.entries(months).sort().map(([month,v])=>({month,...v})); const prev=trend.at(-2), last=trend.at(-1); const growth=prev&&prev.revenue?((last.revenue-prev.revenue)/prev.revenue)*100:0;
 return {stats:{revenue,orders,avgOrderValue:orders?revenue/orders:0,topCategory:categories[0]?.name||'—',growth},categories,trend,recent:[...rows].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7)};
}
const server=http.createServer((req,res)=>{const url=new URL(req.url,`http://${req.headers.host}`);res.setHeader('Access-Control-Allow-Origin','*');if(url.pathname==='/api/health'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({status:'ok'}));}if(url.pathname==='/api/dashboard'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(dashboard(url)));}let file=url.pathname==='/'?'/index.html':url.pathname;const safe=path.normalize(file).replace(/^([.][.][/\\])+/, '');const fp=path.join(publicDir,safe);if(!fp.startsWith(publicDir)||!fs.existsSync(fp)){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':mime[path.extname(fp)]||'application/octet-stream'});fs.createReadStream(fp).pipe(res)});
server.listen(PORT,()=>console.log(`InsightFlow running at http://localhost:${PORT}`));
