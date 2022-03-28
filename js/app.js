const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === ''){
        mostrarMensaje('El termino de busqueda no puede estar vacio');
        return;
    }

    buscarImagenes();
}

function mostrarMensaje(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100');
    
    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3' , 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class="font-bold"> Error! </strong>
            <span class="block sm:inline"> ${mensaje} </span>
        `;
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function buscarImagenes(){
    const termino = document.querySelector('#termino').value;
    const key = '26224076-c903b66c194fc5f430b86a85f';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    fetch(url)
        .then(res => res.json())
        .then(imagenes => {
            totalPaginas = calcularPaginas(imagenes.totalHits);
            console.log(totalPaginas);
            mostrarImagenes(imagenes.hits);
        })
}

// Generador que va a registrar la cantidad del elementos de acuerdo a las paginas'
function *crearPaginacion(total){
    for(let i = 1; i <= total; i++){
        yield i;
    }
}
function calcularPaginas(total){
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    //  iterar sobre el arreglo de imagenes y construir el html
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full h-32" src="${previewURL}">
                    <div class="px-6 py-4">
                        <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
                        <p class="font-bold">${views}<span class="font-light"> Veces vista</span></p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white font-bold uppercase text-center mt-5 rounded p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                            Ver Imagen en HD
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    // limpiar paginador previo
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
    
    imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginacion(totalPaginas);

    while(true){
        const {value, done} = iterador.next();
        if(done) return;
        // Caso contrario, genera un boton por cada elemento del generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-100' ,'px-4', 'py-1', 'mr-2', 'font-bold','mb-4', 'rounded' , 'hover:bg-yellow-500', 'text-black', 'font-bold', 'rounded');

        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        } 

        paginacionDiv.appendChild(boton);
    }
}