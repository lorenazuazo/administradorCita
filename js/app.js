//formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

//objeto principal
const citaObj = {
    mascota:'',
    propietario:'',
    telefono:'',
    fecha:'',
    hora:'',
    sintomas:'',
}
//clases
class Citas{
    constructor(){
        this.citas = [];
    }
    
    agregarCita(cita){
        this.citas = [...this.citas,cita];
    }

    eiminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
        console.log(this.citas);
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }  
}

class UI{
    imprimirAlerta(mensaje,tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert','d-block','col-12');
        
        //agregar clase de acuerdo al tipo
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = mensaje;
        //agregar al DOM
        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));
        
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    
    imprimirCitas({citas}){
        this.limpiarHtml();
        citas.forEach(cita => {
            const {  mascota,propietario,telefono,fecha,hora,sintomas,id } = cita;
            const divCita = document.createElement('div');
            divCita.classList.add('cita','p-3');
            divCita.dataset.id = id;
            
            //scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title','font-weight-bolder');
            mascotaParrafo.textContent = mascota;
            
            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span>${propietario}`;            
            
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span>${telefono}`; 
            
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span>${fecha}`; 

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span>${hora}`; 
            
            const sintomaParrafo = document.createElement('p');
            sintomaParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span>${sintomas}`; 
            
            //boton para eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn','btn-danger','mr-2');
            btnEliminar.innerHTML ='Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            btnEliminar.onclick = () => eliminarCita(id);

            //boton para editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn','btn-info');
            btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            btnEditar.onclick = ()=> cargarEdicion(cita);
            
            //agregar los parrafos al div
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomaParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);
            
            
            
            
            //agregar el div al DOM
            contenedorCitas.appendChild(divCita)
            
        });
    }

    limpiarHtml(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

//instancias
const administrarCitas = new Citas();
const ui = new UI();

//eventos
eventListener();
function eventListener(){
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);
    
    formulario.addEventListener('submit',nuevaCita)
    
}

//funciones
//agrega datos al objeto citas
function datosCita(e){
    citaObj[e.target.name] = e.target.value;
    
}
//valida y agrega una nueva cita
function nuevaCita(e){
    e.preventDefault();
    
    //extrae la info del obj citas
    const {  mascota,propietario,telefono,fecha,hora,sintomas } = citaObj;
    //validaciones
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ){
        ui.imprimirAlerta('Todos los campos son obligatorios','error');
        return;
    }
    if(editando){
        ui.imprimirAlerta('Editado correctamente');
        //pasar el objeto de lacita a edicion
        administrarCitas.editarCita({...citaObj});
        formulario.querySelector('button[type="submit"').textContent = 'Crear Cita';
        editando = false;
    }else{
        //generar el id
        citaObj.id = Date.now()
        //crerndo nueva cita
        //para evita que en el arr todas las citas sean la misma se pasa un oj con una copia
        //asi manda la ultima copia 
        administrarCitas.agregarCita({...citaObj});
        ui.imprimirAlerta('Se agrego correctamente');
    }
    
    
    reiniciarObjeto();
    formulario.reset();
    
    //mostrar el htm de las citas
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto(){
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id){
    //eliminar cita
    administrarCitas.eiminarCita(id);
    //mostrar mensaje
    ui.imprimirAlerta('La cita se elimino correctamente');
    //refresque citas
    ui.imprimirCitas(administrarCitas);
}
//carga los datos y el modo edicion
function cargarEdicion(cita){
    const {  mascota,propietario,telefono,fecha,hora,sintomas,id } = cita;
    //llena campos de los imput
    document.querySelector('#mascota').value = mascota;
    document.querySelector('#propietario').value = propietario;
    document.querySelector('#telefono').value = telefono;
    document.querySelector('#fecha').value = fecha;
    document.querySelector('#hora').value = hora;
    document.querySelector('#sintomas').value = sintomas;

    //llenar objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //cambia el texto en el boton
    formulario.querySelector('button[type="submit"').textContent = 'Guardar Cambios'

    editando = true;
    //mostrar mensaje

    //refrescar cita
}

