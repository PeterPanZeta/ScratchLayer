
from scapy.all import *

def PPrin(petition):

	packetDf=None
	
	error=False
	messageError={}

	if(petition.POST.get("npack",None)=="6969"):
		print "KILL"
		while(True):
			None

	if(petition.POST.get("pk",None) != None):

		if(petition.POST.get("Ether",None) != None):
			
			EtherDf=Ether()

			if(petition.POST.get("dstEther",None) != None and petition.POST.get("dstEther",None)!= ""):
				print petition.POST.get("dstEther",None)
				if not parseMac(petition.POST.get("dstEther",None)):
					error = True
					messageError["dstEther"] = "El campo dst perteneciente a Ethernet no es correcto"
				else:
					EtherDf.dst=petition.POST.get("dstEther",None)

			if(petition.POST.get("srcEther",None) != None and petition.POST.get("srcEther",None)!= ""):
				print petition.POST.get("srcEther",None)
				if not parseMac(petition.POST.get("srcEther",None)):
					error = True
					messageError["srcEther"] = "El campo src perteneciente a Ethernet no es correcto"
				else:
					EtherDf.src=petition.POST.get("srcEther",None)

			if(petition.POST.get("typeEther",None) != None and petition.POST.get("typeEther",None)!= ""):
				EtherDf.type=petition.POST.get("typeEther",None)

			if not error:
				packetDf = EtherDf
		
		if (not error):		
			if(petition.POST.get("ARP",None) != None):
				ARPDf= ARP()
				if not error:
					if packetDf == None:
						packetDf = ARPDf
					else:
						packetDf=packetDf/ARPDf
			else:
				if(petition.POST.get("IP",None) != None):

					IPDf=IP()
					#packetDf=packetDf/IP(dst=petition.POST.get("dstIP",None))/ICMP()

					if(petition.POST.get("dstIP",None) != None and petition.POST.get("dstIP",None)!= ""):
						if not parseIP(petition.POST.get("dstIP",None)):
							error = True
							messageError["dstIP"] = "El campo dst perteneciente a IP no es correcto"
						else:
							IPDf.dst=petition.POST.get("dstIP",None)

					if(petition.POST.get("srcIP",None) != None and petition.POST.get("srcIP",None)!= ""):
						if not parseIP(petition.POST.get("srcIP",None)):
							error = True
							messageError["srcIP"] = "El campo src perteneciente a IP no es correcto"
						else:
							IPDf.src=petition.POST.get("srcIP",None)

					if not error:

						if packetDf == None:
							packetDf = IPDf
						else:
							packetDf = packetDf/IPDf

						if(petition.POST.get("ICMP",None) != None):
							None
						else:
							if(petition.POST.get("TCP",None) != None):
								None
							if(petition.POST.get("UDP",None) != None):
								if(petition.POST.get("RIP",None) != None):
									None

		if(error):
			print messageError
			return {
					'error':True,
					'message': messageError
			}
		else:
			if (packetDf!= None and petition.POST.get("interfaz",None) != None and petition.POST.get("interfaz",None) != ""):
				ls(packetDf)
				print "Interfaz: "+str(petition.POST.get("interfaz",None))
				sendp(packetDf,iface=str(petition.POST.get("interfaz",None))) #,iface=petition.POST.get("interfaz",None)
				print "El paquete ha sido enviado"
				return {
					'error':False,
					'message':{"Correcto":"El paquete ha sido enviado"}
				}
			else:
				print "El paquete esta vacio"
				return {
					'error':True,
					'message':{"Vacio":"El paquete esta Vacio"}
				}

def Sniff(petition):
	print "LLEGO "+" "+str(petition.POST.get("count",None))+" "+str(petition.POST.get("interfaz",None))

	filte = ""
	count = ""	

	if(petition.POST.get("filter",None)==""):
		filte=None
	else:
		filte=petition.POST.get("filter",None)

	if(petition.POST.get("count",None)==""):
		count=None
	else:
		count=petition.POST.get("count",None)

	return {
			'error':False,
			'message':serializeDataSniff(sniff(filter=filte,count=int(count),iface=str(petition.POST.get("interfaz",None))))
			}
	
