import "../css/main.css"
import Phaser from "phaser"
import { RouletteScene } from "./games/roulette"

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 800,
	backgroundColor: "#242424",
	scene: [RouletteScene],
	parent: "game-container"
}

new Phaser.Game(config)
