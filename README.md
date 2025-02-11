# Lines game

Trying to recreate the old nostalgic classic from the '90s. There are many like it, but this one is mine.

See it in action on [Youtube](https://www.youtube.com/watch?v=8GI4A-FGZKE).

Here's a screenshot we're trying to work towards.

![Color Lines game screenshot](/images/original-game-image.png "Color Lines Game")

## Requirements

### Gameplay

- 9x9 grid ✅

- Generate five random balls on start. ✅
- Generate three new balls on each turn (random out of possible seven colours). ✅
  - If the player's move does not complete a line of five or more, then three more balls appear in random places. ✅
  - If the player's move completes a line of five or more, then they get another move without more random balls appearing.
- Click to activate a ball and to deactivate the ball. ✅
- Second click to move the selected ball.
- The ball finds the path, accounting for barriers from other balls.
  - MVP: the ball teleports to the second click.

### Scoring

- Each ball is two points, so one minimum successful line of five balls is 10 points, but longer lines can be made (eg, six balls - 12 points).

- Round win condition: five in a row of the same colour.

- Lose condition: the game ends when all cells are filled with balls and no more moves are possible.

### Resources

- Simple block colour graphics. ✅

- Balls that compress on bounce. ✅

- Game win condition: getting more points than the king (100), winning sound plays and graphics change (the player is now the king). Then the game continues.

- Old school midi sounds for bouncing balls.

## Issues

- Sometimes multiple calls go into the same cell. Tried hasChildNodes, children, firstChild, innerHTML...
- How to click to move?
- How to stop first ball from animating when a different ball is clicked?
