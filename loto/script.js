document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración del juego ---
    const TOTAL_CARTAS = 52;
    const NUM_CARTAS_TABLA = 16;
    const FILAS_TABLA = 4;
    
    // --- Elementos de la interfaz ---
    const siguienteCartaBtn = document.getElementById('siguiente-carta-btn');
    const gritarLoteriaBtn = document.getElementById('gritar-loteria-btn');
    const cartaCantadaImg = document.getElementById('carta-cantada');
    const tablaJugadorDiv = document.getElementById('tabla-jugador');

    // --- Variables de estado del juego ---
    let mazo = []; // Array para las 52 cartas
    let cartasCantadas = [];
    let tablaActual = [];
    let cartaActualIndex = -1;

    // --- Funciones del juego ---

    // Inicializa el mazo (52 cartas)
    function inicializarMazo() {
        mazo = Array.from({ length: TOTAL_CARTAS }, (_, i) => i + 1);
    }

    // Baraja el mazo de cartas
    function barajarMazo() {
        for (let i = mazo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
        }
    }

    // Canta la siguiente carta
    function cantarSiguienteCarta() {
        if (mazo.length > 0) {
            cartaActualIndex = mazo.shift(); // Quita la primera carta del mazo
            cartasCantadas.push(cartaActualIndex);
            
            // Actualiza la imagen en la pantalla
            cartaCantadaImg.src = `assets/cartas/carta${cartaActualIndex}.jpg`;

            // Reproduce el audio
            const audio = new Audio(`assets/audios/audio${cartaActualIndex}.mp3`);
            audio.play();
        } else {
            // El juego ha terminado
            alert('¡Se han cantado todas las cartas! El juego ha terminado.');
            siguienteCartaBtn.disabled = true;
        }
    }

    // Genera una tabla de 16 cartas para el jugador
    function generarTabla() {
        let cartasTemp = Array.from({ length: TOTAL_CARTAS }, (_, i) => i + 1);
        let tabla = [];
        for (let i = 0; i < NUM_CARTAS_TABLA; i++) {
            const index = Math.floor(Math.random() * cartasTemp.length);
            tabla.push(cartasTemp.splice(index, 1)[0]);
        }
        return tabla;
    }

    // Dibuja la tabla en el DOM
    function dibujarTabla(tabla) {
        tablaJugadorDiv.innerHTML = ''; // Limpia la tabla anterior
        tabla.forEach(carta => {
            const div = document.createElement('div');
            div.className = 'carta-casilla';
            div.dataset.cartaId = carta;
            div.innerHTML = `<img src="assets/cartas/carta${carta}.jpg" alt="Carta ${carta}">`;
            div.addEventListener('click', () => marcarCarta(div));
            tablaJugadorDiv.appendChild(div);
        });
        tablaActual = tabla;
    }

    // Marca una carta en la tabla del jugador
    function marcarCarta(casilla) {
        if (cartasCantadas.includes(parseInt(casilla.dataset.cartaId))) {
            casilla.classList.toggle('marcada');
        } else {
            alert('¡Esa carta aún no ha sido cantada!');
        }
    }

    // Revisa si el jugador ha ganado
    function revisarGanador() {
        const casillas = Array.from(tablaJugadorDiv.querySelectorAll('.carta-casilla'));
        const marcadas = casillas.map(casilla => casilla.classList.contains('marcada'));

        const combinacionesGanadoras = [
            // Filas
            [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
            // Columnas
            [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
            // Diagonales
            [0, 5, 10, 15], [3, 6, 9, 12]
        ];

        for (const combinacion of combinacionesGanadoras) {
            const esGanador = combinacion.every(index => marcadas[index]);
            if (esGanador) {
                // Si hay ganador, añade la clase ganadora para la animación
                combinacion.forEach(index => casillas[index].classList.add('ganadora'));
                return true;
            }
        }
        return false;
    }

    // --- Manejadores de eventos ---
    siguienteCartaBtn.addEventListener('click', cantarSiguienteCarta);

    gritarLoteriaBtn.addEventListener('click', () => {
        if (revisarGanador()) {
            const audio = new Audio('assets/audios/loteria.mp3');
            audio.play();
            alert('¡¡¡LOTERÍA!!! ¡Felicidades, has ganado!');
            siguienteCartaBtn.disabled = true;
        } else {
            alert('Aún no has ganado, ¡sigue jugando!');
        }
    });

    // --- Inicialización del juego al cargar la página ---
    inicializarMazo();
    barajarMazo();
    const tablaAleatoria = generarTabla();
    dibujarTabla(tablaAleatoria);
});