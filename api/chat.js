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
