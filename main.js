const grillaEnHTML = document.querySelector(".grilla");
const botonFacil = document.getElementById("facil");
const botonMedio = document.getElementById("medio");
const botonDificil = document.getElementById("dificil");
const reiniciarJuego = document.getElementById("reiniciar-juego");
const buscarMatches = document.getElementById("buscar-matches");
const contenedorBotonFacil = document.getElementById("contenedor-boton-facil");
const contenedorBotonMedio = document.getElementById("contenedor-boton-medio");
const contenedorBotonDificil = document.getElementById("contenedor-boton-dificil");
const contenedorGrilla = document.querySelector('.contenedor-grilla');
const reloj = document.querySelector('.barra-de-tiempo');
const modalReiniciar = document.querySelector('.modal-reiniciar');
const botonInformacion = document.getElementById('boton-info');
const botonCancelarDeModal = document.getElementById('cancelar');
const botonReiniciarDeModal = document.getElementById('reiniciar');
const botonReiniciar = document.querySelector('.reiniciar');

botonInformacion.onclick = () => {
    mostrarBienvenida();
}

//para reniciar tiempo ,puntos y combos
const comenzarJuego = () => {
    tiempo = 60
    cuentaRegresiva()
    resetearElPuntaje()
}

botonFacil.onclick = () => {
    comenzarJuegoSinMatchesFacil();
    ocultarSeleccionDificultad();
    comenzarJuego()
    mostrarReloj();
    contenedorGrilla.classList.add('grilla-facil')

};

botonMedio.onclick = () => {
    comenzarJuegoSinMatchesMedio();
    ocultarSeleccionDificultad();
    comenzarJuego()
    mostrarReloj();
    contenedorGrilla.classList.add('grilla-media')
}
botonDificil.onclick = () => {
    comenzarJuegoSinMatchesDificil();
    ocultarSeleccionDificultad();
    comenzarJuego()
    mostrarReloj();
    contenedorGrilla.classList.add('grilla-dificil')
};

const comenzarJuegoSinMatchesFacil = () => {
    do {
        generarGrilla(9, 9);
        agregarGrillaAHTML(9, 9);
    } while (buscarBloqueInicial());
};

const comenzarJuegoSinMatchesMedio = () => {
    do {
        generarGrilla(8, 8);
        agregarGrillaAHTML(8, 8);
    } while (buscarBloqueInicial());
};

const comenzarJuegoSinMatchesDificil = () => {
    do {
        generarGrilla(7, 7);
        agregarGrillaAHTML(7, 7);
    } while (buscarBloqueInicial());
};

//------------ cuenta combos

const cantidadDeMatches = document.querySelector("#matches")

let contadorDeMatches = 1

const contarMatches = () => {
    contadorDeMatches++
    cantidadDeMatches.innerHTML = contadorDeMatches
}

const resetearContadorDeMatches = () => {
    contadorDeMatches = 1
    cantidadDeMatches.innerHTML = contadorDeMatches
}


//----------------cuenta puntaje

const puntos = document.querySelector("#puntos")


let puntaje = 0

const sumarPuntaje = () => {
    puntaje += 300 * contadorDeMatches
    puntos.innerHTML = puntaje
}

const resetearElPuntaje = () => {
    puntaje = 0
    puntos.innerHTML = puntaje
}

const puntajeFinDeJuego = document.querySelector("#puntaje-final")

const mostrarPuntajeFinal = () => {
    puntajeFinDeJuego.innerHTML = puntaje
}



const buscarBloqueInicial = () => {
    for (let i = 0; i < grilla.length; i++) {
        for (let j = 0; j < grilla[i].length; j++) {
            if (
                grilla[i][j] === grilla[i][j + 1] &&
                grilla[i][j + 1] === grilla[i][j + 2]
            ) {
                return true;
            }
            if (
                grilla[i + 1] &&
                grilla[i + 2] &&
                grilla[i][j] === grilla[i + 1][j] &&
                grilla[i][j] === grilla[i + 2][j]
            ) {
                return true;
            }
        }
    }
    return false;
};

const items = ["😎", "🤑", "😴", "🥰", "😡", "🙈"];

let grilla = [];

const obtenerNumeroAlAzar = (items) => {
    return Math.floor(Math.random() * items.length);
};

const obtenerItemAlAzar = (items) => {
    return items[obtenerNumeroAlAzar(items)];
};

// ----------- GENERAR GRILLA

const generarGrilla = (ancho, alto) => {
    grilla = [];
    for (let i = 0; i < ancho; i++) {
        grilla[i] = [];
        for (let j = 0; j < alto; j++) {
            grilla[i][j] = obtenerItemAlAzar(items);
        }
    }
    return grilla;
};

// ------------- GENERAR CUADRADO

const generarCuadrado = (x, y, array) => {
    const tamanio = 50;

    const cuadrado = document.createElement("div");
    cuadrado.dataset.x = x;
    cuadrado.dataset.y = y;
    cuadrado.innerHTML = array[x][y];
    cuadrado.style.top = `${x * tamanio}px`;
    cuadrado.style.left = `${y * tamanio}px`;
    cuadrado.addEventListener("click", cuadradosSeleccionados);
    return cuadrado;
};

