var contElement=1;

function PanelPrincipal() {

	this.id="panelPrincipal";
	this.Children={};

	PanelPrincipal.prototype.getId = function(){
		return this.id;
	};

	PanelPrincipal.prototype.addChild = function(Child){
		this.Children[Child.getId()]=Child;
	};

	PanelPrincipal.prototype.removeChild = function(Child){
		delete this.Children[Child.getId()];
	};

}


function Packet() {

	this.id="";
	this.drop=true;
	this.Parent;
	this.Children={};
	this.width="";
	this.height="";

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

	Packet.prototype.getParent = function(){
		return this.Parent;
	};

	Packet.prototype.setParent = function(Parent){
		console.log(Parent);
		Parent.addChild(this);
		this.parent=Parent;
	}

	Packet.prototype.addChild = function(Child){
		this.Children[Child.getId()]=Child;
	};

	Packet.prototype.removeChild = function(Child){
		delete this.Children[Child.getId()];
	}

	Packet.prototype.newPV=function() {
		var divDrop = document.createElement("div");
		var form = document.createElement("form");

		this.PacketPV = document.createElement("div");
		this.PacketPV.id = "Packetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PacketPV.id;
		console.log("PUSS "+this.id);

		this.PacketPV.classList.add("column");
		this.PacketPV.setAttribute("draggable","true");
		this.PacketPV.addEventListener('dragstart', drag, false);
		this.PacketPV.innerHTML="<header id= 'header"+this.id+"'>Packet <button id='remove"+this.id+"' class='remove' onclick='removeElement(this)'></button></header>"
		
		divDrop.id="Drop"+this.id;
		divDrop.classList.add("column");

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

function Protocol(type) {

	this.type=type;
	this.id="";
	this.drop=false;
	this.Parent;
	this.width="";
	this.height="";

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

	Protocol.prototype.getParent = function(){
		return this.Parent;
	};

	Protocol.prototype.setParent = function(Parent){
		Parent.addChild(this);
		this.parent=Parent;
	}

}

function ProtocolDrop(type) {

	Protocol.call(this,type,true);

	this.drop=true;

	ProtocolDrop.prototype.addChild = function(Child){
		this.Children[Child.getId()]=Child;
	};

	ProtocolDrop.prototype.removeChild = function(Child){
		delete this.Children[Child.getId()];
	}
}

function Ethernet() {

	ProtocolDrop.call(this,"Ethernet",true);

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

		//divDrop.setAttribute("draggable","true");
		divDrop.addEventListener('dragover', allowDrop, false);
		divDrop.addEventListener('drop',function(e){drop(e,false)}, false);

		this.EthernetPV.appendChild(divDrop);
	};

	Ethernet.prototype.getPV=function() {
		return this.EthernetPV;
	};

}

function createElement(idSrt,parent) {
	var newElement;
	switch(idSrt) {
		case "Packet":
			newElement = new Packet();
			newElement.newPV();
			newElement.setParent(parent);
			parentinations[newElement.getId()]=newElement;
			return newElement;
    	case "Ethernet":
    		newElement = new Ethernet();
    		newElement.newPV();
    		newElement.setParent(parent);
    		parentinations[newElement.getId()]=newElement;
    		return newElement;
    }
}

ProtocolDrop.prototype = new Protocol();

Ethernet.prototype = new ProtocolDrop();


