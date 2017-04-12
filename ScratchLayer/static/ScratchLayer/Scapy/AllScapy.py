
from scapy.all import *

def main(petition):

	packetSc=None
	
	error=False
	messageError="Se han detectado los siguientes errores: "

	if(petition.POST.get("pk",None) != None):

		if(petition.POST.get("Ether",None) != None):
			
			dstEther=None
			srcEther=None
			typeEther=None

			if((petition.POST.get("dstEther",None) != None) and (not parseMac(petition.POST.get("dstEther",None)))):
				
				error = True
				messageError = messageError+"El campo dst, perteneciente a Ethernet no es correcto"

			else:
				dstEther=petition.POST.get("dstEther",None)


			if((petition.POST.get("srcEther",None) != None) and (not parseMac(petition.POST.get("srcEther",None)))):

				error=True
				messageError = messageError+"El campo src, perteneciente a Ethernet no es correcto"

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
			return messageError
		else:
			if (packetSc!= None):
				send(packetSc)
				return "Send Packet"
			else:
				return "El paquete esta vacio"

def parseIP(ip):

	parses = ip.split(".")

	if(len(parses) == 4):
		for parse in parses:
			if(parse.isdigit() == False):
				return False

	return True

def parseMac(mac):

	value=False

	parses = mac.split(":")

	if(len(parses) == 6):
		value=True

	return value
