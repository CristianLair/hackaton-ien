export type Producto = {
  cantidad: number;
  nombre: string;
  variante?: string;
};

export type EstadoPago = "pagado" | "pendiente" | "sin_dato";

export type Entrega = {
  modalidad: "retira" | "envio" | "indefinida";
  cuando?: string;
};

export type Pedido = {
  id: number;
  cliente: string;
  productos: Producto[];
  estadoPago: EstadoPago;
  entrega: Entrega;
  tarea: string;
  notas?: string;
  raw: string;
  createdAt: string;
};

export type PedidoParsed = Omit<Pedido, "id" | "createdAt">;

export type ParseResult = {
  pedido: PedidoParsed;
  completo: boolean;
};

export type ValidacionPedido =
  | { valido: true }
  | { valido: false; motivo: "vacio" | "sin_producto" };

export function validarPedido(texto: string, resultado: ParseResult): ValidacionPedido {
  if (!texto.trim()) return { valido: false, motivo: "vacio" };
  if (resultado.pedido.productos.length === 0) return { valido: false, motivo: "sin_producto" };
  return { valido: true };
}

export type Rubro = {
  id: string;
  nombre: string;
  emoji: string;
  descripcion: string;
  productos: string[];
};

export const RUBROS: Rubro[] = [
  {
    id: "perfumeria",
    nombre: "Perfumería",
    emoji: "🌸",
    descripcion: "Perfumes, colonias y fragancias.",
    productos: ["perfume", "perfumes", "colonia", "colonias", "fragancia", "fragancias"],
  },
  {
    id: "indumentaria",
    nombre: "Indumentaria",
    emoji: "👕",
    descripcion: "Remeras, buzos, jeans, vestidos y calzado.",
    productos: [
      "remera",
      "remeras",
      "buzo",
      "buzos",
      "pantalón",
      "pantalon",
      "pantalones",
      "jean",
      "jeans",
      "vestido",
      "vestidos",
      "pollera",
      "polleras",
      "falda",
      "faldas",
      "campera",
      "camperas",
      "zapatillas",
      "zapatos",
      "zapato",
      "gorra",
      "gorras",
      "gorro",
      "gorros",
      "bufanda",
      "bufandas",
      "pañuelo",
      "pañuelos",
    ],
  },
  {
    id: "belleza",
    nombre: "Belleza y cuidado",
    emoji: "💄",
    descripcion: "Cremas, jabones, esmaltes y cosmética.",
    productos: ["jabón", "jabon", "jabones", "crema", "cremas", "esmalte", "esmaltes"],
  },
  {
    id: "deco_hogar",
    nombre: "Deco y hogar",
    emoji: "🕯️",
    descripcion: "Velas, tazas, mates, termos y cuadros.",
    productos: [
      "vela",
      "velas",
      "taza",
      "tazas",
      "mate",
      "mates",
      "termo",
      "termos",
      "cuadro",
      "cuadros",
    ],
  },
  {
    id: "gastronomia",
    nombre: "Gastronomía",
    emoji: "🍰",
    descripcion: "Alfajores, facturas, tortas y dulces.",
    productos: [
      "alfajor",
      "alfajores",
      "facturas",
      "torta",
      "tortas",
      "galletas",
      "galletitas",
      "miel",
      "mermelada",
      "mermeladas",
    ],
  },
  {
    id: "accesorios",
    nombre: "Accesorios y joyería",
    emoji: "💍",
    descripcion: "Carteras, bolsos, aros, collares, joyas y riñoneras.",
    productos: [
      "cartera",
      "carteras",
      "bolso",
      "bolsos",
      "aro",
      "aros",
      "collar",
      "collares",
      "joya",
      "joyas",
      "alhaja",
      "alhajas",
      "riñonera",
      "riñoneras",
    ],
  },
  {
    id: "libreria",
    nombre: "Librería",
    emoji: "📚",
    descripcion: "Libros y cuadernos.",
    productos: ["libro", "libros", "cuaderno", "cuadernos"],
  },
  {
    id: "bebidas",
    nombre: "Bebidas",
    emoji: "🍷",
    descripcion: "Vinos y cervezas.",
    productos: ["vino", "vinos", "cerveza", "cervezas"],
  },
];

export function rubroPorId(id: string | null | undefined): Rubro | undefined {
  return RUBROS.find((r) => r.id === id);
}

