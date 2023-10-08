# Abyss
<div align="center"><img src="assets/img/readme/title.gif"></div>

## Go down, you cannot jump, find the treasure!

Dive into the depths in search of the Great Ruby, a legendary treasure, the last vestige of an ancient forgotten civilization. Your heavy diving suit won't allow you to jump, but you have unlimited air supply!

Explore the underwater labyrinth and find your way to the deepest cave, avoiding nasty dangers and enemies through secret doors and rooms. Will you be able to find all the golden coins?

## Gameplay

Use cursor keys to move left and right (directional buttons are provided for mobile devices). Find golden coins to open secret doors and press buttons to gain access to new areas.

<div align="center"><img src="assets/img/readme/player.gif"></div>

## How to run the game

You can use `make` to run the game (you will need `docker-compose`):

```
make run
```

Then you will be able to play at [http://localhost:1234/](http://localhost:1234/)

Alternatively, just run `docker-compose up -d` (or `docker compose -d`, depending on what you have in your system).

To stop the server, just run:

```
make stop
```

## License

This game is released under the [Mit License](https://opensource.org/licenses/MIT).