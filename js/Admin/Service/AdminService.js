import { solicitarApi } from "../../Docentes/Service/ApiService.js";
import { RUTAS } from "../../config.js";


// Mapa de roles → tabla que le corresponde

const ROLES = {
    "ADMINISTRADOR": {
        recurso: "administradores",
        ruta: RUTAS.ADMINISTRADORES,
        prefijo: "adm",
        campoId: "idAdministrador"
    },
    "RECEPCIONISTA": {
        recurso: "recepcionistas",
        ruta: RUTAS.RECEPCIONISTAS,
        prefijo: "rec",
        campoId: "idRecepcionista"
    },
    "DOCENTE TÉCNICO": {
        recurso: "docentes",
        ruta: RUTAS.DOCENTES,
        prefijo: "doc",
        campoId: "idDocente",
        tipoDocente: "DOCENTE TÉCNICO"
    },
    "DOCENTE ACADÉMICO": {
        recurso: "docentes",
        ruta: RUTAS.DOCENTES,
        prefijo: "doc",
        campoId: "idDocente",
        tipoDocente: "DOCENTE ACADÉMICO"
    }
};


const RECURSOS = [
    ROLES["ADMINISTRADOR"],
    ROLES["DOCENTE TÉCNICO"],
    ROLES["RECEPCIONISTA"]
];
// Identificadores compuestos

function construirId(recurso, id) {
    return `${recurso}:${id}`;
}

function separarId(idCompuesto) {
    const [recurso, id] = String(idCompuesto).split(":");
    return { recurso, id };
}

function buscarConfigPorRecurso(recurso) {
    return RECURSOS.find(config => config.recurso === recurso) || null;
}

// Conversión API → formulario

function convertirRegistro(registro, config) {
    const p = config.prefijo;

    const rol = config.recurso === "docentes"
        ? registro.docTipo
        : registro[`${p}Rol`];

    return {
        id: construirId(config.recurso, registro[config.campoId]),
        nombre: registro[`${p}Nombre`] ?? "",
        apellido: registro[`${p}Apellido`] ?? "",
        clave: registro.docClave ?? "",   // solo DOCENTE tiene clave
        correo: registro[`${p}Correo`] ?? "",
        rol: rol ?? ""
    };
}

// Conversión formulario → API

function construirCuerpo(datos, config) {
    const p = config.prefijo;

    const cuerpo = {
        [`${p}Nombre`]: datos.nombre,
        [`${p}Apellido`]: datos.apellido,
        [`${p}Correo`]: datos.correo
    };


    if (config.recurso === "docentes") {
        cuerpo.docClave = datos.clave;
        cuerpo.docTipo = config.tipoDocente;
    }

    return cuerpo;
}

function normalizarDatos(datosFormulario) {
    return {
        id: datosFormulario.id || null,
        nombre: datosFormulario.nombre.trim(),
        apellido: datosFormulario.apellido.trim(),
        clave: datosFormulario.clave.trim(),
        correo: datosFormulario.correo.trim().toLowerCase(),
        rol: datosFormulario.rol.trim().toUpperCase()
    };
}


// Validaciones

async function correoEstaDisponible(correo, idActual) {
    const personal = await obtenerEmpleados();

    return !personal.some(persona =>
        persona.correo.trim().toLowerCase() === correo &&
        persona.id !== idActual
    );
}

function interpretarError(error, accion) {
    const mensaje = error.message || "";

    if (mensaje.includes("ORA-02292") || mensaje.includes("integrity constraint")) {
        return "No se puede eliminar: la persona tiene citas, materias o grados asignados. Reasigne esos registros primero.";
    }

    if (mensaje.includes("ORA-00001") || mensaje.includes("unique constraint")) {
        return "Ya existe un registro con ese correo o esa clave.";
    }

    if (mensaje.includes("ORA-00942")) {
        return "La tabla consultada no existe en la base de datos. Verifique que el script se haya ejecutado completo.";
    }

    return mensaje || `No fue posible ${accion}.`;
}

// Lectura

export async function obtenerEmpleados() {
    // Las tres consultas van en paralelo para que la tabla cargue rápido.
    const respuestas = await Promise.all(
        RECURSOS.map(async config => {
            const registros = await solicitarApi(config.ruta);
            const lista = Array.isArray(registros) ? registros : [];
            return lista.map(registro => convertirRegistro(registro, config));
        })
    );

    return respuestas
        .flat()
        .sort((a, b) => a.apellido.localeCompare(b.apellido, "es"));
}

export async function obtenerEmpleadoPorId(idCompuesto) {
    const { recurso, id } = separarId(idCompuesto);
    const config = buscarConfigPorRecurso(recurso);

    if (!config) {
        throw new Error("No se reconoce el tipo de registro seleccionado.");
    }

    const registro = await solicitarApi(`${config.ruta}/${id}`);
    return convertirRegistro(registro, config);
}

// Crear y actualizar

export async function guardarEmpleado(datosFormulario) {
    const datos = normalizarDatos(datosFormulario);
    const config = ROLES[datos.rol];

    if (!config) {
        return {
            exito: false,
            mensaje: `El rol "${datos.rol}" no tiene una tabla asignada en la base de datos. Seleccione administrador, recepcionista o docente.`
        };
    }

    if (config.recurso === "docentes" && !datos.clave) {
        return {
            exito: false,
            mensaje: "Los docentes necesitan una clave (por ejemplo DOC001)."
        };
    }

    try {
        if (!await correoEstaDisponible(datos.correo, datos.id)) {
            return {
                exito: false,
                mensaje: "Ya existe una persona registrada con ese correo."
            };
        }

        const cuerpo = construirCuerpo(datos, config);

        // --- Alta ---
        if (!datos.id) {
            await solicitarApi(config.ruta, {
                method: "POST",
                body: JSON.stringify(cuerpo)
            });

            return { exito: true, mensaje: "Registro creado correctamente." };
        }

        const { recurso: recursoActual, id } = separarId(datos.id);

        // --- Edición dentro de la misma tabla ---
        if (recursoActual === config.recurso) {
            await solicitarApi(`${config.ruta}/${id}`, {
                method: "PUT",
                body: JSON.stringify(cuerpo)
            });

            return { exito: true, mensaje: "Registro actualizado correctamente." };
        }

        await solicitarApi(config.ruta, {
            method: "POST",
            body: JSON.stringify(cuerpo)
        });

        const configAnterior = buscarConfigPorRecurso(recursoActual);

        try {
            await solicitarApi(`${configAnterior.ruta}/${id}`, { method: "DELETE" });
        } catch (error) {
            return {
                exito: true,
                tipo: "warning",
                mensaje: `Se creó el registro con el nuevo rol, pero no se pudo eliminar el anterior: ${interpretarError(error, "eliminarlo")}`
            };
        }

        return { exito: true, mensaje: "Rol actualizado correctamente." };

    } catch (error) {
        return { exito: false, mensaje: interpretarError(error, "guardar el registro") };
    }
}

// Eliminar

export async function eliminarEmpleado(idCompuesto) {
    const { recurso, id } = separarId(idCompuesto);
    const config = buscarConfigPorRecurso(recurso);

    if (!config) {
        return {
            exito: false,
            tipo: "danger",
            mensaje: "No se reconoce el tipo de registro seleccionado."
        };
    }

    try {
        await solicitarApi(`${config.ruta}/${id}`, { method: "DELETE" });
        return { exito: true, tipo: "success", mensaje: "Registro eliminado correctamente." };
    } catch (error) {
        return { exito: false, tipo: "danger", mensaje: interpretarError(error, "eliminar el registro") };
    }
}