// ------------------ GENERAR GRILLA EN HTML

const agregarGrillaAHTML = (ancho) => {
    const anchoDeGrilla = 50 * ancho;
    grillaEnHTML.style.width = `${anchoDeGrilla}px`;
    const listaDeEmojis = grilla;
    grillaEnHTML.innerHTML = "";
    for (let i = 0; i < listaDeEmojis.length; i++) {
        for (let j = 0; j < listaDeEmojis[i].length; j++) {
            grillaEnHTML.appendChild(generarCuadrado(i, j, listaDeEmojis));
        }
    }
};

// ------------------ SELECCIONAR CUADRADO

const cuadradosSeleccionados = (e) => {
    let cuadradoClickeado = document.querySelector(".seleccionar");
    if (cuadradoClickeado) {
        if (sonAdyacentes(cuadradoClickeado, e.target)) {
            intercambiarCuadrados(cuadradoClickeado, e.target);
            if (buscarBloqueInicial()) {
                borrarMatches();

                contarMatches();
                sumarPuntaje()
                cuadradoClickeado.classList.remove("seleccionar");
                rellenarEspacios()
            } else {
                setTimeout(() => {
                    intercambiarCuadrados(cuadradoClickeado, e.target)
                }, 600);
            }
        } else {
            cuadradoClickeado.classList.remove("seleccionar");
            e.target.classList.add("seleccionar");
        }
    } else {

        e.target.classList.add("seleccionar");
    }
};

// ------------------RELLENAR GRILLA

const rellenarEspacios = () => {
    const todosLosCuadrados = document.querySelectorAll('.grilla>div')
    if (buscarBloqueInicial) {
        for (let cuadrado of todosLosCuadrados) {
            let x = Number(cuadrado.dataset.x)
            let y = Number(cuadrado.dataset.y)
            if (cuadrado.innerHTML === '') {
                grilla[x][y] = obtenerItemAlAzar(items);
                cuadrado.classList.toggle('aparecer-cuadrado');
                setTimeout(() => {
                    cuadrado.innerHTML = grilla[x][y]
                    if (buscarBloqueInicial()) {
                        rellenarEspacios();
                        borrarMatches()
                    } else {
                        resetearContadorDeMatches()
                    }
                }, 1000);
            }
        }
    }

}

//INTERCAMBIAR CUADRADOS

const intercambiarCuadrados = (cuadrado1, cuadrado2) => {
    const datax1 = Number(cuadrado1.dataset.x);
    const datax2 = Number(cuadrado2.dataset.x);
    const datay1 = Number(cuadrado1.dataset.y);
    const datay2 = Number(cuadrado2.dataset.y);

    const tamanio = 50;

    //  modifico la grilla en JS
    let variableTemporal = grilla[datax1][datay1];
    grilla[datax1][datay1] = grilla[datax2][datay2];
    grilla[datax2][datay2] = variableTemporal;

    //  modifico la grilla en HTML

    if (datax1 === datax2 && (datay1 === datay2 + 1 || datay1 === datay2 - 1)) {
        cuadrado1.style.left = `${datay2 * tamanio}px`;
        cuadrado2.style.left = `${datay1 * tamanio}px`;
        cuadrado1.dataset.y = datay2;
        cuadrado2.dataset.y = datay1;
    } else if (
        datay1 === datay2 &&
        (datax1 === datax2 + 1 || datax1 === datax2 - 1)
    ) {
        cuadrado1.style.top = `${datax2 * tamanio}px`;
        cuadrado2.style.top = `${datax1 * tamanio}px`;
        cuadrado1.dataset.x = datax2;
        cuadrado2.dataset.x = datax1;
    }
};

const sonAdyacentes = (cuadrado1, cuadrado2) => {
    const datax1 = Number(cuadrado1.dataset.x);
    const datax2 = Number(cuadrado2.dataset.x);
    const datay1 = Number(cuadrado1.dataset.y);
    const datay2 = Number(cuadrado2.dataset.y);
    if (
        (datax1 === datax2 && datay1 === datay2 + 1) ||
        (datax1 === datax2 && datay1 === datay2 - 1) ||
        (datay1 === datay2 && datax1 === datax2 + 1) ||
        (datay1 === datay2 && datax1 === datax2 - 1)
    ) {
        return true;
    } else {

        return false;
    }
};

