const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
const prefix = '!kaambot ';
const listQuotes = require('./sounds.json');

const HelpMessage = 'Il est nécesssaire d\'avoir accès à un salon textuel pour écrire les commandes et être connecté à un salon audio pour que le son puisse être lu.\n' +
'Les commandes doivents être précédés par !kaamBot\n' +
'\n' +
'Liste des commandes :\n' +
'random : lance une citation aléatoire\n' +
'play <texte à chercher> : recherche le texte dans le nom de l\'épisode, le nom du personnage et le texte de la citation. Si une seule citation est trouvée la joue directement. Sinon propose une liste jusqu\'à 10 citations correspondant à la recherche. Il suffit ensuite de répondre en indiquant le numéro de la citation souhaitée.\n' +
'\n' +
'Exemples de commande :\n' +
'!kaamBot random\n' +
'!kaamBot play kadoc\n' +
'!kaamBot play elle fait du flan\n' +
'!kaamBot play Livre II,';

String.prototype.cleanDiacritics = function() {
	return this.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

function search(str) {
	const searchRegExp = new RegExp(str, 'gi');
	return listQuotes.filter((quote) => {
		return (
			searchRegExp.test(quote.title.cleanDiacritics()) ||
            searchRegExp.test(quote.character.cleanDiacritics()) ||
            searchRegExp.test(quote.episode.cleanDiacritics())
		);
	});
}

function searchChar(str) {
	const searchRegExp = new RegExp(str, 'gi');
	return listQuotes.filter((quote) => {
		return (
			searchRegExp.test(quote.character.cleanDiacritics())
		);
	});
}

function playSound(message, quote) {
	if (!message.member.voice.channel) {
		return message.reply('Vous devez être dans un salon audio');
	}
	if (message.guild.me.voice.channel) {
		return message.reply(
			'Je suis déjà en train de parler, laissez moi terminer',
		);
	}

	message.member.voice.channel
		.join()
		.then((VoiceConnection) => {
			VoiceConnection.play(`./sounds/${quote.file}`).on('finish', () =>
				VoiceConnection.disconnect(),
			);
			message.channel.send(`${quote.title} - ${quote.episode}`);
		})
		.catch((e) => console.log(e));
}

client.on('message', function(message) {
	if (message.author.bot) return;
	const messageContent = message.content.toLowerCase().cleanDiacritics();
	if (!messageContent.startsWith(prefix)) return;
	const commandBody = messageContent.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();
	const text = args.join(' ');
	if (command === 'play') {
		let result = search(text);
		if (result.length > 10) {
			result = result.slice(0, 10);
		}
		if (result.length === 0) {
			message.channel.send(
				'Aucun resultat, si vous pensez qu\'il manque une citation n\'hésitez pas à contribuer : https://github.com/crobert/kaambot',
			);
		}
		if (result.length === 1) playSound(message, result[0]);
		if (result.length > 1) {
			const filter = (m) => m.author.id === message.author.id;
			let i = 0;
			let resultText =
        'Voici les propositions, répondre par le numéro de la citation souhaitée\n';
			const txtmap = result.map((quote) => {
				const txt = i + ' - ' + quote.title + ';\n';
				resultText += txt;
				i++;
				return txt;
			});

			message.channel.send(resultText).then(() => {
				message.channel
					.awaitMessages(filter, {
						max: 1,
						time: 30000,
						errors: ['time'],
					})
					.then((responseMessage) => {
						const answer = parseInt(responseMessage.first());
						if (isNaN(answer)) {
							message.channel.send(
								'Le numéro saisie n\'est pas correct.',
							);
						}
						else if (result[answer]) {
							playSound(message, result[answer]);
						}
						else{
							message.channel.send(
								'Le numéro saisie n\'est pas correct.',
							);
						}
					})
					.catch(() => {
						message.channel.send('Timeout');
					});
			});
		}
	}
	else if (command === 'random' || command === 'rand') {
		const result = searchChar(text);
		if(text) {
			if (result.length === 0) {
				message.channel.send(
					'Aucun resultat, si vous pensez qu\'il manque une citation n\'hésitez pas à contribuer : https://github.com/crobert/kaambot',
				);
			}
			else{
				playSound(
					message, result[Math.floor(Math.random() * result.length)],
				);
			}
		}
		else{
			playSound(
				message,
				listQuotes[Math.floor(Math.random() * listQuotes.length)],
			);
		}
	}
	else if(command === 'help') {
		message.channel.send(HelpMessage);
	}
	else {
		message.channel.send('Commande inconnue');
		message.channel.send(HelpMessage);
	}
});

client.login(config.BOT_TOKEN);
