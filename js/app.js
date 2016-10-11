window.Perceptron = {

	init : function(){
		var self = this;

		if(!self.tmpl)
			self.tmpl = $('#tmpl-muestra').text();

		if(self.load() == false){
			self.data = {
				nombre : 'Nuevo Perceptrón',
				razon : 0.9,
				muestras : [],
				entrenado : false,
				pesos : self.getPesos(),
			};
			self.saved = false;
		}

		self.render();
	},

	getPesos : function(){
		var getRandom = function(){
			var n = Math.round((Math.random()-0.5)*100)/100;
			if(n == 0) return getRandom();
			return n;
		}
		return {
			w1 : getRandom(),
			w2 : getRandom(),
			w3 : getRandom(),
		}
	},

	nuevosPesos : function(){
		var self = this;
		self.data.pesos = self.getPesos();
		self.saved = false;
		self.data.entrenado = false;
		self.render();
	},

	load : function(){
		var self = this;

		if(!localStorage.data) return false;

		self.data = JSON.parse(localStorage.data);
		Materialize.toast('Datos Cargados', 2000);

		self.saved = true;
		return true;
	},

	save : function(){
		var self = this;
		localStorage.setItem('data', JSON.stringify(self.data));
		Materialize.toast('Datos Guardados', 2000);
		self.saved = true;
	},

	editNombre : function(){
		var self = this;
		var nombre = window.prompt('Nombre para el proyecto:', self.data.nombre);
		if(nombre){
			self.data.nombre = nombre;
			self.render();
			self.saved = false;
		}
	},

	editRazon : function(){
		var self = this;
		var razon = parseFloat(window.prompt('Coeficiente de aprendizaje (entre 0 y 1):', self.data.razon));
		if(!isNaN(razon) && razon>0 && razon<1){
			self.data.razon = razon;
			self.render();
			self.saved = false;
		}else{
			Materialize.toast('Coeficiente no válido', 1000);
		}
	},

	render : function(){
		var self = this;
		$('#app-nombre').text(self.data.nombre);
		$('#app-razon').text(self.data.razon);

		$('#app-recta-w1').text(self.data.pesos.w1);
		$('#app-recta-w2').text(self.data.pesos.w2);
		$('#app-recta-w3').text(self.data.pesos.w3);

		$('#app-muestras').empty();
		self.data.muestras.forEach(function(el, i){
			self.renderMuestra(el).prependTo('#app-muestras');
		});
	},

	restart : function(){
		var self = this;
		if(window.confirm('¿Seguro que desea reiniciar?')){
			localStorage.clear();
			self.init();
		}
	},

	addMuestra : function(){
		var self = this;

		var inp = window.prompt('Ingrese muestra: Ej: 0.3,0.63,A');
		if(!inp) return;

		var inp = inp.split(',');
		if(inp.length!=3){
			Materialize.toast('Formato de muestra incorrecto', 1500); 
			return;
		}

		var m = {
			x : parseFloat(inp[0].trim()),
			y : parseFloat(inp[1].trim()),
			clase : inp[2].trim().toUpperCase(),
		};

		self.data.muestras.push(m);
		self.render();
	},

	renderMuestra : function(muestra){
		var self = this;
		var $m = $(self.tmpl);
		$m.find('.muestra-x').text(muestra.x);
		$m.find('.muestra-y').text(muestra.y);
		$m.find('.muestra-clase').text(muestra.clase);
		$m.find('.muestra-quitar').click(function(ev){
			ev.preventDefault();
			$m.remove();
			self.render();
		});
		return $m;
	},


	entrenar : function(){
		var self = this;

		if(self.data.muestras.length<3){
			Materialize.toast('Debe tener mínimo 3 muestras', 2000);
			return;
		}

		$('#app-addMuestra').attr('disabled', 'disabled');
		$('#app-entrenar').attr('disabled', 'disabled');
		$('#app-consultar').attr('disabled', 'disabled');

		self.evaluar(0);
	},

	evaluar : function(i){
		var self = this;

		var m = self.data.muestras[i];
		var w = self.data.pesos;
		var r = self.data.razon;

		m.c = (m.clase=='A') ? 0 : 1 ;

		var net = (m.x)*(w.w1) + (m.y)*(w.w2) + (w.w3);
		var d = (net>0) ? 1 : 0 ;

		if(d != m.c){
			//Corregir Pesos
			w.w1 = w.w1 + (r*(m.c - d)*m.x);
			w.w2 = w.w2 + (r*(m.c - d)*m.y);
			w.w3 = w.w3 + (r*(m.c - d)*1);

			self.data.pesos = w;
		}

		i++;
		if(i < self.data.muestras.length){
			self.render();
			window.setTimeout(function(){
				self.evaluar(i);
			}, 1000);
		}else{
			$('#app-addMuestra').removeAttr('disabled');
			$('#app-entrenar').removeAttr('disabled');
			$('#app-consultar').removeAttr('disabled');
			Materialize.toast('Entrenamiento correto', 3000);
			self.data.entrenado = true;
		}
	},

	consultar : function(){
		var self = this;

		if(!self.data.entrenado){
			Materialize.toast('Debe entrenar primero', 3000);
			return;
		}

		var inp = window.prompt('Ingrese coordenada: Ej: -3,4.5');
		if(!inp) return;

		var inp = inp.split(',');
		if(inp.length!=2){
			Materialize.toast('Formato de coordenada incorrecto', 1500); 
			return;
		}

		var c = {
			x : parseFloat(inp[0].trim()),
			y : parseFloat(inp[1].trim()),
		};

		var w = self.data.pesos;
		var net = (c.x)*(w.w1) + (c.y)*(w.w2) + (w.w3);
		debugger;
		var d = (net>0) ? 'B' : 'A' ;
		
		alert('La coordenada ('+c.x+','+c.y+') es de clase '+d);
	}

};