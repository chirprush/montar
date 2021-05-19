const BACKGROUND_COLOR = "#282c34";
const UI_COLOR = "#1d2025";

const TEXT_COLOR = "#abb2bf";

const MONEY_COLOR = "#98c379";
const NAME_COLOR = "#61afef";
const X_COLOR = "#e06c75";

const DEFAULT_MONEY = 2000;

class Container {
	constructor(profiles) {
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

	asHtml(container, index) {
		let div = document.createElement("div");
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
		let close_button = this.attributeElement("", "X", "p", { color: X_COLOR });
		close_button.onclick = () => {
			container.profiles.splice(index, 1);
			container.render();
		};
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
