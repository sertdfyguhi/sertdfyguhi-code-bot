// this code is messy

// todo:
// add comments

const discord = require('discord.js')
const config = require('./config.json')
const run = require('./run.js')

const client = new discord.Client()

client.on('ready', function(){
  console.log('logged in')
  client.user.setActivity('hey guys do s!help for help')
})

client.on('message', function(message){
  if (message.content === `${config.prefix}help`) {
    const embed = new discord.MessageEmbed()
      .setColor('#3268a8')
      .setTitle('Commands')
      .setDescription('Prefix: `s!`\n\n')
      .addField(
        '**Commands**',
        '`.code {lang} {code}`: executes code.\n`.langs`: all programming languages that is valid.'
      )
      .setFooter('made by sertdfyguhi#5971')

    message.channel.send(embed)
  } else if (message.content === `${config.prefix}langs`) {
    let langs = ''

    for (const lang of run.langs) {
      langs += '`' + lang + '` '
    }

    const embed = new discord.MessageEmbed()
      .setColor('#3268a8')
      .setTitle('Languages')
      .setDescription(langs)
      .setFooter('made by sertdfyguhi#5971')

    message.channel.send(embed)
  } else if (message.content.startsWith(`${config.prefix}code`)) {
    const split = message.content.split(' ')
    let code = message.content.substr(split[0].length + 2 + split[1].length)
    let embed = new discord.MessageEmbed()
      .setTitle('sertdfyguhi\'s code bot')
      .setFooter('Requested by @' + message.author.tag)

    let req;

    if (code.startsWith('\n')) {
      code = code.substring(1)
    }

    if (code.startsWith('```') && code.endsWith('```')) {
      const s = code.split('\n')
      s.pop()
      s.shift()

      code = s.join('\n')
    }

    if (run.langs.includes(split[1].toLowerCase())) {
      const lang_lower = split[1].toLowerCase()

      req = run[lang_lower](code)
      
      if (!req.program_error && !req.compiler_error) {
        if (code != '') {
          embed.addField('Output', '```\n' + req.program_output + '```')
        } else {
          embed.addField('Output', '``` ```')
        }

        embed.setColor('#4aff5c')
      } else {
        if (!req.compiler_error) {
          embed.addField('Output', '```\n' + req.program_error + '```')
        } else {
          embed.addField('Output', '```\n' + req.compiler_error + '```')
        }

        embed.setColor('#ff2b4f')
      }

      embed.addField('permlink', req.url)
      
      if (embed.length > 2000) {
        embed.fields[0].value = 'Program output is too long, please use permlink instead.'
      }

      message.channel.send(embed)
    } else {
      message.channel.send('Invalid language. Please do `.langs` for all the langauges.')
    }
  } else {
    if (message.author != client.user && message.content.startsWith(config.prefix)) {
      message.channel.send('Invalid command.')
    }
  }
})

client.login(process.env.token)
