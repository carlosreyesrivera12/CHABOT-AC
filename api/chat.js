module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { message, botName } = req.body;
  if (!message) return res.status(400).json({ error: 'Falta el mensaje' });

  // BASE DE CONOCIMIENTO POR CATEGORÍAS
  const KB = {
    general: `
[P1] Q: ¿Qué servicios ofrecen?
A: Descarga/carga de camiones, alquiler de maquinaria, almacenaje de embalajes y reposicionamiento de material.
[P2] Q: ¿A quién van dirigidos?
A: Organizadores de eventos, montadores profesionales y expositores/empresas participantes.
[P3] Q: ¿Cómo se contratan?
A: Por correo electrónico indicando: evento, empresa, montador, expositor, pabellón, stand, día y hora.`,

    descarga: `
[P4] Q: ¿Cómo reservo una descarga o carga?
A: Enviando correo con: número de booking, evento, empresa, expositor, pabellón, stand, día y hora.
[P5] Q: ¿Qué horarios hay para descarga/carga?
A: Aproximadamente 8:00 a 20:00h gestionados por la organización. Horarios especiales requieren confirmación previa.
[P6] Q: ¿Puedo cambiar fecha u hora?
A: Sí, con 24-48h de anticipación. Si requiere permiso Early/Late Buildup no es posible sin autorización de Fira.
[P7] Q: ¿Qué es un permiso Early o Late Buildup?
A: Permisos especiales para trabajar fuera del horario habitual (8-20h). Requieren autorización de la organización.`,

    maquinaria: `
[P9] Q: ¿Con cuánta anticipación pido maquinaria?
A: 48 horas. Excepción: viernes hasta las 10:00 AM para servicio del lunes.
[P10] Q: ¿Hay maquinaria con conductor?
A: Sí, con y sin conductor.
[P11] Q: ¿Dónde retiro maquinaria sin conductor?
A: Oficina Central, Puerta 3.01.
[P12] Q: ¿Dónde pido maquinaria con conductor?
A: Hall Manager: Hall 1 (Puerta 1.01), Hall 2 (Puerta 2.19), Hall 3 (Puerta 3.14), Hall 4 (Puerta 4.8), Hall 5 (Puerta 5.8).
[M1] Q: ¿Tienen apiladores?
A: Sí. Aptos para cualquier trayecto y altura de elevación. Chasis estrecho, muy ágiles y precisos. IMAGEN:apilador
[M2] Q: ¿Qué maquinaria tienen?
A: Apiladores, forklifts (toros), transpaletas eléctricas, plataformas tijera, unipersonales, elevaestruct­uras y brazos articulados. Con o sin conductor. IMAGEN:apilador IMAGEN:forklift IMAGEN:transpaleta
[M3] Q: ¿Tienen forklift / toro / carretilla elevadora?
A: Sí. Robustos para mover y elevar cargas pesadas. Disponibles con conductor. IMAGEN:forklift
[M4] Q: ¿Tienen transpaleta eléctrica?
A: Sí. Ideales para transporte horizontal de palés. IMAGEN:transpaleta
[M5] Q: ¿Tienen plataforma tijera?
A: Sí. Para trabajos en altura con plataforma estable. IMAGEN:tijera
[M6] Q: ¿Tienen plataforma unipersonal?
A: Sí. Para trabajos en altura en espacios reducidos. IMAGEN:unipersonal
[M7] Q: ¿Tienen eleva estructura?
A: Sí. Para elevar y posicionar estructuras pesadas con precisión. IMAGEN:eleva_estructura
[M8] Q: ¿Tienen brazo articulado?
A: Sí. Para alcanzar zonas de difícil acceso en altura. IMAGEN:brazo_articulado`,

    embalaje: `
[P14] Q: ¿Qué tipos de almacenaje hay?
A: PRIORITY (primera devolución), FULLGOOD (mercadería de valor), EMPTY (embalajes vacíos, última devolución).
[P15] Q: ¿Cómo funciona el embalaje?
A: 1) Firma en oficina, 2) Etiquetas (una por bulto), 3) Retirada del stand, 4) Almacenaje, 5) Devolución por prioridad.
[P17] Q: ¿Cómo se etiqueta?
A: Una etiqueta oficial por bulto. Sin etiqueta no se retira el material.
[E1] Q: ¿En qué orden se devuelven los embalajes?
A: 1º PRIORITY, 2º FULLGOOD, 3º EMPTY. Contrate según la urgencia que necesite.
[E6] Q: ¿Puedo acceder a mi material almacenado?
A: Sí, pero debe informar primero al Hall Manager. No se permite ingresar sin presencia del personal de logística.
[E7] Q: ¿Puedo retirar algo del almacén?
A: Solo en presencia del personal de logística. Prohibido acceder sin acompañamiento para evitar robos o daños.
[E10] Q: ¿El seguro cubre la pérdida?
A: Cubre el embalaje (NO el contenido). Máximo 100€ por caja. Reclamaciones solo hasta 24h después del cierre del evento.
[E11] Q: Etiqueté mal mi material, ¿qué pasa?
A: Si el valor real es superior al declarado, la cobertura queda limitada al contrato firmado.
[E14] Q: ¿Cuáles son los términos de embalaje?
A: FIRESA almacena embalajes etiquetados hasta el cierre. Servicio URGENTE entrega el mismo día del cierre. No manipula embalajes salvo autoridad competente. No cubre fuerza mayor. IMAGEN:terminos_embalaje
[E18] Q: ¿Cómo es la etiqueta Priority?
A: IMAGEN:etiqueta_priority
[E19] Q: ¿Cómo es la etiqueta Fullgood?
A: IMAGEN:etiqueta_fullgood
[E20] Q: ¿Cómo es la etiqueta Empty?
A: IMAGEN:etiqueta_empty`,

    camiones: `
[C1] Q: ¿Cómo entra un camión en la Fira?
A: Depende del tamaño y servicio. Todos los vehículos con booking deben pasar primero por el Parking del Sot del Migdia (Carrer del Foc 140) para gestionar el pase de ingreso y albarán. 📍 https://maps.app.goo.gl/pFC3TDEkVSztsBdq7

[C21] Q: ¿Cuál es el horario del parking del Sot? ¿A qué hora abre el Sot?
A: El Parking del Sot del Migdia (Carrer del Foc 140) abre todos los días de 6:30 a 20:00h. Horario sujeto a cambios según el evento. 📍 https://maps.app.goo.gl/pFC3TDEkVSztsBdq7
[C2] Q: ¿Cómo entra un tráiler de 5 ejes?
A: Obligatoriamente debe registrarse en el Parking del Sot del Migdia, Carrer del Foc 140. Desde allí gestiona el pase y el albarán. IMAGEN:trailer_5ejes 📍 https://maps.app.goo.gl/pFC3TDEkVSztsBdq7
[C4] Q: ¿Vehículos pequeños también necesitan booking?
A: Sí. Todo vehículo con servicio de maquinaria necesita booking. Y todos pasan por el Sot sin excepción.
[C10] Q: ¿Qué información debe tener el conductor?
A: Número de booking, pabellón y número de stand, fecha y horario, nombre del cliente/montador/expositor, si es con maquinaria o manual, y puerta del hall si se conoce.
[C11] Q: ¿Qué hace el conductor al llegar?
A: 1) Ir al Parking Sot del Migdia 📍 https://maps.app.goo.gl/pFC3TDEkVSztsBdq7, 2) Presentar booking y datos en el registro, 3) Gestionar pase de ingreso y albarán, 4) Dirigirse al acceso del pabellón correspondiente.
[C14] Q: ¿Hay formulario para el Sot?
A: Sí, formulario oficial de Resa Expo Logistics con datos del vehículo, booking, stand, pabellón y datos del conductor. IMAGEN:formulario_sot
[C17] Q: ¿Qué es un tráiler articulado?
A: Vehículo de mayor longitud. También debe pasar por el Sot del Migdia. IMAGEN:trailer_articulado
[C7] Q: Tengo booking para dos pabellones, ¿qué hago?
A: Si su booking no especifica las dos ubicaciones, contacte inmediatamente con la oficina para modificarlo. No se puede trabajar en dos pabellones con una reserva que indica solo uno. Llame al 932 64 24 40 o escriba a logistics@rxl.es`,

    fira: `
[F1] Q: ¿Qué es Fira de Barcelona?
A: Fira de Barcelona es uno de los recintos feriales más importantes de Europa con dos recintos: Gran Via (L'Hospitalet, 198.500m²) y Montjuïc (Barcelona). Acoge más de 150 eventos al año con millones de visitantes internacionales.

[F2] Q: ¿Cómo llegar a Fira Gran Via?
A: Metro L9/L10 estaciones Europa/Fira, Fira e Ildefons Cerdà. Autobús líneas B10, B20. Autopistas C-31/C-32/A-2. Aeropuerto El Prat a 12km por metro directo (15-20 min).

[F3] Q: ¿Cuántos halls tiene Fira Gran Via?
A: 8 halls interconectados (Hall 1 al 8), más centros de conferencias CC1 al CC8, suites Barcelona, Europa y Tibidabo, jardines A-G y walkway superior. Superficie total 198.500m².

[F4] Q: ¿Qué capacidad tienen los halls?
A: Hall 1: 14.000m², resistencia 3.000kg/m². Hall 3: 43.000m², resistencia 5.000kg/m². Los halls están conectados entre sí por el walkway superior e inferior.

[F5] Q: ¿Dónde está el Hall Manager de cada pabellón?
A: Hall 1: Puerta 1.01 · Hall 2: Puerta 2.19 · Hall 3: Puerta 3.14 · Hall 4: Puerta 4.8 · Hall 5: Puerta 5.8.

[F6] Q: ¿Qué accesos tiene Fira Gran Via?
A: 3 accesos principales: Sur (entrada principal), Norte y Este. Cada uno conecta con diferentes halls y zonas del recinto.

[F7] Q: ¿Tiene parking Fira Gran Via?
A: Sí. Para vehículos de servicio con booking deben registrarse en el Parking del Sot del Migdia, Carrer del Foc 140, abierto de 6:30 a 20:00h todos los días. 📍 https://maps.app.goo.gl/pFC3TDEkVSztsBdq7

[F8] Q: ¿Cuáles son las normas de electricidad en los halls?
A: Los service chests tienen: 1x63A, 2x32A, 4x16A, aire comprimido (500-800 l/m, 7 bar) y agua. Las conexiones deben hacerlas instaladores autorizados de Fira. Conexiones hasta 63A mediante clavija CEE.

[F9] Q: ¿Qué hacer en caso de emergencia en la Fira?
A: Llamar al Centro de Control Gran Via: 93 233 41 00 o usar los pulsadores de emergencia. No bloquear salidas. Seguir instrucciones de megafonía y personal uniformado. No usar ascensores. Ir al punto de encuentro designado.

[F10] Q: ¿Qué es el walkway de Gran Via?
A: El walkway es la galería superior que conecta todos los halls. Incluye jardines A-G, acceso a suites y centros de conferencias. Pantallas TV distribuidas por todo el recorrido.

[F11] Q: ¿Qué centros de conferencias tiene Gran Via?
A: CC2 (auditorium 465 personas, 13 salas), CC3, CC4, CC5, CC7 (hasta 222 personas), CC8 (planta baja y alta). Todos conectados a los halls principales.

[F12] Q: ¿Qué suites tiene Fira Gran Via?
A: Barcelona Suite, Europa Suite y Tibidabo Suite. Espacios premium para eventos exclusivos y reuniones VIP.

[F13] Q: ¿Qué es el loading bay?
A: Zonas de carga y descarga del recinto. Cada hall tiene puertas de servicio para vehículos. Obligatorio tener booking. Horario 8:00 a 20:00h.

[F14] Q: ¿Hay ascensores de carga?
A: Sí, en Hall 8.1 hay freight lifts de 4.000 y 6.000 kg. Solo para mercancía — prohibido con personal dentro. Las líneas amarillas del suelo no deben ser cruzadas por la carga.

[F15] Q: ¿Qué normativa debo cumplir como expositor?
A: Los expositores deben cumplir la normativa de Fira en construcción de stands, instalaciones eléctricas, seguridad contra incendios y accesibilidad. Toda documentación debe presentarse antes del montaje.

[F16] Q: ¿Hay internet en la Fira?
A: Sí, Fira ofrece servicios de internet por cable y WiFi para expositores y organizadores. Se contratan a través del catálogo oficial de servicios.

[F17] Q: ¿Qué es el CC2 de Fira Gran Via?
A: Centro de conferencias en Hall 2 con auditorium de 465 personas, 13 salas y 1.500m² flexibles. Diseñado por el arquitecto Toyo Ito. Conectado a Hall 2.1 puede ampliarse a 5.000m².

[F18] Q: ¿Cómo es la accesibilidad en Fira Gran Via?
A: El recinto tiene accesos adaptados para personas con movilidad reducida, ascensores, rampas y señalética específica en todos los halls y accesos principales.

[F19] Q: ¿Cuál es la diferencia entre Gran Via y Montjuïc?
A: Gran Via (L'Hospitalet): recinto moderno, 8 halls, 198.500m², metro L9/L10. Montjuïc (Barcelona): recinto histórico junto a Plaza España, metro L1/L3 estación Espanya.`,

    evento: `
[F1] Q: ¿Qué es Fira de Barcelona? ¿Qué es la Fira?
A: Fira de Barcelona es uno de los recintos feriales más importantes de Europa. Cuenta con dos recintos: Gran Via (L'Hospitalet, 200.000m²) y Montjuïc (Barcelona). Acoge más de 150 eventos al año con más de 4 millones de visitantes.

[F2] Q: ¿Cómo llegar a Fira Gran Via?
A: Metro L9/L10 (estaciones Europa/Fira, Fira, Europa Fira). También por autopista C-31/C-32, y autobús. El aeropuerto está a 12km por metro directo.

[F3] Q: ¿Cuántos halls tiene Fira Gran Via?
A: 8 halls interconectados (Hall 1 al 8), más zonas de conferencias CC1 al CC8, suites y jardines. Superficie total de 198.500m².

[F4] Q: ¿Qué es Resa Expo Logistics?
A: Resa Expo es el partner oficial de logística para Fira de Barcelona. Ofrece servicios de descarga/carga, maquinaria, almacenaje y reposicionamiento de material para expositores y montadores en todos los eventos del recinto.

[F5] Q: ¿En qué eventos opera el servicio de logística?
A: El servicio opera en todos los eventos celebrados en Fira de Barcelona — desde grandes ferias internacionales como el MWC o Seafood Expo hasta congresos y eventos corporativos. Cualquier expositor o montador puede contratar los servicios.

[F6] Q: ¿Cuál es la diferencia entre Fira Gran Via y Fira Montjuïc?
A: Gran Via (L'Hospitalet) es el recinto más moderno y grande, con 8 halls. Montjuïc está en Barcelona ciudad, junto a la Plaza España, con pabellones históricos. Los servicios de logística operan en ambos recintos.

[F7] Q: ¿Tiene parking Fira Gran Via?
A: Sí, hay parking en el recinto. Para vehículos de servicio con booking deben registrarse en el Parking del Sot del Migdia (Carrer del Foc 140) antes de acceder. 📍 https://maps.app.goo.gl/pFC3TDEkVSztsBdq7
`,

    evento: `
[EV1] Q: ¿Qué es el Seafood Expo Global? ¿Qué evento es este?
A: El Seafood Expo Global es la feria de mariscos y pescados más grande del mundo. Se celebra anualmente en Fira de Barcelona (Gran Via), reuniendo miles de expositores y compradores de todo el mundo del sector pesquero y acuícola.

[EV2] Q: ¿Cuándo es el Seafood Expo Global? ¿Cuáles son las fechas?
A: El Seafood Expo Global 2026 se celebra del 21 al 23 de abril de 2026 en Fira Barcelona Gran Via, L'Hospitalet de Llobregat, Barcelona. Más información en: https://www.seafoodexpo.com/global/

[EV3] Q: ¿Dónde se celebra el Seafood Expo Global?
A: En el recinto Fira Gran Via de Barcelona, uno de los centros de exposiciones más grandes de Europa. Ubicado en L'Hospitalet de Llobregat, con acceso por metro (L9/L10).

[EV4] Q: ¿Qué pabellones usa el Seafood Expo Global?
A: El evento ocupa varios halls del recinto Gran Via. Para información específica sobre pabellones y stands contacte con la organización del evento o con nuestras oficinas.

[EV5] Q: ¿Cómo llego al Seafood Expo Global?
A: El recinto Fira Gran Via está conectado por metro líneas L9 y L10. Si viene con camión o vehículo de servicio, debe registrarse primero en el Parking del Sot del Migdia (Carrer del Foc 140). 📍 https://maps.app.goo.gl/pFC3TDEkVSztsBdq7

[EV6] Q: ¿Cuántos expositores tiene el Seafood Expo Global 2026?
A: El Seafood Expo Global 2026 cuenta con más de 2.000 expositores de todo el mundo, distribuidos en los halls 1 al 5 de Fira Gran Via. Para ver el directorio completo visita: https://www.seafoodexpo.com/global/

[EV7] Q: ¿En qué stand está Mowi? ¿Dónde está el stand de Mowi?
A: Mowi ASA está en el stand 3B401 (Halls 3B). Incluye Mowi Belgium, France, Germany, Iberia, Poland, Consumer Products UK y Markets Norway AS, todos en el mismo stand 3B401.

[EV8] Q: ¿Dónde está el stand de Nueva Pescanova?
A: Nueva Pescanova está en el stand 3F601.

[EV9] Q: ¿Dónde está el stand de Royal Greenland?
A: Royal Greenland A/S está en el stand 2F201.

[EV10] Q: ¿Dónde está el stand de Clearwater?
A: Clearwater Seafoods está en el stand 3A801.

[EV11] Q: ¿Cómo busco el stand de un expositor?
A: Puedes buscar el stand de cualquier expositor en el directorio oficial del evento: https://www.seafoodexpo.com/global/ — también puedes preguntarme directamente por el nombre de la empresa.
`,

    contacto: `
[P29] Q: ¿Cuál es el horario de atención?
A: Durante los horarios de la fira. Consulte con el Hall Manager de cada pabellón.
[P30] Q: ¿Dónde están las oficinas?
A: Oficina Central: Puerta 3.01. Hall 1: Puerta 1.01, Hall 2: Puerta 2.19, Hall 3: Puerta 3.14, Hall 4: Puerta 4.8, Hall 5: Puerta 5.8.`
  };

  // DETECTAR CATEGORÍA SEGÚN PALABRAS CLAVE
  const msg = message.toLowerCase();
  let context = '';

  if (msg.match(/fira|recinto|hall|montjuic|montjuïc|gran via|resa expo|partner|quien es|quién es|cc2|cc7|cc8|walkway|suite|loading|emergencia|electricidad|internet|wifi|acceso|accesibilidad|normativa|ascensor|parking fira/)) {
    context = KB.fira + '\n' + KB.contacto;
  } else if (msg.match(/seafood|expo|feria|evento|cuando|fechas|pabellon|pabellón|donde.*celebra|stand|expositor|empresa|booth/)) {
    context = KB.evento + '\n' + KB.fira;
  } else if (msg.match(/camion|trailer|tráiler|truck|camión|chofer|conductor|sot|booking|referencia|albaran|albarán|pase|ingreso|registro|parking|acceso vehiculo|furgoneta/)) {
    context = KB.camiones + '\n' + KB.general;
  } else if (msg.match(/maquinaria|maquina|máquina|apilador|forklift|toro|transpaleta|tijera|unipersonal|brazo|articulado|eleva|elevadora|carretilla/)) {
    context = KB.maquinaria + '\n' + KB.general;
  } else if (msg.match(/embalaje|embalar|caja|etiqueta|priority|fullgood|empty|almacen|almacenaje|seguro|pérdida|perdida|rotura|retirar|devolver|devolución/)) {
    context = KB.embalaje + '\n' + KB.general;
  } else if (msg.match(/descarga|carga|horario|horarios|modificar|cambiar|early|late|buildup/)) {
    context = KB.descarga + '\n' + KB.general;
  } else if (msg.match(/oficina|contacto|teléfono|telefono|email|mail|ubicacion|ubicación|donde|hall manager/)) {
    context = KB.contacto + '\n' + KB.general;
  } else {
    // Si no detecta categoría, usa todo pero comprimido
    context = KB.general + '\n' + KB.descarga + '\n' + KB.maquinaria + '\n' + KB.embalaje + '\n' + KB.camiones + '\n' + KB.contacto;
  }

  // ── DYNAMIC EXHIBITOR LOOKUP ──────────────────────────────────────
  // Check if question is about an exhibitor/stand BEFORE calling AI
  const msgLower = message.toLowerCase();
  if (msgLower.match(/stand|expositor|booth|donde.*empresa|empresa.*donde|hall.*empresa|que stand|numero.*stand|stand.*numero/)) {
    try {
      const csvUrl = 'https://docs.google.com/spreadsheets/d/1B0eVdT2kvTgQrxXNaUF0PtCz6g7wp83H6SQ262H8aH0/export?format=csv&id=1B0eVdT2kvTgQrxXNaUF0PtCz6g7wp83H6SQ262H8aH0';
      const csvRes = await fetch(csvUrl);
      const csvText = await csvRes.text();
      const lines = csvText.trim().split('\n').slice(1); // skip header
      const searchTerm = message.replace(/¿|\?|stand|expositor|booth|donde|está|esta|hall|número|numero/gi,'').trim().toLowerCase();
      const matches = lines.filter(line => {
        const empresa = line.split(',')[0].toLowerCase();
        return searchTerm.split(' ').some(word => word.length > 3 && empresa.includes(word));
      }).slice(0, 5);

      if (matches.length > 0) {
        const results = matches.map(line => {
          const parts = line.split(',');
          return `<strong>${parts[0]}</strong> → Stand <strong>${parts[1]}</strong>`;
        }).join('<br>');
        return res.status(200).json({ reply: `📋 Resultados para "${searchTerm}":<br><br>${results}<br><br>Seafood Expo Global 2026 · Fira Barcelona Gran Via · 21-23 abril` });
      }
    } catch(e) {
      console.error('Exhibitor lookup error:', e);
    }
  }
  // ────────────────────────────────────────────────────────────────

  const systemPrompt = `You are a logistics assistant. Your name is "Asistente de Logística".

CRITICAL LANGUAGE RULE: Always respond in the EXACT same language as the user's message.

KNOWLEDGE BASE:
${context}

RULES:
- Answer ONLY based on the knowledge base.
- Be VERY concise. Max 3-4 sentences.
- If not found, suggest contacting: 932 64 24 40 or logistics@rxl.es or Oficina Central Puerta 3.01.
- Keep IMAGEN: tags in your response exactly as written — they will render as images.
- Be warm and professional.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 400,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq error:', err);
      return res.status(502).json({ error: 'Error al contactar la IA', detail: err });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'No pude generar una respuesta.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
