// VARIABLES Y SELECTORES
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// EVENTOS

function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

// CLASSES
class Presupuesto {
    constructor (presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos.push(gasto);
        this.calcularRestante();
        
    }
    calcularRestante () {
        const gastado = this.gastos.reduce((total,gasto)=> total+gasto.cantidad,0)
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta (mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo == 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = mensaje;

        //Insertar en HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    }

    mostrarGastos(gastos) {
        // Iterar sobre los gastos
        this.limpiarListadoGastos();
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            // crear un LI
            const nuevoGasto = document.createElement('li');
            //agregar HTML DEL GASTO
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            
            nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill"> $${cantidad} </span>`;
            // boton para borar el gasto

            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
            gastoListado.appendChild(nuevoGasto);
        });
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;

    }

    comprobarPresupuesto(presupuestoObj){
        const {restante, presupuesto} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');
        if((presupuesto/4) > restante) {
            restanteDiv.classList.remove('alert-sucess');
            restanteDiv.classList.add('alert-danger')
        } else if ((presupuesto/2) > restante ) {
            restanteDiv.classList.remove('alert-sucess', 'alert-danger');
            restanteDiv.classList.add('alert-warning');        
        } else {
            restanteDiv.classList.remove('alert-warning', 'alert-danger');
            restanteDiv.classList.add('alert-success');
        }
}   

    limpiarListadoGastos() {
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
}

// GENERAL
eventListeners();
let presupuesto;
const ui = new UI();

// FUNCIONES

function preguntarPresupuesto() {

    const presupuestoUsuario = prompt('cual es tu presupuesto?');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();
    ui.limpiarListadoGastos();
    const nombreGasto = document.querySelector('#gasto').value;
    const cantidadGasto = Number(document.querySelector('#cantidad').value);

    // Validad 

    if(nombreGasto === '' || cantidadGasto === ''){
        ui.imprimirAlerta('ambos campos son obligatorios', 'error')
        return;
    } else if (cantidadGasto <= 0 || isNaN(cantidadGasto) ) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    } 

    // Generar un objetc literal con el gasto
    const gasto = { nombre: nombreGasto, 
        cantidad:cantidadGasto,
        id : Date.now() 
    };
    
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('gasto agregado correctamente');

    const {gastos,restante} = presupuesto;
    
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    formulario.reset(); //reinicio formulario

}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);
    const {gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}