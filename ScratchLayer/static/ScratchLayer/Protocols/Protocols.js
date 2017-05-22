var contElement=1;
var nPack=1;

function PanelPrincipal(PanelPrincipalHTML) {

	this.id="panelPrincipal";
	this.idDrop="panelPrincipal";
	this.typeEther="panelPrincipal";
	this.width="";
	this.height="";
	this.Children={};
	this.dropable=true;
	this.PV=PanelPrincipalHTML;

	PanelPrincipal.prototype.getId = function(){
		return this.id;
	};

	PanelPrincipal.prototype.setWH = function() {
		this.width=this.PV.offsetWidth;
		this.height=this.PV.offsetHeight;		
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

	PanelPrincipal.prototype.setPV = function(PV) {
		this.PV = PV;
	}

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
	
	PanelPrincipal.prototype.setModSize = function(elementHTML=undefined,x=undefined,y=undefined,t=undefined,l=undefined){
		
		var height;
		var width;
		var top;
		var left;

		if(elementHTML!=undefined){
			height = parseInt(elementHTML.offsetHeight);
			width = parseInt(elementHTML.offsetWidth);
			top = parseInt(elementHTML.style.top.split("px")[0]);
			//left = elementHTML.style.left.split("px")[0];
		}else{
			height=x;
			width=y;
			left=l;
			top=t;
		}

		if(parseInt(height + top) > parseInt(this.height)){
			this.PV.style.height=top+height+5+"px";
		}else{
			this.PV.style.height=this.height+"px";
		}
		/*
		if(parseInt(width) > parseInt(this.width)){
			this.PV.style.width = width+7+"px";
		}else{
			this.PV.style.width = this.width+"px";
		}*/
	};

	PanelPrincipal.prototype.setSizeOrig = function () {
		this.PV.style.height=this.height+"px";
		this.PV.style.width = this.width+"px";
	};
}

function Protocol(type) {

	this.type=type;
	this.id="";
	this.Rest=0;
	this.PV;
	this.dropable=false;
	this.Parent;
	this.width="";
	this.height="";
	this.widthCollap="";
	this.heightCollap="";
	this.collap=false;
	this.chincheta=false;

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

	Protocol.prototype.isChincheta = function(){
		return this.chincheta;
	};

	Protocol.prototype.getIdDrop = function() {
		if(this.dropable){		
			return "Drop"+this.id;
		}
		else{
			return false;
		}
	};

	Protocol.prototype.getResp=function() {
		return this.Rest;
	};

	Protocol.prototype.upResp=function() {
		this.Rest=this.Rest+1;
	}

	Protocol.prototype.isCollap=function() {
		return this.collap;
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
		/*if(this.Parent.getId()!="panelPrincipal")*/this.Parent.setSizeOrig();
		this.Parent.removeChild(this);
		delete this;
	};

	Protocol.prototype.getPV=function() {
		return this.PV;
	};

	Protocol.prototype.setPV=function(PV) {
		this.PV = PV;
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
		console.log("Parent: "+this.Parent.getId());
		/*if(this.Parent.getId()!="panelPrincipal"){*/
		this.Parent.setModSize(this.PV);
		/*}*/
	};

	Protocol.prototype.stop=function(){
		if(this.chincheta){
			//this.PV.setAttribute("draggable","true");
			this.chincheta=false;
		}else{
			//this.PV.setAttribute("draggable","false");
			this.chincheta=true;
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
		this.PV.lastChild.lastChild.appendChild(Child.getPV());
	};

	ProtocolDrop.prototype.removeChild = function(Child){
			delete this.Children[Child.getId()];
	};

	ProtocolDrop.prototype.setModSize = function(elementHTML){
		var height = elementHTML.offsetHeight;
		var width = elementHTML.offsetWidth;

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

		/*if(this.Parent.getId()!="panelPrincipal"){*/
			this.Parent.setModSize(this.PV);
		/*}*/
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

		/*if(this.Parent.getId()!="panelPrincipal"){*/
			this.Parent.setModSize(this.PV);
		/*}*/

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
		console.log("Parent: "+this.Parent.getId());
		/*if(this.Parent.getId()!="panelPrincipal"){*/
		this.Parent.setModSize(this.PV);
		/*}*/
	};

	ProtocolDrop.prototype.remove=function(){
		this.Parent.removeChild(this);
		/*if(this.Parent.getId()!="panelPrincipal")*/this.Parent.setSizeOrig();
		for(child in this.Children){
			elemet=this.Children[child];
			elemet.remove();
			delete this.Children[elemet.id]
			delete parentinations[elemet.getId()];
		}
		delete this;
	};
	
}

function Packet(idPack){

	ProtocolDrop.call(this,"Packet",true);
	this.idPack=idPack;
	this.Modal;

	Packet.prototype.newPV=function() {

		var form = document.createElement("form");

		this.dropin={"Ethernet":"Ethernet","IP":"IP","ARP":"ARP"};

		this.PV = document.createElement("div");
		this.PV.id = "Packetnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;
		//console.log("PUSS "+this.id);

		this.PV.classList.add("PacketNew");

		this.Modal = document.createElement("div");
		this.Modal.setAttribute("class","modal fade");
		this.Modal.setAttribute("role","dialog");
		this.Modal.id="modal"+this.id;
		this.Modal.innerHTML="<div class='modal-dialog modal-lg'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal'>&times;</button><h4 class='modal-title'>Graphical "+this.id+"</h4></div><div id='modalBody"+this.id+"' class='modal-body'></div><div class='modal-footer'><a id='buttonDown"+this.id+"' type='button' class='btn btn-default' href='' download=''>Download</a><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div></div>"
			
		var header = document.createElement("header");
		header.id="header"+this.id;
		header.classList.add("col-xs-12");
		header.setAttribute("ondragstart", "drag(event)");
		header.setAttribute("onmouseover", "topEleme(this.parentNode)");
		header.setAttribute("draggable","true");
			
		header.innerHTML="<div class='col-xs-3'>Packet:"+this.idPack+"</div><img id='load"+this.id+"' class='col-xs-1 col-xs-offset-4 load'><a type='button' id='"+this.id+"buttonMinimax' onclick='minimax(this)' class='col-xs-1 mini'><a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'><a class='col-xs-1 remove' type='button' id='remove' class='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>"
		header.appendChild(this.Modal);
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"</div class='col-xs-12' id='formula'><div>"

		form.id="Form"+this.id
		form.setAttribute("class","form-horizontal col-xs-12");
		form.setAttribute("role","form");
		form.setAttribute("method","post");
		form.setAttribute("onsubmit","SubmitPrin(this,event)");
		form.style.height="100%";
		form.style.width="100%";
    	
    	var select = document.createElement("select");

		for(var item in iface) {
  			var option = document.createElement("option");
  			option.value= item;
  			option.text= item;
  			select.add(option);
		}

		select.setAttribute("class","col-xs-4 col-xs-offset-1");
		select.setAttribute("name","interfaz");

		form.innerHTML=" <input type='hidden' name='pk' value="+this.id+"><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><label class='col-xs-4'>Respuesta</label><input class='col-xs-1 col-xs-offset-1' type='checkbox' name='recur' value='True'><input class='col-xs-4 col-xs-offset-3' type='text' placeholder='NºPaquetes' name='npack'></input></div><div class='form-group col-xs-12'>"+select.outerHTML+"<button type='button' class='col-xs-2 col-xs-offset-1' onclick='loadModal(\""+this.Modal.id+"\",\""+this.id+"\",event);'>Graf</button><input class='col-xs-3 col-xs-offset-1' type='submit' id='buttonSubmit"+this.id+"' value='Send'></input></div></div>";
		
		this.drop = document.createElement("div");
		this.drop.id="Drop"+this.id;
		this.drop.setAttribute("class","drop");
		this.drop.addEventListener('dragover', allowDrop, false);
		this.drop.addEventListener('dragenter',enter, false);
		this.drop.addEventListener('drop',function(e){drop(e,false)}, false);
		this.idDrop=this.drop.id;
		form.appendChild(this.drop);
		this.PV.lastChild.appendChild(form);
		
	};

	Packet.prototype.collapse=function(){

		if(isEmpty(this.Children)){
			if(this.collap){
				this.PV.style.height=this.height+"px";
				this.PV.style.width=this.width+"px";
				this.collap=false;
			}
			else{
				//console.log(this.heightCollap);
				this.PV.style.height=35+"px";
				this.PV.style.width=260+"px";
				this.collap=true;
			}
		}else{
			for(child in this.Children){
				elemet=this.Children[child];
				if(this.collap){
					this.PV.style.height=(35+this.heightCollap)+elemet.getPV().offsetHeight+10+"px";
					this.PV.style.width=elemet.getPV().offsetWidth+37+"px";
					this.collap=false;
				}
				else{
					this.PV.style.height=35+"px";
					this.PV.style.width=260+"px";
					this.collap=true;
				}
			}
		}
		this.Parent.setModSize(this.PV);
	};

	Packet.prototype.addChild = function(Child){
		this.Children[Child.getId()] = Child;
		this.PV.lastChild.lastChild.lastChild.appendChild(Child.getPV());
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
		
		var header = createHeader(this.type,this.id);

		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><label class='col-xs-2' for='SCR'>src: </label><input class='col-xs-4' type='text' name='srcEther'></input><label class='col-xs-2' for='dst'>dst: </label><input class='col-xs-4' type='text' name='dstEther'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='type'>type: </label><input class='col-xs-4' type='text' name='typeEther'></input></div></div></div>";

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function ARP() {

	Protocol.call(this,"ARP",true);

	ARP.prototype.newPV=function() {

		this.PV = document.createElement("div");
		this.PV.id = "ARPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = createHeader(this.type,this.id);
		this.PV.classList.add("ARPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><label class='col-xs-2' for='HLEN'>HLEN:</label><input class='col-xs-2' type='text' name='hwlenARP'></input><label class='col-xs-2' for='dst'>PLEN: </label><input class='col-xs-2' type='text' name='plenARP'></input><label class='col-xs-2' for='Operacion'>Oper: </label><input class='col-xs-2' type='text' name='opARP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='THW'>THW: </label><input class='col-xs-4' type='text' name='hwtyARP'></input><label class='col-xs-2' for='TPRO'>TPro:</label><input class='col-xs-4' type='text' name='ptyARP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='hwsrc'>HW scr: </label><input class='col-xs-4' type='text' name='hwsrcARP'></input><label class='col-xs-2' for='IPsrc'>IP src: </label><input class='col-xs-4' type='text' name='psrcARP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='hwdst'>HW dst: </label><input class='col-xs-4' type='text' name='hwdstARP'></input><label class='col-xs-2' for='IPdst'>IP dst: </label><input class='col-xs-4' type='text' name='pdstARP'></input></div></div></div>"
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

		var header = createHeader(this.type,this.id);
		this.PV.classList.add("IPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><label class='col-xs-2' for='VER'>VER: </label><input class='col-xs-2' type='text' name='VERIP'></input><label class='col-xs-2' for='HLEN'>HLEN: </label><input class='col-xs-2' type='text' name='HLENIP'></input><label class='col-xs-2' for='SER'>T.ser: </label><input class='col-xs-2' type='text' name='SERVIP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='LENG'>Len: </label><input class='col-xs-2' type='text' name='LOGIP'></input><label class='col-xs-2' for='id'>id: </label><input class='col-xs-2' type='text' name='IdenIP'></input><label class='col-xs-2' for='OFRAG'>OfFrag: </label><input class='col-xs-2' type='text' name='OffFraIP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='FLAGS'>Flags: </label><input class='col-xs-2' type='text' name='FlagsIP'><label class='col-xs-2' for='TTL'>TTL: </label></input><input class='col-xs-2' type='text' name='TTLIP'></input><label class='col-xs-2' for='Protocol'>Proto: </label><input class='col-xs-2' type='text' name='ProIP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='Checksum'>Csum: </label><input class='col-xs-4' type='text' name='CheckIP'></input><label class='col-xs-2' for='Options'>Opt: </label><input class='col-xs-4' type='text' name='OpcionesIP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='src'>src: </label><input class='col-xs-4' type='text' name='srcIP'></input><label class='col-xs-2' for='dst'>dst: </label><input class='col-xs-4' type='text' name='dstIP'></input></div></div></div>"

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

		var header = createHeader(this.type,this.id);
		this.PV.classList.add("ICMPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><label class='col-xs-2' for='type'>Type: </label><input class='col-xs-2' type='text' name='typeICMP'></input><label class='col-xs-2' for='code'>Code: </label><input class='col-xs-2' type='text' name='codeICMP'></input><label class='col-xs-2' for='checksum'>Csum: </label><input class='col-xs-2' type='text' name='checkICMP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='tsori'>TSori: </label><input class='col-xs-2' type='text' name='tsoriICMP'></input><label class='col-xs-2' for='TSrv'>TSrv: </label><input class='col-xs-2' type='text' name='tsrxICMP'></input><label class='col-xs-2' for='TStr'>TStr: </label><input class='col-xs-2' type='text' name='tstxICMP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='id'>id: </label><input class='col-xs-4' type='text' name='idenICMP'></input><label class='col-xs-2' for='VER'>Nseq: </label><input class='col-xs-4' type='text' name='nseqICMP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='DicMas'>Dic Mas: </label><input class='col-xs-4' type='text' name='addrmaskICMP'></input></div></div></div>"
	};
}

function TCP() {

	ProtocolDrop.call(this,"TCP",true);

	TCP.prototype.newPV=function() {

		this.dropin={"DATA":"DATA"};

		this.PV = document.createElement("div");
		this.PV.id = "TCPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = createHeader(this.type,this.id);
		this.PV.classList.add("TCPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><label class='col-xs-2' for='portsrc'>Port src: </label><input class='col-xs-4' type='text' name='srcportTCP'></input><label class='col-xs-2' for='portdst'>Port dst: </label><input class='col-xs-4' type='text' name='dstportTCP'></input></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='type'>Nº seq: </label><input class='col-xs-4' type='text' name='sequennTCP'><label class='col-xs-2' for='type'>Nº ACK: </label><input class='col-xs-4' type='text' name='ackTCP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='type'>Offst: </label><input class='col-xs-2' type='text' name='offsetTCP'></input><label class='col-xs-2' for='rvd'>Rvd: </label><input class='col-xs-2' type='text' name='reserdTCP'></input><label class='col-xs-2' for='flag'>Flag: </label><input class='col-xs-2' type='text' name='flagTCP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='windows'>Wind: </label><input class='col-xs-4' type='text' name='windTCP'></input><label class='col-xs-2' for='Chsum'>Csum: </label><input class='col-xs-4' type='text' name='checkTCP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='windows'>Urgent Poin: </label><input class='col-xs-4' type='text' name='urgpoTCP'></input><label class='col-xs-2' for='windows'>Opts: </label><input class='col-xs-4' type='text' name='OpTCP'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function UDP() {

	ProtocolDrop.call(this,"UDP",true);

	UDP.prototype.newPV=function() {

		this.dropin={"DATA":"DATA","RIP":"RIP"};

		this.PV = document.createElement("div");
		this.PV.id = "UDPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = createHeader(this.type,this.id);
		this.PV.classList.add("UDPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><label class='col-xs-2' for='portsrc'>Port src: </label><input class='col-xs-4' type='text' name='sportUDP'></input><label class='col-xs-2' for='portdst'>Port dst: </label><input class='col-xs-4' type='text' name='dportUDP'></input></div><div class='form-group col-xs-12'><label class='col-xs-2' for='len'>Len: </label><input class='col-xs-4' type='text' name='lenUDP'></input><label class='col-xs-2' for='csum'>Csum: </label><input class='col-xs-4' type='text' name='checkUDP'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function RIP() {

	ProtocolDrop.call(this,"RIP",true);

	RIP.prototype.newPV=function() {

		this.dropin={"DATARIP":"DATARIP"};

		this.PV = document.createElement("div");
		this.PV.id = "RIPnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = createHeader(this.type,this.id);
		this.PV.classList.add("RIPNew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><label class='col-xs-2' for='Command'>Cmd: </label><input class='col-xs-4' type='text' name='cmdRIP'></input><label class='col-xs-2' for='version'>Ver: </label><input class='col-xs-4' type='text' name='verRIP'></input></div></div></div>"

		var drop = createDrop(this.id)
		
		this.PV.appendChild(drop);
		this.drop=drop.firstChild;
		this.idDrop=this.drop.id;
	};

}

function DATA() {

	Protocol.call(this,"DATA",true);

	DATA.prototype.newPV=function() {

		this.PV = document.createElement("div");
		this.PV.id = "DATAnew"+contElement;
		contElement=contElement+1;
		this.id=this.PV.id;

		var header = createHeader(this.type,this.id);
		this.PV.classList.add("DATANew");
		this.PV.appendChild(header);
		this.PV.innerHTML=this.PV.innerHTML+"<div class='collapse in' id='"+this.id+"collap'><div class='col-xs-12' id='"+this.id+"collapElement'><div class='form-group col-xs-12'></div><div class='form-group col-xs-12'><textarea class='col-xs-12' rows='4' name='dat' style='resize:none;'></textarea></div></div></div>"
	};
}


function createElement(idSrt,parent) {
	var newElement;
	//console.log("Creo Capa")
	//console.log(idSrt);
	//console.log(parent);
	switch(idSrt.split("/")[0]) {
		case "Packet":
			
			if(idSrt.split("/")[1]!=undefined){
				//console.log(idSrt);
				//console.log(idSrt.split("/")[1]);
				newElement = new Packet(idSrt.split("/")[1]);
			}
			else{
				newElement = new Packet(nPack);
				nPack=nPack+1;
			}
			break;
    	case "Ethernet":
    		newElement = new Ethernet();
    		break;
    	case "ARP":
    		newElement = new ARP();
    		break;
    	case "IP":
    		newElement = new IP();
    		break;
    	case "ICMP":
    		newElement = new ICMP();
    		break;
    	case "TCP":
    		newElement = new TCP();
    		break;
    	case "UDP":
    		newElement = new UDP();
    		break;
    	case "RIP":
    		newElement = new RIP();
    		break;
    	case "DATA":
    		newElement = new DATA();
    		break;
	}
	newElement.newPV();
	/*newElement.setParent(parent);*/
	//parent.getPV().appendChild(newElement.getPV());
	parent.addChild(newElement);
	//console.log(findObj(parent.id));
	newElement.setParent(parent);
	parentinations[newElement.getId()]=newElement;
	newElement.setWH(newElement.getPV().offsetWidth,newElement.getPV().offsetHeight);
	newElement.setWHCollap(document.getElementById(newElement.getId()+"collapElement").offsetWidth,document.getElementById(newElement.getId()+"collapElement").offsetHeight);
	if(newElement.isDropable())newElement.iniDropWH();
	if(parent.getId()!="panelPrincipal")parent.setModSize(newElement.getPV());

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
	divDropVis.addEventListener('dragenter',enter, false);
	divDropVis.addEventListener('drop',function(e){drop(e,false)}, false);
	divDrop.appendChild(divDropVis);

	return divDrop;
}

function createHeader(label, id) {

	var header =document.createElement("header");
	header.id="header"+id;
	header.classList.add("col-xs-12");
	header.setAttribute("ondragstart", "drag(event)");
	header.setAttribute("onmouseover", "topEleme(this.parentNode)");
	header.setAttribute("draggable","true");
		
	header.innerHTML="<div class='col-xs-3'>"+label+"</div> <input type='hidden' name='"+label+"' value='True'><a type='button' id='"+id+"buttonCollap' data-toggle='collapse' data-target='#"+id+"collap' onclick='collapseElement(this)' class='col-xs-1 col-xs-offset-4 collap'><a type='button' id='clonar' onclick='clonar(\""+id+"\")' class='col-xs-1 clonar'><a type='button' id='chincheta' onclick='chincheta(this)' class='col-xs-1 chincheta'><input type='hidden' name='Ether' value='True'><a class='col-xs-1 remove' type='button' id='remove' onclick='removeElement(this.parentNode.parentNode)' align-text='center'></a>";
	return header;
}

function isEmpty(obj) {
  for(var i in obj) { return false; }
  return true;
}



ProtocolDrop.prototype = new Protocol();

Packet.prototype = new ProtocolDrop();

Ethernet.prototype = new ProtocolDrop();

IP.prototype = new ProtocolDrop();

TCP.prototype = new ProtocolDrop();

UDP.prototype = new ProtocolDrop();

ICMP.prototype = new Protocol();

DATA.prototype = new Protocol();

RIP.prototype = new ProtocolDrop();

ARP.prototype = new Protocol();