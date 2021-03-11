//https://discord.com/api/oauth2/authorize?client_id=819097609750446091&permissions=36768832&scope=bot
//!kaamBot play kadoc
const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();
const prefix = "!kaamBot ";
const listQuotes = require("./sounds.json");

function search(str) {
  const searchRegExp = new RegExp(str, "gi");
  return listQuotes.filter((quote) => {
    return (
      searchRegExp.test(quote.title) ||
      searchRegExp.test(quote.character) ||
      searchRegExp.test(quote.episode)
    );
  });
}

function playSound(message, quote) {
  if (!message.member.voice.channel)
    return message.reply("You must be in a voice channel.");
  if (message.guild.me.voice.channel)
    return message.reply("I'm already playing.");

  message.member.voice.channel
    .join()
    .then((VoiceConnection) => {
      VoiceConnection.play(`./sounds/${quote.file}`).on("finish", () =>
        VoiceConnection.disconnect()
      );
      message.channel.send(`${quote.title} - ${quote.episode}`);
    })
    .catch((e) => console.log(e));
}

client.on("message", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  const text = args.join(" ");
  if (command === "play") {
    //Search for a file
    //if found
    //if not found
    let result = search(text);
    if (result.length > 10) {
      result = result.slice(0, 10);
    }
    if (result.length === 0) message.channel.send("No result");
    if (result.length === 1) playSound(message, result[0]);
    if (result.length > 1) {
      let filter = (m) => m.author.id === message.author.id;
      let i = 0;
      let resultText = "";
      const txtmap = result.map((quote) => {
        const txt = i + "-" + quote.title + ";\n";
        resultText += txt;
        i++;
        return txt;
      });

      message.channel.send(resultText).then(() => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ["time"],
          })
          .then((responseMessage) => {
            const answer = parseInt(responseMessage.first());
            if (isNaN(answer)) {
            } else {
              if (result[answer]) {
                playSound(message, result[answer]);
              }
            }
          })
          .catch((collected) => {
            message.channel.send("Timeout");
          });
      });
    }

    //playSound(message, "a_kadoc");
  } else if (command === "random") {
    playSound(
      message,
      listQuotes[Math.floor(Math.random() * listQuotes.length)]
    );
  } else {
    message.reply("Unknow command");
  }
});

client.login(config.BOT_TOKEN);
