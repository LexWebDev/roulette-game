import Phaser from "phaser"
import { sectorColors, sectors } from "../data/rouletteData.ts"

export class RouletteScene extends Phaser.Scene {
	private wheel!: Phaser.GameObjects.Image
	private spinButton!: Phaser.GameObjects.Text
	private resultText!: Phaser.GameObjects.Text
	private resultBorder!: Phaser.GameObjects.Graphics
	private isSpinning: boolean = false

	constructor() {
		super({ key: "RouletteScene" })
	}

	preload() {
		this.load.image("wheel", "/assets/roulette-wheel.png")
	}

	create() {
		this.createWheel()
		this.createSpinButton()
		this.createResultDisplay()
	}

	private createWheel() {
		this.wheel = this.add.image(400, 300, "wheel").setScale(0.5)
	}

	private createSpinButton() {
		const defaultStyle = {
			fontSize: "32px",
			color: "#ffb700",
			backgroundColor: "#494949",
			padding: { x: 10, y: 5 }
		}

		this.spinButton = this.add
			.text(350, 620, "SPIN", defaultStyle)
			.setInteractive({ useHandCursor: true })
			.on("pointerover", () => this.updateButtonStyle("#313131"))
			.on("pointerout", () => this.updateButtonStyle("#494949"))
			.on("pointerdown", () => this.spinWheel())
	}

	private createResultDisplay() {
		const borderConfig = {
			x: 640,
			y: 10,
			width: 120,
			height: 80,
			radius: 4
		}

		this.resultBorder = this.add.graphics()
		this.resultBorder
			.fillStyle(0x494949, 1)
			.fillRoundedRect(
				borderConfig.x,
				borderConfig.y,
				borderConfig.width,
				borderConfig.height,
				borderConfig.radius
			)
			.lineStyle(2, 0xffb700, 1)
			.strokeRoundedRect(
				borderConfig.x,
				borderConfig.y,
				borderConfig.width,
				borderConfig.height,
				borderConfig.radius
			)
			.setVisible(false)

		this.resultText = this.add
			.text(
				borderConfig.x + borderConfig.width / 2,
				borderConfig.y + borderConfig.height / 2,
				"",
				{
					fontSize: "48px",
					color: "#fff",
					align: "center"
				}
			)
			.setOrigin(0.5)
			.setVisible(false)
	}

	private updateButtonStyle(color: string) {
		this.spinButton.setStyle({ backgroundColor: color })
	}

	private resetResultDisplay() {
		this.resultBorder.setVisible(false)
		this.resultText.setVisible(false)
		this.resultText.setText("")
	}

	private showResult(winningNumber: string, winningColor: string) {
		this.resultText.setText(winningNumber).setColor(winningColor)
		this.resultBorder.setVisible(true)
		this.resultText.setVisible(true)
	}

	private spinWheel() {
		if (this.isSpinning) return

		this.resetResultDisplay()
		this.isSpinning = true

		const spinConfig = {
			rounds: Phaser.Math.Between(3, 5),
			randomDegree: Phaser.Math.Between(0, 360)
		}
		const totalRotation = 360 * spinConfig.rounds + spinConfig.randomDegree

		this.tweens.add({
			targets: this.wheel,
			angle: totalRotation,
			duration: 5000,
			ease: "Cubic.easeOut",
			onComplete: () => this.onSpinComplete(spinConfig.randomDegree)
		})
	}

	private onSpinComplete(randomDegree: number) {
		this.isSpinning = false

		const sectorIndex = Math.floor(randomDegree / (360 / sectors.length))
		const winningColor = sectorColors[sectorIndex]
		const winningNumber = sectors[sectorIndex].toString()

		this.showResult(winningNumber, winningColor)
	}
}
