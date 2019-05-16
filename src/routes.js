const bodyParser = require('body-parser');
const model = require('./model.js');
const _request = require('request');

var urlencodedParser = bodyParser.urlencoded({ extended: false })




module.exports = function(app) {

  app.get('/', function(request, response) {
    response.render('index.ejs');
  });

  app.post('/train',urlencodedParser, function(request,response) {
    model.trainModel(app);
  });

  app.post('/predict', urlencodedParser,function(request,response) {
    let key = 'F50F9C4B0B022F23427614F9A3A2D71B';
    let url = "http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key="+key+"&steamid="+request.body.id;
    _request(url, function(err, res, body) {
      if(err) {
        console.log(err);
      } else {
        let data = JSON.parse(res.body);
        let playerstats = data.playerstats.stats;

        function getVal(name) {
          for(let i = 0; i < playerstats.length; i++) {
            if(name == playerstats[i].name) {
              return playerstats[i].value;
            }
          }
        }

        function GetWeaponAccuracy(gun) {
          let total_shots = getVal("total_shots_"+gun);
          let total_hits = getVal("total_hits_"+gun);

          return total_hits/total_shots;
        }

        let stats = [];
        let guns = ['ssg08', 'awp', 'deagle', 'aug', 'scar20', 'm4a1', 'ak47', 'bizon', 'elite', 'famas', 'fiveseven', 'g3sg1', 'galilar', 'glock', 'hkp2000', 'm249', 'mac10', 'mag7', 'mp7', 'mp9', 'negev', 'nova', 'p250', 'sawedoff', 'sg556', 'tec9', 'ump45', 'xm1014'];

        stats.push(getVal("total_matches_won")/getVal("total_matches_played"));
        stats.push( getVal("total_shots_hit")/getVal("total_shots_fired"));
        stats.push(getVal("total_kills")/getVal("total_deaths")); // KD Ratio
        stats.push(getVal("total_wins")/(getVal("total_time_played") / 3600)); // Wins per hour
        stats.push(getVal("total_mvps")/getVal("total_rounds_played"));
        stats.push(getVal("total_kills_headshot")/getVal("total_rounds_played"));

        for(let i = 0; i < guns.length; i++) {
          stats.push(GetWeaponAccuracy(guns[i]));
        }

        predict(JSON.stringify(stats), function(results) {
          let io = app.get('socketio');
          io.emit('resultsReady', results);
        
        });

      }
    });
  });

}
