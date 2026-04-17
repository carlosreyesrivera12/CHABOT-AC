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

  // ── EXHIBITOR LOOKUP ─────────────────────────────────────────────
  const EXHIBITORS = [
    ["3M SEAFOOD SA","5M601"],["5DO - Cinq Degres Ouest","3D601"],["60BØ FISH COMPANY","2G401"],
    ["A BATEEIRA","4D301"],["A PULPEIRA","4D301"],["AA Lobster Canada","3A601"],
    ["Abad Fisheries","3J601"],["ABALIFISH","2B701"],["ABB AS","3FF601"],
    ["ABIPESCA","1F800"],["Abo El Seed","1E911"],["Abrolhos Octopus","GB305"],
    ["AC Live Lobster","3A601"],["Adamas Caviar","5I401"],["ADEN GULF FISHERIES","2A600"],
    ["Affish BV","2J700"],["Agraya GmbH","2K701"],["Agriculture Agri-Food Canada","3B801"],
    ["Ahumados Domínguez","2G701"],["AKVA group","1C603"],["Alaska Seafood Marketing Institute","5B201"],
    ["Alaskan Leader Seafoods","5C400"],["Alfocan","2K401"],["Alimex Seafoods","2I100"],
    ["ALKORTA FOOD SOLUTIONS","4G301"],["Aller Aqua","3DD201"],["Allied Pacific Food","5K601"],
    ["Alltech Coppens","3NN903"],["Alltech Fennoaqua","3NN903"],["Aloia","5J201"],
    ["Altonaer Kaviar","3G901"],["Amacore","2J200"],["American Albacore Fishing Association","5D201"],
    ["American Seafoods Group","5B301"],["Amiets Seafood","3B601"],["Andfjord Salmon","5G501"],
    ["Andreas Bjorge Seafood","2F401"],["ANFACO","4E401"],["Angulas Aguinaga","3N700"],
    ["AnT Seafood","3G201"],["Anova Seafood","2J700"],["Antonius Caviar","4F401"],
    ["Aquabyte","3FF601"],["AquaBioTech","1G602"],["AquaChile","3G801"],
    ["ASC Aquaculture Stewardship Council","4A401"],["AQUAGOLD","5C601"],["AquaPri","2F700"],
    ["Aquatiq","3EE806"],["Aquatir","5L203"],["Aquimer","3D601"],
    ["Arctic Crab","4H401"],["Arctic Seafood","2E501"],["Arctic Storm Management","5C401"],
    ["Ardora Foods","4E401"],["Argafish","4D401"],["Arnarlax","1A701"],
    ["Asahi Trading","4E501"],["Atlantic Conserves","2B501"],["Atlantic Dawn Group","3F100"],
    ["Atlantic Shrimpers","3G601"],["Atlantika International","1G701"],["Atlas Food","2G301"],
    ["Australian Trade Investment Commission","GB305"],["Austral Fisheries","GB305"],
    ["Azerbaijan Fish Farm Baku Caviar","4C101"],["Azzopardi Fisheries Malta","1H701"],
    ["B&M Foods Aquamar","2H401"],["BAADER","3JJ601"],["Bakkafrost","2H201"],
    ["Balfego","5H501"],["Balzo","3HH801"],["BAL-PI Gida","4H607"],
    ["Bangladesh Export Promotion Bureau","3M401"],["Barry Group","3A601"],
    ["BARRUFET","2G501"],["BARRUFET SEAFOOD","2H501"],["Beck Pack Systems","3EE401"],
    ["BEL FISH","4H505"],["Bellapesca Europa","1G700"],["Bergen Salmon","2E501"],
    ["Best Aquaculture Practices","4C300"],["BG Salmon","2F700"],["BioMar","3EE201"],
    ["Blaest Portugal","4C501"],["Blanchet","3C801"],["Blu Arctic","2B201"],
    ["Blue Bay Seafood","4B601"],["Blue Water Shipping","3EE401"],["Bluefin Seafood Export","GA301"],
    ["Blumar","2G100"],["Bluewild","3M601"],["Bolidt","3JJ501"],["BONFRIG","3M601"],
    ["Bord Bia Irish Food Board","3E201"],["Br. Karlsen","2F501"],["Brim","3D201"],
    ["Bristol Bay Regional Seafood","5C401"],["Bristol Wave Seafoods","5B201"],
    ["Brødrene Sperre","2F501"],["Business France","3D801"],["Business Iceland","3B201"],
    ["C & N Chambers Seafood","2I601"],["Cabinplant","3EE401"],["Cabo Virgenes","5E701"],
    ["Cabomar Congelados","5I501"],["Camanchaca","4D601"],["Canastra Fishing","5E401"],
    ["Canfisco Group","5C400"],["Capefish","1H801"],["Carsoe","3FF401"],
    ["Catalina Food Solutions","1H908"],["Caviar de Beluga","2A101"],["Caviar De Neuvic","3D601"],
    ["Caviar Giaveri","5I401"],["Caviar Pirinea","4G601"],["Caviar Riofrio","2G401"],
    ["CEAEXPORT","5B601"],["Centomar","5E701"],["Cermaq","2F200"],
    ["Certified Seafood International CSI","5C400"],["Clearwater Seafoods","3A801"],
    ["CMA CGM","3KK601"],["CNFC OVERSEAS FISHERIES","4F601"],["Coast Seafood","1E801"],
    ["Coastal Alaska Premier Seafoods","5C401"],["Congalsa","5F501"],
    ["Conservas Ortiz","4G301"],["Cooke","3F201"],["Coomarpes","5E701"],
    ["Copemar","4H501"],["Cornelis Vrolijk","3G601"],["Cosmofish","2J301"],
    ["Croatian Chamber of Economy","2E701"],["Cromaris","2E701"],["Culmarex","3F201"],
    ["Cultimer France","3C801"],["Dardanel","5G401"],["DanFish International","3EE401"],
    ["Danish Export Association Denmark","3BB300"],["Dayseaday Group","3G400"],
    ["Delfin Ultracongelados","3G700"],["Dengso","2F301"],["Denholm Seafoods","2I601"],
    ["Deutsche See","3F801"],["Devi Fisheries","1F900"],["DFDS Logistics","3II501"],
    ["DGM Shipping","2J401"],["Dhofar Fisheries","4G501"],["Direct Ocean FRESHPACK","2J601"],
    ["Directfish","4E301"],["DNB Bank","2F501"],["DNV","2B104"],["DP World","1D407"],
    ["DSI Dantech","3FF401"],["Dutch Fish Marketing Board","3H201"],
    ["Eastern Fisheries","5E401"],["EASYFISH","2H501"],["ECOLAB","1F600"],
    ["ECUADOR FIRST CLASS SHRIMP","5A601"],["ECUAMARISCO","5C501"],
    ["Egypt Fish Food Industries","1I603"],["Eide Seafood","5M303"],["Eimskip","3BB401"],
    ["Empacadora Bilbo","4F703"],["Engelsviken Canning Denmark","2B301"],
    ["Enniberg","2G201"],["Ervik Seafood","2E401"],["Espersen","2H301"],
    ["ESS-Food","2I100"],["Estonian Association of Fishery","2J401"],
    ["EUMOFA European Commission","4D705"],["Eurobelt","3NN501"],
    ["Eurocaviar","2G401"],["Eurofish International","2A203"],["Eurofish Trading","4F701"],
    ["Europacifico","2F301"],["EUROPEIX","2G501"],["EUSKADI BASQUE COUNTRY","4G301"],
    ["Everest Seafoods","3I801"],["EXPALSA","5B501"],["Export Packers","3A801"],
    ["FAO GLOBEFISH","4C700"],["Faroe Islands","2H100"],["Fastnet Fish","4D501"],
    ["Fandicosta","3M601"],["FENIP","2B501"],["Finnforel","2A401"],
    ["Firda Seafood","2E401"],["First Seafood","2E401"],["Fish Scale GmbH","3BB801"],
    ["Fisheries Development Authority Malaysia","4H300"],
    ["Fisherman's Choice","2H701"],["Fiskano","3G201"],["Fjord Import","3D801"],
    ["Fomaco","3KK701"],["Food Export USA Northeast","5E401"],["Food From Denmark","2F700"],
    ["FRINSA","1D701"],["Friosur","4A501"],["Froxa","4E600"],["Froya Salmon","2E401"],
    ["Gadre Marine Export","3I601"],["Galana Seafood","4C203"],["Galaxidi Marine Farm","2I301"],
    ["GEA Food Solutions","1E603"],["Gelpeixe","4C501"],["Gillardeau","3B601"],
    ["Glacier Fish Company","5C401"],["Glenmar Shellfish","3E201"],
    ["Global Dialogue Seafood Traceability","3F601"],["Global Fish","2F401"],
    ["Globalimar Europa","2H501"],["Globe Fisheries","3M401"],["Gloria Maris","3D601"],
    ["Godaco Seafood","2D201"],["GOLDEN OCEAN SEAFOOD","4B501"],
    ["Golden Seabreeze","3G901"],["Government Newfoundland Labrador","3A601"],
    ["Gozoki Frais","4G601"],["Graal","3E901"],["Grieg Seafood","2F701"],
    ["Grobest Seafood","2C203"],["Groupe Aqualande","3C801"],["Groupe Barba","3B601"],
    ["GRUP ROS FRESKIBO","2G501"],["Grupo Arbumasa","5E701"],["Grupo Profand","3K801"],
    ["GRUPO RICARDO FUENTES","4G401"],["GRUPO ROMAN Y MARTOS","4D201"],
    ["Gumusdoga Seafood","3NN602"],["Guy Cotten","3KK201"],["Haarslev Industries","3FF401"],
    ["HAROPA PORT","1D406"],["Haspac Tuna","1I800"],["Havida","5G501"],
    ["Hedinn","3BB201"],["Heiploeg International","3F801"],
    ["Hellenic Aquaculture Producers HAPO","2I301"],["HERMASA CANNING TECHNOLOGY","3LL801"],
    ["Hiddenfjord","2G201"],["Hilton Foods Seafood","2I601"],
    ["Hinojosa Packaging","3EE801"],["HitraMat","1H801"],["Hofseth International","2A501"],
    ["Hottlet Frozen Foods","4C302"],["Huitres Cadoret","3D601"],["Huitres Helie","3B601"],
    ["Huitres Mauger","3C801"],["IASA","5I401"],
    ["IBERCONSA","3L601"],["Ice Fish","2F401"],["Ice Fresh Seafood","4B401"],
    ["Iceberg Seafood","2G301"],["ICECO Fish","2F103"],["Iceland Pelagic","3B201"],
    ["Iceland Seafood International","2G701"],["Icelandic Export Center","3B201"],
    ["Icy Strait Seafoods","5B301"],["Import Promotion Desk","5L200"],
    ["Independent Fisheries","2F301"],["Innovation Norway","3GG601"],
    ["Intralox","3LL400"],["Invermar","3M901"],
    ["ISPG Irish Seafood Producers Group","3D401"],
    ["Japan Farmed Fish Export Association","1E703"],
    ["JBT Marel","3DD401"],["Marel","3DD401"],
    ["Jetro Japan External Trade Organization","4E501"],
    ["JFK","2G201"],["JK Thomson","2F601"],["Junifish","2G401"],
    ["JUNTA DE ANDALUCÍA","4F201"],["KALUGA QUEEN CAVIAR","3K401"],
    ["Kangamiut Seafood","2I701"],["KAPP","3BB401"],["Karavela","1G701"],
    ["Kefalonia Fisheries","2I301"],["Keohane Seafood","3D401"],
    ["Killybegs Seafoods","3D401"],["Klaas Puul Sykes Seafood","4A201"],
    ["Kofradia Basque Seafood","4G301"],["Koral","2K600"],
    ["Krijn Verwijs Yerseke Premier","3G401"],["Krustagroup Effegi","5E501"],
    ["Kvarøy Salmon","5G501"],["Laeso Fish","2I701"],["Laesø Fiskeindustri","2I701"],
    ["Lagoon Seafood Products","3A801"],["Lake Bounty","5H601"],["Landes","4A501"],
    ["Lanzal Productos del Mar","3M501"],["Leroy Seafood Group","2G601"],
    ["Les Conserveries Marocaines","2B501"],["Lineage","3II800"],
    ["Lisner Poznań","3E901"],["Loch Duart Salmon","2F601"],["Lofoten Biomarine","2F401"],
    ["Lofoten Viking","2F401"],["Louisbourg Seafoods","3A601"],["Lund's Fisheries","5D401"],
    ["Macduff Shellfish","2H601"],["Madagascar Seafood","3B601"],["Maersk","3DD701"],
    ["Makivvik","3B801"],["Maldives Fisheries","4H500"],["Marel","3DD401"],
    ["Marine Stewardship Council MSC","4A401"],["Marz Seafood","2H301"],
    ["Mascato","5J501"],["Måsøval","2E500"],["Mathias Bjorge","2F501"],
    ["Matorka","3B201"],["MerAlliance","3D801"],["MERCABARNA","2H501"],
    ["Mersey Seafoods","3A801"],
    ["Ministerio de Agricultura Pesca Alimentación MAPA","2G401"],
    ["Ministry Agriculture Poland","4F401"],["Minh Phu Seafood","4B501"],
    ["MMC First Process","3BB700"],["Morubel","3F201"],
    ["Morocco FoodEx EACCE","2B401"],["Mowi ASA","3B401"],["Mowi Belgium","3B401"],
    ["Mowi Consumer Products UK","3B401"],["Mowi France","3B401"],
    ["Mowi Germany","3B401"],["Mowi Iberia","3B401"],["Mowi Markets Norway","3B401"],
    ["Mowi Poland","3B401"],["MSC Mediterranean Shipping Company","3HH601"],
    ["Multi X","3I401"],["MULTIVAC","3DD601"],["MUSHOLM","2D301"],
    ["NAM VIET NAVICO","4B501"],["National Aquaculture Group NAQUA","4B201"],
    ["National Seafood Industries","3M401"],["NCEL","3J801"],
    ["Neerlandia Urk","3G401"],["Nergård","2F401"],["Nergård Seafood","2F401"],
    ["New Brunswick Canada","3A601"],["Nissui Europe","2F301"],["NIRSA","5C501"],
    ["Nordian Group","2K503"],["Nordic Kingfish","1B800"],["Nordic Seafood","2F301"],
    ["Nordlaks Sales","5G501"],["Norfish","3D401"],["Normarine","2F401"],
    ["Norsk Sjømat","2F401"],["North Atlantic Seafood","2I701"],
    ["Norwegian Seafood Council","2F501"],["Norwegian Seafood Group","2H701"],
    ["Norwegian Seafood Company","2E401"],["Nova Scotia Seafood","3A601"],
    ["Nova Sea","2F401"],["Nowaco","2D200"],["NUEVA PESCANOVA","3F601"],
    ["Pescanova","3F601"],["Nutrisco","3I900"],["O'Hara Corporation","5C401"],
    ["Ocean Choice International","3A801"],["Ocean Fish","2J700"],
    ["Ocean Fresh Seafood","3A801"],["Ocean Master Foods","3B801"],
    ["OctoFrost","3MM802"],["Olano","3CC801"],["Oman Seafood Pavilion","4G501"],
    ["Omega Trading International","3B601"],["Omnifish","4C501"],
    ["Open Seas","2J200"],["Optimar","3AA900"],["ORPAGU","4E301"],
    ["Pacific Seafood Group","5B301"],["Pacific West Foods International","1D801"],
    ["Palinox","3GG501"],["Panama Seafood Group","5H701"],["Panapesca","4B301"],
    ["Parlevliet Van der Plas","3F801"],["Paula Fish","2F101"],
    ["PEI Mussel King","3A601"],["Pelagia","2D300"],["Pelagos","2H100"],
    ["Penver Products","3J601"],["Pereira","5K501"],["Pescapuerta","3N500"],
    ["Pescados Barandica","2G401"],["Pescafacil","4C701"],["Pescaviar","2G401"],
    ["Pesquera Exalmar","5D501"],["Petaca Chico","3I201"],["Peterhead Port Authority","2I601"],
    ["Philosofish","2I301"],["Phoenix Processor","2I501"],["Phoenix Seafood","2F700"],
    ["Pickenpack Seafoods","5G600"],["Pisces Fish Machinery","3II401"],
    ["Platvis Holland","5M605"],["Polish Association Fish Processors","4F401"],
    ["Polar Seafood Denmark","2G301"],["Polanco Caviar","4H400"],
    ["Polar Quality","5G501"],["Polar Salmon","2G301"],
    ["Pompon Rouge","3F801"],["Port Boulogne Calais","3D601"],["PORTO-MUIÑOS","4D401"],
    ["Premier Pacific Seafoods","2I501"],["Prince Edward Island","3A601"],
    ["PRINCES LIMITED","1G901"],["Pro Fish Finland","2A401"],
    ["Proanco Comex Andina","5D501"],["Proconcept","3JJ800"],
    ["Productos del Mar Ventisqueros","4F600"],["PromArgentina","5E601"],
    ["Promperu","5D601"],["Quality Seafood Source","3B801"],
    ["Rainbow Seafood","2G201"],["Red's Best","5E401"],
    ["Région Hauts-de-France","3D601"],["REICH Thermoprozesstechnik","3MM702"],
    ["Resko CLEAN LABEL SEAFOOD","4F401"],["Riberalves","4C501"],
    ["RICH MARINE FISHERY GROUP","5E701"],["Rivamar","3N800"],
    ["Rockabill Seafood","3E201"],["Rooney Fish","2K601"],
    ["Royal Greenland","2F201"],["Royal Iceland","3B201"],["Royal Nordic","1G701"],
    ["Runi","3EE401"],["Rupsha Fish","3I801"],
    ["Saeplast Iceland","3LL601"],["SAGAR AQUACULTURE","1F601"],
    ["Salica Industria Alimentaria","5G301"],["SalMar","1A701"],
    ["Salmon Evolution","2E501"],["Salmones Aysen","4A501"],
    ["Samherji","4B401"],["Samskip","3BB401"],["SARDINA","2E701"],
    ["SBH Marine Industries","4H603"],["ScanBelt","3DD201"],
    ["Scandic Pelagic","2G301"],["Scanfisk Seafood","5I200"],
    ["Scansea","2F700"],["Scanvaegt Systems","3NN601"],
    ["Schur Star Systems","3DD801"],["Scottish Development International","2F601"],
    ["Scottish Fishermen's Organisation","2H601"],["Scottish Sea Farms","2F601"],
    ["Scottish Shellfish","2F601"],["Sea Harvest Corporation","5E400"],
    ["Sea Pride","4G501"],["Seafarers Inc","5D301"],
    ["Seafood Expo Global","GA400"],["Seafoodia","3D801"],
    ["Sealord Group","2F301"],["SEALPAC","3LL200"],
    ["Sekkingstad","2E501"],["Semi-Staal","3EE201"],
    ["SGS","1E407"],["Síldarvinnslan","4B401"],
    ["Silver Bay Seafoods","5C401"],["Silver Sea Food","3J601"],
    ["Sirena Group","2G301"],["Sjór","1F701"],["Skaar Norway","2F501"],
    ["Skagen Salmon","2I100"],["Slippurinn DNG","3AA900"],
    ["SN Seafood","2I701"],["Sogelco International","3A801"],
    ["South Pacific Fish","5J200"],["SUSTA Southern United States Trade","5D301"],
    ["St. Andrews","2G100"],["St. James Smokehouse Scotland","2F601"],
    ["Stalam","3GG800"],["STAPIMEX","4G700"],["STEF","3CC801"],
    ["Sterling Halibut","2F501"],["Stolt Sea Farm Neptura","3G701"],
    ["Stord Process","3NN402"],["Stratos","2J301"],["Suempol","2K700"],
    ["Sykes Seafood","4A201"],["Talleys Group","5D701"],["Tassal","3F201"],
    ["The Good Fish Company","3E201"],["The Kingfish Company","3F401"],
    ["The Lobster Pot","2I601"],["The Town Dock","5D401"],
    ["Thistle Seafoods","2F601"],["Thyboron Trawldoor","3FF201"],
    ["Tidal Wave","5H601"],["Torcargo","3BB201"],
    ["Trade Invest British Columbia","3B801"],["Trident Seafoods","5B301"],
    ["Trikalinos Bottarga","2I201"],["Trinity Seafoods","2H601"],["Triton ehf","3B201"],
    ["Ubago Group Mare","4E502"],["ULMA Packaging","3EE601"],
    ["Umios Food Europe","2I501"],["Unimer","2C501"],
    ["United Kingdom Group","2I601"],["Urk Export","3G400"],
    ["USDA Foreign Agriculture Service","5D201"],["Van de Velde Packaging","1F500"],
    ["Varde Laks","2K603"],["Vega Salmon","1E801"],["Velec Systems","3JJ903"],
    ["Vendée Concept","3II801"],["Vensy España","4F201"],
    ["Venture Seafoods","2I601"],["Viciunai Group","3A401"],
    ["Victoria Co-operative Fisheries","3A601"],["Viking Market","2I401"],
    ["Vikomar","2F501"],["Vild Seafood","2F501"],["Villa Seafood","2E501"],
    ["Vinh Hoan Corporation","3M800"],["Visir hf","4B401"],["VSV Seafood Iceland","3B201"],
    ["Weber Machinery","3FF401"],["Welsh Government","2I601"],
    ["Welsh Seafood Cluster","2I601"],["West Fish Canada","3A601"],
    ["Westmorland Fisheries","3A601"],["Westward Seafoods","2I501"],
    ["Wild Alaska Salmon","5C400"],["Wikifarmer Spain","4H301"],
    ["Wisefish","3BB401"],["Worldwide Fishing Company","3M601"],
    ["Yanmar Europe","3II902"],["Yumbah Aquaculture","GB305"],
    ["Zalmhuys Group","2J700"],["Zoneco Group","3J401"],
    ["Zwan W. van der Zn. B.V.","3H401"],
  ];

  // Search exhibitors if question seems related
  const msgLower = message.toLowerCase();
  const cleanMsg = msgLower.replace(/[¿?]/g,'').replace(/stand|expositor|booth|donde|está|esta|hall|número|numero|cliente|empresa|busco|find|where|cherche|suche/gi,'').trim();
  const words = cleanMsg.split(/\s+/).filter(w => w.length > 2);
  
  if (words.length > 0 && msgLower.match(/stand|expositor|booth|donde.*empresa|cliente.*seafood|empresa.*stand|marel|mowi|baader|clearwater|cermaq|salmar|grieg|leroy|trident|nueva pescanova|pescanova|royal greenland|viciunai|congalsa|angulas|iberconsa/)) {
    const matches = EXHIBITORS.filter(([name]) => {
      const n = name.toLowerCase();
      return words.some(w => w.length > 2 && n.includes(w));
    }).slice(0, 5);

    if (matches.length > 0) {
      const results = matches.map(([name, stand]) =>
        `<strong>${name}</strong> → Stand <strong>${stand}</strong>`
      ).join('<br>');
      return res.status(200).json({
        reply: `📋 Encontrado en Seafood Expo Global 2026:<br><br>${results}<br><br>📍 Fira Barcelona Gran Via · 21-23 abril 2026`
      });
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
