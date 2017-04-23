var contElement=1;

function PanelPrincipal(PanelPrincipalHTML) {

	this.id="panelPrincipal";
	this.idDrop="panelPrincipal";
	this.typeEther="panelPrincipal";
	this.Children={};
	this.dropable=true;
	this.PV=PanelPrincipalHTML;

	PanelPrincipal.prototype.getId = function(){
		return this.id;
	};

	PanelPrincipal.prototype.getType = function(){
		return this.type;
	};

	PanelPrincipal.prototype.getIdDrop = function() {
		return this.id;
	};

	PanelPrincipal.prototype.isDropable = function() {
		return this.dropable;
	};

	PanelPrincipal.prototype.getPV = function() {
		return this.PV;
	};

	PanelPrincipal.prototype.dropInElemt=function(elemet) {
		return true;
	};

	
	PanelPrincipal.prototype.addChild = function(Child){
		
		this.PV.appendChild(Child.getPV());
		this.Children[Child.getId()]=Child;
	
	};

	PanelPrincipal.prototype.removeChild = function(Child){
			//this.PV.removeChild(Child.getPV());
			delete this.Children[Child.getId()];
	};
	
}

function Protocol(type) {

	this.type=type;
	this.id="";
	this.PV;
	this.dropable=false;
	this.Parent;
	this.width="";
	this.height="";
	this.widthCollap="";
	this.heightCollap="";
	this.collap=false;

	Protocol.prototype.viewId = function(){
		console.log(this.id);
	};

	Protocol.prototype.viewType = function(){
		console.log(this.type);
	};

	Protocol.prototype.getId = function(){
		return this.id;
	};

	Protocol.prototype.getType = function(){
		return this.type;
	};

	Protocol.prototype.getIdDrop = function() {
		if(this.dropable){		
			return "Drop"+this.id;
		}
		else{
			return false;
		}
	};

	Protocol.prototype.setId = function(id){
		this.id = id;
	};

	Protocol.prototype.isDropable =function() {
		return this.dropable;
	};
	
	Protocol.prototype.getParent = function(){
		return this.Parent;
	};

	Protocol.prototype.setParent = function(Parent){
		//Parent.addChild(this);
		this.Parent=Parent;
	};
	/*
	Protocol.prototype.removeParent = function(Parent){

		if(this.parent.getId() == Parent.getId()){
			this.parent = undefined;
			//console.log("Quito padre");
			return true;
		}
		else{
			//console.log("NO Quito padre");
			return false;
		}
	};
	*/
	Protocol.prototype.setWH= function(width,height){
		this.width=width;
		this.height=height;
	};
	
	Protocol.prototype.setWHCollap= function(width,height){
		this.widthCollap=width;
		this.heightCollap=height;
	};
	
	Protocol.prototype.getwidth = function(){
		return this.width;
	};

	Protocol.prototype.getheight = function(){
		return this.height;
	};

	Protocol.prototype.remove=function(){
		if(this.Parent.getId()!="panelPrincipal")this.Parent.setSizeOrig();
		this.Parent.removeChild(this);
		delete this;
	};

	Protocol.prototype.getPV=function() {
		return this.PV;
	};

	Protocol.prototype.collapse=function(){
		if(this.collap){
			this.PV.style.height=this.height+"px";
			this.collap=false;
		}
		else{
			//console.log(this.heightCollap);
			this.PV.style.height=this.height-this.heightCollap+"px";
			this.collap=true;
		}
		if(this.Parent.getId()!="panelPrincipal"){
			this.Parent.setModSize(this.PV.offsetHeight,this.PV.offsetWidth);
		}
	};

}

