/* Los dos conjuntos de datos se conservan idénticos a V5_modificado.html. */
const VINO=[9.79,8.86,7.58,6.9,7.4,8.09,7.41,7.81,7.62,7.08,8.84,6.29,6.36,5.96,5.14,5.41,5.36,4.43,4.37,3.8,3.52,3.19,3.34,3.38,2.45,2.02,2.78,2.81,2.45,2.38,2.38,2.6,2.54,2.59,2.22,2.83,2.17,2.85,3.1,2.51,2.65,2.37,2.85,2.61,1.8,1.04,1.57,2.33,2.3031,2.2774,1.9344];
const CERV=[1.72,1.43,1.43,0.6,0.75,1.08,1.02,1.09,1.27,1.33,1.21,1.1,1.09,1.17,1.2,1.49,1.57,1.63,1.65,1.6,1.71,1.89,1.8,2.37,2.39,1.96,1.88,2.21,1.8,1.79,1.76,1.81,1.83,2.01,2.26,2.34,2.43,2.32,2.35,2.51,2.55,2.67,2.79,2.85,2.96,3.05,3.08,3.25,3.365,3.789,3.479];
const Y0=1972, FINAL=2022, MAXL=9.79, MAXVIS=10;
const $=id=>document.getElementById(id);
const fmt=(v,n=2)=>Number(v).toLocaleString("es-CL",{minimumFractionDigits:n,maximumFractionDigits:n});
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
let REF=130,CAP=150,nivelMl=0,seleccion=null,revelado=false;
const ML22=()=>REF*VINO[50]/MAXL;
const cant=(arr,y)=>arr[clamp(y-Y0,0,50)];
const svgY=v=>233-(clamp(v,0,MAXVIS)/MAXVIS)*202;
function dibujaVaso(id,valor){
  const v=Math.max(0,valor||0),y=svgY(v);
  $(id).setAttribute("y",y);
  $(id).setAttribute("height",Math.max(0,233-y));
}
function etapa(){
  const marca22=ML22();
  if(nivelMl<marca22-0.25) return {nombre:"antes",año:null,progreso:0};
  const p=clamp((nivelMl-marca22)/Math.max(1,REF-marca22),0,1);
  return {nombre:p>.989?"final":p<.012?"2022":"viaje",año:FINAL-Math.round(p*50),progreso:p};
}
function actualiza(){
  $("mlFisico").textContent=fmt(nivelMl,0)+" ml";
  $("simValor").textContent=fmt(nivelMl,0)+" ml";
  $("ref22").textContent=fmt(ML22(),1).replace(" ml","");
  $("ref72").textContent=fmt(REF,0);
  const añoAnterior=seleccion;
  const e=etapa();seleccion=e.año;
  const p=100*e.progreso;
  $("progreso").style.width=p+"%";
  $("cabeza").style.left=p+"%";
  $("barraProgreso").setAttribute("aria-valuenow",String(Math.round(p)));
  if(e.año===null){
    $("fase").textContent="Comienza la experiencia";
    $("anioActual").textContent="—";
    $("tituloEtapa").textContent="Cada gota activa una historia.";
    $("descEtapa").textContent="Sirve con cuidado hasta la primera marca del vaso físico para descubrir el año 2022.";
    $("vinoValor").textContent="—";
    $("cervezaValor").textContent="—";
    dibujaVaso("liqV",0);dibujaVaso("liqC",0);
  }else{
    const v=cant(VINO,e.año),c=cant(CERV,e.año);
    $("anioActual").textContent=String(e.año);
    $("vinoValor").textContent=fmt(v)+" L";
    $("cervezaValor").textContent=fmt(c)+" L";
    dibujaVaso("liqV",v);dibujaVaso("liqC",c);
    if(e.nombre==="2022"){
      $("fase").textContent="Primer descubrimiento · 2022";
      $("tituloEtapa").textContent="La cerveza supera al vino en este año.";
      $("descEtapa").textContent="Continúa sirviendo para recorrer cincuenta años hacia atrás y descubrir cómo era la relación entre ambas bebidas.";
    }else if(e.nombre==="final"){
      $("fase").textContent="Llegaste a 1972";
      $("tituloEtapa").textContent="En 1972, el vino dominaba esta comparación.";
      $("descEtapa").textContent="Ahora compara ambos extremos: el protagonismo de estas dos bebidas cambió radicalmente.";
    }else{
      $("fase").textContent="Recorriendo la historia · "+e.año;
      $("tituloEtapa").textContent=v>=c?"En este año, el vino aporta más que la cerveza.":"En este año, la cerveza aporta más que el vino.";
      $("descEtapa").textContent="Las dos copas digitales y el gráfico muestran los datos reales de "+e.año+". Sigue sirviendo para retroceder en el tiempo.";
    }
  }
  if(e.nombre==="final") revelado=true;
  if(nivelMl<2) revelado=false;
  $("revelacion").hidden=!revelado;
  actualizaGrafico();
  // Una muestra por año realmente seleccionado. Nunca se inventan valores intermedios.
  if(e.año!==null && e.año!==añoAnterior) reproducirAñoSeleccionado(e.año);
}
function dibujaGrafico(){
  const W=900,H=355,L=59,R=29,T=26,B=48,n=VINO.length;
  const x=i=>L+i*(W-L-R)/(n-1), y=v=>H-B-v/MAXVIS*(H-T-B);
  let parts=[];
  for(let k=0;k<=5;k++){
    const yy=y(k*2);parts.push(`<line x1="${L}" y1="${yy}" x2="${W-R}" y2="${yy}" stroke="#eae6e2"/>`);
    parts.push(`<text x="${L-12}" y="${yy+4}" text-anchor="end">${k*2}</text>`);
  }
  parts.push(`<text transform="translate(17 ${H/2}) rotate(-90)" text-anchor="middle">L de alcohol puro / persona</text>`);
  for(let i=0;i<n;i+=10)parts.push(`<text x="${x(i)}" y="${H-17}" text-anchor="middle">${Y0+i}</text>`);
  const path=a=>a.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+","+y(v).toFixed(1)).join(" ");
  parts.push(`<path d="${path(CERV)}" fill="none" stroke="#b47b0c" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`);
  parts.push(`<path d="${path(VINO)}" fill="none" stroke="#8d2247" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`);
  for(let i of [0,50])for(const [a,color] of [[VINO,"#8d2247"],[CERV,"#b47b0c"]])parts.push(`<circle cx="${x(i)}" cy="${y(a[i])}" r="4.5" fill="${color}" stroke="#fff" stroke-width="2"/>`);
  parts.push(`<g id="focus" hidden style="pointer-events:none"><line x1="0" y1="${T}" x2="0" y2="${H-B}" stroke="#65727a" stroke-width="2" stroke-dasharray="5 5"/><circle id="focusV" cx="0" cy="0" r="7" fill="#8d2247" stroke="#fff" stroke-width="3"/><circle id="focusC" cx="0" cy="0" r="7" fill="#b47b0c" stroke="#fff" stroke-width="3"/><g id="focusTag"><rect id="focusTagRect" x="-29" y="0" width="58" height="25" rx="7" fill="#283941"/><text id="focusTagText" x="0" y="17" text-anchor="middle" style="fill:white;font-weight:800;font-size:15px"></text></g></g>`);
  $("chart").innerHTML=parts.join("");
}
function actualizaGrafico(){
  const g=$("focus");if(!g)return;
  if(seleccion===null){g.setAttribute("hidden","");return;}
  g.removeAttribute("hidden");
  const L=59,R=29,W=900,H=355,T=26,B=48;
  const x=L+(seleccion-Y0)*(W-L-R)/50, y=v=>H-B-clamp(v,0,10)/10*(H-T-B);
  g.style.transform=`translate(${x}px,0)`;
  $("focusV").setAttribute("cy",y(cant(VINO,seleccion)));
  $("focusC").setAttribute("cy",y(cant(CERV,seleccion)));
  $("focusTagText").textContent=seleccion;
  $("focusTag").setAttribute("transform",x>W/2?"translate(-39,0)":"translate(39,0)");
}
// Sonificación a partir del brindis real adjunto (brindis.mp3).
// Compresión sqrt y dominio global 0–21 L, idénticos para las dos bebidas.
// octavas(L) = 1.5 - 3*sqrt(L/21)
// El tono original corresponde a L=5.25; 21 L está 1.5 octavas por debajo.
const L_AUDIO_MAX=21;
const sonidoBase=new Audio("brindis.mp3");
sonidoBase.preload="auto";
// De lo contrario HTMLAudioElement suele conservar el tono al variar la velocidad.
sonidoBase.preservesPitch=false;
if("webkitPreservesPitch" in sonidoBase) sonidoBase.webkitPreservesPitch=false;
if("mozPreservesPitch" in sonidoBase) sonidoBase.mozPreservesPitch=false;
let sonidoOn=false,colaSonido=[],reproduciendo=false,modoSerie=null,pausaSonido=null;
const PAUSA_ENTRE_MUESTRAS_MS=85;
const tasaPorLitros=litros=>litros>0 ? Math.pow(2,1.5-3*Math.sqrt(clamp(litros,0,L_AUDIO_MAX)/L_AUDIO_MAX)) : null;
const botonSerie=id=>$(id);
function pintarBotonesSerie(){
  botonSerie("probar").textContent=modoSerie==="vino"?"Detener recorrido del vino":"Escuchar recorrido del vino";
  botonSerie("escucharCerveza").textContent=modoSerie==="cerveza"?"Detener recorrido de la cerveza":"Escuchar recorrido de la cerveza";
}
function detenerAudio(){
  colaSonido=[];
  clearTimeout(pausaSonido);
  pausaSonido=null;
  sonidoBase.pause();
  try{sonidoBase.currentTime=0;}catch(e){}
  reproduciendo=false;
  modoSerie=null;
  pintarBotonesSerie();
}
function tocarSiguiente(){
  if(!sonidoOn || reproduciendo) return;
  const muestra=colaSonido.shift();
  if(!muestra){
    if(modoSerie){
      const bebida=modoSerie;
      modoSerie=null;
      pintarBotonesSerie();
      $("estado").textContent="Recorrido sonoro de "+bebida+" completado (1972–2022).";
    }
    return;
  }
  const tasa=tasaPorLitros(muestra.litros);
  // Cero o ausencia: silencio, conservando el orden temporal del recorrido.
  if(tasa===null){
    pausaSonido=setTimeout(tocarSiguiente,PAUSA_ENTRE_MUESTRAS_MS);
    return;
  }
  reproduciendo=true;
  sonidoBase.playbackRate=tasa;
  sonidoBase.currentTime=0;
  const p=sonidoBase.play();
  if(p && typeof p.catch==="function")p.catch(err=>{
    reproduciendo=false;
    detenerAudio();
    $("estado").textContent="Audio no disponible: "+err.message+". Comprueba que brindis.mp3 esté en esta carpeta.";
  });
}
sonidoBase.addEventListener("ended",()=>{
  reproduciendo=false;
  pausaSonido=setTimeout(tocarSiguiente,PAUSA_ENTRE_MUESTRAS_MS);
});
function reproducirAñoSeleccionado(año){
  if(!sonidoOn || modoSerie || año===null) return;
  // La interacción física sonifica el dato del vino para el año visible.
  // Los controles técnicos permiten escuchar también la cerveza con la misma escala.
  const litros=cant(VINO,año);
  // Si el usuario mueve rápidamente el control, priorizamos el dato reciente;
  // el recorrido completo por años puede escucharse con su botón dedicado.
  colaSonido=[{litros}];
  tocarSiguiente();
}
function escucharSerie(tipo,arr){
  if(!sonidoOn){$("estado").textContent="Pulsa primero «Activar sonido» sobre el gráfico.";return;}
  if(modoSerie===tipo){detenerAudio();$("estado").textContent="Recorrido sonoro detenido.";return;}
  detenerAudio();
  modoSerie=tipo;
  // Cada año del fichero se reproduce una sola vez en orden 1972–2022.
  // No se interpola ningún dato. El último año (2022) se incluye.
  colaSonido=arr.map(litros=>({litros}));
  pintarBotonesSerie();
  $("estado").textContent="Reproduciendo los 51 años de "+tipo+" (1972–2022).";
  tocarSiguiente();
}
$("sonido").onclick=()=>{
  if(sonidoOn){
    detenerAudio();sonidoOn=false;
    $("sonido").textContent="Activar sonido";
    $("sonido").setAttribute("aria-pressed","false");
    return;
  }
  sonidoOn=true;
  sonidoBase.load();
  $("sonido").textContent="Sonido activado";
  $("sonido").setAttribute("aria-pressed","true");
  // El audio se reproduce cuando cambia el año, o desde el panel técnico.
};
$("probar").onclick=()=>escucharSerie("vino",VINO);
$("escucharCerveza").onclick=()=>escucharSerie("cerveza",CERV);
$("sim").addEventListener("input",e=>{nivelSensor=Number(e.target.value);ajusteMl=0;componer();});
// El nivel solo avanza: el sensor deriva hacia abajo entre vertidos y el
// relato no debe retroceder. Se vuelve a cero solo con el boton Reiniciar.
// El nivel mostrado es el del sensor mas una correccion manual opcional.
// El sensor nunca deja de mandar: la correccion solo lo desplaza.
let nivelSensor=0,ajusteMl=0;
function componer(){nivelMl=clamp(nivelSensor+ajusteMl,0,CAP);actualiza();}
function aplicarNivel(m){if(m>nivelSensor)nivelSensor=m;componer();}

