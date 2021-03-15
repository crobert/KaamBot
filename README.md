# kaamBot

Bot Discord permettant de chercher et jouer des citations Kaamelott. \
Ce bot se base sur l'excellente idée et les données de : https://github.com/2ec0b4/kaamelott-soundboard. \
Un grand merci à lui et aux contributeurs pour cela.

# Mise en place

Ce projet contient le code du bot, pour le mettre en place dans un salon il est nécessaire de :

- créer une application discord
- créer un bot
- récupérer le jeton unique de ce bot
- lui donner quelques permissions (view channels, send messages, embed links, read message history, connect, speak)
- l'ajouter via le lien d'invitation dans votre serveur
- récupérer le code source de ce projet
- renommer config.exemple.json en config.json
- renseigner la valeur du bot token (jeton unique de ce bot)
- récupérer les dépendances `npm i`
- lancer le bot `node index.js`
  \
  Une fois ces étapes réalisés le statut du bot doit passer en `connecté`.

# Fonctionnement
Il est nécesssaire d'avoir accès à un salon textuel pour écrire les commandes et être connecté à un salon audio pour que le son puisse être lu. \
Les commandes doivents être précédés par `!kaamBot ` \
Liste des commandes :

- `random <nom personnage>` : lance une citation aléatoire, si un nom de personnage est spécifié restreint l'aléatoire aux citations dont il en est l'autheur. 
- `play <texte à chercher>` : recherche le texte dans le nom de l'épisode, le nom du personnage et le texte de la citation. Si une seule citation est trouvée la joue directement. Sinon propose une liste jusqu'à 10 citations correspondant à la recherche. Il suffit ensuite de répondre en indiquant le numéro de la citation souhaitée.

Exemples de commande :

- `!kaamBot random`
- `!kaamBot random arthur`
- `!kaamBot play kadoc`
- `!kaamBot play elle fait du flan`
- `!kaamBot play Livre II,`
