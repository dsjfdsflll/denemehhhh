const moment = require("moment");
require("moment-duration-format");
const conf = require("../../configs/sunucuayar.json");
const voiceUserParent = require("../../schemas/voiceUserParent");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const cezapuan = require("../../schemas/cezapuan");
const coin = require("../../schemas/coin");
const taggeds = require("../../schemas/taggeds");
const yetkis = require("../../schemas/yetkis");
const ceza = require("../../schemas/ceza");
const toplams = require("../../schemas/toplams");
const inviterSchema = require("../../schemas/inviter");
const {  rewards, miniicon, mesaj2, staff, galp ,Muhabbet ,star , fill, empty, fillStart, emptyEnd, fillEnd, red } = require("../../configs/emojis.json");
const { TeamMember, MessageEmbed } = require("discord.js");
const { MessageButton,MessageActionRow } = require('discord-buttons');

let embed2 = new MessageEmbed().setColor("RANDOM");

module.exports = {
  conf: {
    aliases: ["pushayt"],
    name: "pushayt",
    help: "pushayt"
  },

  run: async (client, message, args, embed) => {  
    if(!conf.staffs.some(rol => message.member.roles.cache.has(rol))) return message.react(red)
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!conf.staffs.some(rol => member.roles.cache.has(rol))) return message.react(red)


    let yetkilipermleri = [
    
      "926808085840949269",
      "926808065074933772",
      "926806203852525589",
      "926809197910315018",
      "926806198777446410",
      "926806189914869824", 
      "926806193979158588",
      "924741319446913034",
      "926822022451970049",
      ""]
      
      let komutpermleri = [
        "926809529360977950", 
        "926811625032396820", 
        "926812900964827169", 
        "926811667076108298"
      , "926811647346102282"]
        let skillpermleri = [
          "926806184743292958", 
          "924684545763205140", 
          "926896606480039957",]


    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const messageDaily = messageData ? messageData.dailyStat : 0;
    
    const coinData = await coin.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });

 

    const maxValue = client.ranks[client.ranks.indexOf(client.ranks.find(x => x.coin >= (coinData ? coinData.coin : 0)))] || client.ranks[client.ranks.length-1];
    const taggedData = await taggeds.findOne({ guildID: message.guild.id, userID: member.user.id });
    const toplamData = await toplams.findOne({ guildID: message.guild.id, userID: member.user.id });
    const yetkiData = await yetkis.findOne({ guildID: message.guild.id, userID: member.user.id });
    const cezaData = await ceza.findOne({ guildID: message.guild.id, userID: member.user.id });


