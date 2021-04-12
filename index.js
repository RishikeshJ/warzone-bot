const API = require('call-of-duty-api')();
const Discord = require('discord.js');
const client = new Discord.Client();
const path = require('path');
const loadPath = path.join(__dirname, './process.env');
require('dotenv').config({ silent: false, path: loadPath });
discord_actions()
async function discord_actions(){
    client.on('ready', () => {
        console.log(`Logged in...`);
      });
      client.on('message', msg => {

          const args = msg.content.split(' ')
          if(args[0] == '!hneh'){
              if(args[1] == 'plunder'){
                cod_get(args[2], args[3]).then((stats)=>{
                    if(stats == 'Error'){
                        msg.reply('error in request')
                    } else {
                        stats_msg = `${args[2]} killed ${stats.kills} people and made ${stats.headshots} headshots in ${stats.matches} matches last week, they died ${stats.deaths} times.`
                        msg.reply(JSON.stringify(stats_msg))
                    }
                })
              }
          }
      });
      
      client.login(process.env.discord_token);
      console.log(`Your port is ${process.env.discord_token}`);
}


async function cod_get(uid, platform){
    return new Promise(async function(resolve, reject){
        var return_obj = {}
        try {
            await login()
            let data = await API.MWweeklystats(uid, platform)
            const pl_quad = data.wz.mode.br_dmz_plunquad.properties;
            const pl_trio = data.wz.mode.br_dmz_plndtrios.properties;
            return_obj = {
                kills: pl_quad.kills + pl_trio.kills,
                deaths: pl_quad.deaths + pl_trio.deaths,
                headshots: pl_quad.headshots + pl_trio.headshots,
                matches: pl_quad.matchesPlayed + pl_trio.matchesPlayed
            }
        } catch (error) {
            resolve('Error')
        }
        resolve(return_obj)
    })
}

async function login(){
    try {
        await API.login(process.env.activision_uid, process.env.activision_pwd);
     } catch(Error) {
        console.log(Error)
     }
}
