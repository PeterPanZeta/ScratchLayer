
from scapy.all import *

def function():
	pass

def main(petition):

	packet=None

	if(petition.POST.get("pk",None) != None):

		if(petition.POST.get("Ether",None) != None):
			None
		if(petition.POST.get("ARP",None) != None):
			None
		else:
			if(petition.POST.get("IP",None) != None):

				packet=packet/IP(dst=petition.POST.get("dstIP",None))/ICMP()

				if(petition.POST.get("ICMP",None) != None):
					None
				if(petition.POST.get("RIP",None) != None):
					None
				if(petition.POST.get("TCP",None) != None):
					None
				if(petition.POST.get("UDP",None) != None):
					None
		send(ehter)
	else:
		None


def parseIP(ip):
	None