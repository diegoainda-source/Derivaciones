(function(){

  function scrollToTop() {
    try {
      const card = document.querySelector('.card');
      if (card) card.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    } catch(e){}
  }

  const DEFAULT_TREE = {
    meta:{name:'Derivación a Especialidad TTM — HTML',version:'1.0.0',updated:new Date().toISOString().slice(0,10)},
    start:'q_inicio',
    nodes:{
      q_inicio:{id:'q_inicio',type:'question',
        title:'GUÍA INTERACTIVA DE DERIVACIÓN',
        description:'Seleccione la especialidad a la que desea derivar:',
        options:[
          {label:'CIRUGÍA MAXILOFACIAL',next:'r_proximamente'},
          {label:'ENDODONCIA',next:'r_proximamente'},
          {label:'ODONTOPEDIATRÍA',next:'r_proximamente'},
          {label:'ORTODONCIA',next:'r_proximamente'},
          {label:'PERIODONCIA',next:'r_proximamente'},
          {label:'RADIOLOGÍA DENTOMAXILAR',next:'r_proximamente'},
          {label:'REHABILITACIÓN ORAL',next:'r_proximamente'},
          {label:'TTM Y DOF',next:'q_motivo'}
        ]},
      r_proximamente:{id:'r_proximamente',type:'result',
        referral:'Próximamente disponible',
        rationale:[],notes:'Esta especialidad aún no cuenta con un flujo interactivo en esta guía.'},

      q_motivo:{id:'q_motivo',type:'question',title:'¿El motivo principal del paciente es?',description:'Selecciona la categoría que más se ajuste al motivo de consulta:',options:[
        {label:'Dolor ATM y/o en músculos masticatorios',next:'q_descarto_origen_dentario', icon:'🤕'},
        {label:'Dolor neuropático orofacial (dolor severo, quemante/eléctrico, de aparición repentina)',next:'q_descarto_origen_dentario',contributes:'Dolor neuropático orofacial (derivación con prioridad alta)', icon:'⚡'},
        {label:'Apretamiento/rechinamiento dentario',next:'q_brux_actual', icon:'😬'},
        {label:'Sonido articular',next:'q_sonido_tipo', icon:'🔊'},
        {label:'Limitación de la apertura (<30 mm/paciente no puede colocar 3 dedos en apertura sin dolor)',next:'q_apertura_dolor', icon:'📏'},
        {label:'Bloqueo mandibular',next:'q_bloqueo_tipo', icon:'🔒'}
      ]},
      q_descarto_origen_dentario:{
        id:'q_descarto_origen_dentario',
        type:'question',
        title:'¿Se descartó dolor de origen dentario?',
        options:[
          {label:'Sí',next:null},
          {label:'No',next:'r_continuar_APS'}
        ]
      },
      q_APS_manejo:{id:'q_APS_manejo',type:'question',title:'¿Se realizó manejo inicial en APS?',options:[
        {label:'Sí',next:'q_APS_resuelto'},
        {label:'No',next:'r_continuar_APS'}
      ]},
      q_APS_resuelto:{id:'q_APS_resuelto',type:'question',title:'¿El cuadro se resolvió?',options:[
        {label:'Sí',next:'r_continuar_APS'},
        {label:'No',next:'r_derivar',contributes:'Dolor ATM/muscular persistente que no se resuelve con manejo inicial en APS.'}
      ]},
      q_brux_actual:{id:'q_brux_actual',type:'question',title:'¿Ha tenido 3 o más episodios de apretamiento/rechinamiento este último mes?',options:[
        {label:'Sí',next:'q_brux_asociado'},
        {label:'No',next:'r_continuar_APS'}
      ]},
      q_brux_asociado:{id:'q_brux_asociado',type:'question',title:'¿Se asocia a al menos uno de los siguientes: fatiga mandibular, cefaleas matutinas,desgastes dentarios de más de un tercio del diente, presencia de ronquidos y/o reflujo gastroesofágico?',options:[
        {label:'Sí',next:'r_derivar',contributes:'Bruxismo actual con sintomatología asociada.'},
        {label:'No',next:'r_continuar_APS'}
      ]},
      q_sonido_tipo:{id:'q_sonido_tipo',type:'question',title:'¿El sonido articular es tipo click o crépito?',options:[
        {label:'Click',next:'q_click_dolor'},
        {label:'Crépito (ruido tipo arenilla/gravilla)',next:'r_derivar',contributes:'Crépito articular.'}
      ]},
      q_click_dolor:{id:'q_click_dolor',type:'question',title:'¿El click es doloroso o asociado a bloqueo mandibular intermitente?',options:[
        {label:'Sí',next:'r_derivar',contributes:'Click doloroso o con bloqueo mandibular.'},
        {label:'No',next:'r_continuar_APS'}
      ]},
      q_apertura_dolor:{id:'q_apertura_dolor',type:'question',title:'¿La apertura limitada es dolorosa?',options:[
        {label:'Sí',next:'q_apertura_tiempo'},
        {label:'No',next:'r_derivar',contributes:'Apertura limitada no dolorosa.'}
      ]},
      q_apertura_tiempo:{id:'q_apertura_tiempo',type:'question',title:'Tiempo de evolución del cuadro:',options:[
        {label:'2 meses o menos',next:'r_derivar',contributes:'Apertura limitada dolorosa <2 meses.'},
        {label:'Mayor a 2 meses',next:'q_apertura_APS_manejo'}
      ]},
      q_apertura_APS_manejo:{id:'q_apertura_APS_manejo',type:'question',title:'¿Se realizó manejo inicial en APS?',options:[
        {label:'Sí',next:'q_apertura_resuelto'},
        {label:'No',next:'r_continuar_APS'}
      ]},
      q_apertura_resuelto:{id:'q_apertura_resuelto',type:'question',title:'¿El cuadro se resolvió?',options:[
        {label:'Sí',next:'r_continuar_APS'},
        {label:'No',next:'r_derivar',contributes:'Apertura limitada crónica que no se resuelve con manejo inicial en APS.'}
      ]},
      q_bloqueo_tipo:{id:'q_bloqueo_tipo',type:'question',title:'¿El bloqueo mandibular es cerrado o abierto?',options:[
        {label:'Cerrado (Imposibilidad de apertura mandibular)',next:'q_bloqueo_cerrado_tiempo'},
        {label:'Abierto (Imposibilidad de cerrar la boca luego de una apertura bucal amplia y/o prolongada)',next:'q_maniobra_realizada'}
      ]},
      q_bloqueo_cerrado_tiempo:{id:'q_bloqueo_cerrado_tiempo',type:'question',title:'Tiempo de evolución del cuadro:',options:[
        {label:'2 meses o menos',next:'r_derivar',contributes:'Bloqueo cerrado agudo (derivación con prioridad alta).'},
        {label:'Mayor a 2 meses',next:'r_derivar',contributes:'Bloqueo cerrado crónico.'}
      ]},
      q_maniobra_realizada:{id:'q_maniobra_realizada',type:'question',title:'¿Realizó maniobra de reducción mandibular?',options:[
        {label:'Sí',next:'q_bloqueo_abierto_reduccion'},
        {label:'No',next:'r_continuar_APS'}
      ]},
      q_bloqueo_abierto_reduccion:{id:'q_bloqueo_abierto_reduccion',type:'question',title:'¿La maniobra de reducción mandibular fue exitosa?',options:[
        {label:'Sí',next:'r_continuar_APS'},
        {label:'No',next:'r_derivar',contributes:'Bloqueo abierto sin reducción (⚠️ contactar a especialista para atención de URGENCIA ⚠️).'}
      ]},
      r_derivar:{id:'r_derivar',type:'result',referral:'Derivación a especialidad de TTM y DOF',rationale:[],notes:'Derivar a especialista en TTM para confirmación diagnóstica y manejo adecuado.'},
      r_continuar_APS:{id:'r_continuar_APS',type:'result',referral:'Continuar controles en APS',rationale:['Realizar manejo y controles en APS'],notes:'Próximamente: adjuntar archivo con protocolo de manejo inicial en APS.'}
    }
  };

  let state = {current: DEFAULT_TREE.start, answers:{}};
  const main = document.querySelector('#main');

function setBackgroundForNode(node) {
  document.body.classList.remove('derivar', 'continuarAPS');

  if (node && node.type === 'result') {
    if (node.id === 'r_derivar') {
      document.body.classList.add('derivar');
    } else if (node.id === 'r_continuar_APS') {
      document.body.classList.add('continuarAPS');
    }
  }
}

  function render() {
    const node = DEFAULT_TREE.nodes[state.current];
    if(!node) { main.innerHTML = '<p>No se encontró el nodo actual.</p>'; return; }

    if(node.id === 'q_descarto_origen_dentario'){
      const prevAnswer = state.answers['q_motivo'] || '';
      if(prevAnswer.includes('Dolor ATM')){
        node.options[0].next = 'q_APS_manejo';
      } else if(prevAnswer.includes('Dolor neuropático')){
        node.options[0].next = 'r_derivar';
      }
    }

    main.classList.add('fade-out');
    setTimeout(() => {
      setBackgroundForNode(node);

      if(node.type==='question'){
        if(node.id==='q_inicio'){ document.querySelector('h1').style.display='none'; } else { document.querySelector('h1').style.display='block'; }
        if(node.id==='q_inicio'){ document.body.classList.add('intro-bg'); } else { document.body.classList.remove('intro-bg'); }
        if(node.id==='q_inicio'){ main.classList.add('intro-page'); } else { main.classList.remove('intro-page'); }
        const isIntro = (node.id==='q_inicio');
        let html = (node.id==='q_inicio') ? `<div class='intro-page'><div class='intro-title'>${node.title}</div>` : `<h2>${node.title}</h2>`;
        if(node.description) html += node.description;
        if(isIntro) html += '<div class="intro-options">';
        node.options.forEach(o=>{
          const icon = o.icon ? `<span class="icon">${o.icon}</span>` : '';
          let buttonClass = '';
          if (node.id === 'q_motivo' && o.label.includes('Limitación de la apertura')) {
            buttonClass = 'left-align';
          }
          html += `<div class="choice"><button class="${buttonClass}" onclick="choose('${node.id}','${o.label}','${o.next}')">${icon}${o.label}</button></div>`;
        });
        if(isIntro) html += '</div></div>'; 
        if(node.id !== DEFAULT_TREE.start){ html += controlsHTML(); }
        if(node.id === 'q_APS_manejo' || node.id === 'q_apertura_APS_manejo'){
          html += `<div class="note">
            <p><strong>Manejo Inicial Para TTM Doloroso En APS (*)</strong> El manejo inicial en APS para condiciones clínicas dolorosas considera las siguientes acciones:</p>
            <ol>
              <li>Control de Parafunciones (onicofagia, morder lápiz, apoyo mentoniano, etc).</li>
              <li>Medidas Conductuales (realizar durante 2 semanas).
                <ol type="1">
                  <li>Limitación de Apertura Bucal (apertura máxima de 2 dedos, control del bostezo).</li>
                  <li>Reposo Mandibular (indicar que se debe hablar poco; no cantar, no gritar).</li>
                  <li>Dieta Blanda / Líquida (Indolora).</li>
                </ol>
              </li>
              <li>Manejo inicial Terapia Antiinflamatoria/Analgésica</li>
              <li>Control a las 3 semanas; realizar palpación muscular y articular. Medir apertura bucal.</li>
            </ol>
            <p><em>(*): Todo esto es referencial y no constituye una guía de procedimiento absoluto, ya que no tiene en cuenta la variabilidad clínica específica de cada usuario, ni reemplaza el criterio profesional.</em></p>
          </div>`;
        }
        if(node.id === 'q_maniobra_realizada'){
          html += `<div class="note">
            <p><strong>Técnica de posición supina:</strong> el operador se posiciona detrás del paciente, 
            apoya ambos pulgares en el borde anterior de la rama, distal a los últimos molares mandibulares, 
            y realiza un movimiento de rotación empujando el ángulo mandibular hacia caudal y el mentón hacia cefálico.</p>
            <p style="font-style: italic;">
            Astorga Jélvez, Paula, Garrido, Marcela, & Moreno Apablaza, Emilio. (2021). Luxación mandibular aguda: técnicas de reducción manual y secuencia de manejo en el servicio de urgencias. Revista Española de Cirugía Oral y Maxilofacial, 43(1), 28-36. Epub 19 de abril de 2021. https://dx.doi.org/10.20986/recom.2021.1181/2020
            </p>
          </div>`;
        }
        main.innerHTML = html;
      scrollToTop();
      } else {
        let html = '';
        let conclusionText = '';
        const reasons = [];
        for (const key of Object.entries(state.answers)){
          const q = DEFAULT_TREE.nodes[key[0]];
          if(q && q.type==='question'){
            const label = key[1];
            const opt = q.options.find(o=>o.label===label);
            if(opt && opt.contributes) reasons.push(opt.contributes);
          }
        }
        const uniq = [...new Set(reasons)];
        if(node.id === 'r_continuar_APS'){
          html += `<h2 class="conclusion-aps">${node.referral}</h2>`;
          html += '<div class="justificacion-box danger"><strong>No tiene indicación de derivación a especialidad de TTM y DOF.</strong></div>';
          conclusionText = `${node.referral}. No tiene indicación de derivación especialidad de TTM y DOF.`;
        }
        if(node.id === 'r_derivar'){
          let hasHighPriority = uniq.some(r => r.toLowerCase().includes('prioridad alta'));
          let symbol = hasHighPriority ? ' ⚠️' : '';
          html += `<h2 class="conclusion-derivar">${node.referral}${symbol}</h2>`;
          html += `<div class="justificacion-box blue"><strong>Justificación:</strong> ` + (uniq.length ? uniq.join(', ') : '') + '</div>';
          html += '<p><em>Copie y pegue este texto en observaciones de derivación. En caso de estimarlo pertinente, puede agregar información clínica adicional relevante.</em></p>';
          conclusionText = `${node.referral}. Justificación: ${uniq.join(', ')}`;
        }
        if(node.id !== 'r_continuar_APS'){
          html += `<textarea id="copy-payload" style="position:absolute;left:-9999px;top:-9999px">${conclusionText}</textarea>`;
          html += `<div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn btn-copy" onclick="copyConclusion()">📋 Copiar conclusión</button></div>`;
        }
        html += controlsHTML();
        main.innerHTML = html;
      scrollToTop();
      }
      main.classList.remove('fade-out');
    }, 400);
  }

  window.choose = function(qId,label,next){
    state.answers[qId] = label;
    state.current = next;
    render();
    scrollToTop();
  }

  function back(){
    const keys = Object.keys(state.answers);
    if(keys.length === 0){ state.current = DEFAULT_TREE.start; render();
    scrollToTop(); return; }
    const last = keys[keys.length - 1];
    delete state.answers[last];
    let id = DEFAULT_TREE.start;
    for(const k of Object.keys(state.answers)){
      const n = DEFAULT_TREE.nodes[id];
      if(!n || n.type !== 'question') break;
      const chosenLabel = state.answers[n.id];
      const chosen = n.options.find(o => o.label === chosenLabel);
      if(!chosen) break;
      id = chosen.next;
    }
    state.current = id;
    render();
    scrollToTop();
  }

  function reset(){
    state = {current: DEFAULT_TREE.start, answers: {}};
    render();
    scrollToTop();
  }

  function controlsHTML(){
    return `<div style="display:flex;gap:8px;margin:16px 0 0 0;justify-content:flex-end">
      <button class="btn btn-back" onclick="back()">← Atrás</button>
      <button class="btn btn-reset" onclick="reset()">⟲ Reiniciar</button>
    </div>`;
  }

  window.back = back;
  window.reset = reset;

  window.copyConclusion = function(){
    const ta = document.getElementById('copy-payload');
    if(!ta) return;
    ta.select();
    ta.setSelectionRange(0, 99999);
    try {
      const ok = document.execCommand('copy');
      if(!ok && navigator.clipboard){
        navigator.clipboard.writeText(ta.value);
      }
      alert('Conclusión copiada');
    } catch(e) {
      if(navigator.clipboard){
        navigator.clipboard.writeText(ta.value).then(() => alert('Conclusión copiada'));
      }
    }
  };

  render();
    scrollToTop();
})();

// ===== PWA: Service Worker registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