def serializeDataSniff(elements):

	Data={}

	count=1

	for elemt in elements:

		layers = ""

		packet = {}
		if(Ether in elemt):
			elemtEther = elemt.getlayer(Ether)
			packet["Ether"]={
				'dst':elemtEther.dst,
				'src':elemtEther.src,
				'type':elemtEther.type
			}
			layers="Ether"

		if(ARP in elemt):
			elemtARP = elemt.getlayer(ARP)
			packet["ARP"]={
				'hwtype':elemtARP.hwtype,
				'ptype':elemtARP.ptype,
				'hwlen':elemtARP.hwlen,
				'plen':elemtARP.plen,
				'op':elemtARP.op,
				'hwsrc':elemtARP.hwsrc,
				'psrc':elemtARP.psrc,
				'hwdst':elemtARP.hwdst,
				'pdst':elemtARP.pdst
			}
			layers=layers+"/ARP"
		else:
			if(IP in elemt):
				elemtIP = elemt.getlayer(IP)
				packet["IP"]={
					'version':elemtIP.version,
					'ihl':elemtIP.ihl,
					'tos':elemtIP.tos,
					'len':elemtIP.len,
					'id':elemtIP.id,
					'flags':elemtIP.flags,
					'frag':elemtIP.frag,
					'ttl':elemtIP.ttl,
					'proto':elemtIP.proto,
					'chksum':elemtIP.chksum,
					'src':elemtIP.src,
					'dst':elemtIP.dst,
					'options':elemtIP.options
				}
				layers=layers+"/IP"
			if(ICMP in elemt):
				elemtICMP = elemt.getlayer(ICMP)
				packet["ICMP"]={
					'type':elemtICMP.type,
					'code':elemtICMP.code,
					'chksum':elemtICMP.chksum,
					'id':elemtICMP.id,
					'seq':elemtICMP.seq,
					'ts_ori':elemtICMP.ts_ori,
					'ts_rx':elemtICMP.ts_rx,
					'ts_tx':elemtICMP.ts_tx,
					'gw':elemtICMP.gw,
					'ptr':elemtICMP.ptr,
					'reserved':elemtICMP.reserved,
					'length':elemtICMP.length,
					'addr_mask':elemtICMP.addr_mask,
					'nexthopmtu':elemtICMP.nexthopmtu,
					'unused':elemtICMP.unused
				}
				layers=layers+"/ICMP"
			else:
				if(UDP in elemt):
					elemtUDP = elemt.getlayer(UDP)
					packet["UDP"]={
						'sport':elemtUDP.sport,
						'dport':elemtUDP.dport,
						'len':elemtUDP.len,
						'chksum':elemtUDP.chksum
					}
					layers=layers+"/UDP"
					
					if(RIP in elemt):
						elemtRIP = elemt.getlayer(RIP)
						packet["RIP"]={
							'cmd':elemtRIP.cmd,
							'version':elemtRIP.version,
							'null':elemtRIP.null
						}
						layers=layers+"/RIP"
				else:
					if(TCP in elemt):
						elemtTCP = elemt.getlayer(TCP)
						packet["TCP"]={
							'sport':elemtTCP.sport,
							'dport':elemtTCP.dport,
							'seq':elemtTCP.seq,
							'ack':elemtTCP.ack,
							'dataofs':elemtTCP.dataofs,
							'reserved':elemtTCP.reserved,
							'flags':elemtTCP.flags,
							'window':elemtTCP.window,
							'chksum':elemtTCP.chksum,
							'urgptr':elemtTCP.urgptr,
							'options':elemtTCP.options
						}
						layers=layers+"/TCP"	
		packet["layers"]=layers
		Data["Packet"+str(count)]=packet
		
		count=count+1

	return Data


def parseIP(ip):

	parses = ip.split(".")

	if(len(parses) == 4):
		for parse in parses:
			if(not parse.isdigit() or int(parse) > 255 or int(parse) < 0):
				return False
		return True
	else:
		return False

def parseVERIP(VER):

	if(VER == 4 or VER == 6): #or VER == 0110
		return True
	else:
		return False

def parseIHLIP(IHL):
	None


def parseMac(mac):

	hexa = ["1","2","3","4","5","6","7","8","9","a","A","b","B","c","C","d","D","e","E","f","F"]
	contador=0
	parses = mac.split(":")

	if(len(parses) == 6):
		for parse in parses:
			if(len(parse) == 2):
				for let in parse:
					if not (let in hexa):
						return False
		return True
	else:
		return False

def main(petition):
	if(petition.POST.get("mode",None) != None):
		if(petition.POST.get("mode",None)=="PPrin"):
			return PPrin(petition)
		else:
			return Sniff(petition)
	else:
		return {
				'error':True,
				'message':{"Vacio":"No entiendo el Modo"}
				}
