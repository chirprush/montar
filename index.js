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
		this.money = money;
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
		let close_button = this.attributeElement("", "X", "button", { color: X_COLOR });
		close_button.onclick = () => {
			container.profiles.splice(index, 1);
			container.render();
		};
		div.appendChild(close_button);
		div.className = "counter";
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