export function productoFueraDeRubro(texto: string, rubroId: string | null): string | null {
  const rubro = rubroPorId(rubroId);
  if (!rubro) return null;
  const permitidos = new Set(rubro.productos);
  for (const prod of PRODUCTOS) {
    if (permitidos.has(prod)) continue;
    const re = new RegExp(`\\b(${prod})\\b`, "gi");
    if (re.test(texto)) return prod;
  }
  return null;
}

export function construyeTarea(cliente: string, estadoPago: EstadoPago, entrega: Entrega): string {
  const tareas: string[] = ["Preparar pedido"];
  if (estadoPago === "pendiente") {
    tareas.push(`Recordar cobro a ${cliente}`);
  }
  if (entrega.modalidad === "retira") {
    tareas.push("Coordinar retiro");
  } else if (entrega.modalidad === "envio") {
    tareas.push("Coordinar envío");
  }
  return tareas.join(" · ");
}

export function pedidoCompleto(
  parsed: Pick<PedidoParsed, "cliente" | "productos" | "estadoPago" | "entrega">,
): boolean {
  const clienteOk = parsed.cliente.trim() !== "" && parsed.cliente !== "Cliente nuevo";
  return Boolean(
    clienteOk &&
      parsed.productos.length > 0 &&
      parsed.estadoPago !== "sin_dato" &&
      parsed.entrega.modalidad !== "indefinida",
  );
}

export function faltantesDePedido(
  p: Pick<PedidoParsed, "cliente" | "productos" | "estadoPago" | "entrega">,
): string[] {
  const faltantes: string[] = [];
  if (!p.cliente.trim() || p.cliente === "Cliente nuevo") faltantes.push("Cliente nuevo");
  if (p.productos.length === 0) faltantes.push("Sin productos");
  if (p.estadoPago === "sin_dato") faltantes.push("Pago a confirmar");
  if (p.entrega.modalidad === "indefinida") faltantes.push("Entrega a coordinar");
  return faltantes;
}

export function ejemploParaRubro(rubroId: string | null | undefined): string {
  const rubro = rubroPorId(rubroId);
  switch (rubro?.id) {
    case "indumentaria":
      return PEDIDO_EJEMPLO;
    case "perfumeria":
      return "Marta pidió 2 perfumes de 50ml, retiran el jueves y ya me transfirió.";
    case "belleza":
      return "Valen pidió 3 cremas hidratantes, retira hoy y pagó en efectivo.";
    case "deco_hogar":
      return "Juan pidió una vela de soja y 2 tazas, las retira el viernes y le cobro al retirar.";
    case "gastronomia":
      return "Ana pidió 6 alfajores y una torta, mandamos mañana y ya transfirió.";
    case "accesorios":
      return "Lau pidió 2 collares y una cartera, retira hoy y me debe el pago.";
    case "libreria":
      return "Pedro pidió 3 libros, los retira el lunes y ya pagó.";
    case "bebidas":
      return "Nacho pidió 2 vinos, se los envío mañana y pagó al momento.";
    default:
      return PEDIDO_EJEMPLO;
  }
}

