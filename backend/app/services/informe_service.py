import os
from datetime import date
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH


MESES = {
    1: "enero",
    2: "febrero",
    3: "marzo",
    4: "abril",
    5: "mayo",
    6: "junio",
    7: "julio",
    8: "agosto",
    9: "septiembre",
    10: "octubre",
    11: "noviembre",
    12: "diciembre",
}


def safe(value, default=""):
    if value is None:
        return default
    return str(value)


def get_attr(obj, attr, default=""):
    return safe(getattr(obj, attr, default), default)


def get_rel_name(obj, rel_name, default=""):
    rel = getattr(obj, rel_name, None)
    if not rel:
        return default
    return safe(getattr(rel, "nombre", default), default)


def periodo_a_mes_anio(periodo: str):
    try:
      anio, mes = periodo.split("-")
      mes_num = int(mes)
      return MESES.get(mes_num, mes), anio
    except Exception:
      return periodo, ""


def reemplazar_texto_en_parrafo(paragraph, reemplazos):
    texto_original = paragraph.text

    if not texto_original:
        return

    texto_nuevo = texto_original

    for buscar, reemplazar in reemplazos.items():
        texto_nuevo = texto_nuevo.replace(buscar, reemplazar)

    if texto_nuevo != texto_original:
        for run in paragraph.runs:
            run.text = ""

        if paragraph.runs:
            paragraph.runs[0].text = texto_nuevo
        else:
            paragraph.add_run(texto_nuevo)


def reemplazar_texto_en_documento(doc, reemplazos):
    for p in doc.paragraphs:
        reemplazar_texto_en_parrafo(p, reemplazos)

    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    reemplazar_texto_en_parrafo(p, reemplazos)
def centrar_datos_portada(doc):
    inicios = [
        "ESTUDIANTE:",
        "CARRERA:",
        "MODALIDAD:",
        "NÚMERO DE CELULAR:",
    ]

    for p in doc.paragraphs:
        texto = p.text.strip()

        if any(texto.startswith(inicio) for inicio in inicios):
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER

def set_cell(cell, value):
    cell.text = safe(value)


def grupos_especiales_prevencion(r):
    grupos = []

    if getattr(r, "poblacion_ninez", False):
        grupos.append("Niñez")

    if getattr(r, "poblacion_adulto_mayor", False):
        grupos.append("Adulto Mayor")

    if getattr(r, "poblacion_discapacidad", False):
        grupos.append("Discapacidad")

    return ", ".join(grupos)


def llenar_tabla_prevenciones(table, prevenciones):
    # La plantilla tiene 2 filas de encabezado.
    fila_inicio = 2

    filas_disponibles = len(table.rows) - fila_inicio

    while len(prevenciones) > filas_disponibles:
        table.add_row()
        filas_disponibles += 1

    for i in range(filas_disponibles):
        row = table.rows[fila_inicio + i]
        cells = row.cells

        if i >= len(prevenciones):
            for cell in cells:
                set_cell(cell, "")
            continue

        r = prevenciones[i]

        descripcion = get_attr(r, "descripcion")
        grupos = grupos_especiales_prevencion(r)

        if grupos:
            descripcion = f"{descripcion}\nGrupos especiales: {grupos}".strip()

        valores = [
            get_attr(r, "nombre"),
            descripcion,
            get_attr(r, "poblacion_mujeres", "0"),
            get_attr(r, "poblacion_hombres", "0"),
            get_attr(r, "participantes", "—"),
            get_attr(r, "url_redes", "—"),
            get_attr(r, "url_drive", "—"),
        ]

        for idx, valor in enumerate(valores):
            if idx < len(cells):
                set_cell(cells[idx], valor)


def llenar_tabla_atenciones(table, atenciones):
    # La plantilla tiene 2 filas de encabezado.
    fila_inicio = 2

    filas_disponibles = len(table.rows) - fila_inicio

    while len(atenciones) > filas_disponibles:
        table.add_row()
        filas_disponibles += 1

    for i in range(filas_disponibles):
        row = table.rows[fila_inicio + i]
        cells = row.cells

        if i >= len(atenciones):
            for cell in cells:
                set_cell(cell, "")
            continue

        r = atenciones[i]

        valores = [
            get_attr(r, "tipo_actividad"),
            get_attr(r, "descripcion"),
            get_attr(r, "denunciantes_m", "0"),
            get_attr(r, "denunciantes_h", "0"),
            get_attr(r, "seguimiento", "0"),
            get_attr(r, "tipo_caso"),
            get_attr(r, "tipo_denuncia"),
            get_attr(r, "participantes", "—"),
        ]

        for idx, valor in enumerate(valores):
            if idx < len(cells):
                set_cell(cells[idx], valor)


def generar_docx(usuario, periodo, prevenciones, atenciones, output_dir):
    base_dir = os.path.dirname(os.path.dirname(__file__))

    template_path = os.path.join(
        base_dir,
        "templates",
        "informe_mensual_slim_umsa.docx"
    )

    if not os.path.exists(template_path):
        raise FileNotFoundError(f"No se encontró la plantilla: {template_path}")

    os.makedirs(output_dir, exist_ok=True)

    doc = Document(template_path)

    nombre = (
        get_attr(usuario, "nombres_completos")
        or get_attr(usuario, "nombre")
        or "NOMBRE DEL ESTUDIANTE"
    )

    ci = get_attr(usuario, "ci", "CI")
    celular = get_attr(usuario, "celular", "")
    modalidad = get_attr(usuario, "modalidad", "")
    carrera = get_rel_name(usuario, "carrera", "")
    municipio = get_rel_name(usuario, "municipio", "")

    mes, anio = periodo_a_mes_anio(periodo)

    hoy = date.today()
    fecha_envio = f"{hoy.day} de {MESES.get(hoy.month, hoy.month)} de {hoy.year}"

    reemplazos = {
        "ESTUDIANTE: (NOMBRES Y APELLIDOS)": f"ESTUDIANTE: {nombre}",
        "CARRERA:": f"CARRERA: {carrera}",
        "MODALIDAD: (TRABAJO DIRIGIDO, INTERNADO ROTARIO O PRÁCTICAS PRE PROFESIONALES)": f"MODALIDAD: {modalidad}",
        "NÚMERO DE CELULAR:": f"NÚMERO DE CELULAR: {celular}",

        "La Paz, (municipio), 1 de abril de 2025 (actualizar fecha de envió)": f"La Paz, {municipio}, {fecha_envio}",
        "DE: (Inserta tus nombres y apellidos)": f"DE: {nombre}",
        "mes de (AGREGAR MES)": f"mes de {mes}",
        "Servicio Legal Integral Municipal de (AGREGAR MUNICIPIO)": f"Servicio Legal Integral Municipal de {municipio}",

        "(NOMBRE DEL ESTUDIANTE)": nombre,
        "(NÚMERO DE CARNET DE IDENTIDAD CON SU EXTENSIÓN)": ci,
    }

    # IMPORTANTE:
    # MODALIDAD se deja como está en la plantilla.
    reemplazar_texto_en_documento(doc, reemplazos)
    centrar_datos_portada(doc)

    if len(doc.tables) >= 1:
        llenar_tabla_prevenciones(doc.tables[0], prevenciones)

    if len(doc.tables) >= 2:
        llenar_tabla_atenciones(doc.tables[1], atenciones)

    filename = f"Informe_SLIM_{ci}_{periodo}.docx"
    output_path = os.path.join(output_dir, filename)

    doc.save(output_path)

    return output_path