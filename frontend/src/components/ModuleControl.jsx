import React, { useState } from "react";
import { nextTurn, recallTurn } from "../api/turns";
import Swal from "sweetalert2";

export default function ModuleControl({ user, onUpdated, currentTurn }) {
  const [loading, setLoading] = useState(false);

  // 🔊 Hablar texto
  function speakText(texto, repeat = 1) {
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = "es-ES";

    let voices = speechSynthesis.getVoices();
    const setVoiceAndSpeak = () => {
      voices = speechSynthesis.getVoices();
      const vozEspanol = voices.find((v) => v.lang.startsWith("es"));
      utter.voice = vozEspanol || voices[0];
      speechSynthesis.cancel();

      let count = 0;
      utter.onend = () => {
        count++;
        if (count < repeat) {
          speechSynthesis.speak(utter);
        }
      };

      speechSynthesis.speak(utter);
    };

    if (!voices.length) {
      speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    } else {
      setVoiceAndSpeak();
    }
  }

  async function handleNext() {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Necesitas iniciar sesión",
        confirmButtonText: "OK",
        confirmButtonColor: "#007aedff",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await nextTurn(user.token);

      if (res.turno) {
        const code = `${res.turno.module || user.module}${String(
          res.turno.number
        ).padStart(3, "0")}`;
        const texto = `Turno ${code}. ${res.turno.nombre}. Por favor diríjase al módulo ${user.module}`;
        speakText(texto, 1);
      }

      Swal.fire({
        icon: res.turno ? "success" : "info",
        title: res.message || "No hay más turnos",
        confirmButtonText: "OK",
        confirmButtonColor: "#007aedff",
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al avanzar turno",
        text: err.message || err.toString(),
      });
    } finally {
      setLoading(false);
      if (onUpdated) onUpdated();
    }
  }

  async function handleRecall() {
    if (!user) return;

    try {
      const res = await recallTurn(user.token);

      if (res.turno) {
        const code = `${res.turno.module}${String(
          res.turno.number
        ).padStart(3, "0")}`;
        const texto = `Turno ${code}. ${res.turno.nombre}. Diríjase al módulo ${res.turno.module}`;
        speakText(texto, 2);

        Swal.fire({
          icon: "info",
          title: `Turno ${res.turno.number} - ${res.turno.nombre}`,
        });
      } else {
        Swal.fire({
          icon: "info",
          title: res.message || "No hay turno en atención",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al llamar turno",
        text: err.message || err.toString(),
      });
    }
  }

  return (
    <div className="card">
      <h3>Control - Módulo {user.module}</h3>
      <div style={{ marginTop: 8 }}>
        <div className="small">Turno actual:</div>
        <div className="turn-number">
          {currentTurn
            ? `${currentTurn.module || user.module}${String(
                currentTurn.number
              ).padStart(3, "0")}`
            : "—"}
        </div>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: "10px" }}>
        <button className="button" onClick={handleNext} disabled={loading}>
          {loading ? "..." : "Siguiente"}
        </button>
        <button className="button" onClick={handleRecall} disabled={loading}>
          Llamar
        </button>
      </div>
    </div>
  );
}
