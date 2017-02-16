var contElement=1;

function Packet() {

	this.id="";
	this.drop=true;

	Packet.prototype.viewId = function(){
		console.log("Packet");
	};

	Packet.prototype.viewType = function(){
		console.log("Packet");
	};

	Packet.prototype.getId = function(){
		return this.id;
	};

	Packet.prototype.setId = function(id){
		this.id = id;
	};
	Packet.prototype.getDrop =function() {
		return this.drop;
	};

	Packet.prototype.newPV=function() {
		var divDrop = document.createElement("div");
		var form = document.createElement("form");

		this.PacketPV = document.createElement("div");
		this.PacketPV.id = "Packetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PacketPV.id;

		this.PacketPV.classList.add("column");
		this.PacketPV.setAttribute("draggable","true");
		this.PacketPV.addEventListener('dragstart', drag, false);
		this.PacketPV.innerHTML="<header id= 'header"+this.id+"'>Packet <button id='remove"+this.id+"' class='remove' onclick='removeElement(this)'></button></header>"
		
		divDrop.id="Drop"+this.id;
		divDrop.classList.add("column");

		parentinations[divDrop.id] = new Array(1,"");

		//divDrop.setAttribute("draggable","true");
		divDrop.addEventListener('dragover', allowDrop, false);
		divDrop.addEventListener('drop',function(e){drop(e,false)}, false);

		form.id="Form"+this.id;
		form.innerHTML="<input type='text'></input><input type='submit'></input>"
		form.appendChild(divDrop);

		this.PacketPV.appendChild(form);
	};

	Packet.prototype.getPV=function() {
		return this.PacketPV;
	};

}

function Protocol(type,drop=false) {

	this.type=type;
	this.id="";
	this.drop=drop;

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

	Protocol.prototype.getDrop =function() {
		return this.drop;
	};

}

function Ethernet() {

	Protocol.call(this,"Ethernet",true);

	Ethernet.prototype.newPV=function() {

		var divDrop = document.createElement("div");

		this.EthernetPV = document.createElement("div");
		this.EthernetPV.id = "Ethernetnew"+contElement;
		contElement=contElement+1;
		this.id=this.EthernetPV.id;

		this.EthernetPV.classList.add("column");
		this.EthernetPV.setAttribute("draggable","true");
		this.EthernetPV.addEventListener('dragstart', drag, false);
		this.EthernetPV.innerHTML="<header>Ethernet <button id='remove' class='remove' onclick='removeElement(this)'></button></header>"

		divDrop.id="Drop"+this.id;
		divDrop.classList.add("column");

		parentinations[divDrop.id] = new Array(1,"");

		//divDrop.setAttribute("draggable","true");
		divDrop.addEventListener('dragover', allowDrop, false);
		divDrop.addEventListener('drop',function(e){drop(e,false)}, false);

		this.EthernetPV.appendChild(divDrop);
	};

	Ethernet.prototype.getPV=function() {
		return this.EthernetPV;
	};

}

function createElement(idSrt) {
	switch(idSrt) {
		case "Packet":
			return new Packet();
    	case "Ethernet":
    		return new Ethernet();
    }
}

Ethernet.prototype= new Protocol();


