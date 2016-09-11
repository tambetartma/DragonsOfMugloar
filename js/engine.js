//DEFINE GAME CLASS
var classGame = {
	get_knight: function fn(){
		//GET knight
		var xhr_knight = new XMLHttpRequest();
		xhr_knight.open("GET", "http://www.dragonsofmugloar.com/api/game/", false);
		xhr_knight.send();
		var knight_obj = JSON.parse(xhr_knight.response);
		this.gameId = knight_obj.gameId;
		this.name = knight_obj.knight.name;
		this.attack = knight_obj.knight.attack;
		this.armor = knight_obj.knight.armor;
		this.agility = knight_obj.knight.agility;
		this.endurance = knight_obj.knight.endurance;
		return this.gameId, this.name, this.attack, this.armor, this.agility, this.endurance;
	},
	get_weather: function fn(){
		//GET WEATHER
		var xhr_weather = new XMLHttpRequest();
		xhr_weather.open("GET", "http://www.dragonsofmugloar.com/weather/api/report/"+this.gameId, false);
		xhr_weather.send();
		var weather_report = xhr_weather.responseXML;
		this.weather_message = weather_report.getElementsByTagName('message')[0].innerHTML;
		this.weather_code = weather_report.getElementsByTagName('code')[0].innerHTML;
		return this.weather_message, this.weather_code;
	},
	gameId: 0,
    name: "",
    attack: 0,
    armor: 0,
    agility: 0,
    endurance: 0,
    weather_message: "",
    weather_code: ""
};
//START GAME
function createTheGame(fetch_weather){	
	var game = Object.create(classGame);
	game.get_knight();
	if (fetch_weather) {game.get_weather();} else {
		game.weather_message = "No weather was fetched that day";
		game.weather_code = "NONE";
	}
	makeEpicDragon(game);
};
//MAKE EPIC DRAGON
function makeEpicDragon(game){
	var available_points = 20;	
	var scaleThickness = 0;
	var clawSharpness = 0;
	var wingStrength = 0;
	var fireBreath = 0;
	var max = Math.max(game.attack, game.armor, game.agility, game.endurance);
	var min = Math.min(game.attack, game.armor, game.agility, game.endurance);
	if (game.attack == max){
		scaleThickness = game.attack + (10 - game.attack);
		available_points = available_points - scaleThickness;
		if (game.armor == 0){
			clawSharpness = 0;
		}else{
			clawSharpness = game.armor - 1;
		}
		available_points = available_points - clawSharpness;
		if (game.agility == 0){
			wingStrength = 0;
		}else{
			wingStrength = game.agility - 1;
		}
		available_points = available_points - wingStrength;
		fireBreath = available_points;
	}else if (game.armor == max){
		if (game.attack == 0){
			scaleThickness = 0;
		}else{
			scaleThickness = game.attack - 1;
		}
		available_points = available_points - scaleThickness;
		clawSharpness = game.armor + (10 - game.armor);
		available_points = available_points - clawSharpness;
		if (game.agility == 0){
			wingStrength = 0;
		}else{
			wingStrength = game.agility - 1;
		}
		available_points = available_points - wingStrength;
		fireBreath = available_points;
	}else if (game.agility == max){
		if (game.attack == 0){
			scaleThickness = 0;
		}else{
			scaleThickness = game.attack - 1;
		}
		available_points = available_points - scaleThickness;
		if (game.armor == 0){
			clawSharpness = 0;
		}else{
			clawSharpness = game.armor - 1;
		}
		available_points = available_points - clawSharpness;
		wingStrength = game.agility + (10 - game.agility);
		available_points = available_points - wingStrength;
		fireBreath = available_points;
	}else if (game.endurance == max){	
		if (game.attack == 0){
			scaleThickness = 0;
		}else{
			scaleThickness = game.attack - 1;
		}
		available_points = available_points - scaleThickness;
		if (game.armor == 0){
			clawSharpness = 0;
		}else{
			clawSharpness = game.armor - 1;
		}
		available_points = available_points - clawSharpness;
		fireBreath = game.endurance + (10 - game.endurance);
		available_points = available_points - fireBreath
		wingStrength = available_points;
	}	
	var dragon;
	if (game.weather_code == 'SRO'){
		dragon = '{"dragon": 0}';
	} else if (game.weather_code == 'T E'){
		dragon = '{"dragon": {"scaleThickness": 5,"clawSharpness": 5,"wingStrength": 5,"fireBreath": 5}}'
	} else if (game.weather_code == 'HVA'){		
		available_points = 20;
		fireBreath = 0;	
		clawSharpness = 10;
		available_points = available_points - clawSharpness;
		if (game.attack == 0){
			scaleThickness = 0;
		}else{
			scaleThickness = game.attack - 1;
		}
		available_points = available_points - scaleThickness;
		wingStrength = available_points;
		dragon = '{"dragon": {"scaleThickness": '+ scaleThickness +',"clawSharpness": '+ clawSharpness +',"wingStrength": '+ wingStrength +',"fireBreath": '+ fireBreath +'}}';
	} 
	else {
		dragon = '{"dragon": {"scaleThickness": '+ scaleThickness +',"clawSharpness": '+ clawSharpness +',"wingStrength": '+ wingStrength +',"fireBreath": '+ fireBreath +'}}';
	}
	theBattle(dragon,game);
};
//BATTLE
function theBattle(dragon,game){
	$.ajax({	
	  	url: "http://www.dragonsofmugloar.com/api/game/"+game.gameId+"/solution",
	  	type: "PUT",
	  	data: dragon,
	  	contentType: "application/json",
	  	success: function(data) {
		    log(data,game,dragon);
	  	}
	});
}
//LOG RESULTS
var victory = 0;
var defeat = 0;
function log(data,game,dragon){
	if (data.status == "Victory"){
		victory = victory+1;
	}else if (data.status == "Defeat"){
		defeat = defeat+1;
	}
	var newline = '<hr class="style1"></hr><div class="row"><div class="col-sm-2 text-center"><h3 class="text-center">GameID: '+game.gameId+' </h3></div><div class="col-sm-8 text-center"><div class="row"><div class="col-sm-12 text-center"><strong>KNIGHT:</strong> Name - '+game.name+' | Attack - '+game.attack+' | Armor - '+game.armor+' | Agility - '+game.agility+' | Endurance - '+game.endurance+'</div></div><hr class="style2"></hr><div class="row"><div class="col-sm-12 text-center"><strong>WEATHER:</strong> ('+game.weather_code+') '+game.weather_message+'</div></div><hr class="style2"></hr><div class="row"><div class="col-sm-12 text-center"><strong>DRAGON:</strong> '+dragon+'</div></div><hr class="style2"></hr><div class="row"><div class="col-sm-12 text-center"><strong>RESULT MESSAGE:</strong> '+data.message+'</div></div></div><div class="col-sm-2 text-center"><h3 class="text-center">Game result: '+data.status+'</h3></div></div>'
	var log = document.getElementById("log");
	log.innerHTML = log.innerHTML + newline;
	var win_rate = document.getElementById("win_rate");
	var win_percent = Math.round((victory * 100)/(victory + defeat));
	win_rate.style.width = win_percent + "%";
	win_rate.innerHTML = "WIN RATE " + win_percent + "%";
}
function toTheBattle(){
	var count = document.getElementById('count').value;
	var choice = document.getElementById('choice_one').innerHTML;
	var weather = true;
	if(choice == "Fetch weather"){
		weather = true;
	}else{
		weather = false;
	}
	if (count >>> 0 === parseFloat(count)){
		for (var i = 0; i < count; i++) {
   			createTheGame(weather);
		}
	}else{
		alert("Please select integer as a battle count!");
	}
}
function switchChoice(){
	var choice_one = document.getElementById('choice_one').innerHTML;
	var choice_two = document.getElementById('choice_two').innerHTML;
	document.getElementById('choice_one').innerHTML = choice_two;
	document.getElementById('choice_two').innerHTML = choice_one;
}