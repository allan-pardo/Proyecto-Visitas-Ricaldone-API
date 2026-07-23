const solicitudes = [
  {
    id: 1,
    padre: "Daniel Isaias Cruz Galeas",
    estudiante: "David Eduardo",
    codigo: "20250119",
    correo: "20250119@ricaldone.edu.sv"
  },
  {
    id: 2,
    padre: "Felipe Antonio Cruz Ruiz",
    estudiante: "Raul Ernesto",
    codigo: "20250553",
    correo: "20250553@ricaldone.edu.sv"
  },
  {
    id: 3,
    padre: "Diego Rodrigo Membreño Ramos",
    estudiante: "Samuel Antonio",
    codigo: "20240087",
    correo: "20240087@ricaldone.edu.sv"
  },
  {
    id: 4,
    padre: "Antonio Salvador Ramírez Escobar",
    estudiante: "Jason Steven",
    codigo: "20250345",
    correo: "20250345@ricaldone.edu.sv"
  },
  {
    id: 5,
    padre: "Josúe Manuel Lopez Argueta",
    estudiante: "Allan Adalberto",
    codigo: "20250394",
    correo: "20250394@ricaldone.edu.sv"
  }
];

// Este servicio Obtiene la lista completa de solicitudes de reunión de los padres de familia.
export function obtenerSolicitudes() {
  return solicitudes;
}