$("reiniciar").onclick=()=>{nivelMl=0;nivelSensor=0;ajusteMl=0;historia=[];crudoPico=null;$("sim").value=0;actualiza();$("estado").textContent="Recorrido reiniciado en 0 ml.";};
function crudoAMl(v){
  const c0=+$('c0').value,a=+$('c22').value,b=+$('c72').value;
  const m22=ML22();
  if(!Number.isFinite(c0)||!Number.isFinite(a)||!Number.isFinite(b)||a<=c0||b<=a)return 0;
  let ml;
  if(v<=c0)ml=0;
  else if(v<=a)ml=(v-c0)*m22/(a-c0);
  else ml=m22+(v-a)*(REF-m22)/(b-a);
  return clamp(ml,0,CAP);
}
let puerto=null,crudoActual=null,crudoPico=null,historia=[],leyendo=false;
function registra(n){const t=Date.now();historia.push({t,n});while(historia.length&&t-historia[0].t>250)historia.shift();}
function valorEstable(){if(!historia.length)return crudoActual;const a=historia.map(x=>x.n).sort((p,q)=>p-q);return a[Math.floor(a.length/2)];}
// Este sensor solo discrimina el nivel en el instante en que el liquido llega:
// despues deriva hacia abajo hasta valores que son iguales para niveles distintos.
// Por eso la referencia es el maximo, filtrando solo el ruido de una o dos
// muestras sueltas con el minimo de una ventana corta (250 ms).
function valorSostenido(){
  if(historia.length<3)return null;
  let m=historia[0].n;
  for(const x of historia) if(x.n<m) m=x.n;
  return m;
}
function setConexion(txt,activa=false){$("estado").textContent=txt;$("controlManual").hidden=activa;}
async function leerArduino(p){
  if(leyendo)return;
  leyendo=true;puerto=p;
  try{
    await p.open({baudRate:9600});
    setConexion("Arduino conectado · 9600 baudios",true);
    $("sim").disabled=true;
    const dec=new TextDecoderStream();p.readable.pipeTo(dec.writable).catch(()=>{});
    const lector=dec.readable.getReader();let acum="";
    while(true){
      const {value,done}=await lector.read();if(done)break;
      acum+=value;let i;
      while((i=acum.indexOf("\n"))>=0){
        const linea=acum.slice(0,i).trim();acum=acum.slice(i+1);
        const n=parseInt(linea,10);
        if(Number.isFinite(n)){
          registra(n);crudoActual=valorEstable();
          // Sube solo con valores sostenidos; despues el sensor puede derivar
          // hacia abajo sin que el relato retroceda.
          const sost=valorSostenido();
          if(sost!=null&&(crudoPico==null||sost>crudoPico))crudoPico=sost;
          $("crudo").textContent=crudoActual+"  ·  nivel "+(crudoPico==null?"—":crudoPico);
          if(crudoPico!=null)aplicarNivel(crudoAMl(crudoPico));
        }
      }
      if(acum.length>250)acum="";
    }
    lector.releaseLock();
  }catch(e){setConexion("Arduino: "+e.message);console.warn("Arduino:",e);}
  finally{leyendo=false;puerto=null;$("sim").disabled=false;setConexion("Sin lectura activa. Puedes usar el simulador.");}
}
async function conectarArduinoAutomaticamente(){
  if(!("serial" in navigator)){setConexion("Web Serial requiere Chrome o Edge en un contexto seguro.");return;}
  try{const ps=await navigator.serial.getPorts();if(ps.length){setConexion("Puerto previamente autorizado detectado…");leerArduino(ps[0]);}else setConexion("Primer uso: pulsa 'Autorizar Arduino'.");}
  catch(e){setConexion("No se detectaron permisos: "+e.message);}
}
$("autorizar").onclick=async()=>{
  if(!("serial" in navigator)){setConexion("Chrome o Edge con Web Serial son necesarios.");return;}
  if(leyendo){setConexion("El sensor ya se está leyendo.",true);return;}
  try{const p=await navigator.serial.requestPort();leerArduino(p);}catch(e){if(e.name!=="NotFoundError")setConexion("Permiso: "+e.message);}
};
if("serial" in navigator)navigator.serial.addEventListener("connect",()=>{if(!leyendo)conectarArduinoAutomaticamente();});
// Se fija el maximo alcanzado desde el ultimo Reiniciar, no el valor instantaneo:
// asi la calibracion usa el mismo criterio que la lectura en vivo.
function fijar(id){const val=crudoPico!=null?crudoPico:crudoActual;if(val==null){setConexion("Primero espera una lectura del sensor.",!!puerto);return;}$(id).value=val;recalcularDesdeSensor();const b=$('fijar'+(id==='c0'?'0':id==='c22'?'22':'72'));const a=b.textContent;b.textContent="✓ "+val;setTimeout(()=>b.textContent=a,1200);}
for(const [bot,id] of [["fijar0","c0"],["fijar22","c22"],["fijar72","c72"]])$(bot).onclick=()=>fijar(id);
function recalcularDesdeSensor(){if(crudoActual!=null&&leyendo)aplicarNivel(crudoAMl(crudoActual));else actualiza();}
for(const id of ["c0","c22","c72"])$(id).addEventListener("input",recalcularDesdeSensor);
$("mlRef").addEventListener("input",()=>{const n=+$("mlRef").value;if(Number.isFinite(n)&&n>10){REF=n;CAP=Math.max(REF*1.15,REF+10);$("sim").max=CAP;recalcularDesdeSensor();}});
// Composición y cambios calculados con los datos exactos, no a partir del texto redondeado.
const vi0=VINO[0],vi50=VINO[50],ce0=CERV[0],ce50=CERV[50];
$("deltaV").textContent="−"+Math.round((1-vi50/vi0)*100)+"%";
$("deltaC").textContent="+"+Math.round((ce50/ce0-1)*100)+"%";
$("compV72").style.width=(100*vi0/(vi0+ce0))+"%";
$("compV22").style.width=(100*vi50/(vi50+ce50))+"%";
$("sim").max=CAP;
dibujaGrafico();actualiza();conectarArduinoAutomaticamente();
