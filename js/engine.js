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
	var knight = [[game.attack,0],[game.armor,1],[game.agility,2],[game.endurance,3]];
	var dragon = [0,0,0,0];
	var dragon_JSON = '';
	knight.sort(function(a,b){return a[0]<b[0];});
	if (game.weather_code == 'NMR' || game.weather_code == 'NONE' || game.weather_code == 'FUNDEFINEDG'){
		for (var i = 0; i<knight.length; i++){
			if(i == 0){
				dragon[knight[i][1]] = knight[i][0]+2;
				available_points = available_points - dragon[knight[i][1]];
			}else if (i == 3){
				dragon[knight[i][1]] = available_points;
			}else{
				dragon[knight[i][1]] = knight[i][0]-1;
				available_points = available_points - dragon[knight[i][1]];					
			}
		}
		dragon_JSON = createJSONObj(dragon);
	}else if (game.weather_code == 'HVA'){
		dragon=[5,10,5,0];
		dragon_JSON = createJSONObj(dragon);
	}else if (game.weather_code == 'T E'){
		dragon = [5,5,5,5];
		dragon_JSON = createJSONObj(dragon);
	}
	theBattle(dragon_JSON,game);
};
function createJSONObj(dragon){
	var dragon_JSON = '{"dragon": {"scaleThickness": '+ dragon[0] +',"clawSharpness": '+ dragon[1] +',"wingStrength": '+ dragon[2] +',"fireBreath": '+ dragon[3] +'}}';
	return dragon_JSON;
}
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