function ProtocolDrop(type) {


	Protocol.call(this,type,true);

	this.dropable=true;
	this.Children={};
	this.idDrop="";
	this.drop;
	this.heightMod="";
	this.widthMod="";
	this.dropin={};

	ProtocolDrop.prototype.dropInElemt=function(elemet) {
		var patt;
		for(var i in this.dropin) {
			patt = new RegExp(this.dropin[i]);
			if(patt.test(elemet)){
				return true;
			}
		}
  			return false;
	};

	ProtocolDrop.prototype.iniDropWH=function() {
		
		if(this.collap){
			this.drop.style.height = this.PV.offsetHeight-40+"px";
		}else{
			this.drop.style.height = this.PV.offsetHeight-40-this.heightCollap+"px";
		}

		this.drop.style.width = this.PV.offsetWidth-30+"px";
	};

	ProtocolDrop.prototype.addChild = function(Child){
		this.Children[Child.getId()] = Child;
		//console.log(this.PV.lastChild);
		if(this.type=="Packet"){
			this.PV.lastChild.lastChild.lastChild.appendChild(Child.getPV());
		}else{
			this.PV.lastChild.lastChild.appendChild(Child.getPV());
		}
	};

	ProtocolDrop.prototype.removeChild = function(Child){
			delete this.Children[Child.getId()];
	};

	ProtocolDrop.prototype.setModSize = function(height,width){
		this.heightMod=this.PV.offsetHeight;
		this.widthMod=this.PV.offsetWidth;

		var widthN = width+37;

		var heightN;
		if(!this.collap){
			heightN= 35+this.heightCollap+height+10;
		}else{
			heightN= 35+height+10;
		}

		this.PV.style.width=widthN+"px";
		this.PV.style.height=heightN+"px";

		this.drop.style.width=width+4+"px";
		this.drop.style.height=height+4+"px";

		if(this.Parent.getId()!="panelPrincipal"){
			this.Parent.setModSize(this.PV.offsetHeight,this.PV.offsetWidth);
		}
	};

	ProtocolDrop.prototype.setModSizePre = function(){
		this.PV.style.width=this.widthMod+"px";
		this.PV.style.height=this.heightMod+"px";
	};

	ProtocolDrop.prototype.setSizeOrig = function(){
		var heightN;

		if(!this.collap){
			heightN=this.height;
		}else{
			heightN=this.height-this.heightCollap;
			
		}
		this.PV.style.width=this.width+"px";
		this.PV.style.height=heightN+"px";
		this.iniDropWH();

		if(this.Parent.getId()!="panelPrincipal"){
			this.Parent.setModSize(this.PV.offsetHeight,this.PV.offsetWidth);
		}

	};

	ProtocolDrop.prototype.collapse=function(){

		if(isEmpty(this.Children)){
			if(this.collap){
				this.PV.style.height=this.height+"px";
				this.collap=false;
			}
			else{
				//console.log(this.heightCollap);
				this.PV.style.height=this.height-this.heightCollap+"px";
				this.collap=true;
			}
		}
		else{
			for(child in this.Children){
				elemet=this.Children[child];
				if(this.collap){
					var height = (35+this.heightCollap)+elemet.getPV().offsetHeight+10;
					this.PV.style.height=height+"px";
					this.collap=false;
				}
				else{
					var height = 35+elemet.getPV().offsetHeight+10;
					//console.log(this.heightCollap);
					this.PV.style.height=height+"px";
					this.collap=true;
				}
			}
		}
		if(this.Parent.getId()!="panelPrincipal"){
			this.Parent.setModSize(this.PV.offsetHeight,this.PV.offsetWidth);
		}
	};

	ProtocolDrop.prototype.remove=function(){
		this.Parent.removeChild(this);
		if(this.Parent.getId()!="panelPrincipal")this.Parent.setSizeOrig();
		for(child in this.Children){
			elemet=this.Children[child];
			elemet.remove();
			delete this.Children[elemet.id]
			delete parentinations[elemet.getId()];
		}
		delete this;
	};
	
}

