var contElement=1;

function Protocol(type) {
	this.type=type;
	this.id="";

	Protocol.prototype.viewId = function(){
		console.log(this.id);
	};
	Protocol.prototype.viewType = function(){
		console.log(this.type);
	};
	Protocol.prototype.getId = function(){
		return this.id;
	};
	Protocol.prototype.setId = function(id){
		this.id = id;
	};
}

function Ethernet() {
	Protocol.call(this,"Ethernet");

	Ethernet.prototype.newPV=function(argument) {
		this.EthernetPro = document.createElement("div");
		this.EthernetPro.id = "Ethernetnew"+contElement;
		contElement=contElement+1;
		this.id=this.EthernetPro.id;
		this.EthernetPro.classList.add("column");
		this.EthernetPro.setAttribute("draggable","true");
		this.EthernetPro.addEventListener('dragstart', drag, false);
		this.EthernetPro.innerHTML="<header>Ethernet<button id='remove' class='remove' onclick='removeElement(this)'></header></button>"
	};

	Ethernet.prototype.getPV=function(argument) {
		return this.EthernetPro;
	};
}

function createPacket(idSrt) {
	switch(idSrt) {
    	case "Ethernet":
    		return new Ethernet();
    }
}

Ethernet.prototype= new Protocol();


