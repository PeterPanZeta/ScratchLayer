# from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import Http404
from django.shortcuts import render

def index(request):
	return render(request,'ScratchLayer/index.html')
    #return HttpResponse("Hello, world. You're at the polls index.")

def prueba(request):
	return render(request,'ScratchLayer/prueba.html')