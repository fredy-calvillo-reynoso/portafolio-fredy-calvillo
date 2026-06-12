import { guardarPaciente } from "./pacientes-service.js";
import { configurarUbicacion } from "./ubicacion.js";
import { auth } from "./guardado-config.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    configurarUbicacion();
  } catch (error) {
    console.warn("La ubicación no se pudo configurar, pero el formulario seguirá funcionando:", error);
  }

  const form = document.getElementById("patientForm");
  const btnSubmit = document.getElementById("btnSubmit");
  const alerta = document.getElementById("alerta");

  const alergiaSi = document.getElementById("alergiaSi");
  const alergiaNo = document.getElementById("alergiaNo");
  const alergiaDescripcionContainer = document.getElementById("alergiaDescripcionContainer");
  const alergiaDescripcionInput = document.getElementById("alergiaDescripcion");

  const alergiaMedSi = document.getElementById("alergiaMedSi");
  const alergiaMedNo = document.getElementById("alergiaMedNo");
  const medicamentosContainer = document.getElementById("medicamentosContainer");
  const medicamentosInputs = document.getElementById("medicamentosInputs");
  const agregarMedicamentoBtn = document.getElementById("agregarMedicamento");

  const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const regexTelefono = /^[0-9]{10}$/;
  const regexDireccion = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#.,\-]+$/;
  const regexTextoMedico = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s,.\-]*$/;

  function mostrarAlerta(tipo, icono, mensaje) {
    if (alerta) {
      alerta.className = `alert alert-${tipo}`;
      alerta.innerHTML = `<i class="${icono} me-2"></i>${mensaje}`;
      alerta.classList.remove("d-none");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      alert(mensaje);
    }
  }

  function marcarError(id, mensaje) {
    const input = document.getElementById(id);

    if (input) {
      input.classList.add("is-invalid");
      input.focus();
    }

    mostrarAlerta("warning", "fas fa-triangle-exclamation", mensaje);
  }

  function limpiarErrores() {
    document.querySelectorAll(".is-invalid").forEach(input => {
      input.classList.remove("is-invalid");
    });
  }

  function soloNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  function soloLetras(input) {
    input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
  }

  function textoMedico(input) {
    input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s,.\-]/g, "");
  }

  function textoDireccion(input) {
    input.value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#.,\-]/g, "");
  }

  const nombreInput = document.getElementById("nombre");
  const apellidosInput = document.getElementById("apellidos");
  const edadInput = document.getElementById("edad");
  const direccionInput = document.getElementById("direccion");
  const telefonoEmergenciasInput = document.getElementById("telefonoEmergencias");
  const telefonoFamiliarInput = document.getElementById("telefonoFamiliar");
  const enfermedadesInput = document.getElementById("enfermedades");

  if (nombreInput) nombreInput.addEventListener("input", () => soloLetras(nombreInput));
  if (apellidosInput) apellidosInput.addEventListener("input", () => soloLetras(apellidosInput));
  if (direccionInput) direccionInput.addEventListener("input", () => textoDireccion(direccionInput));
  if (telefonoEmergenciasInput) telefonoEmergenciasInput.addEventListener("input", () => soloNumeros(telefonoEmergenciasInput));
  if (telefonoFamiliarInput) telefonoFamiliarInput.addEventListener("input", () => soloNumeros(telefonoFamiliarInput));
  if (enfermedadesInput) enfermedadesInput.addEventListener("input", () => textoMedico(enfermedadesInput));
  if (alergiaDescripcionInput) alergiaDescripcionInput.addEventListener("input", () => textoMedico(alergiaDescripcionInput));

  function toggleAlergiaDescripcion() {
    if (!alergiaDescripcionContainer || !alergiaDescripcionInput || !alergiaSi) return;

    if (alergiaSi.checked) {
      alergiaDescripcionContainer.style.display = "block";
      alergiaDescripcionInput.required = false;
    } else {
      alergiaDescripcionContainer.style.display = "none";
      alergiaDescripcionInput.required = false;
      alergiaDescripcionInput.value = "";
    }
  }

  function agregarCampoMedicamento() {
    if (!medicamentosInputs) return;

    const div = document.createElement("div");
    div.className = "input-group mb-2";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    input.placeholder = "Nombre del medicamento";
    input.name = "medicamentos[]";
    input.required = false;
    input.pattern = "[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\\s,.\\-]+";
    input.title = "Solo se permiten letras, números, comas, puntos y guiones";

    input.addEventListener("input", () => textoMedico(input));

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline-danger";
    button.innerHTML = '<i class="fas fa-xmark"></i>';

    button.addEventListener("click", () => {
      div.remove();
    });

    div.appendChild(input);
    div.appendChild(button);
    medicamentosInputs.appendChild(div);
  }

  function toggleMedicamentosContainer() {
    if (!medicamentosContainer || !medicamentosInputs || !alergiaMedSi) return;

    if (alergiaMedSi.checked) {
      medicamentosContainer.style.display = "block";

      if (medicamentosInputs.children.length === 0) {
        agregarCampoMedicamento();
      }
    } else {
      medicamentosContainer.style.display = "none";
      medicamentosInputs.innerHTML = "";
    }
  }

  if (alergiaSi) alergiaSi.addEventListener("change", toggleAlergiaDescripcion);
  if (alergiaNo) alergiaNo.addEventListener("change", toggleAlergiaDescripcion);
  if (alergiaMedSi) alergiaMedSi.addEventListener("change", toggleMedicamentosContainer);
  if (alergiaMedNo) alergiaMedNo.addEventListener("change", toggleMedicamentosContainer);
  if (agregarMedicamentoBtn) agregarMedicamentoBtn.addEventListener("click", agregarCampoMedicamento);

  if (!form || !btnSubmit) {
    console.error("No se encontró el formulario o el botón de guardar.");
    return;
  }

  btnSubmit.disabled = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    limpiarErrores();

    const usuario = auth.currentUser;

    if (!usuario) {
      mostrarAlerta("danger", "fas fa-circle-xmark", "No hay una sesión activa. Inicie sesión nuevamente.");
      return;
    }

    const nombre = nombreInput?.value.trim() || "";
    const apellidos = apellidosInput?.value.trim() || "";
    const edad = edadInput?.value || "";
    const direccion = direccionInput?.value.trim() || "";
    const telefonoEmergencias = telefonoEmergenciasInput?.value.trim() || "";
    const telefonoFamiliar = telefonoFamiliarInput?.value.trim() || "";
    const tipoSangre = document.getElementById("tipoSangre")?.value || "";
    const enfermedades = enfermedadesInput?.value.trim() || "";
    const alergias = alergiaDescripcionInput?.value.trim() || "";

    if (!nombre || !regexLetras.test(nombre)) {
      marcarError("nombre", "El nombre solo debe contener letras y espacios.");
      return;
    }

    if (!apellidos || !regexLetras.test(apellidos)) {
      marcarError("apellidos", "Los apellidos solo deben contener letras y espacios.");
      return;
    }

    if (!edad || Number(edad) < 0 || Number(edad) > 120) {
      marcarError("edad", "La edad debe ser un número válido entre 0 y 120.");
      return;
    }

    if (!direccion || !regexDireccion.test(direccion)) {
      marcarError("direccion", "La dirección solo debe contener letras, números y signos básicos.");
      return;
    }

    if (!regexTelefono.test(telefonoEmergencias)) {
      marcarError("telefonoEmergencias", "El teléfono de emergencias debe tener exactamente 10 números.");
      return;
    }

    if (!regexTelefono.test(telefonoFamiliar)) {
      marcarError("telefonoFamiliar", "El teléfono familiar debe tener exactamente 10 números.");
      return;
    }

    if (!tipoSangre) {
      marcarError("tipoSangre", "Seleccione un tipo de sangre.");
      return;
    }

    if (!regexTextoMedico.test(enfermedades)) {
      marcarError("enfermedades", "El campo de enfermedades solo permite letras, números, comas, puntos y guiones.");
      return;
    }

    if (!regexTextoMedico.test(alergias)) {
      marcarError("alergiaDescripcion", "El campo de alergias solo permite letras, números, comas, puntos y guiones.");
      return;
    }

    const medicamentos = Array.from(document.querySelectorAll("input[name='medicamentos[]']"))
      .map(input => input.value.trim())
      .filter(valor => valor !== "");

    for (const medicamento of medicamentos) {
      if (!regexTextoMedico.test(medicamento)) {
        mostrarAlerta("warning", "fas fa-triangle-exclamation", "Los medicamentos solo deben contener letras, números, comas, puntos y guiones.");
        return;
      }
    }

    const paciente = {
      nombre,
      apellidos,
      edad: Number(edad),
      fechaNacimiento: document.getElementById("fechaNacimiento")?.value || null,
      direccion,
      telefonoEmergencias,
      telefonoFamiliar,
      tipoSangre,
      genero: document.getElementById("genero")?.value || null,
      enfermedades,
      alergiaGeneral: document.querySelector("input[name='alergia']:checked")?.value || "No",
      alergiaMedicamento: document.querySelector("input[name='alergiaMedicamento']:checked")?.value || "No",
      alergias,
      medicamentos,
      latitud: document.getElementById("latitud")?.value || null,
      longitud: document.getElementById("longitud")?.value || null,
      geoAccuracy: document.getElementById("geoAccuracy")?.value || null,
      geoTimestamp: document.getElementById("geoTimestamp")?.value || null,
      origen: "VitalSync Web"
    };

    try {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Guardando';

      await guardarPaciente(paciente);

      mostrarAlerta("success", "fas fa-circle-check", "Registro guardado correctamente. Si ya existía un paciente en esta cuenta, fue actualizado.");

    } catch (error) {
      console.error("Error al guardar:", error);

      mostrarAlerta("danger", "fas fa-circle-xmark", "No se pudo guardar el registro. Revise la consola del navegador.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="fas fa-save me-2"></i>Guardar';
    }
  });
});