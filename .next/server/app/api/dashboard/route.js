(()=>{var a={};a.id=618,a.ids=[618],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4939:a=>{"use strict";a.exports=import("pg")},5429:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>z,patchFetch:()=>y,routeModule:()=>u,serverHooks:()=>x,workAsyncStorage:()=>v,workUnitAsyncStorage:()=>w});var d=c(9225),e=c(4006),f=c(8317),g=c(9373),h=c(4775),i=c(4235),j=c(261),k=c(4365),l=c(771),m=c(3461),n=c(7798),o=c(2280),p=c(2018),q=c(5696),r=c(7929),s=c(6439),t=c(7527);let u=new d.AppRouteRouteModule({definition:{kind:e.RouteKind.APP_ROUTE,page:"/api/dashboard/route",pathname:"/api/dashboard",filename:"route",bundlePath:"app/api/dashboard/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/home/cpslodge1163/dues-platform/app/api/dashboard/route.ts",nextConfigOutput:"",userland:()=>c(8661),...{}}),{workAsyncStorage:v,workUnitAsyncStorage:w,serverHooks:x}=u;function y(){return(0,f.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:w})}async function z(a,b,c){c.requestMeta&&(0,g.setRequestMeta)(a,c.requestMeta),u.isDev&&(0,g.addRequestMeta)(a,"devRequestTimingInternalsEnd",process.hrtime.bigint());let d="/api/dashboard/route";"/index"===d&&(d="/");let f=await u.prepare(a,b,{srcPage:d,multiZoneDraftMode:!1});if(!f)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:v,deploymentId:w,params:x,nextConfig:y,parsedUrl:z,isDraftMode:A,prerenderManifest:B,routerServerContext:C,isOnDemandRevalidate:D,revalidateOnlyGenerated:E,resolvedPathname:F,clientReferenceManifest:G,serverActionsManifest:H}=f,I=(0,j.normalizeAppPath)(d),J=!!(B.dynamicRoutes[I]||B.routes[F]),K=async()=>((null==C?void 0:C.render404)?await C.render404(a,b,z,!1):b.end("This page could not be found"),null);if(J&&!A){let a=!!B.routes[F],b=B.dynamicRoutes[I];if(b&&!1===b.fallback&&!a){if(y.adapterPath)return await K();throw new s.NoFallbackError}}let L=null;!J||u.isDev||A||(L="/index"===(L=F)?"/":L);let M=!0===u.isDev||!J,N=J&&!M;H&&G&&(0,i.setManifestsSingleton)({page:d,clientReferenceManifest:G,serverActionsManifest:H});let O=a.method||"GET",P=(0,h.getTracer)(),Q=P.getActiveScopeSpan(),R=!!(null==C?void 0:C.isWrappedByNextServer),S=!!(0,g.getRequestMeta)(a,"minimalMode"),T=(0,g.getRequestMeta)(a,"incrementalCache")||await u.getIncrementalCache(a,y,B,S);null==T||T.resetRequestCache(),globalThis.__incrementalCache=T;let U={params:x,previewProps:B.preview,renderOpts:{experimental:{authInterrupts:!!y.experimental.authInterrupts,useCacheTimeout:y.experimental.useCacheTimeout},cacheComponents:!!y.cacheComponents,validationLevel:y.experimental.instantInsights.validationLevel,supportsDynamicResponse:M,incrementalCache:T,hmrRefreshHash:(0,g.getRequestMeta)(a,"hmrRefreshHash"),cacheLifeProfiles:y.cacheLife,staticPageGenerationTimeout:y.staticPageGenerationTimeout,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d,e)=>u.onRequestError(a,b,d,e,C)},sharedContext:{buildId:v,deploymentId:w}},V=new k.NodeNextRequest(a),W=new k.NodeNextResponse(b),X=l.NextRequestAdapter.fromNodeNextRequest(V,(0,l.signalFromNodeResponse)(b)),Y=async({previousCacheEntry:e})=>{try{if(!S&&D&&E&&!e)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let d=await u.handle(X,U);a.fetchMetrics=U.renderOpts.fetchMetrics;let f=U.renderOpts.pendingWaitUntil;f&&c.waitUntil&&(c.waitUntil(f),f=void 0);let g=U.renderOpts.collectedTags;if(!J)return await (0,o.I)(V,W,d,f),null;{let a=await d.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(d.headers);g&&(b[r.NEXT_CACHE_TAGS_HEADER]=g),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==U.renderOpts.collectedRevalidate&&!(U.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&U.renderOpts.collectedRevalidate,e=void 0===U.renderOpts.collectedExpire||U.renderOpts.collectedExpire>=r.INFINITE_CACHE?!1!==c&&c>0?y.expireTime:void 0:U.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:d.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:e}}}}catch(b){throw(null==e?void 0:e.isStale)&&await u.onRequestError(a,b,{routerKind:"App Router",routePath:d,routeType:"route",revalidateReason:(0,n.getRevalidateReason)({isStaticGeneration:N,isOnDemandRevalidate:D})},!1,C),b}},Z=async(d,f)=>{try{var g,i;let d=await u.handleResponse({req:a,nextConfig:y,cacheKey:L,routeKind:e.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:B,isRoutePPREnabled:!1,isOnDemandRevalidate:D,revalidateOnlyGenerated:E,responseGenerator:Y,waitUntil:c.waitUntil,isMinimalMode:S});if(!J)return;if((null==d||null==(g=d.value)?void 0:g.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(i=d.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});S||b.setHeader("x-nextjs-cache",D?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),A&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let f=(0,p.fromNodeOutgoingHttpHeaders)(d.value.headers);S&&J||f.delete(r.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||b.getHeader("Cache-Control")||f.get("Cache-Control")||f.set("Cache-Control",(0,q.getCacheControlHeader)(d.cacheControl)),await (0,o.I)(V,W,new Response(d.value.body,{headers:f,status:d.value.status||200}));return}catch(b){if(b instanceof s.NoFallbackError||await u.onRequestError(a,b,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,n.getRevalidateReason)({isStaticGeneration:N,isOnDemandRevalidate:D})},!1,C),J)throw b;await (0,o.I)(V,W,new Response(null,{status:500}));return}finally{(()=>{if(!d)return;let a=b.statusCode;d.setAttributes({"http.status_code":a,"next.rsc":!1}),a&&a>=500&&(d.setStatus({code:h.SpanStatusCode.ERROR}),d.setAttribute("error.type",a.toString()));let c=P.getRootSpanAttributes();if(!c)return;if(c.get("next.span_type")!==m.BaseServerSpan.handleRequest)return console.warn(`Unexpected root span type '${c.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=c.get("next.route")||I,g=`${O} ${e}`;d.setAttributes({"next.route":e,"http.route":e,"next.span_name":g}),d.updateName(g),f&&f!==d&&(f.setAttribute("http.route",e),f.updateName(g))})()}};if(R&&Q)await Z(Q,void 0);else{let b=P.getActiveScopeSpan();await P.withPropagatedContext(a.headers,()=>P.trace(m.BaseServerSpan.handleRequest,{spanName:`${O} ${d}`,kind:h.SpanKind.SERVER,attributes:{"http.method":O,"http.target":a.url}},a=>Z(a,b)),void 0,!R)}}},5835:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.d(b,{A:()=>j,K:()=>g});var e=c(4939),f=a([e]);let h=new(e=(f.then?(await f)():f)[0]).Pool({connectionString:process.env.POSTGRES_URL||process.env.DATABASE_URL}),i=!1;async function g(){i||(await h.query(`
    CREATE TABLE IF NOT EXISTS body (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      body_type TEXT NOT NULL,
      member_cap INTEGER,
      dues_amount NUMERIC NOT NULL DEFAULT 0,
      dues_cadence TEXT NOT NULL DEFAULT 'annual'
    );

    CREATE TABLE IF NOT EXISTS person (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      mailing_address TEXT
    );

    CREATE TABLE IF NOT EXISTS membership (
      id SERIAL PRIMARY KEY,
      person_id INTEGER NOT NULL REFERENCES person(id),
      body_id INTEGER NOT NULL REFERENCES body(id),
      status TEXT NOT NULL DEFAULT 'active',
      joined_date TEXT
    );

    CREATE TABLE IF NOT EXISTS dues_cycle (
      id SERIAL PRIMARY KEY,
      body_id INTEGER NOT NULL REFERENCES body(id),
      year INTEGER NOT NULL,
      amount NUMERIC NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment (
      id SERIAL PRIMARY KEY,
      membership_id INTEGER NOT NULL REFERENCES membership(id),
      dues_cycle_id INTEGER NOT NULL REFERENCES dues_cycle(id),
      amount NUMERIC NOT NULL,
      method TEXT NOT NULL DEFAULT 'manual',
      paid_date DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `),i=!0)}let j=h;d()}catch(a){d(a)}})},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},8128:a=>{"use strict";a.exports=require("next/dist/server/runtime-reacts.external.js")},8335:()=>{},8661:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{GET:()=>h});var e=c(3211),f=c(5835),g=a([f]);async function h(a){await (0,f.K)();let b=a.nextUrl.searchParams.get("body_id");if(!b)return e.NextResponse.json({error:"body_id is required"},{status:400});let c=(await f.A.query("SELECT * FROM body WHERE id = $1",[b])).rows[0];if(!c)return e.NextResponse.json({error:"body not found"},{status:404});let d=(await f.A.query("SELECT * FROM dues_cycle WHERE body_id = $1 ORDER BY year DESC LIMIT 1",[b])).rows[0],g=(await f.A.query(`
    SELECT
      m.id as membership_id,
      p.full_name,
      p.email,
      p.phone,
      m.status,
      (
        SELECT COUNT(*) FROM payment
        WHERE payment.membership_id = m.id
        AND payment.dues_cycle_id = $1
      ) as paid_count
    FROM membership m
    JOIN person p ON p.id = m.person_id
    WHERE m.body_id = $2
    ORDER BY p.full_name
    `,[d?.id??-1,b])).rows.map(a=>({...a,paid_count:parseInt(a.paid_count,10),paid:parseInt(a.paid_count,10)>0})),h=g.filter(a=>"active"===a.status),i=h.filter(a=>a.paid).length,j=c.member_cap?c.member_cap-h.length:null;return e.NextResponse.json({body:c,cycle:d,members:g,summary:{total_active:h.length,paid:i,unpaid:h.length-i,open_slots:j}})}f=(g.then?(await g)():g)[0],d()}catch(a){d(a)}})},9121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[445,813],()=>b(b.s=5429));module.exports=c})();