function Packet(){

	ProtocolDrop.call(this,"Packet",true);

	Packet.prototype.newPV=function() {
	var form = document.createElement("form");

	this.dropin={"Ethernet":"Ethernet","IP":"IP","ARP":"ARP"};

	this.PV = document.createElement("div");
	this.PV.id = "Packetnew"+contElement;
	contElement=contElement+1;
	this.id=this.PV.id;
	//console.log("PUSS "+this.id);

	this.PV.classList.add("PacketNew");
	this.PV.setAttribute("draggable","true");
	this.PV.addEventListener('dragstart', drag, false);
	this.PV.innerHTML="<header id= 'header"+this.id+"' class='col-xs-12'> <div class='col-xs-3 col-xs-offset-4'>Packet</div><a class='col-xs-1 col-xs-offset-3 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a></header>"
	
	form.id="Form"+this.id
	form.setAttribute("class","form-horizontal col-xs-12");
	form.setAttribute("role","form");
	form.setAttribute("method","post");
	form.setAttribute("onsubmit","Submit(this,event)");
	form.style.height="100%";
	form.style.width="100%";

	form.innerHTML=" <input type='hidden' name='pk' value="+this.id+"><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div> <div class='form-group col-xs-12'><input class='col-xs-5 col-xs-offset-1' type='text' placeholder='NºPaquetes' name='npack'></input><input class='col-xs-3 col-xs-offset-3' type='submit' id='buttonSubmit"+this.id+"' value='Send'></input></div></div>";
	
	var drop = createDrop(this.id);
	form.appendChild(drop);

	this.drop=drop.firstChild; 
	this.idDrop=this.drop.id;

	this.PV.appendChild(form);
	};
}

