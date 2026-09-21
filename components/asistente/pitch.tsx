const ESTADISTICAS = [
  {
    valor: "98%",
    titulo: "Son PyMEs",
    texto:
      "El 98% de las empresas registradas en Argentina son PyMEs (515.599 firmas); las micro conforman la base más vulnerable y con menor margen operativo.",
  },
  {
    valor: "53,84%",
    titulo: "Se sienten desbordados",
    texto:
      "Emprendedores superados por la avalancha de chats y notificaciones en sus pantallas (estudio Dávila 2026).",
  },
  {
    valor: "75,83%",
    titulo: "Dificultad para rastrear pagos",
    texto:
      "Pierden entre 2 y 3 minutos por pedido revisando el homebanking para conciliar transferencias y evitar fraudes.",
  },
  {
    valor: "65,93%",
    titulo: "Errores de empaque",
    texto:
      "Talle, color o modelo equivocado generan logística inversa que absorbe hasta el 15% del margen de ganancia.",
  },
  {
    valor: "61,54%",
    titulo: "Quiebres de stock virtuales",
    texto: "Venden por chat un artículo que ya se agotó, con el reclamo y el costo que eso implica.",
  },
  {
    valor: "70,33%",
    titulo: "Softwares caros",
    texto:
      "Consideran que el costo mensual de los softwares de gestión tradicionales es un freno financiero insostenible.",
  },
];

const COMPETENCIA = [
  {
    alternativa: "Cuadernos y Excel",
    como: "Registro analógico en papel o planillas sueltas.",
    brecha:
      "Exige reescritura manual, se rompen fórmulas, no actualiza stock en tiempo real y no envía alertas.",
  },
  {
    alternativa: "CRMs de WhatsApp (Kommo, Leadsales, ManyChat)",
    como: "Módulos de mensajería masiva y chatbots comerciales.",
    brecha:
      "Diseñados para equipos con varios vendedores; son costosos en dólares y no arman listas de empaque ni concilian pagos.",
  },
  {
    alternativa: "E-Commerce Tradicional (Tiendanube, Shopify)",
    como: "Tiendas con carrito de compras web.",
    brecha:
      "Obliga al comprador a navegar una web externa; el 79,2% del micro-sector depende exclusivamente de la venta conversacional por chat.",
  },
  {
    alternativa: "Sistemas POS (MiNegocio, Software Comercial)",
    como: "Puntos de venta con lector de código de barras.",
    brecha:
      "Pensados para mostradores de locales físicos con computadora, no para la venta desde el smartphone.",
  },
];

const MVP_PANEL = [
  ["📦", "Pedidos", "La IA identifica cliente, producto, cantidad, precio, pago y entrega."],
  ["💰", "Pagos pendientes", "Distingue pagos realizados y pendientes de cobro."],
  ["📋", "Tareas", "Convierte la información en tareas y recordatorios."],
  ["🚚", "Entregas", "Retiros y envíos a coordinar en una sola lista."],
];

export function Pitch() {
  return (
    <div className="mt-16 space-y-12">
      <Hipotesis />
      <Respaldo />
      <Diagnostico />
      <Problema />
      <Publico />
      <Competencia />
      <Proyecto />
      <Mvp />
      <Propuesta />
    </div>
  );
}

function SectionTitle({ kicker, children }: { kicker: string; children: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-500">{kicker}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{children}</h2>
    </div>
  );
}

function Hipotesis() {
  return (
    <section>
      <SectionTitle kicker="El punto de partida">Hipótesis</SectionTitle>
      <blockquote className="rounded-2xl border-l-4 border-violet-400 bg-violet-50 px-5 py-4 text-slate-700">
        Creemos que los microemprendedores que gestionan solos su negocio sufren desorganización y
        pérdida de tiempo al coordinar pedidos, cobros, entregas y tareas cuando aumentan sus ventas, y
        actualmente lo resuelven combinando WhatsApp, notas, calendarios y herramientas separadas, que
        fallan porque la información queda dispersa.
      </blockquote>
      <p className="mt-3 text-sm text-slate-600">
        Sabremos que acertamos si una proporción significativa de emprendedores entrevistados reporta
        este problema como una dificultad frecuente y está dispuesta a probar una herramienta que
        centralice y automatice estas tareas.
      </p>
    </section>
  );
}