const inviterData = await inviterSchema.findOne({ guildID: message.guild.id, userID: member.user.id });
    const total = inviterData ? inviterData.total : 0;

        const category = async (parentsArray) => {
        const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.id });
        const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
        let voiceStat = 0;
        for (var i = 0; i <= voiceUserParentData.length; i++) {
          voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
        }
        return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
      };
      
      let currentRank = client.ranks.filter(x => (coinData ? coinData.coin : 0) >= x.coin);
      currentRank = currentRank[currentRank.length-1];

      const coinStatus = message.member.hasRole(conf.staffs, false) && client.ranks.length > 0 ?
      `${currentRank ?`
      ${currentRank !== client.ranks[client.ranks.length-1] ? `Şu an ${Array.isArray(currentRank.role) ? currentRank.role.map(x => `<@&${x}>`).join(", ") : `<@&${currentRank.role}>`} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin-coinData.coin}\` puan daha kazanmanız gerekiyor!` : "Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz. :)"}` : ` 
      Şuan ${message.member.roles.highest} rolündesiniz. ${Array.isArray(maxValue.role) ? maxValue.role.length > 1 ? maxValue.role.slice(0, -1).map(x => `<@&${x}>`).join(', ') + ' ve ' + maxValue.role.map(x => `<@&${x}>`).slice(-1) : maxValue.role.map(x => `<@&${x}>`).join("") : `<@&${maxValue.role}>`} rolüne ulaşmak için \`${maxValue.coin - (coinData ? coinData.coin : 0)}\`  Puan daha kazanmanız gerekiyor!`}` : ""
      

      var button_1 = new MessageButton()
      .setID("1")
      .setLabel("Yetki Yükselt")
      .setStyle("green")
      .setEmoji("⬆️")
      
      var button_2 = new MessageButton()
      .setID("2")
      .setLabel("İptal")
      .setStyle("gray")
      .setEmoji("❌")
      
      var button_3 = new MessageButton()
      .setID("3")
      .setLabel("Yetkileri Düşür")
      .setStyle("red")
      .setEmoji("⬇️")
     
  

    const row = new MessageActionRow()
    .addComponents(button_1, button_3, button_2)

embed.setDescription(`
${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.
`)

.addFields(
{ name: "__**Toplam Ses**__",  value: `
\`\`\`fix
${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}
\`\`\`
`, inline: true },
{ name: "__**Toplam Mesaj**__",  value: `
\`\`\`fix
${messageData ? messageData.topStat : 0} mesaj
\`\`\`
`, inline: true },
{ name:"__**Toplam Kayıt**__",  value: `
\`\`\`fix
${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
)
  
.addFields(
{ name: "__**Toplam Davet**__", value: `
\`\`\`fix
${inviterData ? `${total} regular`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
{ name: "__**Toplam Taglı**__", value: `
\`\`\`fix
${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
{ name: "__**Toplam Yetkili Adayı**__", value: `
\`\`\`fix
${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}
\`\`\`
`, inline: true }
)
  
  
  embed.addField(`${star} **Sesli Sohbet İstatistiği**`, `
  ${miniicon} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
  ${miniicon} Public Odalar: \`${await category(conf.publicParents)}\`
  ${miniicon} Secret Odalar: \`${await category(conf.privateParents)}\`
  ${miniicon} Alone Odalar: \`${await category(conf.aloneParents)}\`
  ${miniicon} Kayıt Odaları: \`${await category(conf.registerParents)}\`
  ${miniicon} Yönetim Yetkili Odaları: \`${await category(conf.funParents)}\`
   `, false);
  
  
  embed.addField(`${star} **Mesaj İstatistiği**`, `
  ${miniicon} Toplam: \`${messageData ? messageData.topStat : 0}\`
  ${miniicon} Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
  ${miniicon} Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
   `, false);

   

   let msg = await message.channel.send(embed, { components: [row], });
   var filter = (button) => button.clicker.user.id === message.author.id;
  
   let collector = await msg.createButtonCollector(filter, { time: 99999999 })
   collector.on("collect", async (button) => {


      if(button.id === "1") {
        msg.delete()
        await button.reply.defer()
        let yetkiNumber;
        let sahipOlunanRol = Number();
        for (yetkiNumber = 0; yetkiNumber < config.Yetkiler.length ; yetkiNumber++) {
          if(member.roles.cache.has(config.Yetkiler[yetkiNumber])) {
            sahipOlunanRol += yetkiNumber
          };
        }  
     if(!member.roles.cache.has(config.Yetkiler[config.Yetkiler.length-1])){
        await member.roles.add(config.Yetkiler[sahipOlunanRol+1]).catch(e => { })
        await member.roles.remove(config.Yetkiler[sahipOlunanRol]).catch(e => { })
        await message.channel.send(embed2.setDescription(`${member} Kullanısı <@&${config.Yetkiler[sahipOlunanRol+1]}> Yetkisine Başarılı bir Şekilde Yükseltildi.`)).catch(e => { })
        await client.channels.cache.get("926900275682361434").send(embed2.setDescription(`${member} adlı kullanıcı <@&${config.Yetkiler[sahipOlunanRol+1]}> yetkisine yükseltildi.`))

      } else { 
        message.channel.send(embed2.setDescription(`:x: Belirtilen Kullanıcı Zaten Max Role Sahip.`)).catch(e => { }) }
    
              }

    if(button.id === "3") {
      msg.delete()
      let yetkiNumber;
      let sahipOlunanRol = Number();
      for (yetkiNumber = 0; yetkiNumber < config.Yetkiler.length ; yetkiNumber++) {
        if(member.roles.cache.has(config.Yetkiler[yetkiNumber])) {
          sahipOlunanRol += yetkiNumber
        };
      }  
      if(!member.roles.cache.has(config.Yetkiler[0])){
      await member.roles.add(config.Yetkiler[sahipOlunanRol-1]).catch(e => { })
      await member.roles.remove(config.Yetkiler[sahipOlunanRol]).catch(e => { })
      await message.channel.send(embed2.setDescription(`${member} Kullanısı <@&${config.Yetkiler[sahipOlunanRol-1]}> Yetkisine Başarılı bir Şekilde Düşürüldü.`)).catch(e => { })
      await client.channels.cache.get("926900275682361434").send(embed2.setDescription(`${member} adlı kullanıcı <@&${config.Yetkiler[sahipOlunanRol-1]}> yetkisine düşürüldü.`))

    } else {
      message.channel.send(embed2.setDescription(`${member} adlı kullanıcısı zaten suanda başlangıç yetkisinde yetkisini almak için tepkiye tıkla.
      ${member} adlı kullanıcının Yetkisi: ${wexfilter.length ? wexfilter.map(x => `<@&${x}>`): "Bulunamadı."},${wexfilter2.length ? wexfilter2.map(x => `<@&${x}>`): "Bulunamadı."}`)).then(async msj => {
      await msj.react('✅');
     const kabul = (reaction, member) => {
      return ['✅'].includes(reaction.emoji.name) && member.id === message.author.id;
    };
  msj.awaitReactions(kabul, {max: 1, time: 50000, error: ['time']}).then(async c => {
    let cevap = c.first();
    if (cevap) {
      message.lineReply("Yetkilinin [Yetki-Rolleri] (\`Sirius Of Astana\` , \`Register Hammer\`) rolleri başarılı bir şekilde alındı.")
     await msj.delete().catch(e => { });
     member.roles.remove("926808085840949269")
     member.roles.remove("926809529360977950")
      await button.reply.defer()

    }
        

      if(button.id === "2") {
        await button.reply.defer()
        const iptal = new MessageEmbed()
        .setDescription(`
${member.toString()}, (${member.roles.highest}) üyesinin \`${moment(Date.now()).format("LLL")}\` tarihinden  itibaren \`${message.guild.name}\` sunucusunda toplam ses ve mesaj bilgileri aşağıda belirtilmiştir.
`)

.addFields(
{ name: "__**Toplam Ses**__",  value: `
\`\`\`fix
${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}
\`\`\`
`, inline: true },
{ name: "__**Toplam Mesaj**__",  value: `
\`\`\`fix
${messageData ? messageData.topStat : 0} mesaj
\`\`\`
`, inline: true },
{ name:"__**Toplam Kayıt**__",  value: `
\`\`\`fix
 ${toplamData ? `${toplamData.toplams.length} kişi`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
)
  
.addFields(
{ name: "__**Toplam Davet**__", value: `
\`\`\`fix
${inviterData ? `${total} regular`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
{ name: "__**Toplam Taglı**__", value: `
\`\`\`fix
${taggedData ? `${taggedData.taggeds.length} kişi`: "Veri bulunmuyor."} 
\`\`\`
`, inline: true },
{ name: "__**Toplam Yetkili Adayı**__", value: `
\`\`\`fix
${yetkiData ? `${yetkiData.yetkis.length} kişi` : "Veri bulunmuyor."}
\`\`\`
`, inline: true }
)
  
  
  iptal.addField(`${star} **Sesli Sohbet İstatistiği**`, `
  ${miniicon} Toplam: \`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}\`
  ${miniicon} Public Odalar: \`${await category(conf.publicParents)}\`
  ${miniicon} Secret Odalar: \`${await category(conf.privateParents)}\`
  ${miniicon} Alone Odalar: \`${await category(conf.aloneParents)}\`
  ${miniicon} Yönetim Yetkili Odaları: \`${await category(conf.funParents)}\`
  ${miniicon} Kayıt Odaları: \`${await category(conf.registerParents)}\`
   `, false);
  
  
   iptal.addField(`${star} **Mesaj İstatistiği**`, `
  ${miniicon} Toplam: \`${messageData ? messageData.topStat : 0}\`
  ${miniicon} Haftalık Mesaj: \`${Number(messageWeekly).toLocaleString()} mesaj\`
  ${miniicon} Günlük Mesaj: \`${Number(messageDaily).toLocaleString()} mesaj\`
   `, false);

  }

})

})
}
}







})

}
}