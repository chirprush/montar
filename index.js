const BACKGROUND_COLOR = "#282c34";
const UI_COLOR = "#1d2025";
const SELECTED_COLOR = "#22252a";

const TEXT_COLOR = "#abb2bf";

const MONEY_COLOR = "#98c379";
const NAME_COLOR = "#61afef";
const X_COLOR = "#e06c75";

const DEFAULT_MONEY = 2000;

class Container {
	constructor(profiles) {
		this.selected = 0;
		this.profiles = profiles;
	}

	render() {
		let container = document.getElementById("container");
		container.textContent = "";
		for (let i = 0; i < this.profiles.length; ++i) {
			container.appendChild(this.profiles[i].asHtml(this, i));
		}
	}
}

class Profile {
	constructor(money, name) {
		this.money = money.toString();
		this.money_change = "";
		this.name = name;
		this.dice1 = 0;
		this.dice2 = 0;
		this.roll_state = "begin";
	}

	descriptorElement(name) {
		let el = document.createElement("p")
		el.innerHTML = name;
		el.className = "descriptor";
		return el;
	}

	attributeElement(name, text, type, opts) {
		let el = document.createElement(type)
		for (const [opt, value] of Object.entries(opts)) {
			el.style[opt] = value;
		}
		if (type === "textarea") {
			el.value = text;
			el.rows = 1;
			el.cols = el.value.length + 1;
			el.oninput = () => {
				el.value = el.value.trim();
				el.value = el.value.replace("\n", "");
				el.cols = el.value.length + 1;
				this[name] = el.value;
			}
		} else {
			el.innerHTML = text;
		}
		el.className = "attribute";
		return el;
	}

	diceElement() {
		let el = document.createElement("img");
		el.src = "";
		el.className = "dice-image";
		return el;
	}

	roll(container, roll_button, dice_one, dice_two) {
		if (this.roll_state === "next") {
			this.dice1 = 0;
			this.dice2 = 0;
			this.roll_state = "begin";
			container.selected = (container.selected + 1) % container.profiles.length;
			container.render();
			return;
		}
		this.dice1 = Math.floor(Math.random() * 6) + 1;
		this.dice2 = Math.floor(Math.random() * 6) + 1;
		dice_one.width = "40";
		dice_one.height = "40";
		dice_two.width = "40";
		dice_two.height = "40";
		dice_one.src = "assets/dice_" + this.dice1 + ".png";
		dice_two.src = "assets/dice_" + this.dice2 + ".png";
		if (this.dice1 !== this.dice2) {
			this.roll_state = "next";
			roll_button.innerHTML = "Next";
		}
	}

	asHtml(container, index) {
		let div = document.createElement("div");
		let selected = container.selected === index;
		if (selected) {
			div.style["background-color"] = SELECTED_COLOR;
		}
		div.appendChild(this.descriptorElement("Money: "));
		div.appendChild(this.attributeElement("", "$", "p", { color: MONEY_COLOR }));
		div.appendChild(this.attributeElement("money", this.money.toString(), "textarea", { color: MONEY_COLOR }));
		div.appendChild(this.descriptorElement("Name: "));
		div.appendChild(this.attributeElement("name", this.name.toString(), "textarea", { color: NAME_COLOR }));
		let withdraw_button = this.attributeElement("", "-", "p", { color: TEXT_COLOR, "margin-left": "50px" });
		withdraw_button.className = "profile-button";
		withdraw_button.onclick = () => {
			let money = parseInt(this.money);
			let amount = parseInt(this.money_change);
			this.money_change = "";
			if (!(isNaN(amount) || isNaN(money))) {
				this.money = (money - amount).toString();
			}
			container.render();
		};
		div.appendChild(withdraw_button);
		div.appendChild(this.attributeElement("", "$", "p", { color: MONEY_COLOR, "margin-left": "10px" }));
		div.appendChild(this.attributeElement("money_change", "", "textarea", { color: MONEY_COLOR }));
		let deposit_button = this.attributeElement("", "+", "p", { color: TEXT_COLOR, "margin-left": "20px" });
		deposit_button.className = "profile-button";
		deposit_button.onclick = () => {
			let money = parseInt(this.money);
			let amount = parseInt(this.money_change);
			this.money_change = "";
			if (!(isNaN(amount) || isNaN(money))) {
				this.money = (money + amount).toString();
			}
			container.render();
		}
		div.appendChild(deposit_button);
		if (selected) {
			let dice_one = this.diceElement();
			let dice_two = this.diceElement();
			if (!(this.roll_state === "begin")) {
				dice_one.src = "assets/dice_" + this.dice1 + ".png";
				dice_two.src = "assets/dice_" + this.dice2 + ".png";
				dice_one.width = "40";
				dice_one.height = "40";
				dice_two.width = "40";
				dice_two.height = "40";
			}
			let roll_button = this.attributeElement("", "Roll", "p", { color: TEXT_COLOR, "margin-left": "50px" });
			if (this.roll_state === "next") {
				roll_button.innerHTML = "Next";
			}
			roll_button.onclick = () => this.roll(container, roll_button, dice_one, dice_two);
			roll_button.className = "profile-button";
			div.appendChild(roll_button);
			div.appendChild(dice_one);
			div.appendChild(dice_two);
		}
		let close_button = this.attributeElement("", "X", "p", { color: X_COLOR });
		close_button.onclick = () => {
			container.profiles.splice(index, 1);
			container.render();
		};
		if (selected) {
			close_button.style["background-color"] = SELECTED_COLOR;
		}
		close_button.className = "close-button";
		div.appendChild(close_button);
		div.className = "profile";
		return div
	}
}

const init = () => {
	let container = new Container([
		new Profile(DEFAULT_MONEY, "Name"),
	]);
	container.render();
	let append_button = document.getElementById("append-button");
	append_button.onclick = () => {
		container.profiles.push(new Profile(DEFAULT_MONEY, "Name"));
		container.render();
	};
}

window.onload = init;
