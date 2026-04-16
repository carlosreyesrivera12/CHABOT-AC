// api/chat.js — Chatbot Logística Fira Barcelona
module.exports = async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { message, persona, botName } = req.body;
  if (!message) return res.status(400).json({ error: 'Falta el mensaje' });

  const KNOWLEDGE_BASE = `
[P1] Q: ¿Qué servicios de logística ofrece en Fira de Barcelona?
A: Ofrecemos descarga y carga de camiones, alquiler de maquinaria, almacenaje de embalajes vacíos, almacenaje de mercadería de valor, entrega según prioridad del servicio y reposicionamiento de material.

[P2] Q: ¿A quién van dirigidos estos servicios?
A: Nuestros servicios están disponibles para organizadores de eventos, montadores profesionales y expositores/empresas participantes.

[P3] Q: ¿Cómo se contratan los servicios?
A: Los servicios se contratan con anticipación por correo electrónico. Deberá indicar: evento, empresa, montador, expositor, pabellón y stand donde se brindará el servicio.

[P4] Q: ¿Cómo reservo una descarga o carga de camión?
A: Puede reservar enviando un correo indicando: número de referencia o booking, evento, empresa, expositor, pabellón, número de stand, día y hora deseados.

[P5] Q: ¿Qué horarios están disponibles para descarga y carga?
A: Los horarios están gestionados por Fira de Barcelona, siendo aproximadamente de 8:00 a 20:00 horas. Si necesita un horario diferente, debe confirmarse primero con Fira de Barcelona la disponibilidad.

[P6] Q: ¿Puedo cambiar la fecha u hora de mi descarga/carga?
A: Sí, se permiten modificaciones con un criterio de 24 a 48 horas de anticipación, siempre que no sea necesario un permiso de trabajo Early o Late Buildup.

[P7] Q: ¿Qué es un permiso Early o Late Buildup?
A: Son permisos especiales para trabajar fuera de los horarios habituales. Si su modificación requiere alguno de estos permisos, no podrá realizarse sin autorización adicional de Fira de Barcelona.

[P8] Q: ¿Puedo solicitar un horario fuera de 8 a 20 horas?
A: Sí, pero debe confirmarlo previamente con Fira de Barcelona. Ellos verificarán si es posible trabajar en ese horario y si hay disponibilidad de logística para realizar el servicio.

[P9] Q: ¿Con cuánta anticipación debo pedir maquinaria?
A: Los servicios de maquinaria deben solicitarse con 48 horas de anticipación. Excepción: los pedidos realizados el viernes hasta las 10:00 AM pueden ser para un servicio del lunes.

[P10] Q: ¿Hay maquinaria con conductor disponible?
A: Sí, ofrecemos maquinaria tanto con conductor como sin conductor.

[P11] Q: ¿Dónde se retira la maquinaria sin conductor?
A: La maquinaria sin conductor se retira en la Oficina Central en la Puerta 3.01, donde se firma el servicio y se entrega la máquina.

[P12] Q: ¿Dónde puedo solicitar maquinaria con conductor?
A: Los servicios de maquinaria con conductor pueden solicitarse en las oficinas de Hall Manager: Hall 1 (Puerta 1.01), Hall 2 (Puerta 2.19), Hall 3 (Puerta 3.14), Hall 4 (Puerta 4.8), Hall 5 (Puerta 5.8).

[P13] Q: ¿Puedo modificar mi pedido de maquinaria?
A: Debe contactar directamente con la oficina donde realizó el pedido o con la Oficina Central para solicitar cambios.

[P14] Q: ¿Qué tipos de almacenaje están disponibles?
A: Contamos con almacenaje para embalajes vacíos, mercadería de valor y servicio Priority (entrega por prioridad).

[P15] Q: ¿Cómo funciona el servicio de embalaje?
A: El proceso es: 1) Firma del servicio en la oficina, 2) Entrega de etiquetas (una por elemento), 3) Retirada inmediata del stand una vez etiquetado, 4) Almacenaje seguro según tipo, 5) Devolución según prioridad contratada.

[P16] Q: ¿Qué necesito para contratar el almacenaje?
A: Debe firmar el servicio en la oficina con detalles de cantidad de bultos, tipo de mercadería y tipo de almacenaje (vacío, estándar o priority).

[P17] Q: ¿Cómo se etiqueta el material a almacenar?
A: Cada caja o elemento debe llevar una sola etiqueta oficial. El material sin etiqueta no será retirado del stand.

[P18] Q: ¿Qué pasa si mi material no tiene etiqueta?
A: El material sin etiqueta de embalaje no será retirado del stand. Debe asegurar que cada bulto tenga su etiqueta colocada correctamente.

[P19] Q: ¿Existe seguro en el almacenaje?
A: Sí. El seguro de reposición por rotura o pérdida del producto guardado es acorde al tipo de servicio de embalaje contratado (vacío, mercadería estándar o priority).

[P20] Q: ¿Cuál es la diferencia entre almacenaje estándar y priority?
A: El servicio priority asegura una entrega más rápida según la prioridad establecida. Ambos incluyen seguro de reposición, siendo el costo diferente según el tipo.

[E1] Q: ¿En qué orden se devuelven los embalajes? ¿Cuándo me devuelven mis cajas? ¿Cuál es el orden de entrega de embalajes?
A: Los embalajes se devuelven según el orden de prioridad contratado: 1º PRIORITY (primera devolución), 2º FULLGOOD (mercadería con valor), 3º EMPTY (embalajes vacíos, última devolución). Por eso es importante contratar el servicio adecuado según la urgencia que necesite.

[E2] Q: ¿Qué es el servicio Priority de embalaje?
A: Es el servicio de máxima prioridad. Los embalajes o mercancías con este servicio son los primeros en ser devueltos al stand. Recomendado cuando necesita sus materiales con urgencia durante el montaje o desmontaje.

[E3] Q: ¿Qué es el servicio Fullgood?
A: Fullgood es el servicio para mercadería con valor. Se devuelve en segundo lugar, después de los Priority. Incluye seguro de reposición acorde al valor de la mercancía almacenada.

[E4] Q: ¿Qué es el servicio Empty?
A: Empty es el servicio para embalajes vacíos (cajas, fundas, palés vacíos). Es el último en ser devuelto. Ideal para embalajes que no contienen mercancía de valor y no requieren devolución urgente.

[E5] Q: ¿Qué servicio de embalaje me recomienda? ¿Cuál elijo?
A: Depende de sus necesidades: si necesita sus materiales con urgencia → PRIORITY. Si almacena mercancía con valor → FULLGOOD. Si son embalajes vacíos sin urgencia → EMPTY. Recuerde: el orden de devolución es siempre Priority → Fullgood → Empty.

[E6] Q: ¿Puedo acceder a mi material ya almacenado? ¿Puedo ir a ver mis embalajes retirados?
A: Sí, pero debe informar primero al Hall Manager de su pabellón para gestionar el acceso. No está permitido ingresar al área de almacenaje sin la presencia del personal de logística de Resa Logistic.

[E7] Q: ¿Puedo retirar algo de mis embalajes almacenados?
A: Sí, pero únicamente en presencia del personal de logística de Resa Logistic. Está estrictamente prohibido acceder o retirar material sin acompañamiento del personal autorizado, para evitar robos o daños a mercancía de terceros.

[E8] Q: ¿Por qué no puedo entrar solo al almacén?
A: Por seguridad. No está permitido el acceso sin la presencia del personal de logística para evitar robos o roturas de material de terceros. Siempre debe informar al Hall Manager de su pabellón y esperar a ser acompañado por el personal de Resa Logistic.

[E9] Q: ¿Cómo accedo a mi material almacenado? ¿Cuál es el procedimiento?
A: El procedimiento es: 1) Informe al Hall Manager de su pabellón que necesita acceder a su material. 2) El Hall Manager coordinará con el personal de logística. 3) Un miembro del personal de Resa Logistic le acompañará al área de almacenaje. 4) Cualquier retirada de material se realiza siempre en presencia del personal autorizado.

[E10] Q: ¿Qué pasa si pierdo un embalaje? ¿El seguro cubre la pérdida?
A: Sí, en caso de pérdida el seguro cubre según el tipo de servicio contratado: PRIORITY tiene mayor cobertura, FULLGOOD cubre mercadería de valor, EMPTY cubre embalajes vacíos. La cobertura está condicionada al contrato firmado al momento de contratar el servicio.

[E11] Q: Etiqueté mal mi material, ¿qué pasa con el seguro?
A: Si el cliente etiquetó incorrectamente un material cuyo valor real es superior al declarado en el servicio contratado, la cobertura del seguro quedará condicionada al contrato firmado. Es decir, el seguro solo cubrirá según el tipo de servicio que se contrató y firmó, no según el valor real del material mal etiquetado.

[E12] Q: ¿Qué pasa si declaré un valor incorrecto en mi embalaje?
A: Si el valor real del material es superior al declarado al contratar el servicio, la indemnización estará limitada a las condiciones del contrato firmado. Para evitar problemas, es fundamental etiquetar correctamente cada bulto y contratar el servicio adecuado (FULLGOOD o PRIORITY) según el valor real de la mercancía.

[E13] Q: ¿Cómo evito problemas con el seguro de mis embalajes?
A: Para estar correctamente cubierto: 1) Etiquete correctamente cada bulto con la etiqueta oficial. 2) Declare el tipo de mercancía correctamente. 3) Contrate el servicio adecuado según el valor — FULLGOOD para mercancía de valor, PRIORITY para máxima cobertura y urgencia. 4) Conserve el contrato firmado como respaldo.

[E14] Q: ¿Cuáles son los términos y condiciones del servicio de embalaje?
A: Los términos principales son: FIRESA almacena embalajes correctamente etiquetados hasta el cierre del evento. El cliente debe entregar los embalajes debidamente identificados. El servicio URGENTE/PRIORITY entrega el mismo día del cierre. FIRESA no manipula ni abre los embalajes salvo requerimiento de autoridades. No se acepta responsabilidad por daños por fuerza mayor (incendio, inundación, etc.). IMAGEN:terminos_embalaje

[E15] Q: ¿Qué cubre el seguro de embalaje? ¿Cuánto me pagan si pierdo una caja?
A: El seguro cubre únicamente el embalaje, NO el contenido. En caso de pérdida, la indemnización máxima es de 100 euros por caja. No se aceptan reclamaciones pasadas 24 horas desde el cierre del evento. FIRESA no es responsable de pérdidas no atribuibles a su negligencia.

[E16] Q: ¿Hasta cuándo puedo reclamar por un embalaje perdido?
A: Las reclamaciones solo se aceptan hasta 24 horas después del cierre del evento. Pasado ese plazo no se admitirán reclamaciones de embalajes.

[E17] Q: ¿Qué pasa si no pago el servicio de embalaje?
A: En caso de impago, FIRESA se reserva el derecho de retener los embalajes hasta que el pago se haya efectuado en su totalidad.

[E18] Q: ¿Puedo ver la etiqueta Priority? ¿Cómo es la etiqueta de embalaje?
A: Aquí puede ver las etiquetas oficiales según el tipo de servicio contratado. IMAGEN:etiqueta_priority

[E19] Q: ¿Cómo es la etiqueta Fullgood?
A: La etiqueta Fullgood identifica mercadería con valor. IMAGEN:etiqueta_fullgood

[E20] Q: ¿Cómo es la etiqueta Empty?
A: La etiqueta Empty identifica embalajes vacíos. IMAGEN:etiqueta_empty

[P21] Q: ¿Qué es el servicio de reposicionamiento?
A: Es un servicio que permite el movimiento y reposicionamiento de material dentro de la fira según sus necesidades.

[P22] Q: ¿Cómo contrato el reposicionamiento?
A: El servicio de reposicionamiento se contrata desde la oficina. Contacte indicando el material a reposicionar y la ubicación deseada.

[P23] Q: ¿Qué es un número de booking o referencia?
A: Es el identificador único de su servicio de descarga/carga que utiliza para hacer seguimiento y modificaciones de su reserva.

[P24] Q: ¿Cómo hago seguimiento de mi servicio?
A: Puede utilizar su número de referencia o booking. Contacte con nosotros con este número para consultar el estado.

[P25] Q: ¿Necesito un booking para cada servicio?
A: Sí, cada servicio de descarga/carga será identificado con un número de referencia único que recibirá al confirmar su reserva.

[P26] Q: ¿Qué información debo proporcionar al contratar?
A: Debe indicar: evento específico, nombre de empresa/expositor, montador responsable (si aplica), pabellón, número de stand, día y hora deseados, y tipo de servicio requerido.

[P27] Q: ¿Cuál es el proceso de contratación?
A: 1) Envíe un correo con los detalles, 2) Reciba confirmación con número de referencia/booking, 3) El servicio se realiza en la fecha y hora confirmadas, 4) Para almacenaje: firma en oficina y entrega de etiquetas.

[P28] Q: ¿Cuánto tiempo antes debo contactar?
A: Descarga/carga: con la anticipación que considere necesaria. Maquinaria: 48 horas antes (excepto viernes hasta 10 AM para lunes). Almacenaje: según disponibilidad.

[P29] Q: ¿Cuál es el horario de atención de logística?
A: Nuestras oficinas funcionan durante los horarios de la fira. Para horarios específicos, consulte con las oficinas de Hall Manager en cada pabellón.

[P30] Q: ¿Dónde están ubicadas las oficinas?
A: Oficina Central (maquinaria sin conductor): Puerta 3.01. Hall 1: Puerta 1.01, Hall 2: Puerta 2.19, Hall 3: Puerta 3.14, Hall 4: Puerta 4.8, Hall 5: Puerta 5.8.

[P31] Q: ¿Puedo solicitar maquinaria para el lunes pidiendo el viernes?
A: Sí, excepcionalmente. Si realiza su pedido el viernes hasta las 10:00 AM, puede solicitar un servicio de maquinaria para el lunes.

[P32] Q: ¿Qué pasa si necesito cambiar mi servicio de última hora?
A: Las modificaciones requieren 24 a 48 horas de anticipación. Si necesita cambios de última hora que requieren permisos especiales (Early/Late Buildup), no será posible sin autorización previa de Fira de Barcelona.

[P33] Q: ¿Puedo solicitar horarios atípicos?
A: Sí, pero debe confirmarse primero con Fira de Barcelona si se puede trabajar en ese horario y si hay disponibilidad de logística.

[P34] Q: ¿Qué tipos de maquinaria están disponibles?
A: Contamos con maquinaria variada para transporte y movimiento de carga. Para detalles específicos de equipos disponibles, consulte directamente con nuestras oficinas.

[P35] Q: ¿Hay costos adicionales por horarios especiales?
A: Los horarios especiales (Early/Late Buildup u otros fuera del rango 8-20h) pueden tener costos adicionales. Confirme con Fira de Barcelona y solicite presupuesto.

[P36] Q: ¿Mi mercadería está asegurada en el almacenaje?
A: Sí, todos los servicios de almacenaje incluyen seguro de reposición por rotura o pérdida, acorde al tipo de servicio contratado.

[P37] Q: ¿Qué pasa si mi material se daña en el almacenaje?
A: El seguro de reposición cubre daños según las condiciones del servicio de embalaje contratado.

[P38] Q: ¿Puedo retirar mi material antes de lo previsto?
A: Sí, puede contactar con la oficina para solicitar la devolución anticipada de su material almacenado.

[P39] Q: ¿Necesito estar presente para la descarga/carga?
A: Se recomienda que esté presente o designe a un representante para supervisar el proceso.

[P40] Q: ¿Qué documentación necesito para contratar servicios?
A: Principalmente necesita número de expositor/stand, empresa/montador responsable y confirmación de evento. Se firma documentación adicional en la oficina para almacenaje.

[M1] Q: ¿Qué es un apilador? ¿Tienen apiladores? ¿Para qué sirve un apilador?
A: Sí, ofrecemos alquiler de apiladores. Son aptos para cualquier trayecto de transporte y altura de elevación. Con su chasis estrecho son ágiles y capaces de manipular la carga con especial precisión. Ideales para espacios reducidos en los pabellones. IMAGEN:apilador

[M2] Q: ¿Qué maquinaria tienen disponible? ¿Qué equipos puedo alquilar?
A: Disponemos de apiladores y forklifts (toros), entre otros equipos. Solicite información en la Oficina Central (Puerta 3.01) o en el Hall Manager de su pabellón. Puede pedirla con o sin conductor. IMAGEN:apilador

[M3] Q: ¿Tienen forklift? ¿Tienen toro? ¿Qué es un toro? ¿Tienen carretilla elevadora?
A: Sí, ofrecemos alquiler de forklifts (toros/carretillas elevadoras). Son equipos robustos ideales para mover y elevar cargas pesadas dentro de los pabellones. Disponibles con conductor. Solicite en el Hall Manager de su pabellón. IMAGEN:forklift

[M5] Q: ¿Tienen tijera? ¿Tienen plataforma tijera? ¿Qué es una tijera elevadora?
A: Sí, disponemos de plataformas tijera. Son ideales para trabajos en altura dentro de los pabellones, con una plataforma estable y segura para el operario. Solicite en la Oficina Central (Puerta 3.01) o en el Hall Manager. IMAGEN:tijera

[M6] Q: ¿Tienen plataforma unipersonal? ¿Tienen mástil vertical?
A: Sí, ofrecemos plataformas unipersonales (mástil vertical). Perfectas para trabajos en altura en espacios reducidos, ideales para una sola persona. Solicite en la Oficina Central (Puerta 3.01) o en el Hall Manager. IMAGEN:unipersonal

[M7] Q: ¿Tienen elevadora de estructura? ¿Tienen eleva estructura?
A: Sí, disponemos de elevaestruct­uras. Equipo especializado para elevar y posicionar estructuras y materiales pesados con precisión. Solicite en la Oficina Central (Puerta 3.01) o en el Hall Manager. IMAGEN:eleva_estructura

[M8] Q: ¿Tienen brazo articulado? ¿Tienen pluma articulada?
A: Sí, contamos con brazos articulados. Ideales para trabajos en altura con obstáculos, permiten alcanzar zonas de difícil acceso dentro de los pabellones. Solicite en la Oficina Central (Puerta 3.01) o en el Hall Manager. IMAGEN:brazo_articulado

[M2] Q: ¿Qué maquinaria tienen disponible? ¿Qué equipos puedo alquilar? ¿Qué máquinas tienen?
A: Disponemos de: apiladores, forklifts (toros), transpaletas eléctricas, plataformas tijera, plataformas unipersonales, elevaestruct­uras y brazos articulados. Con o sin conductor. Solicite en la Oficina Central (Puerta 3.01) o en el Hall Manager. IMAGEN:apilador IMAGEN:forklift IMAGEN:transpaleta IMAGEN:tijera IMAGEN:unipersonal IMAGEN:eleva_estructura IMAGEN:brazo_articulado
`;

  const systemPrompt = `You are a logistics assistant for Fira de Barcelona named "${botName || 'Asistente Logístico'}".

CRITICAL LANGUAGE RULE: Detect the language of the user's message and ALWAYS respond in that EXACT same language. If they write in English → respond in English. Spanish → Spanish. Catalan → Catalan. French → French. And so on.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}

RULES:
- Answer ONLY based on the knowledge base above.
- Match the user's language perfectly.
- If no relevant answer found, politely say so in the user's language and suggest they contact Resa Logistic at Puerta 3.01, call 932 64 24 40 or email logistics@rxl.es.
- Do not invent information outside the knowledge base.
- Be VERY concise. Maximum 3-4 sentences. No long lists unless essential. Go straight to the point, no preambles.
- Tone: ${persona || 'Warm, professional and helpful.'}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 350,
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
