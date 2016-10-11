window.Perceptron = {

	init : function(){
		var self = this;

		if(!self.load()){
			self.data = {
				nombre : 'Nuevo Perceptrón',
				razon : 0.9,
				muestras : [],
				evaluado : false,
				pesos : {
					w1 : ((Math.random()*2)-1),
					w2 : ((Math.random()*2)-1),
					w3 : ((Math.random()*2)-1),
				}
			};
			self.saved = false;
		}

		self.render();
	},

	load : function(){
		var self = this;
		if(!localStorage.data) 
			return false;

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
		$('select').material_select();
	},

	restart : function(){
		var self = this;
		if(window.confirm('¿Seguro que desea reiniciar?')){
			localStorage.clear();
			self.init();
		}
	},

};