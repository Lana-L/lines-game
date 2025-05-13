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
  - If the player's move completes a line of five or more, then they get another move without more random balls appearing.✅
- Click to activate a ball and to deactivate the ball. ✅
- Second click to move the selected ball. ✅
- The ball finds the path, accounting for barriers from other balls.✅
  - MVP: the ball teleports to the second click. ✅

### Scoring

- Each ball is two points, so one minimum successful line of five balls is 10 points, but longer lines can be made (eg, six balls - 12 points). ✅

- Round win condition: at least five in a row of the same colour. ✅

- Lose condition: the game ends when all cells are filled with balls and no more moves are possible.✅

### Resources

- Simple block colour graphics. ✅

- Balls that compress on bounce. ✅

- Game win condition: getting more points than the champion (top person on the leaderboard), winning sound plays and graphics change (the player is now the king). Then the game continues.

- Old school 8 bit sounds for bouncing balls. ✅

## Issues

- Sometimes multiple calls go into the same cell. Tried hasChildNodes, children, firstChild, innerHTML... ✅ fixed with a while loop
- How to stop first ball from animating when a different ball is clicked? ✅ fixed with tracking ball state global variable and a bunch of if/else
- How to click to move? ✅ - track currently selected cell, the ball, and the new selected cell, delete the ball from the old cell and add it to the new one.
- Sound does not work properly ✅ replaced with .wav files, still does not work on iOS Safari ❌
- Help button modal does not appear ✅ fixed by referencing the right element
- Lines clear when wrap around (eg, three balls at the end of line seven, and two balls at start of line eight will clear out the line) ✅ fixed by adding end of line boundary checking
- Sometimes game does not give a game over message when there are no spaces left ⁉️
- Sometimes game gives a game over message when there is one space left ⁉️
- Freebie lines (ie, line completed by random placement of balls) are not being removed ❌

### Extra changes following user testing

- Added local storage functionality to save user's high score ✅
- Sound off also turns off winner and game over sounds ✅
- Restarting the game before losing but after getting a high score keeps the new high score ✅
- User suggested idea: get bonus points for chaining line clear, which can be spent on teleport ball swaps ❌

## Credits

Sound Effects by <a href="https://pixabay.com/users/lesiakower-25701529/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=151796">Lesiakower</a>
and <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=323603">Universfield</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=323603">Pixabay</a>
