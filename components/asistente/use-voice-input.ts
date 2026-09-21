"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const MENSAJES_ERROR: Record<string, string> = {
  "no-speech": "No escuché nada, volvé a intentarlo.",
  "not-allowed": "Sin acceso al micrófono: habilitalo en el navegador y reintentá.",
  "service-not-allowed": "Sin acceso al micrófono: habilitalo en el navegador y reintentá.",
  "audio-capture": "No encontré un micrófono conectado.",
  network: "Hubo un error de red al procesar el audio, volvé a intentarlo.",
  "language-not-supported": "Tu navegador no soporta dictado en español.",
};

const AUTO_LIMPIAR_ERROR_MS = 4000;
const TIEMPO_REINICIO_MS = 250;

function obtenerSoporte(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

const soporteEnServidor = () => false;

export function useVoiceInput(onTranscript: (finalText: string) => void) {
  const reconocimientoRef = useRef<SpeechRecognition | null>(null);
  const hablandoRef = useRef(false);
  const detenidoPorUsuarioRef = useRef(false);
  const temporizadorReinicioRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorPendienteRef = useRef(false);
  const timerErrorRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  });

  const soporte = useSyncExternalStore(() => () => {}, obtenerSoporte, soporteEnServidor);
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parcial, setParcial] = useState("");

  const limpiarErrorProgramado = useCallback(() => {
    if (timerErrorRef.current) {
      clearTimeout(timerErrorRef.current);
      timerErrorRef.current = null;
    }
  }, []);

  const mostrarError = useCallback(
    (mensaje: string) => {
      errorPendienteRef.current = true;
      setError(mensaje);
      limpiarErrorProgramado();
      timerErrorRef.current = setTimeout(() => {
        setError(null);
        errorPendienteRef.current = false;
      }, AUTO_LIMPIAR_ERROR_MS);
    },
    [limpiarErrorProgramado],
  );

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = "es-AR";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      hablandoRef.current = true;
      detenidoPorUsuarioRef.current = false;
      errorPendienteRef.current = false;
      setEscuchando(true);
      setParcial("");
    };

    rec.onresult = (event) => {
      let definitivo = "";
      let temporal = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const resultado = event.results[i];
        const texto = resultado[0].transcript;
        if (resultado.isFinal) {
          definitivo += (definitivo ? " " : "") + texto;
        } else if (!definitivo) {
          temporal += (temporal ? " " : "") + texto;
        }
      }
      setParcial(temporal);
      if (definitivo && onTranscriptRef.current) {
        onTranscriptRef.current(definitivo);
      }
    };

    rec.onerror = (event) => {
      if (event.error === "aborted") return;
      const mensaje = MENSAJES_ERROR[event.error];
      if (mensaje) mostrarError(mensaje);
    };

    rec.onend = () => {
      hablandoRef.current = false;
      if (detenidoPorUsuarioRef.current) {
        detenidoPorUsuarioRef.current = false;
        setEscuchando(false);
        if (!errorPendienteRef.current) setError(null);
        setParcial("");
        return;
      }
      // El reconocimiento terminó solo (pausa larga): lo reactivamos para
      // darle más tiempo de espera y no cortar el dictado a mitad de texto.
      if (
        temporizadorReinicioRef.current === null &&
        reconocimientoRef.current
      ) {
        temporizadorReinicioRef.current = setTimeout(() => {
          temporizadorReinicioRef.current = null;
          if (detenidoPorUsuarioRef.current) return;
          if (!reconocimientoRef.current) return;
          try {
            reconocimientoRef.current.start();
            hablandoRef.current = true;
          } catch {
            setEscuchando(false);
            setParcial("");
          }
        }, TIEMPO_REINICIO_MS);
      }
    };

    reconocimientoRef.current = rec;

    return () => {
      limpiarErrorProgramado();
      detenidoPorUsuarioRef.current = true;
      hablandoRef.current = false;
      if (temporizadorReinicioRef.current) {
        clearTimeout(temporizadorReinicioRef.current);
        temporizadorReinicioRef.current = null;
      }
      try {
        reconocimientoRef.current?.abort();
      } catch {
        /* sin estado */
      }
      reconocimientoRef.current = null;
    };
  }, [limpiarErrorProgramado, mostrarError]);

  const stop = useCallback(() => {
    limpiarErrorProgramado();
    detenidoPorUsuarioRef.current = true;
    if (temporizadorReinicioRef.current) {
      clearTimeout(temporizadorReinicioRef.current);
      temporizadorReinicioRef.current = null;
    }
    setEscuchando(false);
    setError(null);
    setParcial("");
    if (!reconocimientoRef.current || !hablandoRef.current) return;
    try {
      reconocimientoRef.current.stop();
    } catch {
      hablandoRef.current = false;
    }
  }, [limpiarErrorProgramado]);

  const toggle = useCallback(() => {
    if (escuchando) {
      stop();
      return;
    }
    limpiarErrorProgramado();
    errorPendienteRef.current = false;
    setError(null);
    if (!reconocimientoRef.current) return;
    try {
      reconocimientoRef.current.start();
    } catch {
      setError("No pude iniciar el dictado, volvé a intentarlo.");
    }
  }, [escuchando, stop, limpiarErrorProgramado]);

  return { soporte, escuchando, error, parcial, toggle, stop };
}