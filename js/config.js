const HOST_API = ["", "localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "localhost"
    : window.location.hostname;

const PUERTO_API = 8080;

export const API_BASE_URL = `http://${HOST_API}:${PUERTO_API}/api/v1`;

export const RUTAS = {

    ADMINISTRADORES: "/administradores",   
    DOCENTES: "/docentes",                 
    RECEPCIONISTAS: "/recepcionistas",    
    ESTUDIANTES: "/estudiantes",           
    ENCARGADOS: "/encargados",             


    NIVELES: "/niveles",                     
    GRADOS: "/grados",                    
    ACADEMICAS: "/academicas",            
    SECCIONES_TECNICAS: "/secciones-tecnicas", 
    ESPECIALIDADES: "/especialidades",        
    MATERIAS: "/materias",                  


    MATERIA_DOCENTE: "/materia-docente",     
    DOCENTE_GRADO: "/docente-grado",         
    CITAS: "/citas-reuniones", 
    ESTUDIANTES_ENCARGADOS: "/estudiante-encargados"   
};


