const joinedAt = require("../schemas/voiceJoinedAt");
const voiceUser = require("../schemas/voiceUser");
const voiceGuild = require("../schemas/voiceGuild");
const guildChannel = require("../schemas/voiceGuildChannel");
const userChannel = require("../schemas/voiceUserChannel");
const userParent = require("../schemas/voiceUserParent");
const { MessageEmbed } = require("discord.js");
const coin = require("../schemas/coin");
const conf = require("../configs/sunucuayar.json");
const config = require("../configs/sunucuayar.json");
const ayar = require("../configs/settings.json")
const dolar = require("../schemas/dolar")
const client = global.client;

module.exports = async (oldState, newState) => {
  if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
  
  if (!oldState.channelID && newState.channelID) await joinedAt.findOneAndUpdate({ userID: newState.id }, { $set: { date: Date.now() } }, { upsert: true });

  let joinedAtData = await joinedAt.findOne({ userID: oldState.id });

  if (!joinedAtData) await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  joinedAtData = await joinedAt.findOne({ userID: oldState.id });
  const data = Date.now() - joinedAtData.date;

  if (oldState.channelID && !newState.channelID) {
    await saveDatas(oldState, oldState.channel, data);
    await joinedAt.deleteOne({ userID: oldState.id });
  } else if (oldState.channelID && newState.channelID) {
    await saveDatas(oldState, oldState.channel, data);
    await joinedAt.findOneAndUpdate({ userID: oldState.id }, { $set: { date: Date.now() } }, { upsert: true });
  }
};

async function saveData(user, channel, data) {
  if (config.staffs.some(e => user.member.roles.cache.has(e))) {
    if (channel.parent && config.publicParents.includes(channel.parentID)) {
      if (data >= (1000 * 60) * ayar.voiceCount) await coin .findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / Number(ayar.voiceCoin)) * Number(ayar.publicCoin) } }, { upsert: true });
    } else if (data >= (1000 * 60) * ayar.voiceCount) await coin .findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { coin: Math.floor(parseInt(data/1000/60) / Number(ayar.voiceCoin)) * Number(ayar.voiceCoin) } }, { upsert: true });
    const coinData = await coin .findOne({ userID: user.id });
    if (coinData && client.ranks.some(e => e.coin  >=coinData.coin)) {
      let newRank = client.ranks.filter(e => cointData.coin >= e.coin);
      newRank = newRank[newRank.length-1];
      if (newRank && Array.isArray(newRank.role) && !newRank.role.some(e => user.member.roles.cache.has(e)) || newRank && !Array.isArray(newRank.role) && !user.member.roles.cache.has(newRank.role)) {
        const oldRank = client.ranks[client.ranks.indexOf(newRank)-1];
        if (oldRank && Array.isArray(oldRank.role) && oldRank.role.some(e => user.member.roles.cache.has(e)) || oldRank && !Array.isArray(oldRank.role) && user.member.roles.cache.has(oldRank.role)) user.member.roles.remove(oldRank.role);
        await user.member.roles.add(newRank.role);
        await user.member.roles.add(newRank.hammers);
        const embed = new MessageEmbed()
          .setColor(user.member.displayHexColor);
        user.guild.channels.cache.get(config.rankLog).send(embed.setDescription(`${user.member.toString()} kullanıcısı \`${pointData.coin}\` puan hedefini tamamladı ve ${Array.isArray(newRank.role) ? newRank.role.map(e => `<@&${e}>`).join(", ") : `<@&${newRank.role}>`} rolü verildi!`));
      }
    }
  }

  if (channel.parent && conf.publicParents.includes(channel.parentID)) {
    if (data >= (1000 * 60) * conf.voiceCount) await dolar.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { dolar: ayar.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });
  } else if (data >= (1000 * 60) * conf.voiceCount) await dolar.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { dolar: ayar.voiceDolar * parseInt(data/1000/60) } }, { upsert: true });

  await voiceUser.findOneAndUpdate({ guildID: user.guild.id, userID: user.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await voiceGuild.findOneAndUpdate({ guildID: user.guild.id }, { $inc: { topStat: data, dailyStat: data, weeklyStat: data, twoWeeklyStat: data } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: user.guild.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, channelID: channel.id }, { $inc: { channelData: data } }, { upsert: true });
  if (channel.parent) await userParent.findOneAndUpdate({ guildID: user.guild.id, userID: user.id, parentID: channel.parentID }, { $inc: { parentData: data } }, { upsert: true });

}

module.exports.conf = {
  name: "voiceStateUpdate",
};