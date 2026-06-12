import {
  db,
  auth,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "./guardado-config.js";

export async function guardarPaciente(paciente) {
  try {
    const usuario = auth.currentUser;

    if (!usuario) {
      throw new Error("No hay una sesión activa. Inicie sesión antes de guardar.");
    }

    const pacienteRef = doc(db, "pacientes", usuario.uid);

    await setDoc(pacienteRef, {
      ...paciente,
      usuarioId: usuario.uid,
      correoUsuario: usuario.email,
      fechaActualizacion: serverTimestamp()
    }, { merge: true });

    return usuario.uid;
  } catch (error) {
    console.error("Error al guardar paciente:", error);
    throw error;
  }
}

export async function obtenerPacienteActual() {
  try {
    const usuario = auth.currentUser;

    if (!usuario) {
      return null;
    }

    const pacienteRef = doc(db, "pacientes", usuario.uid);
    const snapshot = await getDoc(pacienteRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data()
    };
  } catch (error) {
    console.error("Error al obtener paciente:", error);
    throw error;
  }
}

export async function existePacienteActual() {
  const paciente = await obtenerPacienteActual();
  return paciente !== null;
}