function Ethernet() {

	ProtocolDrop.call(this,"Ethernet",true);

	Ethernet.prototype.newPV=function() {

		this.dropin={"IP":"IP","ARP":"ARP"};

		this.PV = document.createElement("div");
		this.PV.id = "Ethernetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		this.PV.classList.add("EthernetNew");
		this.PV.setAttribute("draggable","true");
		this.PV.addEventListener('dragstart', drag, false);
		this.PV.innerHTML="<header class='col-xs-12'><a type='button' class='col-xs-3 col-xs-offset-4 botonsCollap' cursor:pointer;' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this.parentNode.parentNode)'>Ethernet</a> <input type='hidden' name='Ether' value='True'><a class='col-xs-1 col-xs-offset-3 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a></header><div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-5' type='text' name='srcEther' placeholder='src'></input><input class='col-xs-5' type='text' name='dstEther' placeholder='dst'></input><input class='col-xs-2' type='text' name='typeEther' placeholder='type'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function IP() {

	ProtocolDrop.call(this,"IP",true);

	IP.prototype.newPV=function() {

		this.dropin={"ICMP":"ICMP","TCP":"TCP","UDP":"UDP"};

		this.PV = document.createElement("div");
		this.PV.id = "IPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		this.PV.classList.add("IPNew");
		this.PV.setAttribute("draggable","true");
		this.PV.addEventListener('dragstart', drag, false);
		this.PV.innerHTML="<header class='col-xs-12'><a type='button' class='col-xs-3 col-xs-offset-4 botonsCollap' data-toggle='collapse' data-target='#"+this.id+"collap' onclick='collapseElement(this.parentNode.parentNode)'>IP</a>  <input type='hidden' name='IP' value='True'><a class='col-xs-1 col-xs-offset-3 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a></header><div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><input class='col-xs-2' type='text' name='VERIP' placeholder='VER'></input><input class='col-xs-3' type='text' name='HLENIP' placeholder='HLEN'></input><input class='col-xs-3' type='text' name='SERVIP' placeholder='T.Servicio'></input><input class='col-xs-4' type='text' name='LOGIP' placeholder='Longitud'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='IdenIP' placeholder='Identificacion'></input><input class='col-xs-4' type='text' name='FlagsIP' placeholder='Flags'></input><input class='col-xs-4' type='text' name='OffFraIP' placeholder='Offset Frag'></input></div><div class='form-group col-xs-12'><input class='col-xs-3' type='text' name='TTLIP' placeholder='TTL'></input><input class='col-xs-4' type='text' name='ProIP' placeholder='Protocolo'></input><input class='col-xs-5' type='text' name='CheckIP' placeholder='Checksum'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='srcIP' placeholder='src'></input><input class='col-xs-4' type='text' name='dstIP' placeholder='dst'></input><input class='col-xs-4' type='text' name='OpcionesIP' placeholder='Opciones'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function ICMP() {

	Protocol.call(this,"ICMP",true);

	ICMP.prototype.newPV=function() {

		this.PV = document.createElement("div");
		this.PV.id = "ICMPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		this.PV.classList.add("ICMPNew");
		this.PV.setAttribute("draggable","true");
		this.PV.addEventListener('dragstart', drag, false);
		this.PV.innerHTML="<header>ICMP  <input type='hidden' name='ICMP' value='True'><button id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)'></button></header><div class='DataIP'><div class='form-group col-xs-12'><input class='col-xs-2' type='text' name='VERIP' placeholder='VER'></input><input class='col-xs-3' type='text' name='HLENIP' placeholder='HLEN'></input><input class='col-xs-3' type='text' name='SERVIP' placeholder='T.Servicio'></input><input class='col-xs-4' type='text' name='LOGIP' placeholder='Longitud'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='IdenIP' placeholder='Identificacion'></input><input class='col-xs-4' type='text' name='FlagsIP' placeholder='Flags'></input><input class='col-xs-4' type='text' name='OffFraIP' placeholder='Offset Frag'></input></div><div class='form-group col-xs-12'><input class='col-xs-3' type='text' name='TTLIP' placeholder='TTL'></input><input class='col-xs-4' type='text' name='ProIP' placeholder='Protocolo'></input><input class='col-xs-5' type='text' name='CheckIP' placeholder='Checksum'></input></div><div class='form-group col-xs-12'><input class='col-xs-4' type='text' name='srcIP' placeholder='src'></input><input class='col-xs-4' type='text' name='dstIP' placeholder='dst'></input><input class='col-xs-4' type='text' name='OpcionesIP' placeholder='Opciones'></input></div></div>"
	
	};
}


function createElement(idSrt,parent) {
	var newElement;
	//console.log(parent);
	switch(idSrt) {
		case "Packet":
			newElement = new Packet();
			break;
    	case "Ethernet":
    		newElement = new Ethernet();
    		break;
    	case "IP":
    		newElement = new IP();
    		break;
    	case "ICMP":
    		newElement = new ICMP();
    		break;
	}
	newElement.newPV();
	/*newElement.setParent(parent);*/
	//parent.getPV().appendChild(newElement.getPV());
	parent.addChild(newElement);
	//console.log(findObj(parent.id));
	newElement.setParent(findObj(parent.id));
	parentinations[newElement.getId()]=newElement;
	newElement.setWH(newElement.getPV().offsetWidth,newElement.getPV().offsetHeight);
	newElement.setWHCollap(document.getElementById(newElement.getId()+"collapElement").offsetWidth,document.getElementById(newElement.getId()+"collapElement").offsetHeight);
	if(newElement.isDropable)newElement.iniDropWH();
	return newElement;
}

function createDrop(Id){

	var divDrop = document.createElement("div");
	var divDropVis = document.createElement("div");
	divDropVis.id="Drop"+Id;
	divDrop.setAttribute("class","col-xs-12");
	divDropVis.setAttribute("class","drop");
	//divDrop.setAttribute("draggable","true");
	divDropVis.addEventListener('dragover', allowDrop, false);
	divDropVis.addEventListener('drop',function(e){drop(e,false)}, false);
	divDrop.appendChild(divDropVis);

	return divDrop;
}

function isEmpty(obj) {
  for(var i in obj) { return false; }
  return true;
}



ProtocolDrop.prototype = new Protocol();

Packet.prototype = new ProtocolDrop();

Ethernet.prototype = new ProtocolDrop();

IP.prototype = new ProtocolDrop();

ICMP.prototype = new Protocol();