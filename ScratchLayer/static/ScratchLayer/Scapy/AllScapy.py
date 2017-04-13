
from scapy.all import *

def main(petition):

	packetSc=None
	
	error=False
	messageError={}

	if(petition.POST.get("pk",None) != None):

		if(petition.POST.get("Ether",None) != None):
			
			dstEther=None
			srcEther=None
			typeEther=None

			if((petition.POST.get("dstEther",None) != None and petition.POST.get("dstEther",None)!= "") and (not parseMac(petition.POST.get("dstEther",None)))):
				
				error = True
				messageError["dstEther"] = "El campo dst perteneciente a Ethernet no es correcto"

			else:
				dstEther=petition.POST.get("dstEther",None)


			if((petition.POST.get("srcEther",None) != None and petition.POST.get("srcEther",None)!= "") and (not parseMac(petition.POST.get("srcEther",None)))):

				error=True
				messageError["srcEther"] = "El campo src perteneciente a Ethernet no es correcto"

			else:
				srcEther=petition.POST.get("srcEther",None)

			if(petition.POST.get("typeEther",None) != None):
				typeEther=petition.POST.get("typeEther",None)

			if( not error):
				packetSc = Ether(src=srcEther,dst=dstEther,type=typeEther)
				
		if(petition.POST.get("ARP",None) != None):
			None
		else:
			if(petition.POST.get("IP",None) != None):

				packetSc=packetSc/IP(dst=petition.POST.get("dstIP",None))/ICMP()

				if(petition.POST.get("ICMP",None) != None):
					None
				else:
					if(petition.POST.get("RIP",None) != None):
						None
					if(petition.POST.get("TCP",None) != None):
						None
					if(petition.POST.get("UDP",None) != None):
						None

		if(error):
			print messageError
			return {
					'error':True,
					'message': messageError
			}
		else:
			if (packetSc!= None):
				ls(packetSc)
				#send(packetSc)
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
			if(not parse.isdigit() or parse > 255 or parse < 0):
				return False

	return True

def parseMac(mac):

	hexa = ["1","2","3","4","5","6","7","8","9","a","A","b","B","c","C","d","D","e","E","f","F"]
	contador=0
	value=False

	parses = mac.split(":")

	if(len(parses) == 6):
		
		for parse in parses:
			if(len(parse) == 2):
				for let in parse:
					if let in hexa:
						contador=contador+1

	if(contador==12):
		value=True

	return value
