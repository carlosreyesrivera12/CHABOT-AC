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
A: El Seafood Expo Global 2025 se celebró del 22 al 24 de abril en Fira de Barcelona (Gran Via). Para fechas de ediciones futuras consulte: https://www.seafoodexpo.com/global/

[EV3] Q: ¿Dónde se celebra el Seafood Expo Global?
A: En el recinto Fira Gran Via de Barcelona, uno de los centros de exposiciones más grandes de Europa. Ubicado en L'Hospitalet de Llobregat, con acceso por metro (L9/L10).

[EV4] Q: ¿Qué pabellones usa el Seafood Expo Global?
A: El evento ocupa varios halls del recinto Gran Via. Para información específica sobre pabellones y stands contacte con la organización del evento o con nuestras oficinas.

[EV5] Q: ¿Cómo llego al Seafood Expo Global?
A: El recinto Fira Gran Via está conectado por metro líneas L9 y L10. Si viene con camión o vehículo de servicio, debe registrarse primero en el Parking del Sot del Migdia (Carrer del Foc 140). 📍 https://maps.app.goo.gl/pFC3TDEkVSztsBdq7
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

  if (msg.match(/fira|recinto|hall|montjuic|montjuïc|gran via|resa expo|partner|quien es|quién es/)) {
    context = KB.fira + '\n' + KB.contacto;
  } else if (msg.match(/seafood|expo|feria|evento|cuando|fechas|pabellon|pabellón|donde.*celebra/)) {
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
