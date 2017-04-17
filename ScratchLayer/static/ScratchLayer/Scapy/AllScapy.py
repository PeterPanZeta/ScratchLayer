
from scapy.all import *

def main(petition):

	packetDf=None
	
	error=False
	messageError={}

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
			if (packetDf!= None):
				ls(packetDf)
				send(packetDf)
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
