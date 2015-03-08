/*
 * @author Jose M. Juanes
 * @license Under the MIT license
 * @website www.jmjuanes.es
 * 
 * Usage: <script type="text/javascript" src="https://jmjuanes.github.io/api/js/storage.js"></script>
 * 
 */

/*

// Iniciar el storage para un grupo concreto (nombre):
var storage = new Storage('nombre');

// Guardar uno nuevo
storage.Save(array);

// Obtener uno en concreto
var array = storage.Get(index);

// Obtener un aray (multidimensional) con todos los registros guardados
var multi_array = storage.List();

// Reemplazar el contenido
storage.Set(index, array);

// Borrar un indice en concreto
storage.DeleteIndex(index);

// Borrar todos
storage.Delete();


 */
//Clase que controla el almacenamiento
var Storage = function(nomb)
{
	//Nombre del storage
	this.name = nomb;
	
	//Maximo de registros
	this.max = 1000;
	
	//Funcion que guarda uno nuevo
	this.Save = function(get)
	{
		//Definiciones
		var value = '';
		
		//Cogemos cuantas hay creadas
		var max = this.GetMax();
		
		//Cogemos cuantos hay
		var l = get.length;
		
		//Creamos el string
		for(var i = 0; i < l - 1; i++)
		{
			value = value + get[i] + ';';
		}
		
		//Ponemos el ultimo
		value = value + get[l-1];
		
		//Lo guardamos
		localStorage.setItem(this.name + max, value);
	};
	
	//Funcion que devuelve un registro determinado
	this.Get = function(index)
	{
		//Cogemos el que corresponde
		var a = localStorage.getItem(this.name + index)
		
		//Devolvemos en forma de array
		return a.split(';');
	};
	
	//Funcion que devuelve el maximo numero de storages guardadas
	this.GetMax = function()
	{
		//Iniciamos
		var n = 0;
		var s = localStorage.getItem(this.name + n);
		
		//Contamos
		while(s !== null && n < this.max)
		{
			//Aumentamos el contador
			n++;
			
			//Cogemos el siguiente
			s = localStorage.getItem(this.name + n);
		}
			
		//Devolvemos
		return n;
	};
	
	//Funcion que reemplaza el contenido
	this.Set = function(index, get)
	{
		//Iniciamos
		var value = '';
		
		//Cogemos cuantos hay
		var l = get.length;
		
		//Creamos el string
		for(var i = 0; i < l - 1; i++)
		{
			value = value + get[i] + ';';
		}
		
		//Ponemos el ultimo
		value = value + get[l-1];
		
		//Guardamos
		localStorage.setItem(this.name + index, value);
	};
	
	//Funcion que devuelve la lista con todas las storages
	this.List = function()
	{
		//Iniciamos
		var n = 0;
		var s = localStorage.getItem(this.name + n);
		
	    //Creamos el array
	    var a = new Array();
	    
	    //Recorremos todas
	    while(s !== null && n < this.max)
	    {
	    	//La sumamos al array
	        a[n] = s.split(';');
	        
	        //Aumentamos el contador
			n++;
			
			//Cogemos el siguiente
			s = localStorage.getItem(this.name + n);
	    }
	    
	    //Devolvemos el array
	    return a;
	};
	
	//Funcion que elimina todos
	this.Delete = function()
	{
		//Iniciamos
		var n = 0;
		var s = localStorage.getItem(this.name + n);
		
		//Eliminamos todos
		while(s !== null && n < this.max)
		{
			//Borramos el que estamos
			localStorage.removeItem(this.name + n);
			
			//Aumentamos contadores
			n++;
			
			//Cogemos el siguiente
			s = localStorage.getItem(this.name + n);
		}
	};
	
	//Funcion que elimina un elemento del storage
	this.DeleteIndex = function(index)
	{
		//Cogemos todo el numbre
		var nom = this.name + index;
		
		//Lo eliminamos
		localStorage.removeItem(nom);
		
		//Iniciamos
		var n = index + 1;
		var s = localStorage.getItem(this.name + n);
		
		//Movemos los anteriores
		while(s !== null && n < this.max)
		{		
			//Lo guardamos en el que estamos
			localStorage.setItem(this.name + index, s);
			
			//Borramos el que estamos
			localStorage.removeItem(this.name + n);
			
			//Aumentamos contadores
			n++;
			index++;
			
			//Cogemos el siguiente
			s = localStorage.getItem(this.name + n);
		}
	};	
};


