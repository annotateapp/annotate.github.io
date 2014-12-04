//Iniciamos la aplicacion
setTimeout( function(){ Annotate.Ini();}, 2000);

//Main class
var Annotate = new function()
{
	//Storage
	this.storage = null;
	this.book = null;
	
	//Funcion que inicia Annotate
	this.Ini = function()
	{
		//Iniciamos el Storage
		this.storage = new Storage('region_');
		this.book = new Storage('book_')
		
		//Comprobamos si hay alguno iniciado
		var get = this.Get();
		
		//Comprobamos si esta vacio
		if(typeof get[0] != 'undefined')
		{
			//Si no esta vacio, es que hay uno nuevo
			this.storage.Save(get);
		}
		
		//Iniciamos el book
		var b = new Array();
		b[0] = '<b>Project</b>';
		b[1] = '<b>Chr</b>';
		b[2] = '<b>Length</b>';
		b[3] = '<b>Start</b>';
		b[4] = '<b>End</b>';
		b[5] = '<b>Watson Y-mean</b>';
		b[6] = '<b>Crick Y-mean</b>';
		b[7] = '<b>Orfs</b>';
		
		//Lo guardamos
		this.book.Set(0, b);
		
		//Creamos los contenedores
		this.Create();
		
		//Quitamos el loader
		document.getElementById('annotate-loader').style.display = 'none';
	};
	
	//Funcion que carga todas las anotaciones
	this.Create = function()
	{
		//Cargamos el div contenedor
		var cont = document.getElementById('annotate-cont');
		
		//Cogemos la cabecera
		var cabecera = this.book.Get(0);
		
		//Iniciamos el HTML
		var div = '<div class="contenedor-espacio"></div>';
		
		//Guardamos la cabecera
		div = div + this.Div(cabecera, 0, true);
		
		//Cogemos la lista con todos
		var list = this.storage.List();
		
		//Mostramos
		for(var i = 0; i < list.length; i++)
		{
			div = div + this.Div(list[i], i, false);
		}
		
		//Mostramos el contenido
		cont.innerHTML = div;
		
		//Cerramos el menu
		this.CloseMenu();
	};
	
	//Funcion que crea el div necesario
	this.Div = function(txt, i, ini)
	{
		//Separamos el texto
		var t = txt;
		
		//Contamos cuantos hay
		var tam = t.length;
		
		//Iniciamos el div
		var d = '<div class="section-cont" align="center">';
		
		//Iniciamos el ID
		var id = '#';
		
		//Iniciamos el estilo
		var sty = 'section';
		
		//Iniciamos la accion
		var action = '';
		
		//Calculamos la anchura total
		var w_max = document.getElementById('annotate-cont').offsetWidth;
		
		//Calculmos la anchura que debe tener
		var w_min = w_max - 130;
		
		//Quitamos el padding
		w_min = w_min - 5*tam;
		
		//Calculamos la proporcion
		var porc = (w_min/w_max)*100;
		
		//Repartimos entre los que tenemos
		porc = porc/tam;
		
		//Comprobamos si es el primero
		if(ini == false)
		{
			//Si no es el primero, activamos el estilo
			sty = sty + ' section-hover';
			
			//Cogemos el id real
			id = i + 1;
		}
		
		//Ponemos el ID
		d = d + '<div class="section" style="width:45px;">' + id + '</div>';
		
		//Guardamos el resto
		for(var j = 0; j < tam; j++)
		{
			//Comprobamos si es el primero
			if(ini == false)
			{
				//Si no, activamos para poder modificarlo
				action = 'onclick="Annotate.Edit(' + i + ', ' + j + ');"';
			}
			
			//Guardamos la columna en el div
			d = d + '<div class="' + sty + '" style="width:' + porc + '%;" ' + action + '>' + t[j] + '</div>';
		}
		
		//Comprobamos si es el primero para poner o no el boton de eliminar
		if(ini == true)
		{
			//Ponemos el cartel de eliminar
			d = d + '<div class="section" style="width:50px;">Delete</div>';
		}
		else
		{
			//Ponemos el icono de eliminar
			d = d + '<div class="section section-delete" onclick="Annotate.DeleteIndex(' + i + ');">&nbsp;</div>';
		}
		
		//Cerramos el div
		d= d + '</div>';
		
		//Devolvemos el div
		return d;
	};
	
	//Funcion que crea una fila nueva
	this.Add = function()
	{
		//Cogemos el book
		var b = this.book.Get(0);
		
		//Cogemos la dimension
		var tam = b.length;
		
		//Creamos el nuevo array
		var a = new Array();
		
		//Rellenamos
		for(var i = 0; i < tam; i++)
		{
			a[i] = '..';
		}
		
		//Guardamos
		this.storage.Save(a);
		
		//Cerramos el menu
		this.OpenCloseMenu();
		
		//Refrescamos
		this.Create();
	};
	
	//Funcion que borra todos o el seleccionado
	this.DeleteIndex = function(index)
	{
		//Eliminamos el seleccionado
		this.storage.DeleteIndex(index);
		
		//Refrescamos
		this.Create();
		
		//Cerramos el menu
		this.CloseMenu();
	};
	
	//Funcion que confirma
	this.DeleteAll = function()
	{
		//Borramos todo
		this.storage.Delete();
		
		//Refrescamos la lista
		this.Create();
		
		//Cerramos la ventana
		this.WindowClose();
	};	
	
	//Funcion que crea la ventana
	this.Window = function(cont, func)
	{
		//Cogemos el contenedor de ventanas
		var wind = document.getElementById('annotate-window');
		
		//Creamos el contenedor
		var div = '<div class="window-cont" align="center">';
		
		//Espacios
		div = div + '<br><br><br><br>';
		
		//Boton de cerrar
		div = div + '<div class="window-close" onclick="Annotate.WindowClose();"></div>';
		
		//Creamos la ventana contenedora
		div = div + '<div class="window" style="width: 460px;" align="center">';
		
		//Insertamos el contenido
		div = div + cont;
		
		//Cerramos la ventana contendora
		div = div + '</div>';
		
		//Comprobamos si hay funcion asociada al boton de aceptar
		if(func !== null)
		{
			//Boton de aceptar
			div = div + '<div class="window-tic" onclick="' + func + '"></div>';
		}
		
		//Cerramos el contenedor
		div = div + '</div>';
		
		//Lo ponemos
		wind.innerHTML = div;
		
		//Mostramos
		wind.style.display = 'block';
	};
	
	//Funcion que destruye la ventana
	this.WindowClose = function()
	{
		//Cogemos el contenedor de ventanas
		var wind = document.getElementById('annotate-window');
		
		//Eliminamos el contenido
		wind.innerHTML = '';
		
		//Ocultamos
		wind.style.display = 'none';
	};
	
	//Funcion que abre el dialogo para eliminar todo
	this.Delete = function()
	{
		//Contenido
		var cont = '<b>Are you sure?</b><br><br>';
		
		//Funcion
		var func =  'Annotate.DeleteAll();'; 
		
		//Mostramos
		this.Window(cont, func);
		
		//Cerramos el menu
		this.OpenCloseMenu();
	};
	
	//Funcion que abre el editor
	this.Edit = function(n, c)
	{
		//Cogemos el texto y lo separamos
		var txt = this.storage.Get(n);
		
		//Cogemos el book y lo separamos
		var b = this.book.Get(0);
		
		//Contenido
		var cont = '<b>Edit record ' + (n + 1) + ': ' + b[c] + '</b><br><br>';
		
		//Comprobamos que no sean dos punto
		if(txt[c] == '..')
		{
			//Quitamos los dos puntos
			txt[c] = '';
		}
		
		//Input
		cont = cont + '<input type="text" id="annotate-modif" class="input" value="' + txt[c] + '">';
		
		//Espacios
		cont = cont + '<br>';
		
		//Funcion
		var func = 'Annotate.Save(' + n + ', ' + c + ');';
		
		//Mostramos
		this.Window(cont, func);
		
		//Cerramos el menu
		this.CloseMenu();
	};

	//Funcion que guarda el registro
	this.Save = function(n, c)
	{
		//Cogemos el texto original separado
		var txt = this.storage.Get(n);
		
		//Cogemos el que ha modificado
		var input = document.getElementById('annotate-modif').value;
		
		//Comprobamos que no hayan espacios
		input = input.replace('&nbsp;', ' ');
		
		//Comprobamos que no es vacio
		if(input == '' || input == ' ')
		{
			//Rellenamos
			input = '..';
		}
		
		//Modificamos
		txt[c] = input;
		
		//Guardamos
		this.storage.Set(n, txt);
		
		//Cerramos la ventana
		this.WindowClose();
		
		//Refrescamos la lista
		this.Create();
	}
	
	//Funcion que guarda el contenido
	this.Download = function()
	{
		//Cogemos la lista con todos
		var list = this.storage.List();
		
		//Cogemos el book
		var b = this.book.Get(0);
		
		//Creamos el string
		var cont = '';
		
		//Nombre de la aplicacion
		cont = cont + '** \n';
		cont = cont + '** Annotate! for TilingScan. \n';
		cont = cont + '** https://tilingscan.github.io/annotate \n';
		cont = cont + '** \n';
		cont = cont + '\n';
		
		//Guardamos el simbolo del id
		cont = cont + '#	';
		
		//Ponemos la cabecera
		for(var i = 0; i < b.length; i++)
		{
			//Eliminamos el <b>
			b[i] = b[i].replace('<b>', '');
			b[i] = b[i].replace('</b>', '');
			
			//Situamos con tabulador
			cont = cont + b[i] + '	';
		}
		
		//Salto de linea
		cont = cont + '\n';
		
		//Rellenamos
		for(var i = 0, l = list.length; i < l; i++)
		{
			//separamos
			var t = list[i];
			
			//Creamos la region
			var id = i + 1;
			
			//Guardamos la region
			cont = cont + id + '	';
			
			//Guardamos el resto de valores
			for(var j = 0, k = t.length; j < k; j++)
			{
				cont = cont + t[j] + '	';
			}
			
			//Fin de linea
			cont = cont + ' \n';
		}
		
		//Creamos el zip
		var zip = new JSZip();
		
		//Ponemos el txt en el zip
		zip.file('annotate.txt', cont);
		
		//Generamos el zip
		var content = zip.generate({type:'blob'});
		
		//Descargamos
		saveAs(content, 'annotate.zip');
		
		//Cerramos el menu
		this.OpenCloseMenu();
	};
	
	
	//Funcion que coge el GET
	this.Get = function()
	{
		//Iniciamos el contenedor
		var get = new Array();
		
		//Cogemos la url actual
		var loc = document.location.href;
		
		//Separamos y nos quedamos a partir del ?
		var getString = loc.split('?')[1];
		
		//Comprobamos que no este vacio
		if (typeof getString != 'undefined')
		{
			//Volvemos a separar en trozos que empiezen por &
			var GET = getString.split('&');
			
			//Cogemos todos
			for(var i = 0, l = GET.length; i < l; i++)
			{
				//Separamos el actual en las dos partes en que separa el =
				var tmp = GET[i].split('=');
				
				//Lo sumamos al contenedor
				get[i] = unescape(decodeURI(tmp[1]));
			}
		}
		
		//Devolvemos
		return get;
	};
	
	//Funcion que abre/cierra el menu
	this.OpenCloseMenu = function()
	{
		//Cogemos el menu
		var div = document.getElementById('annotate-menu');
		
		//Mostramos/ocultamos
		div.style.display = (div.style.display == 'block') ? 'none': 'block';
	};
	
	//Funcion que cierra el menu
	this.CloseMenu = function()
	{
		//Cerramos el menu
		document.getElementById('annotate-menu').style.display = 'none';
	};
	
	//Funcion acerca de
	this.About = function()
	{
		//Titulo
		var cont = '<font size="30px">Annotate!</font><br>';
		
		//Informacion
		cont = cont + 'Annotate! Is a tool that allows the annotation of manually selected ';
		cont = cont + 'regions of interest in TiligScan.<br><br>';
		
		//Copyright
		cont = cont + '&copy; 2014 Vicente Arnau, Jose E. Perez, Ana Miguel &amp; Jose M. Juanes.';
		
		//Espacios
		cont = cont + '<br><br>';
		
		//Abrimos la ventana
		this.Window(cont, null);
		
		//Cerramos el menu
		this.OpenCloseMenu();
	};
};


