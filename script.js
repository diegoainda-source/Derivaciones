(function(){

  // Diccionario de términos técnicos con explicaciones
  const TOOLTIPS = {
    'ATM': 'Articulación Temporomandibular: articulación que conecta la mandíbula con el cráneo',
    'crépito': 'Ruido articular tipo arenilla o gravilla al abrir/cerrar la boca',
    'click': 'Sonido tipo chasquido o "clic" en la articulación al mover la mandíbula',
    'overjet': 'Resalte horizontal: distancia entre los incisivos superiores e inferiores en sentido horizontal',
    'overbite': 'Escalón vertical: cuánto cubren los dientes superiores a los inferiores',
    'biprotrusión': 'Inclinación hacia adelante de los dientes superiores e inferiores',
    'agenesia': 'Ausencia congénita de uno o más dientes',
    'ectópico': 'Diente que erupciona fuera de su posición normal',
    'impactado': 'Diente que no puede erupcionar por estar bloqueado',
    'vestíbulo-oclusión': 'Relación anormal donde los dientes superiores muerden por fuera de los inferiores',
    'diastema': 'Espacio o separación entre dos dientes',
    'cerrado': 'Bloqueo cerrado: imposibilidad de abrir la boca normalmente',
    'abierto': 'Bloqueo abierto: imposibilidad de cerrar la boca después de una apertura amplia'
  };

  // Función para agregar tooltips a un texto
  function addTooltips(text) {
    let result = text;
    for (const [term, explanation] of Object.entries(TOOLTIPS)) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        return `${match}<span class="tooltip"><span class="help-icon">?</span><span class="tooltiptext">${explanation}</span></span>`;
      });
    }
    return result;
  }

  function scrollToTop() {
    try {
      // Solo hacer scroll si estamos en la página inicial o en un resultado
      const node = DEFAULT_TREE.nodes[state.current];
      if (node && (node.id === 'q_inicio' || node.type === 'result')) {
        const card = document.querySelector('.card');
        if (card) card.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch(e){}
  }

  const DEFAULT_TREE = {
    meta:{name:'Derivación a Especialidades Odontológicas',version:'1.0.0',updated:new Date().toISOString().slice(0,10)},
    start:'q_inicio',
    nodes:{
      q_inicio:{id:'q_inicio',type:'question',
        title:'GUÍA INTERACTIVA DE DERIVACIÓN',
        description:'Seleccione la especialidad a la que desea derivar:',
        options:[
          {label:'CIRUGÍA MAXILOFACIAL',next:'r_proximamente'},
          {label:'ENDODONCIA',next:'r_proximamente'},
          {label:'ODONTOPEDIATRÍA',next:'r_proximamente'},
          {label:'ORTODONCIA',next:'q_orto_edad13'},
          {label:'PERIODONCIA',next:'r_proximamente'},
          {label:'RADIOLOGÍA DENTOMAXILAR',next:'r_proximamente'},
          {label:'REHABILITACIÓN ORAL',next:'r_proximamente'},
          {label:'TTM Y DOF',next:'q_motivo'}
        ]},
      r_proximamente:{id:'r_proximamente',type:'result',
        referral:'Próximamente disponible',
        rationale:[],notes:'Esta especialidad aún no cuenta con un flujo interactivo en esta guía.'},

      q_motivo:{id:'q_motivo',type:'question',title:'¿El motivo de consulta principal del paciente es?',options:[
        {label:'Dolor ATM y/o en músculos masticatorios',next:'q_descarto_origen_dentario', icon:'🤕'},
        {label:'Dolor neuropático orofacial',next:'q_caracteristicas_dolor',contributes:'Dolor neuropático orofacial (derivación con prioridad alta)', icon:'⚡'},
        {label:'Apretamiento/rechinamiento dentario',next:'q_brux_actual', icon:'😬'},
        {label:'Sonido articular',next:'q_sonido_tipo', icon:'🔊'},
        {label:'Limitación de la apertura',next:'q_caracteristicas_apertura', icon:'📏'},
        {label:'Bloqueo mandibular',next:'q_bloqueo_tipo', icon:'🔒'}
      ]},
      q_caracteristicas_dolor:{id:'q_caracteristicas_dolor',type:'question',title:'¿El dolor presenta alguna de las siguientes características?',options:[
        {label:'Dolor severo (escala EVA >7)',next:'q_descarto_origen_dentario'},
        {label:'Dolor quemante o eléctrico',next:'q_descarto_origen_dentario'},
        {label:'Dolor de aparición repentina',next:'q_descarto_origen_dentario'},
        {label:'Ninguna de las anteriores',next:'r_continuar_APS'}
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
      q_brux_asociado:{id:'q_brux_asociado',type:'question',title:'¿Se asocia a al menos uno de los siguientes: - Fatiga mandibular - Cefaleas matutinas - Desgastes dentarios de más de un tercio del diente - Presencia de ronquidos y/o reflujo gastroesofágico?',options:[
        {label:'Sí',next:'r_derivar',contributes:'Bruxismo actual con sintomatología asociada.'},
        {label:'No',next:'r_continuar_APS'}
      ]},
      q_sonido_tipo:{id:'q_sonido_tipo',type:'question',title:'¿El sonido articular es tipo click o crépito?',options:[
        {label:'Click',next:'q_click_dolor'},
        {label:'Crépito',next:'r_derivar',contributes:'Crépito articular.'}
      ]},
      q_click_dolor:{id:'q_click_dolor',type:'question',title:'¿El sonido es doloroso o asociado a bloqueo mandibular intermitente?',options:[
        {label:'Sí',next:'r_derivar',contributes:'Click doloroso o con bloqueo mandibular.'},
        {label:'No',next:'r_continuar_APS'}
      ]},
      q_caracteristicas_apertura:{id:'q_caracteristicas_apertura',type:'question',title:'¿La limitación de apertura presenta alguna de las siguientes características?',options:[
        {label:'Apertura menor a 20 mm',next:'r_derivar',contributes:'Apertura limitada <20 mm (derivación con prioridad alta).'},
        {label:'Apertura entre 20 a 30 mm',next:'q_apertura_dolor'},
        {label:'Ninguna de las anteriores',next:'r_continuar_APS'}
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
        {label:'Cerrado',next:'q_bloqueo_cerrado_tiempo'},
        {label:'Abierto',next:'q_maniobra_realizada'}
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
        {label:'No',next:'r_derivar',contributes:'Bloqueo abierto sin reducción (⚠️ Contactar a especialista para atención de URGENCIA ⚠️).'}
      ]},
      r_derivar:{id:'r_derivar',type:'result',referral:'Derivación a especialidad de TTM y DOF',rationale:[],notes:'Derivar a especialista en TTM para confirmación diagnóstica y manejo adecuado.'},
      r_continuar_APS:{id:'r_continuar_APS',type:'result',referral:'Continuar controles en APS',rationale:['Realizar manejo y controles en APS'],notes:'Próximamente: adjuntar archivo con protocolo de manejo inicial en APS.'},

      /* === Nodo de Ortodoncia === */
 q_orto_edad13:{id:'q_orto_edad13',type:'question',title:'¿El paciente es menor de 13 años?',options:[
        {label:'Sí',next:'q_orto_saneamiento_gate'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_saneamiento_gate:{id:'q_orto_saneamiento_gate',type:'question',title:'¿Presenta caries, enfermedad periodontal, dolor orofacial o TTM?',options:[
        {label:'Sí',next:'r_orto_continuar_APS'},
        {label:'No',next:'q_orto_motivo'}
      ]},
      q_orto_motivo:{id:'q_orto_motivo',type:'question',title:'¿El paciente presenta alguna de las siguientes condiciones?',options:[
        {label:'Anomalías craneofaciales congénitas',next:'q_orto_congenitas', icon:'🧬'},
        {label:'Maloclusiones esqueletales',next:'q_orto_esqueletales', icon:'💀'},
        {label:'Resalte (overjet) aumentado',next:'q_orto_resalte_5mm', icon:'➡️'},
        {label:'Mordida cruzada',next:'q_orto_mordida_cruzada_ubic', icon:'⚔️'},
        {label:'Escalón (overbite) aumentado',next:'q_orto_overbite_crit', icon:'📶'},
        {label:'Mordida abierta',next:'q_orto_mordida_abierta_crit', icon:'↕️'},
        {label:'Biprotrusión dentaria',next:'q_orto_biprotrusion_crit', icon:'👄'},
        {label:'Apiñamiento o rotaciones',next:'q_orto_apinamiento_rot_crit', icon:'↪️'},
        {label:'Agenesias',next:'q_orto_agenesias_crit', icon:'❌'},
        {label:'Supernumerarios',next:'q_orto_supernumerarios', icon:'➕'},
        {label:'Dientes ectópicos/impactados/impedidos',next:'q_orto_ectopicos_tipo', icon:'🔄'},
        {label:'Vestíbulo-oclusión en piezas posteriores',next:'q_orto_vestibulo_occlusion', icon:'↗️'},
        {label:'Diastema central',next:'q_orto_diastema', icon:'↔️'}
      ]},
      /* === Ramas con lógica solicitada === */
      q_orto_congenitas:{id:'q_orto_congenitas',type:'question',title:'¿El paciente presenta fisura labiopalatina u otra deformación craneofacial?',options:[
        {label:'Sí',next:'r_orto_derivar',contributes:'Fisura labiopalatina/otra deformación craneofacial.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_esqueletales:{id:'q_orto_esqueletales',type:'question',title:'¿El paciente presenta deformidad facial que afecta estética del rostro y perfil?',options:[
        {label:'Sí',next:'r_orto_derivar',contributes:'Deformidad esquelética facial que afecta la estética del rostro y perfil.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_resalte_5mm:{id:'q_orto_resalte_5mm',type:'question',title:'¿El paciente tiene un resalte (overjet) de más de 5 mm en uno o más incisivos?',options:[
        {label:'Sí (>5 mm)',next:'r_orto_derivar',contributes:'Overjet >5 mm.'},
        {label:'No (≤5 mm)',next:'r_orto_continuar_APS'}
      ]},
      q_orto_mordida_cruzada_ubic:{id:'q_orto_mordida_cruzada_ubic',type:'question',title:'¿La mordida cruzada es unilateral o bilateral?',options:[
        {label:'Unilateral',next:'q_orto_mordida_cruzada_df',contributes:'Mordida cruzada unilateral con desplazamiento funcional de más de 1 mm.'},
        {label:'Bilateral',next:'q_orto_mordida_cruzada_df',contributes:'Mordida cruzada bilateral con desplazamiento funcional de más de 1 mm.'}
      ]},
      q_orto_mordida_cruzada_df:{id:'q_orto_mordida_cruzada_df',type:'question',title:'¿Tiene un desplazamiento funcional mayor a 1 mm?',options:[
        {label:'Sí (>1 mm)',next:'r_orto_derivar'},
        {label:'No (≤1 mm)',next:'r_orto_continuar_APS'}
      ]},
      q_orto_overbite_crit:{id:'q_orto_overbite_crit',type:'question',title:'¿Los incisivos superiores cubren completamente los inferiores o hay trauma gingival?',options:[
        {label:'Sí',next:'r_orto_derivar',contributes:'Overbite completo o trauma gingival.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_mordida_abierta_crit:{id:'q_orto_mordida_abierta_crit',type:'question',title:'¿El paciente presenta una mordida abierta mayor o igual a 2 mm?',options:[
        {label:'Sí',next:'r_orto_derivar',contributes:'Mordida abierta ≥2 mm.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_biprotrusion_crit:{id:'q_orto_biprotrusion_crit',type:'question',title:'¿La biprotrusión dentaria altera la estética facial y el cierre labial?',options:[
        {label:'Sí',next:'r_orto_derivar',contributes:'Biprotrusión con impacto estético/cierre labial.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_apinamiento_rot_crit:{id:'q_orto_apinamiento_rot_crit',type:'question',title:'¿El apiñamiento es mayor o igual a 5 mm / la rotaciones son mayor o igual a 45°?',options:[
        {label:'Sí (apiñamiento ≥ 5 mm o rotación ≥ 45°)',next:'r_orto_derivar',contributes:'Apiñamiento ≥5 mm o rotación ≥45°.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_agenesias_crit:{id:'q_orto_agenesias_crit',type:'question',title:'¿La presencia de agenesia requiere tratamiento ortodontico para cierre o aumento de espacio para futura rehabilitación?',options:[
        {label:'Sí',next:'r_orto_derivar',contributes:'Agenesia con decisión de cierre/espacio para rehabilitación.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_supernumerarios:{id:'q_orto_supernumerarios',type:'question',title:'¿Presenta supernumerario con maloclusión?',options:[
        {label:'Sí',next:'r_orto_derivar',contributes:'Supernumerario con maloclusión.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      q_orto_ectopicos_tipo:{id:'q_orto_ectopicos_tipo',type:'question',title:'¿Cuál presenta?',options:[
        {label:'Diente Ectópico',next:'r_orto_derivar',contributes:'Diente ectópico.'},
        {label:'Diente Impactado',next:'r_orto_derivar',contributes:'Diente impactado.'},
        {label:'Diente impedido de erupcionar',next:'r_orto_derivar',contributes:'Diente impedido de erupcionar.'}
      ]},
      q_orto_vestibulo_occlusion:{id:'q_orto_vestibulo_occlusion',type:'question',title:'¿Las piezas posteriores en vestibulo oclusion tienen contacto oclusal?',options:[
        {label:'Sí',next:'r_orto_continuar_APS'},
        {label:'No',next:'r_orto_derivar',contributes:'Vestíbulo-oclusión posterior sin contacto oclusal.'},
      ]},
      q_orto_diastema:{id:'q_orto_diastema',type:'question',title:'¿El diastema es igual o mayor a 2 mm?',options:[
        {label:'Sí (≥ 2 mm)',next:'r_orto_derivar',contributes:'Diastema ≥2 mm.'},
        {label:'No',next:'r_orto_continuar_APS'}
      ]},
      /* === Resultados === */
      r_orto_derivar:{id:'r_orto_derivar',type:'result',
        referral:'Derivación a Ortodoncia',
        rationale:[],
        notes:'Agregar pieza(s) o grupo(s) con condición que justifican la derivación.'
      },
      r_orto_continuar_APS:{id:'r_orto_continuar_APS',type:'result',
        referral:'Continuar controles en APS',
        rationale:[],
        notes:'No cumple criterios de derivación.'
      }
    }
  };

  let state = {current: DEFAULT_TREE.start, answers:{}};
  const main = document.querySelector('#main');

  function setBackgroundForNode(node) {
  document.body.classList.remove('derivar', 'continuarAPS');

  if (node && node.type === 'result') {
    if (node.id === 'r_derivar' || node.id === 'r_orto_derivar') {
      document.body.classList.add('derivar');
    } else if (node.id === 'r_continuar_APS' || node.id === 'r_orto_continuar_APS') {
      document.body.classList.add('continuarAPS');
    }
  }
}  function render() {
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

    // Guardamos la posición actual del scroll
    const currentScroll = window.scrollY;
    
    main.classList.add('fade-out');
    setTimeout(() => {
      setBackgroundForNode(node);
      
      // Mostrar/ocultar botón de reiniciar según la página
      const resetBtn = document.querySelector('.btn-reset');
      if (resetBtn) {
        if (node.id === 'q_inicio') {
          resetBtn.style.display = 'none';
        } else {
          resetBtn.style.display = 'flex';
        }
      }
      
      if(node.type==='question'){
        const titleElement = document.querySelector('h1');
        if(node.id==='q_inicio'){ 
          titleElement.style.display='none'; 
        } else { 
          titleElement.style.display='block';
          // Actualizar el título según el árbol
          if(node.id.startsWith('q_orto_')) {
            titleElement.textContent = 'DERIVACIÓN A ORTODONCIA';
          } else if(node.id.startsWith('q_')) {
            titleElement.textContent = 'DERIVACIÓN A TTM';
          }
        }
        if(node.id==='q_inicio'){ document.body.classList.add('intro-bg'); } else { document.body.classList.remove('intro-bg'); }
        if(node.id==='q_inicio'){ main.classList.add('intro-page'); } else { main.classList.remove('intro-page'); }
        const isIntro = (node.id==='q_inicio');
        // Limpiamos cualquier data-node-id anterior
        main.removeAttribute('data-node-id');
        // Establecemos el nuevo data-node-id
        main.setAttribute('data-node-id', node.id);
        console.log('Current node ID:', node.id); // Para debugging
        let html = '';
        if (isIntro) {
          // Intro: sin cuadro oscuro, como estaba
          html += `<div class='intro-page'><div class='intro-title'>${node.title}</div>`;
          if(node.description) html += `<div class='intro-description'>${node.description}</div>`;
          html += '<div class="intro-options">';
        } else {
          // Preguntas: cuadro oscuro que incluye título y opciones, pero NO controles
          html += `<div class="card-content-dark">`;
          html += `<h2>${addTooltips(node.title)}</h2>`;
          if(node.description) html += `<div class='question-description'>${addTooltips(node.description)}</div>`;
          if(node.id === 'q_motivo' || node.id === 'q_orto_motivo') {
            html += '<div class="options-container">';
          }
        }

        node.options.forEach(o=>{
          const icon = o.icon ? `<span class="icon">${o.icon}</span>` : '';
          let buttonClass = '';
          if (node.id === 'q_motivo' && o.label.includes('Limitación de la apertura')) {
            buttonClass = 'left-align';
          }
          html += `<div class="choice"><button class="${buttonClass}" onclick="choose('${node.id}','${o.label}','${o.next}')">${icon}${o.label}</button></div>`;
        });

        if(isIntro) {
          html += '</div></div>';
        } else if(node.id === 'q_motivo' || node.id === 'q_orto_motivo') {
          // cerrar options-container y el cuadro oscuro
          html += '</div></div>';
        } else {
          // cerrar solo el cuadro oscuro
          html += '</div>';
        }
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

        // TTM Results
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

        // Ortodoncia Results
        if(node.id === 'r_orto_continuar_APS'){
          html += `<h2 class="conclusion-aps">${node.referral}</h2>`;
          html += '<div class="justificacion-box danger"><strong>No tiene indicación de derivación a especialidad de Ortodoncia.</strong></div>';
          if (node.rationale && node.rationale.length) {
            html += `<div class="note"><p>${node.rationale.join('. ')}</p></div>`;
          }
          if(node.notes) {
            html += `<div class="note"><p>${node.notes}</p></div>`;
          }
          conclusionText = `${node.referral}. No tiene indicación de derivación a especialidad de Ortodoncia.`;
        }
        if(node.id === 'r_orto_derivar'){
          html += `<h2 class="conclusion-derivar">${node.referral}</h2>`;
          html += `<div class="justificacion-box blue"><strong>Justificación:</strong> ` + (uniq.length ? uniq.join(', ') : '') + '</div>';
          if (node.rationale && node.rationale.length) {
            html += `<div class="note"><p>${node.rationale.join('. ')}</p></div>`;
          }
          if(node.notes) {
            html += `<div class="note"><p>${node.notes}</p></div>`;
          }
          html += '<p><em>Copie y pegue este texto en observaciones de derivación. En caso de estimarlo pertinente, puede agregar información clínica adicional relevante.</em></p>';
          conclusionText = `${node.referral}. Justificación: ${uniq.join(', ')}`;
        }

        // Add copy button for all derivation results
        if(node.id !== 'r_continuar_APS' && node.id !== 'r_orto_continuar_APS'){
          html += `<textarea id="copy-payload" style="position:absolute;left:-9999px;top:-9999px">${conclusionText}</textarea>`;
          html += `<div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn btn-copy" onclick="copyConclusion()">📋 Copiar conclusión</button></div>`;
        }
        
        html += controlsHTML();
        main.innerHTML = html;
      scrollToTop();
      }
      // Restauramos la posición del scroll si no es un resultado
      if (node.type !== 'result') {
        setTimeout(() => {
          window.scrollTo({
            top: currentScroll,
            behavior: 'auto'
          });
        }, 0);
      }
      
      main.classList.remove('fade-out');
    }, 400);
  }

  window.choose = function(qId,label,next){
    state.answers[qId] = label;
    state.current = next;
    render();
    // No llamamos a scrollToTop aquí para mantener la posición del scroll
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
  }

  function reset(){
    state = {current: DEFAULT_TREE.start, answers: {}};
    // Reiniciar sin animación fade para que sea inmediato
    main.classList.remove('fade-out');
    render();
  }

  function controlsHTML(){
    return `<div class="controls">
      <button class="btn btn-back" onclick="back()">← Atrás</button>
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
