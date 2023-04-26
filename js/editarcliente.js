(function(){

    let DB;

    let idCliente;

    const nombreinput = document.querySelector('#nombre');
    const emailinput = document.querySelector('#email');
    const telefonoinput = document.querySelector('#telefono');
    const empresainput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');
    

    document.addEventListener('DOMContentLoaded', () =>{

        conectarDB();

        //Actualizar

        formulario.addEventListener('submit', actualizarCliente);

        //Verificar el ID de la URL

        const parametrosURL = new URLSearchParams(window.location.search);

        idCliente = parametrosURL.get('id');


        if(idCliente){

            setTimeout(() =>{

                obtenerCliente(idCliente);

            }, 100);

            
        }
    });

    function actualizarCliente(e){

        e.preventDefault();

        if(nombreinput.value =='' || emailinput.value =='' || empresainput.value =='' || telefonoinput.value == ''){

            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        //Actualizar Cliente

        const clienteActualizado = {

            nombre: nombreinput.value,
            email: emailinput.value,
            telefono: telefonoinput.value,
            empresa: empresainput.value,
            id:Number(idCliente)

        };

        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function(){
            imprimirAlerta('Editador CorrectaMente');
            setTimeout(() =>{

                window.location.href = 'tables.html';
            
            }, 3000);
        };

        transaction.onerror = function(){
            console.log('Hubo un error', 'error');
        };


    }

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');
        
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            
            if(cursor){
                console.log(cursor.value);

                if(cursor.value.id == Number(id)){
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente){
        const {nombre,email,telefono,empresa} = datosCliente;
        nombreinput.value = nombre;
        emailinput.value = email;
        telefonoinput.value = telefono;
        empresainput.value = empresa;
    }

    function conectarDB(){

        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){

            console.log('Hubo un error');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    }
})();