const NOMBRE_CON_VERBO_RE =
  /\b([A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)\s+(pidi|pedi|encarg|compr|solicit|pide|necesit|reserv|separ|quiere|queri|va\s+a\s+llevar|llevar)\w*\b/i;

const NOMBRE_PREP_RE = /(?:para|de|a|al)\s+([A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+)\s*\b/i;

export const PRODUCTOS: string[] = [
  "remera",
  "remeras",
  "buzo",
  "buzos",
  "pantalón",
  "pantalon",
  "pantalones",
  "jean",
  "jeans",
  "vestido",
  "vestidos",
  "pollera",
  "polleras",
  "falda",
  "faldas",
  "campera",
  "camperas",
  "zapatillas",
  "zapatos",
  "zapato",
  "gorra",
  "gorras",
  "gorro",
  "gorros",
  "bufanda",
  "bufandas",
  "pañuelo",
  "pañuelos",
  "vela",
  "velas",
  "jabón",
  "jabon",
  "jabones",
  "crema",
  "cremas",
  "taza",
  "tazas",
  "mate",
  "mates",
  "termo",
  "termos",
  "cuadro",
  "cuadros",
  "vino",
  "vinos",
  "cerveza",
  "cervezas",
  "alfajor",
  "alfajores",
  "facturas",
  "torta",
  "tortas",
  "cartera",
  "carteras",
  "bolso",
  "bolsos",
  "aro",
  "aros",
  "collar",
  "collares",
  "riñonera",
  "riñoneras",
  "joya",
  "joyas",
  "alhaja",
  "alhajas",
  "perfume",
  "perfumes",
  "libro",
  "libros",
  "galletas",
  "galletitas",
  "miel",
  "mermelada",
  "mermeladas",
  "cuadernos",
  "cuaderno",
  "esmalte",
  "esmaltes",
];

const NUMEROS_PALABRA: Record<string, number> = {
  un: 1,
  una: 1,
  unos: 1,
  unas: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
};

const TALLE_RE = /(?:talle|talla|talles)\s*:?\s*([A-Za-z]{1,3}\d{0,2})/i;

const COLORES_RE: { re: RegExp; label: string }[] = [
  { re: /\bnegr[oa]s?/i, label: "Negro" },
  { re: /\bblanc[oa]s?/i, label: "Blanco" },
  { re: /\broj[oa]s?/i, label: "Rojo" },
  { re: /\brosad[oa]s?/i, label: "Rosado" },
  { re: /\bcelest[ae]s?/i, label: "Celeste" },
  { re: /\bamarill[oa]s?/i, label: "Amarillo" },
  { re: /\bdorad[oa]s?/i, label: "Dorado" },
  { re: /\bplatead[oa]s?/i, label: "Plateado" },
  { re: /\brosas?/i, label: "Rosa" },
  { re: /\bazul(?:es)?/i, label: "Azul" },
  { re: /\bverde(?:s)?/i, label: "Verde" },
  { re: /\bnaranjas?/i, label: "Naranja" },
  { re: /\blilas?/i, label: "Lila" },
  { re: /\bgris(?:es)?/i, label: "Gris" },
  { re: /\bmarr[oó]n(?:es)?/i, label: "Marrón" },
  { re: /\bbord[oó]s?/i, label: "Bordo" },
  { re: /\bmostazas?/i, label: "Mostaza" },
];

const PAGADO_RE =
  /(transfir|transferencia\s+realizada|pag[oó]|abon[oó]|deposit[oó]|ya\s+me\s+|efectivo\s+(?:en\s+mano|al\s+retirar)?|mercado\s?pago|mp\b|qr\b|me\s+pag)/i;

const PENDIENTE_RE =
  /(pendiente|deb(e|és|emos)\s+(cobrar|pagar|abonar|abon|enchufar)|le\s+cobro|cobr(ar|arle|ás|a)\b|contra\s+entrega|a\s+cobrar|no\s+me\s+pag|todav[ií]a\s+no\s+me\s+pag|se\s+lo\s+cobro|falta\s+el\s+pago|paga\s+al\s+retirar)/i;

const RETIRA_RE = /(retir|pasa\s+a\s+busc|vien\w*\s+a\s+busc|pasar\s+a\s+busc|se\s+(?:lo|los)\s+lleva)/i;

const ENVIO_RE = /\b(enví|envi|mand|despach|courier|correo|reparto|a\s+domicilio|por\s+envío)\w*/i;

const ENTREGA_CUANDO_RE =
  /(hoy|mañana|esta\s+semana|el\s+(?:próximo|proximo)\s*(?:lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)|este\s+fin\s+de\s+semana|lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo|\d{1,2}\s*[/-]\s*\d{1,2})/i;

export function parsearPedido(texto: string, rubroId?: string | null): ParseResult {
  const raw = texto.trim();
  const cliente = extraerCliente(raw);
  const productos = extraerProductos(raw, rubroId);
  const estadoPago = extraerPago(raw);
  const entrega = extraerEntrega(raw);

  const tarea = construyeTarea(cliente, estadoPago, entrega);

  const completo = pedidoCompleto({ cliente, productos, estadoPago, entrega });

  return {
    pedido: {
      cliente,
      productos,
      estadoPago,
      entrega,
      tarea,
      notas: completo ? undefined : "Algunos datos no quedaron claros, cargalos a mano.",
      raw,
    },
    completo,
  };
}

function extraerCliente(texto: string): string {
  const m = texto.match(NOMBRE_CON_VERBO_RE);
  if (m) return m[1];
  const p = texto.match(NOMBRE_PREP_RE);
  if (p) return p[1];
  return "Cliente nuevo";
}

function extraerProductos(texto: string, rubroId?: string | null): Producto[] {
  const talle = texto.match(TALLE_RE)?.[1];
  const colorMatch = extraerColor(texto);

  const encontrados = new Map<string, { cantidad: number; indice: number }>();

  const catalogo = rubroPorId(rubroId)?.productos ?? PRODUCTOS;

  for (const prod of catalogo) {
    const re = new RegExp(`\\b(${prod})\\b`, "gi");
    let match: RegExpExecArray | null;
    while ((match = re.exec(texto))) {
      const antes = texto.slice(0, match.index);
      const prevWords = antes.match(/(\d+|un|una|unos|unas|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s*$/i);
      let cantidad = 1;
      if (prevWords) {
        const rawNum = prevWords[1].toLowerCase();
        cantidad = NUMEROS_PALABRA[rawNum] ?? Number(rawNum);
      }
      if (!encontrados.has(prod) || encontrados.get(prod)!.indice > match.index) {
        encontrados.set(prod, { cantidad, indice: match.index });
      }
      re.lastIndex = match.index + match[0].length;
    }
  }

  if (encontrados.size > 0) {
    const productos: Producto[] = [...encontrados.entries()]
      .sort((a, b) => a[1].indice - b[1].indice)
      .map(([nombre, { cantidad }]) => {
        const variante = talle || colorMatch ? formatVariante(colorMatch, talle) : undefined;
        return { cantidad, nombre, variante };
      });
    return productos;
  }

  return [];
}

function formatVariante(color?: string, talle?: string): string | undefined {
  const partes: string[] = [];
  if (talle) partes.push(`Talle ${talle.toUpperCase()}`);
  if (color) partes.push(color);
  return partes.length ? partes.join(", ") : undefined;
}

function extraerColor(texto: string): string | undefined {
  for (const { re, label } of COLORES_RE) {
    if (re.test(texto)) return label;
  }
  return undefined;
}

function extraerPago(texto: string): EstadoPago {
  if (PAGADO_RE.test(texto) && !/no\s+me\s+ha/i.test(texto)) return "pagado";
  if (PENDIENTE_RE.test(texto)) return "pendiente";
  return "sin_dato";
}

function extraerEntrega(texto: string): Entrega {
  const cuando = texto.match(ENTREGA_CUANDO_RE)?.[0];
  if (RETIRA_RE.test(texto)) return { modalidad: "retira", cuando };
  if (ENVIO_RE.test(texto)) return { modalidad: "envio", cuando };
  return { modalidad: "indefinida", cuando };
}

export const PEDIDO_EJEMPLO =
  "Sofi pidió 2 remeras negras talle M, las retira mañana y ya me transfirió.";

export function describirPedido(p: Pedido): string {
  const productos = p.productos.map((pr) => `${pr.cantidad} ${pr.nombre}`).join(", ") || "producto";
  const estado =
    p.estadoPago === "pagado" ? "Pagado" : p.estadoPago === "pendiente" ? "Pendiente de cobro" : "Sin dato de pago";
  const entrega =
    p.entrega.modalidad === "retira"
      ? `Retira${p.entrega.cuando ? ` ${p.entrega.cuando}` : ""}`
      : p.entrega.modalidad === "envio"
        ? "Envío a domicilio"
        : "Entrega a coordinar";
  return `Registré el pedido de ${p.cliente}: ${productos} — ${estado}. ${entrega}. Tarea: ${p.tarea}.`;
}

export function formatoNumero(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

export function resumenDiario(pedidos: Pedido[]) {
  const hoy = new Date().toLocaleDateString("es-AR");
  const deHoy = pedidos.filter(
    (p) => new Date(p.createdAt).toLocaleDateString("es-AR") === hoy,
  );
  return {
    total: deHoy.length,
    pagados: deHoy.filter((p) => p.estadoPago === "pagado").length,
    porCobrar: deHoy.filter((p) => p.estadoPago === "pendiente").length,
    entregasHoy: deHoy.filter((p) => p.entrega.modalidad !== "indefinida").length,
  };
}