function Respaldo() {
  return (
    <section>
      <SectionTitle kicker="Datos del mercado">Respaldo estadístico</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ESTADISTICAS.map((s) => (
          <div key={s.titulo} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-violet-600">{s.valor}</p>
            <p className="mt-1 font-semibold text-slate-900">{s.titulo}</p>
            <p className="mt-1 text-sm text-slate-500">{s.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Diagnostico() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <SectionTitle kicker="Cuándo aparece el dolor">Diagnóstico</SectionTitle>
      <p className="text-slate-700">
        El dolor operativo no aparece cuando el negocio nace, sino cuando las ventas comienzan a escalar
        de forma recurrente sin un cambio en la estructura de gestión. Gestionar con libretas de papel o
        Excel y WhatsApp personal funciona para volúmenes bajos.
      </p>
      <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        El <strong>colapso operativo</strong> ocurre en la transición de emprendedor inicial a
        microemprendedor con ventas recurrentes: la persona intenta suplir la falta de herramientas con
        esfuerzo físico y horas de descanso, convirtiéndose en un{" "}
        <strong className="text-violet-700">“gestor de crisis”</strong>.
      </p>
    </section>
  );
}

function Problema() {
  return (
    <section>
      <SectionTitle kicker="Problema / necesidad real">La transaccionalidad fragmentada</SectionTitle>
      <p className="text-slate-700">
        El problema central no es la falta de ventas, sino la{" "}
        <strong>“transaccionalidad fragmentada”</strong> y la saturación de tareas operativas post-venta.
      </p>
      <ul className="mt-4 space-y-3">
        {[
          {
            t: "Información atrapada en chats",
            d: "Los datos de un pedido (producto, variante, dirección, comprobante) viven dispersos en conversaciones de WhatsApp o historias de Instagram.",
          },
          {
            t: "Trabajo de “arqueología corporativa”",
            d: "El emprendedor copia manualmente los datos del chat a un cuaderno o Excel, verifica el pago en la app bancaria y arma la etiqueta de envío a mano.",
          },
          {
            t: "Punto de quiebre operativo",
            d: "WhatsApp y Excel son viables para menos de 10 pedidos al mes; al superar los 10 a 30 pedidos semanales, el esquema colapsa y el dueño canibaliza sus horas de descanso.",
          },
        ].map((item) => (
          <li key={item.t} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
              !
            </span>
            <div>
              <p className="font-semibold text-slate-900">{item.t}</p>
              <p className="text-sm text-slate-500">{item.d}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Publico() {
  return (
    <section>
      <SectionTitle kicker="Segmentación exacta">Público objetivo</SectionTitle>
      <p className="text-slate-700">
        Se descarta la categoría genérica “PYMEs” y se segmenta estrictamente al{" "}
        <strong>Microemprendedor en Solitario con Ventas Recurrentes</strong>.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          {
            t: "Perfil",
            d: "Emprendedores que gestionan el negocio solos o con ayuda familiar informal desde su hogar o showroom.",
          },
          {
            t: "Volumen",
            d: "Procesan de 10 a más de 50 pedidos mensuales recibidos por WhatsApp o Instagram.",
          },
          {
            t: "Método de cobro",
            d: "Cobran mediante transferencias bancarias, billeteras virtuales o efectivo.",
          },
          {
            t: "Herramientas",
            d: "No usan ni pueden pagar ERPs corporativos; su “sistema operativo” es el teléfono personal, WhatsApp y anotaciones manuales.",
          },
        ].map((c) => (
          <li key={c.t} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-violet-700">{c.t}</p>
            <p className="mt-1 text-sm text-slate-600">{c.d}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Competencia() {
  return (
    <section>
      <SectionTitle kicker="Mercado y competencia">
        ¿Qué usa hoy el microemprendedor y por qué falla?
      </SectionTitle>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Alternativa en el mercado</th>
              <th className="px-4 py-3 font-semibold">Cómo opera hoy</th>
              <th className="px-4 py-3 font-semibold">Brecha para el microemprendedor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {COMPETENCIA.map((c) => (
              <tr key={c.alternativa}>
                <td className="px-4 py-3 font-semibold text-slate-900">{c.alternativa}</td>
                <td className="px-4 py-3 text-slate-600">{c.como}</td>
                <td className="px-4 py-3 text-slate-600">{c.brecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Proyecto() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <SectionTitle kicker="Negocio">Proyecto</SectionTitle>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            t: "Consumidor",
            d: "Microemprendedores con ventas recurrentes que gestionan pedidos, cobros, entregas y tareas con herramientas fragmentadas (WhatsApp, Instagram, hojas de cálculo y notas).",
          },
          {
            t: "Cliente inicial",
            d: "El propio microemprendedor, mediante un modelo SaaS de suscripción.",
          },
          {
            t: "Escalabilidad",
            d: "Extensible a pequeños negocios con equipos reducidos, y luego a planes empresariales o licencias institucionales.",
          },
          {
            t: "Potencial de expansión",
            d: "La misma infraestructura puede incorporar agentes especializados, automatizaciones e integraciones con canales de venta, pagos, stock y logística.",
          },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{c.t}</p>
            <p className="mt-1 text-sm text-slate-600">{c.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Mvp() {
  return (
    <section>
      <SectionTitle kicker="MVP">Asistente Operativo para Emprendedores</SectionTitle>
      <p className="text-slate-700">
        Herramienta que transforma la información desordenada del negocio en acciones organizadas
        mediante IA.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {MVP_PANEL.map(([icono, titulo, desc]) => (
          <div key={titulo} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg">
              {icono}
            </span>
            <div>
              <p className="font-semibold text-slate-900">{titulo}</p>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-violet-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Ejemplo</p>
        <p className="mt-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          “Sofi pidió 2 remeras negras talle M, las retira mañana y ya me transfirió.”
        </p>
        <p className="mt-3 text-sm font-semibold text-slate-900">La IA transforma el mensaje en:</p>
        <div className="mt-2 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3">
          <p className="text-sm font-bold text-slate-900">
            Pedido #024 <span className="ml-1 font-medium text-slate-500">Sofi — 2 remeras negras M</span>
          </p>
          <p className="mt-1 text-sm text-teal-800">💰 Pagado</p>
          <p className="text-sm text-slate-600">📅 Retiro: mañana</p>
          <p className="text-sm text-slate-600">📋 Preparar pedido</p>
        </div>
      </div>

      <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <strong className="text-slate-900">MVP mínimo:</strong> Chat IA + Pedidos + Pagos + Tareas +
        Resumen diario. Sin construir todavía facturación, stock, logística ni contabilidad: esas
        funciones forman parte de la futura expansión.
      </p>
    </section>
  );
}

function Propuesta() {
  return (
    <section className="rounded-3xl bg-violet-600 p-6 text-white shadow-lg sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight">Propuesta de valor</h2>
      <p className="mt-2 text-lg text-violet-100">
        “Convertimos la información dispersa del negocio en pedidos, pagos, tareas y entregas
        organizadas automáticamente.”
      </p>
    </section>
  );
}