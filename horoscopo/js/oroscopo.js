// ==========================================================
// LÓGICA DEL HORÓSCOPO INFIEL
// ==========================================================

// ⚠️ REEMPLAZA ESTA URL POR LA DE TU CLOUDFLARE WORKER CUANDO LO CREES
const WORKER_PROXY_URL = "https://tu-worker-horoscopo.tu-usuario.workers.dev";

const signos = [
    { id: "aries", icon: "♈", name: "Aries", tip: "Borra ese chat ahora mismo. Marte indica que hoy te van a pedir prestado el celular." },
    { id: "taurus", icon: "♉", name: "Tauro", tip: "No gastes en regalos con la tarjeta de crédito compartida. Deja rastro." },
    { id: "gemini", icon: "♊", name: "Géminis", tip: "Cuidado con a quién le mandas ese mensaje, hoy andas distraído y puedes equivocarte de chat." },
    { id: "cancer", icon: "♋", name: "Cáncer", tip: "Demasiado sentimentalismo hoy. No te enamores de tu aventura, es solo para el rato." },
    { id: "leo", icon: "♌", name: "Leo", tip: "Ese chupón en el cuello no pasa por 'picadura de araña'. Usa bufanda." },
    { id: "virgo", icon: "♍", name: "Virgo", tip: "Tú que eres perfeccionista: revisa que no haya cabellos ajenos en tu asiento del copiloto." },
    { id: "libra", icon: "♎", name: "Libra", tip: "No puedes tener a ambos felices hoy. Inventa una excusa laboral creíble." },
    { id: "scorpio", icon: "♏", name: "Escorpio", tip: "Tu intuición no falla: si sientes que sospechan, pon el celular en modo avión." },
    { id: "sagittarius", icon: "♐", name: "Sagitario", tip: "Desactiva la ubicación en tiempo real. Tu espíritu aventurero te va a delatar hoy." },
    { id: "capricorn", icon: "♑", name: "Capricornio", tip: "Agendaste mal. Revisa tu calendario antes de que se te crucen los planes en el mismo restaurante." },
    { id: "aquarius", icon: "♒", name: "Acuario", tip: "Esa app para ocultar fotos falló en la última actualización. Cámbiale la contraseña." },
    { id: "pisces", icon: "♓", name: "Piscis", tip: "Deja de ponerle nombres de tías a tus contactos. Ponle 'Mecánico Juan', es más seguro." }
];

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("zodiacGrid");
    
    // Renderizar los botones de los signos
    signos.forEach(signo => {
        const div = document.createElement("div");
        div.className = "zodiac-card";
        div.innerHTML = `
            <div class="zodiac-icon">${signo.icon}</div>
            <div class="zodiac-name">${signo.name}</div>
        `;
        div.onclick = () => getHoroscope(signo, div);
        grid.appendChild(div);
    });
});

async function getHoroscope(signoData, cardElement) {
    // UI Updates
    document.querySelectorAll(".zodiac-card").forEach(c => c.classList.remove("active"));
    cardElement.classList.add("active");
    
    document.getElementById("horoscopeResult").style.display = "none";
    document.getElementById("loader").style.display = "block";
    
    // Desplazar la pantalla un poco hacia abajo
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    try {
        // Llamamos a NUESTRO Worker, el cual por detrás llama a FreeAstroAPI de forma segura
        const response = await fetch(`${WORKER_PROXY_URL}?sign=${signoData.id}`);
        
        if (!response.ok) throw new Error("Error en la red");
        const data = await response.json();

        // Extraemos la predicción de la API (El formato de respuesta depende de FreeAstroAPI)
        // Usamos un fallback por si la API falla o cambia su estructura
        const prediccionApi = data?.data?.horoscope || "Los astros están nublados hoy, pero la energía de ocultar secretos está a tope.";

        // Mostrar resultados
        document.getElementById("loader").style.display = "none";
        const resultBox = document.getElementById("horoscopeResult");
        resultBox.style.display = "block";
        
        document.getElementById("resultTitle").innerHTML = `${signoData.icon} ${signoData.name}`;
        document.getElementById("resultText").textContent = prediccionApi;
        document.getElementById("resultTip").textContent = signoData.tip;

    } catch (error) {
        console.error("Error obteniendo horóscopo:", error);
        document.getElementById("loader").style.display = "none";
        
        // Si el worker falla, al menos mostramos el consejo tóxico divertido
        const resultBox = document.getElementById("horoscopeResult");
        resultBox.style.display = "block";
        document.getElementById("resultTitle").innerHTML = `${signoData.icon} ${signoData.name}`;
        document.getElementById("resultText").textContent = "La conexión con el universo falló, pero tu instinto de supervivencia no.";
        document.getElementById("resultTip").textContent = signoData.tip;
    }
}
