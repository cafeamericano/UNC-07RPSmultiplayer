# RPS Live (Multiplayer)

Deployed at: https://cafeamericano.github.io/UNC-07RPSmultiplayer/

In this application, compete remotely with a friend in a game of rock/paper/scissors and communicate with one another using a built-in messaging feature.

On the initial load, the player(s) may encounter data left over from the players of a previous game. If the same two players are returning, this will allow the opponents to pick up where they left off. If new players are competing against one another, click 'Change Player' on the appropriate side of the screen and provide the necessary information. Upon doing this, all wins/losses gathered by the previous player will be reset. Additionally, all chat history will be cleared since a new pair of opponents is being established.

The indication of 'not ready' (and red highlighting) for a player's status (above the message center) means that a player has not yet selected rock, paper, or scissors. The player may select their weapon of choice by clicking 'Select a Weapon', choosing an option, and clicking 'Commit'. Once this is done, the player's status will change to 'selection made' and the red highlighting replaced by green highlighting.

When both players have made their selection, the game is over. The results of the game will appear in a modal, and the win/loss points will be applied to their respective players. The players will be given an option to restart the game; once one player chooses to restart the game, the other player will be notified of their opponents action.