const buscarMatchHorizontal = () => {

    for (let i = 0; i < grilla.length; i++) {
        for (let j = 0; j < grilla[i].length; j++) {
            if (
                grilla[i][j] === grilla[i][j + 1] &&
                grilla[i][j + 1] === grilla[i][j + 2]
            ) {
                const div = document.querySelector(`div[data-x="${i}"][data-y="${j}"]`);
                div.innerHTML = "";
                grilla[i][j] = null;
                const divDos = document.querySelector(
                    `div[data-x="${i}"][data-y="${j + 1}"]`
                );
                divDos.innerHTML = "";
                grilla[i][j + 1] = null;
                const divTres = document.querySelector(
                    `div[data-x="${i}"][data-y="${j + 2}"]`
                );
                divTres.innerHTML = "";
                grilla[i][j + 2] = null;
            }
        }
    }

}
const buscarMatchVertical = () => {


    for (let i = 0; i < grilla.length; i++) {
        for (let j = 0; j < grilla[i].length; j++) {
            if (
                grilla[i + 1] &&
                grilla[i + 2] &&
                grilla[i][j] === grilla[i + 1][j] &&
                grilla[i][j] === grilla[i + 2][j]
            ) {
                const uno = document.querySelector(`div[data-x="${i}"][data-y="${j}"]`);
                uno.innerHTML = "";
                grilla[i][j] = null;
                const dos = document.querySelector(
                    `div[data-x="${i + 1}"][data-y="${j}"]`
                );
                dos.innerHTML = "";
                grilla[i + 1][j] = null;
                const tres = document.querySelector(
                    `div[data-x="${i + 2}"][data-y="${j}"]`
                );
                tres.innerHTML = "";
                grilla[i + 2][j] = null;
            }
        }
    }

};

const borrarMatches = () => {

    buscarMatchVertical()
    buscarMatchHorizontal()
}

// ------------------------------------INICIO MODALES
const modalBienvenida = document.querySelector("#contenedor-modal-bienvenida");
const modalJuegoTerminado = document.querySelector('#contenedor-modal-final');
const AJugar = document.getElementById("boton-jugar");
const modalDificultad = document.querySelector("#contenedor-modal-dificultad");
const modalDificultadInterior = document.querySelector(".modal-dificultad");
const btnReiniciarJuegoTerminado = document.querySelector('.btn-reniciar-juego-terminado')


AJugar.onclick = () => {
    ocultarBienvenida();
    modalDificultadInterior.classList.add("is-active");
};

const ocultarBienvenida = () => {
    modalBienvenida.classList.add("ocultar");
};

const mostrarBienvenida = () => {
    modalBienvenida.classList.remove("ocultar");
};

const ocultarSeleccionDificultad = () => {
    modalDificultad.classList.add("ocultar");
};

const ocultarJuegoTerminado = () => {
    modalJuegoTerminado.classList.add("ocultar");
};

AJugar.onclick = () => {
    ocultarBienvenida();
    modalDificultadInterior.classList.add("is-active");
};

// ------------------ CUENTA REGRESIVA

let tiempo = 60;
const tiempoHtml = document.querySelector(".tiempo");
const cuentaRegresiva = () => {
    tiempoHtml.innerHTML = `0 : ${tiempo}`;
    if (tiempo > 0) {
        tiempo--;
        contadorTiempo = setTimeout(cuentaRegresiva, 1000);
    } else {
        mostrarJuegoTerminado()
    }
}

const limpiarTiempo = () => {
    clearTimeout(contadorTiempo);
}
const mostrarSeleccionDificultad = () => {
    modalDificultad.classList.remove("ocultar");
}

const mostrarReloj = () => {
    reloj.classList.remove("ocultar");
}

const mostrarModalReiniciarJuego = () => {
    modalReiniciar.classList.remove("ocultar");
    modalReiniciar.classList.add("is-active");
}

const ocultarModalReiniciarJuego = () => {
    modalReiniciar.classList.add("ocultar");
    modalReiniciar.classList.remove("is-active");
}

const mostrarJuegoTerminado = () => {
    modalJuegoTerminado.classList.remove('ocultar')
    mostrarPuntajeFinal()
}

botonReiniciar.onclick = () => {
    mostrarModalReiniciarJuego();
    limpiarTiempo()
}

btnReiniciarJuegoTerminado.onclick = () => {
    if (contenedorGrilla.classList.contains("grilla-facil")) {
        comenzarJuegoSinMatchesFacil()
        comenzarJuego()
        ocultarJuegoTerminado()
    } else if (contenedorGrilla.classList.contains("grilla-media")) {
        comenzarJuegoSinMatchesMedio()
        comenzarJuego()
        ocultarJuegoTerminado()
    } else if (contenedorGrilla.classList.contains("grilla-dificil")) {
        comenzarJuegoSinMatchesDificil()
        comenzarJuego()
        ocultarJuegoTerminado()
    }
    resetearContadorDeMatches()

}

botonCancelarDeModal.onclick = () => {
    ocultarModalReiniciarJuego();
}

botonReiniciarDeModal.onclick = () => {

    mostrarSeleccionDificultad();
    if (botonReiniciarDeModal) {
        contenedorGrilla.classList.remove('grilla-facil')
        contenedorGrilla.classList.remove('grilla-media')
        contenedorGrilla.classList.remove('grilla-dificil')
    }
    ocultarModalReiniciarJuego();

}