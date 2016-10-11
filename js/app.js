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
				evaluado : false,
				pesos : {
					w1 : Math.round(((Math.random()*2)-1)*100)/100,
					w2 : Math.round(((Math.random()*2)-1)*100)/100,
					w3 : Math.round(((Math.random()*2)-1)*100)/100,
				}
			};
			self.saved = false;
		}

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

};